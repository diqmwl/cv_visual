function simplebar(data){
    d3.select('.svgclass').remove();
    
    var margin =  {top: 20, right: 20, bottom: 100, left: 80};
    var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
    var selectorHeight = 40;
    var width = 1300 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom - selectorHeight;
    var heightOverview = 80 - marginOverview.top - marginOverview.bottom;
           
    var maxLength = data.length
    var barWidth = maxLength * 4;
    var numBars = Math.round(width/barWidth);
    var x_value = Object.keys(data[0])[1]
    var y_value = Object.keys(data[0])[2]

    var keys = Object.keys(data[0]).slice(2);
	 var z = d3.scaleOrdinal()
    .range(["#8DDBDA", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var isScrollDisplayed = barWidth * data.length > width;
    if(x_value == 'CAR_ID'){
        if(subclass == 'Accel' || subclass == 'Decel' || subclass == 'QuickStart' || subclass == 'SuddenStop'){
            y_value = Object.keys(data[0])[7]
			keys = Object.keys(data[0]).slice(7);
        } else if(subclass == 'FuelEfficiency'){
            y_value = Object.keys(data[0])[4]
			keys = Object.keys(data[0]).slice(4);
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
    var yAxis  = d3.axisLeft(yscale).ticks(8);
    
	//background line
	function make_x_gridlines() {		
		return d3.axisBottom(xscale)
        .ticks(5)
	}

	// gridlines in y axis function
	function make_y_gridlines() {		
		return d3.axisLeft(yscale)
		.ticks(5)
	}


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
	
	//background line
	diagram.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
    )

	diagram.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
    )
           
           //레전드 
        diagram.append("text")
	  .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 3)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(kyaxis()); 
    
	
	
	var x_labels = diagram.append("text")   
	  .attr("class", "label")	
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top +30) + ")")
      .style("text-anchor", "middle")
      .text(kxaxis());
	  
    if (isScrollDisplayed){
		x_labels.attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.bottom) + ")")
	}
	//범례
	    var legend = diagram.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
	//.attr("style", "outline: thin solid red;")   //This will do the job
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
    .text(function (d) { return klegend(d); });
		   
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
                  .attr("transform", "translate(0, " + (height + margin.top) + ")")
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
    var margin =  {top: 20, right: 20, bottom: 100, left: 80};
    var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
    var selectorHeight = 40;
    var width = 1300 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom - selectorHeight;
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
    var yAxis  = d3.axisLeft(yscale).ticks(8);

    
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
    .call(yAxis);
	
           //레전드 
            diagram.append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left - 3)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(kyaxis()); 
        
	
	var x_labels = diagram.append("text")    
	  .attr("class", "label")		
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top +30) + ")")
      .style("text-anchor", "middle")
      .text(kxaxis());
    if (isScrollDisplayed){
		x_labels.attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.bottom) + ")")
	}

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
    .text(function (d) { return klegend(d); });
    
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
                  .attr("transform", "translate(0, " + (height + margin.top) + ")")
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

function calgroupbar(data){
    
    d3.select('.svgclass').remove();

    var margin =  {top: 20, right: 20, bottom: 100, left: 80};
    var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
    var selectorHeight = 40;
    var width = 1300 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom - selectorHeight;
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
    var yAxis  = d3.axisLeft(yscale).ticks(8);

    
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
    .call(yAxis);
	
	           //레전드 
                diagram.append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - margin.left - 3)
              .attr("x",0 - (height / 2))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text(kyaxis()); 
	
	var x_labels = diagram.append("text")  
	  .attr("class", "label")			
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top +30) + ")")
      .style("text-anchor", "middle")
      .text(kxaxis());
    if (isScrollDisplayed){
		x_labels.attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.bottom) + ")")
	}

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
                  .attr("transform", "translate(0, " + (height + margin.top) + ")")
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

function linechart(data){
    d3.select('.svgclass').remove();

    var margin =  {top: 20, right: 20, bottom: 100, left: 80};
    var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
    var selectorHeight = 40;
    var width = 1300 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom - selectorHeight;
    var heightOverview = 80 - marginOverview.top - marginOverview.bottom;
       
    var maxLength = data.length
    var barWidth = maxLength * 4;
    var numBars = Math.round(width/barWidth);
    var x_value = Object.keys(data[0])[1]
    var y_value = Object.keys(data[0])[2]
    var isScrollDisplayed = barWidth * data.length > width;
	
	 var keys = Object.keys(data[0]).slice(2);
	 var z = d3.scaleOrdinal()
    .range(["#FE9365", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    if(x_value == 'CAR_ID'){
        if(subclass == 'Accel' || subclass == 'Decel' || subclass == 'QuickStart' || subclass == 'SuddenStop'){
            y_value = Object.keys(data[0])[7]
			keys = Object.keys(data[0]).slice(7);
        } else if(subclass == 'FuelEfficiency'){
            y_value = Object.keys(data[0])[4]
            keys = Object.keys(data[0]).slice(4);
        }
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
    var yAxis  = d3.axisLeft(yscale).ticks(8);
	
	//background line
	function make_x_gridlines() {		
		return d3.axisBottom(xscale)
        .ticks(5)
	}

	// gridlines in y axis function
	function make_y_gridlines() {		
		return d3.axisLeft(yscale)
		.ticks(5)
	}

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
    .call(yAxis);
	
	//background line
	diagram.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
    )

	diagram.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
    )
	
		           //레전드 
                    diagram.append("text")
                  .attr("class", "label")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 0 - margin.left - 3)
                  .attr("x",0 - (height / 2))
                  .attr("dy", "1em")
                  .style("text-anchor", "middle")
                  .text(kyaxis()); 
                
	//범례
	    var legend = diagram.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
	//.attr("style", "outline: thin solid red;")   //This will do the job
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
    .text(function (d) { return klegend(d); });
	
	var x_labels = diagram.append("text")  
	  .attr("class", "label")			
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top +30) + ")")
      .style("text-anchor", "middle")
      .text(kxaxis());
    if (isScrollDisplayed){
		x_labels.attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.bottom) + ")")
	}

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
                  .attr("transform", "translate(0, " + (height + margin.top) + ")")
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
//그룹 라인차트
function grouplinechart(data){
    d3.select('.svgclass').remove();
    var margin =  {top: 20, right: 20, bottom: 100, left: 80};
    var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
    var selectorHeight = 40;
    var width = 1300 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom - selectorHeight;
    var heightOverview = 80 - marginOverview.top - marginOverview.bottom;
       
    var maxLength = data.length
    var barWidth = maxLength * 4;
    var numBars = Math.round(width/barWidth);
    var x_value = Object.keys(data[0])[1]
    var y_value = Object.keys(data[0])[2]
    var isScrollDisplayed = barWidth * data.length > width;

    console.log(isScrollDisplayed)
    var keys = Object.keys(data[0]).slice(2);
    var xscale = d3.scalePoint()
    .domain(data.slice(0,numBars).map(function (d) {return d[x_value];}))
    .rangeRound([0, width])
    .padding(0.5);

    var yscale = d3.scaleLinear()
    .rangeRound([height, 0])
    .domain([0, d3.max(data, function (d) { return d3.max(keys, function (key) { return parseInt(d[key]); }); })]).nice();

    var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var svg = d3.select(".svg-container").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + selectorHeight)
    .attr("class", "svgclass")
    .call(responsivefy);

    //background line
function make_x_gridlines() {		
    return d3.axisBottom(xscale)
    .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(yscale)
    .ticks(5)
}


    var diagram = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "gcontainer");


    var xAxis  = d3.axisBottom(xscale);
    var yAxis  = d3.axisLeft(yscale).ticks(8);

    diagram.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .style("font","12px Verdana")
    .call(xAxis); // Create an axis component with d3.axisBottom

	// 4. Call the y axis in a group tag
	diagram.append("g")
    .attr("class", "y axis")
    .style("font","12px Verdana")
    .call(yAxis);
var i = 0;

var line = d3.line().x(function(d) {
     return xscale(d[x_value]); })
     .y(function(d) { return yscale(d[keys[i]]); })
     .curve(d3.curveMonotoneX);

var lines = svg.selectAll(".gcontainer")
    .data(data.slice(0, numBars))
    .enter().append("g")
    .attr("class", "lines")

// 9. Append the path, bind the data, and call the line generator 
lines.append("path")
    .attr("class", "line")
    .attr("d", line(data.slice(0, numBars)))
    
// 12. Appends a circle for each datapoint 
lines.append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xscale(d[x_value]) })
    .attr("cy", function(d) { return yscale(d[keys[i]]) })
    .attr("r", 5)
    .attr("fill", function (d) { return z(d.key); });
 

	//background line
	diagram.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
    )

	diagram.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
    )
	
           //레전드 
            diagram.append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left - 3)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text(kyaxis()); 
        
	
	var x_labels = diagram.append("text")    
	  .attr("class", "label")		
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top +30) + ")")
      .style("text-anchor", "middle")
      .text(kxaxis());
    if (isScrollDisplayed){
		x_labels.attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.bottom) + ")")
	}

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
    .text(function (d) { return klegend(d); });
    
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
                  .attr("transform", "translate(0, " + (height + margin.top) + ")")
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


//도넛차트
function donutbar(data){      
      d3.select('.svgclass').remove();
    /*
      var data = [
        {name: "USA", value: 60},
        {name: "UK", value: 20},
        {name: "Canada", value: 30},
        {name: "Maxico", value: 15},
        {name: "Japan", value: 10},
      ];
    */
      function donutChart() {
        var width,
            height,
            margin = {top: 10, right: 10, bottom: 10, left: 10},
            colour = d3.scaleOrdinal(d3.schemeCategory20c), // colour scheme
            variable, // value in data that will dictate proportions on chart
            category, // compare data by
            padAngle, // effectively dictates the gap between slices
            floatFormat = d3.format('.5r'),//  sets how rounded the corners are on each slice
            cornerRadius, // sets how rounded the corners are on each slice
            percentFormat = d3.format(',.0%');//sets the number of decimal places in the percentages
    
        function chart(selection){
            selection.each(function(data) {
                // generate chart
    
                // ===========================================================================================
                // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md
                var radius = Math.min(width, height) / 2;
    
                // creates a new pie generator
                var pie = d3.pie()
                    .value(function(d) { return floatFormat(d[variable]); })
                    .sort(null);
    
                // contructs and arc generator. This will be used for the donut. The difference between outer and inner
                // radius will dictate the thickness of the donut
                var arc = d3.arc()
                    .outerRadius(radius * 0.8)
                    .innerRadius(radius * 0.6)
                    .cornerRadius(cornerRadius)
                    .padAngle(padAngle);
    
                // this arc is used for aligning the text labels
                var outerArc = d3.arc()
                    .outerRadius(radius * 0.9)
                    .innerRadius(radius * 0.9);
                // ===================================================================================
              //add title to the chart
       
    
                // ===========================================================================================
              
             // append the svg object to the selection
                var svg = selection.append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .attr("class", "svgclass")
                    .call(responsivefy)
                  .append('g')
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')'); //===========================================================================================
    
                // ===========================================================================================
                // g elements to keep elements within svg modular
                svg.append('g').attr('class', 'slices');
                svg.append('g').attr('class', 'labelName');
                svg.append('g').attr('class', 'lines');
                // =================================================================================== 
                // add and colour the donut slices
                var path = svg.select('.slices')
                    .datum(data).selectAll('path')
                    .data(pie)
                  .enter().append('path')
                    .attr('fill', function(d) { return colour(d.data[category]); })
                    .attr('d', arc);
                // ===========================================================================================
    
                // ===========================================================================================
                // add text labels
                var label = svg.select('.labelName').selectAll('text')
                    .data(pie)
                  .enter().append('text')
                    .attr('dy', '0em')//position of text label
                    .html(function(d) {
                        // add "key: value" for given category. Number inside tspan is bolded in stylesheet.
                        return d.data[category];
                    })
                    .attr('transform', function(d) {
    
                        // effectively computes the centre of the slice.
                        // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
                        var pos = outerArc.centroid(d);
    
                        // changes the point to be on left or right depending on where label is.
                        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                        return 'translate(' + pos + ')';
                    })
                    .style('text-anchor', function(d) {
                        // if slice centre is on the left, anchor text to start, otherwise anchor to end
                        return (midAngle(d)) < Math.PI ? 'start' : 'end';
                    });
                // ===========================================================================================
    
                // ===========================================================================================
                // add lines connecting labels to slice. A polyline creates straight lines connecting several points
                var polyline = svg.select('.lines')
                    .selectAll('polyline')
                    .data(pie)
                  .enter().append('polyline')
                    .attr('points', function(d) {
    
                        // see label transform function for explanations of these three lines.
                        var pos = outerArc.centroid(d);
                        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                        return [arc.centroid(d), outerArc.centroid(d), pos]
                    });
                // ===========================================================================================
    
                // ===========================================================================================
                // add tooltip to mouse events on slices and labels
                d3.selectAll('.labelName text, .slices path').call(toolTip);
                // ===========================================================================================
    
                // ===========================================================================================
                // Functions
    
                // calculates the angle for the middle of a slice
                function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }
    
                // function that creates and adds the tool tip to a selected element
                function toolTip(selection) {
    
                    // add tooltip (svg circle element) when mouse enters label or slice
                    selection.on('mouseenter', function (data) {
    
                        svg.append('text')
                            .attr('class', 'toolCircle')
                            .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                            .html(toolTipHTML(data)) // add text to the circle.
                            .style('font-size', '.9em')
                            .style('text-anchor', 'middle'); // centres text in tooltip
    
                        svg.append('circle')
                            .attr('class', 'toolCircle')
                            .attr('r', radius * 0.55) // radius of tooltip circle
                            .style('fill', colour(data.data[category])) // colour based on category mouse is over
                            .style('fill-opacity', 0.35);
    
                    });
    
                    // remove the tooltip when mouse leaves the slice/label
                    selection.on('mouseout', function () {
                        d3.selectAll('.toolCircle').remove();
                    });
                }
    
                // function to create the HTML string for the tool tip. Loops through each key in data object
                // and returns the html string key: value
                function toolTipHTML(data) {
    
                    var tip = '',
                        i   = 0;
    
                    for (var key in data.data) {
    
                        // assigning the value part of tooltip as our skill number of years
                                                                        var value = data.data[key];
                        // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
                        // tspan effectively imitates a line break.
                        if (i === 0) tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
                        else tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
                        i++;
                    }
    
    
                    return tip;
                }
                // ===========================================================================================
    
            });
        }
    
        // getter and setter functions. See Mike Bostocks post "Towards Reusable Charts" for a tutorial on how this works.
        chart.width = function(value) {
            if (!arguments.length) return width;
            width = value;
            return chart;
        };
    
        chart.height = function(value) {
            if (!arguments.length) return height;
            height = value;
            return chart;
        };
    
        chart.margin = function(value) {
            if (!arguments.length) return margin;
            margin = value;
            return chart;
        };
    
        chart.radius = function(value) {
            if (!arguments.length) return radius;
            radius = value;
            return chart;
        };
    
        chart.padAngle = function(value) {
            if (!arguments.length) return padAngle;
            padAngle = value;
            return chart;
        };
    
        chart.cornerRadius = function(value) {
            if (!arguments.length) return cornerRadius;
            cornerRadius = value;
            return chart;
        };
    
        chart.colour = function(value) {
            if (!arguments.length) return colour;
            colour = value;
            return chart;
        };
    
        chart.variable = function(value) {
            if (!arguments.length) return variable;
            variable = value;
            return chart;
        };
    
        chart.category = function(value) {
            if (!arguments.length) return category;
            category = value;
            return chart;
        };
    
        return chart;
    }

    var margin =  {top: 20, right: 20, bottom: 100, left: 80};
    var marginOverview = {top: 30, right: 10, bottom: 20, left: 40};
    var selectorHeight = 40;
    var width = 1300 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom - selectorHeight;

      var donut = donutChart()
        .width(width)
        .height(height)
        .cornerRadius(3) // sets how rounded the corners are on each slice
        .padAngle(0.03) // effectively dictates the gap between slices
        .variable('count')
        .category('name');
        d3.select('.svg-container')
            .datum(data) // bind data to the div
            .call(donut) // draw chart in div;
   }

   function hongiklinechart(data){
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".svg-container1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
data.forEach(
  // When reading the csv, I must format variables:
  function(d){
    { date : d3.timeParse("%Y-%m-%d")(d.date); value : d.value }
  }
)

  // Now I can use this dataset:
console.log(data)
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )


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

  function kyaxis(){
      var kor = null;
      if(subclass == 'Fuel' || subclass == 'FuelEfficiency'){
          kor = '양';
      } else if(subclass == 'Distance'){
          kor = '미터';
      } else {
          kor = '횟수';
      } 
      return kor;
  }

  function kxaxis(){
    var kor = null;
    if(x_value == 'CAR_ID'){
        kor = '차량 번호';
    } else if(x_value == 'Year'){
        kor = '연도별';
    } else if(x_value == 'Month'){
        kor = '월별';
    } else if(x_value == 'Day'){
        kor = '일별';
    }
    return kor;
  }

  function klegend(val){
    var kor = null;
    if(subclass == 'Accel' || subclass == 'QuickStart'){
        if(val == 'TOTAL_COUNT' || val == 'count'){
            kor = '전체 횟수';
        } else if(val == 'DIFF_1'){
            kor = '시속 11~21';
        } else if(val == 'DIFF_2'){
            kor = '시속 22~32';
        } else if(val == 'DIFF_3'){
            kor = '시속 33~43';
        } else if(val == 'DIFF_4'){
            kor = '시속 44~54';
        } else if(val == 'DIFF_5'){
            kor = '시속 55이상';
        } else if(val == 'TOTAL_DISTANCE'){
            kor = '이동거리'
        } else if(val == 'TOTAL_FUEL'){
            kor = '연료 사용량'
        } else if(val == 'EFFICIENCY'){
            kor = '연료 효율성'
        }
                
        
    } else if(subclass == 'Decel' || subclass == 'SuddenStop'){
        if(val == 'TOTAL_COUNT' || val == 'count'){
            kor = '전체 횟수';
        } else if(val == 'DIFF_1'){
            kor = '시속 8~14';
        } else if(val == 'DIFF_2'){
            kor = '시속 15~22';
        } else if(val == 'DIFF_3'){
            kor = '시속 23~29';
        } else if(val == 'DIFF_4'){
            kor = '시속 30~37';
        } else if(val == 'DIFF_5'){
            kor = '시속 38이상';
        } else if(val == 'TOTAL_DISTANCE'){
            kor = '전체 이동거리'
        } else if(val == 'TOTAL_FUEL'){
            kor = '연료 사용량'
        } else if(val == 'EFFICIENCY'){
            kor = '연료 효율성'
        }
    } else {
        if(val == 'TOTAL_COUNT' || val == 'count'){
            kor = '전체 횟수';
        } else if(val == 'TOTAL_DISTANCE'){
            kor = '전체 이동거리'
        } else if(val == 'TOTAL_FUEL'){
            kor = '연료 사용량'
        } else if(val == 'EFFICIENCY'){
            kor = '연료 효율성'
        }
    }
    return kor;
  }

