// // // components/Waveform.tsx

// // import React, { useEffect, useRef } from "react";
// // import WaveSurfer from "wavesurfer.js";

// // interface WaveformProps {
// //   analyser: AnalyserNode;
// // }

// // const Waveform: React.FC<WaveformProps> = ({ analyser }) => {
// //   const waveformRef = useRef<HTMLDivElement>(null);
// //   const wavesurferRef = useRef<WaveSurfer | null>(null);

// //   useEffect(() => {
// //     if (waveformRef.current) {
// //       wavesurferRef.current = WaveSurfer.create({
// //         container: waveformRef.current,
// //         waveColor: "violet",
// //         cursorColor: "transparent",
// //         barWidth: 2,
// //         interact: false,
// //       });
// //     }

// //     return () => {
// //       wavesurferRef.current?.destroy();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     const dataArray = new Float32Array(analyser.frequencyBinCount);

// //     const drawWaveform = () => {
// //       analyser.getFloatTimeDomainData(dataArray);
// //       if (wavesurferRef.current) {
// //         const float32Array = Array.from(dataArray);
// //         wavesurferRef.current.load("", [float32Array]);
// //       }
// //     };

// //     const animate = () => {
// //       requestAnimationFrame(animate);
// //       drawWaveform();
// //     };

// //     animate();
// //   }, [analyser]);

// //   return <div ref={waveformRef} />;
// // };

// // export default Waveform;

// import React, { useRef, useEffect } from "react";
// import * as p5 from "p5";

// interface WaveformProps {
//   analyser: AnalyserNode;
// }

// const Waveform: React.FC<WaveformProps> = ({ analyser }) => {
//   const canvasRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const sketch = (p: p5) => {
//       let dataArray: Uint8Array;
//       let bufferLength: number;

//       p.setup = () => {
//         p.createCanvas(800, 200).parent(canvasRef.current!);
//         analyser.fftSize = 2048;
//         bufferLength = analyser.frequencyBinCount;
//         dataArray = new Uint8Array(bufferLength);
//       };

//       p.draw = () => {
//         analyser.getByteTimeDomainData(dataArray);
//         p.background(0);
//         p.stroke(255);
//         p.noFill();
//         p.beginShape();
//         for (let i = 0; i < bufferLength; i++) {
//           const x = (i / bufferLength) * p.width;
//           const y = (dataArray[i] / 255.0) * p.height;
//           p.vertex(x, y);
//         }
//         p.endShape();
//       };
//     };

//     const p5Instance = new p5(sketch);
//     return () => p5Instance.remove();
//   }, [analyser]);

//   return <div ref={canvasRef}></div>;
// };

// export default Waveform;

import React, { useRef, useEffect } from "react";
import p5 from "p5";

interface WaveformProps {
  analyser: AnalyserNode;
}

const Waveform: React.FC<WaveformProps> = ({ analyser }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let dataArray: Uint8Array;
      let bufferLength: number;

      p.setup = () => {
        p.createCanvas(128, 128).parent(canvasRef.current!);
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
      };

      p.draw = () => {
        analyser.getByteTimeDomainData(dataArray);
        p.background(0);
        p.stroke(255);
        p.noFill();
        p.beginShape();
        for (let i = 0; i < bufferLength; i++) {
          const x = (i / bufferLength) * p.width;
          const y = (dataArray[i] / 255.0) * p.height;
          p.vertex(x, y);
        }
        p.endShape();
      };
    };

    const p5Instance = new p5(sketch);
    return () => p5Instance.remove();
  }, [analyser]);

  return <div ref={canvasRef}></div>;
};

export default Waveform;
