var Game = require('./game.js');

function GameView (ctx) {
  this.game = new Game();
  this.tower = this.game.tower;
  this.ctx = ctx;
}

GameView.prototype.start = function (){
  setInterval(this.game.step.bind(this.game), 20);
  setInterval(this.game.draw.bind(this.game, this.ctx), 20);
};

module.exports = GameView;
