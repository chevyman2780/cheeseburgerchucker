const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
const fps = 60;

//Setup canvas
canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.95;
canvas.style.position = 'absolute';
canvas.style.left = '50px';
canvas.style.top = '10px';

//Control window color
document.body.style.backgroundColor = 'black';

//Setup dungeon backgrounds
let dungeons_imgs = [
  './Pictures/dungeon1.png',
  './Pictures/dungeon2.png',
  './Pictures/dungeon3.png',
  './Pictures/backgroundSprite.png'
]

let bckndImg = '';

let enemySprite = {
  velX: 0,
  velY: 0,
  src: './Pictures/enemySprite.png'
}

let enemylvl2 = {
  velX: 0,
  velY: 0,
  src: './Pictures/enemylvl2Sprite.png'
}

let tank = {
  velX: 0,
  velY: 0,
  src: './Pictures/TankSprite.png'
}

let ranged = {
  velX: 0,
  velY: 0,
  src:  './Pictures/rangedSprite.png'
}

//Setup enemy sprites
let enemySprites = [
  enemySprite,
  enemylvl2,
  tank,
  ranged
]

//Setup theme music
let themeMusic = [
  './Sounds/MetalDub.mp3',
  './Sounds/dubLogo.mp3',
  './Sounds/pixelDubstep.mp3'
]

//Setup game
let sfx = {
  shoot: './Sounds/plasmaShot.mp3',
  walking: './Sounds/walking.mp3'
}

//Setup keys
let keys = {};

//Define classes
class Player {
  constructor() {
    this.pos = {
      x: 50,
      y: 120
    }
    this.vel = {
      x: 0,
      y: 0
    }
    this.width = (35*2);
    this.height = (100*2);
    this.img = new Image();
    this.img.src = "./Pictures/newJaspser.png";
    this.turn = 1;
    this.rotate = 0;
    this.offsetX = this.width / 2;
    this.offsetY = this.height / 2;
    this.walking = false;
    this.walkingSFX = new Audio(sfx.walking);
  }

  //Move player
  move() {
    if (keys.w) {
      this.vel.y = -5;
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
      this.vel.x = -5;
      this.turn = -1;
      if (this.walking == false) {
        this.walking = true;
      }
    }

    if (keys.s) {
      this.vel.y = 5;
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
      this.vel.x = 5;
      this.turn = 1;
      if (this.walking == false) {
        this.walking = true;
      }
    }

    if (!keys.d && !keys.a) {
      this.vel.x = 0;
    }

    if (!keys.w && !keys.s) {
      this.vel.y = 0;
      this.rotate = 0;
    }
    
    if (!keys['d'] && !keys['a']) {
      if (!keys['w'] && !keys['s']) {
        this.walking = false;
      }
    }

    if (this.pos.x >= canvas.width) {
      this.pos.x = 0 - this.width;
      chooseBackground();
      createEnemies();
    } else if (this.pos.x <= 0 - this.width) {
      this.pos.x = canvas.width;
      chooseBackground();
      createEnemies();
    }

    if (this.pos.y >= canvas.height) {
      this.pos.y = 0;
      chooseBackground();
      createEnemies();
    } else if (this.pos.y <= 0 - this.height) {
      this.pos.y = canvas.height;
      chooseBackground();
      if (enemies.length == 0);
      createEnemies();
    }
  }
  //Render player
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.move();
    c.save();
    c.translate((this.pos.x + this.offsetX), (this.pos.y + this.offsetY));
    c.rotate(this.rotate);
    c.translate(-(this.pos.x + this.offsetX), -(this.pos.y + this.offsetY));
    c.scale(this.turn, 1);
    c.drawImage(this.img, this.pos.x*this.turn, this.pos.y, this.width*this.turn, this.height);
    c.restore();

    if (this.walking) {
      this.walkingSFX.play();
    } else {
      this.walkingSFX.pause();
    }
  }
}

//Setup projectiles
class Cheeseburger {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.vel = {
      x: velX, 
      y: velY
    }
    this.width = 51;
    this.height= 44;
    this.hitBox = {
      width: 50,
      height: 41
    }
    this.angle = 0;
    this.offsetX = (this.width / 2);
    this.offsetY = (this.height / 2);
    this.outside = false;
    this.image = new Image();
    this.image.src = "./Pictures/cheeseburgerSpriteSUPER.png";
  }

  //Rotate burger
  rotateCheeseburger() {
    this.angle += 0.1;
  }

  //Check burger collisions
  collision() {
    if (this.x > canvas.width + 50) {
      this.outside = true;
    }
  }

  //Render burger
  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    
    this.rotateCheeseburger();
    this.collision();

    c.fillStyle = 'orange';
    c.save();
    c.translate((this.x + this.offsetX), (this.y + this.offsetY));
    c.rotate(this.angle);
    c.translate(-(this.x + this.offsetX), -(this.y + this.offsetY));
    c.drawImage(this.image, this.x, this.y, this.width, this.height);
    c.restore();
  }
}

//Setup enemies
class Enemy {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.width = 400;
    this.height = 245;
    this.hitBox = {
      width: 60,
      height: (2*137)
    }
    this.skin = '';
    this.choseSkin = false;
  }

  chooseSkin() {
    let index = Math.floor(Math.random() * enemySprites.length);

    let chosen = enemySprites[index];

    this.skin = new Image();
    this.skin.src = chosen.src;
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;
    c.drawImage(this.skin, this.x, this.y, this.width, this.height);
  }
}

//Defining player
let player = new Player();

//Control keystrokes
function keyHandler(event) {
  if (event.type == 'keydown') keys[event.key] = true;
  if (event.type == 'keyup') keys[event.key] = false;
}

//Create cheeseburgers
let cheeseburgers = [];
let delay = 0;
function shootCheeseburger() {
  if (delay <= 0 && keys[' ']) {
    let offsetX = 0;
    let offsetY = 0;
    let newVelX = 0;
    let newVelY = 0;

    //Control cheeseburger direction
    if (player.turn == -1) {
      newVelY = -(Math.sin(player.rotate) * 5);
      newVelX = -6;
      offsetX = ((player.pos.x - player.width) - 10);
      offsetY = ((player.pos.y + player.height / 2) - 10);
    } else {
      newVelY = Math.sin(player.rotate) * 5;
      newVelX = 6;
      offsetX = ((player.pos.x + player.width) - 10);
      offsetY = ((player.pos.y + player.height / 2) - 10);
    }

    let cheeseburger = new Cheeseburger(offsetX, offsetY, newVelX, newVelY);
    cheeseburgers.push(cheeseburger);
    delay = 10;

    let audio = new Audio(sfx.shoot);
    audio.play();
    audio.controls = true;
    audio.volume = 0.2;
  }
}

//Create amount of enemies per dungeon
let enemyCount = 5;
let enemies = [];
function createEnemies() {
  for (let i=0; i<enemyCount; i++) {
    let enemyX = Math.floor(Math.random() * (canvas.width - 400));
    let enemyY = Math.floor(Math.random() * (canvas.height - 245));

    enemies.push(new Enemy(enemyX, enemyY, 0, 0));
  }
}

//Create pathfinding for enemies
function pathfinding() {
  enemies.forEach(enemy => {
    let diffX = (player.pos.x - enemy.x);
    let diffY = (player.pos.y - enemy.y);

    let angle = Math.atan2(diffY, diffX);

    let newVelX = Math.cos(angle) * 1.7;
    let newVelY = Math.sin(angle) * 1.7;

    enemy.velX = newVelX;
    enemy.velY = newVelY;
  })
}

function collision() {
  enemies.forEach((enemy, e) => {
    cheeseburgers.forEach((burger, b) => {
      if (burger.x + burger.hitBox.width > enemy.x &&
          burger.x < enemy.x + enemy.hitBox.width &&
          burger.y + burger.hitBox.height > enemy.y &&
          burger.y < enemy.y + enemy.hitBox.height) {

          enemies.splice(e, 1);
          e--;

          cheeseburgers.splice(b, 1);
          b--;    
      }
    })
    
    console.log(enemy);
  })
}

//Choose background theme song
let song = '';
let audio = 0;
function chooseSong() {
  song = new Audio(themeMusic[audio]);
  song.controls = true;
  song.volume = 0.1;
}

//Choose dungeon background
let background = '';
let lastChosen = '';
function chooseBackground() {
  let availableBackgrounds = dungeons_imgs.filter(img => img !== lastChosen);
  let index = Math.floor(Math.random() * availableBackgrounds.length);
  let chosen = availableBackgrounds[index];

  lastChosen = chosen;
  background = new Image();
  background.src = chosen;
}

//Run the game
function run() {
  shootCheeseburger();
  pathfinding();
  if (delay >= 0) delay--;
  
  if (song.ended) {
    chooseSong();
    audio += 1;
    if (audio == themeMusic.length) {
      audio = 0;
    }
  }

  if (!song == '') {
    song.play();
  }

  collision();
}

//Render the game
function render() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  if (background != '') {
    c.drawImage(background, 0, 0, canvas.width, canvas.height);
  }
  
  //Render players
  player.update();

  //Render each burger
  cheeseburgers.forEach((cheeseburger, i) => {
    cheeseburger.update();

    if (cheeseburger.outside) {
      cheeseburgers.splice(i, 1);
      i--;
    }
  })

  if (dungeons_imgs.length == 0) {
    dungeons_imgs = [
      './Pictures/dungeon1.png',
      './Pictures/dungeon2.png',
      './Pictures/dungeon3.png',
      './Pictures/backgroundSprite.png'
    ]
  }

  enemies.forEach((enemy, i) => {
    if (enemy.choseSkin == false) {
      enemy.chooseSkin();
      enemy.choseSkin = true;
    }
    
    if (enemy.choseSkin == true) {
      enemy.update();
    }
  })
}

//Loop game
setInterval(() => {
  run();
  render();
}, 1000/fps)

//Choose the first song for loop
chooseSong();

//Choose the first background for loop
chooseBackground();

//Setup event listeners
document.addEventListener('keydown', keyHandler);
document.addEventListener('keyup', keyHandler);