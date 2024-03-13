class Player {
  constructor(
    idleSpritesheet,
    thrustSpritesheet,
    frameWidth,
    frameHeight,
    idleFrameCount,
    idleFrameDuration,
    thrustFrameCount,
    thrustFrameDuration
  ) {
    this.idleSpritesheet = idleSpritesheet;
    this.thrustSpritesheet = thrustSpritesheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.x = canvas.width / 4 - frameWidth / 2;
    this.y = canvas.height / 2 - frameHeight / 2;
    this.vx = 1;
    this.vy = 1;
    this.idleFrameCount = idleFrameCount;
    this.idleFrameDuration = idleFrameDuration;
    this.thrustFrameCount = thrustFrameCount;
    this.thrustFrameDuration = thrustFrameDuration;
    this.frameIndex = 0;
    this.elapsedTime = 0;
    this.isThrusting = false; // Flag to track thrust animation state
    this.isMovingUp = false; // Flag to track if player is moving up
    this.isMovingDown = false; // Flag to track if player is moving down
    this.isMovingLeft = false; // Flag to track if player is moving left
    this.isMovingRight = false; // Flag to track if player is moving right
    this.acceleration = 0.3; // Adjust the movement speed as needed
    this.deceleration = 0.3; // Adjust the movement speed as needed
    this.maxSpeed = 7; // Adjust the movement speed as needed
    this.score = 0; // Set the initial score
    this.scale = 0.6; // Set the scale of the player
    this.mass = 65; // Set the mass of the player
    this.gravity = 0.2; // Used to simulate gravity on the player

    // Bind the keydown and keyup events to functions and false to prevent default browser behavior
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
  }

  keyDownHandler(e) {
    // console.log(e.keyCode);
    switch (e.keyCode) {
      case 87: // W key
      case 38: // Up arrow
        this.isMovingUp = true;
        this.isThrusting = true;
        break;
      case 83: // S key
      case 40: // Down arrow
        this.isMovingDown = true;
        this.isThrusting = true;
        break;
      case 65: // A key
      case 37: // Left arrow
        this.isMovingLeft = true;
        this.isThrusting = true;
        break;
      case 68: // D key
      case 39: // Right arrow
        this.isMovingRight = true;
        this.isThrusting = true;
        break;
    }
  }

  keyUpHandler(e) {
    // console.log(e.keyCode);
    switch (e.keyCode) {
      case 87: // W key
      case 38: // Up arrow
        this.isMovingUp = false;
        this.isThrusting = false;
        break;
      case 83: // S key
      case 40: // Down arrow
        this.isMovingDown = false;
        this.isThrusting = false;
        break;
      case 65: // A key
      case 37: // Left arrow
        this.isMovingLeft = false;
        this.isThrusting = false;
        break;
      case 68: // D key
      case 39: // Right arrow
        this.isMovingRight = false;
        this.isThrusting = false;
        break;
    }
  }

  updateScore() {
    const scoreValue = document.getElementById("scoreSpan");
    scoreValue.textContent = this.score;
  }

  handleObjectCollisions() {
    // When player collects a food item, add 10 to the score and update the score display
    this.score += 10;
    backgroundSpeed += 0.1;
    this.updateScore();
  }

  applyGravity() {
    let finalTotalX = 0;
    let finalTotalY = 0;
    for (let i = 0; i < foregroundObjects.length; i++) {
      let planet = foregroundObjects[i];
      const dx = planet.x - this.x;
      const dy = planet.y - this.y;
      // console.log(dx, dy);
      const distance = Math.sqrt(dx * dx + dy * dy);

      const force = (planet.gravity * this.mass) / (distance * distance);
      //console.log(force);

      const ax = (force * dx) / distance;
      const ay = (force * dy) / distance;

      finalTotalX += ax;
      finalTotalY += ay;

      // Check if player is colliding with a planet and if so, stop the player from moving

      for (let i = 0; i < foregroundObjects.length; i++) {
        let planet = foregroundObjects[i];
        // Assuming planetX and planetY are the coordinates of the top-left corner of the planet circle,
        // and planetRadius is the radius of the planet circle.
        const planetX = planet.x + (planet.frameWidth * planet.scale) / 2;
        const planetY = planet.y + (planet.frameHeight * planet.scale) / 2;
        const planetRadius =
          (Math.max(planet.frameWidth, planet.frameHeight) * planet.scale) / 2;

        const rectangleCenterX = this.x + (this.frameWidth * this.scale) / 2;
        const rectangleCenterY = this.y + (this.frameHeight * this.scale) / 2;

        const distanceX = Math.abs(rectangleCenterX - planetX);
        const distanceY = Math.abs(rectangleCenterY - planetY);

        const distanceSquared = distanceX ** 2 + distanceY ** 2;
        const radiusSquared = planetRadius ** 2;

        const isColliding = distanceSquared <= radiusSquared;

        if (isColliding) {
          gameOver();
        }
      }
    }

    this.x += finalTotalX;
    this.y += finalTotalY;
  }

  movementLogic() {
    // Check key states and move player accordingly
    if (this.isMovingUp) {
      this.accelerateUp();
    } else if (this.isMovingDown) {
      this.accelerateDown();
    } else {
      this.decelerateVertical();
    }

    if (this.isMovingLeft) {
      this.accelerateLeft();
    } else if (this.isMovingRight) {
      this.accelerateRight();
    } else {
      this.decelerateHorizontal();
    }

    // Apply velocity limits
    this.vx = Math.min(Math.max(this.vx, -this.maxSpeed), this.maxSpeed);
    this.vy = Math.min(Math.max(this.vy, -this.maxSpeed), this.maxSpeed);
    // console.log(this.vx, this.vy);

    // Update player's position based on velocity
    this.x += this.vx;
    this.y += this.vy;
    // console.log(this.x, this.y);
  }

  collidesWith(object) {
    // Check if the player is colliding with an object
    if (
      this.x + this.frameWidth * this.scale >= object.x &&
      this.x <= object.x + object.width &&
      this.y + this.frameHeight * this.scale >= object.y &&
      this.y <= object.y + object.height
    ) {
      return true;
    }
  }

  fakeGravity() {
    // Not in use by default
    this.y += this.gravity;
    // console.log(this.vy);
  }

  update() {
    // Apply gravity
    this.applyGravity();
    // console.log(this.x, this.y);

    // Check for collision with the top of the canvas
    if (this.y <= 0) {
      this.y = 0;
    }
    // Check for collision with the bottom of the canvas
    if (this.y >= canvas.height - this.frameHeight * this.scale) {
      this.y = canvas.height - this.frameHeight * this.scale;
    }
    // Check for collision with the left of the canvas
    if (this.x <= 0) {
      this.x = 0;
    }
    // Check for collision with the right of the canvas
    if (this.x >= canvas.width - this.frameWidth * this.scale) {
      this.x = canvas.width - this.frameWidth * this.scale;
    }

    // Update player's velocity
    this.movementLogic();
  }

  draw(ctx) {
    // Draw the player depending on whether they are thrusting or not
    let spritesheet = this.isThrusting
      ? this.thrustSpritesheet
      : this.idleSpritesheet;
    let sx = this.frameIndex * this.frameWidth;

    ctx.drawImage(
      spritesheet,
      sx,
      0,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.frameWidth * this.scale,
      this.frameHeight * this.scale
    );
  }

  // Smoothly move the player up by decreasing the y velocity

  accelerateUp() {
    this.vy -= this.acceleration;
  }

  accelerateDown() {
    this.vy += this.acceleration;
  }

  decelerateVertical() {
    if (this.vy > 0) {
      this.vy -= this.deceleration;
      this.vy = Math.max(this.vy, 0);
    } else if (this.vy < 0) {
      this.vy += this.deceleration;
      this.vy = Math.min(this.vy, 0);
    }
  }

  accelerateLeft() {
    this.vx -= this.acceleration;
  }

  accelerateRight() {
    this.vx += this.acceleration;
  }

  decelerateHorizontal() {
    if (this.vx > 0) {
      this.vx -= this.deceleration;
      this.vx = Math.max(this.vx, 0);
    } else if (this.vx < 0) {
      this.vx += this.deceleration;
      this.vx = Math.min(this.vx, 0);
    }
  }
}
