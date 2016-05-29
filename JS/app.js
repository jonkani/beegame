var gameProperties = {
    screenWidth: 800,
    screenHeight: 600,
};

var states = {
    game: "game",
};

var assets = {
  bee1: {URL: 'Sprites/bee1.png', name: 'bee1'},
  bee2: {URL: 'Sprites/bee2.png', name: 'bee2'},

  stinger: {URL: 'Sprites/stinger.png', name: 'stinger'}
}

var beeProperties = {
  startX: gameProperties.screenWidth * 0.25,
  startY: gameProperties.screenHeight * 0.5,
  acceleration: 400,
  drag: 25,
  maxVelocity: 500,
  angularVelocity: 300,
};

var gameState = function(game){
  this.beeSprite1;
  this.beeSpite2;
  this.stingerSprite;

  this.key_left;
  this.key_right;
  this.key_forward;
};

gameState.prototype = {

    preload: function () {
      game.load.image(assets.bee1.name, assets.bee1.URL);
      game.load.image(assets.bee2.name, assets.bee2.URL);
      game.load.image(assets.stinger.name, assets.stinger.URL);
    },

    create: function () {
      this.initGraphics();
      this.initKeyboard();
      this.initPhysics();
      game.stage.backgroundColor = '#000fff';
    },

    update: function () {
      this.checkPlayerInput();
      game.physics.arcade.collide(this.beeSprite1, this.beeSprite2)
    },

    initGraphics: function() {
      this.beeSprite1 = game.add.sprite(beeProperties.startX, beeProperties.startY, assets.bee1.name);
      this.beeSprite1.angle = -90;
      this.beeSprite1.anchor.set(0.5, 0.5);
      this.beeSprite1.addChild(game.make.sprite(-80, -10, assets.stinger.name))

      this.beeSprite2 = game.add.sprite(gameProperties.screenWidth * 0.75, gameProperties.screenHeight * 0.5, assets.bee2.name);
      this.beeSprite2.angle = 90;
      this.beeSprite2.anchor.set(0.5, 0.5);
      this.beeSprite2.addChild(game.make.sprite(-80, -10, assets.stinger.name))
    },

    initPhysics: function() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.physics.enable(this.beeSprite1, Phaser.Physics.ARCADE);
      this.beeSprite1.body.drag.set(beeProperties.drag);
      this.beeSprite1.body.maxVelocity.set(beeProperties.maxVelocity);
      this.beeSprite1.body.bounce.set(0.9, 0.9);
      this.beeSprite1.body.collideWorldBounds = true;

      game.physics.enable(this.beeSprite2, Phaser.Physics.ARCADE);
      this.beeSprite2.body.drag.set(beeProperties.drag);
      this.beeSprite2.body.maxVelocity.set(beeProperties.maxVelocity);
      this.beeSprite2.body.bounce.set(0.9, 0.9);
      this.beeSprite2.body.collideWorldBounds = true;
    },

    initKeyboard: function() {
      this.key_left1 = game.input.keyboard.addKey(Phaser.Keyboard.A);
      this.key_right1 = game.input.keyboard.addKey(Phaser.Keyboard.D);
      this.key_forward1 = game.input.keyboard.addKey(Phaser.Keyboard.W);

      this.key_left2 = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.key_right2 = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.key_forward2 = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    },

    checkPlayerInput: function() {
      if (this.key_left1.isDown) {
        this.beeSprite1.body.angularVelocity = -beeProperties.angularVelocity;
      }
      else if (this.key_right1.isDown) {
        this.beeSprite1.body.angularVelocity = beeProperties.angularVelocity;
      }
      else {
        this.beeSprite1.body.angularVelocity = 0;
      }

      if (this.key_forward1.isDown) {
        game.physics.arcade.accelerationFromRotation(this.beeSprite1.rotation, beeProperties.acceleration, this.beeSprite1.body.acceleration);
      }
      else {
        this.beeSprite1.body.acceleration.set(0);
      }

      if (this.key_left2.isDown) {
        this.beeSprite2.body.angularVelocity = -beeProperties.angularVelocity;
      }
      else if (this.key_right2.isDown) {
        this.beeSprite2.body.angularVelocity = beeProperties.angularVelocity;
      }
      else {
        this.beeSprite2.body.angularVelocity = 0;
      }

      if (this.key_forward2.isDown) {
        game.physics.arcade.accelerationFromRotation(this.beeSprite2.rotation, beeProperties.acceleration, this.beeSprite2.body.acceleration);
      }
      else {
        this.beeSprite2.body.acceleration.set(0);
      }
    },

};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
