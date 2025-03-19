// global variables
let noteVals = [57, 59, 62, 64, 67, 69], noteAmt = 6; 
let kick, hat, snare, cymbol, drumSpacing, drumCircles = [], soundArray = [];
let circSize, seqSizeX, seqSizeY, seqStart, spacing;
let noteCircles = [], noteColor;
let started = false;
let seqSquares = [], seqHighlights = [], seqOn = true;
let bg;
let time, previousTime = 0, interval, blink = false, milliseconds = 500, metIndex = 0, sequencing = false;
let sequencerButton, sequencerSlider, resetButton, drumButton;
let noteMode = 1; // 1 for the notes, 2 for the drum sounds
let newSquare = true;
let dragging = false;

//loading the background
function preload(){
  bg = loadImage('wavy_lines.jpg')
  kick = loadSound('assets/kick.mp3');
  hat = loadSound('assets/hat.mp3');
  snare = loadSound('assets/snare.mp3');
  cymbol = loadSound('assets/cymbol.mp3');
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  bg.resize(width, height);

  soundArray = [kick, snare, hat, cymbol];

  // creating buttons/sliders
  sequencerButton = createButton('Start/stop sequencer');
  sequencerButton.position(width/1.2, height/1.5);
  sequencerButton.mouseClicked(toggleSequencer);
  // this is how you edit css style on the components created in the sketch. mess around with this if you want to
  sequencerButton.style('background-color:lightGreen;')
  sequencerButton.style('font-family: Arial;')
  sequencerButton.style('border-style: hidden;')
  sequencerButton.style('font-weight: Bold;')
  sequencerButton.style('border-radius: 12px;')


  sequencerSlider = createSlider(60, 200);
  sequencerSlider.position(width/2.3, height/1.3);
  sequencerSlider.size(80);

  drumButton = createButton('Switch between notes and drums');
  drumButton.position(width/200, height/1.45);
  drumButton.mouseClicked(switchMode);
  drumButton.style('background-color: #2b70a5 ;');
  drumButton.style('font-family: Arial;');
  drumButton.style('border-style: hidden;');
  drumButton.style('font-weight: Bold;');
  drumButton.style('border-radius: 12px;')

  resetButton = createButton('Reset sequencer');
  resetButton.position(width/200, height/1.35);
  resetButton.mouseClicked(reset);
  resetButton.style('background-color: #bc1d0f;');
  resetButton.style('font-family: Arial;');
  resetButton.style('border-style: hidden;');
  resetButton.style('font-weight: Bold;');
  resetButton.style('border-radius: 12px;')


  //Sets the sizes for the various elements, will probably want these to change in the resize method. If things look weird start by changing here
  circSize = height/8;
  seqSizeX = width/20;
  seqSizeY = height/20;
  seqStart = createVector(width/16, height/16);
  
  noteColor = random(0, 360);

  // initializing arrays
  spacing = (width / 6);
  for(let i = 0; i < noteAmt; i++){
    noteCircles.push(new noteCircle(spacing * (i + 0.5), height/1.1, noteVals[i]));
  }

  drumSpacing = width/4;
  for(let i = 0; i < 4; i++){
    drumCircles.push(new drumCircle(drumSpacing * (i + 0.5), height / 1.1, i));
  }

  for(let i = 0; i < 16; i++){
    for(let j = 0; j < 10; j++){
      seqSquares.push(new sequencerSquare (((seqStart.x * i) + seqSizeX/4) - width/110, (seqStart.y * j) + seqSizeY/4, i, j))
    }
  }
  for(let i = 0; i < 16; i++){
    seqHighlights.push(new sequencerHighlight(i, seqSizeX, seqSizeY * 13));
  }
  console.log("Width:" + width);
  console.log("Height: " + height);
}

function draw() {
  background(bg);

  let bpm = sequencerSlider.value();
  //console.log(bpm);
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


  // If I want to make this work with the squares being different sizes I'd probably want the line position
  // to depend on the sequencer square size etc. 
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

  if(noteMode == 1){
    noteCircles.forEach((element) => element.run());
  }else{
    drumCircles.forEach((element) => element.run());
  }
  
  // Code to make the sequencer play back, essentially "If the sequencer is going cycle through all the squares of the highlighted column and play whatever one has a note"
  if(sequencing == true){
    for (let i = 0; i < seqSquares.length; i++){
      if(seqSquares[i].index.x == (metIndex - 1) && seqSquares[i].containsNote == true && seqSquares[i].index.y < 6){
        for(let j = 0; j < noteCircles.length; j++){
        if(5- seqSquares[i].index.y == j){
          noteCircles[j].oscilator.play();
          }
        }
      }
      if(seqSquares[i].index.x == (metIndex - 1) && seqSquares[i].containsNote == true && seqSquares[i].index.y > 5){
        for(let j = 0; j < drumCircles.length; j++){
          if(9- seqSquares[i].index.y == j){
            if(seqSquares[i].newSquare == true){
              drumCircles[j].sound.play();
              seqSquares[i].newSquare = false;
            }
            
            }
          }
      }
    }
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  // Reassigning the variables that depend on the canvas size
  spacing = (width / 6);
  circSize = height/8;
  seqSizeX = width/20;
  seqSizeY = height/20;
  seqStart = createVector(width/16, height/16);
  drumSpacing = width/4;

  // Deletes and reforms the note and drum circles if the window is resized (can't have the note circles form in the draw loop otherwise it bugs out)
  noteCircles.splice(0, noteCircles.length);
  drumCircles.splice(0, drumCircles.length);
  for(let i = 0; i < noteAmt; i++){
    noteCircles.push(new noteCircle(spacing * (i + 0.5), height/1.1, noteVals[i]));
  }
  for(let i = 0; i < 4; i++){
    drumCircles.push(new drumCircle(drumSpacing * (i + 0.5), height / 1.1, i));
  }


  seqSquares.splice(0, seqSquares.length);
  seqHighlights.splice(0, seqHighlights.length);
  for(let i = 0; i < 16; i++){
    for(let j = 0; j < 10; j++){
      seqSquares.push(new sequencerSquare (((seqStart.x * i) + seqSizeX/4) - width/110, (seqStart.y * j) + seqSizeY/4, i, j))
    }
  }
  for(let i = 0; i < 16; i++){
    seqHighlights.push(new sequencerHighlight(i, seqSizeX, seqSizeY * 13));
  }

  // Recall button.position
  sequencerButton.position(width/1.2, height/1.5);
  sequencerSlider.position(width/2.3, height/1.3);
  drumButton.position(width/200, height/1.45);
  resetButton.position(width/200, height/1.35);

  bg.resize(width, height);

  /*
  Also need to:
  - Make sure that all the dependant variables for the sequencer squares, highlights etc. get re-written
  - Delete all the drum circles and reform them
  - Delete all the sequencer squares and reform them (will cause all the circle data to get erased unfortunately)

  */

  // If I want to do this for the whole project I'd have to redraw the serquencer and reinitialize the values also, which is doable but would just take some time. 

}

function mousePressed(){
  for(let i = 0; i < noteCircles.length; i++){
    if (started == false){
      noteCircles[i].oscilator.oscilator.start();
    }
    
    if(mouseX > noteCircles[i].position.x - circSize/2 && mouseX < noteCircles[i].position.x + circSize/2 && mouseY > noteCircles[i].position.y - circSize/2 && mouseY < noteCircles[i].position.y + circSize/2 && noteMode == 1){
      noteCircles[i].oscilator.play();
    }
  }

  for(let i = 0; i < drumCircles.length; i++){
    if(mouseX > drumCircles[i].position.x - circSize/2 && mouseX < drumCircles[i].position.x + circSize/2 && mouseY > drumCircles[i].position.y - circSize/2 && mouseY < drumCircles[i].position.y + circSize/2 && noteMode == 2){
      drumCircles[i].sound.play();
    }
  }
} 

function mouseDragged(){
  for(let i = 0; i < noteCircles.length; i++){
    if(mouseX > noteCircles[i].position.x - circSize/2 && mouseX < noteCircles[i].position.x + circSize/2 && mouseY > noteCircles[i].position.y - circSize/2 && mouseY < noteCircles[i].position.y + circSize/2 && noteMode == 1){
      noteCircles[i].position.x = mouseX;
      noteCircles[i].position.y = mouseY;
      noteCircles[i].dragged = true;
      dragging = true;

      //Want the code to check if we're on the sequencer column to run only if we are holding a circle (this is what I'd need to edit if I want it to be editable on the fly) *****
      for(let column of seqHighlights){
        if(mouseX > column.position.x && mouseX < column.position.x + column.size.x && mouseY < column.position.y + column.size.y){
            column.visible = true;
          }else{
            column.visible = false;
          }
      }
    }
  }

  for(let i = 0; i < drumCircles.length; i++){
    if(mouseX > drumCircles[i].position.x - circSize/2 && mouseX < drumCircles[i].position.x + circSize/2 && mouseY > drumCircles[i].position.y - circSize/2 && mouseY < drumCircles[i].position.y + circSize/2 && noteMode == 2){
      drumCircles[i].position.x = mouseX;
      drumCircles[i].position.y = mouseY;
      drumCircles[i].dragged = true;

      //Want the code to check if we're on the sequencer column to run only if we are holding a circle (this is what I'd need to edit if I want it to be editable on the fly) *****
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

    for(let i = 0; i < drumCircles.length; i++){
      if (drumCircles[i].dragged == true){
        for(let j = 0; j < seqHighlights.length; j++){
          if (seqHighlights[j].visible == true){
            for(let square of seqSquares){
              if(square.index.x == j && (9 - square.index.y) == i){
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

  drumCircles.forEach((element) =>{     
    element.position.x = element.originalPosition.x;
    element.position.y = element.originalPosition.y;
    element.dragged = false;
  })

  dragging = false;
  for(let column of seqHighlights){
    column.visible = false;
  }
}

  function doubleClicked(){
    for (let square of seqSquares){
      let squareRightSide = square.position.x + seqSizeX;
      let squareBottomSide = square.position.y + seqSizeY;
      // if the mouse is inside the square when it's double clicked that square loses its note
      if(mouseX >= square.position.x && mouseX <= squareRightSide
        && mouseY >= square.position.y && mouseY <= squareBottomSide){
          square.containsNote = false;
        }
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
    seqSquares.forEach((square) => square.newSquare = true);
    newSquare = true;
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

function switchMode(){
  if(noteMode == 1){
    noteMode = 2;
  }else{
    noteMode = 1;
  }
}

function reset(){
  seqSquares.forEach((square) => square.containsNote = false);
}


/* 
Next steps:
- Resizing works on the whole, but the squares look a little ugly when it's full screen. 
If I'm changing this I also need to change where the lines line up. I could also shift everything down? But it'd be a headache. But maybe worth it since I want it to be something that looks good on a whole screen. 
- Sometimes adding notes is a lil buggy (adding a single note will cause all the drum notes to get filled up)

- Do I want to replace the sine oscilators with saw waves? I think that'd sound cooler 
*/