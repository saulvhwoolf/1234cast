var a = new WeatherEvent();
a.addData('dt_text', '1:00 PM'); 
a.addData('main', 'cloudy');  
a.addData('temp', '60');  

var b = new WeatherEvent();
b.addData('dt_text', '2:00 PM'); 
b.addData('main', 'slightly cloudy');  
b.addData('temp', '66'); 

var c = new WeatherEvent();
c.addData('dt_text', '3:00 PM'); 
c.addData('main', 'not very cloudy');  
c.addData('temp', '70'); 

var d = new WeatherEvent();
d.addData('dt_text', '4:00 PM'); 
d.addData('main', 'sunny');  
d.addData('temp', '77'); 

var e = new WeatherEvent();
e.addData('dt_text', '5:00 PM'); 
e.addData('main', 'FUKN HAWT');  
e.addData('temp', '80'); 

var weatherPoints = new Array(5);
weatherPoints[0] = a;
weatherPoints[1] = b;
weatherPoints[2] = c;
weatherPoints[3] = d;
weatherPoints[4] = e;


var center = 2;

document.getElementById("boxC").innerHTML = weatherPoints[center].toString();
document.getElementById("boxL").innerHTML = weatherPoints[center-1].toString();
document.getElementById("boxR").innerHTML = weatherPoints[center+1].toString();

leftBoxElement = document.getElementById('boxL');
if (leftBoxElement) 
{
  leftBoxElement.addEventListener('click', function() {
    if(center-1 > 0)
    {
      center --;
    }
    document.getElementById("boxC").innerHTML = weatherPoints[center].toString();
    document.getElementById("boxL").innerHTML = weatherPoints[center-1].toString();
    document.getElementById("boxR").innerHTML = weatherPoints[center+1].toString();
  });
}
rightBoxElement = document.getElementById('boxR');
if (rightBoxElement) 
{
  rightBoxElement.addEventListener('click', function() {
    if(center+1 < weatherPoints.length-1)
    {
      center ++;
    }
    document.getElementById("boxC").innerHTML = weatherPoints[center].toString();
    document.getElementById("boxL").innerHTML = weatherPoints[center-1].toString();
    document.getElementById("boxR").innerHTML = weatherPoints[center+1].toString();
  });
}
function WeatherEvent() {
  this.dateTime = 0, this.temp = 0, this.mainDescription = "", this.description = "", this.icon = "", this.imgURL = "";
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
  };
  this.toString = function(){
    return "Currently Displaying Weather for: " + this.dateTime + "<BR><BR>It is currently " + this.temp + " degrees outside and is " + this.description;
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
}


