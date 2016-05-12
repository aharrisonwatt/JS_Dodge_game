var Util = require('./util.js');
var movingObject = require('./movingObject.js');

function Item (args){
  args['color'] = Item.COLOR;
  args['radius'] = 10;
  args['vel'] = Util.randomVec(args['radius']/6);
  return movingObject.call(this, args);
}

Item.prototype.changeColor = function(){
  this.color = Util.getRandomColor();
},

Item.COLOR = '#00F5FF';

Util.inherits(Item, movingObject);

module.exports = Item;
