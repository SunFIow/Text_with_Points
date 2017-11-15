function Mark(x, y, color, thickness){
  this.color = color;
  this.r = thickness;
  this.pos = createVector(x+random(500)-250, y+random(500)-250);
  this.target = createVector(x, y);
  this.vel = createVector();
  this.acc = createVector();
  this.maxspeed = 10;
  this.maxforce = 1;
  this.remove = false;
  this.alpha = 255;
  this.alphaChange = 0;
}

Mark.prototype.setPosition = function (pos) {
  this.pos = pos;
};

Mark.prototype.setThickness = function (thickness) {
  this.r = thickness;
};

Mark.prototype.changeTarget = function (target) {
  this.target = target;
};

Mark.prototype.changeColor = function (color) {
  this.color = color;
};

Mark.prototype.getTarget = function () {
  return this.target;
};

Mark.prototype.setAlpha = function (alpha) {
  this.alpha = alpha;
};

Mark.prototype.setAlphaChange = function (alphaChange) {
  this.alphaChange = alphaChange;
};

Mark.prototype.explode = function () {
  this.applyForce(p5.Vector.random2D().mult(20));
};

Mark.prototype.behaviours = function () {
  let arrive = this.arrive(this.target);
  let flee = this.flee(mouse);

  arrive.mult(1);
  flee.mult(3);

  this.applyForce(arrive);
  if(mPressed.contains(0)){
    this.applyForce(flee);
  }
};

Mark.prototype.applyForce = function (f) {
  this.acc.add(f)
};

Mark.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);

  this.color.setAlpha(this.alpha += this.alphaChange);
};

Mark.prototype.getAlpha = function () {
  return this.alpha;
};

Mark.prototype.show = function () {
  stroke(this.color);
  strokeWeight(this.r);
  point(this.pos.x, this.pos.y);
};

Mark.prototype.arrive = function (target) {
  let desired = createVector();
  desired.x = target.x;
  desired.y = target.y;
  desired.x -= this.pos.x;
  desired.y -= this.pos.y;
  //desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxspeed;
  if(d < 100){
    speed = map(d, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
};

Mark.prototype.flee = function (target) {
  let steer = createVector(0, 0);
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  if(d < 100){
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
  }
  return steer;
};
