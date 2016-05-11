var canvas = document.getElementById('game-canvas');
var Item = require('./item');


var UserMouse = function(options){
  this.radius = 15;
  this.color = '#27e833';
  this.vel = [0,0];
  this.pos = [425, 150];

  canvas.addEventListener('mousemove', function(event){
    this.pos = getCursorPosition(event);
  }.bind(this));
};

function getCursorPosition(event) {
  var bounds = canvas.getBoundingClientRect();
  return ([event.clientX - bounds.left, event.clientY - bounds.top]);
}

UserMouse.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
};

UserMouse.prototype.move = function () {

};

UserMouse.prototype.isCollidedWith = function(otherObject){
  var dist = Math.sqrt(Math.pow(this.pos[0] - otherObject.pos[0], 2) +
    Math.pow(this.pos[1] - otherObject.pos[1], 2));
  if (dist < (this.radius + otherObject.radius)){
    if (otherObject instanceof Item){
      return 'item picked up';
    }
  }else {
    return false;
  }
};

module.exports = UserMouse;
