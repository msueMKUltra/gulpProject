$(function(){

	d3.queue()
		.defer(d3.json, "./json/gooee/name_map.json")
		.defer(d3.json, "./json/gooee/location.json")
		.defer(d3.json, "./json/gooee/data_C.json")
		.defer(d3.json, "./json/gooee/data_B.json")
		.awaitAll(gooee);

	function gooee(error, files){
    	if (error) throw error;

		var unit = {width: 1000, height: 1000};
		var svg = d3.select('svg')
					.attr('width', unit.width)
					.attr('height', unit.height)
					.style('background-color', 'steelblue');

		var dataset = [];
		var xyScale = d3.scaleLinear().domain([0, 100]).range([0, 1000]);
		var r = {max: 0, start: 4, section: 4, range: 6};
		var arrowX = [ 7, 8.5, 10, 11.5]; // r的section有幾個，元素就有幾個，對應設定arrow的x偏移
		var p = {max: 0, start: 1, section: 4, range: 1};
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
		var rScaleRange = rScale.range();
		var aScale = d3.scaleOrdinal().domain(rScale.range()).range(arrowX);

		//add arrow marker
		for (var i = 0; i < rScaleRange.length; i++) {		
			svg.append('defs').append('marker')
				.attr('id', 'arrow' + rScaleRange[i])
				.attr('markerUnits', 'userSpaceOnUse')
				.attr('markerWidth', '32')
				.attr('markerHeight', '32')
				.attr('viewBox', '0 0 8 8')
				.attr('refX', aScale(rScaleRange[i]))
				.attr('refY', '4')
				.attr('orient', 'auto')
				.append('path')
				.attr('d', 'M2,2 L6,4 L2,6 L3,4 L2,2')
				.attr('fill', 'white');
		}


		function calcMidPoint(x, y, cx, cy){
			// var distance = Math.sqrt( Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
			// var edge = distance/Math.sqrt(2);
    		// var mx = x > cx ? cx + edge : x + edge;
    		// var my = y > cy ? cy + edge : y + edge;
			if(x > cx){
				var mx = y > cy ? x : cx;
			}else{
				var mx = y > cy ? cx : x;
			}
			if(y > cy){
				var my = x > cx ? cy : y;
			}else{
				var my = x > cx ? y : cy;
			}
    		return [mx, my];
		}

		//data_B.json
		for( var key in data_B){
    		var start = data_B[key].start, end = data_B[key].end, count = data_B[key].count;
    		var getStart = map.get(start), getEnd = map.get(end);
    		var id = getEnd.name;
    		var radius = getEnd.radius;
    		var x = getStart.location.cx;
    		var y = getStart.location.cy;
    		var cx = getEnd.location.cx;
    		var cy = getEnd.location.cy;
    		var midPoint = calcMidPoint(x, y, cx, cy);
    		getStart.end.push({ lines: [[x, y], midPoint, [cx, cy]], count: count, id: id, radius: radius});
    		// getStart.end.push({ lines: {source: { x: getStart.location.cx, y:getStart.location.cy}, target:{ x: cx, y: cy}}, count: count, id: id});
    		p.max = count > p.max ? count : p.max;
    	}
		var pRange = d3.range(p.start, p.start + p.section * p.range, p.range);
		var pScale = d3.scaleQuantize().domain([0, p.max]).range(pRange);
		var cScale = d3.scaleQuantize().domain([0, p.max]).range(d3.range(p.section));
		var color = d3.interpolate('yellowgreen', 'indianred');
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
			var linePath = d3.line().curve(d3.curveBundle.beta(0.5)).x((d) => xyScale(d[0])).y((d) => xyScale(d[1]));
			var linkHor = d3.linkHorizontal().x((d) => xyScale(d.x)).y((d) => xyScale(d.y));
			var linkVer = d3.linkVertical().x((d) => xyScale(d.x)).y((d) => xyScale(d.y));
			var $id = d3.select('#' + id);
			
			$id.selectAll('path')
				.data(lines)
				.enter()
				.append('path')
				.attr('class', (d) => d.id)
				.attr('d', (d) => linePath(d.lines))
				// .attr('d', (d) => chooseLink(d.lines))
				.attr('stroke', (d) => color(cScale(d.count)/(p.section - 1)))
				.attr('stroke-width', (d) => pScale(d.count))
				.attr('fill', 'none')
				.attr('marker-end', (d) => 'url(#arrow' + rScale(d.radius) + ')');
		}

		function chooseLink(d){
			if(d.source.y > d.target.y){
				return linkHor(d);
			}else{
				return linkVer(d);
			}
		}

		var circle = svg.selectAll('cilcle')
						.data(dataset)
						.enter()
						.append('circle')
						.attr('cx', (d) => xyScale(d.location.cx))
						.attr('cy', (d) => xyScale(d.location.cy))
			    		.attr('r', (d) => rScale(d.radius))
			    		.attr('data-id', (d) => d.name)
			    		.call(drag);

		var text = g.append('text')
						.attr('x', (d) => xyScale(d.location.cx) + rScale(d.radius))
						.attr('y', (d) => xyScale(d.location.cy) - rScale(d.radius))
			    		.attr('fill', 'ivory')
			    		.text( (d) => d.name)

		circle.on('mouseover', function(){
			var id = d3.select(this).attr('data-id');
			d3.select('#' + id).select('text').text( (d) => d.name + ' (' + d.id + ')');
		});
		circle.on('mouseout', function(){
			var id = d3.select(this).attr('data-id');
			d3.select('#' + id).select('text').text( (d) => d.name);
		});


		function dragStarted(d){
			// d3.select(this.parentNode).raise().classed("active", true);
		}
		function dragged(d){
			var $this = d3.select(this);
			var id = $this.attr('data-id');
			var $g = d3.select('#' + id);
			$this.attr("cx", d3.event.x)
			    .attr("cy", d3.event.y);
			$g.select('text')
				.attr("x", (d) => d3.event.x + rScale(d.radius))
			    .attr("y",(d) => d3.event.y - rScale(d.radius));
			$g.selectAll('path')
				.attr('d', function(d){
								d.lines[0][0] = xyScale.invert(d3.event.x);
								d.lines[0][1] = xyScale.invert(d3.event.y);
								var midPoint = calcMidPoint(d.lines[0][0], d.lines[0][1], d.lines[2][0], d.lines[2][1]);
								d.lines[1][0] = midPoint[0];
								d.lines[1][1] = midPoint[1];
								return linePath(d.lines);
								// d.lines.source.x = xyScale.invert(d3.event.x);
								// d.lines.source.y = xyScale.invert(d3.event.y);
								// return chooseLink(d.lines);
							});
			d3.selectAll('.' + id)
				.attr('d', function(d){
								d.lines[2][0] = xyScale.invert(d3.event.x);
								d.lines[2][1] = xyScale.invert(d3.event.y);
								var midPoint = calcMidPoint(d.lines[0][0], d.lines[0][1], d.lines[2][0], d.lines[2][1]);
								d.lines[1][0] = midPoint[0];
								d.lines[1][1] = midPoint[1];
								return linePath(d.lines);
								// d.lines.target.x = xyScale.invert(d3.event.x);
								// d.lines.target.y = xyScale.invert(d3.event.y);
								// return chooseLink(d.lines);
							});
		}
		function dragEnded(d){
			d3.select(this).classed("active", false);
		}

		// function addMidPoint(array, percent){
		// 	var m, x, y;
		// 	if(x1 == x2){
		// 		if(y1 > y2){
		// 			y = y2 + (y1 - y2)/2;
		// 			x = x2 + 2;
		// 		}else if(y1 < y2){
		// 			y = y1 + (y2 - y1)/2;
		// 			x = x1 - 2;
		// 		}else{
		// 			y = y1;
		// 			x = x1;
		// 		}
		// 	}else{
		// 		m = (y2 - y1)/(x2 - x1);
		// 		m = -1 / m;
		// 	}
		// }
		
		$('[data-id="N8"]').attr('fill', 'gold');
	}
});