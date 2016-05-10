var Util = require('./util.js');

var movingObject = require('./movingObject.js');


function Bomb (args) {
    args['color'] = Bomb.COLOR;
    args['radius'] = Bomb.RADIUS;
    args['vel'] = Util.randomVec(Bomb.RADIUS/6);
    return movingObject.call(this, args);
}

Bomb.COLOR = "#000000";
Bomb.RADIUS = 25;

Util.inherits(Bomb, movingObject);

module.exports = Bomb;
