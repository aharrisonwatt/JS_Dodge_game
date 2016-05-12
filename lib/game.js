var Bomb = require('./bomb.js');
var PlayerMouse = require('./player_mouse');
var Util = require('./util');
var Item = require('./item');
var canvas = document.getElementById('game-canvas');
var SpawnLocation = require('./spawn_location');

function Game() {
  this.DIM_X = 800;
  this.DIM_Y = 600;
  this.NUM_BOMBS = 1;
  this.playerMouse = new PlayerMouse();
  this.score = 0;
  this.gameOver = true;
  this.highscore = 0;
  this.SpawnLocation = new SpawnLocation(
    { game: this, pos: [100, 100] }
  );
  this.bombs = this.addBombs();
  this.item = [];
  this.smallBombTimer = 100;
  this.bigBombTimer = 400;
}

Game.prototype.addBombs = function(radius) {
  var bombs = [];
  for (var i = 0; i < this.NUM_BOMBS; i++){
    var radius = radius || (Math.random() * 10) + 10;
    bombs.push(new Bomb(
      {
        pos: [this.SpawnLocation.pos[0], this.SpawnLocation.pos[1]],
        game: this,
        radius: radius
      }
    ));
  }
  return bombs;
};

Game.prototype.addItem = function() {
  var xPos = Math.abs(this.playerMouse.pos[0] - 800);
  var yPos = Math.abs(this.playerMouse.pos[1] - 600);
  this.item.push(new Item(
    {
      game: this,
      pos: [xPos, yPos]
    }
  ));
  this.bigBombTimer = Math.floor((this.bigBombTimer * 2) / 3);
  this.smallBombTimer = Math.floor((this.smallBombTimer * 2) / 3);
};

Game.prototype.itemPickUp = function () {
  this.bombs = [];
  this.item = [];
};

Game.prototype.bounce = function (pos, vel, radius) {
  if (pos[0] + radius > this.DIM_X) {
    vel[0] = -vel[0];
    pos[0] += (vel[0] * 2);
  }
  if (pos[1] + radius > this.DIM_Y) {
    vel[1] = -vel[1];
    pos[1] += (vel[1] * 2);
  }
  if (pos[0] - radius < 0) {
    vel[0] = -vel[0];
    pos[0] += (vel[0] * 2);
  }
  if (pos[1] - radius < 0) {
    vel[1] = -vel[1];
    pos[1] += (vel[1] * 2);
  }
  return vel;
};

Game.prototype.allObjects = function () {
  return this.bombs.concat(this.SpawnLocation).concat(this.playerMouse).concat(this.item);
};

Game.prototype.checkCollisions = function (){
  var that = this;
  this.allObjects().forEach(function (object, index){
    for (var i = index + 1; i < that.allObjects().length; i++) {
        var result = object.isCollidedWith(that.allObjects()[i]);
        if ( result === 'Game Over'){
          that.gameOver = true;
        }else if (result === 'item picked up'){
          that.itemPickUp();
        }
    }
  });
};

Game.prototype.draw = function (ctx) {

  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);

  ctx.fillStyle = 'rgb(100, 100, 100)';
  ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);

  ctx.fillStyle = "#EEEEEE";
	ctx.font = "normal normal 24px Techno";
  ctx.fillText("Score:", 10, 30);
  ctx.fillText((this.score / 50), 75, 31);
  ctx.fillText("Highscore:", 10, 60);
  ctx.fillText((this.highscore / 50), 120, 61);
  if(this.gameOver === true){
    if(this.highscore === this.score && this.highscore !== 0){
      ctx.fillStyle = "#EEEEEE";
      ctx.font = "normal normal 50px Techno";
      ctx.fillText("New High Score!", 250, 200);
      ctx.fillStyle = Util.getRandomColor();
      ctx.fillText((this.highscore / 50) + ' seconds', 300, 265);
    }else{
      ctx.fillStyle = "#EEEEEE";
      ctx.font = "normal normal 50px Techno";
      ctx.fillText("Game Over", 300, 250);
    }
    ctx.fillStyle = "#EEEEEE";
    ctx.font = "normal normal 50px Techno";
    ctx.fillText('Click to Play Again', 225, 325);
  }


  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  this.allObjects().forEach(function (object) {
    object.move();
  });
};

Game.prototype.updateBoard = function(){
  this.score += 1;
  this.item.forEach(function(object){
    object.color = Util.getRandomColor();
  });
  if (this.score > this.highscore){
    this.highscore = this.score;
  }
  if ((this.score / 50) % 15 === 0){
    this.addItem();
  }
  if (this.score % this.bigBombTimer === 0){
    this.bombs = this.bombs.concat(this.addBombs(50));
  }else if (this.score % this.smallBombTimer === 0){
    this.bombs = this.bombs.concat(this.addBombs());
  }
};

Game.prototype.endGame = function(ctx){
  if (this.gameOver === true){
    this.playerMouse.color = "#b22727";
    this.bombs = [];
    this.item = [];
    this.bigBombTimer = 400;
    this.smallBombTimer = 100;
    canvas.addEventListener('click', function(event){
      if (this.gameOver === true){
        this.resetGame();
      }
    }.bind(this));
  }else{
    this.updateBoard();
  }
};

Game.prototype.resetGame = function () {
  this.score = 0;
  this.bombs = this.addBombs();
  this.gameOver = false;
  this.playerMouse.color = '#83F52C';
};

Game.prototype.step = function(ctx){
  this.moveObjects();
  this.checkCollisions();
  this.endGame(ctx);
};


module.exports = Game;
