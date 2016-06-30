var weatherData;

var sliders = []

var yesterdayReceived =0, historyReceived = 0, futureReceived = 0;

var todayValues = new Array(264);
var numHistoryHours = 0;

var todayNum = new Date().getDay();

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";



var inputFormat = d3.time.format("%I:%M %p %B %e, %Y"); //10:00 PM
var dateFormat = d3.time.format("%B %e, %Y"); //10:00 PM
var outputFormat = d3.time.format("%I:%M %p");

var date = getCurrentDate();
var hoursPast = getHourPast();

var yesterdayxmlhttp = new XMLHttpRequest();
var historyxmlhttp = new XMLHttpRequest();
var futurexmlhttp = new XMLHttpRequest();

var place = "NY/New_York"

function getData() {
	weatherData = new WeatherEvent(date);

	var url = "http://api.wunderground.com/api/4e82459ed4c5500f/yesterday/q/"+place+".json";
	yesterdayxmlhttp.onreadystatechange=function() 
	{
		if (yesterdayxmlhttp.readyState == 4 && yesterdayxmlhttp.status == 200) 
		{
			console.log("LOADED YESTERDAY");
	        historyDataYesterday(weatherData, yesterdayxmlhttp.responseText);
		    url = "http://api.wunderground.com/api/4e82459ed4c5500f/history_" + date + "/q/"+place+".json";
			historyxmlhttp.onreadystatechange=function() 
			{
				if (historyxmlhttp.readyState == 4 && historyxmlhttp.status == 200) 
				{
					console.log("LOADED TODAY PAST");
				    historyDataToday(weatherData, historyxmlhttp.responseText);
					url = "http://api.wunderground.com/api/4e82459ed4c5500f/hourly10day/q/"+place+".json";
					futurexmlhttp.onreadystatechange=function() 
					{

				  		if (futurexmlhttp.readyState == 4 && futurexmlhttp.status == 200) {

				  			console.log("LOADED FUTURE");
				        	futureData(weatherData, futurexmlhttp.responseText);	
				        	finishData(weatherData);
					       	updateScreen(1);
							addClickables(1);


							var todayDate = new Date();
						    var h = todayDate.getHours(); //January is 0
						    var m = todayDate.getMinutes(); //January is 0
						    // h = 11;
						    var value = (m/60 + h);
				
							d3.select(".sliderDisplay").html(sliderData(value));
							d3.select(".sliderDisplayTime").html(getSliderTime(value));
							// displayBar(1);
					    }    	
					}
					futurexmlhttp.open("GET", url, true);
					futurexmlhttp.send();
				}	
			}
			historyxmlhttp.open("GET", url, true);
			historyxmlhttp.send();
		}

	}
	yesterdayxmlhttp.open("GET", url, true);
	yesterdayxmlhttp.send();
	
}
function finishData(weatherData){
	if((futureReceived + historyReceived + yesterdayReceived < 3)) {//we want it to match
        setTimeout(
        	function() {finishData(weatherData);},
   			50)
   		;//wait 50 millisecnds then recheck
        return;
    }
    readyToLoad = 1;
    // var i;
    // var sum = "";
    // var num = 0;
    // for(i = 0; i < 24; i++)
    // {
    // 	sum += "" + weatherData.getDay(1).getHour(i);
    // }


}

function historyDataYesterday(weatherData, response) {
	var yesterday = new WeatherEventDay(0);
 	var json = JSON.parse(response);
 	var day = json.history.observations;
 	numHistoryHours = day.length;

	var i;
	var currHour = 0, numPoints = 0;
	var hourData = [];
 	for(i = 0; i < day.length; i++){
 		var hour = day[i];
 		if(hour.date.hour == currHour){
 			numPoints+=1;
 		}
 		else{
 			numPoints = 0;
 			yesterday.addHour(currHour, new WeatherEventHour(currHour, hourData));
 			currHour = hour.date.hour;
 			hourData = [];
 		}
 		console.log("Yesterday load " + hour.date.hour);
 		hourData[numPoints] = new WeatherEventData(hour.date.pretty, hour.tempi, hour.conds);
 	}
 	yesterday.addHour(currHour, new WeatherEventHour(currHour, hourData));

 	weatherData.addDay(0, yesterday, "YESTERDAY");
 	yesterdayReceived = 1;
}
var today;
function historyDataToday(weatherData, response) {
	today = new WeatherEventDay(1);
 	var json = JSON.parse(response);
 	var day = json.history.observations;
 	numHistoryHours = day.length;

	var i;
	var currHour = 0, numPoints = 0;
	var hourData = [];
 	for(i = 0; i < numHistoryHours; i++){
 		var hour = day[i];
 		if(hour.date.hour == currHour){
 			numPoints+=1
 		}
 		else{
 			numPoints=0;
 			console.log(hourData);
 			today.addHour(currHour, new WeatherEventHour(currHour, hourData));
 			currHour = hour.date.hour;
 			hourData = [];
 		}
 		console.log("Today Load " + hour.date.hour + ", " + hour.conds);
		hourData[numPoints] = new WeatherEventData(hour.date.pretty, hour.tempi, hour.conds);
 	}
 	today.addHour(currHour, new WeatherEventHour(currHour, hourData));
 	weatherData.addDay(1, today, "TODAY");
 	historyReceived = 1;
}
function futureData(weatherData, response){

	var json = JSON.parse(response);
 	var data = json.hourly_forecast;
	var i = data[0].FCTTIME.hour;

	var index = 0;
	for(; i < 24; i++){
		var hour = data[index];
		console.log("Future today " +i  + hour.condition);

		today.addHour(i, new WeatherEventHour(i, [new WeatherEventData(hour.FCTTIME.pretty, hour.temp.english, hour.condition)]));
		index++;
	}
	weatherData.addDay(1, today, "FUTURE");
	var j = 0;
	var day;

	for(i = 0;i < 8; i++){
		day = new WeatherEventDay(i+2);
		for(j = 0; j < 24; j++){
			// console.log("Future Load " +j );

			var hour = data[index];
			// console.log("Future " +j  + hour.condition);

			day.addHour(j , new WeatherEventHour(j, [new WeatherEventData(hour.FCTTIME.pretty, hour.temp.english, hour.condition)]));
			index++;
		}
		weatherData.addDay((i+2), day, "FUTURE");
	}

 	for(; i < data.length; i++){
 		todayValues[i] = "(" + data[i].FCTTIME.hour + ", " + data[i].temp.english + "," + data[i].condition + ")";
 	}
 	futureReceived = 1;
}

function getCurrentDate(){
	var date = new Date();
	var todayDate = new Date();
	var dd = todayDate.getDate();
	var mm = todayDate.getMonth()+1; //January is 0!
	if(mm < 10)
		mm = "0"+mm;
	var yyyy = todayDate.getFullYear();
	return "" + yyyy + mm + dd;

}


function getCurrentHour(){
	var todayDate = new Date();
	var mm = todayDate.getHours(); //January is 0
	return mm;

}

function getHourPast(){
	var date = new Date();
	return date.getHours();
}

function formatTime(time)
{
	return  inputFormat.parse(time.substring(0, time.indexOf("EDT on")) + time.substring(time.indexOf("EDT on")+ 7));
}
function changeLocation(location)
{
	center = 1;
	place = location;
	yesterdayxmlhttp = new XMLHttpRequest();
	historyxmlhttp = new XMLHttpRequest();
	futurexmlhttp = new XMLHttpRequest();
	yesterdayReceived =0, historyReceived = 0, futureReceived = 0;
	setTimeout(
        	function() {getData();},
   			100)
	

}
function sliderData(value)
{
	var hour =  Math.floor(value);
	var minutes = Math.floor((value % 1) * 60) ;
	var width = d3.select("#slider").node().getBoundingClientRect().width;

	d3.select(".sliderDisplay").style("left", ((value/15) * width - width/2 + 40)+"px");
    // d3.select(".sliderDisplayTime").style("left", ((value/15) * width - width/2 + 73)+"px");

	return weatherData.getDay(center).getHour(hour).getSliderData();
}
function getSliderTime(value)
{
	var hour =  Math.floor(value);
	var minutes = Math.floor((value % 1) * 60) ;
	var width = d3.select("#slider").node().getBoundingClientRect().width;

	// d3.select(".sliderDisplay").style("left", ((value/15) * width - width/2 + 40)+"px");
    d3.select(".sliderDisplayTime").style("left", ((value/15) * width - width/2 + 73)+"px");


	if(hour > 12)
		hour -= 12;
	if(minutes<10)
		minutes = "0" + minutes;
	return "<p>" + hour + ":" + minutes + "<p>";
}
function adjustIcons(center)
{
	var i = 6;
	for(; i < 21; i++){
		document.getElementById("s" + i).innerHTML = "";
		var hour = weatherData.getDay(center).getHour(i);
		document.getElementById("s" + i).innerHTML = hour.getIcon();
	}
	
}


function WeatherEvent(date){
	this.days = new Array(10);
	this.date = date;
	this.toString = function(){
		return date;
	}
	this.addDay = function(num, day, source){
		this.days[num] = day;
	}
	this.getDay = function(day){
		console.log(this.days[day]);

		if(day > -1)
			return this.days[day];
		else 
			return new WeatherEventDay(0);
	}
	this.eraseDay = function(day){
		this.days[day] = null;
	}
	
	this.numDays = function(day){return this.days.length;}
}
function WeatherEventDay(num){
	this.dayNum = num;
	this.hours = new Array(24);

	// var i;
	// for( i = 0; i < 24; i++)
	// {
	// 	this.hours[i] = new WeatherEventHour(i, []);
	// }

	this.imgURL = "http://i.imgur.com/KnQQIzV.png";


	this.getDate = function(){
		var hour = getCurrentHour();
		var time = weekday[(todayNum+num-1)%7];
		// console.log(time.getDay());
		console.log(time+"time");
		var date = "";
	    if(this.dayNum == 0)
	      date = "Yesterday, " + time;//.substring(15);
	    else if(this.dayNum  == 1)
	   	{
		  // var time = formatTime(this.getHour(hour).getTime());
	      date = "Today, " + time;//.substring(15);
	    }
	    else if(this.dayNum  == 2)
	      date = "Tomorrow, " + time;//.substring(15);
	    else
	      date = time;
	    return date;
		// return days[num]
	}
	// this.toString = function(){
 //    	var date = "ho" + this.date.substring(15);
	//     return "Showing weather for:<BR>" + date + "<br><a href='#'><img src=" + this.imgURL + 
	//     " height='100' width='100' border=0/></a><br>  <br>" + this.conditions + 
	//     "<br> With a high of " + this.high + "<br> And a low of " + this.low;
 //  	}
  	this.addHour = function(num, hour){
		this.hours[num] = hour;
	}

	this.getHour= function(hour){
		var data = this.hours[hour];
		if(data == null)
		{
			data = this.hours[hour-1];	
		}
		if(data == null)
		{
			var i =hour;
			for(;i< 24;i++)
			{
				data = this.hours[i];
				if(data != null)
					i = 24;
			}
		}		
		console.log(this.hours[hour] + ", " + this.hours[hour-1] +","+ this.hours[hour+1]);
		return data;
	}
	this.getHours= function(){
		return this.hours;
	}
	this.toString = function(){
		return this.hours[12].toString();// + this.miniString();
	}
	this.toString = function(hour){
		return this.getHour(hour).toString();// + this.miniString();
	}
	this.miniString = function(){
		console.log(hoursPast +","+ this.getHour(hoursPast));
    	return "<br><a href='#'><img src=" + this.getHour(hoursPast).paneImage() + " height='190' width='200' border=10/></a><br>";
	}
	this.getTemps = function(){
		var temps = new Array(24),
		i =0;
		for(i = 0; i < 24; i++)
		{
			temps[i] = this.hours[i].getTemp();
		}
		return temps;
	}
}

var conds = [];
function WeatherEventHour(hour, dataPoints) {
	this.hour = hour;
	this.dataPoints = dataPoints;
	console.log(hour + "," + dataPoints);
	// this.iconURL = "http://icons.wxug.com/i/c/k/clear.gif";
/*["Mostly Cloudy","Overcast", Light Rain", "Scattered Clouds",
 "Thunderstorm", "Partly Cloudy", "Clear", "Chance of a Thunderstorm", */

	this.getIcon = function()
	{
		if(this.dataPoints.length == 0){
			return "";
		}
		else{
			return "<a href='#'><img src=" + this.dataPoints[0].iconURL + " height='50px' width='50px' border=10/></a>"
		}
	}
	this.getDisplayIcon = function()
	{
		if(this.dataPoints.length == 0){
			return "";
		}
		else{
			return "<a href='#'><img src=" + this.dataPoints[0].sliderIconURL + " height='75px' width='35px' border=10/></a>"
		}
	}


	this.toString = function(){
		// console.log(hour+"data"+dataPoints.length);
		if(this.dataPoints.length == 0){
			return "emptyToString";
		}
		else{
			var string = "";
			if(center == 0)
				string ="Yesterday, the weather was ";
			else if(center == 1)
				string ="Right now, the weather is ";
			else if(center == 2)
				string ="Tomorrow, the weat ";
			return dataPoints[0].temp + String.fromCharCode(176)+ "<br>and<br>" + this.dataPoints[0].condition;
		}
		
	}
	this.paneImage = function(){
		// console.log(hour+"data"+dataPoints.length);
		if(this.dataPoints.length == 0){
			return "Images/Pane/squares/Meatball.png";
		}
		else{
			return this.dataPoints[0].getImage();
		}
		
	}

	this.getSliderData = function(){
		return this.getTemp() + String.fromCharCode(176) +"<br>" + this.getDisplayIcon();
	}
	// this.getTime = function(){
	// 	if(dataPoints.length == 0){
	// 		return null;
	// 	}
	// 	else{
	// 		return dataPoints[0].time;
	// 	}
	// }
	this.getTemp = function(){
		if(this.dataPoints.length == 0){
			return -1;
		}
		else{
			return this.dataPoints[0].temp;
		}
	}
	// console.log(this);

}

function WeatherEventData(time, temp, condition) {
	this.time = time;
	this.temp = temp;
	this.condition = condition;
	this.iconURL = "http://icons.wxug.com/i/c/k/clear.gif";
	this.sliderIconURL = "http://icons.wxug.com/i/c/k/clear.gif";
	this.imgURL = "Images/Pane/squares/Meatball.png";


	this.getImage = function(){
		return this.imgURL;
	}

	if(this.condition  == "Clear"){
		this.iconURL = "SliderIcons/Sunny.png";
		this.sliderIconURL = "DisplayIcons/Sunny.png";
		this.imgURL = "Images/Pane/squares/Clear.png";
	}
	else if(this.condition == "Mostly Cloudy"){
		this.iconURL = "SliderIcons/Cloudy.png";
		this.sliderIconURL = "DisplayIcons/Cloudy.png";
		this.imgURL = "Images/Pane/squares/Cloudy.png";
	}
	else if(this.condition == "Scattered Clouds"){
		this.iconURL = "SliderIcons/PartlyCloudy.png";
		this.sliderIconURL = "DisplayIcons/PartlyCloudy.png";
		this.imgURL = "Images/Pane/squares/PartlyCloudy.png";

	}
	else if(this.condition == "Partly Cloudy"){
		this.iconURL = "SliderIcons/PartlyCloudy.png";
		this.sliderIconURL = "DisplayIcons/PartlyCloudy.png";
		this.imgURL = "Images/Pane/squares/PartlyCloudy.png";
	}
	else if(this.condition == "Overcast"){
		this.iconURL = "SliderIcons/Cloudy.png";
		this.sliderIconURL = "DisplayIcons/Cloudy.png";
		this.imgURL = "Images/Pane/squares/Cloudy.png";
	}
	else if(this.condition == "Light Rain"){
		this.iconURL = "SliderIcons/Rainy.png";
		this.sliderIconURL = "DisplayIcons/Rainy.png";
		this.imgURL = "Images/Pane/squares/Rain.png";
	}
	else if(this.condition == "Chance of Rain"){
		this.iconURL = "SliderIcons/Rainy.png";
		this.sliderIconURL = "DisplayIcons/Rainy.png";
		this.imgURL = "Images/Pane/squares/Rain.png";
	}
	else if(this.condition == "Thunderstorm"){
		this.iconURL = "SliderIcons/ThunderStorm.png";
		this.sliderIconURL = "DisplayIcons/ThunderStorm.png";
		this.imgURL = "Images/Pane/squares/Thunderstorm.png";
	}
	else if(this.condition == "Chance of a Thunderstorm"){
		this.iconURL = "SliderIcons/ThunderStorm.png";
		this.sliderIconURL = "DisplayIcons/ThunderStorm.png";
		this.imgURL = "Images/Pane/squares/Thunderstorm.png";
	}




	

}
getData();






