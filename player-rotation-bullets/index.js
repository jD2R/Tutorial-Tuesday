
/**
 * Player Rotation + Bullets
 * Tutorial Tuesday [4/4/23]
 */

/* GLOBALS */
var KNOCKBACK = 0; // how far back you're knocked with each boom
var FIRE_RATE = 1; // how fast the gun fires (lower is faster)
var GUN_SPREAD = 14; // how straight bullets go (lower is more accurate)

/* INPUT DETECTION */
var keys = [];
keyPressed = function() {
    keys[keyCode] = true;
    keys[key.toString().toLowerCase()] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
    keys[key.toString().toLowerCase()] = false;
};

var mouse = {};
mousePressed = function() {
    mouse[mouseButton] = true;
};
mouseReleased = function() {
    mouse[mouseButton] = false;
};

/* PLAYER OBJECT */
var player = {
    // start us in the center
    x: width/2,
    y: height/2,
    xv: 0,
    yv: 0,
    radius: 10,
    timer: 0,
    // angle property!
    angle: 0,
    draw: function() {
        // get the angle we need to turn
        this.angle = atan2(mouseY - this.y, mouseX - this.x);
        
        pushMatrix();
            // translate, then rotate
            translate(this.x, this.y);
            rotate(this.angle);
            strokeWeight(4);
            stroke(0, 0, 0);
            line(this.radius + 5, 0, this.radius + 15, 0);
            noStroke();
            fill(0, 0, 0);
            // draw at 0,0 instead of at the player coords
            ellipse(0, 0, this.radius * 2, this.radius * 2);
            
        popMatrix();
    },
    // regular top-down movement
    move: function() {
        if (keys[LEFT] || keys.a) {
            this.xv--;
        }
        if (keys[RIGHT] || keys.d) {
            this.xv++;
        }
        if (keys[UP] || keys.w) {
            this.yv--;
        }
        if (keys[DOWN] || keys.s) {
            this.yv++;
        }
        
        this.x += this.xv;
        this.y += this.yv;
        
        this.xv *= 0.5;
        this.yv *= 0.5;
        
        this.x = constrain(this.x, this.radius, width - this.radius);
        this.y = constrain(this.y, this.radius, height - this.radius);
    },
    // update function - draw and move
    update: function() {
        this.draw();
        this.move();
        // count the bullet time down
        this.timer = constrain(--this.timer, 0, 10);
    }
};

// array for the bullets
var bullets = [];
// bullet OOP :D
function Bullet(x, y, xv, yv) {
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
    this.radius = 2;
    this.speed = 6;
    this.dead = false;
}
Bullet.prototype.draw = function() {
    noStroke();
    fill(0, 0, 0);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
};
Bullet.prototype.move = function() {
    this.x += this.xv * this.speed;
    this.y += this.yv * this.speed;
};
Bullet.prototype.coll = function() {
    // check for collision with the wall
    if (this.x < this.radius || this.x > width - this.radius ||
        this.y < this.radius || this.y > height - this.radius) {
            this.dead = true;
        }
};
Bullet.prototype.update = function() {
    this.draw();
    this.move();
    this.coll();
};

// animation!
draw = function() {
    background(255, 255, 255);
    player.update();
        /*
            this is my method for controlling bullets.
            i wanted to be able to fire whenever i clicked, but also
            be able to hold down the mouse and fire automatically.
            
            hence i created a player timer.
            when it's 0, we're ready to fire.
            every frame it's decreased in the player constructor.
            BUT if the mouse is released at any time we automatically
            set the timer to 0 (instant reload).
        */
        if (mouse[LEFT] && player.timer === 0) {
            // add a new bullet to the array
            bullets.push(new Bullet(
                // set the bullet coordinates to the top of the gun
                player.x + cos(player.angle) * (player.radius + 15),
                player.y + sin(player.angle) * (player.radius + 15),
                // set the bullet velocity to go in the direction we're pointed
                cos(player.angle + random(-GUN_SPREAD, GUN_SPREAD)),
                sin(player.angle + random(-GUN_SPREAD, GUN_SPREAD))
            ));
            // knock our player back
            player.xv -= cos(player.angle) * KNOCKBACK;
            player.yv -= sin(player.angle) * KNOCKBACK;
            // stop from firing again until timer reloads
            player.timer = FIRE_RATE;
        } else if (!mouse[LEFT]) {
            player.timer = 0;
        }
        
        // update the bullets using reverse iteration
        // this stops blinking glitches when splicing them from the array
        for (var i = bullets.length; i--;) {
            bullets[i].update();
            // if it's hit the wall...
            if (bullets[i].dead) {
                bullets.splice(i, 1); // bye bye
            }
        }
        
        // thumbnail (press ~) :D
        if (keys[192]) {
            background(255, 255, 255);
            textFont(createFont("Trebuchet MS Bold"), 44);
            fill(0, 0, 0);
            text("Player Rotation\n+ Bullets", 29, 67);
            ellipse(293, 286, 65, 65);
            strokeWeight(13);
            stroke(0, 0, 0);
            line(243, 251, 211, 229);
            noStroke();
        }
};

// fixes a KA scrollbar glitch
(function () { this.$("body").css("overflow", "hidden"); }) ();
