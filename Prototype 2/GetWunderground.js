
var d = new Date();
var n = Math.trunc(d.getTime()/1000);

var xmlhttp = new XMLHttpRequest();
var url = "http://api.wunderground.com/api/4e82459ed4c5500f/forecast10day/q/MA/Boston.json";

xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        myFunction(xmlhttp.responseText);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();











function myFunction(response) {
  var center = 1;
  var weatherPoints = new Array(10);
  
  
  wundergroundPull(weatherPoints, response);

  updateScreen(weatherPoints, center);

  leftBoxElement = document.getElementById('box1');
  if (leftBoxElement) 
  {
  	leftBoxElement.addEventListener('click', function() {
      if(center > 0)
     	  center --;
      updateScreen(weatherPoints, center);
    });
  }
  rightBoxElement = document.getElementById('box3');
  if (rightBoxElement) 
  {
    rightBoxElement.addEventListener('click', function() {
      if(center< weatherPoints.length-1)
        center ++;
      updateScreen(weatherPoints, center);
    });
  }
}




function wundergroundPull(weatherPoints, response){
	var json = JSON.parse(response);
	var i;
	for(i = 0; i < 10; i++){
    var aWeatherEvent = new WeatherEvent();
		var day = json.forecast.simpleforecast.forecastday[""+i];
    aWeatherEvent.date = day.date.pretty;
    aWeatherEvent.high = day.high.fahrenheit;
    aWeatherEvent.low = day.low.fahrenheit;
    aWeatherEvent.conditions = day.conditions;


    aWeatherEvent.finish();

    weatherPoints[i] = aWeatherEvent;

	}


}

function updateScreen(weatherPoints, center) {
  if(center > 0)
    document.getElementById("box1").innerHTML = "Previous" + weatherPoints[center-1].miniString();
  else
    document.getElementById("box1").innerHTML = "";

  if(center< weatherPoints.length-1)
    document.getElementById("box3").innerHTML = "Next" + weatherPoints[center+1].miniString();
  else
    document.getElementById("box3").innerHTML = "";

  document.getElementById("mainBox").innerHTML = weatherPoints[center].toString(center);
}


function WeatherEvent() {
  this.date = "";
  this.high = 0, this.low = 0;
  this.conditions = "";
  this.imgURL = "http://i.imgur.com/KnQQIzV.png";

  this.toString = function(){
    var date = "ho" + this.date.substring(15);
    return "Showing weather for:<BR>" + date + "<br><a href='#'><img src=" + this.imgURL + 
    " height='100' width='100' border=0/></a><br>  <br>" + this.conditions + 
    "<br> With a high of " + this.high + "<br> And a low of " + this.low;
  }
  this.toString = function(center){
    var date = "";
    if(center == -1)
      date = "Yesterday, " + this.date.substring(15);
    else if(center == 0)
      date = "Today, " + this.date.substring(15);
    else if(center == 1)
      date = "Tomorrow, " + this.date.substring(15);
    else
      date = this.date.substring(15);
    return "Showing weather for:<BR>" + date + "<br><a href='#'><img src=" + this.imgURL + 
    " height='100' width='100' border=0/></a><br>  <br>It is " + this.conditions + 
    "<br> With a high of " + this.high + "<br> And a low of " + this.low;
  }
  this.miniString = function(){
    return "<br><a href='#'><img src=" + this.imgURL + " height='60' width='60' border=0/></a><br>";
  }
  this.finish = function(){
    if(this.conditions == "Partly Cloudy")
      this.imgURL = "http://i.imgur.com/sV0HXi4.png";
    else if(this.conditions == "Clear")
      this.imgURL = "http://i.imgur.com/KnQQIzV.png";
    else if(this.conditions == "Chance of Rain")
      this.imgURL = "http://i.imgur.com/zczKvID.png";
    else if(this.conditions == "Chance of a Thunderstorm")
      this.imgURL = "http://i.imgur.com/Qfho6sq.png";
    else
      this.imgURL = "http://cdn1-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-2.jpg"
  }
  //WINDY     http://i.imgur.com/NmqpsTm.png 
  //SUNNY     http://i.imgur.com/KnQQIzV.png
  //STORMY    http://i.imgur.com/Qfho6sq.png
  //SNOWY     http://i.imgur.com/OuroXOo.png
  //.5CLOUD   http://i.imgur.com/sV0HXi4.png
  //RAIN      http://i.imgur.com/zczKvID.png
  //NIGHT     http://i.imgur.com/IH74qFJ.png
  //HOT       http://i.imgur.com/o9qvoax.png
  //CLOUDY    http://i.imgur.com/FoQ8kkE.png

}