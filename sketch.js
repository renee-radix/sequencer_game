let noteVals = [57, 59, 62, 64, 67, 69], noteAmt = 6; 
let circSize, seqSize, seqStart;
let noteCircles = [];
let noteColor;
let started = false;
let seqSquares = [], seqHighlights = [];
let spacing;

let bg;

function preload(){
  bg = loadImage('wavy_lines.jpg')
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  bg.resize(width,height);

  // Currently these are created depending on the width or height, which works fine when the screen is half and half with VS code
  // but in other situations does not work ok. We should probably figure this out but thinking about it is giving me a headache. 
  circSize = height/8;
  seqSize = width/20;
  seqStart = createVector(width/16, height/16);
  
  noteColor = random(0, 360);

  spacing = (width / 6);
  for(let i = 0; i < noteAmt; i++){
    noteCircles.push(new noteCircle(spacing * (i + 0.5), height/1.1, noteVals[i]))
  }


  for(let i = 0; i < 16; i++){
    for(let j = 0; j < 10; j++){
      seqSquares.push(new sequencerSquare (((seqStart.x * i) + seqSize/4) - width/110, (seqStart.y * j) + seqSize/4, i, j))
    }
  }

  for(let i = 0; i < 16; i++){
    seqHighlights.push(new sequencerHighlight(i, seqSize, seqSize * 13));
  }
}

function draw() {
  background(bg);

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

  seqHighlights.forEach((element) => element.display());
  noteCircles.forEach((element) => element.run());


}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  // Deletes and reforms the note circles if the window is resized (can't have the note circles form in the draw loop otherwise it bugs out)
  noteCircles.splice(0, noteCircles.length);
  spacing = (width / 6);
  circSize = height/8;
  for(let i = 0; i < noteAmt; i++){
    noteCircles.push(new noteCircle(spacing * (i + 0.5), height/1.1, noteVals[i]));
  }

  background.resize(width, height);

  // If I want to do this for the whole project I'd have to redraw the serquencer and reinitialize the values also, which is doable but would just take some time. 

}



class sequencerSquare{ 
  constructor(x, y, i, j){
    this.position = createVector(x, y);
    this.size = seqSize; 
    this.index = createVector(i, j); // the idea is that this gives us a column (0-15) and row (0-10) number
    if(this.index.y < 6){
      this.fill = color('aqua');
    }else{
      this.fill = color('aquamarine');
    }
    this.selected = false;
    this.containsNote = false;
  }

  display(){
    colorMode(RGB);
    fill(this.fill);
    square(this.position.x, this.position.y, this.size);

    if (this.containsNote == true && this.index.y < 6){
      ellipseMode(CORNER);
      let circleOffset = this.size/7;
      noStroke();
      colorMode(HSB);
      fill(noteColor, 100, noteCircles[5 - this.index.y].brightness);
      ellipse(this.position.x + circleOffset, this.position.y + circleOffset, this.size/1.5, this.size/1.5)
    }
  }
}

class noteCircle{
  constructor(x, y, note){
    this.size = circSize;
    this.position = createVector(x, y);
    this.originalPosition = createVector(this.position.x, this.position.y);
    this.brightness = map(x, 0, width, 20, 100);
    colorMode(HSB);
    this.fill = color(noteColor, 100, this.brightness);
    //this.freqVal = midiToFreq(note);
    this.oscilator = new noteOscilator(note);
    this.dragged = false;
  }

  run(){
    noStroke();
    fill(this.fill); 
    ellipseMode(CENTER);
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

class sequencerHighlight{
  // These are highlights that are meant to be on top of the sequencer when either a circle is hovering over the top or it's playing through it
  constructor(i, w, h){
    this.position = createVector(seqSquares[i * 10].position.x, seqSquares[0].position.y - (seqSize / 3.5)); // This will be the start point for the highlight (top X Y corner). i is the index that it gets fed, a number from 0 to 15
    this.size = createVector(seqSize, seqSize * 13); // Width and height of the hightlight, stored in a vector for convenience (it will probably need to be destroyed and reformed again under window resize to make it all fit correctly)
    this.visible = false;
  }

  display(){
    if (this.visible == true){
      stroke(0, 150);
      strokeWeight(4);
      noFill();
      rect(this.position.x, this.position.y, this.size.x, this.size.y, 20);
    }
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
    }
    
    if(mouseX > noteCircles[i].position.x - circSize/2 && mouseX < noteCircles[i].position.x + circSize/2 && mouseY > noteCircles[i].position.y - circSize/2 && mouseY < noteCircles[i].position.y + circSize/2){
      console.log("Hi :) I'm " + i);
      noteCircles[i].oscilator.play();
    }
  }
  console.log("You clicked me OwO");
}

function mouseDragged(){
  for(let i = 0; i < noteCircles.length; i++){
    if(mouseX > noteCircles[i].position.x - circSize/2 && mouseX < noteCircles[i].position.x + circSize/2 && mouseY > noteCircles[i].position.y - circSize/2 && mouseY < noteCircles[i].position.y + circSize/2){
      noteCircles[i].position.x = mouseX;
      noteCircles[i].position.y = mouseY;
      noteCircles[i].dragged = true;

      //Want the code to check if we're on the sequencer column to run only if we are holding a circle
      for(let column of seqHighlights){
        if(mouseX > column.position.x && mouseX < column.position.x + column.size.x && mouseY < column.position.y + column.size.y){
            column.visible = true;
          }else{
            column.visible = false;
          }
      }
    }
  }


}

function mouseReleased(){
  for(let i = 0; i < noteCircles.length; i++){
    if (noteCircles[i].dragged == true){
      for(let j = 0; j < seqHighlights.length; j++){
        if (seqHighlights[j].visible == true){
          for(let square of seqSquares){
            if(square.index.x == j && (5 - square.index.y) == i){
              square.containsNote = true;
            }
          }
        }
      }
     }
  
    }

  noteCircles.forEach((element) =>{     
    element.position.x = element.originalPosition.x;
    element.position.y = element.originalPosition.y;
    element.dragged = false;
  })


  for(let column of seqHighlights){
    column.visible = false;
  }
}

/* 
Moira: Next steps:
- Give sequencer squares some kind of value that registers if it has a note in there or not 
(I like the idea that each square has a fixed value and it's either on or off, might be kinda complicated to get the different colors from the different users)

*/