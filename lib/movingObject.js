function MovingObject (args) {
  this.pos = args['pos'];
  this.vel = args['vel'];
  this.radius = args['radius'];
  this.color = args['color'];
  this.game = args['game'];
}

MovingObject.prototype.draw = function (ctx) {
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

MovingObject.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
  this.vel = this.game.bounce(this.pos, this.vel, this.radius);
};

MovingObject.prototype.isCollidedWith = function(otherObject){
  var dist = Math.sqrt(Math.pow(this.pos[0] - otherObject.pos[0], 2) +
    Math.pow(this.pos[1] - otherObject.pos[1], 2));
  if (dist < (this.radius + otherObject.radius)){
    return true;
  }else {
    return false;
  }
};

module.exports = MovingObject;
