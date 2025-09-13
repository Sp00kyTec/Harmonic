// src/utils/readMetadata.js
import jsmediatags from 'jsmediatags';

export const readAudioMetadata = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;

      jsmediatags.read(arrayBuffer, {
        onSuccess: (tag) => {
          const { title, artist, album } = tag.tags;
          const picture = tag.tags.picture;

          let coverUrl = null;
          if (picture) {
            const data = new Uint8Array(picture.data);
            const blob = new Blob([data], { type: `image/${picture.format}` });
            coverUrl = URL.createObjectURL(blob);
          }

          resolve({
            title: title || file.name.replace('.mp3', ''),
            artist: artist || 'Unknown Artist',
            album: album || 'Unknown Album',
            cover: coverUrl,
            file: URL.createObjectURL(file),
            duration: 'N/A' // Can be calculated later
          });
        },
        onError: (error) => {
          console.error("Error reading tags:", error);
          resolve({
            title: file.name.replace('.mp3', ''),
            artist: 'Unknown Artist',
            album: 'Unknown Album',
            cover: '/covers/placeholder.jpg',
            file: URL.createObjectURL(file),
            duration: 'N/A'
          });
        }
      });
    };
    reader.readAsArrayBuffer(file);
  });
};