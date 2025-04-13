class Player {
  constructor() {
    this.x = 0 + 50;
    this.y = 0 + 50;
    this.velX = 0;
    this.velY =
    this.width = (35*2);
    this.height = (100*2);
    this.img = new Image();
    this.img.src = "./Pictures/newJaspser.png";
    this.turn = 1;
    this.rotate = 0;
    this.offsetX = this.width / 2;
    this.offsetY = this.height / 2;
    this.walking = false;
    this.walkingSFX = new Audio(audio.sfx.walking);
    this.burgers = [];
    this.shootDelay = 30;
    this.backgroundCount = 0;
    this.bossChance = 1000;
    this.isBoss = false;
  }

  //Move player
  move() {
    if (keys.w) {
      this.velY = -5;
      if (this.turn == 1) {
        this.rotate = -45;
      } else {
        this.rotate = 45;
      }
      
      if (this.walking == false) {
        this.walking = true;
      }
    }

    if (keys.a) {
      this.velX = -5;
      this.turn = -1;
      if (this.walking == false) {
        this.walking = true;
      }
    }

    if (keys.s) {
      this.velY = 5;
      if (this.turn == -1) {
        this.rotate = -45;
      } else {
        this.rotate = 45;
      }

      if (this.walking == false) {
        this.walking = true;
      }
    }

    if (keys.d) {
      this.velX = 5;
      this.turn = 1;
      if (this.walking == false) {
        this.walking = true;
      }
    }

    if (!keys.d && !keys.a) {
      this.velX = 0;
    }

    if (!keys.w && !keys.s) {
      this.velY = 0;
      this.rotate = 0;
    }
    
    if (!keys['d'] && !keys['a']) {
      if (!keys['w'] && !keys['s']) {
        this.walking = false;
      }
    }

    if (this.x >= canvas.width) {
      if (!this.isBoss) {
        this.x = 0;
        this.burgers = [];
        background.chooseBackground();
        this.bossChance = (Math.floor(Math.random() * 100));
        if (this.bossChance <= 10) {
          this.isBoss = true;
          background.chooseBossSong();
        }
        enemyBuilder.buildEnemies();
      } else {
        this.x = canvas.width - player.width;
      }   
    } else if (this.x <= 0 - this.width) {
      if (!this.isBoss) {
        this.x = canvas.width;
        this.burgers = [];
        background.chooseBackground();
        this.bossChance = (Math.floor(Math.random() * 100));
        if (this.bossChance <= 10) {
          this.isBoss = true;
          background.chooseBossSong();
        }
        enemyBuilder.buildEnemies();
      } else {
        this.x = 0 + player.width;
      }
    }

    if (this.y >= canvas.height) {
      if (!this.isBoss) {
        this.y = 0;
      this.burgers = [];
      background.chooseBackground();
      this.bossChance = (Math.floor(Math.random() * 100));
      if (this.bossChance <= 10) {
        this.isBoss = true;
        background.chooseBossSong();
      }
      enemyBuilder.buildEnemies();
      } else {
        this.y = canvas.height - player.height;
      }
    } else if (this.y <= 0 - this.height) {
      if (!this.isBoss) {
        this.y = canvas.height;
      this.burgers = [];
      background.chooseBackground();
      this.bossChance = (Math.floor(Math.random() * 100));
      if (this.bossChance <= 10) {
        this.isBoss = true;
        background.chooseBossSong();
      }
      enemyBuilder.buildEnemies();
      } else {
        this.y = 0 + player.height;
      }
    }
  }

  //Control player shooting
  shoot() {
    let newX;
    let newY;
    let velX;
    let velY;

    if (this.turn == -1) {
      newX = ((this.x - this.width) - 10);
      newY = ((this.y + this.height / 2) - 10);
      velX = -6;
      velY = -(Math.sin(this.rotate) * 5);
    } else {
      newX = ((this.x + this.width) - 10);
      newY = ((this.y + this.height / 2) - 10);
      velX = 6;
      velY = Math.sin(this.rotate) * 5;
    }

    if (keys[' '] && this.shootDelay <= 0) {
      this.burgers.push(new Cheeseburger(newX, newY, velX, velY));
      this.shootDelay = 10;

      let burgerSFX = new Audio(audio.sfx.shoot);
      burgerSFX.controls = true;
      burgerSFX.volume = 0.2;
      burgerSFX.play();
    }

    this.shootDelay--;
  }
  //Render the player
  update() {
    this.x += this.velX;
    this.y += this.velY;

    this.move();
    this.shoot();

    if (this.bossChance < 10) {
      background.isBoss = true;
    }

    c.save();
    c.translate((this.x + this.offsetX), (this.y + this.offsetY));
    c.rotate(this.rotate);
    c.translate(-(this.x + this.offsetX), -(this.y + this.offsetY));
    c.scale(this.turn, 1);
    c.drawImage(this.img, this.x*this.turn, this.y, this.width*this.turn, this.height);
    c.restore();

    if (this.walking) {
      this.walkingSFX.play();
    } else {
      this.walkingSFX.pause();
    }
  }
}