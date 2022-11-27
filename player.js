import {
  states,
  Idle,
  Running,
  Jumping,
  Falling,
  Attack,
} from "./playerStates.js";
import CollisioAnimation from "./collisions.js";
import { playSFX, rand } from "./utils.js";

export default class Player {
  constructor(game) {
    this.game = game;
    this.width = 64;
    this.height = 64;
    this.x = 50;
    this.y = this.game.height - this.height + 2 - this.game.groundMargin;
    this.image = document.getElementById("playerImg");
    this.atk1Audio = new Audio("assets/sfx/atk1.wav");
    this.atk2Audio = new Audio("assets/sfx/atk2.wav");
    this.jumpAudio = new Audio("assets/sfx/jump.wav");
    this.collisionAudio = new Audio("assets/sfx/robotDeath.wav");
    this.frameX = 0;
    this.maxFrame = 4;
    this.frameY = 0;
    this.animationFps = 10;
    this.framePace = 1000 / this.animationFps;
    this.frameTimer = 0;
    this.speed = 0;
    this.maxSpeed = 5;
    this.vy = 0;
    this.weight = 1;
    this.states = {
      IDLE: new Idle(this),
      RUNNING: new Running(this),
      JUMPING: new Jumping(this),
      FALLING: new Falling(this),
      ATTACK: new Attack(this),
    };
    this.lastState = this.states[states.IDLE];
    this.currentState = this.states[states.IDLE];
    this.currentState.enter();
  }
  update(input, deltaTime) {
    if (this.game.maxSpeed > 4 && this.animationFps !== 21) {
      this.updateFps(21);
    } else if (this.game.maxSpeed > 3 && this.animationFps !== 19) {
      this.updateFps(19);
    } else if (this.game.maxSpeed > 2 && this.animationFps !== 16) {
      this.updateFps(16);
    } else if (this.game.maxSpeed > 1 && this.animationFps !== 12) {
      this.updateFps(12);
    } else if (this.game.maxSpeed > 0 && this.animationFps !== 10) {
      this.updateFps(10);
    }
    this.checkCollisions();
    this.currentState.handleInput(input);
    // Horizontal mov
    this.x += this.speed;
    if (input.keys["ArrowRight"]) this.speed = this.maxSpeed;
    else if (input.keys["ArrowLeft"]) this.speed = -this.maxSpeed;
    else this.speed = 0;
    if (this.x < 10) this.x = 10;
    if (this.x > this.game.width - this.width - 50)
      this.x = this.game.width - this.width - 50;
    // Vertical mov
    this.y += this.vy;
    if (!this.onGround()) this.vy += this.weight;
    else this.vy = 0;
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
  }
  draw(ctx) {
    // if (this.game.debug)
    //   ctx.strokeRect(
    //     this.x + 10,
    //     this.y + 20,
    //     this.width - 10,
    //     this.height - 20
    //   );
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
  }

  onGround() {
    return (
      this.y >= this.game.height - this.height + 2 - this.game.groundMargin
    );
  }

  setState(state, speed = 1) {
    this.game.speed = this.game.maxSpeed * speed;
    this.lastState = this.currentState;
    this.currentState = this.states[state];
    this.currentState.enter(this.lastState);
  }

  checkCollisions() {
    // offset are hitbox diffs from image size
    if (this.currentState.state === states.ATTACK) {
      let spriteSize;
      let isGroundEnemy;
      this.game.enemies.forEach((enemy) => {
        isGroundEnemy = enemy.type === "GROUND";
        if (
          isGroundEnemy &&
          enemy.x + 10 < this.x + 10 + this.width - 10 &&
          enemy.x + 10 + enemy.width - 15 > this.x + 10 &&
          enemy.y + 15 < this.y + 20 + this.height - 20 &&
          enemy.y + 15 + enemy.height - 20 > this.y + 20
        ) {
          spriteSize = 1;
          this.game.collisions.push(
            new CollisioAnimation(
              this.game,
              enemy.x + enemy.width * 0.5,
              enemy.y + enemy.height * 0.5,
              spriteSize
            )
          );
          if(enemy.inverted) this.game.inverted = true;
          enemy.shouldDelete = true;
          this.game.enemiesKilled++;
          this.game.enemiesKilledSinceLastUpdate++;
          playSFX(this.collisionAudio);
        }
        if (
          !isGroundEnemy &&
          enemy.x + 15 < this.x + 10 + this.width - 10 &&
          enemy.x + 15 + enemy.width - 25 > this.x + 10 &&
          enemy.y + 20 < this.y + 20 + this.height - 20 &&
          enemy.y + 20 + enemy.height - 40 > this.y + 20
        ) {
          spriteSize = 0.5;
          this.game.collisions.push(
            new CollisioAnimation(
              this.game,
              enemy.x + 15 + enemy.width * 0.5,
              enemy.y + 20 + enemy.height * 0.5,
              spriteSize
            )
          );
          if(enemy.inverted) this.game.inverted = true;
          enemy.shouldDelete = true;
          this.game.enemiesKilled++;
          this.game.enemiesKilledSinceLastUpdate++;
          playSFX(this.collisionAudio);
        }
      });
    }
  }

  updateFps(fps) {
    this.animationFps = fps;
    this.framePace = 1000 / this.animationFps;
  }
}
