var gameProperties = {
    screenWidth: 1000,
    screenHeight: 650,
};

var states = {
    game: "game",
};

var assets = {
  bee1: {URL: 'Sprites/Bee1.png', name: 'bee1'},
  bee2: {URL: 'Sprites/Bee22.png', name: 'bee2'},

  stinger1: {URL: 'Sprites/Stinger1.png', name: 'Stinger1'},
  stinger2: {URL: 'Sprites/Stinger2.png', name: 'Stinger2'},

  stingBlank: {name: 'stingBlank'}
}

var beeProperties = {
  startX: gameProperties.screenWidth * 0.25,
  startY: gameProperties.screenHeight * 0.5,
  acceleration: 500,
  drag: 25,
  maxVelocity: 500,
  angularVelocity: 150,
};

var gameState = function(game){
  this.beeSprite1;
  this.beeSpite2;
  this.stingerSprite1;
  this.stingerSprite2;

  this.key_left1;
  this.key_right1;
  this.key_forward1;
  this.key_left2;
  this.key_right2;
  this.key_forward2;
};

gameState.prototype = {

    preload: function () {
      game.load.image(assets.bee1.name, assets.bee1.URL);
      game.load.image(assets.bee2.name, assets.bee2.URL);
      game.load.image(assets.stinger1.name, assets.stinger1.URL);
      game.load.image(assets.stinger2.name, assets.stinger2.URL);
      this.game.load.physics("stinger_physics", "assets/stinger2.json");
    },

    create: function () {
      game.world.setBounds(0, 0, 1000, 650);
      game.physics.startSystem(Phaser.Physics.P2JS);
      game.physics.p2.setImpactEvents(true);
      game.physics.p2.restitution = 0.8;

      // create bee 1
      this.beeSprite1 = game.add.sprite(beeProperties.startX, beeProperties.startY, assets.bee1.name);
      this.beeSprite1.anchor.set(0.5, 0.5);

      // create bee 2
      this.beeSprite2 = game.add.sprite(gameProperties.screenWidth * 0.75, gameProperties.screenHeight * 0.5, assets.bee2.name);
      this.beeSprite2.anchor.set(0.5, 0.5);

      // create stingers
      this.stinger1 = game.add.sprite(0, 0, assets.stinger1.name);
      this.stinger2 = game.add.sprite(0, 0, assets.stinger2.name);

      // turn on physics for sprites
      this.game.physics.p2.enable(this.beeSprite1);
      this.beeSprite1.body.angle = 0;
      this.game.physics.p2.enable(this.beeSprite2);
      this.beeSprite2.body.angle = 180;
      this.game.physics.p2.enable(this.stinger1);
      this.game.physics.p2.enable(this.stinger2);
      this.stinger1.body.kinematic = true;
      this.stinger2.body.kinematic = true;


      this.stingPositioner1 = game.add.sprite(0, 70);
      this.stingPositioner1.anchor.set(0.5, 0.5);
      this.stingPositioner1.pivot.set(0, 0);
      this.beeSprite1.addChild(this.stingPositioner1);

      this.stingPositioner2 = game.add.sprite(0, 70);
      this.stingPositioner2.anchor.set(0.5, 0.5);
      this.stingPositioner2.pivot.set(0, 0);
      this.beeSprite2.addChild(this.stingPositioner2);



      // create walls
      var hBlockShape = this.game.add.bitmapData(this.game.world.width, 10);
      var vBlockShape = this.game.add.bitmapData(10, this.game.world.height);

      // fill block shapes
      hBlockShape.ctx.rect(0, 0, this.game.world.width, 10);
      hBlockShape.ctx.fillStyle = '000';
      hBlockShape.ctx.fill();

      vBlockShape.ctx.rect(0, 0, 10, this.game.world.height);
      vBlockShape.ctx.fillStyle = '000';
      vBlockShape.ctx.fill();

      // create top wall
      this.blockT = this.game.add.sprite(this.game.world.width/2, 5, hBlockShape);
      this.game.physics.p2.enable(this.blockT);
      this.blockT.body.static = true;
      this.blockT.anchor.setTo(0.5, 0.5);

      // create bottom wall
      this.blockB = this.game.add.sprite(this.game.world.width/2, this.game.world.height - 5, hBlockShape)
      this.game.physics.p2.enable(this.blockB);
      this.blockB.body.static = true;
      this.blockB.anchor.setTo(0.5, 0.5);

      // create left wall
      this.blockL = this.game.add.sprite(5, this.game.world.height/2, vBlockShape)
      this.game.physics.p2.enable(this.blockL);
      this.blockL.body.static = true;
      this.blockL.anchor.setTo(0.5, 0.5);

      // create right wall
      this.blockR = this.game.add.sprite(this.game.world.width - 5, this.game.world.height/2, vBlockShape)
      this.game.physics.p2.enable(this.blockR);
      this.blockR.body.static = true;
      this.blockR.anchor.setTo(0.5, 0.5);

      // set collision groups
      // create collision groups
      this.bee1BodyGroup = this.game.physics.p2.createCollisionGroup();
      this.bee2BodyGroup = this.game.physics.p2.createCollisionGroup();
      this.bee1StingerGroup = this.game.physics.p2.createCollisionGroup();
      this.bee2StingerGroup = this.game.physics.p2.createCollisionGroup();
      this.terrainGroup = this.game.physics.p2.createCollisionGroup();
      // assign block collsion groups
      this.blockT.body.setCollisionGroup(this.terrainGroup);
      this.blockB.body.setCollisionGroup(this.terrainGroup);
      this.blockL.body.setCollisionGroup(this.terrainGroup);
      this.blockR.body.setCollisionGroup(this.terrainGroup);
      // assign bee collision groups
      this.beeSprite1.body.setCollisionGroup(this.bee1BodyGroup);
      this.stinger1.body.setCollisionGroup(this.bee1StingerGroup);
      this.beeSprite2.body.setCollisionGroup(this.bee2BodyGroup);
      this.stinger2.body.setCollisionGroup(this.bee2StingerGroup);
      // assign physiscs collisions
      this.blockT.body.collides([this.bee1BodyGroup, this.bee2BodyGroup]);
      this.blockB.body.collides([this.bee1BodyGroup, this.bee2BodyGroup]);
      this.blockL.body.collides([this.bee1BodyGroup, this.bee2BodyGroup]);
      this.blockR.body.collides([this.bee1BodyGroup, this.bee2BodyGroup]);
      this.beeSprite1.body.collides([this.bee2BodyGroup, this.terrainGroup]);
      this.beeSprite2.body.collides([this.bee1BodyGroup, this.terrainGroup]);


      // stinger collision
      // this.beeSprite1.body.createBodyCallback(this.beeSprite2.children[0].body, this.player1Stung, this);
      // this.beeSprite2.children[0].body.createBodyCallback(this.beeSprite1, this.player1Stung, this);

      this.initKeyboard();
      game.stage.backgroundColor = '#ffff00';
    },


    update: function () {
      this.checkPlayerInput();
      // keep stingers attached to bee bodies
      this.stinger1.body.reset(this.stingPositioner1.world.x, this.stingPositioner1.world.y);
      this.stinger1.body.rotation = this.beeSprite1.rotation;

      this.stinger2.body.reset(this.stingPositioner2.world.x, this.stingPositioner2.world.y);
      this.stinger2.body.rotation = this.beeSprite2.rotation;
    },


    initKeyboard: function() {
      this.key_left1 = game.input.keyboard.addKey(Phaser.Keyboard.A);
      this.key_right1 = game.input.keyboard.addKey(Phaser.Keyboard.D);
      this.key_forward1 = game.input.keyboard.addKey(Phaser.Keyboard.W);

      this.key_left2 = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      this.key_right2 = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
      this.key_forward2 = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    },

    player1Stung: function(body1, body2) {
      console.log('1stung');
    },


    player2Stung: function(bee, stinger) {
      console.log('2stung')
    },


    checkPlayerInput: function() {
      if (this.key_left1.isDown) {
        this.beeSprite1.body.rotateLeft(beeProperties.angularVelocity);
      }
      else if (this.key_right1.isDown) {
        this.beeSprite1.body.rotateRight(beeProperties.angularVelocity);
      }
      else {
        this.beeSprite1.body.setZeroRotation();
      }

      if (this.key_forward1.isDown) {
        this.beeSprite1.body.thrust(beeProperties.acceleration)
      }

      if (this.key_left2.isDown) {
        this.beeSprite2.body.rotateLeft(beeProperties.angularVelocity);
      }
      else if (this.key_right2.isDown) {
        this.beeSprite2.body.rotateRight(beeProperties.angularVelocity);
      }
      else {
        this.beeSprite2.body.setZeroRotation();
      }

      if (this.key_forward2.isDown) {
        this.beeSprite2.body.thrust(beeProperties.acceleration)
      }

    },

};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
