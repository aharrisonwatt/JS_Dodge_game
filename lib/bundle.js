/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameView = __webpack_require__(1);
	
	var canvasEl = document.getElementById("game-canvas");
	
	var ctx = canvasEl.getContext("2d");
	
	new GameView(ctx).start();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Bomb = __webpack_require__(3);
	
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(5);
	
	var movingObject = __webpack_require__(4);
	
	
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


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports) {

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
	
	module.exports = Util;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map