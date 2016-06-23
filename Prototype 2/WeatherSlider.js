    
(function(){
	var MAP_WIDTH = $("#vizWeather").width(), //960,
    MAP_HEIGHT = 8,
    MAP_SCALE = 2400,
    NB_HEIGHT = 60;//1160
    
                      

    //"2:00 PM EDT on June 19, 2016"
    var inputFormat = d3.time.format("%I:%M %p %B %e, %Y"); //10:00 PM
    var outputFormat = d3.time.format("%I:%M %p"),
    sliderAnim,
    UPDATE_DT=2000,
    runAnim = function() {
        publish('maps', [1, true]);
    };
    // DATA_DIR = "";//http://kyrandale.com/viz/static/expts/uk-weather-stations/data/";//typeof window.DATA_DIR !== 'undefined'? window.DATA_DIR: 'data/';
    // console.log(DATA_DIR);
    $('#sliderAnim').button();
    $("#sliderAnim").click( function(event){
        event.preventDefault();
        if ($(this).hasClass("active") ) {
            clearInterval(animTimer);
            // $("#nav").animate({marginTop:"0px"}, 200);          
            $(this).removeClass("active");
            $(this).html('Animate');
        } else {
            animTimer = setInterval(runAnim, UPDATE_DT);
            // $("#nav").animate({marginTop:"-100px"}, 200);   
            $(this).addClass("active");
            $(this).html('Stop');
        }
        return false;
    });

	var WeatherSlider = function(datafile, parent, title, channel, cb, width, height, scale){
		var slider = this;
		this.width = typeof width !== 'undefined'? width: MAP_WIDTH;
        this.height = typeof height !== 'undefined'? height: MAP_HEIGHT;
        this.scale = typeof scale !== 'undefined'? scale: MAP_SCALE;


 		this.datafile = datafile;
        this.parent = parent;
        this.title = title;

        this.channel = channel;
        this.cb = cb;	

        this.temps = [];
        this.details = [];
        this.time = [];
        this.count = [];
        this.weatherEvent = [];

        subscribe(channel, function(row, incFlag) {
            if(incFlag){row = (row + slider.currentRow)%slider.temps.length;}
            slider.updateGrid(row);
        });
        this.currentRow = 0;


        this.svg = d3.select(parent).append("svg")
            .attr("width", this.width)
            .attr("height", this.height+NB_HEIGHT);

        this.parseDate = d3.time.format("%m:%d:%Y").parse;



        xmlhttp.onreadystatechange=function() {
    		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        		slider.initData(xmlhttp.responseText);
    		}
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
       
        	

	};

	WeatherSlider.prototype = {
		initData: function(response) {
            var slider = this;
           
            var json = JSON.parse(response);
            // console.log(json.hourly_forecast[0].temp.english);
            var temps = [], time = [], details = [], i = 0, count = [];
            var events = []
            for(i = 0; i < 36; i++)
            {
            	var hour = json.hourly_forecast[i];
            	temps[i] = hour.temp.english;
            	details[i] = hour.condition;
            	time[i] = inputFormat.parse(hour.FCTTIME.civil + " " +
            		hour.FCTTIME.month_name + " " + hour.FCTTIME.mday + ", " + 
            		hour.FCTTIME.year);
            	count[i] = i+".";
            	slider.weatherEvent[i] = new WeatherEvent(outputFormat(time[i]), details[i], temps[i])
            	slider.weatherEvent[i].finish();
            	console.log(slider.weatherEvent[i].toString());
            	//console.log(time[i] + ": " + temps[i] + ", " + details[i]);

            }
            // console.log("time legnth" + time.length);
            var total = "";

            for(i = 0; i < time.length; i++)
            {
            	total += time[i] + ", ";
            }
            // console.log(total);
            slider.temps = temps;
            slider.details = details;
            slider.time = time;
            slider.count = count;
            // slider.weatherEvent = events;

            slider.scaleData();
            slider.makeNavBar();
            dataline = temps[slider.currentRow];
            //if(slider.cb){slider.cb();}

            
        },
        scaleData: function() {
            // color-map to highest and lowest values
            var slider=this, vals, min, max;

            //this.getRowStats(); 
            min = 20;
            max = 90;
            this.gridColors = d3.scale.linear()
                .domain([min, min+max/2, max])
                .range(["#4575b4", "#ffffbf", "#a50026"])
                .interpolate(d3.interpolateHcl);
            var COLOR_BARS = 50, COLOR_BAR_WIDTH = 10, COLOR_BAR_HEIGHT = 2, 
            COLOR_BAR_X = this.width-70, COLOR_BAR_Y = this.height - 200, 
            CB_LABEL_INDICES=[0, 25, 49];
            this.cbscale = d3.scale.linear().domain([0, COLOR_BARS]).range([min, max]);
            this.colorbar = this.svg.selectAll('colorbar')
                .data(d3.range(COLOR_BARS))
                .enter().append('g')
                .attr("transform", "translate(" + COLOR_BAR_X + "," + COLOR_BAR_Y + ")");

            // this.colorbar.append('rect')
            //     .attr('width', COLOR_BAR_WIDTH)
            //     .attr('height', COLOR_BAR_HEIGHT) 
            //     .attr('x', 0)
            //     .attr('y', function(d, i) {
            //         return -i*COLOR_BAR_HEIGHT;
            //     })
            //     .attr('fill', function(d) {
            //         return map.gridColors(map.cbscale(d));
            //     })
            // ;

            // this.colorbar.append('text')
            //     .text(function(d, i) {
            //         if(_.contains(CB_LABEL_INDICES, i)){
            //             return parseInt(min + (max-min) * (i*1.0/COLOR_BARS), 10); 
            //         }})
            //      .attr("x", COLOR_BAR_WIDTH + 10)
            //     .attr("y", function(d, i) { return -i * COLOR_BAR_HEIGHT;})
            //     .attr("dy", '.3em')
            //     .attr('class', 'cb-text');
                      	//"2:00 PM EDT on June 19, 2016"
        },
        makeNavBar:function(){
        	var slider=this, nbscale, NAVBAR_WIDTH = this.width - 40, NAVBAR_HEIGHT = 20, NAVBAR_X = 20, NAVBAR_Y = this.height,
            NB_AXIS_X, NB_AXIS_Y, xScale;
            this.x = d3.time.scale().range([0, NAVBAR_WIDTH]);
            var i = 0, scale = [];
            for(;i<37;i++){
            	scale[i] = i*NAVBAR_WIDTH/36;
            } 


            xScale = d3.time.scale().domain([slider.time[0], slider.time[35]]).range([0, NAVBAR_WIDTH]);

            this.xAxis = d3.svg.axis().scale(xScale).ticks(36).orient("bottom");
            this.x.domain(d3.extent(this.time, function(t){return t;}));

        	nbscale = d3.scale.linear().domain([0, 36]).range([0, NAVBAR_WIDTH]);

        	this.navbar = this.svg.selectAll('navbar')
                .data(this.temps, function(d, i) {
                    return i;
                })
                .enter().append('g')
                .attr("transform", "translate(" + NAVBAR_X + "," + NAVBAR_Y + ")");

            this.navbar.append('rect')
                .attr('width', NAVBAR_WIDTH/this.temps.length)
                .attr('height', NAVBAR_HEIGHT) 
                .attr('x', function(d, i) {return nbscale(i);})
                .attr('y', 0)
                .attr('fill', function(d) {
                    return slider.gridColors(d);
                })
                .attr('id', function(d, i) {
                    return 'nb_' + i;
                })
                .attr('cursor', 'pointer')
                .on('click', function(d, i) {
                   // map.updateGrid(i);
                    publish(slider.channel, [i]);
                })
            ;

            this.svg.append('g')
                .attr("class", "x axis")
                .attr("transform", "translate(" + NAVBAR_X + "," + (NAVBAR_Y+NAVBAR_HEIGHT)  + ")")
                .call(this.xAxis);
        },

        updateGrid: function(row) {
            var dataline = this.temps[row],
            slider = this;
            d3.select(this.parent + ' #nb_' + this.currentRow).style('stroke', null);
            d3.select(this.parent + ' #nb_' + row).style('stroke', 'red');
            this.currentRow = row;
            // console.log(row);
            console.log(slider.weatherEvent[row]);
            d3.select("#sliderDisplay").html(slider.weatherEvent[row]);
            console.log('Setting slider to time ' + slider.time[row]);

            
            
        },
	};



	var xmlhttp = new XMLHttpRequest();
	var url = "http://api.wunderground.com/api/4e82459ed4c5500f/hourly/q/MA/Boston.json";


    var sliders = []
    sliders.push(new WeatherSlider('Boston.json', '#vizWeather', 'Weather in FIX', 'maps'));

    var num_slider_uninit = 1;
    // var spinner = new Spinner({}).spin(document.body);
    sliders[0].updateGrid(1);

})();
function WeatherEvent(time, condition, temp) {
  this.time = time;
  this.temp = temp;
  this.condition = condition;
  this.imgURL = "http://i.imgur.com/KnQQIzV.png";

  this.toString = function(){
    return time + "<br><a href='#'><img src=" + this.imgURL + 
    " height='70' width='70' border=0/></a><br>  <br>" + this.condition + 
    "<br>" + this.temp + "˚";
  }
  
  this.miniString = function(){
    return "<br><a href='#'><img src=" + this.imgURL + " height='70' width='70' border=0/></a><br>";
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
}


