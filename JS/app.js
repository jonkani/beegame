var gameProperties = {
    screenWidth: 800,
    screenHeight: 600,
};

var states = {
    game: "game",
};

var assets = {
  bee1: {URL: 'Sprites/Bee1.png', name: 'bee1'},
  bee2: {URL: 'Sprites/Bee2.png', name: 'bee2'},

  stinger1: {URL: 'Sprites/hsting.png', name: 'stinger1'},
  stinger2: {URL: 'Sprites/hsting.png', name: 'stinger2'},

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
    },

    create: function () {
      game.world.setBounds(0, 0, 800, 600);
      game.physics.startSystem(Phaser.Physics.P2JS);
      game.physics.p2.setImpactEvents(true);

      // create bee 1
      this.beeSprite1 = game.add.sprite(beeProperties.startX, beeProperties.startY, assets.bee1.name);
      this.beeSprite1.anchor.set(0.5, 0.5);

      // create bee 2
      this.beeSprite2 = game.add.sprite(gameProperties.screenWidth * 0.75, gameProperties.screenHeight * 0.5, assets.bee2.name);
      this.beeSprite2.anchor.set(0.5, 0.5);

      // create stingers
      this.beeSprite1.addChild(game.make.sprite(0, 50, assets.stinger1.name));
      this.beeSprite2.addChild(game.make.sprite(0, 50, assets.stinger2.name));

      // turn on physics for sprites
      this.game.physics.p2.enable(this.beeSprite1, true, true);
      this.beeSprite1.body.angle = 0;
      this.game.physics.p2.enable(this.beeSprite2, true, true);
      this.beeSprite2.body.angle = 180;
      this.beeSprite1.children[0].body.kinematic = true;
      this.beeSprite2.children[0].body.kinematic = true;


      this.stingPositioner = game.add.sprite(0, 50);
      this.stingPositioner.anchor.set(0.5, 0.5);
      this.stingPositioner.pivot.set(0, 0);
      this.beeSprite1.addChild(this.stingPositioner);



      // create game materials
      var bee1Material = game.physics.p2.createMaterial('bee1Material', this.beeSprite1.body);
      var bee2Material = game.physics.p2.createMaterial('bee2Material', this.beeSprite2.body);
      var worldMaterial = game.physics.p2.createMaterial('worldMaterial');

      this.bee1StingerGroup = this.game.physics.p2.createCollisionGroup();
      this.bee2StingerGroup = this.game.physics.p2.createCollisionGroup();
      this.beeSprite1.body.setCollisionGroup(this.bee1StingerGroup);
      this.beeSprite1.children[0].body.setCollisionGroup(this.bee1StingerGroup);


      // game materials + material-specific collisions
      game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
      var beeContactMaterial = game.physics.p2.createContactMaterial(bee1Material, bee2Material);
      var bee1WorldContactMaterial = game.physics.p2.createContactMaterial(bee1Material, worldMaterial);
      var bee2WorldContactMaterial = game.physics.p2.createContactMaterial(bee2Material, worldMaterial);
      bee1WorldContactMaterial.restitution = 0.9;
      bee2WorldContactMaterial.restitution = 0.9;
      beeContactMaterial.restitution = 1.5;

      // stinger collision
      // this.beeSprite1.body.createBodyCallback(this.beeSprite2.children[0].body, this.player1Stung, this);
      // this.beeSprite2.children[0].body.createBodyCallback(this.beeSprite1, this.player1Stung, this);

      this.initKeyboard();
      game.stage.backgroundColor = '#000fff';

    },


    update: function () {
      this.checkPlayerInput();
      this.beeSprite1.children[0].body.reset(this.stingPositioner.world.x, this.stingPositioner.world.y);
      this.beeSprite1.children[0].world.x = this.beeSprite1.children[0].body.x;
      this.beeSprite1.children[0].world.y = this.beeSprite1.children[0].body.y;
      // game.physics.arcade.collide(this.beeSprite1, this.beeSprite2);
      // game.physics.arcade.overlap(this.beeSprite1, this.beeSprite2.children[0], this.player1Stung, null, this);
      // game.physics.arcade.overlap(this.beeSprite2, this.beeSprite1.children[0], this.player2Stung, null, this);
    },

    // initGraphics: function() {
    //   this.beeSprite1 = game.add.sprite(beeProperties.startX, beeProperties.startY, assets.bee1.name);
    //   this.beeSprite1.anchor.set(0.5, 0.5);
    //   // this.beeSprite1.addChild(game.add.sprite(-80, -10, assets.stinger1.name));
    //
    //   this.beeSprite2 = game.add.sprite(gameProperties.screenWidth * 0.75, gameProperties.screenHeight * 0.5, assets.bee2.name);
    //   this.beeSprite2.anchor.set(0.5, 0.5);
    //   // this.beeSprite2.addChild(game.add.sprite(-80, -10, assets.stinger2.name));
    // },

    // render: function () {
    //   game.debug.body(this.beeSprite1);
    //   game.debug.body(this.beeSprite2);
    // //   game.debug.body(this.beeSprite1.children[0]);
    // //   game.debug.body(this.beeSprite2.children[0]);
    // },

    // initPhysics: function() {
    //   game.physics.startSystem(Phaser.Physics.P2JS);
    //   // game.physics.p2.setImpactEvents(true);
    //   game.physics.p2.restitution = 0.8;
    //
    //   game.physics.enable(this.beeSprite1, Phaser.Physics.P2JS);
    //   this.beeSprite1.body.angle = 0;
    //   // this.beeSprite1.body.inertia(beeProperties.drag);
    //   // this.beeSprite1.body.maxVelocity.set(beeProperties.maxVelocity);
    //   // this.beeSprite1.body.bounce.set(0.9, 0.9);
    //   this.beeSprite1.body.collideWorldBounds = true;
    //
    //   game.physics.enable(this.beeSprite2, Phaser.Physics.P2JS);
    //   this.beeSprite2.body.angle = 90;
    //   // this.beeSprite2.body.inertia(beeProperties.drag);
    //   // this.beeSprite2.body.maxVelocity.set(beeProperties.maxVelocity);
    //   // this.beeSprite2.body.bounce.set(0.9, 0.9);
    //   this.beeSprite2.body.collideWorldBounds = true;
    // },

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

    playerStung: function() {
      var boundsA = this.beeSprite1.getBounds();
      var boundsB = this.beeSprite2.children[0].getBounds();

      return Phaser.Rectangle.intersects(boundsA, boundsB);
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
