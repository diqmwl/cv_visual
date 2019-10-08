function simplebar(data){
    d3.select('.svgclass').remove();
    
    var margin =  {top: 20, right: 10, bottom: 20, left: 60};
    var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
    var selectorHeight = 40;
    var width = 1300 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom - selectorHeight;
    var heightOverview = 80 - marginOverview.top - marginOverview.bottom;
           
    var maxLength = data.length
    var barWidth = maxLength * 4;
    var numBars = Math.round(width/barWidth);
    var x_value = Object.keys(data[0])[1]
    var y_value = Object.keys(data[0])[2]
    var isScrollDisplayed = barWidth * data.length > width;
    if(x_value == 'CAR_ID'){
        if(subclass == 'Accel' || subclass == 'Decel' || subclass == 'QuickStart' || subclass == 'SuddenStop'){
            y_value = Object.keys(data[0])[7]
        }
    }
    console.log(isScrollDisplayed)
      
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>"+d[x_value]+":</strong> <span style='color:red'>" + d[y_value] + "</span>";
    })

    var xscale = d3.scaleBand()
                    .domain(data.slice(0,numBars).map(function (d) {return d[x_value];}))
                    .rangeRound([0, width], .2)
                    .padding(0.2);      

    
    var yscale = d3.scaleLinear()
                  .domain([0, d3.max(data, function (d) { return parseInt(d[y_value]); })])
                  .range([height, 0]);
                  
    var xAxis  = d3.axisBottom(xscale);
    var yAxis  = d3.axisLeft(yscale);
    

    var svg = d3.select(".svg-container").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom + selectorHeight)
                .attr("class", "svgclass")
                .call(tip)
                .call(responsivefy);

    var diagram = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
    diagram.append("g")
            .attr("class", "x axis")
            .style("font","12px Verdana")
           .attr("transform", "translate(0, " + height + ")")
           .call(xAxis);
      
    diagram.append("g")
           .attr("class", "y axis")
           .style("font","12px Verdana")
           .call(yAxis);
      
    var bars = diagram.append("g");
      
    bars.selectAll("rect")
                .data(data.slice(0, numBars), function (d) {return d[x_value]; })
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return xscale(d[x_value]); })
                .attr("y", function (d) { return yscale(d[y_value]); })
                .attr("width", xscale.bandwidth())
                .attr("height", function (d) { return height - yscale(d[y_value]); })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
    
      
    if (isScrollDisplayed)
    {
      var xOverview = d3.scaleBand()
                      .domain(data.map(function (d) { return d[x_value]; }))
                      .rangeRound([0, width], .2)
                      .padding(0.2);      
                      
      yOverview = d3.scaleLinear().range([heightOverview, 0]);
      yOverview.domain(yscale.domain());
    
      var subBars = diagram.selectAll('.subBar')
          .data(data)
    
      subBars.enter().append("rect")
          .classed('subBar', true)
          .attr(
              "height", function(d) {
                  return heightOverview - yOverview(d[y_value]);
              })
          .attr(
              "width", function(d) {
                  return xOverview.bandwidth()
              })
          .attr(
              "x", function(d) {
                  return xOverview(d[x_value]);
              })
          .attr(
              "y", function(d) {
                  return height + heightOverview + yOverview(d[y_value])
              })      
      var displayed = d3.scaleQuantize()
                  .domain([0, width])
                  .range(d3.range(data.length));
    
      diagram.append("rect")
                  .attr("transform", "translate(0, " + (height + margin.bottom) + ")")
                  .attr("class", "mover")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", selectorHeight)
                  .attr("width", Math.round(parseFloat(numBars * width)/data.length))
                  .attr("pointer-events", "all")
                  .attr("cursor", "ew-resize")
                  .call(d3.drag().on("drag", display));
    }
    function display () {
        var x = parseInt(d3.select(this).attr("x")),
            nx = x + d3.event.dx,
            w = parseInt(d3.select(this).attr("width")),
            f, nf, new_data, rects;
    
        if ( nx < 0 || nx + w > width ) return;
    
        d3.select(this).attr("x", nx);
    
        f = displayed(x);
        nf = displayed(nx);
    
        if ( f === nf ) return;
    
        new_data = data.slice(nf, nf + numBars);

        xscale.domain(new_data.map(function (d) { return d[x_value]; }));
        diagram.select(".x.axis").call(xAxis);
    
        rects = bars.selectAll("rect")
          .data(new_data, function (d) {return d[x_value]; });
    
             rects.attr("x", function (d) { return xscale(d[x_value]); });
    
    // 	  rects.attr("transform", function(d) { return "translate(" + xscale(d.label) + ",0)"; })
    
        rects.enter().append("rect")
          .attr("class", "bar")
          .attr("x", function (d) { return xscale(d[x_value]); })
          .attr("y", function (d) { return yscale(d[y_value]); })
          .attr("width", xscale.bandwidth())
          .attr("height", function (d) { return height - yscale(d[y_value]); });
    
        rects.exit().remove();
    };
}


function groupbar(data){
    d3.select('.svgclass').remove();

    var margin =  {top: 20, right: 10, bottom: 20, left: 40};
    var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
    var selectorHeight = 40;
    var width = 1300 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom - selectorHeight;
    var heightOverview = 80 - marginOverview.top - marginOverview.bottom;
       
    var maxLength = data.length
    var barWidth = maxLength * 4;
    var numBars = Math.round(width/barWidth);
    var x_value = Object.keys(data[0])[1]
    var y_value = Object.keys(data[0])[2]
    var isScrollDisplayed = barWidth * data.length > width;

    console.log(isScrollDisplayed)

    var xscale = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

    var xscale1 = d3.scaleBand()
    .padding(0.05);

    var yscale = d3.scaleLinear()
    .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var svg = d3.select(".svg-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + selectorHeight)
    .attr("class", "svgclass")
    .call(responsivefy);

    var diagram = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "gcontainer");

    var keys = Object.keys(data[0]).slice(2);
    xscale.domain(data.slice(0,numBars).map(function (d) { return d[x_value]; }));
    xscale1.domain(keys).rangeRound([0, xscale.bandwidth()]);
    yscale.domain([0, d3.max(data, function (d) { return d3.max(keys, function (key) { return parseInt(d[key]); }); })]).nice();

    var xAxis  = d3.axisBottom(xscale);
    var yAxis  = d3.axisLeft(yscale);

    
    var bar = diagram.selectAll(".gcontainer")
    .data(data.slice(0,numBars))
    .enter().append("g")
    .attr("class","bars")
    .attr("transform", function (d) { return "translate(" + xscale(d[x_value]) + ",0)"; })
    
    bar.selectAll("rect")
    .data(function (d) { return keys.map(function (key) { return { key: key, value: d[key] }; }); })
    .enter().append("rect")
    .attr("x", function (d) { return xscale1(d.key);})
    .attr("y", function (d) { return yscale(d.value); })
    .attr("width", xscale1.bandwidth())
    .attr("height", function (d) { return height - yscale(d.value); })
    .attr("fill", function (d) { return z(d.key); });

    diagram.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    diagram.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("x", 2)
    .attr("y", yscale(yscale.ticks().pop()) + 0.5)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start");

    var legend = diagram.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
    .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z);

    legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function (d) { return d; });
    
    if (isScrollDisplayed)
    {

        var xOverview = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);
    
        var xOverview1 = d3.scaleBand()
        .padding(0.05);

         xOverview = d3.scaleBand()
        .domain(data.map(function (d) { return d[x_value]; }))
        .rangeRound([0, width], .2)
        .padding(0.2);     
         xOverview1.domain(keys).rangeRound([0, xOverview.bandwidth()]);
    
      
                      
      yOverview = d3.scaleLinear().range([heightOverview, 0]);
      yOverview.domain(yscale.domain());
    
      var bar = diagram.selectAll(".gcontainer")
    .data(data)
    .enter().append("g")
    .attr("class","subbars")
    .attr("transform", function (d) { return "translate(" + xOverview(d[x_value]) + ",0)"; })
    
    bar.selectAll("rect")
    .data(function (d) { return keys.map(function (key) { return { key: key, value: d[key] }; }); })
    .enter().append("rect")
    .classed('subBar', true)
    .attr("x", function (d) { return xOverview1(d.key);})
    .attr("y", function (d) { return height + heightOverview + yOverview(d.value); })
    .attr("width", xOverview1.bandwidth())
    .attr("height", function (d) { return heightOverview - yOverview(d.value); })
    .attr("fill", function (d) { return z(d.key); });
      
      var displayed = d3.scaleQuantize()
                  .domain([0, width])
                  .range(d3.range(data.length));
    
      diagram.append("rect")
                  .attr("transform", "translate(0, " + (height + margin.bottom) + ")")
                  .attr("class", "mover")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", selectorHeight)
                  .attr("width", Math.round(parseFloat(numBars * width)/data.length))
                  .attr("pointer-events", "all")
                  .attr("cursor", "ew-resize")
                  .call(d3.drag().on("drag", display));
    }
    function display () {
        var x = parseInt(d3.select(this).attr("x")),
            nx = x + d3.event.dx,
            w = parseInt(d3.select(this).attr("width")),
            f, nf, new_data, rects;
    
        if ( nx < 0 || nx + w > width ) return;
    
        d3.select(this).attr("x", nx);
    
        f = displayed(x);
        nf = displayed(nx);
    
        if ( f === nf ) return;
     //   var keys = Object.keys(data[0]).slice(1);

        new_data = data.slice(nf, nf + numBars);

        var keys = Object.keys(new_data[0]).slice(2);

        xscale.domain(new_data.slice(0,numBars).map(function (d) { return d[x_value]; }));
        xscale1.domain(keys).rangeRound([0, xscale.bandwidth()]);
        diagram.select(".x.axis").call(xAxis);
        
        var rect = svg.selectAll(".bars")
        .data(new_data);
        
        rect.enter().append("g")
        .attr("class","bars")
        .attr("transform", function (d) { return "translate(" + xscale(d[x_value]) + ",0)"; });

        var rect2 = rect.selectAll("rect")
        .data(function (d) { return keys.map(function (key) { return { key: key, value: d[key] }; }); });

        rect2.enter().append("rect")
        .attr("width", xscale1.bandwidth());

        rect2.attr("x", function (d) { return xscale1(d.key);})
        .attr("y", function (d) { return yscale(d.value); })
        .attr("height", function (d) { return height - yscale(d.value); })
        .attr("fill", function (d) { return z(d.key); });
        
        rect2.exit().remove();
    };

}

function donutbar(){
 var timerInterval = 1500;

    var donut = donutChart()
        .width(960)
        .height(500)
        .transTime(750) // length of transitions in ms
        .cornerRadius(3) // sets how rounded the corners are on each slice
        .padAngle(0.015) // effectively dictates the gap between slices
        .variable('prob')
        .category('species');

    var i = 0;

    d3.tsv('species.tsv', function(error, data) {
        if (error) throw error;

        // group entries together by timestamp to simulate  receiving real-time data
        var nestData = d3.nest()
            .key(function(d) { return d.time; }) // collects entries with the same time value
            .entries(data);

        // timer to update chart with new data every timeInterval milliseconds.
        var timer = setInterval(function() {
        	if (i === nestData.length - 1) { clearInterval(timer); }
        	donut.data(nestData[i].values);
            if (i === 0) { // if first time receiving data...
                i++;
                d3.select('#chart')
                    .call(donut); // draw chart in div
            }
            i++;
        }, timerInterval);
    });
}

function linechart(data){
    d3.select('.svgclass').remove();

    var margin =  {top: 20, right: 10, bottom: 20, left: 60};
    var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
    var selectorHeight = 40;
    var width = 1300 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom - selectorHeight;
    var heightOverview = 80 - marginOverview.top - marginOverview.bottom;
       
    var maxLength = data.length
    var barWidth = maxLength * 4;
    var numBars = Math.round(width/barWidth);
    var x_value = Object.keys(data[0])[1]
    var y_value = Object.keys(data[0])[2]
    var isScrollDisplayed = barWidth * data.length > width;
    if(subclass == 'Accel' || subclass == 'Decel' || subclass == 'QuickStart' || subclass == 'SuddenStop'){
        y_value = Object.keys(data[0])[7]
    }
    
    console.log(isScrollDisplayed)

// The number of datapoints

// 5. X scale will use the index of our data
var xscale = d3.scalePoint()
.domain(data.slice(0,numBars).map(function (d) {return d[x_value];}))
.rangeRound([0, width])
.padding(0.5);

// 6. Y scale will use the randomly generate number 
var yscale = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return parseInt(d[y_value]); })]) // input 
    .range([height, 0]); // output 
    
    var xAxis  = d3.axisBottom(xscale);
    var yAxis  = d3.axisLeft(yscale);

// 7. d3's line generator
var line = d3.line()
    .x(function(d) { return xscale(d[x_value]); }) // set the x values for the line generator
    .y(function(d) { return yscale(d[y_value]); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>"+d[x_value]+":</strong> <span style='color:red'>" + d[y_value] + "</span>";
    })

var subline = d3.line()
    .x(function(d) {return xOverview(d[x_value]);})
    .y(function(d) {return height + heightOverview + yOverview(d[y_value])})
  .curve(d3.curveMonotoneX) // apply smoothing to the line

// 1. Add the SVG to the page and employ #2
var svg = d3.select(".svg-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + selectorHeight)
    .attr("class", "svgclass")
    .call(tip)
    .call(responsivefy);

    
var diagram = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
diagram.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .style("font","12px Verdana")
    .call(xAxis); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
diagram.append("g")
    .attr("class", "y axis")
    .style("font","12px Verdana")
    .call(yAxis); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator 
diagram.append("path")
    .datum(data.slice(0, numBars)) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line); // 11. Calls the line generator 

// 12. Appends a circle for each datapoint 
diagram.selectAll(".dot")
    .data(data.slice(0, numBars))
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xscale(d[x_value]) })
    .attr("cy", function(d) { return yscale(d[y_value]) })
    .attr("r", 5)
    .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

    if (isScrollDisplayed)
    {
      var xOverview = d3.scalePoint()
      .domain(data.map(function (d) { return d[x_value]; }))
      .rangeRound([0, width])
      .padding(0.5);      
                      
      yOverview = d3.scaleLinear().range([heightOverview, 0]);
      yOverview.domain(yscale.domain());
    
      
      diagram.append("path")
      .datum(data)
          .classed('subBar', true)
          .attr(
            "height", function(d) {
                return heightOverview - yOverview(d[y_value]);
            })
        .attr(
            "width", function(d) {
                return xOverview.bandwidth()
            })
          .attr("d", subline);
          
              
      var displayed = d3.scaleQuantize()
                  .domain([0, width])
                  .range(d3.range(data.length));
    
      diagram.append("rect")
                  .attr("transform", "translate(0, " + (height + margin.bottom) + ")")
                  .attr("class", "mover")
                  .attr("background-color","black")
                  .attr("x", 0)
                  .attr("y", 0)
                  .attr("height", selectorHeight)
                  .attr("width", Math.round(parseFloat(numBars * width)/data.length))
                  .attr("pointer-events", "all")
                  .attr("cursor", "ew-resize")
                  .call(d3.drag().on("drag", display));
    }
    function display () {
        var x = parseInt(d3.select(this).attr("x")),
            nx = x + d3.event.dx,
            w = parseInt(d3.select(this).attr("width")),
            f, nf, new_data, rects;
    
        if ( nx < 0 || nx + w > width ) return;
    
        d3.select(this).attr("x", nx);
    
        f = displayed(x);
        nf = displayed(nx);
    
        if ( f === nf ) return;
        new_data = data.slice(nf, nf + numBars);

        xscale.domain(new_data.map(function (d) { return d[x_value]; }));
        diagram.select(".x.axis").call(xAxis);

        dots = diagram.selectAll(".dot")
        dots.data(new_data)
        .enter().append("circle") // Uses the enter().append() method
        .merge(dots)
          .attr("class", "dot") // Assign a class for styling
          .attr("cx", function(d, i) { return xscale(d[x_value]) })
          .attr("cy", function(d) { return yscale(d[y_value]) })
          .attr("r", 5)
          dots.exit().remove();

        rects = diagram.selectAll(".line")
          rects.datum(new_data)
          .attr("class", "line") // Assign a class for styling 
          .attr("d", line); // 11. Calls the line generator 


    
    // 	  rects.attr("transform", function(d) { return "translate(" + xscale(d.label) + ",0)"; })
    

    

    };

}


//svg다시~
function responsivefy(svg) {
    // container will be the DOM element
    // that the svg is appended to
    // we then measure the container
    // and find its aspect ratio
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style('width'), 10),
        height = parseInt(svg.style('height'), 10),
        aspect = width / height;
   
    // set viewBox attribute to the initial size
    // control scaling with preserveAspectRatio
    // resize svg on inital page load
    svg.attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMinYMid')
        .call(resize);
   
    // add a listener so the chart will be resized
    // when the window resizes
    // multiple listeners for the same event type
    // requires a namespace, i.e., 'click.foo'
    // api docs: https://goo.gl/F3ZCFr
    d3.select(window).on(
        'resize.' + container.attr('id'), 
        resize
    );
   
    // this is the code that resizes the chart
    // it will be called on load
    // and in response to window resizes
    // gets the width of the container
    // and resizes the svg to fill it
    // while maintaining a consistent aspect ratio
    function resize() {
        const w = parseInt(container.style('width'));
        svg.attr('width', w);
        svg.attr('height', Math.round(w / aspect));
    }
  }