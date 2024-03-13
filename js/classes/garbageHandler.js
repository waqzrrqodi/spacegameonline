class Garbage {
  constructor(image, width, height, x, y, scale) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.gravity = 0;
  }

  update(speed) {
    this.x -= speed;
  }

  draw(ctx) {
    let scaledWidth = this.width * this.scale;
    let scaledHeight = this.height * this.scale;

    ctx.drawImage(this.image, this.x, this.y, scaledWidth, scaledHeight);
  }
}
