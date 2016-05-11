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
	  this.ctx = ctx;
	}
	
	GameView.prototype.start = function (){
	  setInterval(this.game.step.bind(this.game, this.ctx), 20);
	  setInterval(this.game.draw.bind(this.game, this.ctx), 20);
	};
	
	GameView.prototype.end = function (){
	
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Bomb = __webpack_require__(3);
	var PlayerMouse = __webpack_require__(6);
	var Util = __webpack_require__(5);
	var canvas = document.getElementById('game-canvas');
	var SpawnLocation = __webpack_require__(7);
	
	function Game() {
	  this.DIM_X = 800;
	  this.DIM_Y = 600;
	  this.NUM_BOMBS = 1;
	  this.playerMouse = new PlayerMouse();
	  this.score = 0;
	  this.gameOver = true;
	  this.highscore = 0;
	  this.SpawnLocation = new SpawnLocation(
	    { game: this, pos: [100, 100] }
	  );
	  this.bombs = this.addBombs(this.NUM_BOMBS);
	}
	Game.prototype.updateSpawnLocation = function() {
	  SpawnPos += 1;
	  SpawnPos += 1;
	  return ;
	};
	
	Game.prototype.addBombs = function(num, radius) {
	  var bombs = [];
	  for (var i = 0; i < num; i++){
	    var radius = radius || (Math.random() * 10) + 10;
	    bombs.push(new Bomb(
	      {
	        pos: [this.SpawnLocation.pos[0], this.SpawnLocation.pos[1]],
	        game: this,
	        radius: radius
	      }
	    ));
	  }
	  return bombs;
	};
	
	Game.prototype.bounce = function (pos, vel, radius) {
	  if (pos[0] + radius > this.DIM_X) {
	    vel[0] = -vel[0];
	    pos[0] += (vel[0] * 2);
	  }
	  if (pos[1] + radius > this.DIM_Y) {
	    vel[1] = -vel[1];
	    pos[1] += (vel[1] * 2);
	  }
	  if (pos[0] - radius < 0) {
	    vel[0] = -vel[0];
	    pos[0] += (vel[0] * 2);
	  }
	  if (pos[1] - radius < 0) {
	    vel[1] = -vel[1];
	    pos[1] += (vel[1] * 2);
	  }
	  return vel;
	};
	
	Game.prototype.allObjects = function () {
	  return this.bombs.concat(this.SpawnLocation).concat(this.playerMouse);
	};
	
	Game.prototype.checkCollisions = function (){
	  var that = this;
	  this.allObjects().forEach(function (object, index){
	    for (var i = index + 1; i < that.allObjects().length; i++) {
	        var result = object.isCollidedWith(that.allObjects()[i]);
	        if ( result === 'Game Over'){
	          that.gameOver = true;
	        }
	    }
	  });
	};
	
	Game.prototype.draw = function (ctx) {
	
	  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	
	  ctx.fillStyle = 'rgb(100, 100, 100)';
	  ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);
	
	  ctx.fillStyle = "#EEEEEE";
		ctx.font = "normal normal 24px Techno";
	  ctx.fillText("Score:", 10, 30);
	  ctx.fillText(this.score, 75, 31);
	  ctx.fillText("Highscore:", 10, 60);
	  ctx.fillText(this.highscore, 120, 61);
	  if(this.gameOver === true){
	    if(this.highscore === this.score && this.highscore !== 0){
	      ctx.fillStyle = "#EEEEEE";
	      ctx.font = "normal normal 50px Techno";
	      ctx.fillText("New High Score!", 250, 200);
	      ctx.fillStyle = Util.getRandomColor();
	      ctx.fillText(this.highscore, 400, 265);
	    }else{
	      ctx.fillStyle = "#EEEEEE";
	      ctx.font = "normal normal 50px Techno";
	      ctx.fillText("Game Over", 300, 250);
	    }
	    ctx.fillStyle = "#EEEEEE";
	    ctx.font = "normal normal 50px Techno";
	    ctx.fillText('Click to Play Again', 225, 325);
	  }
	
	
	  this.allObjects().forEach(function (object) {
	    object.draw(ctx);
	  });
	};
	
	Game.prototype.moveObjects = function () {
	  this.allObjects().forEach(function (object) {
	    object.move();
	  });
	};
	
	Game.prototype.endGame = function(ctx){
	  if (this.gameOver === true){
	    this.playerMouse.color = "#b22727";
	    this.bombs = [];
	    canvas.addEventListener('click', function(event){
	      if (this.gameOver === true){
	        this.resetGame();
	      }
	    }.bind(this));
	  }else{
	    this.score += 1;
	    if (this.score > this.highscore){
	      this.highscore = this.score;
	    }
	    if (this.score % 400 === 0){
	      this.bombs = this.bombs.concat(this.addBombs(1, 50));
	    }else if (this.score % 100 === 0){
	      this.bombs = this.bombs.concat(this.addBombs(1));
	    }
	
	  }
	};
	
	Game.prototype.resetGame = function () {
	  this.score = 0;
	  this.bombs = this.addBombs(this.NUM_BOMBS);
	  this.gameOver = false;
	  this.playerMouse.color = '#83F52C';
	};
	Game.prototype.step = function(ctx){
	  this.moveObjects();
	  this.checkCollisions();
	  this.endGame(ctx);
	};
	
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(5);
	var movingObject = __webpack_require__(4);
	var UserMouse = __webpack_require__(6);
	
	
	function Bomb (args) {
	    args['color'] = Bomb.COLOR;
	    args['vel'] = Util.randomVec(args['radius']/6);
	    return movingObject.call(this, args);
	}
	
	Bomb.COLOR = "#000000";
	
	Util.inherits(Bomb, movingObject);
	
	module.exports = Bomb;
	
	Bomb.prototype.isCollidedWith = function(otherObject){
	  var dist = Math.sqrt(Math.pow(this.pos[0] - otherObject.pos[0], 2) +
	    Math.pow(this.pos[1] - otherObject.pos[1], 2));
	  if (dist < (this.radius + otherObject.radius)){
	    if (otherObject instanceof Bomb){
	      this.reflect(otherObject);
	    }if (otherObject instanceof UserMouse){
	      return 'Game Over';
	    }
	  }else {
	    return false;
	  }
	};
	
	Bomb.prototype.reflectFlair = function (otherBall) {
	  var canvasEl = document.getElementById("game-canvas");
	  var ctx = canvasEl.getContext("2d");
	
	  var xCollisionPoint =
	    ((this.pos[0] * otherBall.radius) + (otherBall.pos[0] * this.radius)) /
	    (this.radius + otherBall.radius);
	  var yCollisionPoint =
	    ((this.pos[1] * otherBall.radius) + (otherBall.pos[1] * this.radius)) /
	    (this.radius + otherBall.radius);
	  ctx.fillStyle = "#b22727";
	  ctx.beginPath();
	  ctx.arc(
	    xCollisionPoint,
	    yCollisionPoint,
	    2,
	    2 * Math.PI,
	    false
	  );
	  ctx.fill();
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
	  var xVel = ((Math.random() * length*2) - length) *
	              negatives[Math.floor(Math.random() * negatives.length)];
	  var yVel = Math.sqrt(Math.pow(length, 2) - Math.pow(xVel, 2)) *
	              negatives[Math.floor(Math.random() * negatives.length)];
	
	  return [xVel,yVel];
	};
	
	Util.setVec = function(length){
	  var negatives = [-1, 1];
	  if (length === 40){
	    var xVel = ((Math.random() * length*2) - length) *
	                negatives[Math.floor(Math.random() * negatives.length)];
	    var yVel = Math.sqrt(Math.pow(length, 2) - Math.pow(xVel, 2)) *
	                negatives[Math.floor(Math.random() * negatives.length)];
	  }else{
	    xVel = 0;
	    yVel = 0;
	  }
	
	
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


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var movingObject = __webpack_require__(4);
	var Util = __webpack_require__(5);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map