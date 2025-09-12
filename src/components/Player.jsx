// src/components/Player.jsx
import { useEffect, useState } from 'react';
import audioManager from '../utils/audioManager';

function Player() {
  const [state, setState] = useState({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    shuffle: false,
    loop: false,
    volume: 0.7,
    muted: false,
  });

  // Subscribe to audio manager for real-time updates
  useEffect(() => {
    const unsubscribe = audioManager.subscribe((newState) => {
      setState({ ...newState });
    });

    return () => unsubscribe();
  }, []);

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    shuffle,
    loop,
    volume,
    muted,
  } = state;

  const togglePlayPause = () => {
    if (currentSong) {
      audioManager.togglePlayPause();
    }
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    audioManager.seek(time);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    audioManager.setVolume(vol);
  };

  const toggleMute = () => {
    audioManager.toggleMute();
  };

  const toggleShuffle = () => {
    audioManager.toggleShuffle();
  };

  const toggleLoop = () => {
    audioManager.toggleLoop();
  };

  const formatTime = (timeSec) => {
    const mins = Math.floor(timeSec / 60);
    const secs = (timeSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Choose volume icon based on level
  const volumeIcon = () => {
    if (muted || volume === 0) return '🔇';
    if (volume < 0.5) return '🔈';
    return '🔊';
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
      {/* Album Art */}
      <img
        src={currentSong.cover || '/covers/placeholder.jpg'}
        alt={currentSong.title}
        className="w-48 h-48 mx-auto rounded-lg shadow-lg mb-4"
      />

      {/* Track Info */}
      <h2 className="text-2xl font-bold">{currentSong.title}</h2>
      <p className="text-lg opacity-90">{currentSong.artist}</p>
      <p className="text-sm opacity-70 mb-4">{currentSong.album}</p>

      {/* Progress Bar */}
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

      {/* Volume Control */}
      <div className="flex items-center gap-2 mt-3 px-2">
        <button
          onClick={toggleMute}
          className="text-lg hover:text-green-400 transition"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {volumeIcon()}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>

      {/* Playback Controls */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={toggleShuffle}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition transform hover:scale-105 ${
            shuffle
              ? 'bg-green-500 text-white'
              : 'text-white/70 hover:text-white'
          }`}
          aria-label={shuffle ? 'Shuffle On' : 'Shuffle Off'}
        >
          🎲
        </button>

        <button
          onClick={() => audioManager.previous()}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition transform hover:scale-105"
          aria-label="Previous"
        >
          ⏮
        </button>

        <button
          onClick={togglePlayPause}
          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl transition transform hover:scale-105 ${
            isPlaying ? 'bg-red-500' : 'bg-white text-black'
          }`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <button
          onClick={() => audioManager.next()}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full flex items-center justify-center transition transform hover:scale-105"
          aria-label="Next"
        >
          ⏭
        </button>

        <button
          onClick={toggleLoop}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition transform hover:scale-105 ${
            loop
              ? 'bg-green-500 text-white'
              : 'text-white/70 hover:text-white'
          }`}
          aria-label={loop ? 'Repeat On' : 'Repeat Off'}
        >
          🔁
        </button>
      </div>

      {/* Mode Labels */}
      <div className="flex justify-center gap-4 mt-2 text-xs opacity-70">
        {shuffle && <span>Shuffle</span>}
        {loop && <span>Repeat</span>}
        {muted && <span>Muted</span>}
      </div>
    </div>
  );
}

export default Player;