# Ball Dodge
[Ball Dodge Live]("http://aharrisonwatt.github.io/JS_Dodge_game/")

Ball Dodge is a simple Javascript game that utilizes HTML5 canvas.  Designed with realistic ball physics and simple gameplay mechanics Ball Dodge is quick to pick up yet satisfying to play.

### Checking Object Collision
Two key pieces of logic allow for realistic ball interactions.  First Ball Dodge detects ball collision using a nested for loop.  This loop checks each object against every other object only once each time the game is rendered.

```javascript
Game.prototype.checkCollisions = function (){
  var that = this;
  this.allObjects().forEach(function (object, index){
    for (var i = index + 1; i < that.allObjects().length; i++) {
        var result = object.isCollidedWith(that.allObjects()[i]);
        if ( result === 'Game Over'){
          that.gameOver = true;
        }else if (result === 'item picked up'){
          that.itemPickUp();
        }
    }
  });
};
```

### Object Collision Detection
Collision in determined based on the distance between two objects based on their radius.  

```javascript
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
```

### Ball Collision Physics
Ball collision takes into the mass of both ball as well as their pervious velocities to realistically simulate ball collision.   

```javascript
var newThisXVel = (this.vel[0] * (this.radius - otherBall.radius) +
              (2 * otherBall.radius * otherBall.vel[0])) /
              (this.radius + otherBall.radius);
```

## Future Direction
Ball Dodge was made in a limited amount of time which sadly limited the scope of project.  Given more time here are the next features I would like to implement.

### Animations
* Replacing all the ball animations with original artwork.
* Adding animation to at point of contact when balls collide.

### HighScore Database
* Rehost onto a service like heroku.
* Integrate a rails backend to allow for a Highscore leaderboard.
