import InputHandler from "./input.js";
import Player from "./player.js";
import { Background, Foreground } from "./background.js";
import { FlyingEnemy, FlyingEnemyTop, GroundEnemy } from "./enemies.js";
import { rand } from "./utils.js";

export default class Game {
  constructor(canvas, animateFn) {
    this.canvas = canvas;
    this.animateFn = animateFn;
    this.width = canvas.width;
    this.height = canvas.height;
    this.groundMargin = 15;
    this.player = new Player(this);
    this.background = new Background(this);
    this.foreground = new Foreground(this);
    this.input = new InputHandler(this);
    this.music1 = new Audio("assets/music/music1.wav");
    this.music2 = new Audio("assets/music/music2.wav");
    this.music = this.music1;
    // this.music.play();
    this.speed = 0;
    this.maxSpeed = 0.5;
    this.enemies = [];
    this.collisions = [];
    this.enemyTimer = 0;
    // Starts with 1200-2500 and go all the way to 200-1000
    this.enemyPace = rand(
      1200 - this.maxSpeed * 400,
      2500 - this.maxSpeed * 600
    );
    this.pause = false;
    // this.debug = false;
    this.level = 1;
    this.enemiesKilled = 0;
    // Avoid speeding up if the number is the same
    this.enemiesKilledSinceLastUpdate = 0;
    this.enemiesModNumber = 5;
    this.canApplyFilters = false;
    this.inverted = false;
    this.milestones = [
      {
        idx: 0,
        text: [
          "Olá, nosso mundo anda meio caótico desde que o Elon Musk",
          "alterou a nossa simulação, mas descobrimos que ela foi criada",
          "utilizando HTML, CSS e Javascript. Nosso papel hoje é",
          "destruir bots defeituosos e tentar consertar parte do CSS.",
          " ",
          "O CSS é responsável pela parte visual do mundo, e um dos seus",
          "principais usos é na posição das coisas. Como você pode",
          "ver, tudo está bagunçado. Vamos matar alguns inimigos e",
          "tentar restaurar a ordem. Quanto mais inimigos matarmos,",
          "mais partes do mundo voltarão para suas posições corretas.",
          " ",
          "Use as setas do teclado para se movimentar,",
          "espaço para atacar e Esc para pausar.",
          " ",
          "Pressione 'E' para começar"
        ],
        font: "25px 'Press Start 2P'",
        textAlign: "center",
        fillStyle: "white",
        enemyQty: 0,
        posY: 200,
        posX: window.innerWidth / 2
      },
      {
        idx: 1,
        text: [
          "Boa, você restaurou as leis da física!",
          "",
          "Mas como você pode perceber, algumas coisas continuam em preto e branco!",
          "",
          "O CSS pode nos ajudar com isso, setando cores em cada um dos elementos.",
          "Continue eliminando os bots para restaurar as cores do mundo.",
          "",
          "Não sei se você reparou, mas a simulação fica mais rápida conforme",
          "matamos mais inimigos, tome cuidado com isso.",
          "",
          "",
          "Pressione 'E' para continuar"
        ],
        font: "20px 'Press Start 2P'",
        textAlign: "center",
        fillStyle: "white",
        enemyQty: 45,
        posY: window.innerHeight / 2 - 200,
        posX: window.innerWidth / 2
      },
      {
        idx: 2,
        text: [
          "Perfeito, cores recuperadas!",
          "",
          "Além das cores, o CSS permite aplicar filtros, como borrado ou invertido!",
          "Caso apareça algum inimigo diferente, mate-o e terá uma supresa.",
          "",
          "Para sair do modo especial, pressione 'S'.",
          "",
          "",
          "Pressione 'E' para continuar"
        ],
        font: "20px 'Press Start 2P'",
        textAlign: "center",
        fillStyle: "white",
        enemyQty: 130,
        posY: window.innerHeight / 2 -150,
        posX: window.innerWidth / 2
      },
      {
        idx: 3,
        text: [
          "Parabéns, você conseguiu recuperar boa parte do mundo!",
          "Ainda precisamos resolver algumas coisas usando Javascript,",
          "mas pode ser outro dia.",
          "",
          "Você pode continuar jogando ou atualizar o navegador para recomeçar.",
        ],
        font: "20px 'Press Start 2P'",
        textAlign: "center",
        fillStyle: "white",
        enemyQty: 200,
        posY: window.innerHeight / 2 - 50,
        posX: window.innerWidth / 2
      },
      {
        idx: 4,
        text: [
          "Endgame",
        ],
        font: "20px 'Press Start 2P'",
        textAlign: "center",
        fillStyle: "white",
        enemyQty: 200000,
        posY: window.innerHeight / 2 - 50,
        posX: window.innerWidth / 2
      },
    ];
    this.currMilestone = this.milestones[0];
    this.milestoneScreen = false;
  }
  update(input, deltaTime) {
    if(this.currMilestone.idx <= 1 && this.enemiesKilled <= 24 && this.enemiesKilled % 2 === 0) {
      let acc = 96 - this.enemiesKilled * 4;
      this.canvas.style.transform = `scale(3.5) translate(-${acc + rand(-20,20)}px, -${acc}px)`
    }
    if(this.enemiesKilled > 130) {
      this.canApplyFilters = true;
    }
    // Aumenta gradativamente a velocidade do jogo conforme a quantidade de inimigos derrotados
    // O mod % aumenta junto pois quanto mais rápido mais inimigos precisamos matar para subir de nivel
    if (
      this.maxSpeed < 4.3 && // Level 20
      this.enemiesKilledSinceLastUpdate > 0 &&
      this.enemiesKilledSinceLastUpdate % this.enemiesModNumber === 0
    ) {
      this.level++;
      this.maxSpeed += 0.21; // 1 to avoid nums like 2.5 as i use mod % on player fps
      this.enemiesModNumber += 3;
      this.enemiesKilledSinceLastUpdate = 0;
    }

    this.background.update();

    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
      if (enemy.shouldDelete) this.clearEnemies();
    });

    if (this.enemyTimer > this.enemyPace) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }

    this.collisions.forEach((collision) => {
      collision.update(deltaTime);
      if (collision.shouldDelete) this.clearCollisions();
    });

    this.player.update(input, deltaTime);
    this.foreground.update();

    this.frameTimer = 0;
  }
  draw(ctx,ctx2) {
    this.background.draw(ctx);
    this.enemies.forEach((enemy) => {
      enemy.draw(ctx);
    });
    this.collisions.forEach((collision) => {
      collision.draw(ctx);
    });
    this.player.draw(ctx);
    this.foreground.draw(ctx);
    this.showStatsText(ctx);
    if (this.pause) {
      if(!this.milestoneScreen) {
        this.showOverlay(ctx);
        this.showPauseText(ctx);
      }
    }
    if (this.enemiesKilled >= this.currMilestone.enemyQty) {
      if(this.currMilestone.idx === 1) {
        this.canvas.style.transform = `scale(3.5)`;
      }
      this.milestoneScreen = true;
      this.handlePause();
      this.showOverlay(ctx);
      this.showMilestoneText(ctx2, this.currMilestone);
    }
  }
  addEnemy() {
    if (this.enemies.length < 25) {
      this.enemies.push(new FlyingEnemy(this));
      if (rand(0, 10) > 5) this.enemies.push(new GroundEnemy(this));
      if (rand(0, 10) > 6) this.enemies.push(new FlyingEnemyTop(this));
      this.enemyPace = rand(
        1200 - this.maxSpeed * 400,
        2500 - this.maxSpeed * 600
      );
    }
  }
  clearEnemies(all) {
    if(all) {
      this.enemies = [];
      return;
    }
    this.enemies = this.enemies.filter((enemy) => !enemy.shouldDelete);
  }
  clearCollisions() {
    this.collisions = this.collisions.filter(
      (collision) => !collision.shouldDelete
    );
  }
  handlePause() {
    this.pause = !this.pause;
    // this.music.pause();
    if (!this.pause) {
      // this.music.play();
      requestAnimationFrame(this.animateFn);
    }
  }
  showStatsText(ctx) {
    ctx.font = "9px 'Press Start 2P'";
    ctx.textAlign = "left";
    ctx.fillStyle = "#62404e";
    ctx.fillText(`Bots destruídos: ${this.enemiesKilled}`, 10, 20);
    ctx.fillText(`Nível: ${this.level}`, 10, 35);
  }
  showOverlay(ctx) {
    ctx.fillStyle = "rgba(0,0,0,.8)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  showPauseText(ctx) {
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillStyle = "#62404e";
    ctx.fillText("Pause", this.width / 2, this.height / 2);
  }
  showMilestoneText(ctx, milestone) {
    if(milestone.font) ctx.font = milestone.font;
    if(milestone.textAlign) ctx.textAlign = milestone.textAlign;
    if(milestone.fillStyle) ctx.fillStyle = milestone.fillStyle;
    milestone.text.forEach((text,idx) => {
      ctx.fillText(text, milestone.posX, milestone.posY + 40 *idx);
    }) 
  }
}
