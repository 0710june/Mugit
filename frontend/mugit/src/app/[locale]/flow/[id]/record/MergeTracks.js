import * as Tone from "tone";

/**
 * 여러 오디오 파일을 하나로 합치는 함수
 * @param {Array<{ file: File, id: string, url: string }>} audioFiles - 합칠 오디오 파일 배열
 * @returns {Promise<string>} - 합쳐진 오디오 파일의 URL
 */
export const mergeTracks = async (audioFiles) => {
  try {
    // 모든 파일을 버퍼로 로드하고 각 파일의 길이를 측정
    const buffers = await Promise.all(
      audioFiles.map(async (audioFile) => {
        const arrayBuffer = await fetch(audioFile.url).then((res) =>
          res.arrayBuffer()
        );
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);
        return buffer;
      })
    );

    // buffers 배열이 비어있는지 확인
    if (buffers.length === 0) {
      throw new Error("No audio buffers loaded");
    }

    // 가장 긴 파일의 길이를 찾기 (reduce를 사용하지 않는 방식)
    let longestBuffer = buffers[0];
    for (const buffer of buffers) {
      if (buffer.duration > longestBuffer.duration) {
        longestBuffer = buffer;
      }
    }

    // 가장 긴 파일의 길이에 맞춰 OfflineAudioContext를 생성
    const context = new OfflineAudioContext(
      2,
      longestBuffer.duration * longestBuffer.sampleRate,
      longestBuffer.sampleRate
    );

    // 각 버퍼를 연결하고 재생할 수 있도록 설정
    buffers.forEach((buffer) => {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0); // 모든 버퍼를 동시에 재생
    });

    // 렌더링하여 합성된 오디오를 생성
    const renderedBuffer = await context.startRendering();

    // 합성된 오디오를 Blob으로 변환하여 URL 생성
    const wavBlob = bufferToWave(renderedBuffer);
    const url = URL.createObjectURL(wavBlob);
    return url;
  } catch (error) {
    console.error("Error merging tracks:", error);
    throw error;
  }
};

/**
 * AudioBuffer를 WAV 파일로 변환하는 함수
 * @param {AudioBuffer} buffer - 변환할 AudioBuffer
 * @returns {Blob} - 변환된 WAV 파일
 */
const bufferToWave = (buffer) => {
  const numOfChan = buffer.numberOfChannels,
    length = buffer.length * numOfChan * 2 + 44,
    bufferArray = new ArrayBuffer(length),
    view = new DataView(bufferArray),
    channels = [],
    sampleRate = buffer.sampleRate,
    blockAlign = numOfChan * 2;

  let offset = 0,
    pos = 0;

  // RIFF identifier
  setUint32(0x46464952);
  // file length minus RIFF identifier length and file description length
  setUint32(length - 8);
  // RIFF type
  setUint32(0x45564157);

  // format chunk identifier
  setUint32(0x20746d66);
  // format chunk length
  setUint32(16);
  // sample format (raw)
  setUint16(1);
  // channel count
  setUint16(numOfChan);
  // sample rate
  setUint32(sampleRate);
  // byte rate (sample rate * block align)
  setUint32(sampleRate * blockAlign);
  // block align (channel count * bytes per sample)
  setUint16(blockAlign);
  // bits per sample
  setUint16(16);

  // data chunk identifier
  setUint32(0x61746164);
  // data chunk length
  setUint32(length - pos - 4);

  // write interleaved data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      // interleave channels
      const sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      // scale to 16-bit signed integer
      view.setInt16(pos, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      pos += 2;
    }
    offset++; // next source sample
  }

  return new Blob([bufferArray], { type: "audio/wav" });

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
};
