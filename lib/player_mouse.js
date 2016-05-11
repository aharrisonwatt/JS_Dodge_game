var canvas = document.getElementById('game-canvas');


var UserMouse = function(options){
  this.radius = 15;
  this.color = '#83F52C';
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

module.exports = UserMouse;
