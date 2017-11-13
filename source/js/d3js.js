$(function(){
	var piInter = 0.1;
	var dataset = [];
	for (var i = 0; i < 1/piInter; i++) {
		var dataObject = { startAngle: Math.PI * piInter * i, endAngle: Math.PI * piInter * (i+1)};
		dataset.push(dataObject);
	}

	var svg = d3.select(".d3logo").append("svg")
				.classed('pathLine', true);

	var d3logoWidth = $('.pathLine').innerWidth();
	var outerR = parseInt(d3logoWidth);
	var innerR = outerR - 10;

	var arcPath = d3.arc()
					.innerRadius(innerR)
					.outerRadius(outerR);

					console.log(arcPath);
	var arcs = svg.selectAll('g')
		.data(dataset)
		.enter()
		.append("g");

	arcs.append("path")
		.attr("d", function(d){ return arcPath(d); })
		.attr("transform", "translate(0, " + outerR + ")")
		.attr("fill", "yellow");
		
	
	arcs.append('circle')
		.each(function(d) {
			var centroid = arcPath.centroid(d);
			d3.select(this)
				.attr('cx', centroid[0])
				.attr('cy', centroid[1] + d3logoWidth)
				.attr('r', 2);
		});

})