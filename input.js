import { milestones } from "./milestones.js";

export default class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      " ": false,
      RepeatedSpace: false,
      RepeatedUp: false
    };
    window.addEventListener("keydown", (e) => {
      if (
        e.key === " " ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        this.keys[e.key] = true;
        if(e.key === " ") {
          this.keys[" "] = !this.keys["RepeatedSpace"]
          this.keys["RepeatedSpace"] = true;
        }
        if(e.key === "ArrowUp") {
          this.keys["ArrowUp"] = !this.keys["RepeatedUp"]
          this.keys["RepeatedUp"] = true;
        }
      }
      // else if (e.key === "d" || e.key === "D") this.game.debug = !this.game.debug;
      else if ((e.key === "e" || e.key === "E") && this.game.milestoneScreen) {
        this.game.handlePause();
        this.game.milestoneScreen = false;
        this.game.currMilestone = milestones[this.game.currMilestone.idx + 1];
        this.game.confirmAudio.play()
      }
      else if ((e.key === "s" || e.key === "S") && this.game.inverted) {
        this.game.inverted = false;
        this.game.clearEnemies(true);
      }
      else if ((e.key === "r" || e.key === "R") && this.game.enemiesKilled >= 200) {
        localStorage.removeItem("savegame")
        location.reload();
      }
      else if (e.key === "Escape") this.game.handlePause();
    });
    window.addEventListener("keyup", (e) => {
      if (
        e.key === " " ||
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        this.keys[e.key] = false;
        if(e.key === " ") this.keys["RepeatedSpace"] = false;
        if(e.key === "ArrowUp") this.keys["RepeatedUp"] = false;
      }
    });
  }
}
