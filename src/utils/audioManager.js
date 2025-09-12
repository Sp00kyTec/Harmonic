// src/utils/audioManager.js

import songs from '../data/songs.json';

class AudioManager {
  constructor() {
    this.audio = new Audio();
    this.songs = songs;
    this.currentSongIndex = -1; // No song loaded
    this.subscribers = [];
    this.loop = false;
    this.shuffle = false;
    this._isPlaying = false;
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
    };
    this.subscribers.forEach(callback => callback(state));
  }

  currentSong() {
    if (this.currentSongIndex === -1) return null;
    return this.songs[this.currentSongIndex];
  }

  playAtIndex(index) {
    if (index < 0 || index >= this.songs.length) return;

    this.currentSongIndex = index;
    this.audio.src = this.songs[index].file;
    this.audio.load();
    this.play();
  }

  loadCurrent() {
    if (this.currentSongIndex === -1 && this.songs.length > 0) {
      this.playAtIndex(0);
    } else {
      this.audio.src = this.currentSong().file;
      this.audio.load();
    }
  }

  play() {
    this.audio.play().catch(e => console.error("Playback failed:", e));
    this._isPlaying = true;
    this.notify();
  }

  pause() {
    this.audio.pause();
    this._isPlaying = false;
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
    this.audio.addEventListener('play', () => {
      this._isPlaying = true;
      this.notify();
    });
    this.audio.addEventListener('pause', () => {
      this._isPlaying = false;
      this.notify();
    });
    this.audio.addEventListener('ended', () => {
      this.next();
    });
  }
}

const audioManager = new AudioManager();
audioManager.initEvents();

export default audioManager;