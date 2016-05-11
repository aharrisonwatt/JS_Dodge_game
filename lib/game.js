var Bomb = require('./bomb.js');
var PlayerMouse = require('./player_mouse');
var Util = require('./util');
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
  this.bombs = this.addBombs(this.NUM_BOMBS);
}
Game.prototype.updateSpawnLocation = function() {
  SpawnPos += 1;
  SpawnPos += 1;
  return ;
};

Game.prototype.addBombs = function(num, radius) {
  var bombs = [];
  for (var i = 0; i < num; i++){
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
  return this.bombs.concat(this.SpawnLocation).concat(this.playerMouse);
};

Game.prototype.checkCollisions = function (){
  var that = this;
  this.allObjects().forEach(function (object, index){
    for (var i = index + 1; i < that.allObjects().length; i++) {
        var result = object.isCollidedWith(that.allObjects()[i]);
        if ( result === 'Game Over'){
          that.gameOver = true;
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
  ctx.fillText(this.score, 75, 31);
  ctx.fillText("Highscore:", 10, 60);
  ctx.fillText(this.highscore, 120, 61);
  if(this.gameOver === true){
    if(this.highscore === this.score && this.highscore !== 0){
      ctx.fillStyle = "#EEEEEE";
      ctx.font = "normal normal 50px Techno";
      ctx.fillText("New High Score!", 250, 200);
      ctx.fillStyle = Util.getRandomColor();
      ctx.fillText(this.highscore, 400, 265);
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

Game.prototype.endGame = function(ctx){
  if (this.gameOver === true){
    this.playerMouse.color = "#b22727";
    this.bombs = [];
    canvas.addEventListener('click', function(event){
      if (this.gameOver === true){
        this.resetGame();
      }
    }.bind(this));
  }else{
    this.score += 1;
    if (this.score > this.highscore){
      this.highscore = this.score;
    }
    if (this.score % 400 === 0){
      this.bombs = this.bombs.concat(this.addBombs(1, 50));
    }else if (this.score % 100 === 0){
      this.bombs = this.bombs.concat(this.addBombs(1));
    }

  }
};

Game.prototype.resetGame = function () {
  this.score = 0;
  this.bombs = this.addBombs(this.NUM_BOMBS);
  this.gameOver = false;
  this.playerMouse.color = '#83F52C';
};
Game.prototype.step = function(ctx){
  this.moveObjects();
  this.checkCollisions();
  this.endGame(ctx);
};


module.exports = Game;
