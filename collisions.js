import { rand } from "./utils.js";

export default class CollisioAnimation {
  constructor(game, x, y, sizeMod) {
    this.image = boomImg;
    this.game = game;
    this.width = 71.2;
    this.height = 64;
    this.sizeMod = sizeMod;
    this.x = x - this.width * 0.5;
    this.y = y - this.height * 0.5;
    this.frameX = 0;
    this.maxFrame = 4;
    this.shouldDelete = false;
    this.animationFps = rand(8, 14);
    this.frameTimer = 0;
    this.framePace = 1000 / this.animationFps;
  }
  update(deltaTime) {
    this.x -= this.game.speed;
    // Animation onetime
    if (this.frameTimer > this.framePace) {
      this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    if (this.frameX > this.maxFrame) this.shouldDelete = true;
  }
  draw(ctx) {
    ctx.save();
    if (this.game.enemiesKilled < 77) {
      ctx.filter = "grayscale(1)";
    }
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width * this.sizeMod,
      this.height * this.sizeMod
    );
    ctx.restore();
  }
}
