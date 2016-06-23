/*
    D3.js Slider
    Inspired by jQuery UI Slider
    Copyright (c) 2013, Bjorn Sandvik - http://blog.thematicmapping.org
    BSD license: http://opensource.org/licenses/BSD-3-Clause
*/
var rectWidth = 50,
  rectHeight = 100,
  rectPadding = 0,
  numRects = 24;

var width = (rectWidth * numRects) + ((numRects - 1) * rectPadding),
  height = rectHeight;

var clipWidth = width,//400,
  clipHeight = rectHeight;

var data = d3.range(numRects);

var xScale = d3.scale.linear()
        .domain(d3.extent(data))
        .range([0, width]);

var svg = d3.select('#chart').append('svg')
        .attr('width', clipWidth)
        .attr('height', clipHeight);

svg.append("defs").append("clipPath")
  .attr("id", "clip")
    .append("rect")
        .attr("width", clipWidth)
        .attr("height", clipHeight);

var g = svg.append("g");
g.selectAll("rect")
    .data(data)
    .enter()
    .append('rect')
        .attr("class", "area").attr("clip-path", "url(#clip)")
        .attr('x', xScale)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .style('fill', d3.scale.category20());

var update = function(){
    g.selectAll("rect")
        .transition().duration(500)
        .attr('x', xScale);
};


d3.selectAll("rect").on("click", function(){ 
    xScale.domain([xScale.domain()[0] - 1, xScale.domain()[1] - 1]);
    update();
});