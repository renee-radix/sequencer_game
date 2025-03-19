// global variables
let noteVals = ['57', '59', '62', '64', '67', '69'], noteAmt = 6; 
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

//loading assets (background and drum sounds)
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

  // creating buttons/sliders and making them look nice
  sequencerButton = createButton('Start/stop sequencer');
  sequencerButton.position(width/1.2, height/1.5);
  sequencerButton.mouseClicked(toggleSequencer);
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

  //Sets the sizes for the various elements
  circSize = height/8;
  seqSizeX = width/20;
  seqSizeY = height/15;
  seqStart = createVector(width/16, height/16);
  
  // Random color for note circles
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
}

function draw() {
  background(bg);
  // BPM readout
  let bpm = sequencerSlider.value();
  textSize(32);
  fill(0);
  text(bpm + ' BPM', width/2.4, height/1.35);
  bpmConverter(bpm);
  
  // Passing this off to the metronome
  time = millis();
  timeCheck(milliseconds);
  metronome(); 

  // Displaying sequencer
  for (let square of seqSquares){
    square.display();
  }
  // Bounding lines for sequencer so you can divide into 4 easily
  fill(0);
  stroke(50);
  strokeWeight(4);
  line(width/4.05, height/100, width/4.05, height/1.5);
  line(width/2.01, height/100, width/2.01, height/1.5);
  line(width/1.338, height/100, width/1.338, height/1.5);

  // If the sequencer is on display the correct highlight
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

  //Display the highlights that should be displayed
  seqHighlights.forEach((element) => element.display());

  //Display circles for notes or drums depending on which mode we're in
  if(noteMode == 1){
    noteCircles.forEach((element) => element.run());
  }else{
    drumCircles.forEach((element) => element.run());
  }
  
  // Code to make the sequencer play back. If sequencer is on cycles through all the columns and plays the notes that are present (one block for notes, one for drums). 
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

// If the window is resized redraw everything 
// (if I wanted to get really fancy I could add some code here that saves what squares have notes in them and what don't)
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  // Reassigning the variables that depend on the canvas size
  spacing = (width / 6);
  circSize = height/8;
  seqSizeX = width/20;
  seqSizeY = height/15;
  seqStart = createVector(width/16, height/16);
  drumSpacing = width/4;

  // Deletes and reforms the note and drum circles 
  noteCircles.splice(0, noteCircles.length);
  drumCircles.splice(0, drumCircles.length);
  for(let i = 0; i < noteAmt; i++){
    noteCircles.push(new noteCircle(spacing * (i + 0.5), height/1.1, noteVals[i]));
  }
  for(let i = 0; i < 4; i++){
    drumCircles.push(new drumCircle(drumSpacing * (i + 0.5), height / 1.1, i));
  }

  // Deletes and reforms the sequencer and highlights
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

  //Resizing the background
  bg.resize(width, height);
}

function mousePressed(){
  // Starts audio playback when canvas is clicked
  for(let i = 0; i < noteCircles.length; i++){
    if (started == false){
      noteCircles[i].oscilator.oscilator.start();
    }
    
    // If you click on a note circle it plays back the tone it has
    if(mouseX > noteCircles[i].position.x - circSize/2 && mouseX < noteCircles[i].position.x + circSize/2 && mouseY > noteCircles[i].position.y - circSize/2 && mouseY < noteCircles[i].position.y + circSize/2 && noteMode == 1){
      noteCircles[i].oscilator.play();
    }
  }

  // Same with drum circles
  for(let i = 0; i < drumCircles.length; i++){
    if(mouseX > drumCircles[i].position.x - circSize/2 && mouseX < drumCircles[i].position.x + circSize/2 && mouseY > drumCircles[i].position.y - circSize/2 && mouseY < drumCircles[i].position.y + circSize/2 && noteMode == 2){
      drumCircles[i].sound.play();
    }
  }
} 

function mouseDragged(){
  // Code to enable dragging the circles into place
  for(let i = 0; i < noteCircles.length; i++){
    if(mouseX > noteCircles[i].position.x - circSize/2 && mouseX < noteCircles[i].position.x + circSize/2 && mouseY > noteCircles[i].position.y - circSize/2 && mouseY < noteCircles[i].position.y + circSize/2 && noteMode == 1){
      noteCircles[i].position.x = mouseX;
      noteCircles[i].position.y = mouseY;
      noteCircles[i].dragged = true;
      dragging = true;

      // If we're holding a circle and we're not sequencing check through all the columns and display a highlight if the circle is in the viscinity of one
       for(let column of seqHighlights){
        if(mouseX > column.position.x && mouseX < column.position.x + column.size.x && mouseY < column.position.y + column.size.y && sequencing == false){
            column.visible = true;
          }else{
            column.visible = false;
          }
      }
    }
  }

  //Same as above for drums
  for(let i = 0; i < drumCircles.length; i++){
    if(mouseX > drumCircles[i].position.x - circSize/2 && mouseX < drumCircles[i].position.x + circSize/2 && mouseY > drumCircles[i].position.y - circSize/2 && mouseY < drumCircles[i].position.y + circSize/2 && noteMode == 2){
      drumCircles[i].position.x = mouseX;
      drumCircles[i].position.y = mouseY;
      drumCircles[i].dragged = true;

    for(let column of seqHighlights){
        if(mouseX > column.position.x && mouseX < column.position.x + column.size.x && mouseY < column.position.y + column.size.y && sequencing == false){
            column.visible = true;
          }else{
            column.visible = false;
          }
      }
    }
  }


}

function mouseReleased(){
  // If we're dragging a circle over a column when the mouse is released, the circle gets dropped into the relevant column
  for(let i = 0; i < noteCircles.length; i++){
    if (noteCircles[i].dragged == true){
      for(let j = 0; j < seqHighlights.length; j++){
        if (mouseX > seqHighlights[j].position.x && mouseX < seqHighlights[j].position.x + seqHighlights[j].size.x && mouseY < seqHighlights[j].position.y + seqHighlights[j].size.y){
          for(let square of seqSquares){
            if(square.index.x == j && (5 - square.index.y) == i && square.index.y < 6 && noteMode == 1){
              square.containsNote = true;
            }
          }
        }
      }
     }
    }
    // Same as above for drum parts
    for(let i = 0; i < drumCircles.length; i++){
      if (drumCircles[i].dragged == true){
        for(let j = 0; j < seqHighlights.length; j++){
          if (mouseX > seqHighlights[j].position.x && mouseX < seqHighlights[j].position.x + seqHighlights[j].size.x && mouseY < seqHighlights[j].position.y + seqHighlights[j].size.y){
            for(let square of seqSquares){
              if(square.index.x == j && ((9 - square.index.y) == i) && square.index.y > 5 && noteMode == 2){
                square.containsNote = true;
              }
            }
          }
        }
       }
      }

  //Circle goes back to where it started
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
  // Double click on a circle in the sequencer to remove it
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

// Code to make the metronome run
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

function bpmConverter(number){
  milliseconds = (60000 / (number * 4));
}

// Code to turn the sequencer on and off
function toggleSequencer(){
  if (sequencing == true){
    sequencing = false;
  }else{
    sequencing = true;
    metIndex = 1;
  }
}

//Code to switch between adding drum parts and adding notes
function switchMode(){
  if(noteMode == 1){
    noteMode = 2;
  }else{
    noteMode = 1;
  }
}

// Code to reset everything
function reset(){
  seqSquares.forEach((square) => square.containsNote = false);
}

// Couldn't get this to work
// function pitchShift(){
//   noteVals.splice(0, noteVals.length);
//   console.log(origNoteVals[1]);
//   noteCircles.splice(0, noteCircles.length);
//   for(let i = 0; i < 6; i++){ 
//     let newNote = origNoteVals[i] + 5;
//     noteVals.push(newNote);
//     //console.log(origNoteVals[i]);
//     //console.log("Code run!");
//   }
//   for(let i = 0; i < noteAmt; i++){
//     noteCircles.push(new noteCircle(spacing * (i + 0.5), height/1.1, noteVals[i]));
//   }
  
// }
