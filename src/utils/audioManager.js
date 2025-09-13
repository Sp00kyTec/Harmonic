// src/utils/audioManager.js
import { getAllSongs, saveSong } from './db';

class AudioManager {
  constructor() {
    this.audio = new Audio();
    this.songs = [];
    this.currentSongIndex = -1;
    this.subscribers = [];
    this.loop = false;
    this.shuffle = false;

    // Set default volume
    this.audio.volume = 0.7;
    this.muted = false;

    this.initEvents();
    this.loadSongsFromDB();
  }

  async loadSongsFromDB() {
    try {
      const savedSongs = await getAllSongs();
      this.songs = savedSongs.length > 0 ? savedSongs : [];
      this.notify();
    } catch (error) {
      console.error("Failed to load songs from DB:", error);
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(fn => fn !== callback);
    };
  }

  notify() {
    const state = {
      currentSong: this.currentSong(),
      isPlaying: !this.audio.paused,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration || 0,
      loop: this.loop,
      shuffle: this.shuffle,
      volume: this.muted ? 0 : this.audio.volume,
      muted: this.muted,
    };
    this.subscribers.forEach(callback => callback(state));
  }

  currentSong() {
    if (this.currentSongIndex === -1) return null;
    return this.songs[this.currentSongIndex];
  }

  async playAtIndex(index) {
    if (index < 0 || index >= this.songs.length) return;

    this.currentSongIndex = index;
    this.audio.src = this.songs[index].file;
    this.audio.load();

    this.audio.volume = 0.7;
    this.audio.muted = false;

    try {
      await this.audio.play();
    } catch (err) {
      console.warn("Playback failed:", err);
      alert("Playback failed. Please interact with the page first.");
    }
  }

  play() {
    return this.audio.play().catch(err => {
      console.warn("Playback failed:", err);
    });
  }

  pause() {
    this.audio.pause();
    this.notify();
  }

  togglePlayPause() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  next() {
    if (this.songs.length === 0) return;

    if (this.shuffle) {
      const randomIndex = Math.floor(Math.random() * this.songs.length);
      this.playAtIndex(randomIndex);
      return;
    }

    let nextIndex = this.currentSongIndex + 1;

    if (nextIndex >= this.songs.length) {
      if (this.loop) {
        nextIndex = 0;
      } else {
        this.currentSongIndex = this.songs.length - 1;
        this.notify();
        return;
      }
    }

    this.playAtIndex(nextIndex);
  }

  previous() {
    if (this.songs.length === 0) return;

    const isAfterFewSeconds = this.audio.currentTime > 3;

    if (isAfterFewSeconds) {
      this.audio.currentTime = 0;
      this.play();
      return;
    }

    let prevIndex = this.currentSongIndex - 1;

    if (prevIndex < 0) {
      prevIndex = 0;
    }

    this.playAtIndex(prevIndex);
  }

  seek(time) {
    this.audio.currentTime = time;
    this.notify();
  }

  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
    this.muted = false;
    this.notify();
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.muted = this.audio.muted;
    this.notify();
  }

  toggleLoop() {
    this.loop = !this.loop;
    this.notify();
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
    this.notify();
  }

  initEvents() {
    this.audio.addEventListener('timeupdate', () => this.notify());
    this.audio.addEventListener('play', () => this.notify());
    this.audio.addEventListener('pause', () => this.notify());
    this.audio.addEventListener('ended', () => {
      this.next();
    });
    this.audio.addEventListener('error', (e) => {
      console.error("Audio Error:", e);
      alert("Failed to load audio. Check file path or format.");
    });
  }

  async addSong(song) {
    // Assign unique ID if not present
    const newSong = {
      ...song,
      id: song.id || Date.now() + Math.random()
    };

    // Save to DB
    await saveSong(newSong);

    // Add to memory
    this.songs.push(newSong);

    // Notify subscribers
    this.notify();

    return newSong;
  }
}

const audioManager = new AudioManager();

export default audioManager;