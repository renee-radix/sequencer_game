class noteCircle{
    constructor(x, y, note){
      this.size = circSize;
      this.position = createVector(x, y);
      this.originalPosition = createVector(this.position.x, this.position.y);
      this.brightness = map(x, 0, width, 20, 100);
      colorMode(HSB);
      this.fill = color(noteColor, 100, this.brightness);
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
  
  
  class noteEnvelope{
    constructor(){
    this.envelope = new p5.Env();
    this.envelope.setADSR(0.001, 0.5, 0.2, 0.5);
    this.envelope.setRange(1, 0);
    }
  }