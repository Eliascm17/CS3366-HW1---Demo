let floors = [];
let Buttons = [];
var arrow, arrowdown, buttonPressMP3, OpenMP3, SirenMP3, ascendingMP3, DingMP3, PushButton, DoorsOpen;

//preloading function that load all files from assets folder
function preload(){
	//all sound user feedback sound bites
	soundFormats('mp3');
	ascendingMP3 = loadSound('assets/Elev_ascending.mp3');
	buttonPressMP3 = loadSound('assets/buttonPress.mp3');
	OpenMP3 = loadSound('assets/Open.mp3');
	SirenMP3 = loadSound('assets/Siren.mp3');
	DingMP3 = loadSound('assets/Ding.mp3');

	//arrows for visual fedback
	arrow = loadImage('assets/arrow.png');
	arrowdown = loadImage('assets/arrowdown.png');
}

//////////////////////////////////////////
//Setup function that runs once
function setup(){
	PushButton = true;
	DoorsOpen = true;
	//canvas initialization
	createCanvas(550, 800);

	//reassigning variables to make writing code easier
	let diam = 115;
	let w = width;
	let h = height;

	//arrays for x & y values of the button numbers 1-6 on the interface
	let xofNums = [w * .20, w * .50, w * .80, w * .20, w * .50, w * .80, w * .20, w * .50, w * .80];
	let yofNums = [h * .17, h * .17, h * .17, h * .37, h * .37, h * .37, h * .87, h * .87, h * .87];
	let words = ['Open','911','Close'];

	//Initializing the number button objects as an array
	for(let i = 0; i < 6; i++){
		Buttons[i] = new numButtons(xofNums[i], yofNums[i], String(i+1));
	}

	//Initializing the special button objects into an array
	Buttons[6] = new numButtons(xofNums[6], yofNums[6], String(words[0]), 38, 48, 12);
	Buttons[7] = new numButtons(xofNums[7], yofNums[7], String(words[1]), 38, 29, 12);
	Buttons[8] = new numButtons(xofNums[8], yofNums[8], String(words[2]), 38, 49, 12);

	//new instance for the Display to give userfeedback
	Disp = new Display(w*.1, h*.48, w*.8, h*.28);
} 

//////////////////////////////////////////
//Class for the Buttons with numbers in the elevator
  class numButtons {
	//basic class constructor for each button
	constructor(x,y,label,size, minusX, plusY){
		this.x = x;
		this.y = y;
		this.d = 115;
		this.label = label;
		this.alpha = 255;
		this.size = size || 62;
		this.minusX = minusX || 18;
		this.plusY = plusY || 19;
		this.color1 = 255;
		this.color2 = 255;
		this.color3 = 255;
	}

	//show method that allows the object to be seen
	show(){
		strokeWeight(4);//perim of circle
		fill(this.color1,this.color2,this.color3);//fill of the circle
		ellipse(this.x, this.y, this.d, this.d);
		fill(0);//font color
		textSize(this.size);//text size
		text(this.label, this.x-this.minusX, this.y+this.plusY); //location	
	}

  }

//////////////////////////////////////////
//Class for the use of the display to give easy to understand information to the user
class Display {
	  constructor(x1,x2,x3,x4){
		  this.x1 = x1;
		  this.x2 = x2;
		  this.x3 = x3;
		  this.x4 = x4;
		  this.floorLevel = 1;
	  }
	  //showing of the rectangle
	  show(){
		strokeWeight(1);
		fill(50);
		rect(this.x1, this.x2, this.x3, this.x4);
		strokeWeight(100);
		fill(255);
		textSize(150);
		text(this.floorLevel, width/2-35, 540);	
	  }
	  //up arrow
	  up(){
		image(arrow, 40, 395, 200,200);
		ascendingMP3.play();
	  }
	  //down arrow
	  down(){
		image(arrowdown, 310, 395, 200,200);
		ascendingMP3.play();
	  }

  }

//////////////////////////////////////////
//draw function that runs infinitely at every frame
function draw(){
	background(130);
	//displaying numbered buttons
	for (let i = 0; i < 9; i++){
		Buttons[i].show();
	}
	//displaying the display
	Disp.show();
}

//Implement the following two functions to create button effect / userfeedback
function mousePressed() {
	
	for (let i = 0; i < 9; i++) {
		d = dist(mouseX, mouseY, Buttons[i].x, Buttons[i].y);
		//if mouse click is within one of the buttons
		if (d < 57.5) { 

		//when the button 911 is pushed then sound the alarm
		 if (Buttons[i].label == '911' && PushButton == true){
			changeColorYellow(i);
			//Set timer here!
			SirenMP3.play();
			setTimeout(function (){
				changeColorWhite(i);
			}, 4000);
		 }


		 //when open or closed is pushed
		 if ((Buttons[i].label == 'Open' || Buttons[i].label == 'Close') && PushButton == true){
			if(Buttons[i].label == 'Open'){
				//if doors are already open then nothing happens
				if(DoorsOpen == true){
					DingMP3.play();
				}
				//if they are closed then open them
				else if(DoorsOpen != true){
					DoorsOpen = true;
					changeColorYellow(i);
					//Set timer here!
					setTimeout(function (){
					OpenMP3.play();
					changeColorWhite(i);
					}, 4000);
				}
			}
			else if(Buttons[i].label == 'Close'){
					//if doors are already open then you may close them
					if(DoorsOpen == true){
						DoorsOpen = false;
						changeColorYellow(i);
						//Set timer here!
						setTimeout(function (){
						OpenMP3.play();
						changeColorWhite(i);
						}, 4000);
					}
					//if they are closed then do nothing
					else if(DoorsOpen != true){
						DingMP3.play();
					}
			}
			
		 }


		 //when a number is pushed
		 else{

			 //if you are pressing a button that is equal to the level you're already on
			if(parseInt(Buttons[i].label) == Disp.floorLevel){
				DingMP3.play();
			}

			//if you press any other numbered button
			else{
				changeColorYellow(i);
				floors.push(parseInt(Buttons[i].label));
				buttonPressMP3.play();
				ElevatorLogic(); 
			}
		 }
		 buttonPressMP3.play();
		}
	}
	
}

function ElevatorLogic(){

	//while there are other floors to get to...
	for(let i = 0; i < floors.length; i++){
		if(i > 0){
			setTimeout(function (){
				//don't allow for buttons other than numbers to be pushed
				PushButton = false;
				var leastDistance = 100;
				var Floorgoingto = 0;

				//iteration compares the number on the display with the array of buttons pushed to find the least distance to another floor then goes to that floor
				for (let j = 0;j < floors.length; j++){
					if (Math.abs(Disp.floorLevel-floors[j]) < leastDistance){
						leastDistance = Math.abs(Disp.floorLevel-floors[j]);
						//set value to the floor we are going to next
						Floorgoingto = floors[j];
					}
				} 

				//then go to the floor of value: leastDistance
				//leaving towards that next floor

				//if the doors are open then close them and go to the next floor
				if(DoorsOpen == true){
					DoorsOpen = false; // become closed
					OpenMP3.play();
				}

				//play sound of elevator moving
				setTimeout(function (){
					ascendingMP3.play();
				},6100);

				//on arrival play a ding to notify that you have arrived at floor X
				setTimeout(function (){
					changeColorWhite(Floorgoingto-1);
					DingMP3.play();
					Disp.floorLevel = Floorgoingto;
					//now that we are at that level now, we can rid the value in the array and move on to the next floor
					floors = removeValuefromIndex(floors, Floorgoingto);
				},23000);

				PushButton = true;

				// //allow time for people to get out and other people to possibly push the close button if needed.
				// setTimeout(function (){}, 30500);
			}, 3000);
		}
		PushButton = true;
	}
}

//change button colors to yellow
function changeColorYellow(i){
	Buttons[i].color1 = 255;
	Buttons[i].color2 = 255;
	Buttons[i].color3 = 51;
}

//change button colors to white
function changeColorWhite(i){
	Buttons[i].color1 = 255;
	Buttons[i].color2 = 255;
	Buttons[i].color3 = 255;
}

//remove value from an array and set the button to white that correlates to that value
function removeValuefromIndex(arr, remove) {
	for( var i = 0; i < arr.length; i++){ 
		if ( arr[i] === remove) {
			console.log('array before: ' + arr);
			arr.splice(i, 1); 
			console.log('array after: ' + arr);
			ElevatorLogic();
			return arr;
		}
	 }
}


