$(function(){
	var characters = ['A', 'S', 'D', 'F'];

	var svg = d3.select('body').append('svg').attr('width', 500).attr('height', 500);
	var rect = svg.selectAll('rect')
					.data(characters)
					.enter()
					.append('rect')
					.attr('x', (d, i) => i * 110 + 10)
					.attr('y', 50)
					.attr('width', 100)
					.attr('height', 70)
					.attr('rx', 10)
					.attr('ry', 10)
					.attr('fill', 'steelblue');
	var text = svg.selectAll('text')
					.data(characters)
					.enter()
					.append('text')
					.attr('x', (d, i) => i * 110 + 10)
					.attr('y', 50)
					.attr('dx', 10)
					.attr('dy', 20)
					.attr('fill', 'ivory')
					.text((d) => d);
	d3.select('body').on('keydown', function(){
		rect.attr('fill', function(d) {
			var char = String.fromCharCode(d3.event.keyCode)
			if( d == char){
				return 'lightsteelblue';
			}else{
				return 'steelblue';
			}
		});
		console.log(d3.event);

	}).on('keyup', function(){
		rect.attr('fill', 'steelblue');
	});

	var circle = svg.append('circle')
					.attr('cx', 50)
					.attr('cy', 200)
					.attr('r', 40)
					.attr('fill', 'coral')
					.on('touchstart', function(){
						d3.select(this).attr('fill', 'khaki');
					})
					.on('touchmove', function(){
						var pos = d3.touches(this)[0]; // 取得第一個觸控點
						console.log(pos);
						d3.select(this)
							.attr('cx', pos[0]) // 觸控點的x座標
							.attr('cy', pos[1]); // 觸控點的y座標
					})
					.on('touchend', function(){
						d3.select(this).attr('fill', 'coral');
					});

	var svg2 = d3.select('div')
					.append('svg')
					.attr('width', 300)
					.attr('height', 300)
					.style('background-color', 'seashell');
	var dataset = [ { x: 200, y: 100}];
	var drag = d3.drag()
				.subject(function(d, i){ // v3. d3.behavior.drag().origin => v4. d3.drag().subject
					// return {x: d.x, y: d.y}
					// return {x: 10, y: 20}
					return d;
				})
				.on('start', function(){
					console.log('start');
				})
				.on('drag', function(d){
					d3.select(this)
						.attr('x', d.x = d3.event.x)
						.attr('y', d.y = d3.event.y);
					console.log(d3.event);
				})
				.on('end', function(){
					console.log('end');
				});
	svg2.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr('x', (d) => d.x)
		.attr('y', (d) => d.y)
		.attr('width', 50)
		.attr('height', 50)
		.on('click', function(){
			console.log(d3.mouse(this));
		})
		.call(drag);

	var circles = [{ cx: 150, cy: 200, r: 30},
					{ cx: 220, cy: 200, r: 30},
					{ cx: 150, cy: 270, r: 30},
					{ cx: 220, cy: 270, r: 30}];

	var zoom = d3.zoom()
				.scaleExtent([1, 10])
				.on('zoom', function(d){
					console.log(d3.event.transform);
					d3.select(this).attr('transform', d3.event.transform);
				});

	var g = svg.append('g').call(zoom);
	g.selectAll('circle').data(circles).enter().append('circle')
		.attr('cx', (d) => d.cx)
		.attr('cy', (d) => d.cy)
		.attr('r', (d) => d.r)
		.attr('fill', 'teal');
					

});