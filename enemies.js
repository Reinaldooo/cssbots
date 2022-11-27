import { rand } from "./utils.js";

class Enemy {
  constructor(game) {
    this.game = game;
    this.frameX = 0;
    this.maxFrame = 7;
    this.animationFps = 10;
    this.frameTimer = 0;
    this.framePace = 1000 / this.animationFps;
    this.shouldDelete = false;
    this.saturation = Math.floor(rand(0,100));
    this.width = 24 * 2;
    this.height = 32 * 2;
    this.inverted = this.game.inverted || (this.game.canApplyFilters && rand(0,100) > 90);
  }
  draw(ctx) {
    // if (this.game.debug) {
    //   // numbers are the offsets of the hitbox
    //   if (this.type === "FLYING")
    //     ctx.strokeRect(
    //       this.x + 15,
    //       this.y + 20,
    //       this.width - 25,
    //       this.height - 40
    //     );
    //   else
    //     ctx.strokeRect(
    //       this.x + 10,
    //       this.y + 15,
    //       this.width - 15,
    //       this.height - 20
    //     );
    // }
    ctx.save();
    ctx.filter = `grayscale(1)`;
    if(this.type === "FLYING" && this.game.enemiesKilled > 77) ctx.filter = `saturate(${this.saturation}%)`;
    if(this.type === "FLYINGTOP" && this.game.enemiesKilled > 87) ctx.filter = `saturate(${this.saturation}%)`;
    if(this.type === "GROUND" && this.game.enemiesKilled > 97) ctx.filter = `saturate(${this.saturation}%)`;
    if(this.inverted) {
      ctx.filter = `invert(1)`
    }
    ctx.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    ctx.restore();
  }
  update(deltaTime) {
    // Animation
    if (this.frameTimer > this.framePace) {
      if (this.frameX >= this.maxFrame) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
    // Movement
    this.x -= this.speedX + this.game.speed;
    // this.y -= this.speedY;
    if (this.x < 0 - this.width || this.y > this.game.height) {
      this.shouldDelete = true;
    }
  }
}

export class FlyingEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.type = "FLYING";
    this.game = game;
    // Enemy sprite idx
    this.possibleSprites = [14, 15, 16, 17, 18, 19, 20, 21];
    this.frameY = this.possibleSprites[Math.ceil(rand(0,7))];
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.3;
    this.speedX = rand(.4,1.6);
    this.speedY = 0.1;
    this.image = enemiesImg;
    this.angle = 0;
    this.varAngle = rand(0.02, 0.05);
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.angle += this.varAngle;
    this.y += Math.sin(this.angle);
  }
}

export class FlyingEnemyTop extends FlyingEnemy {
  constructor(game) {
    super(game);
    this.type = "FLYINGTOP";
    this.x = rand(this.game.width / 3, this.game.width);
    this.y = -this.height;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.y++;
  }
}

export class GroundEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.type = "GROUND";
    this.game = game;
    this.possibleSprites = [1, 2, 3, 4, 9, 10, 12, 13];
    this.frameY = this.possibleSprites[Math.ceil(rand(0,7))];
    this.x = this.game.width + this.width;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.speedX = rand(0,.8);
    this.image = enemiesImg;
  }
}
