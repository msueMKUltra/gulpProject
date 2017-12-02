$(function(){

	d3.queue()
		.defer(d3.json, "./json/gooee/name_map.json")
		.defer(d3.json, "./json/gooee/data_C.json")
		.defer(d3.json, "./json/gooee/data_B.json")
		.awaitAll(chordDiagram);

	function chordDiagram(error, files){
    	if (error) throw error;

		var unit = {width: 1000, height: 1000};
		var svg = d3.select('svg')
					.attr('width', unit.width)
					.attr('height', unit.height)
					.style('background-color', 'white');

		var dataset = [];
		var r = {max: 0, inner: 300, outer: 310, section: 4, space: 4};
		var total = (r.outer - r.inner + r.space) * r.section + r.inner;
		r.total = total;
		var p = {max: 0, start: 2, section: 4, range: 2};
		var name_map = files[0];
		var data_C = files[1];
		var data_B = files[2];

		var nameArray = [];
		var i = 0;

		//name_map.json
    	for( var key in name_map){
    		var name = name_map[key];
    		dataset.push({
    			code: key,
    			name: name,
    			index: i
    		});
    		nameArray.push(name);
    		i++;
    	}
    	// nameArray.sort((a, b) => d3.ascending(a, b));
    	
    	var map = d3.map(dataset, (d) => d.code);

    	//data_C.json
		for( var key in data_C){
    		var radius = data_C[key];
    		var get = map.get(key);
    		var name = get.name;
    		map.get(key).radius = radius;
    		map.get(key).end = []; // for saving data_B
    		r.max = radius > r.max ? radius : r.max;
    	}
		var rRange = d3.range(r.section);
		var rScale = d3.scaleQuantize().domain([0, r.max]).range(rRange);
		var rColor = d3.interpolate('cornflowerblue', 'mistyrose');


		// function nameToIndex(name){
		// 	var splitStr = 'N';
		// 	return name.split(splitStr)[1] - 1;
		// }

		var countArray = new Array(nameArray.length);
		for (var i = 0; i < countArray.length;  i++) {
			countArray[i] = [];
			for (var j = 0; j < countArray.length;  j++) {
				countArray[i][j] = 0;
			}
		}

		//data_B.json
		for( var key in data_B){
    		var start = data_B[key].start, end = data_B[key].end, count = data_B[key].count;
    		var getStart = map.get(start), getEnd = map.get(end);
    		// var index = {start: nameToIndex(getStart.name), end: nameToIndex(getEnd.name)};
    		// countArray[index.start][index.end] = count;
    		// countArray[getStart.index][getEnd.index] = count;
    		countArray[getEnd.index][getStart.index] = count;
    		getStart.end.push({ name: getEnd.name, count: count});
    		p.max = count > p.max ? count : p.max;
    	}
    	console.log(countArray);
		var pRange = d3.range(p.section);
		var pScale = d3.scaleQuantize().domain([0, p.max]).range(pRange);
		var pColor = d3.interpolate('yellowgreen', 'darkred');

		var chord = d3.chord()
					.padAngle(0.03)
					.sortSubgroups(d3.descending);

		var arc =  d3.arc()
					.innerRadius(r.inner)
					.outerRadius(r.total);

		var ribbon = d3.ribbon()
   					.radius(r.inner);

		var gChord = svg.append('g')
						.attr('transform', 'translate(' + unit.width/2 + ',' + unit.height/2 + ')')
						.datum(chord(countArray));

		var gOuter = gChord.append('g');
		var gInner = gChord.append('g');

		var mapIndex = d3.map(dataset, (d) => d.index);

		function addArc(groups){
			groups.map(function(d){
				var index = d.index;
				var map = mapIndex.get(index);
				var radius = map.radius;
				var name = map.name;
				var code = map.code;
				var level = rScale(radius)
				var oPath = gOuter.append('g').attr('id', name).attr('data-code', code);
				for(var i = 0; i <=  level; i++){
					var angle = [{ startAngle: d.startAngle, endAngle: d.endAngle}];
					var width = r.outer - r.inner;
					var inner = r.inner + (r.space + width) * i; 
					var outer = r.outer + (r.space + width) * i;
					var arc = d3.arc().innerRadius(inner).outerRadius(outer);
					oPath.append('g')
							.selectAll('path')
							.data(angle)
							.enter()
							.append('path')
							.classed('levelPath', true)
							.attr('d', arc)
							.attr('fill', 'none')
							.transition()
							.delay(200 * (i + 1))
							.attr('fill', rColor(i/(r.section - 1)));
				}
			});
		}

		addArc(chord(countArray).groups);

		var outerPath = gOuter.selectAll('.outerPath')
				.data((c) => c.groups)
				.enter()
				.append('g')
				.classed('outerPath', true);

		outerPath.append('path')
				.classed('radiusPath', true)
				.style('fill', 'transparent')
				.attr('d', arc);

		outerPath.append('text')
				.classed('nameText', true)
				.attr('dy', '.35em')
				.each(function(d, i){
					d.midAngle = (d.startAngle + d.endAngle)/2;
					d.name = nameArray[i];
				})
				.attr('transform', addOuterText(10))
				.attr('text-anchor', 'middle')
				.text((d) => d.name);

		outerPath.append('text')
				.classed('codeText', true)
				.attr('dy', '.35em')
				.each(function(d, i){
					d.midAngle = (d.startAngle + d.endAngle)/2;
					d.name = nameArray[i];
				})
				.attr('transform', addOuterText(36))
				.attr('text-anchor', 'middle')
				.text((d, i) => mapIndex.get(i).code)
				.attr('opacity', 0);

		function addOuterText(far){
			return function(d){
				var degree = d.midAngle * 180 / Math.PI;
					var rotate = 'rotate(' + degree + ')';
					var location = -1.0 * (r.total + far); 
					var translate = 'translate( 0,' + location + ')';
					var result = rotate + translate;
					if(degree > 120 && degree < 240){
						result += 'rotate(180)';
					}
					return result;
			}
		}

		gInner.selectAll('.innerPath')
				.data((c) => c)
				.enter()
				.append('path')
				.classed('innerPath', true)
				.attr('fill', (d) => pColor(pScale(d.target.value)/(p.section - 1)))
				.attr('d', ribbon)
				.attr('stroke', (d) => pColor(pScale(d.target.value)/(p.section - 1)))
				.attr('stroke-width', 2)
				.attr('opacity', 0.7);


		gOuter.selectAll('.radiusPath')
				.on('mouseover',fade(0.1, true))
				.on('mouseout', fade(0.7, false));

		function fade(opacity, show){
			return function(g, i){
				gInner.selectAll('.innerPath')
					.filter(function(d){
						return d.source.index != i && d.target.index != i;
					})
					.transition()
					.style('opacity', opacity);
				var $this = d3.select(this.parentNode);
				if(show){
					var name = g.name;
					$this.select('.codeText').transition().attr('opacity', 1);
					d3.select('#' + name).selectAll('path').attr('fill', 'none')
								.transition()
								.delay((d, i) => (i + 1) * 200)
								.attr('fill', (d, i) => rColor(i/(r.section - 1)));
				}else{
					$this.select('.codeText').transition().attr('opacity', 0);
				}
			};
		}

		d3.selectAll('.nameOuter').on('mouseover', null);
	}
});