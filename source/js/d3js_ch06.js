$(function(){
	var color = d3.rgb(40, 80, 0);
	console.log(color);
	console.log(color.toString());
	var svg = d3.select('body').append('svg').attr('width', 1000).attr('height', 800);
	svg.append('circle').attr('cx', 100).attr('cy', 100).attr('r', 50).attr('fill', color);
	svg.append('circle').attr('cx', 150).attr('cy', 100).attr('r', 50).attr('fill', color.brighter(2));
	svg.append('circle').attr('cx', 200).attr('cy', 100).attr('r', 50).attr('fill', color.darker(2));
	var color2 = d3.rgb('rgb(40, 80, 0)');
	console.log(d3.hsl(color2));

	var hsl = d3.hsl(120, 1.0, 0.3);
	console.log(hsl);
	console.log(hsl.rgb());
	svg.append('circle').attr('cx', 100).attr('cy', 200).attr('r', 50).attr('fill', hsl);
	console.log(hsl.brighter());
	svg.append('circle').attr('cx', 150).attr('cy', 200).attr('r', 50).attr('fill', hsl.brighter(2));
	console.log(hsl.darker());
	svg.append('circle').attr('cx', 200).attr('cy', 200).attr('r', 50).attr('fill', hsl.darker(2));

	var a = d3.hsl(0, 1, 0.5);
	console.log(a);
	var b = d3.hsl(120, 1, 0.5);
	console.log(b);
	var compute = d3.interpolate(a, b);
	console.log(compute(0));
	console.log(compute(1));
	for (var i = 0; i < 10; i++) {
		svg.append('circle').attr('cx', 100 + i * 50).attr('cy', 300).attr('r', 50).attr('fill', compute(i/10));
	}

	svg.append('line').attr('x1', 20).attr('y1', 30).attr('x2', 100).attr('y2', 20).attr('stroke', 'black').attr('stroke-width', 3);
	svg.append('path').attr('d', 'M20, 20 L300, 50').attr('stroke', 'black').attr('stroke-width', 2);
	var lines = [[80, 80], [200, 100], [200, 200], [100, 200]];
	var linePath = d3.line().curve(d3.curveLinearClosed); // v3. interpolate('linear-closed') => v4. curve(d3.curveLinearClosed)
	svg.append('g').append('path').attr('d', linePath(lines)).attr('fill', 'transparent').attr('stroke', 'mistyrose').attr('stroke-width', 5);
	var linePath2 = d3.line().x(function(d){ return d[0]*2;}).y(function(d, i){ return i%2 == 0 ? 40 : 120;});
	svg.append('g').append('path').attr('d', linePath2(lines)).attr('fill', 'transparent').attr('stroke', 'tomato').attr('stroke-width', 5);
	var linePath3 = d3.line().defined(function(d){ return d[1] <= 100;}); // 若不是連續的點則不會連起來
	svg.append('g').append('path').attr('d', linePath3(lines)).attr('fill', 'transparent').attr('stroke', 'dodgerblue').attr('stroke-width', 5);

	var dataset = [80, 120, 130, 70, 60, 90];
	var areaPath = d3.area()
					.x(function(d, i){ return 500 + i * 80;})
					.y0(function(d, i){ return 200;})
					.y1(function(d, i){ return 200 - d;});
	svg.append('g').append('path').attr('d', areaPath(dataset)).attr('stroke', 'slateblue').attr('stroke-width', 5).attr('fill', 'transparent');
	var areaPath2 = d3.area()
					.x(function(d, i){ return 500 + i * 80;})
					.y0(function(d, i){ return 300;})
					.y1(function(d, i){ return 300 - d;})
					.curve(d3.curveBasis);
	svg.append('g').append('path').attr('d', areaPath2(dataset)).attr('stroke', 'mediumseagreen').attr('stroke-width', 5).attr('fill', 'transparent');
	var areaPath3 = d3.area()
					.x(function(d, i){ return 500 + i * 80;})
					.y0(function(d, i){ return 400;})
					.y1(function(d, i){ return 400 - d;})
					.curve(d3.curveStep);
	svg.append('g').append('path').attr('d', areaPath3(dataset)).attr('stroke', 'violet').attr('stroke-width', 5).attr('fill', 'transparent');

	var dataset = [{ startAngle: 0, endAngle: Math.PI * 0.6}, { startAngle: Math.PI * 0.6, endAngle: Math.PI}, { startAngle: Math.PI, endAngle: Math.PI * 1.7}, { startAngle: Math.PI * 1.7, endAngle: Math.PI * 2}];
	var arcPath = d3.arc().innerRadius(50).outerRadius(100);
	svg.append('g').selectAll('path').data(dataset).enter().append('path').attr('d', function(d){ return arcPath(d);}).attr('stroke', 'hotpink').attr('stroke-width', 5).attr('fill', 'transparent').attr('transform', 'translate(120, 380)');
	svg.append('g').selectAll('text').data(dataset).enter().append('text').attr('transform', function(d){ return 'translate(120, 380)' + 'translate(' + arcPath.centroid(d) + ')';}).attr('fill', 'black').text(function(d){ return Math.floor((d.endAngle - d.startAngle) * 180 / Math.PI);}).attr('text-anchor', 'middle');	

	// v4 符號有七個
	var shapes = [ d3.symbolCircle,
					d3.symbolCross,
					d3.symbolDiamond,
					d3.symbolSquare,
					d3.symbolStar,
					d3.symbolTriangle,
					d3.symbolWye ];
	var symbol = d3.symbol().size(1600);
	svg.append('g').selectAll('path').data(shapes).enter().append('path').attr('transform', (d, i) => 'translate(120, 380)' + 'translate(' + i * 100 + ', 0)').attr('fill', (d, i) => compute(i/(shapes.length - 1))).attr('d', symbol.type( (d) => d )); // symbol.type()要放在外面
	// function(d){ return d;} 可改寫成 (d) => d

	// dataset可自訂屬性名稱，但ribbon設定的參數要加上去
	var dataset = { startArc: {start: 0.2, end: Math.PI * 0.3},
						endArc: {start: Math.PI * 1.0, end: Math.PI * 1.6}};
	var chord = d3.ribbon().source((d) => d.startArc) // v3. d3.svg.chord() => v4. d3.ribbon() (v4.有chord，但用法不同)
							.target((d) => d.endArc)
							.radius(100) // radius相同，可直接設常數
							.startAngle((d) => d.start)
							.endAngle((d) => d.end);
	svg.append('g').append('path').attr('d', chord(dataset)).attr('stroke', 'royalblue').attr('stroke-width', 5).attr('fill', 'transparent').attr('transform', 'translate(140, 600)');
	// dataset用原始設定的參數，ribbon可直接用
	var dataset = { source: { startAngle: 0.2, endAngle: Math.PI * 0.3, radius: 100},
						target: { startAngle: Math.PI * 1.0, endAngle: Math.PI * 1.6, radius: 100}};
	var chord2 = d3.ribbon();
	svg.append('g').append('path').attr('d', chord2(dataset)).attr('stroke', 'rosybrown').attr('stroke-width', 5).attr('fill', 'transparent').attr('transform', 'translate(300, 600)');

	var dataset = {source: { x: 500, y: 500}, target: { x: 600, y: 600}};
	var diagonal = d3.linkHorizontal().x(function(d) { return d.x; }).y(function(d) { return d.y; }); // v3. d3.svg.diagonal() => v4. d3.linkHorizontal() or d3.linkVertical()，因為不支援diagonal
	svg.append('g').append('path').attr('d', diagonal(dataset)).attr('stroke', 'yellowgreen').attr('stroke-width', 5).attr('fill', 'transparent');
	var dataset = {source: { x: 400, y: 500}, target: { x: 500, y: 600}};
	var diagonal = d3.linkVertical().x(function(d) { return d.x; }).y(function(d) { return d.y; }); // v3. d3.svg.diagonal() => v4. d3.linkHorizontal() or d3.linkVertical()，因為不支援diagonal
	svg.append('g').append('path').attr('d', diagonal(dataset)).attr('stroke', 'slategray').attr('stroke-width', 5).attr('fill', 'transparent');

	var dataset = [
		{
			country: 'china',
			gdp: [[2000, 11920], [2001, 13170], [2002, 14550], [2003, 16500], [2004, 19440], [2005, 22870], [2006, 27930], [2007, 35040], [2008, 45470], [2009, 51050], [2010, 50490], [2011, 73140], [2012, 83860], [2013, 103550]]
		},
		{
			country: 'japan',
			gdp: [[2000, 47310], [2001, 41590], [2002, 39800], [2003, 43020], [2004, 46500], [2005, 45710], [2006, 43560], [2007, 43560], [2008, 48490], [2009, 50350], [2010, 54950], [2011, 59050], [2012, 59370], [2013, 48980]]
		}
	];
	var max = 0;
	for (var i = dataset.length - 1; i >= 0; i--) {
		var gdp = d3.max(dataset[i].gdp, (d) => d[1]);
		max = gdp > max ? gdp : max;
	}
	var range = d3.range(2000, 2014, 2);
	var line = d3.line().x( (d) => xScale(d[0])).y( (d) => yScale(d[1]));
	var xScale = d3.scaleLinear().domain([1999, 2014]).range([ 0, 500]);
	var yScale = d3.scaleLinear().domain([0, max * 1.1]).range([ 500, 0]);
	var svg = d3.select('body').append('svg').attr('width', 600).attr('height', 600);
	svg.append('g').attr('transform', 'translate( 50, 50)').selectAll('path').data(dataset).enter().append('path').attr('d', (d) => line(d.gdp)).attr('stroke', (d, i) => compute( i % 2 )).attr('stroke-width', 3).attr('fill', 'transparent');
	var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")).tickValues(range);
	var yAxis = d3.axisLeft(yScale);
	svg.append('g').attr('transform', 'translate( 50, 550)').call(xAxis);
	svg.append('g').attr('transform', 'translate( 50, 50)').call(yAxis);
	svg.append('g').attr('transform', 'translate( 50, 580)').selectAll('rect').data(dataset).enter().append('rect').attr('width', 10).attr('height', 10).attr('fill', (d, i) => compute( i % 2 )).attr('x', (d, i) => i * 60);
	svg.append('g').attr('transform', 'translate( 50, 580)').selectAll('text').data(dataset).enter().append('text').attr('font-size', 12).attr('fill', 'deepslateGray').attr('x', (d, i) => i * 60 + 14).attr('y', 10).text((d) => d.country);
});