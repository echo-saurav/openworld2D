var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.spritesheet("dude", "assets/female.png", {
    frameWidth: 192,
    frameHeight: 256,
  });
  //
  this.player = null;
  this.cursors = null;
  this.score = 0;
  this.scoreText = null;
}

function create() {
  var platforms = this.physics.add.staticGroup();
  this.add.image(400, 300, "sky");
  platforms.create(600, 400, "ground");

  this.player = this.physics.add.sprite(100, 450, "dude");

  this.player.setBounce(0.1);
  this.player.setCollideWorldBounds(true);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160);

    this.player.anims.play("left", true);
  }
}
