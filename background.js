class Background {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    this.dungeon_imgs = [
      './Pictures/dungeon1.png',
      './Pictures/dungeon2.png',
      './Pictures/dungeon3.png',
      './Pictures/backgroundSprite.png'
    ]
    this.chosenBackground = new Image();
    this.chooseBackground.src = '';
    this.lastChosen = '';
    this.pickedSong = '';
    this.song = new Audio();
    this.song.src = '';
    this.music = [
      './Sounds/MetalDub.mp3',
      './Sounds/dubLogo.mp3',
      './Sounds/pixelDubstep.mp3',
      './Sounds/BFGD.mp4',
      './Sounds/Solaris Phase 2.mp4',
      './Sounds/Doom Hunted.mp4',
      './Sounds/Cultist Base.mp4'
    ]
    this.bossMusic = [
      './Sounds/No cure.mp4',
      './Sounds/Milky Ways.mp4',
      './Sounds/BFGDD.mp4',
      './Sounds/Your best Nightmare.mp4'
    ]
    this.lastSong = '';
    this.availableSongs = [];
  }

  chooseBackground() {
    let availableBackgrounds = this.dungeon_imgs.filter(img => img !== this.lastChosen);
    let index = Math.floor(Math.random() * availableBackgrounds.length);

    let chosen = availableBackgrounds[index];
    this.lastChosen = chosen;

    this.chosenBackground.src = chosen;
  }

  chooseSong() {
    this.availableSongs = this.music.filter(sng => sng !== this.lastSong);
    let index = Math.floor(Math.random() * this.availableSongs.length);
    let chosen = this.availableSongs[index];

    this.lastSong = chosen;

    this.song.src = chosen;
    this.song.controls = true;
    this.song.volume = 0.2;
    this.song.play();
  }

  chooseBossSong() {
    this.availableSongs = this.bossMusic.filter(sng => sng !== this.lastSong);
    let index = Math.floor(Math.random() * this.availableSongs.length);
    let chosen = this.availableSongs[index];

    this.lastSong = chosen;

    this.song.src = chosen;
    this.song.controls = true;
    this.song.volume = 0.2;
    this.song.play();
  }

  update() {
    if (this.song.ended) {
      this.chooseSong();
    }
    c.drawImage(this.chosenBackground, this.x, this.y, this.width, this.height);
  }
}