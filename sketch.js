let noteVals = [57, 59, 62, 64, 67, 69], noteAmt = 6; 
let circSize, seqSize, seqStart;
let noteCircles = [];
let noteColor;
let started = false;
let seqSquares = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  circSize = height/8;
  seqSize = width/20;
  seqStart = createVector(width/16, height/16);
  
  noteColor = random(0, 360);

  let spacing = (width / 6);
  for(let i = 0; i < noteAmt; i++){
    noteCircles.push(new noteCircle(spacing * (i + 0.5), height/1.1, noteVals[i]))
  }


  for(let i = 0; i < 16; i++){
    for(let j = 0; j < 10; j++){
      seqSquares.push(new sequencerSquare (((seqStart.x * i) + seqSize/4) - width/110, (seqStart.y * j) + seqSize/4, i, j))
    }
  }
}

function draw() {
  background(220);
  noStroke();
  noteCircles.forEach((element) => element.run());
  
  strokeWeight(3);
  stroke(100);

  for (let square of seqSquares){
    square.display();
  }

  fill(0);
  stroke(50);
  strokeWeight(4);
  line(width/4.05, height/100, width/4.05, height/1.5);
  line(width/2.01, height/100, width/2.01, height/1.5);
  line(width/1.338, height/100, width/1.338, height/1.5);

  // I should make this sequencer a class but this is the idea of what I want for a highlighted square
  // stroke(230);
  // strokeWeight(8);
  // noFill();
  // square(seqStart.x-seqSize, seqStart.y-30, 25, 10);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}



class sequencerSquare{ 
  constructor(x, y, i, j){
    this.position = createVector(x, y);
    this.size = seqSize; 
    this.index = createVector(i, j);
    if(this.index.y < 6){
      this.fill = color('aqua');
    }else{
      this.fill = color('aquamarine');
    }
  }

  display(){
    colorMode(RGB);
    fill(this.fill);
    rect(this.position.x, this.position.y, this.size, this.size);
  }
}

class noteCircle{
  constructor(x, y, note){
    this.size = circSize;
    this.position = createVector(x, y);
    this.brightness = map(x, 0, width, 20, 100);
    colorMode(HSB);
    this.fill = color(noteColor, 100, this.brightness);
    //this.freqVal = midiToFreq(note);
    this.oscilator = new noteOscilator(note);
  }

  run(){
    fill(this.fill); 
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }
}

class noteOscilator{
  constructor(noteVal){
    this.noteVal = midiToFreq(noteVal);
    this.oscilator = new p5.SinOsc;
    this.oscilator.amp(0);
    this.oscilator.freq(this.noteVal);
    this.env = new noteEnvelope();
  }

  play(){
    this.env.envelope.play(this.oscilator);
  }
}

class noteEnvelope{
  constructor(){
  this.envelope = new p5.Env();
  this.envelope.setADSR(0.001, 0.5, 0.2, 0.5);
  this.envelope.setRange(1, 0);
  }
}

function mousePressed(){
  for(let i = 0; i < noteCircles.length; i++){
    if (started == false){
      noteCircles[i].oscilator.oscilator.start();
      started - true;
    }
    
    if(mouseX > noteCircles[i].position.x - circSize/2 && mouseX < noteCircles[i].position.x + circSize/2 && mouseY > noteCircles[i].position.y - circSize/2 && mouseY < noteCircles[i].position.y + circSize/2){
      console.log("Hi :) I'm " + i);
      noteCircles[i].oscilator.play();
    }
  }
  console.log("You clicked me OwO");
}

/* to begin: make the osciolator from the coloured circles that you click and they make a tone
https://editor.p5js.org/p5/sketches/Sound:_Note_Envelope

probably want to make a class of musical circles
*/