//Constants
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
const fps = 60;

//Setup canvas
canvas.style.left = '50px';
canvas.style.top = '50px';
canvas.width = (window.innerWidth * 0.90);
canvas.height = (window.innerHeight * 0.90);

//Create player
let player = new Player();
//Create renderer
let renderer = new Renderer();
//Create background
let background = new Background();
//Create collision checker
let collision = new Collide();
//Create enemy builder
let enemyBuilder = new EnemyBuilder();

function keyHandler(event) {
  if (event.type === 'keydown') keys[event.key] = true;
  if (event.type === 'keyup') keys[event.key] = false;
}

function main() {
  player.burgers.forEach((burger, i) => {
    if (burger.outside) {
      player.burgers.splice(i, 1);
    }
  })

  renderer.draw();
}

setInterval(() => {
  main();
}, 1000/fps);

background.chooseBackground();
background.chooseSong();
enemyBuilder.buildEnemies();

document.addEventListener('keydown', keyHandler);
document.addEventListener('keyup', keyHandler);