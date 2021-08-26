var height = window.innerHeight;
var width = window.innerWidth;
console.log("height:", height);
console.log("width:", width);
var config = {
  type: Phaser.AUTO,
  width: width,
  height: height,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: {
    preload: preload,
    create: create,
  },
  pixelArt: true, //here
  //antialias: false,
};

var game = new Phaser.Game(config);

function preload() {
  this.load.setBaseURL("http://labs.phaser.io");

  this.load.image("logo", "assets/sprites/phaser3-logo.png");
  this.load.image("red", "assets/particles/red.png");
  this.load.image(
    "dp",
    "https://scontent.fdac5-2.fna.fbcdn.net/v/t1.6435-1/s200x200/131373519_4898584593544987_6108554592460570347_n.jpg?_nc_cat=102&ccb=1-5&_nc_sid=7206a8&_nc_ohc=NGYOs29dKhYAX8FLWRf&tn=TCaiszuMfyEKfth5&_nc_ht=scontent.fdac5-2.fna&oh=81c60a9f7fc8245231cc4707923f94b4&oe=614F480E"
  );
}

function create() {
  console.log(`height ${height}, width: ${width}`);

  var particles = this.add.particles("red");

  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: "ADD",
  });

  var logo = this.physics.add.image(100, 100, "dp");
  logo.displayHeight = 100;
  logo.displayWidth = 100;
  //
  var logo2 = this.physics.add.image(200, 400, "dp");
  logo2.displayHeight = 100;
  logo2.displayWidth = 100;
  //
  var logo3 = this.physics.add.image(240, 304, "dp");
  logo3.displayHeight = 100;
  logo3.displayWidth = 100;
  //
  var logo4 = this.physics.add.image(50, 450, "dp");
  logo4.displayHeight = 100;
  logo4.displayWidth = 100;
  //
  logo.setVelocity(100, 600);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);
  //
  logo2.setVelocity(600, -200);
  logo2.setBounce(1, 1);
  logo2.setCollideWorldBounds(true);
  //
  logo3.setVelocity(200, 100);
  logo3.setBounce(1, 1);
  logo3.setCollideWorldBounds(true);
  //
  logo4.setVelocity(-600, -600);
  logo4.setBounce(1, 1);
  logo4.setCollideWorldBounds(true);

  emitter.startFollow(logo);
}
