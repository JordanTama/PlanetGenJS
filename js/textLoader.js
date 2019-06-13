var nameArray = [];
var sizeArray = [];
var massArray = [];
var tempArray = [];

var randomNumbers = function(numDigits){
    // append random numbers in order to make a random designation number
    // input variable is the number of digits long
    var text = "";
    for(var i = 0;i<numDigits;i++){
        text+=THREE.Math.randInt(0,9);
    }
    return text;
}

var makeText = function(){
    // called to make relevent text for a body
    makeName();
    makeSize();
    makeMass();
    makeTemp();
}

var setText = function(int){
    // display all text for a body stored in the array
    setName(nameArray[int]);
    setSize(sizeArray[int]);
    setMass(massArray[int]);
    setTemp(tempArray[int]);
}

var makeArray = function(){
    // fill all arrays corresponding to each body with appropriate display text that is randomly set on startup
    for(var i=0;i<numOfPlanets+1;i++){
        nameArray[i] = makeName();
        sizeArray[i] = makeSize();
        massArray[i] = makeMass();
        tempArray[i] = makeTemp();
    }
    sizeArray[0] = numOfPlanets+" Planets";
    massArray[0] = "Mass: "+randomNumbers(3)+" Solar Masses";
    tempArray[0] = "Surface Temperature: "+randomNumbers(5)+" K";
    
}

var makeName = function(){
    var text = "Name: " + "S" +randomNumbers(5);
    return text;
}

var setName = function(text){
    document.getElementById("name").innerHTML = text;
}


var makeSize = function(){
    var text = "Radius: " + randomNumbers(5)+" km";
    return text;
}

var setSize = function(text){
    document.getElementById("size").innerHTML = text;
}

var makeMass = function(){
    var text = "Mass: " +randomNumbers(1)+"."+randomNumbers(3)+" x 10^"+randomNumbers(2)+" kg";
    return text;
}

var setMass = function(text){
    document.getElementById("mass").innerHTML = text;
}

var makeTemp = function(){
    var text = "Surface Temperature: "+randomNumbers(3)+" K";
    return text;
}

var setTemp = function(text){
    document.getElementById("temp").innerHTML = text;
}

var clearText = function(){
    // clear all HTML display text, for use during zoom in/out of planets
    document.getElementById("name").innerHTML = "";
    document.getElementById("size").innerHTML = "";
    document.getElementById("mass").innerHTML = "";
    document.getElementById("temp").innerHTML = "";
}
