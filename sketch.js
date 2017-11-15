let font;

let canv;

let marks = [];
let marksToAdd = [];
let marksToRemove = []

let mPressed;

let bgColor;
let txt;
let txtSize;
let txtThickness;

let lines = [];
let lastMX;
let lastMY;

let mouse;
function preload() {
  font = loadFont("ethnocentric_rg.ttf");

  bgColor = 25;
  txtSize = 200;
  txtThickness = 8;
}

function setup() {
  createCanvas(1920, 1080);
  background(bgColor);

  txt = "SunFlow";
  let markColor = color(255, 255,255);

  let points = font.textToPoints(txt, 0, 0, txtSize);
  let txtDim = getDimensions(points);
  let txtPos = createVector((width-txtDim.width)/2, height- (height-txtDim.height)/2);

  points = font.textToPoints(txt, txtPos.x, txtPos.y, txtSize);
  for (let i = 0; i < points.length; i++) {
    markColor = getColor(points[i].x, Math.PI*2/txtDim.width);
    let mark = new Mark(points[i].x, points[i].y, markColor, txtThickness);
    marks.push(mark);
  }
}

function draw() {
  background(bgColor);
  mouse = createVector(mouseX, mouseY);

  for(markTA of marksToAdd){
    markTA.behaviours();
    markTA.update();
    if(markTA.getAlpha() >= 255){
      markTA.setAlphaChange(0);
      marks.push(markTA);
      marksToAdd = marksToAdd.slice(0, marksToAdd.indexOf(markTA)).concat(marksToAdd.slice(1 + marksToAdd.indexOf(markTA)));
    }
    markTA.show();
  }

  for(markTR of marksToRemove){
    markTR.behaviours();
    markTR.update();
    if(markTR.getAlpha() <= 0){
      marksToRemove = marksToRemove.slice(0, marksToRemove.indexOf(markTR)).concat(marksToRemove.slice(1 + marksToRemove.indexOf(markTR)));
    }
    markTR.show();
  }

  for (mark of marks) {
    mark.behaviours();
    mark.update();
    mark.show();
  }


  stroke(255);
  strokeWeight(5);
  for (l of lines) {
    line(l.start.x, l.start.y, l.end.x, l.end.y);
  }

  if(mPressed){
    lines.push({start: createVector(lastMX, lastMY), end: createVector(mouseX, mouseY)})
    lastMX = mouseX;
    lastMY = mouseY;
  }
}

function getColor(index, frequency){
  vRed   = Math.sin(frequency*index + 2) * 127 + 128;
  vGreen = Math.sin(frequency*index + 0*Math.PI/3) * 127 + 128;
  vBlue  = Math.sin(frequency*index + 4*Math.PI/3) * 127 + 128;

  return color(vRed, vGreen, vBlue);
}

function keyPressed(e){
  if(e.keyCode == 39){
    lines = [];
  }
  if(e.keyCode == 40){
    console.log("Marks: "+ marks.length);
    console.log("Marks to Add: "+ marksToAdd.length);
    console.log("Marks to Remove: "+ marksToRemove.length);
    console.log("Lines: "+ lines.length);
  }
  if(e.keyCode == 80){
    if(txt == "SunFlow"){
      txt = "Change"
    }else if(txt == "Change"){
      txt = "SunFlow"
    }
    changeText(txt);
  }
}

function changeText(str){
  let txtDim = getDimensions(font.textToPoints(str, 0, 0, txtSize));
  createCanvas(txtDim.width + 100, height);

  let txtPos = createVector((width-txtDim.width)/2, height- (height-txtDim.height)/2);

  let points = font.textToPoints(str, txtPos.x, txtPos.y, txtSize);
  if(points.length > marks.length){
    for (let i = 0; i < points.length; i++) {
      let markColor = getColor(points[i].x, Math.PI*2/txtDim.width);
      if(i < marks.length){
        marks[i].changeTarget(points[i])
        marks[i].changeColor(markColor);
      }else{
        let mark = new Mark(points[i].x, points[i].y, markColor, txtThickness);
        mark.setPosition(createVector(
            marks[Math.floor(marks.length-(i - marks.length + 1)/(points.length/marks.length))].pos.x,
            marks[Math.floor(marks.length-(i - marks.length + 1)/(points.length/marks.length))].pos.y
        ));
        marksToAdd.push(mark);
      }
    }
    for(markTA of marksToAdd){
      markTA.setAlpha(0);
      markTA.setAlphaChange(10);
    }
  }else{
    marksToRemove = marks.slice(points.length, marks.length);
    marks = marks.slice(0, points.length);
    for (let i = 0; i < marks.length; i++) {
      marks[i].changeTarget(points[i]);
      let markColor = getColor(points[i].x, Math.PI*2/txtDim.width);
      marks[i].changeColor(markColor);
    }
    for(markTR of marksToRemove){
      markTR.changeTarget(points[marks.length - 1]);
      markTR.setAlphaChange(-10);
    }
  }
  for(mark of marks){
    mark.explode();
  }
  for(markTA of marksToAdd){
    markTA.explode();
  }
  for(markTR of marksToRemove){
    markTR.explode();
  }
}

function getDimensions(points){
  let dim = {width: 0, height: 0};
  let firstX = Number.MAX_SAFE_INTEGER;
  let lastX = 0;
  let firstY = Number.MAX_SAFE_INTEGER;
  let lastY = 0;

  for (p of points) {
    if(firstX > p.x) firstX = p.x;
    if(lastX < p.x) lastX = p.x;
    if(firstY > p.y) firstY = p.y;
    if(lastY < p.y) lastY = p.y;
  }

  dim.width = lastX - firstX;
  dim.height = lastY - firstY;

  return dim;
}

function mousePressed(){
  mPressed = true;
  lastMX = mouseX;
  lastMY = mouseY;
}
function mouseReleased(){
  mPressed = false;
}
