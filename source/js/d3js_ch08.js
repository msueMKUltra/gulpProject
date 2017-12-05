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
							.attr('cx', pos[0])
							.attr('cy', pos[0]);
					})
					.on('touchend', function(){
						d3.select(this).attr('fill', 'coral');
					});
});