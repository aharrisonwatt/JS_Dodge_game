var Util = require('./util.js');

var movingObject = require('./movingObject.js');


function Bomb (args) {
    args['color'] = Bomb.COLOR;
    args['radius'] = Bomb.RADIUS;
    args['vel'] = Util.randomVec(Bomb.RADIUS/6);
    return movingObject.call(this, args);
}

Bomb.COLOR = "#000000";
Bomb.RADIUS = Math.random();

Util.inherits(Bomb, movingObject);

module.exports = Bomb;

Bomb.prototype.isCollidedWith = function(otherObject){
  var dist = Math.sqrt(Math.pow(this.pos[0] - otherObject.pos[0], 2) +
    Math.pow(this.pos[1] - otherObject.pos[1], 2));
  if (dist < (this.radius + otherObject.radius)){
    if (otherObject instanceof Bomb){
      this.reflect(otherObject);
      return true;
    }
  }else {
    return false;
  }
};

Bomb.prototype.reflect = function(otherBall){
  var newThisXVel = (this.vel[0] * (this.radius - otherBall.radius) +
                (2 * otherBall.radius * otherBall.vel[0])) /
                (this.radius + otherBall.radius);
  var newOtherXVel = (otherBall.vel[0] * (otherBall.radius - this.radius) +
                (2 * this.radius * this.vel[0])) /
                (this.radius + otherBall.radius);
  var newOtherYVel = (otherBall.vel[1] * (otherBall.radius - this.radius) +
                (2 * this.radius * this.vel[1])) /
                (this.radius + otherBall.radius);
  var newThisYVel = (this.vel[1] * (this.radius - otherBall.radius) +
                (2 * otherBall.radius * otherBall.vel[1])) /
                (this.radius + otherBall.radius);

  this.pos[0] += newThisXVel;
  otherBall.pos[0] += newOtherXVel;
  this.pos[1] += newThisYVel;
  otherBall.pos[1] += newOtherYVel;

  this.vel[0] = newThisXVel;
  otherBall.vel[0] = newOtherXVel;
  this.vel[1] = newThisYVel;
  otherBall.vel[1] = newOtherYVel;
};
