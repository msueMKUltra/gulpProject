$(function(){
	var svg = d3.select('body').insert('svg', '.btn-group').attr('width', 500).attr('height', 500);
	var easing = [
		d3.easeElastic,
		d3.easeBounce,
		d3.easeLinear,
		d3.easeSin,
		d3.easeQuad,
		d3.easeCubic,
		d3.easePoly,
		d3.easeCircle,
		d3.easeExp,
		d3.easeBack
	];
	var symbol = d3.symbol().size(400);
	// 因為append完的selection，和加入transition的會是不同的物件，所以可以把這兩個分開，用不同的變數存起來
	var rect = svg.append('rect')
					.attr('width', 300)
					.attr('height', 300)
					.attr('fill', 'red');
	var trans = rect.transition()
					.ease(d3.easePoly)
					.duration(2000)
					.delay(500)
					.attrTween("fill", function() {
						return d3.interpolateRgb("red", "blue");
					})
					.attr('height', 700);
	var path = svg.selectAll('path').data(easing).enter().append('path')
					.attr('d', symbol.type(d3.symbolCircle)).attr('fill', 'mistyrose').attr('transform', (d, i) => 'translate( 50, 50)' + 'translate( 0,' + i * 40 + ')')
					.transition().duration(2000).delay( (d, i) => i*200 ).ease(d3.easeBack)
					.attr('transform', (d, i) => 'translate( 50, 50)' + 'translate( 100,' + i * 40 + ')');
	var text = svg.append('text').attr('fill', 'white').attr('x', 100).attr('y', 10).attr('dy', '1.2em').attr('text-anchor', 'end').text(100);
	var initx = text.attr('x');
	var initText = text.text();
	var textTran = text.transition()
						.duration(2000)
						.tween('text', function(){
							var node = this; // this 要先存起來
							return function(t){
								d3.select(node)
									.attr('x', Number(initx) + t * 300)
									.text(Math.floor(Number(initText) + t * 300))
									.attr('fill', 'rgb(' + Math.floor((1 - t) * 255) + ', ' + Math.floor((1 - t) * 255) + ', ' + Math.floor((1 - t) * 255) + ')');
							}
						});
	var dataset = [100, 100, 100];
	var g = svg.append('g');
	var rect = g.selectAll('rect')
				.data(dataset)
				.enter()
				.append('rect')
				.attr('fill', 'slateblue')
				.attr('id', (d, i) => 'rect' + i)
				.attr('x', 10)
				.attr('y', (d, i) => 10 + i * 35)
				.attr('width', (d, i) => d)
				.attr('height', 30);
	g.transition().duration(2000).select('#rect1').attr('width', 400);
	g.transition().duration(2000).selectAll('rect').attr('width', 300).transition().duration(2000).filter( (d,i) => i >= 1).attr('width', 200);
	// g.transition().duration(2000).selectAll('rect').filter( (d,i) => i >= 1).attr('width', 200);
	g.transition().duration(2000).selectAll('rect').on('start', function(){ console.log('start');}).on('end', function(){ console.log('end');}).attr('width', 300); // v3. each => v4. on
	g.transition().duration(2000).selectAll('rect').on('interrupt', function(d, i){ console.log('interrupt');}).attr('width', 300);
	setTimeout(function(){ g.transition().selectAll('rect').attr('width', 10)}, 1000);
	var xScale = d3.scaleLinear().domain([0, 10]).range([0, 300]);
	var xAxis = d3.axisBottom(xScale);
	var g = svg.append('g').attr('class', 'axis').attr('transform', 'translate(50, 200)').call(xAxis);
	xScale.domain([0, 50]);
	g.transition().ease(d3.easeBounce).duration(2000).call(xAxis);

	var center = [[0.5, 0.5], [0.7, 0.8], [0.4, 0.9], [0.11, 0.32], [0.88, 0.25], [0.75, 0.12], [0.5, 0.1], [0.2, 0.3], [0.4, 0.1], [0.6, 0.7]];
	var svg2 = d3.select('body').append('svg').attr('width', 500).attr('height', 500);
	var xScale = d3.scaleLinear().domain([0, 1]).range([0, 300]);
	var yScale = d3.scaleLinear().domain([0, 1]).range([300, 0]);
	var g = svg2.append('g').attr('transform', 'translate(30, 30)');
	function drawCircle(){
		var circleUpdate = g.selectAll('circle').data(center);
		var circleEnter = circleUpdate.enter();
		var circleExit = circleUpdate.exit();
		circleUpdate.transition()
					.duration(2000)
					.attr('cx', function(d){
						return xScale(d[0]);
					})
					.attr('cy', function(d){
						return yScale(d[1]);
					});
		circleEnter.append('circle').attr('fill', 'balck').attr('cx', 0).attr('cy', 300).attr('r', 7)
					.transition().duration(2000).attr('cx', (d) => xScale(d[0])).attr('cy', (d) => yScale(d[1]));
		circleExit.transition().duration(2000).attr('fill', 'white').remove();
	}
	function drawAxis(){
		var xAxis = d3.axisBottom(xScale).ticks(5);
		var yAxis = d3.axisLeft(yScale).ticks(5);
		svg2.append('g').attr('class', 'axis').attr('transform', 'translate(30, 330)').call(xAxis);
		svg2.append('g').attr('class', 'axis').attr('transform', 'translate(30, 30)').call(yAxis);
	}
	function update(){
		for (var i = center.length - 1; i >= 0; i--) {
			center[i][0] = Math.random();
			center[i][1] = Math.random();
		}
		drawCircle();
	}
	function add(){
		center.push([ Math.random(), Math.random()]);
		drawCircle();
	}
	function sub(){
		center.pop();
		drawCircle();
	}
	$('.roller-btn1').click(update);
	$('.roller-btn2').click(add);
	$('.roller-btn3').click(sub);
	drawCircle();
	drawAxis();
});