function simplebar(){
    var data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 200];
    d3.select(".gridster_ul")
            .append("li")
            .attr("class", "card")
            .attr("data-row", "1")
            .attr("data-col", "1")
            .attr("data-sizex", "3")
            .attr("data-sizey", "3")
    var w = $('.card').width(), h = $('.card').height();
    var svg = d3.select(".card")
                .append("svg")
                .attr("class", "simplebar")
                .attr("width", w)
                .attr("height", h);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d, i) { // x 좌표 설정
          return i * (w / data.length)
        })
        .attr("y", function(d) { // y 좌표 설정
          return h - d;
        })
        .attr("width", w / data.length - 1) // 너비 설정
        .attr("height", function(d) { // 높이 설정
          return d;
        })
        .attr("fill", function(d) { // 색상 설정
          return "hotpink";
        });
        svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
          return d;
        })
        .attr("x", function(d, i) {
          return i * (w / data.length) + (w / data.length) / 2;
        })
        .attr("y", function(d) {
          return h - d + 10;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("text-anchor", "middle");
}


function groupbar(){

	var margin = {top: 20, right: 20, bottom: 60, left: 40};
    
    d3.select(".gridster_ul")
    .append("li")
    .attr("class", "card")
    .attr("data-row", "1")
    .attr("data-col", "1")
    .attr("data-sizex", "7")
    .attr("data-sizey", "4")
    var width = $('.card').data-sizex(), height = $('.card').height();
    alert($('.card').width());
	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width - 150], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#F79620", "#F5C918", "#FF6600", "#707FBE", "#3669B3", "#009ACC", "#008C8C", "#3EBCA2","#2DB45F"]);
	  
	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var svg = d3.select(".card").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("/test.csv", function(error, data) {
		if (error) throw error;
    

		var epiNames = d3.keys(data[0]).filter(function(key) {return key !== "carid"; });

		data.forEach(function(d) {
		d.epi = epiNames.map(function(name) { return {name: name, value: +d[name]}; });
		});

		x0.domain(data.map(function(d) { return d.carid; }));
		x1.domain(epiNames).rangeRoundBands([0, x0.rangeBand()]);
		y.domain([0, d3.max(data, function(d) { return d3.max(d.epi, function(d) { return d.value; }); })]);

		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");
    
		svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 5)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Stop Value");

		var value = svg.selectAll(".value")
		  .data(data)
		.enter().append("g")
		  .attr("class", "value")
		  .attr("transform", function(d) { return "translate(" + x0(d.carid) + ",0)"; });

          value.selectAll("rect")
		  .data(function(d) { return d.epi; })
		.enter().append("rect").attr("width", x1.rangeBand())
		  .attr("x", function(d) { return x1(d.name); })
		  .attr("y", function(d) { return y(d.value); })
		  .attr("height", function(d) { return height - y(d.value); })
		  .style("fill", function(d) { return color(d.name); });

		var legend = svg.selectAll(".legend")
		  .data(epiNames.slice())
		  .enter().append("g")
		  .attr("class", "legend")
		  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("rect")
		  .attr("x", width - 18)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", color);

		legend.append("text")
		  .attr("x", width - 24)
		  .attr("y", 9)
		  .attr("dy", ".35em")
		  .style("text-anchor", "end")
		  .text(function(d) { return d; });
	});
}

function donutbar(){


    var width = $('.pn').width()-60, height = $('.pn').height()-80;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 75;
        var legendRectSize = 18;
        var legendSpacing = 4;

        var color = d3.scale.category20b();

        var svg = d3.select('.grey-panel')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) + 
            ',' + (height / 2) + ')');

        var arc = d3.svg.arc()
          .innerRadius(radius - donutWidth)
          .outerRadius(radius);

        var pie = d3.layout.pie()
          .value(function(d) { return d.count; })
          .sort(null);

        var tooltip = d3.select('.grey-panel')                               // NEW
          .append('div')                                                // NEW
          .attr('class', 'tooltip2');                                    // NEW
                      
        tooltip.append('div')                                           // NEW
          .attr('class', 'label ');                                      // NEW
             
        tooltip.append('div')                                           // NEW
          .attr('class', 'count');                                      // NEW

        tooltip.append('div')                                           // NEW
          .attr('class', 'percent');                                    // NEW

        d3.csv('test2.csv', function(error, dataset) {
          dataset.forEach(function(d) {
            d.count = +d.count;
          });

          var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) { 
              return color(d.data.label); 
            });

          path.on('mouseover', function(d) {                            // NEW
            var total = d3.sum(dataset.map(function(d) {                // NEW
              return d.count;                                           // NEW
            }));                                                        // NEW
            var percent = Math.round(1000 * d.data.count / total) / 10; // NEW
            tooltip.select('.label').html(d.data.label);                // NEW
            tooltip.select('.count').html(d.data.count);                // NEW
            tooltip.select('.percent').html(percent + '%');             // NEW
            tooltip.style('display', 'block');                          // NEW
          });                                                           // NEW
          
          path.on('mouseout', function() {                              // NEW
            tooltip.style('display', 'none');                           // NEW
          });                                                           // NEW

          /* OPTIONAL 
          path.on('mousemove', function(d) {                            // NEW
            tooltip.style('top', (d3.event.pageY + 10) + 'px')          // NEW
              .style('left', (d3.event.pageX + 10) + 'px');             // NEW
          });                                                           // NEW
          */
            
          var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
              var height = legendRectSize + legendSpacing;
              var offset =  height * color.domain().length / 2;
              var horz = -2 * legendRectSize;
              var vert = i * height - offset;
              return 'translate(' + horz + ',' + vert + ')';
            });

          legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)                                   
            .style('fill', color)
            .style('stroke', color);
            
          legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d; });

        });
}