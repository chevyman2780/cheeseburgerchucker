class Cheeseburger {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.width = 51;
    this.height= 44;
    this.shotSFX = new Audio(audio.sfx.shoot);
    this.angle = 0;
    this.offsetX = (this.width / 2);
    this.offsetY = (this.height / 2);
    this.outside = false;
    this.image = new Image();
    this.image.src = "./Pictures/cheeseburgerSpriteSUPER.png";
    this.hitbox = {x: x, y: y, width: 50, height: 50}
    this.dmg = 10;
  }

  rotateCheeseburger() {
    this.angle += 0.1;
  }

  collision() {
    if (this.x < 0 - 50) {
      this.outside = true;
    } else if (this.x > canvas.width + 50) {
      this.outside = true;
    } 

    if (this.y < 0 - 50) {
      this.outside = true;
    } else if (this.y > canvas.height + 50) {
      this.outside = true;
    }
  }

  //Render burger
  update() {
    this.x += this.velX;
    this.y += this.velY;

    this.hitbox.x = this.x;
    this.hitbox.y = this.y;
    
    this.rotateCheeseburger();
    this.collision();

    c.fillStyle = 'blue';
    c.save();
    c.translate((this.x + this.offsetX), (this.y + this.offsetY));
    c.rotate(this.angle);
    c.translate(-(this.x + this.offsetX), -(this.y + this.offsetY));
    c.drawImage(this.image, this.x, this.y, this.width, this.height);
    // c.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
    c.restore();
  }
}