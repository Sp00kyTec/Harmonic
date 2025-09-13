// src/components/TrackList.jsx
import { useEffect, useState } from 'react';
import audioManager from '../utils/audioManager';

function TrackList() {
  const [state, setState] = useState({ currentSong: null });
  const allSongs = audioManager.songs;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = allSongs.filter((song) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      song.album.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((newState) => {
      setState({ currentSong: newState.currentSong });
    });
    return () => unsubscribe();
  }, []);

  const handlePlay = (song) => {
    if (audioManager.currentSong() === song) {
      audioManager.togglePlayPause();
    } else {
      const index = allSongs.findIndex(s => s.id === song.id);
      audioManager.playAtIndex(index);
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-xl">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
        />
        {searchQuery && (
          <p className="text-xs text-center mt-2 opacity-70">
            Found <strong>{filteredSongs.length}</strong> result(s)
          </p>
        )}
      </div>

      {/* Track List */}
      <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
        {filteredSongs.length === 0 ? (
          <p className="text-center py-8 text-gray-400 text-sm">No tracks found</p>
        ) : (
          filteredSongs.map((song) => {
            const isPlaying = state.currentSong?.id === song.id;
            const isPaused = isPlaying && !audioManager.isPlaying;

            return (
              <div
                key={song.id}
                onClick={() => handlePlay(song)}
                className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 hover:bg-white/10 ${
                  isPlaying ? 'bg-gradient-to-r from-green-500/20 to-transparent border border-green-500/30' : ''
                }`}
              >
                {/* Cover */}
                <div className="w-10 h-10 overflow-hidden rounded shadow-sm flex-shrink-0">
                  <img
                    src={song.cover || "https://via.placeholder.com/40"}
                    alt={song.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/40?text=🎵")}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${isPlaying ? 'text-green-300' : 'text-white'}`}>
                    {song.title}
                  </p>
                  <p className={`text-xs truncate opacity-80 ${isPlaying ? 'text-green-200' : 'text-gray-300'}`}>
                    {song.artist}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-xs w-10 text-right opacity-70">{song.duration}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TrackList;