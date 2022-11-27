import { playSFX } from "./utils.js"

export const states = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  JUMPING: "JUMPING",
  FALLING: "FALLING",
  ATTACK: "ATTACK",
};

class State {
  constructor(state) {
    this.state = state;
  }
  handleInput(input) {
    if (input.keys[" "]) {
      this.player.setState(states.ATTACK);
    }
  }
}

export class Idle extends State {
  constructor(player) {
    super(states.IDLE);
    this.player = player;
  }
  enter() {
    this.player.frameY = 0;
    this.player.maxFrame = 4;
  }
  handleInput(input) {
    super.handleInput(input);
    if (input.keys["ArrowLeft"] || input.keys["ArrowRight"]) {
      this.player.setState(states.RUNNING);
    } else if (input.keys["ArrowUp"]) {
      this.player.setState(states.JUMPING);
    }
  }
}

export class Running extends State {
  constructor(player) {
    super(states.RUNNING);
    this.player = player;
  }
  enter() {
    this.player.frameY = 1;
    this.player.maxFrame = 5;
  }
  handleInput(input) {
    super.handleInput(input);
    if (input.keys["ArrowDown"] && this.player.onGround()) {
      this.player.setState(states.IDLE, 0);
    } else if (input.keys["ArrowUp"] && this.player.onGround()) {
      this.player.setState(states.JUMPING);
    }
  }
}

export class Jumping extends State {
  constructor(player) {
    super(states.JUMPING);
    this.player = player;
  }
  enter() {
    if (this.player.onGround()) {
      this.player.vy -= 18;
      this.player.frameY = 3;
      this.player.maxFrame = 4;
      playSFX(this.player.jumpAudio);
    }
  }
  handleInput(input) {
    super.handleInput(input);
    if (this.player.vy > this.player.weight) {
      this.player.setState(states.FALLING);
    }
  }
}

export class Falling extends State {
  constructor(player) {
    super(states.FALLING);
    this.player = player;
  }
  enter() {
    this.player.frameY = 3;
    this.player.maxFrame = 4;
  }
  handleInput(input) {
    super.handleInput(input);
    if (this.player.onGround()) {
      this.player.setState(states.RUNNING);
    }
  }
}

export class Attack extends State {
  constructor(player) {
    super(states.ATTACK);
    this.player = player;
    this.lastState = null;
    this.secondAttack = false;
  }
  enter(lastState) {
    this.lastState = lastState;
    this.player.frameY = this.secondAttack ? 8 : 7;
    this.player.frameX = 0;
    this.player.maxFrame = 3;
    this.secondAttack ? playSFX(this.player.atk2Audio) : playSFX(this.player.atk1Audio);
    this.secondAttack = !this.secondAttack;

  }
  handleInput(input) {
    if (input.keys["ArrowUp"] && this.player.onGround()) {
      this.player.setState(states.JUMPING);
    }
    if (this.player.frameX >= this.player.maxFrame) {
      let gameSpeed = this.lastState.state === states.IDLE ? 0 : 1;
      this.player.setState(this.lastState.state, gameSpeed);
    }
  }
}
