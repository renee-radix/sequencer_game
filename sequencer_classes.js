class sequencerSquare{ 
  constructor(x, y, i, j){
    this.position = createVector(x, y);
    this.size = createVector(seqSizeX, seqSizeY); 
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
    strokeWeight(3);
    stroke(100);
    rect(this.position.x, this.position.y, this.size.x, this.size.y);

    if (this.containsNote == true && this.index.y < 6){
      ellipseMode(CORNER);
      let circleOffset = this.size.x/7;
      noStroke();
      colorMode(HSB);
      fill(noteColor, 100, noteCircles[5 - this.index.y].brightness);
      ellipse(this.position.x + circleOffset, this.position.y + circleOffset, this.size.x/1.5, this.size.y/1.5)
    }

    if (this.containsNote == true && this.index.y > 5){
      ellipseMode(CORNER);
      let circleOffset = this.size.x/7;
      noStroke();
      fill(drumCircles[9-this.index.y].brightness);
      ellipse(this.position.x + circleOffset, this.position.y + circleOffset, this.size.x/1.5, this.size.y/1.5)
    }
  }
}

class sequencerHighlight{
    // These are highlights that are meant to be on top of the sequencer when either a circle is hovering over the top or it's playing through it
    constructor(i, w, h){
      this.position = createVector(seqSquares[i * 10].position.x, seqSquares[0].position.y - (seqSizeX / 3.5)); // This will be the start point for the highlight (top X Y corner). i is the index that it gets fed, a number from 0 to 15
      this.size = createVector(seqSizeX, seqSizeY * 13); // Width and height of the hightlight, stored in a vector for convenience (it will probably need to be destroyed and reformed again under window resize to make it all fit correctly)
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