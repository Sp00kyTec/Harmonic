// src/components/Player.jsx
import { useEffect, useState } from 'react';
import audioManager from '../utils/audioManager';

function Player() {
  const [state, setState] = useState({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  // Subscribe to audio manager
  useEffect(() => {
    const unsubscribe = audioManager.subscribe((newState) => {
      setState({ ...newState });
    });

    return () => unsubscribe();
  }, []);

  const { currentSong, isPlaying, currentTime, duration } = state;

  const togglePlayPause = () => {
    if (currentSong) {
      audioManager.togglePlayPause();
    }
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    audioManager.seek(time);
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
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-black text-white p-6 rounded-xl shadow-2xl">
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
          onChange={handleSeek}
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