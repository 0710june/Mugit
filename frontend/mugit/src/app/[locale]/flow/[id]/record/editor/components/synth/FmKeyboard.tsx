import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";
import Waveform from "./Waveform";
import RecordButton from "./RecordButton";
import { useRouter } from "next/navigation";

const audioContext = new (window.AudioContext ||
  (window as any).webkitAudioContext)();

interface Voice {
  carrierOsc: OscillatorNode;
  modulatorOsc: OscillatorNode;
  modulationGain: GainNode;
  outputGain: GainNode;
}

const createVoice = (analyser: AnalyserNode): Voice => {
  const carrierOsc = audioContext.createOscillator();
  carrierOsc.type = "sine";

  const modulatorOsc = audioContext.createOscillator();
  modulatorOsc.type = "sine";

  const modulationGain = audioContext.createGain();
  modulatorOsc.connect(modulationGain);
  modulationGain.connect(carrierOsc.frequency);

  const outputGain = audioContext.createGain();
  outputGain.gain.value = 0;
  carrierOsc.connect(outputGain);
  outputGain.connect(analyser);

  carrierOsc.start();
  modulatorOsc.start();

  return {
    carrierOsc,
    modulatorOsc,
    modulationGain,
    outputGain,
  };
};

const playNote = (
  frequency: number,
  modulationFrequency: number,
  modulationDepth: number,
  duration: number,
  analyser: AnalyserNode
): Voice | null => {
  const voice = createVoice(analyser);
  const { carrierOsc, modulatorOsc, modulationGain, outputGain } = voice;

  carrierOsc.frequency.value = frequency;
  modulatorOsc.frequency.value = modulationFrequency;
  modulationGain.gain.value = modulationDepth;

  outputGain.gain.setValueAtTime(0.00001, audioContext.currentTime);
  outputGain.gain.exponentialRampToValueAtTime(
    1,
    audioContext.currentTime + duration / 1000
  );

  return voice;
};

const releaseNote = (voice: Voice, duration: number) => {
  const { carrierOsc, modulatorOsc, outputGain } = voice;
  outputGain.gain.cancelScheduledValues(audioContext.currentTime);
  outputGain.gain.setValueAtTime(1, audioContext.currentTime);
  outputGain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + duration / 1000
  );

  setTimeout(() => {
    carrierOsc.stop();
    modulatorOsc.stop();
    carrierOsc.disconnect();
    modulatorOsc.disconnect();
    outputGain.disconnect();
  }, duration + 100);
};

const FMKeyboard: React.FC = () => {
  const analyser = useRef(audioContext.createAnalyser());
  analyser.current.fftSize = 512 * 2;
  analyser.current.connect(audioContext.destination);

  const [modulationIndex, setModulationIndex] = useState(2);
  const [modulationDepth, setModulationDepth] = useState(50);
  const [duration, setDuration] = useState(100);
  const [instrument, setInstrument] = useState<"fm" | "piano" | "band">("fm");
  const router = useRouter();

  const pianoSampler = useRef(
    new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => {
        console.log("Piano samples loaded");
      },
    }).toDestination()
  );

  const bandSynth = useRef(new Tone.PolySynth(Tone.Synth).toDestination());

  const playNoteHandler = (frequency: number): Voice | null => {
    if (instrument === "fm") {
      return playNote(
        frequency,
        frequency * modulationIndex,
        modulationDepth,
        duration,
        analyser.current
      );
    } else if (instrument === "piano") {
      const midiFrequency = Tone.Frequency(frequency, "midi").toFrequency();
      pianoSampler.current.triggerAttackRelease(midiFrequency, "8n");
      return null;
    } else if (instrument === "band") {
      const midiFrequency = Tone.Frequency(frequency, "midi").toFrequency();
      bandSynth.current.triggerAttackRelease(midiFrequency, "8n");
      return null;
    }
    return null; // 명시적으로 null 반환
  };

  const releaseNoteHandler = (voice: Voice | null) => {
    if (instrument === "fm" && voice) {
      releaseNote(voice, duration);
    }
  };

  const randomizeFmParams = () => {
    setModulationIndex(Math.random() * 10);
    setModulationDepth(Math.random() * 200);
    setDuration(Math.random() * 1000);
  };

  const handleSaveRecording = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      router.push("/editor");
    }
  };

  useEffect(() => {
    const baseFrequency = 110;
    const numRows = 4;
    const numCols = 10;

    const noteFrequency = (row: number, col: number) => {
      const chord = [-8, 0, 4, 7];
      const scale = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16];
      const note = chord[row] + scale[col];
      return baseFrequency * Math.pow(2, note / 12);
    };

    const pianoRoll = document.getElementById("pianoRoll");
    const qwerty = "1234567890qwertyuiopasdfghjkl;zxcvbnm,./";
    const capsQwerty = "!@#$%^&*()QWERTYUIOPASDFGHJKL:ZXCVBNM<>?";

    if (!pianoRoll) return;

    // Clear existing buttons
    while (pianoRoll.firstChild) {
      pianoRoll.removeChild(pianoRoll.firstChild);
    }

    const createButton = (row: number, col: number) => {
      const button = document.createElement("button");
      const key = qwerty[(row * numCols + col) % qwerty.length];
      const capsKey = capsQwerty[(row * numCols + col) % capsQwerty.length];
      const frequency = noteFrequency(row, col);
      let note: Voice | null = null;

      button.textContent = key;
      button.className =
        "w-full h-32 border border-gray-400 bg-white cursor-pointer active:bg-blue-500 active:text-white";
      pianoRoll.appendChild(button);

      button.addEventListener("mousedown", (e) => {
        note = playNoteHandler(frequency * (e.shiftKey ? numRows : 1));
      });
      button.addEventListener("mouseup", () => {
        if (note) {
          releaseNoteHandler(note);
          note = null;
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === key || e.key === capsKey) {
          button.classList.add("active");
          if (!note) {
            note = playNoteHandler(frequency * (e.shiftKey ? numRows : 1));
          }
        }
      });
      document.addEventListener("keyup", (e) => {
        if (e.key === key || e.key === capsKey) {
          button.classList.remove("active");
          if (note) {
            releaseNoteHandler(note);
            note = null;
          }
        }
      });
    };

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        createButton(row, col);
      }
    }
  }, [modulationIndex, modulationDepth, duration, instrument]);

  return (
    <div className="relative flex flex-col items-center rounded-lg bg-gray-900 p-8 text-white shadow-lg">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="w-64">
          <label className="mb-2 block text-sm">Modulation index:</label>
          <input
            type="range"
            min="0.5"
            max="10"
            value={modulationIndex}
            step="0.5"
            onChange={(e) => setModulationIndex(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="w-64">
          <label className="mb-2 block text-sm">Modulation depth:</label>
          <input
            type="range"
            min="1"
            max="200"
            value={modulationDepth}
            step="1"
            onChange={(e) => setModulationDepth(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="w-64">
          <label className="mb-2 block text-sm">Attack/release:</label>
          <input
            type="range"
            min="100"
            max="1000"
            value={duration}
            step="10"
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          onClick={randomizeFmParams}
          className="rounded bg-blue-500 px-3 py-1 text-xs text-white"
        >
          Randomize
        </button>
      </div>
      <div className="mb-8">
        <label className="mb-2 block text-sm">Instrument:</label>
        <select
          value={instrument}
          onChange={(e) =>
            setInstrument(e.target.value as "fm" | "piano" | "band")
          }
          className="rounded bg-gray-800 p-2 text-white"
        >
          <option value="fm">FM Synth</option>
          <option value="piano">Piano</option>
          <option value="band">Band</option>
        </select>
      </div>
      <div
        id="pianoRoll"
        className="grid w-full max-w-5xl grid-cols-10 grid-rows-4 gap-2"
      ></div>
      <div className="absolute right-0 top-0 h-32 w-32">
        <Waveform analyser={analyser.current} />
      </div>
      <RecordButton onSave={handleSaveRecording} />
    </div>
  );
};

export default FMKeyboard;
