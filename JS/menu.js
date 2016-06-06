var Menu = {

  preload: function() {
    game.load.image('menuBee', '../Sprites/Bee.png');
    game.load.image('questionMark', '../Sprites/questionmarkB.png');
    game.load.audio('flight', '../Sprites/flight.mp3');
    game.load.audio('beep', '../Sprites/beep.mp3');
    game.load.audio('win', '../Sprites/win.mp3');
  },

  create: function() {
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.refresh();
    game.stage.backgroundColor = '#ffff00';

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
    this.blockT = this.game.add.sprite(this.game.world.width / 2, 5, hBlockShape);
    this.blockT.anchor.setTo(0.5, 0.5);

    // create bottom wall
    this.blockB = this.game.add.sprite(this.game.world.width / 2, this.game.world.height - 5, hBlockShape);
    this.blockB.anchor.setTo(0.5, 0.5);

    // create left wall
    this.blockL = this.game.add.sprite(5, this.game.world.height / 2, vBlockShape);
    this.blockL.anchor.setTo(0.5, 0.5);

    // create right wall
    this.blockR = this.game.add.sprite(this.game.world.width - 5, this.game.world.height / 2, vBlockShape);
    this.blockR.anchor.setTo(0.5, 0.5);

    // add bee button
    menuBee = game.add.button(this.game.world.width / 2, this.game.world.height / 2, 'menuBee', this.startGame, this, 2, 1, 0);
    menuBee.anchor.setTo(0.5, 0.5);

    // add help button
    menuHelp = game.add.button(this.game.world.width / 2, this.game.world.height / 1.2, 'questionMark', this.help, this, 2, 1, 0);
    menuHelp.anchor.setTo(0.5, 0.5);
  },

  update: function() {
    menuBee.angle += 3;
  },

  help: function() {
    $('#helpModal').openModal();
  },

  startGame: function() {
    var $xhr = $.getJSON('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=proper-noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=2&api_key=78c54330c7deecd16a3010c08a3090514ad52320e617e2a93');

    $xhr.done(function(data) {
      if ($xhr.status !== 200) {
        return;
      }
      bee1Name = data[0].word;
      bee2Name = data[1].word;
      var $xhr2 = $.getJSON('http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=adjective&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=2&api_key=78c54330c7deecd16a3010c08a3090514ad52320e617e2a93');
      $xhr2.done(function(data2) {
        if ($xhr2.status !== 200) {
          return;
        }
        bee1Adj = data2[0].word.charAt(0).toUpperCase() + data2[0].word.slice(1);
        bee2Adj = data2[1].word.charAt(0).toUpperCase() + data2[1].word.slice(1);
        game.state.start(states.game);
      });
    });
  }
};
