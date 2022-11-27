import Game from "./game.js";

window.addEventListener("load", () => {
  const ctx = canvas1.getContext("2d");
  const ctx2 = canvas2.getContext("2d");
  canvas1.width = 512;
  canvas1.height = 256;
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;
  let lastTime = 0;

  const game = new Game(canvas1, animate);
  game.music1.addEventListener("ended", () => {
    game.music = game.music2;
    game.music.play();
  });
  game.music2.addEventListener("ended", () => {
    game.music = game.music1;
    game.music.play();
  });

  function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    lastTime = timestamp;
    game.update(game.input, deltaTime);
    game.draw(ctx, ctx2);
    if (!game.gameOver && !game.pause) {
      requestAnimationFrame(animate);
    }
  }

  animate(0);
});
