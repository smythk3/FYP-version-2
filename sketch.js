//flow and response array
var option = 1;

//variables for FFT
var mic
var fft;
var smoothing = 0.2; 
var binCount = 1024; 
var particles =  new Array(binCount);

//variables for console logging, and buttons
var playButton;
var stopButton;
var length;
var sliderVolume;
var sliderPan;
var sliderRate;
var button;
var currentTime;
var println = console.log;

//preloading the audio file
function preload() {
  song = loadSound('earthshine.mp3');
}

function setup() {
  c = createCanvas(windowWidth, windowHeight);
  noStroke();

//Buttons for stop, play, and volume slider
  playButton = createButton("play");
  playButton.position(10,30);
  playButton.mousePressed(startStop);
  
  function startStop() {
    if (!song.isPlaying()) {
      song.play();
      playButton.html("pause");
    } else {
      song.pause();
      playButton.html("play");
    }
    }
    
    stopButton = createButton("stop");
    stopButton.position(10,50);
    stopButton.mousePressed(stop);
    
    function stop() {
      if (song.isPlaying()) {
        song.stop();
        stopButton.html("stop");
      }
    }
  
  // initialize the FFT, plug in our variables for smoothing and binCount
  fft = new p5.FFT(smoothing, binCount);
  
  // instantiate the particles
  for (var i = 0; i < particles.length; i++) {
    var x = map(i, 0, binCount, 0, width * 2);
    var y = random(0, height);
    var position = createVector(x, y);
    particles[i] = new Particle(position);
  }

  background(0);
}

function draw() {

  var spectrum = fft.analyze(binCount);
  for (var i = 0; i < binCount; i++) {
    var thisLevel = map(spectrum[i], 0, 255, 0, 1);

    particles[i].update( thisLevel );

    particles[i].draw();

    particles[i].position.x = map(i, 0, binCount, 0, width * 2) + random(-4, 4);
  }


//else if (option == 2) {
//  function Beat(x, y, s) { 
	//s = random(100, 200); 
		//if (keyIsPressed) {
			//press key p to display 
			//if ((key == 'p')) {
				//noStroke();
				//randomize size of ellipses in this range to create pusling effect
				//s = random(10, 110);  
				//fill(206, 255, 255); 
				//ellipse(x, y, s, s);
			
				//s = random(100, 200);
				//strokeWeight(5); 
				//stroke(205, 0, 205);
				//noFill();   
				//ellipse(x, y, s, s); 
			//}
	//	}	
//}
//}

  copy(c, 0, 0, windowWidth, windowHeight, 0, 1, windowWidth, windowHeight);
  
  //prints in seconds the song times to the console
  console.log(song.currentTime());
}

var Particle = function(position) {
  this.position = position;
  this.scale = random(0, 1.5);
  this.speed = createVector(0, random(0, 100) );
  this.color = [random(0, 100), random(0,255), random(0,100)];
  var r = random(50,500);
  if (random(2)<=1) {
    this.color = [0,0,0];
  }
  else {
    this.color = [Math.min(255, r/(2+random(10)/10*1)), Math.min(255, r/(1+random(10)/10*1)), Math.min(255, r)];
  }
};

var theyExpand = 1;

// use FFT bin level to change speed and diameter
Particle.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / (someLevel*2);
  if (this.position.y > height) {
    this.position.y = 0;
  }
  this.diameter = map(someLevel, 0, 1, 0, 200) * this.scale * theyExpand;

};

Particle.prototype.draw = function() {
  fill(this.color);
  var s = new Object(this.color);
  s[3] = 100;
  stroke(s);
  strokeWeight(4);
  ellipse(
    this.position.x, this.position.y,
    this.diameter, this.diameter);
    
    rect(this.position.x, this.position.y,
    this.diameter, this.diameter);
  
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

function mousePressed() {
  option ++;
  if (option > 5) option = 1;
  
}
