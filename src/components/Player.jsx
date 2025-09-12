// src/components/Player.jsx
import { useRef, useEffect, useState } from 'react';

function Player({ currentSong }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Autoplay failed:", e));
      }
    }
  }, [currentSong, isPlaying]);

  const onLoadedMetadata = () => {
    setDuration(Math.floor(audioRef.current.duration));
  };

  const updateTime = () => {
    setCurrentTime(Math.floor(audioRef.current.currentTime));
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => alert("Playback failed: " + e.message));
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (timeSec) => {
    const mins = Math.floor(timeSec / 60);
    const secs = (timeSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!currentSong) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-black text-white p-6 rounded-xl text-center shadow-2xl">
        <p className="text-lg">No song selected</p>
        <p className="text-sm opacity-75">Choose one from your library</p>
        <audio ref={audioRef} />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-black text-white p-6 rounded-xl shadow-2xl">
      <audio
        ref={audioRef}
        src={currentSong.file}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={updateTime}
        onEnded={() => setIsPlaying(false)}
      />

      <img
        src={currentSong.cover || "/covers/placeholder.jpg"}
        alt={currentSong.title}
        className="w-48 h-48 mx-auto rounded-lg shadow-lg mb-4"
      />

      <h2 className="text-2xl font-bold">{currentSong.title}</h2>
      <p className="text-lg opacity-90">{currentSong.artist}</p>
      <p className="text-sm opacity-70 mb-4">{currentSong.album}</p>

      <div className="mt-4">
        <div className="flex justify-between text-xs opacity-80 mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          value={currentTime}
          max={duration || 1}
          onChange={(e) => {
            const seekTime = e.target.value;
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
          }}
          className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => console.log('Previous')}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition"
        >
          ⏮
        </button>

        <button
          onClick={togglePlayPause}
          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition transform hover:scale-105 ${
            isPlaying ? 'bg-red-500' : 'bg-white text-black'
          }`}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <button
          onClick={() => console.log('Next')}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}

export default Player;