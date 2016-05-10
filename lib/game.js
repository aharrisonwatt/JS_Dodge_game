var Bomb = require('./bomb.js');

function Game() {
  this.DIM_X = 800;
  this.DIM_Y = 600;
  this.NUM_BOMBS = 10;
  this.bombs = this.addBombs(this.NUM_BOMBS);
}

Game.prototype.randomPosition = function() {
  var xPos = Math.random() * this.DIM_X;
  var yPos = Math.random() * this.DIM_Y;

  return [xPos, yPos];
};

Game.prototype.addBombs = function(num) {
  var bombs = [];
  for (var i = 0; i < num; i++){
    bombs.push(new Bomb( {pos: this.randomPosition(), game: this}));
  }
  return bombs;
};

Game.prototype.bounce = function (pos, vel, radius) {
  if (pos[0] + radius > this.DIM_X) {
    vel[0] = -vel[0];
    pos[0] += vel[0];
  }
  if (pos[1] + radius > this.DIM_Y) {
    vel[1] = -vel[1];
    pos[1] += vel[1];
  }
  if (pos[0] - radius < 0) {
    vel[0] = -vel[0];
    pos[0] += vel[0];
  }
  if (pos[1] - radius < 0) {
    vel[1] = -vel[1];
    pos[1] += vel[1];
  }
  return vel;
};

Game.prototype.allObjects = function () {
  return this.bombs;
};

Game.prototype.checkCollisions = function (){
  var that = this;
  this.allObjects().forEach(function (object, index){
    for (var i = index + 1; i < that.allObjects().length; i++) {
        if (object.isCollidedWith(that.allObjects()[i])){
          return true;
        }
    }
  });
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  this.allObjects().forEach(function (object) {
    object.move();
  });
};

Game.prototype.step = function(){
  this.moveObjects();
  this.checkCollisions();
};

module.exports = Game;
