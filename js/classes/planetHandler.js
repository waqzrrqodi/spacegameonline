class Planet {
  constructor(
    spritesheet,
    frameWidth,
    frameHeight,
    x,
    y,
    frameCount,
    frameDuration,
    scale
  ) {
    this.spritesheet = spritesheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.x = x;
    this.y = y;
    this.frameCount = frameCount;
    this.frameDuration = frameDuration;
    this.frameIndex = 0;
    this.elapsedTime = 0;
    this.scale = scale;
    this.gravity = 200 * scale;
  }

  update(speed) {
    this.x -= speed;
    this.elapsedTime += speed;
    // console.log(this.x, this.y, this.elapsedTime)

    if (this.elapsedTime >= this.frameDuration) {
      this.frameIndex++;
      if (this.frameIndex >= this.frameCount) {
        this.frameIndex = 0;
      }
      this.elapsedTime = 0;
    }
  }

  draw(ctx) {
    let sx = this.frameIndex * this.frameWidth;
    let scaledWidth = this.frameWidth * this.scale;
    let scaledHeight = this.frameHeight * this.scale;

    ctx.drawImage(
      this.spritesheet,
      sx,
      0,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      scaledWidth,
      scaledHeight
    );
  }
}
