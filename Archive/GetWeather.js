1465884000

var d = new Date();
var n = Math.trunc(d.getTime()/1000);

var xmlhttp = new XMLHttpRequest();
var url = "http://api.openweathermap.org/data/2.5/forecast?q=Boston,us&mode=json&units=imperial&appid=874870f00e684038fc8ad82917ef3cfc";

xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        myFunction(xmlhttp.responseText);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();
//














function myFunction(response) {
  
  var center = 2;

  var weatherPoints = new Array(39);
  
  
  openWeatherMapPull(weatherPoints, response);

  leftBoxElement = document.getElementById('box1');
  if (leftBoxElement) 
  {
  	leftBoxElement.addEventListener('click', function() {
      if(center-1 > 0)
      {
     	center --;
      }
      document.getElementById("mainBox").innerHTML = weatherPoints[center].toString();
      document.getElementById("box1").innerHTML = "Previous<br>" + weatherPoints[center-1].miniString();
  	  document.getElementById("box3").innerHTML = "Next<br>" + weatherPoints[center+1].miniString();
    });
  }
  rightBoxElement = document.getElementById('box3');
  if (rightBoxElement) 
  {
    rightBoxElement.addEventListener('click', function() {
      if(center+1 < weatherPoints.length-1)
      {
        center ++;
      }
      document.getElementById("mainBox").innerHTML = weatherPoints[center].toString();
      document.getElementById("box1").innerHTML = "Previous<br>" + weatherPoints[center-1].miniString();
  	  document.getElementById("box3").innerHTML = "Next<br>" + weatherPoints[center+1].miniString();
    });
  }

  //document.getElementById("nav").innerHTML = weatherPoints[1].toString();
  	  document.getElementById("mainBox").innerHTML = weatherPoints[center].toString();
      document.getElementById("box1").innerHTML = "Previous<br>" + weatherPoints[center-1].miniString();
  	  document.getElementById("box3").innerHTML = "Next<br>" + weatherPoints[center+1].miniString();


}



function  openWeatherMapPull(weatherPoints, response){

  var i = -1;

  var phase = "START";
  var newPhase = "START";
  var stack = [];
  var weatherStack = []


  JSON.parse(response, function(k, v) {
  	// console.log(phase);
  	newPhase = phase;
  	stack.push(k);   
    stack.push(v);      
    //console.log(k);
    if(k == "dt_txt")
    {
      i = i + 1;
      if(i>=0)
      {
        weatherPoints[i] =  unstackWeather(stack, i);
        stack = [];
      }
      //console.log(k+v);
    }
    return v;     
  });
}

function unstackWeather(stack, dayNum) {
    var event = new WeatherEvent();
    var string = "<tr>";
    var thing;
    //string += "<td>Weather Event " + dayNum + "</td>";                    
    var value = stack.pop();
    var type = stack.pop();


    var data = ["dt", "", "dt_txt", "sys", "pod", "rain", "3h", "wind", "deg", "speed", "clouds", "all", "weather", ]
    var dateTime = "", weatherMain = "";
    var i = 0, temp = 0, minTemp = 0, maxTemp = 0, pressure = 0, seasLevel = 0;
    while(type != undefined)
    {
      //string+="<td>" + type + ", " + value + "</td>";
      event.addData(type, value);
      value = stack.pop();
      type = stack.pop();
      i++;
    }
    event.finish();



    string+="</tr><tr><td>" + event.dateTime + ", " + event.description + ", " + event.temp + ", " + event.mainDescription +  "</td>";
    string+="</tr>"
    return event;              // The function returns the product of p1 and p2
}
function WeatherEvent() {
  this.dateTimeValue = 0, this.dateTime = 0, this.temp = 0, this.mainDescription = "", this.description = "", this.icon = "", this.imgURL = "";
  this.addData = function (name, value) {
      if(name == "dt_txt")
        this.dateTime = value;
      else if(name == "main" && value != "[object Object]")
      {
        //console.log(name+ ", "+ value);
        this.mainDescription = value;
      }
      else if(name == "description")
        this.description = value;
      else if(name == "temp")
        this.temp = value;
      else if(name == "dt")
        this.dateTimeValue = value;
      else{};
  };
  this.toString = function(){
    return "CURRENTVAL <BR>" + n+ " <BR>VALUE "+ this.dateTimeValue + "<BR>Currently Displaying Weather for: " + this.dateTime + "<br><a href='#'><img src=" + this.imgURL + " height='100' width='100' border=0/></a><br>" +  "<BR><BR>It is currently " + this.temp + " degrees outside and is " + this.description;
  }
  this.miniString = function(){
    return "<a href='#'><img src=" + this.imgURL + " height='80' width='80' border=0/></a>";
  }

  this.drawSquare = function(){
    return 0;
  }
  this.finish = function(){
    if(this.mainDescription == "Clouds")
      this.imgURL = "http://i.imgur.com/sV0HXi4.png";
    else if(this.mainDescription == "Clear")
      this.imgURL = "http://i.imgur.com/KnQQIzV.png";
    else if(this.mainDescription == "Rain")
      this.imgURL = "http://i.imgur.com/zczKvID.png";
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