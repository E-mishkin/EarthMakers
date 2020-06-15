/*
    Authors:     Nicholas Perez(neperez23@gmail.com), Robert Cox
    Date:       3/14/2020
    Version:    1.0
    Green River College Seismic Simulating Earthquakes.

    Authors:    Robert Cox(rcox18@mail.greenriver.edu) and Team Earthmakers
    Date:       6/9/2020
    Version:    2.0
 */

/*
   To whomever takes up this project I would love to know the outcome of where you take it.
   My email is listed above but anyone at GR Software Dev. teachers/staff has my contact info.
   Goodluck!!  -Nicholas Perez
*/

const X_PADDING = 15;
const Y_PADDING = 16;
const BORDER_WIDTH = 3;
const NAV_BAR_HEIGHT = 58;
const TOTAL_Y_OFFSET = NAV_BAR_HEIGHT + BORDER_WIDTH + Y_PADDING;
const CENTER_BUFFER = 25;
const EARTHQUAKE_RANGE = 600;
const STATION_POS = ['62,216','150,485','443,526','539,316','483,54','221,41','238,224'];
const MIN_MAGNITUDE = 2.5;
const MAX_MAGNITUDE = 9.0;
const P_WAVE_SPEED = 8;
const S_WAVE_SPEED = 3.45;
const MAX_EARTHQUAKE_DURATION = 25;
const MAX_LABEL_COUNT = 184;


let earthquake;
let ctx = document.getElementById("myChart");
let myChart = makeChart([]);
let selected = '';

let rangeCircleDiv = $("#rangeCircleDiv");

let choiceX;
let choiceY;

let earthQLonDegree;
let earthQLonMin;

let choiceLonDegree;
let choiceLonMin;

//TODO: calculate and set latitude values for user choice and earthquake
let earthQLatDegree;
let earthQLatMin;

let choiceLatDegree;
let choiceLatMin;

/* RANDOM GEN NUMBERS */

//generates a random number between 1 and numRange, inclusive
function getRandomIntInclusive(numRange){
    return Number(Math.floor(Math.random() * numRange)+1);
}

//generates a random number between two given integers
function getRandomIntInclusiveRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//generates a random number between 0 and numRange, exclusive
function getRandomFloatExclusive(numRange){
    return Number(Math.random() * numRange);
}

//generates a random number between two given floats
function getRandomFloatInclusive(min, max) {
    return Number(Math.random() * (max - min) + min);
}

//initialize the map-pane tooltip
$("#map-pane").tooltip({content:"Select a station", track:true});

/* OBJECTS */

//Station object with a pos: x and y, as well as its distance from the earthquake
function Station(idName, x, y, elementType, cssClass, distance, range, data) {
    this.idName = idName;
    this.x = x;
    this.y = y;
    this.elementType = elementType;
    this.cssClass = cssClass;
    this.distance = distance;
    this.range = range;
    this.data = data;
}

//Earthquake object with a pos: x and y, as well as its magnitude, or strength
function Earthquake(x, y, magnitude, pWaveSpeed, sWaveSpeed, duration) {
    this.x = x;
    this.y = y;
    this.magnitude = magnitude;
    /*this.pWaveSpeed = pWaveSpeed;
    this.sWaveSpeed = sWaveSpeed;*/
    this.duration = duration;
}

//circumference range tool for stations
function RangeToolParts(idName, x, y, elementType, cssClass) {
    this.idName = idName;
    this.x = x;
    this.y = y;
    this.elementType = elementType;
    this.cssClass = cssClass;
}

/* CORE INIT */

//initialize the tool
function init() {

    //resets
    myChart = makeChart([]);
    document.getElementById('map-pane').classList.toggle('mapPointer', false);
    document.getElementById('solve-for').innerHTML = '';

    //create earthquake, stations, circle range tool
    earthquake = new Earthquake(
        getRandomIntInclusive(EARTHQUAKE_RANGE)+X_PADDING,
        getRandomIntInclusive(EARTHQUAKE_RANGE) + NAV_BAR_HEIGHT,
        Number(getRandomFloatInclusive(MIN_MAGNITUDE, MAX_MAGNITUDE).toFixed(2)),
        P_WAVE_SPEED,
        S_WAVE_SPEED,
        getRandomIntInclusive(MAX_EARTHQUAKE_DURATION)+10);

    earthQLonDegree = asLonDegree(earthquake.x);
    earthQLonMin = asLonMin(earthquake.x);
    earthQLatDegree = asLatDegree(earthquake.y);
    earthQLatMin = asLatMin(earthquake.y);


    let stationPool = createStations();
    let rangeTools = generateRangeToolParts(stationPool);
    console.log(earthquake);
    //solveEpicenter(earthquake);

    //plot items
    plotItems(stationPool, document.getElementById('stationsDiv'));
    plotItems(rangeTools, document.getElementById("rangeCircleDiv"));

    //sets tool tips for each station
    setToolTips(stationPool);

    //events
    addSelectedEvent(stationPool);
}

/*window.addEventListener("mousemove", (e)=>{
    console.log("x: " + e.clientX + ", y: " +e.clientY + ", target:" + e.target.tagName);
});*/
window.addEventListener("click", (e)=>{
    console.log(e.target.id);
    console.log("Window click x:" + e.x);
    console.log("Window click y:" + e.y);
    console.log("Choice x: "+choiceX+ "Choice y: "+choiceY);
    console.log("Earthquake x:" + earthquake.x +", y:"+earthquake.y);
    console.log("Earthquake Lon:" + asLonDegree(earthquake.x) + "\xB0" +asLonMin(earthquake.x) +"', Lat:" + asLatDegree(earthquake.y) + "\xB0" +asLatMin(earthquake.y) +"'");
});

//creates an array of station objects
function createStations() {
    let arr = [];

    for (let i = 0; i < STATION_POS.length; i++) {
        arr.push(new Station(
            'station' + (i + 1).toString(),
            Number(STATION_POS[i].split(',')[0]),
            Number(STATION_POS[i].split(',')[1]),
            'div',
            'station-style',
            findDistance(
                Number(STATION_POS[i].split(',')[0])+X_PADDING,
                Number(STATION_POS[i].split(',')[1])+NAV_BAR_HEIGHT,
                earthquake.x,
                earthquake.y
            ),
            0,
            0,
        ));

        arr[i]['data'] = generateChartData(arr[i]);
    }
    return arr;
}

//creates an array of range tool parts
function generateRangeToolParts(stations) {
    let arr = [];

    let nameParts = ['-distanceLine','-circleClick','-circumferenceText'];
    let cssClasses = ['line','circle','circleSize'];

    for (let i = 0; i < stations.length; i++) {
        for(let f = 0; f < nameParts.length;f++) {

            //plus 11 and plus 12 are used to put these elements under the station
            arr.push(new RangeToolParts(
                stations[i].idName+nameParts[f],
                stations[i].x-11,
                stations[i].y-12,
                'div',
                cssClasses[f]
            ));
        }
    }
    return arr;
}

/* HELPER FUNCTIONS */

//finds and returns the distance between a station and the earthquake
function findDistance(stationX, stationY, earthquakeX, earthquakeY) {
    let a =0.0;
    let b =0.0;

    if(stationX > earthquakeX){
        a = stationX - earthquakeX;
    }
    if( stationX < earthquakeX){
        a = earthquakeX - stationX;
    }
    if(stationY > earthquakeY){
        b = stationY - earthquakeY;
    }
    if( stationY < earthquakeY){
        b = earthquakeY - stationY
    }
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

//used to retrieve the css pixel amount from a given element and style type
function getStyleNumber(element, type){
    switch (type) {
        case "top":
            return parseInt(element.css("top").split('px')[0]);
        case "left":
            return parseInt(element.css("left").split('px')[0]);
        case "right":
            return parseInt(element.css("right").split('px')[0]);
        case "bottom":
            return parseInt(element.css("bottom").split('px')[0]);
        case "height":
            return parseInt(element.css("height").split('px')[0]);
        case "width":
            return parseInt(element.css("width").split('px')[0]);
    }
}

//plots item/s to destination div/s
function plotItems(elements, destination) {

    destination.innerHTML = '';

    for(let i = 0 ; i< elements.length ; i++) {
        let newDiv = document.createElement(elements[i].elementType);

        newDiv.id = elements[i].idName;
        newDiv.className = elements[i].cssClass;
        newDiv.style.left = elements[i].x+'px';
        newDiv.style.top = elements[i].y+'px';
        newDiv.setAttribute('data-toggle', 'tooltip');

        destination.appendChild(newDiv);
    }
}

//get data from notepad to check
function getFormData() {


    let groupOne = document.getElementById('data-group-1').children;
    let groupTwo = document.getElementById('data-group-2').children;
    let groupThree = document.getElementById('data-group-3').children;

    console.log('station value for select 1: ' + groupOne[0].childNodes[3].selectedOptions[0].value);
    console.log(groupOne[0].childNodes[7].value);//lag
    console.log(groupOne[0].childNodes[11].value);//amp
    console.log(groupOne[0].childNodes[15].value);//dis
    console.log(groupOne[0].childNodes[19].value);//mag


}

//sets tool tips for each station
function setToolTips(stations) {
    let stationDiv = document.getElementById('stationsDiv').children;

    let name;

    for(let i = 0 ; i < stations.length ; i++){
        name = stations[i].idName.charAt(0).toUpperCase()+stations[i].idName.slice(1, 7)+' '+stations[i].idName.charAt(7);
        stationDiv[i].setAttribute('title', name);
    }
}

//part of addSelectedEvent()
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}


function clearMeasureTools() {
    timeTool.css("width", "0px");
    timeTool.css("left", "0px");
    document.getElementById('timeText').innerHTML = "0 sec";
    ampTool.css("height", "0px");
    ampTool.css("top", "0px");
    document.getElementById('ampText').innerHTML = "0mm";
}

//add selected event listener to stations
function addSelectedEvent(elements){
    for(let i = 0; i<elements.length;i++){
        document.getElementById(elements[i].idName).addEventListener('click', ()=>{

            clearMeasureTools();
            graph.tooltip({content: "Select a Measurement Tool."});

            if(!isEmpty(selected)) {
                document.getElementById(selected.idName).classList.remove('selected');
            }
            selected = elements[i];

            //calculate selected station longitude
            let selectedLonDeg = asLonDegree(selected.x);
            let selectedLonMin = asLonMin(selected.x);
            //Todo: calculate selected station latitude
            let selectedLatDeg = asLatDegree(selected.y);
            let selectedLatMin = asLatMin(selected.y);

            document.getElementById(selected.idName).classList.add('selected');

            //set station labels above the graph
            document.getElementById('stationName').innerHTML = selected.idName;
            document.getElementById('stationName').style.textTransform = 'capitalize';
            document.getElementById('stationXPos').innerHTML = ((selectedLonMin === "60.00")? selectedLonDeg - 1 : selectedLonDeg) + "\xB0"+
                ((selectedLonMin === "60.00")? "0.00" : selectedLonMin) + "'";
            //TODO: use calculated latitudes
            document.getElementById('stationYPos').innerHTML = selectedLatDeg + "\xB0" +
                ((selectedLatMin === "60.00")? "0.00" : selectedLonMin) + "'";

            myChart.destroy();
            myChart = makeChart(selected.data);
        })
    }
}

/* RANGED TOOL CONTROLS */

//updates the ranged tool per station
function setCircumference(event, incrementModifier) {
    let rangeHTMLParts = rangeCircleDiv.children();

    let line, circle, distance;

    //change for grow and shrink
    if(event.deltaY > 0) {
        incrementModifier[0] = 0 - incrementModifier[0];
        incrementModifier[1] = 0 - incrementModifier[1];
    }

    for(let i = 0; i< rangeHTMLParts.length; i++){
        if(selected.idName.slice(7, 8) === rangeHTMLParts[i].id.split('-')[0].slice(7,8)){
            line = rangeHTMLParts[i];
            circle = rangeHTMLParts[i+1];
            distance = rangeHTMLParts[i+2];
            break;
        }
    }
    if(selected.range >= 0 ) {
        //prevents neg range numbers
        if (selected.range + incrementModifier[0] < 0) {
            selected['range'] = 0;
        } else {
            selected['range'] += incrementModifier[0];

            line.style.width = ((selected.range/2)-1)+'px';

            circle.style.width = selected.range+'px';
            circle.style.height = selected.range+'px';

            circle.style.top = (parseInt(circle.style.top.split("px")[0]) - incrementModifier[1])+'px';
            circle.style.left = (parseInt(circle.style.left.split("px")[0]) - incrementModifier[1])+'px';

            distance.innerHTML = selected.range/2 + ' km';

            document.getElementById('rangeSize').innerHTML = (selected.range/2).toString();
        }
    }
}

/* BUTTON AND MOUSE EVENTS */

//init button event to refresh the page
document.getElementById('init').addEventListener('click', () =>{
    window.location.reload();
});

function asLonDegree(toConvert) {
    return Math.floor(((toConvert - X_PADDING-36 + 80)/80 )) - 125;
}

function asLonMin(toConvert) {
    return ((1-(Math.abs((toConvert - X_PADDING - 36 + 80) % 80) / 80)) * 60).toFixed(2);
}

let latToOffset;
let pixelGap;
let offsetLat;

function setLatOffsets(toConvert) {
    if (toConvert <= 209) {
        latToOffset = 12;
        pixelGap = 120;
        offsetLat = 50;
    } else if (toConvert <= 327) {
        latToOffset = 250;
        pixelGap = 118;
        offsetLat = 48;
    } else if (toConvert <= 443) {
        latToOffset = 366;
        pixelGap = 116;
        offsetLat = 47;
    } else if (toConvert <= 557) {
        latToOffset = 480;
        pixelGap = 114;
        offsetLat = 46;
    } else {
        latToOffset = 592;
        pixelGap = 112;
        offsetLat = 45;
    }
}

function asLatDegree(toConvert) {

    setLatOffsets(toConvert);

    return Math.floor(-(toConvert - NAV_BAR_HEIGHT-Y_PADDING-BORDER_WIDTH - latToOffset + pixelGap)/ pixelGap) + offsetLat;
}

function asLatMin(toConvert) {
    return ((1 - (((toConvert - NAV_BAR_HEIGHT-Y_PADDING-BORDER_WIDTH-latToOffset + pixelGap) % pixelGap)) / pixelGap) * 60).toFixed(2);
}

//mouse move event for current x,y on map
document.getElementById('map-pane').addEventListener('mousemove', (event) => {

    let lonDegree = asLonDegree(event.clientX);
    let lonMin = asLonMin(event.clientX);
    //Todo: calculate mouse latitude
    let latDegree = asLatDegree(event.clientY);
    let latMin = asLatMin(event.clientY);

    document.getElementById('pos').innerHTML =
        "Lon: " +
        ((lonMin === "60.00")? lonDegree - 1 : lonDegree) + "\xB0"+
        ((lonMin === "60.00")? "0.00" : lonMin) + "', " +
        "Lat: " + latDegree + "\xB0" +
        ((latMin === "60.00")? "0.00" : latMin) + "'";
});

//toggle event for map grid
document.getElementById('gridToggle').addEventListener('click', () =>{
    document.getElementById('grid-pane').classList.toggle('gridStyle');
});

//creates circle measure on wheel movement
document.addEventListener('wheel', (e) =>{
    let circumferenceModifier;//4,2,8,4
console.log(e);
    if(selected !== ''){
        if(e.shiftKey){
            circumferenceModifier = [8,4];
        }else{
            circumferenceModifier = [2,1];
        }
        setCircumference(e, circumferenceModifier);
    }
});

let plotEpiBtnHandler = () =>{
    document.getElementById('map-pane').classList.toggle('mapPointer');
    if (document.getElementById('map-pane').classList.contains('mapPointer')){
        $("#map-pane").tooltip("option", "content", "Place Epicenter");
        $("#map-pane").on("click", getChoiceHandler);
    } else {
        $("#map-pane").tooltip("option", "content", "Select Station");
        $("#map-pane").off("click", getChoiceHandler);
    }
};

let solveHandler = (e)=>{

    document.getElementById('map-pane').classList.toggle('mapPointer', false);

    //TODO: change this if/else to a modal popup and not an alert
    if(Math.abs((choiceX) - earthquake.x) < 13 &&
        Math.abs((choiceY) - (earthquake.y)) < 13) {
        alert("Good job!\n" +
            "Your choice:      Lon: " + ((choiceLonMin === "60.00")? choiceLonDegree - 1 : choiceLonDegree) + "\xB0"+
            ((choiceLonMin === "60.00")? "0.00" : choiceLonMin) + "', Lat: "+ choiceLatDegree + "\xB0" +
            ((choiceLatMin === "60.00")? "0.00" : choiceLatMin) + "'" +"\n" +
            "Actual location: Lon: " + ((earthQLonMin === "60.00")? earthQLonDegree - 1 : earthQLonDegree) + "\xB0"+
            ((earthQLonMin === "60.00")? "0.00" : earthQLonMin) + "', Lat: " + earthQLatDegree + "\xB0" +
            ((earthQLatMin === "60.00")? "0.00" : earthQLatMin) + "'");

    } else {
        alert("Try again!\n" +
            "Your choice:      Lon: " + ((choiceLonMin === "60.00")? choiceLonDegree - 1 : choiceLonDegree) + "\xB0"+
            ((choiceLonMin === "60.00")? "0.00" : choiceLonMin) + "', Lat: "+ choiceLatDegree + "\xB0" +
            ((choiceLatMin === "60.00")? "0.00" : choiceLatMin) + "'" +"\n" +
            "Actual location: Lon: " + ((earthQLonMin === "60.00")? earthQLonDegree - 1 : earthQLonDegree) + "\xB0"+
            ((earthQLonMin === "60.00")? "0.00" : earthQLonMin) + "', Lat: "  + earthQLatDegree + "\xB0" +
            ((earthQLatMin === "60.00")? "0.00" : earthQLatMin) + "'");
        $("#plotEpi").off('click', plotEpiBtnHandler);
        $("#plotEpi").on('click', plotEpiBtnHandler);
            document.getElementById('plotEpi').click();
    }
};

//adds the epicenter to the map and toggles the crosshairs
let getChoiceHandler = (event) => {

    console.log(event);
    $("#solveBtn").off("click", solveHandler);
    document.getElementById('solve-for').innerHTML = '';

    let solver = document.createElement('div');

    solver.id = 'solverDiv';

    choiceX = event.clientX;
    choiceY = event.clientY;


    choiceLonDegree = asLonDegree(choiceX);
    choiceLonMin = asLonMin(choiceX);

    choiceLatDegree = asLatDegree(choiceY);
    choiceLatMin = asLatMin(choiceY);

    solver.style.top = event.clientY-CENTER_BUFFER-62 +'px';
    solver.style.left = event.clientX-CENTER_BUFFER-5+'px';

    document.getElementById('solve-for').append(solver);

    solver.classList.add('solveCircleStyle');

    $("#map-pane").tooltip("option", "content", "Your answer: LON: " +
        ((choiceLonMin === "60.00")? choiceLonDegree - 1 : choiceLonDegree) + "\xB0"+
        ((choiceLonMin === "60.00")? "0.00" : choiceLonMin) + "', LAT: " +
        choiceLatDegree + "\xB0" +
        ((choiceLatMin === "60.00")? "0.00" : choiceLatMin) + "'");

    $("#solveBtn").on("click", solveHandler);

};

//toggle for plot epicenter button
$("#plotEpi").on('click', plotEpiBtnHandler);


//notepad
document.getElementById('notePadBtn').addEventListener('click', () =>{
    getFormData();
});

let tracker  = 0;
let timeBtn = $( "#time" );
let ampBtn = $("#amp");
let graph = $("#stationGraph");
let timeTool = $("#timeTool");
let ampTool = $('#ampTool');

timeBtn.tooltip({content:"Click to begin time measurement."});
ampBtn.tooltip({content:"Click to begin amplitude measurement."});
graph.tooltip({content: "Select a Measurement Tool.", track:true});

//Amp and time tool handlers for the graph measurements
let ampToolHandler = (event)=>{
    const midpoint = 129;
    const topAmpBuffer = 17;
    const bottomAmpBuffer = 242;
    const ampIncrement = 12.5;

    if(event.offsetY < midpoint) {
        if(event.offsetY < 18){
            ampTool.css("top", topAmpBuffer+'px');
            ampTool.css("height", ((midpoint+1)-topAmpBuffer)+'px');
        }else{
            ampTool.css("top", event.offsetY + 'px');
            ampTool.css("height", ((midpoint+1)-event.offsetY)+'px');
        }
    }
    if(event.offsetY > midpoint){

        console.log('click y: '+event.offsetY);

        ampTool.css("top", midpoint+'px');

        if(event.offsetY > bottomAmpBuffer && getStyleNumber(ampTool, 'top') === midpoint){
            ampTool.css("height", (bottomAmpBuffer - midpoint) +'px');
        }else{
            ampTool.css("height", (event.offsetY - getStyleNumber(ampTool, 'top')) + 'px');
        }
        console.log('current top after clicked bellow'+getStyleNumber(ampTool, 'top'));
    }

    if(getStyleNumber(ampTool, 'height') > 0){
        if(getStyleNumber(ampTool, 'top') === midpoint){
            document.getElementById('ampText').innerHTML = (getStyleNumber(ampTool, 'height')/-ampIncrement).toPrecision(2)+'mm';
        }
        else{
            document.getElementById('ampText').innerHTML = (getStyleNumber(ampTool, 'height')/ampIncrement).toPrecision(2)+'mm';
        }
    }
    //sets amp tool to the mid
    if(isNaN(getStyleNumber(ampTool, 'height'))){
        ampTool.css("top", midpoint+'px');
    }
    graph.tooltip(
        "option", "content",
        "Amplitude Measured: " + document.getElementById('ampText').innerHTML
    );
};

let timeToolHandler = (event)=>{
    if (tracker === 0) {
        timeTool.css("left", event.offsetX +"px");
        graph.tooltip(
            "option", "content",
            "Select Measurement End time."
        );
        tracker++;
    } else {
        timeTool.css("width", (event.offsetX - getStyleNumber(timeTool, "left")) + "px");
        graph.tooltip(
            "option", "content",
            "Time Measured: " + Math.round(getStyleNumber(timeTool, 'width')/3)+' sec'
        );
        timeBtn.tooltip(
            "option", "content",
            "Click to begin time measurement."
        );
        tracker--;
        document.getElementById('timeText').innerHTML = Math.round(getStyleNumber(timeTool, 'width')/3)+' sec';
        graph.off("click", timeToolHandler);
    }

    /*const leftTimeBuffer = 31;
    const rightTimeBuffer = 582;
    if(event.offsetX <= leftTimeBuffer && event.offsetX < timeTool.style.right){
        timeTool.style.left = leftTimeBuffer+'px';
    }
    else if(event.offsetX >= rightTimeBuffer && event.offsetX > timeTool.style.left) {
        timeTool.style.right = rightTimeBuffer+'px';
    }
    else {
        timeTool.style.left = event.offsetX+'px';
    }*/

    //checks of the user moves the time line with a width causing it to go outside of the parent div
   /* if((getStyleNumber(timeTool, 'width')+getStyleNumber(timeTool, 'left')) > rightTimeBuffer){
        timeTool.style.width = (rightTimeBuffer - getStyleNumber(timeTool, 'left'))+'px';
        document.getElementById('timeText').innerHTML = Math.round(getStyleNumber(timeTool, 'width')/3)+' sec';
    }

    timeToolUpdate(timeTool, event, rightTimeBuffer);*/
};

timeBtn.on('click', ()=>{
    clearMeasureTools();
    timeBtn.tooltip("option", "content", "Move mouse to graph.");
    ampBtn.tooltip("option", "content", "Click to begin amplitude measurement.");
    graph.tooltip("option", "content", "Select Measurement Start time.");
    graph.off('click', ampToolHandler);
    graph.on('click', timeToolHandler);
});

ampBtn.on('click', ()=>{
    clearMeasureTools();
    ampBtn.tooltip("option", "content", "Move mouse to graph.");
    timeBtn.tooltip("option", "content", "Click to begin time measurement.");
    graph.tooltip("option", "content", "Select Peak to Measure.");
    graph.off('click', timeToolHandler);
    graph.on('click', ampToolHandler);
});

/* CHART */

//creates a tiered data in order
function taperData(range, scale) {
    let arr = [];

    for(let i = 0; i<range; i++){
        arr.push(Number(getRandomFloatExclusive(scale).toFixed(2)));
    }
    return arr.sort().reverse();
}

//changes every other value to negative
function alternateValue(arr) {
    let tempArr = [];

    for(let i = 0; i<arr.length; i++){
        if(i%2===0){
            tempArr.push(arr[i]);
        }else{
            tempArr.push(-Math.abs(arr[i]));
        }
    }
    return tempArr
}

//used the sort data into staggered sections so its a more random looking linear progression
function bracketSort(arr) {
    let highBracket = Number(Math.round(getRandomIntInclusiveRange(5,arr.length/3)));
    let medBracket = Number(Math.round(getRandomIntInclusiveRange(4,arr.length/2)));
    let lowBracket = arr.length-(highBracket+medBracket);

    let highPart = arr.slice(0,lowBracket).sort(function(){return 0.5 - Math.random()});
    let medPart = arr.slice(lowBracket,medBracket+lowBracket).sort(function(){return 0.5 - Math.random()});
    let lowPart = arr.slice(medBracket+lowBracket,arr.length).sort(function(){return 0.5 - Math.random()});

    return highPart.concat(medPart).concat(lowPart);
}

//makes the data for the charts
function generateChartData(station) {
    let duration = Number(earthquake.duration);
    let magnitude = earthquake.magnitude;

    let dataAmount = MAX_LABEL_COUNT;

    let arrivalTime = Number((station.distance/P_WAVE_SPEED).toString().split('.')[0]);
    let data = [];
    let lagTime =((station.distance/S_WAVE_SPEED) - arrivalTime);

    //adds arrival time
    for(let a = 0 ; a < arrivalTime ; a++){
        data.push(0);
        dataAmount--;
    }

    console.log(station.idName +' '+station.distance);
    console.log(station.idName +' '+P_WAVE_SPEED);
    console.log(station.idName +' Pre trim arrival time: '+station.distance/P_WAVE_SPEED);
    console.log(station.idName +' Arrival Time: '+arrivalTime);
    console.log('...');


    //adds p wave
    let pData = alternateValue(bracketSort(taperData(duration, (magnitude/2))));
    for(let p = 0; p<earthquake.duration ; p++){
        data.push(pData[p]);
        dataAmount--;
    }

    console.log(pData);

    //lag time
    for (let lt = 0; lt < lagTime ; lt++){
        if(lt%2 === 0){
            data.push(.09)
        }else{
            data.push(-.09);
        }
        dataAmount--;
    }

    let sData = alternateValue(bracketSort(taperData(duration, magnitude)));
    for(let s = 0; s<earthquake.duration ; s++){
        data.push(sData[s]);
        dataAmount--;
    }

    for (let i = 0 ; i < dataAmount ; i ++){
        data.push(0);
    }

    return data;
}

//makes chart labels
function makeChartLabels(seconds) {
    let labels = [];
    let count = 0;

    for(let i = 0 ; i <= seconds ; i++){
        if(count%8 === 0){
            labels.push(count +' sec');
        }else{
            labels.push(count)
        }
        count++;
    }
    return labels;
}

//creates a new chart based on data from generateChartData()
function makeChart(data) {
    return new Chart(ctx, {
        type: 'line',
        options:{
            responsive:true,
            maintainAspectRatio: false,


            scales:{
                yAxes: [{
                    ticks:{
                        // beginAtZero: true,
                        max: 9.0,
                        min: -9.0
                    }
                }]
            },
            legend:{
                display: false
            },
            tooltips: {
                enabled: false
            },
            hover: {
                mode: null
            }
        },
        data: {
            labels: makeChartLabels(MAX_LABEL_COUNT),

            datasets:[
                {
                    label: 'reading',
                    fill: false,
                    borderCapStyle: 'butt',
                    pointRadius: 0,
                    lineTension: 0,
                    borderColor: '#2c882b',
                    borderWidth: 1,


                    data: data
                }
            ],

        }
    });
}

init();
document.getElementById('gridToggle').click();