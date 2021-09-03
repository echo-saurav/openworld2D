const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

const config = {
  type: Phaser.AUTO, // Which renderer to use
  width: windowWidth, // Canvas width in pixels
  height: windowHeight, // Canvas height in pixels
  parent: "game-container", // ID of the DOM element to add the canvas to
  scene: {
    preload: preload,
    create: create,
    update: update,
  },

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // Top down game, so no gravity
    },
  },
};

const game = new Phaser.Game(config);
let controls;

function preload() {
  // preload start
  var progressBar = this.add.graphics();
  var progressBox = this.add.graphics();

  var width = this.cameras.main.width;
  var height = this.cameras.main.height;

  progressBox.fillStyle(0x222222, 0.8);
  // progressBox.fillRect(240, 270, 320, 50);
  progressBox.fillRect(width / 2, height / 2, 320, 50);

  var loadingText = this.make.text({
    x: width / 2,
    y: height / 2 - 50,
    text: "Loading...",
    style: {
      font: "20px monospace",
      fill: "#ffffff",
    },
  });
  loadingText.setOrigin(0.5, 0.5);

  var percentText = this.make.text({
    x: width / 2,
    y: height / 2 - 5,
    text: "0%",
    style: {
      font: "18px monospace",
      fill: "#ffffff",
    },
  });
  percentText.setOrigin(0.5, 0.5);

  var assetText = this.make.text({
    x: width / 2,
    y: height / 2 + 50,
    text: "",
    style: {
      font: "18px monospace",
      fill: "#ffffff",
    },
  });
  assetText.setOrigin(0.5, 0.5);

  this.load.on("progress", function (value) {
    percentText.setText(parseInt(value * 100) + "%");
    progressBar.clear();
    progressBar.fillStyle(0xffffff, 1);
    progressBar.fillRect(250, 280, 300 * value, 30);
  });

  this.load.on("fileprogress", function (file) {
    assetText.setText("Loading asset: " + file.key);
  });
  this.load.on("complete", function () {
    progressBar.destroy();
    progressBox.destroy();
    loadingText.destroy();
    percentText.destroy();
    assetText.destroy();
  });

  for (var i = 0; i < 10000; i++) {
    // preload screen end
    this.load.image("mario-tiles", "./assets/overworld.png");
    // this.load.tilemapTiledJSON("map", "./assets/map.json");
    this.load.tilemapTiledJSON("map", "./assets/testMap.json");
    this.load.atlas(
      "atlas",
      "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.png",
      "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.json"
    );
  }
}

function create() {
  // When loading from an array, make sure to specify the tileWidth and tileHeight
  // const map = this.make.tilemap({ data: level, tileWidth: 16, tileHeight: 16 });
  const map = this.make.tilemap({ key: "map" });

  const tileset = map.addTilesetImage("overworld", "mario-tiles");
  // const tiles = map.addTilesetImage("mario-tiles");
  // const layer = map.createLayer(0, tiles, 0, 0);
  const belowLayer = map.createLayer("ground", tileset, 0, 0);
  const worldLayer = map.createLayer("world", tileset, 0, 0);
  const aboveLayer = map.createLayer("above", tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });
  //
  // Phaser supports multiple cameras, but you can access the default camera like this:
  // const camera = this.cameras.main;

  // Set up the arrows to control the camera
  // const cursors = this.input.keyboard.createCursorKeys();
  // controls = new Phaser.Cameras.Controls.FixedKeyControl({
  //   camera: camera,
  //   left: cursors.left,
  //   right: cursors.right,
  //   up: cursors.up,
  //   down: cursors.down,
  //   speed: 0.5,
  // });

  // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
  // camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  // camera.setBounds(0, 0, 10000, 10000);
  // Help text that has a "fixed" position on the screen
  this.add
    .text(16, 16, "Arrow keys to scroll", {
      font: "11px monospace",
      fill: "#ffffff",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000000",
    })
    .setScrollFactor(0);

  // player stuff
  player = this.physics.add
    .sprite(0, 0, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);

  this.physics.add.collider(player, worldLayer);
  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  const anims = this.anims;
  anims.create({
    key: "misa-left-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-left-walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "misa-right-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-right-walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "misa-front-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-front-walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });
  anims.create({
    key: "misa-back-walk",
    frames: anims.generateFrameNames("atlas", {
      prefix: "misa-back-walk.",
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  //
  // Phaser supports multiple cameras, but you can access the default camera like this:
  const camera = this.cameras.main;

  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();

  // Help text that has a "fixed" position on the screen
  this.add
    .text(16, 16, 'Arrow keys to move\nPress "D" to show hitboxes', {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 20, y: 10 },
      backgroundColor: "#ffffff",
    })
    .setScrollFactor(0)
    .setDepth(30);

  // Debug graphics
  this.input.keyboard.once("keydown-D", (event) => {
    // Turn on physics debugging to show player's hitbox
    this.physics.world.createDebugGraphic();

    // Create worldLayer collision graphic above the player, but below the help text
    const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
    worldLayer.renderDebug(graphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    });
  });
}

function update(time, delta) {
  // Apply the controls to the camera each update tick of the game
  // controls.update(delta);

  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
    player.anims.play("misa-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("misa-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("misa-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("misa-front-walk", true);
  } else {
    player.anims.stop();

    // If we were moving, pick and idle frame to use
    if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
    else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
    else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
    else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
  }
}
