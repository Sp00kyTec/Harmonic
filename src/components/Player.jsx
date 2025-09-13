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
    if (currentSong) audioManager.togglePlayPause();
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

  const volumeIcon = () => {
    if (muted || volume === 0) return '🔇';
    if (volume < 0.5) return '🔈';
    return '🔊';
  };

  if (!currentSong) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-black text-white p-8 rounded-2xl shadow-2xl text-center border border-white/10">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
          🎵
        </div>
        <p className="text-lg font-medium">No track selected</p>
        <p className="text-sm opacity-70">Choose one from your library</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-tl from-indigo-950 via-black to-slate-900 text-white p-6 rounded-2xl shadow-2xl border border-white/10 transform transition hover:scale-[1.01]">
      {/* Album Art */}
      <div className="flex justify-center mb-6">
        <div className="w-64 h-64 md:w-72 md:h-72 overflow-hidden rounded-xl shadow-2xl ring-2 ring-green-500/30">
          <img
            src={currentSong.cover || "https://via.placeholder.com/300"}
            alt={currentSong.title}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/300?text=Album+Art")}
          />
        </div>
      </div>

      {/* Song Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold truncate">{currentSong.title}</h2>
        <p className="text-lg opacity-90 truncate">{currentSong.artist}</p>
        <p className="text-sm opacity-70">{currentSong.album}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs opacity-80 mb-1 px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          value={currentTime}
          max={duration || 1}
          onChange={handleSeek}
          className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-green-500"
        />
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          onClick={toggleMute}
          className="text-lg hover:text-green-400 transition"
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
          className="w-24 h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-green-500"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={toggleShuffle}
          className={`p-2 rounded-full transition ${shuffle ? 'text-green-500' : 'text-white/70 hover:text-white'}`}
          aria-label="Shuffle"
        >
          🎲
        </button>

        <button
          onClick={() => audioManager.previous()}
          className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition active:scale-95"
          aria-label="Previous"
        >
          ⏮
        </button>

        <button
          onClick={togglePlayPause}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full font-bold text-lg flex items-center justify-center transition transform active:scale-95 ${
            isPlaying ? 'bg-red-600' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-black'
          }`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <button
          onClick={() => audioManager.next()}
          className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition active:scale-95"
          aria-label="Next"
        >
          ⏭
        </button>

        <button
          onClick={toggleLoop}
          className={`p-2 rounded-full transition ${loop ? 'text-green-500' : 'text-white/70 hover:text-white'}`}
          aria-label="Repeat"
        >
          🔁
        </button>
      </div>

      {/* Mode Indicators */}
      <div className="flex justify-center gap-3 mt-4 text-xs opacity-70">
        {shuffle && <span>🔀 Shuffle</span>}
        {loop && <span>🔁 Repeat</span>}
        {muted && <span>Muted</span>}
      </div>
    </div>
  );
}

export default Player;