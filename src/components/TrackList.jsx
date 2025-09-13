// src/components/TrackList.jsx
import { useEffect, useState } from 'react';
import audioManager from '../utils/audioManager';
import { readAudioMetadata } from '../utils/readMetadata';

function TrackList() {
  const [state, setState] = useState({ currentSong: null });
  const [songs, setSongs] = useState(audioManager.songs);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((newState) => {
      setState({ currentSong: newState.currentSong });
    });

    return () => unsubscribe();
  }, []);

  const handlePlay = (song) => {
    const index = songs.findIndex(s => s.id === song.id);
    if (index !== -1) {
      audioManager.playAtIndex(index);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.mp3'));

    const newSongs = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const metadata = await readAudioMetadata(file);
      metadata.id = Date.now() + i;
      newSongs.push(metadata);
    }

    setSongs(prev => [...prev, ...newSongs]);
    // Optional: auto-play first imported song
    if (newSongs.length > 0) {
      const index = songs.length;
      audioManager.songs = [...audioManager.songs, ...newSongs]; // Sync with manager
      audioManager.playAtIndex(index);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const filteredSongs = songs.filter((song) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      song.album.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-xl"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Drop Zone Indicator */}
      <div className="text-xs text-center mb-3 opacity-70">
        💾 Drop MP3 files here to import
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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

            return (
              <div
                key={song.id}
                onClick={() => handlePlay(song)}
                className={`group p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 hover:bg-white/10 ${
                  isPlaying ? 'bg-green-500/20 border border-green-500/30' : ''
                }`}
              >
                <div className="w-10 h-10 overflow-hidden rounded shadow-sm flex-shrink-0">
                  <img
                    src={song.cover || "/covers/placeholder.jpg"}
                    alt={song.title}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = "https://via.placeholder.com/40?text=🎵"}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${isPlaying ? 'text-green-300' : 'text-white'}`}>
                    {song.title}
                  </p>
                  <p className={`text-xs truncate opacity-80 ${isPlaying ? 'text-green-200' : 'text-gray-300'}`}>
                    {song.artist}
                  </p>
                </div>

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