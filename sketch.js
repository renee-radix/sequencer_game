let osc, envelope; 
let noteVals = [57, 59, 62, 64, 67, 69], noteAmt = 6; 
let size, seqSize, seqStart;
let noteCircles = [];
let noteColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  size = height/8;
  seqSize = width/20;
  seqStart = createVector(width/16, height/16);

  osc = new p5.SinOsc();
  osc.start();
  osc.amp(0);

  envelope = new p5.Env();
  envelope.setADSR(0.01, 0.5, 0.2, 0.5);
  envelope.setRange(1, 0);


  noteColor = random(0, 360);

  let spacing = (width / 6);
  for(let i = 0; i < noteAmt; i++){
    noteCircles.push(new noteCircle(spacing * (i + 0.5), height/1.1, noteVals[i]))
  }
}

function draw() {
  background(220);
  noStroke();
  noteCircles.forEach((element) => element.run());
  colorMode(RGB);
  
  strokeWeight(3);
  stroke(100);

  for(let i = 0; i < 16; i++){
    for(let j = 0; j < 12; j++){
      if(j < 6){
        fill(120, 220, 225);
      }else{
        fill(120, 225, 150);
      }
      rect(((seqStart.x * i) + seqSize/4) - width/110, (seqStart.y * j) + seqSize/4, seqSize, seqSize);
    }
  }
  fill(0);
  stroke(50);
  strokeWeight(4);
  line(width/4.05, height/100, width/4.05, height/1.32);
  line(width/2.01, height/100, width/2.01, height/1.32);
  line(width/1.338, height/100, width/1.338, height/1.32);

  // I should make this sequencer a class but this is the idea of what I want for a highlighted square
  stroke(230);
  strokeWeight(8);
  noFill();
  square(seqStart.x-seqSize, seqStart.y-30, 25, 10);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

class sequencerSquare{ //Create a class here for the sequencer squares, I think we'll need it if we're going to have playback
}

class noteCircle{
  constructor(x, y, note){
    this.size = size;
    this.position = createVector(x, y);
    this.brightness = map(x, 0, width, 20, 100);
    colorMode(HSB);
    this.fill = color(noteColor, 100, this.brightness);
    this.freqVal = midiToFreq(note);
  }

  run(){
    fill(this.fill); 
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }

  play(){
    osc.freq(this.freqVal);
    envelope.play(osc);
  }
}

function mousePressed(){
  for(let i = 0; i < noteCircles.length; i++){
    if(mouseX > noteCircles[i].position.x - size/2 && mouseX < noteCircles[i].position.x + size/2 && mouseY > noteCircles[i].position.y - size/2 && mouseY < noteCircles[i].position.y + size/2){
      console.log("Hi :) I'm " + i);
      noteCircles[i].play();
    }
  }
  console.log("You clicked me OwO");
}

/* to begin: make the osciolator from the coloured circles that you click and they make a tone
https://editor.p5js.org/p5/sketches/Sound:_Note_Envelope

probably want to make a class of musical circles
*/