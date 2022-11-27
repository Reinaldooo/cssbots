export function playSFX(audio) {
  audio.pause();
  audio.currentTime = 0;
  audio.play();
}

export function rand(min,max) {
  return Math.random() * (max - min) + min;
}
