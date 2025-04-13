let enemySprite = {
  velX: 0,
  velY: 0,
  speed: 2,
  width: 400,
  height: 245,
  health: 20,
  hitbox: {x: 0, y: 0, width: 120, height: 170},
  src: './Pictures/enemySprite.png',
  id: 'enemy1'
}

let enemylvl2 = {
  velX: 0,
  velY: 0,
  speed: 1,
  width: 400,
  height: 245,
  health: 60,
  hitbox: {x: 0, y: 0, width: 120, height: 170},
  src: './Pictures/enemylvl2Sprite.png',
  id: 'enemy2'
}

let tank = {
  velX: 0,
  velY: 0,
  speed: 0.5,
  width: 400,
  height: 245,
  health: 100,
  hitbox: {x: 0, y: 0, width: 130, height: 200},
  src: './Pictures/TankSprite.png',
  id: 'tank'
}

let ranged = {
  velX: 0,
  velY: 0,
  speed: 0.1,
  width: 400,
  height: 245,
  hitbox: {x: 0, y: 0, width: 120, height: 160},
  health: 50,
  src: './Pictures/rangedSprite.png',
  id: 'ranged'
}

let showerBoss = {
  velX: 0,
  velY: 0,
  speed: 0.7,
  width: (2*400),
  height: (2*245),
  health: 300,
  hitbox: {x: 0, y: 0, width: (200), height: (400)},
  src: './Pictures/showerbossSprite.png',
  id: 'shower-boss'
}

class Enemy {
  constructor(x, y, velX, velY, width, height, skin, speed, hitbox, health, id) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.skin = skin;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.health = health
    this.hitbox = hitbox;
    this.id = id;
  }
}

class EnemyBuilder {
  constructor() {
    this.enemies = [];
    this.enemySprites = [
      enemySprite,
      enemylvl2,
      tank,
      ranged
    ]

    this.bosses = [
      showerBoss
    ]

    this.enemyCount = 5;
  }

  pathFinding() {
    for (let i=0; i<this.enemies.length; i++) {
      let enemy = this.enemies[i];

      let diffX = (player.x + player.width/2) - (enemy.x + enemy.width/2);
      let diffY = (player.y + player.height/2) - (enemy.y + enemy.height/2);

      let angle = Math.atan2(diffY, diffX);

      enemy.velX = Math.cos(angle) * enemy.speed;
      enemy.velY = Math.sin(angle) * enemy.speed;
    }
  }

  collide() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      let enemy = this.enemies[i];
      for (let j = player.burgers.length - 1; j >= 0; j--) {
        let burger = player.burgers[j];

        if (collision.checkHit(enemy.hitbox, burger.hitbox)) {
          if (enemy.health <= 0) {
            this.enemies.splice(i, 1);
            i--;

            if (enemy.id == 'shower-boss') {
              background.chooseSong();
              player.isBoss = false;
            }
          }
          
          enemy.health -= burger.dmg;
          player.burgers.splice(j, 1);
          j--;
          break;
        }
      }
    }
  }

  buildEnemies() {
    if (player.bossChance > 10) {
      this.enemies = [];
      for (let i=0; i<this.enemyCount; i++) {
        let enemyX = Math.floor(Math.random() * (canvas.width - 400));
        let enemyY = Math.floor(Math.random() * (canvas.height - 245));

        let index = Math.floor(Math.random() * this.enemySprites.length);
        let chosen = this.enemySprites[index];
      
        let skin = new Image();
        skin.src = chosen.src;

        let build = new Enemy(
          enemyX,
          enemyY,
          chosen.velX,
          chosen.velY,
          chosen.width,
          chosen.height,
          skin,
          chosen.speed,
          {
            x: 0,
            y: 0,
            width: chosen.hitbox.width,
            height: chosen.hitbox.height
          },
          chosen.health,
          chosen.id
        )
        this.enemies.push(build);
      }
    } else {
      this.enemies = [];
      let index = Math.floor(Math.random() * this.bosses.length);
      let chosen = this.bosses[index];

      let enemyX = canvas.width/2 - chosen.width;
      let enemyY = canvas.height/2 - chosen.height

      let skin = new Image();
      skin.src = chosen.src;

      let build = new Enemy(
        enemyX,
        enemyY,
        chosen.velX,
        chosen.velY,
        chosen.width,
        chosen.height,
        skin,
        chosen.speed,
        {
          x: 0,
          y: 0,
          width: chosen.hitbox.width,
          height: chosen.hitbox.height
        },
        chosen.health,
        chosen.id
      )

      this.enemies.push(build)
    }
  }

  update() {
    this.pathFinding();
    this.enemies.forEach(enemy => {
      enemy.x += enemy.velX;
      enemy.y += enemy.velY;

      //!!DO NOT TOUCH VALUES, HARDCALCULATED TO COVER BOSS!!
      if (enemy.id == 'shower-boss') {
        enemy.hitbox.x = enemy.x + (enemy.width * 0.43);
        enemy.hitbox.y = enemy.y + (enemy.height * 0.07);
      } else {
        enemy.hitbox.x = enemy.x + enemy.width/3;
        enemy.hitbox.y = enemy.y + enemy.height/4;
      }

      c.drawImage(enemy.skin, enemy.x, enemy.y, enemy.width, enemy.height);

      // c.fillStyle = 'blue';
      // c.fillRect(enemy.hitbox.x, enemy.hitbox.y, enemy.hitbox.width, enemy.hitbox.height);
    })

    this.collide();
  }
}