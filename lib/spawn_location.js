var movingObject = require('./movingObject.js');
var Util = require('./util.js');

//local variables
SpawnLocation.COLOR = 'rgb(200, 0, 0)';

//entry point
function SpawnLocation (args) {
    args['color'] = SpawnLocation.COLOR;
    args['vel'] = [1,1];
    args['radius'] = 50;
    return movingObject.call(this, args);
}
Util.inherits(SpawnLocation, movingObject);



module.exports = SpawnLocation;
