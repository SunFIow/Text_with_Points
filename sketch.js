let font;

let marks = [];
let marksToAdd = [];
let marksToRemove = []

let mPressed = [];

let lines = [];

let bgColor;
let txt;
let txtSize;
let txtThickness;

let mouse;
let lastMX;
let lastMY;

let writting;
let writtenText;

function preload() {
  font = loadFont("ethnocentric_rg.ttf");

  bgColor = 25;
  txtSize = 200;
  txtThickness = 8;
  written = false;
  writtenText = "";
  txt = "SunFlow";
}

function setup() {
  console.log();
  createCanvas(window.displayWidth, window.displayHeight);
  background(bgColor);

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
  background(bgColor, bgColor, bgColor, 125);
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
  textFont("Ariel");
  textSize(50);
  text(writtenText, 5, 50);

  stroke(255);
  strokeWeight(5);
  for (l of lines) {
    line(l.start.x, l.start.y, l.end.x, l.end.y);
  }

  if(mPressed.contains(2)){
    lines.push({start: createVector(lastMX, lastMY), end: createVector(mouseX, mouseY)});
  }

  if(mPressed.contains(1)){
    let l = {start: createVector(lastMX, lastMY), end: createVector(mouseX, mouseY)};
    line(l.start.x, l.start.y, l.end.x, l.end.y);
  }

  lastMX = mouseX;
  lastMY = mouseY;
}

Array.prototype.contains = function(obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function getColor(index, frequency){
  vRed   = Math.sin(frequency*index + 2) * 127 + 128;
  vGreen = Math.sin(frequency*index + 0*Math.PI/3) * 127 + 128;
  vBlue  = Math.sin(frequency*index + 4*Math.PI/3) * 127 + 128;

  return color(vRed, vGreen, vBlue);
}

function changeText(str){
  let txDim;
  txtSize = 210;
  do{
    txtDim = getDimensions(font.textToPoints(str, 0, 0, txtSize));
    txtSize -= 10;
  }while(txtDim.width + 100 > width || txtDim.height + 50 > height);
  //createCanvas(txtDim.width + 100, height);

  let txtPos = createVector((width-txtDim.width)/2, height- (height-txtDim.height)/2);

  let points = font.textToPoints(str, txtPos.x, txtPos.y, txtSize);
  if(points.length > marks.length){
    for (let i = 0; i < points.length; i++) {
      let markColor = getColor(points[i].x, Math.PI*2/txtDim.width);
      if(i < marks.length){
        marks[i].changeTarget(points[i])
        marks[i].changeColor(markColor);
        marks[i].setThickness(Math.floor(txtThickness/(200/txtSize)));
      }else{
        let mark = new Mark(points[i].x, points[i].y, markColor, Math.floor(txtThickness/(300/txtSize)));
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
      let markColor = getColor(points[i].x, Math.PI*2/txtDim.width);
      marks[i].changeTarget(points[i]);
      marks[i].setThickness(Math.floor(txtThickness/(200/txtSize)));
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

function mousePressed(evt){
  mPressed.push(evt.button);

  lastMX = mouseX;
  lastMY = mouseY;
}

function mouseReleased(evt){
  mPressed.splice(mPressed.indexOf(evt.button), 1);
}

function keyPressed(e){
  console.log(e);
  if(e.key == "Enter"){
    if(writting){
      changeText(writtenText);
      writtenText = "";
    }
    writting = !writting;
    return;
  }
  if(writting){
    if(e.key == "Backspace"){
        writtenText = writtenText.substr(0, writtenText.length-1);
    }else{
        writtenText = writtenText + getKeyChar(e);
    }
  }else{
    if(e.key == "l" || e.key == "L"){
      lines = [];
    }
    if(e.key == "ArrowDown"){
      console.log("Marks: "+ marks.length);
      console.log("Marks to Add: "+ marksToAdd.length);
      console.log("Marks to Remove: "+ marksToRemove.length);
      console.log("Lines: "+ lines.length);
    }
    if(e.key == "p" || e.key == "P"){
      if(txt == "SunFlow"){
        txt = "Change"
      }else if(txt == "Change"){
        txt = "SunFlow"
      }
      changeText(txt);
    }
  }
}

function getKeyCode(char){
  let chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

  for(let i = 0; i < chars.length; i++) {
    if(chars[i] == char){
      return i+65;
    }
  }
  let specials = ["backspace", "tab", "enter", "shift", "control", "alt", "pause", "caps", "escape", "pageup", "pagedown", "end", "home", "left", "up", "right", "down", "insert", "delete", "leftwindowkey", "rightwindowkey", "selectkey", "mult", "add", "sub", "decimalpoint", "divide", "numlock", "scrolllock", "semicolon", "equal", "comma", "dash", "dot", "forward-slash", "grave", "open-bracket", "backslash", "close-bracket", "simple-execute", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "np0", "np1", "np2", "np3", "np4", "np5", "np6", "np7", "np8", "np9"];
  let specialsNum = [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 35, 35, 36, 37, 38, 39, 40, 45, 46, 91, 92, 93, 106, 107, 109, 110, 111, 144, 145, 186, 187, 188, 189, 190, 191, 192, 219, 220, 221, 222, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];

  for (var i = 0; i < specials.length; i++) {
    if(specials[i] == char){
      return specialsNum[i];
    }
  }
  return 4711;
}


function getKeyChar(event){
  let key = event.key;
  let code = event.code;
  let shift = event.shiftKey;

  let chars = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ß",
                "!", '"', "§", "$", "%", "&", "/", "(", ")", "=", "?",
                   , "²"                    , "{", "[", "]", "}",
                " ", "<", ">", "|", "+", "*", "~", "-", ",", ";", ".", ":", "-", "_", "°", "#", "'", "µ", "@", "€"
              ];
  if(chars.contains(key)) return key;
  else if(key == "Tab") return "  ";
  else if(key == "Dead" && code == "Backquote") return "^";
  else if(key == "Dead" && code == "Equal" && !shift) return "´";
  else if(key == "Dead" && code == "Equal" && shift) return "`";
  else return "";
}
