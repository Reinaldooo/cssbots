class Layer {
  constructor(game, width, height, speedModifier, image, enemiesToColor) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image = image;
    this.x = 0;
    this.y = 0;
    this.enemiesToColor = enemiesToColor;
    this.milestoneOfsset = 60;
    this.lastNumEnemiesOffset = 31;
  }
  update() {
    if (
      this.game.currMilestone.idx === 1 &&
      this.milestoneOfsset > 0 &&
      this.game.enemiesKilled > 30 &&
      this.game.enemiesKilled !== this.lastNumEnemiesOffset
    ) {
      this.milestoneOfsset -= this.game.enemiesKilled % 30;
      this.lastNumEnemiesOffset = this.game.enemiesKilled;
      if(this.milestoneOfsset <= 0) {
        this.milestoneOfsset = 0
      }
    }
    if (this.x < -this.width) {
      // offset is here because its not an exact number, so we should avoid lag
      // by calculating every time. -1 it´s just to make the next image blend better
      const offset = this.x + this.width - 1;
      this.x = this.game.speed * this.speedModifier * -1 + offset;
    } else this.x -= this.game.speed * this.speedModifier;
  }
  draw(ctx) {
    ctx.save();
    if (this.game.enemiesKilled < this.enemiesToColor) ctx.filter = "grayscale(1)";
    if (this.game.inverted) ctx.filter = "invert(1)";
    ctx.drawImage(
      this.image,
      this.x + this.milestoneOfsset,
      this.y - this.milestoneOfsset,
      this.width,
      this.height
    );
    ctx.drawImage(
      this.image,
      this.x + this.width - 1,
      this.y,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

export class Background {
  constructor(game) {
    this.game = game;
    this.width = 512;
    this.height = 256;
    // Items with id are acessable in the global obj
    this.layer1Image = backLayer1;
    this.layer2Image = backLayer2;
    this.layer3Image = backLayer3;
    this.layer4Image = backLayer4;
    this.layer5Image = backLayer5;
    this.backLayers = [
      new Layer(
        this.game,
        this.width,
        this.height,
        0.2,
        this.layer1Image,
        110
      ),
      new Layer(
        this.game,
        this.width,
        this.height,
        0.8,
        this.layer2Image,
        50
      ),
      new Layer(
        this.game,
        this.width,
        this.height,
        1.2,
        this.layer3Image,
        62
      ),
      new Layer(
        this.game,
        this.width,
        this.height,
        1.4,
        this.layer4Image,
        75
      ),
      new Layer(
        this.game,
        this.width,
        this.height,
        1.8,
        this.layer5Image,
        87
      ),
    ];
  }
  update() {
    this.backLayers.forEach((layer) => {
      layer.update();
    });
  }
  draw(ctx) {
    this.backLayers.forEach((layer) => {
      layer.draw(ctx);
    });
  }
}

export class Foreground {
  constructor(game) {
    this.game = game;
    this.width = 512;
    this.height = 256;
    // Items with id are acessable in the global obj
    this.layer6Image = backLayer6;
    this.foreLayers = [
      new Layer(this.game, this.width, this.height, 1.4, this.layer6Image),
    ];
  }
  update() {
    this.foreLayers.forEach((layer) => {
      layer.update();
    });
  }
  draw(ctx) {
    ctx.save();
    if (this.game.enemiesKilled < 110) {
      ctx.filter = "grayscale(1)";
    }
    this.foreLayers.forEach((layer) => {
      layer.draw(ctx);
    });
    ctx.restore();
  }
}
