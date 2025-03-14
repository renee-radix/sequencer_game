let noteVals = [57, 59, 62, 64, 67, 69], noteAmt = 6; 
let circSize, seqSize, seqStart, spacing;
let noteCircles = [], noteColor;
let started = false;
let seqSquares = [], seqHighlights = [], seqOn = true;
let bg;
let time, previousTime = 0, interval, blink = false, milliseconds = 500, metIndex = 0, sequencing = false;
let sequencerButton, sequencerSlider;

function preload(){
  bg = loadImage('wavy_lines.jpg')
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  bg.resize(width, height);

  sequencerButton = createButton('Start/stop sequencer');
  sequencerButton.position(width/1.2, height/1.5);
  sequencerButton.mouseClicked(toggleSequencer);
  

  sequencerSlider = createSlider(60, 200);
  sequencerSlider.position(width/2.3, height/1.3);
  sequencerSlider.size(80);


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

  let bpm = sequencerSlider.value();
  console.log(bpm);
  textSize(32);
  fill(0);
  text(bpm + ' BPM', width/2.4, height/1.35);
  bpmConverter(bpm);
  

  
  time = millis();
  timeCheck(milliseconds);
  metronome(); 

  for (let square of seqSquares){
    square.display();
  }


  fill(0);
  stroke(50);
  strokeWeight(4);
  line(width/4.05, height/100, width/4.05, height/1.5);
  line(width/2.01, height/100, width/2.01, height/1.5);
  line(width/1.338, height/100, width/1.338, height/1.5);

  if (sequencing == true) {
    for (let i = 0; i < seqHighlights.length; i++){
      let checker = metIndex - 1;
      if (i == checker){
        seqHighlights[i].visible = true;
      }else{
        seqHighlights[i].visible = false;
      }
    }
  }

  seqHighlights.forEach((element) => element.display());
  noteCircles.forEach((element) => element.run());

  // Code to make the sequencer play back, essentially "If the sequencer is going cycle through all the squares of the highlighted column and play whatever one has a note"
  if(sequencing == true){
    for (let i = 0; i < seqSquares.length; i++){
      if(seqSquares[i].index.x == (metIndex - 1) && seqSquares[i].containsNote == true){
        for(let j = 0; j < noteCircles.length; j++){
        if(5- seqSquares[i].index.y == j){
          noteCircles[j].oscilator.play();
          }
        }
      }
    }
  }
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

function timeCheck(interval){
  if (time - previousTime >= interval){
    blink = true; 
    previousTime = time;
  }
}

function metronome(){
  if (metIndex > 16){
    metIndex = 1;
  }
  if (blink == true){
    metIndex++;
    console.log(metIndex);
    blink = false;
  }
}

function toggleSequencer(){
  if (sequencing == true){
    sequencing = false;
  }else{
    sequencing = true;
    metIndex = 1;
  }
}

function bpmConverter(number){
  milliseconds = (60000 / (number * 4));
}

/* 
Current bugs:
- Main priority: making it so it works on a variety of different window sizes because right now it looks like shit on anything except side by side mode
Start by making the sizing of the sequencer squares and highlights work a little better, that's 90% of it



- You can't edit it on the fly because of the way the highlighting works. I could probably patch it out pretty well

Features I could add:
- Drum samples for the lower 4 (kick, snare, hi hat and cymbol)
*/