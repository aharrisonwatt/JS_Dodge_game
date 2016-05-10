function Util () {

}

Util.inherits = function (ChildClass, ParentClass) {
  var Surrogate = function () {};
  Surrogate.prototype = ParentClass.prototype;
  ChildClass.prototype = new Surrogate();
  ChildClass.prototype.constructor = ChildClass;
};

Util.randomVec = function (length) {
  var negatives = [-1, 1];
  var xVel = (Math.random() * length*2) - length;
  var yVel = Math.sqrt(Math.pow(length, 2) - Math.pow(xVel, 2)) *
              negatives[Math.floor(Math.random() * negatives.length)];

  return [xVel,yVel];
};

Util.getRandomColor = function () {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

module.exports = Util;
