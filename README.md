# Sequencer Game
## About
A sequencer built using the p5.js sound library for my final for the Creative Coding 2 class at Portland Community College.

It's pretty buggy because of the way that the sound library works with different browsers. Best results come from using Chrome but it functions well enough using other browsers. Trying to use it on an android phone horribly broke it. 

Drum sounds sourced from a Roland TR-808 drum machine that my teacher supplied me (the synth is a simple sine tone oscilator hooked up to an envelope).

The original intention was that this be a sketch that used websockets and allowed for multiple people to edit at a time, but since the sketch seems to work very differently on different machines and I started running out of time I decided to scrap that idea. 

##How to play

At the bottom of the sketch there should be 6 coloured circles if you're in note mode, or 4 greyscale circles if you're in drum mode (switch between modes with the button on the left). Click a circle to audition the sound. Notes are arranged from low to high, left to right. Drum sounds are arranged kick, snare, hi hat and cymbol left to right. 

At the top of the sketch there's a grid representing a 16 step sequencer. Drag a note onto a specific column (will highlight when you hold it over the top) and drop to add the note to that specific beat. Double click a square to get rid of that note and click the "Reset sequencer" button to erase all the notes and start over. 

Each row corresponds to only one type of sound (top 6 for each of the notes and bottom 4 for each of the drum sounds). Sequencer should support multiple notes in a single column but that increases the chance of audio glitches. 

Click the button on the right to start or stop the sequencer, slide the slider to change the BPM of the sequencer. 

