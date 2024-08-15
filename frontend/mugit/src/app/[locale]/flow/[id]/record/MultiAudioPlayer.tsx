import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  Ref,
} from "react";
import * as Tone from "tone";

interface AudioFile {
  file: File;
  id: string;
  url: string;
}

interface MultiAudioPlayerProps {
  audioFiles: AudioFile[];
}

const MultiAudioPlayer = forwardRef(
  (props: MultiAudioPlayerProps, ref: Ref<any>) => {
    const { audioFiles } = props;
    const [players, setPlayers] = useState<Record<string, Tone.Player>>({});

    useEffect(() => {
      const newPlayers: Record<string, Tone.Player> = {};

      audioFiles.forEach((file, index) => {
        const player = new Tone.Player(file.url).toDestination();
        newPlayers[`player${index}`] = player;
      });

      setPlayers(newPlayers);

      // Cleanup on unmount
      return () => {
        Object.values(newPlayers).forEach((player) => player.dispose());
      };
    }, [audioFiles]);

    useImperativeHandle(ref, () => ({
      handlePlay,
      handleStop,
    }));

    const handlePlay = () => {
      Tone.start();
      Object.values(players).forEach((player) => player.start());
    };

    const handleStop = () => {
      Object.values(players).forEach((player) => player.stop());
    };

    return (
      <div>
        <button onClick={handlePlay}></button>
        <button onClick={handleStop}></button>
      </div>
    );
  }
);
MultiAudioPlayer.displayName = "MultiAudioPlayer";
export default MultiAudioPlayer;
