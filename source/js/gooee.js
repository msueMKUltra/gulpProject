$(function(){

	d3.queue()
		.defer(d3.json, "./json/name_map.json")
		.defer(d3.json, "./json/location.json")
		.defer(d3.json, "./json/data_C.json")
		.defer(d3.json, "./json/data_B.json")
		.awaitAll(gooee);

	function gooee(error, files){
    	if (error) throw error;

		var unit = {width: 1000, height: 1000};
		var svg = d3.select('.box')
					.append('svg')
					.attr('width', unit.width)
					.attr('height', unit.height)
					.style('border', '1px solid slateblue');

		var dataset = [];
		var xyScale = d3.scaleLinear().domain([0, 100]).range([0, 1000]);
		var r = {max: 0, start: 4, section: 4, range: 6};
		var p = {max: 0, start: 2, section: 4, range: 2};
		var name_map = files[0];
		var location = files[1];
		var data_C = files[2];
		var data_B = files[3];

		//name_map.json
    	for( var key in name_map){
    		var name = name_map[key];
    		dataset.push({
    			id: key,
    			name: name
    		});
    		// svg.append('g').attr('data-id', key).attr('id', name);
    	}
    	var map = d3.map(dataset, (d) => d.id);

    	//location.json
		for( var key in location){
    		var cx = location[key][0];
    		var cy = location[key][1];
    		var get = map.get(key);
    		var name = get.name;
    		get.location = {cx: cx, cy: cy};
    		// d3.select('#' + name).append('circle').attr('cx', xyScale(cx)).attr('cy', xyScale(cy));
    	}
    	
    	//data_C.json
		for( var key in data_C){
    		var radius = data_C[key];
    		var get = map.get(key);
    		var name = get.name;
    		map.get(key).radius = radius;
    		map.get(key).end = []; // for saving data_B  		
    		// d3.select('#' + name).select('circle').attr('r', radius/100);
    		r.max = radius > r.max ? radius : r.max;
    	}
		var rRange = d3.range(r.start, r.start + r.section * r.range, r.range);
		var rScale = d3.scaleQuantize().domain([0, r.max]).range(rRange);

		//data_B.json
		for( var key in data_B){
    		var start = data_B[key].start, end = data_B[key].end, count = data_B[key].count;
    		var getStart = map.get(start), getEnd = map.get(end);
    		var id = getEnd.name;
    		var cx = getEnd.location.cx;
    		var cy = getEnd.location.cy;
    		getStart.end.push({ lines: [[getStart.location.cx, getStart.location.cy], [cx, cy]], count: count, id: id});
    		p.max = count > p.max ? count : p.max;
    	}
		var pRange = d3.range(p.start, p.start + p.section * p.range, p.range);
		var pScale = d3.scaleQuantize().domain([0, p.max]).range(pRange);
		var cScale = d3.scaleQuantize().domain([0, p.max]).range(d3.range(p.section));
		console.log(cScale.domain());
		console.log(cScale.range());
		var color = d3.interpolate('yellowgreen', 'darkred');
		console.log(color(1/2));
		console.log(dataset);

		var drag = d3.drag()
		    .on("start", dragStarted)
		    .on("drag", dragged)
		    .on("end", dragEnded);

		var g = svg.selectAll('g')
					.data(dataset)
					.enter()
					.append('g')
					.attr('data-code', (d) => d.id)
					.attr('id', (d) => d.name);

		var keys = map.keys();
		for(var i = 0; i < keys.length; i++){
			var get = map.get(keys[i]);
			var lines = get.end;
			var id = get.name;
			var linePath = d3.line().curve(d3.curveCardinal).x((d) => xyScale(d[0])).y((d) => xyScale(d[1]));
			// console.log(id);
			// console.log(lines);
			var $id = d3.select('#' + id);
			
			$id.selectAll('path')
				.data(lines)
				.enter()
				.append('path')
				.attr('class', (d) => d.id)
				.attr('d', (d) => linePath(d.lines))
				.attr('stroke', (d) => color(cScale(d.count)/(p.section - 1)))
				.attr('stroke-width', (d) => pScale(d.count));
		}

		var circle = g.append('circle')
						.attr('cx', (d) => xyScale(d.location.cx))
						.attr('cy', (d) => xyScale(d.location.cy))
			    		.attr('r', (d) => rScale(d.radius))
			    		.call(drag);
		var text = g.append('text')
						.attr('x', (d) => xyScale(d.location.cx) + rScale(d.radius))
						.attr('y', (d) => xyScale(d.location.cy) - rScale(d.radius))
			    		// .attr('text-anchor', 'start')
			    		.text( (d) => d.name);
		circle.on('mouseover', function(){
			d3.select(this.parentNode).select('text').text( (d) => d.name + ' (' + d.id + ')');
		});
		circle.on('mouseout', function(){
			d3.select(this.parentNode).select('text').text( (d) => d.name);
		});


		function dragStarted(d){
			d3.select(this.parentNode).raise().classed("active", true);
		}
		function dragged(d){
			var $g = d3.select(this.parentNode)
			var id = $g.attr('id');
			d3.select(this)
				.attr("cx", d3.event.x)
			    .attr("cy", d3.event.y);
			$g.select('text')
				.attr("x", (d) => d3.event.x + rScale(d.radius))
			    .attr("y",(d) => d3.event.y - rScale(d.radius));
			$g.selectAll('path')
				.attr('d', function(d){
								d.lines[0][0] = xyScale.invert(d3.event.x);
								d.lines[0][1] = xyScale.invert(d3.event.y);
								return linePath(d.lines);
							});
			d3.selectAll('.' + id)
				.attr('d', function(d){
								d.lines[1][0] = xyScale.invert(d3.event.x);
								d.lines[1][1] = xyScale.invert(d3.event.y);
								return linePath(d.lines);
							});
		}
		function dragEnded(d){
			d3.select(this).classed("active", false);
		}
		
		d3.select('#N8').select('circle').attr('fill', 'coral');
	}
});