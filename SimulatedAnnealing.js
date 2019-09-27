class simulatedAnnealing{
	constructor(objective, start, canvas)
	{
		this.start = start; 
		this.objective = objective;
		this.canvas = canvas;
	}

	schedule(){
		var temperature = 100; //initial temperature
		var current = start; //initialize current = start for first iteration
		var best = current; //initalize best = current for first iteration

		var counter = 0;//to keep track of number of iteration
		var plotValue = [];//to store the value of the function at particular iteration - for plotting
		var plotCounter = [];//to store the iteration - for plotting
		
		while(temperature > 0.00001){

			var currentEnergy = this.objective(current);

			/*For plotting the value of function at each iteration*/
			if(counter%4 == 0){ //not take all points

				/*To plot points instead of line*/

				/*var rect = canvas.getBoundingClientRect();
				context.fillStyle = "#0000FF";
				context.fillRect(counter/2 +20, canvas.height -25 - currentEnergy , 2, 2 );
				*/

				plotValue.push(currentEnergy);
				plotCounter.push(counter);

			}

			counter++;


			//console.log(currentEnergy);
			var currentX = current[0];
			var currentY = current[1];

			/*Generating a random neighbour*/
			var neighbour = [];

			/*Generating a number between -1 and 1 */
			var max = 1;
			var min = -1;
			var alpha = 0.05; //step size
			var unitDirection = [];
			var unitX = Math.random() * (max - min) + min;
			var unitY = Math.random() * (max - min) + min;

			var norm = math.sqrt(math.pow(unitX,2) + math.pow(unitY,2));
			unitX = unitX/norm;
			unitY = unitY/norm;

			var neighbourX = currentX + alpha*unitX;
			var neighbourY = currentY + alpha*unitY; 

			neighbour.push(neighbourX,neighbourY);

			var newEnergy = this.objective(neighbour);


			/*Decide if we should accept the neighbour*/
			if( Math.random() <= this.acceptanceProbability(currentEnergy, newEnergy, temperature) ){
				current = neighbour;
			}

			/*Keep track of the best solution found*/
			if(this.objective(current) < this.objective(best)){
				best = current; 
			}

			// Cool the system
            temperature = temperature * 0.99;

            

		}//end of while


		/*To plot the line graph*/
		for(var i =0; i< plotCounter.length; i++)
		{
			context.beginPath();
			if(i%51 == 0){
				context.font = "bold 15px Arial";
				context.fillStyle = "red";
				context.fillText(plotValue[i].toFixed(2),plotCounter[i]/2+20, canvas.height -25 - plotValue[i]);
			}
				context.moveTo(plotCounter[i]/2+20, canvas.height -25 - plotValue[i]); //divide by 2 is to fit on the canvas 
				context.lineTo(plotCounter[i+1]/2+20, canvas.height -25 - plotValue[i+1]);
				context.lineWidth = 1;
				context.strokeStyle = '#1a1aaf'; //dark blue
				context.stroke();
			context.closePath();
		}
		
		console.log("Total Iterations: " + counter);

		return best;

	}//end of schedule

	acceptanceProbability(currentEnergy, newEnergy, temperature){
		if(newEnergy < currentEnergy){ //better than current state
				return 1; //accept it as the current state for next iteration
		}
			
		else if(newEnergy > currentEnergy){ //worse than current case
			var p = Math.exp((currentEnergy - newEnergy) / temperature);
			return p; //probability with which the worse case is made the current
		}

	} //end of acceptanceProbability function


}//end of SA

var canvas = document.getElementById("canvas");
var context= canvas.getContext("2d");

CreateAxis();

var start = [2,2]; //initial start point


function CreateAxis(){
	//X-Axis
	context.beginPath();
	context.moveTo(20, canvas.height - 20);
	context.lineTo(canvas.width - 20, canvas.height - 20 );
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	context.fillText("Iterations",canvas.width - 300, canvas.height - 10);
	context.closePath();
	//Y-Axis 
	context.beginPath();
	context.moveTo(20, canvas.height - 20);
	context.lineTo(20, 20);
	context.lineWidth = 1;
	context.strokeStyle = '#000000';
	context.stroke();
	context.fillText("Value",0, canvas.height - 200);
	context.closePath();

}

/*Rosenbrock Function*/
function Rosenbrock(start){
	var x = start[0];
	var y = start[1];
	var a =1;
	var b = 100;
	var z = math.pow((a-x),2) + b*math.pow((y - math.pow(x,2)), 2);
	return z;
	//min at (1,1)
}
/*Booth Function*/
function Booth(start){
	var x = start[0];
	var y = start[1];
	var z = math.pow((x + 2*y - 7 ), 2) + math.pow((2*x + y - 5), 2);
	return z;
	//min at (1,3)
}
/*Three-hump camel function Function*/
function Camel(start){
	var x = start[0];
	var y = start[1];
	var z = 2*math.pow(x,2) - 1.05*math.pow(x,4) + math.pow(x,6)/6 + x*y + math.pow(y,2);
	return z;
	//min at (0,0)
}



function annealing(){
	//refresh();
	/*Function that we wish to minimize*/
	var objfun = document.getElementById("objectiveFunction");
	var funSelect = objectiveFunction.options[objectiveFunction.selectedIndex].value; // The function chosen by the user

	console.log(funSelect);

	if(funSelect=="Rosenbrock"){
		anneal = new simulatedAnnealing(Rosenbrock, start, canvas);
		var best = anneal.schedule();
		var bestEnergy = Rosenbrock(best);
		var Actual_x = 1;
		var Actual_y = 1;
	}
	else if (funSelect=="Booth"){
		anneal = new simulatedAnnealing(Booth, start, canvas);
		var best = anneal.schedule();
		var bestEnergy = Booth(best);
		var Actual_x = 1;
		var Actual_y = 3;
	}
	else if (funSelect=="Three-hump camel function"){
		anneal = new simulatedAnnealing(Camel, start, canvas);
		var best = anneal.schedule();
		var bestEnergy = Camel(best);
		var Actual_x = 0;
		var Actual_y = 0;
	}
	
	var bestX = best[0];
	var bestY = best[1];

	document.getElementById("div1").innerHTML = funSelect + "<br> Min (x,y) = (" + bestX.toFixed(2) + "," + bestY.toFixed(2) + ")" + "<br> Actual (x,y) = (" + Actual_x + "," + Actual_y + ")" + "<br> Min value = " + bestEnergy.toFixed(4) + "<br> Actual Min Value = 0";

	console.log("(x, y) = (" + bestX.toFixed(2) + "," + bestY.toFixed(2) + ")" );
	console.log("Actual (x, y) = "+ Actual_x + "," + Actual_y );
	console.log("Value = " + bestEnergy);
	console.log("Actual Value = 0");


};

function refresh(){
	context.clearRect(0,0, canvas.width, canvas.height);
	CreateAxis();
}