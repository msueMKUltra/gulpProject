$(function(){
	var dataset = [];
	var lineset = [];
	var circleColor = '#C41781';
	var circleColor2 = '#1781C4';
	var textColor = '#C3C6CC';
	var duration = 2000;
	var datalength = 10;
	var $scatter = $('.roller-scatter-chart');
	var width = $scatter.width();
	var unit = {width: width, height: width, padding: width/10}
	var svg = d3.select('.roller-scatter-chart').append('svg').attr('width', unit.width).attr('height', unit.height)
				.append('g').attr('transform', 'translate(' + unit.padding + ',' + unit.padding + ')');
	var xScale = d3.scaleLinear().domain([0, 32]).range([0, unit.width - unit.padding * 2]);
	var yScale = d3.scaleLinear().domain([0, 32]).range([unit.height - unit.padding * 2, 0]);
	var rScale = d3.scaleQuantile().domain(d3.range(datalength + 1)).range([0, 4, 5, 6, 7, 8]);
	var oScale = d3.scaleQuantile().domain(d3.range(datalength + 1)).range([0, 0.3, 0.4, 0.5, 0.6, 0.7]);
	// var rScale = d3.scaleQuantize().domain([0, 9]).range(d3.range(10));
	var yGrid = d3.axisBottom().tickValues([2, 9, 16, 23, 30]).tickFormat('').tickSize(unit.height - unit.padding * 2).scale(xScale);
	svg.append('g').classed('y-grid', true).call(yGrid);
	var xGrid = d3.axisRight().tickValues([2, 9, 16, 23, 30]).tickFormat('').tickSize(unit.width - unit.padding * 2).scale(yScale);
	svg.append('g').classed('x-grid', true).call(xGrid);
	var g = svg.append('g').classed('circle-group', true);

	function scatterPlot(){
		var update = g.selectAll('circle').data(dataset);
		var enter = update.enter();
		var exit = update.exit();

		update.transition()
			.duration(duration)
			.attr('cx', (d, i) => xScale(d.x))
			.attr('cy', (d, i) => yScale(d.y))
			.attr('r', (d, i) => rScale( datalength - dataset.length + i + 1))
			// .attr('opacity', (d, i) => oScale( datalength - dataset.length + i));
			.attr('fill', circleColor2)
			.attr('opacity', 0.3);

		enter.append('circle')
			.attr('cx', (d, i) => {
				if(dataset.length == 1){
					return xScale(d.x);
				}else{
					return xScale(dataset[i - 1].x);
				}
			})
			.attr('cy', (d, i) => {
				if(dataset.length == 1){
					return yScale(d.y);
				}else{
					return yScale(dataset[i - 1].y);
				}
			})
			.attr('r', (d, i) => {
				if(dataset.length == 1){
					return 0;
				}else{
					return rScale(i - 1);
				}
			})
			.attr('fill', circleColor2)
			.attr('opacity', 0)
			.transition()
			.duration(duration)
			// .ease(d3.easeLinear)
			.attr('cx', (d, i) => xScale(d.x))
			.attr('cy', (d, i) => yScale(d.y))
			.attr('r', (d, i) => rScale((datalength)))
			// .attr('opacity', oScale(datalength))
			.attr('opacity', 1)
			.on('start',(d, i) => {
				svg.append('circle')
					.classed('blink', true)
					.attr('cx', () => {
						if(dataset.length == 1){
							return xScale(d.x);
						}else{
							return xScale(dataset[i - 1].x);
						}
					})
					.attr('cy', () => {
						if(dataset.length == 1){
							return yScale(d.y);
						}else{
							return yScale(dataset[i - 1].y);
						}
					})
					.attr('r', 0)
					.attr('fill', circleColor2)
					.attr('opacity', 1)
					.transition()
					.duration(duration)
					// .ease(d3.easeLinear)
					.attr('cx', xScale(d.x))
					.attr('cy', yScale(d.y))
					.attr('opacity', 0)
					.attr('r', 30)
					.on('end', function(){
						d3.select(this).remove();
					});
				var location = svg.select('.location');
				if(location.empty()){
					location = svg.append('text').classed('location',true)
									.text('(0, 0)')
									.attr('text-anchor', 'start')
									.attr('transform','translate(' + (unit.width - unit.padding) + ', 0)')
									.attr('font-size', 40)
									.style('text-shadow', '2px 2px 2px #000')
									// .attr('opacity', oScale(datalength))
									// .attr('opacity', 0.7)
									.attr('dx', -140)
									.attr('dy', -130);
				}
				var text = location.text();
				var split = text.split(', ');
				var x = split[0].split('(')[1];
				var y = split[1].split(')')[0];
				location.transition().duration(duration)
						.tween('xyChange', () => {
							var xInter = d3.interpolateRound(x, d.x);
							var yInter = d3.interpolateRound(y, d.y);
							return function(t) {
							    location.attr('fill', '#1781C4').text('(' + xInter(t) + ', ' + yInter(t) + ')');
						    }
						});
			});

	}

	var $line = $('.roller-line-chart');
	var width2 = $line.width();
	var unit2 = {width: width2, height: width, padding: width2/10}
	var svg2 = d3.select('.roller-line-chart').append('svg').attr('width', unit2.width).attr('height', unit2.height)
				.append('g').attr('transform', 'translate(' + unit2.padding + ',' + unit2.padding + ')');
	var xScale2 = d3.scaleLinear().domain([ 1, datalength]).range([0, unit2.width - unit2.padding * 2]);
	var preScale = d3.scaleLinear().domain([0, 255]).range([0, 1]);
	var yScale2 = d3.scaleLinear().domain([0, 1]).range([unit2.height - unit2.padding * 2, 0]);
	var rScale2 = d3.scaleQuantile().domain(d3.range(datalength)).range([4, 6, 8, 10, 12]);
	var oScale2 = d3.scaleQuantile().domain(d3.range(datalength)).range([0.3, 0.4, 0.5, 0.6, 0.7]);
	// var rScale = d3.scaleQuantize().domain([0, 9]).range(d3.range(10));
	var xAxis2 = d3.axisBottom().tickValues(d3.range(1, datalength + 1)).tickFormat(d3.format('d')).scale(xScale2);
	svg2.append('g').classed('x-axis', true).attr('transform', 'translate(' + unit2.padding/2 + ',' + (unit2.height - unit2.padding*2) + ')').call(xAxis2);
	var yAxis2 = d3.axisRight().tickValues(d3.range(0, 1.25, 0.25)).tickSize(0).tickFormat(d3.format('.0%')).scale(yScale2);
	svg2.append('g').classed('y-axis', true).attr('transform', 'translate( -36, -10)').call(yAxis2);
	var xGrid2 = d3.axisRight().tickValues(d3.range(0, 1.25, 0.25)).tickFormat('').tickSize(unit2.width).scale(yScale2);
	svg2.append('g').classed('x-grid', true).attr('transform', 'translate(' + -unit2.padding + ', 0)').call(xGrid2);
	var g2 = svg2.append('g').classed('line-group', true).attr('transform', 'translate(' + unit2.padding/2 + ', 0)');

	// var svg3 = d3.select('.roller-percentage').attr('svg').attr('width', 40).attr('height', 40).append('text').text('xxx').attr('dx', 10).attr('dy', 10);

	svg2.append('defs').append('marker')
			.attr('id', 'linePoint')
			.attr('viewBox', '0 0 12 12')
			.attr('refX', '6')
			.attr('refY', '6')
			.attr('markerHeight', '6')
			.attr('markerWidth', '6')
			.attr('orient', 'auto')
			.append('circle')
			.attr('cx', 6)
			.attr('cy', 6)
			.attr('r', 6)
			.attr('fill', circleColor);

	function linePlot(){
		if(dataset.length == 1){
			g2.append('circle').classed('noOneCircle', true).data(dataset)
				.attr('cx', (d, i) => xScale2(i + 1))
				.attr('cy', (d) => yScale2(preScale(d.f)))
				.attr('fill', 'black')
				.attr('r', 0)
				.attr('fill', circleColor)
				.attr('opacity', 0)
				.transition()
				.duration(duration)
				.attr('r', 6)
				.attr('opacity', 1)
				.on('start', (d, i) => {
					svg2.append('circle')
						.classed('blink', true)
						.attr('cx', () => xScale2(i + 1))
						.attr('cy', () => yScale2(preScale(d.f)))
						.attr('transform', 'translate(' + unit2.padding/2 + ', 0)')
						.attr('r', 0)
						.attr('opacity', 1)
						.transition()
						.duration(duration)
						.attr('opacity', 0)
						.attr('r', 30)
						.on('end', function(){
							d3.select(this).remove();
						});
					var location = svg2.select('.location');
					if(location.empty()){
						location = svg2.append('text').classed('location',true)
										.text('0%(0)')
										.attr('text-anchor', 'start')
										.attr('transform','translate(' + (unit2.width - unit2.padding) + ', 0)')
										.attr('font-size', 40)
										.style('text-shadow', '2px 2px 2px #000')
										// .attr('opacity', oScale(datalength))
										// .attr('opacity', 0.7)
										.attr('dx', -180)
										.attr('dy', -150);
					}
					var text = location.text();
					var split = text.split('%');
					var p = split[0];
					var f = split[1].split('(')[1].split(')')[0];
					location.transition().duration(duration)
						.tween('pfChange', () => {
							var pInter = d3.interpolateRound(p, preScale(d.f*100));
							var fInter = d3.interpolateRound(f, d.f);
							return function(t) {
							    location.attr('fill', '#C41781').text(pInter(t) + '%(' + fInter(t) + ')');
						    }
						});
				});
				return;
		}

		var noOneCircle = d3.select('.noOneCircle');
		if(!noOneCircle.empty()) noOneCircle.remove();

		// console.log(lineset);

		var update = g2.selectAll('path').data(lineset);
		var enter = update.enter();
		var exit = update.exit();

		var linePath = d3.line().x((d, i) => xScale2(i + 1)).y((d) => yScale2(preScale(d.f)));

		update.attr('stroke-dashoffset', 0)
			.attr('stroke', circleColor)
			.attr('stroke-width', 2)
			.attr('fill', 'none')
			.transition()
			.duration(duration)
			.ease(d3.easeLinear)
			.attr('transform', (d, i) => {
				var trans = xScale2(i + 1);
				if(lineset.length >= datalength){
					var trans = xScale2(i);
				}
				return 'translate(' + trans + ', 0)';
			});

		var enterPath = 
			enter.append('path')
			.attr('d', d => linePath(d))
			.attr('transform', (d, i) => {
				var trans = xScale2(i + 1);
				if(lineset.length >= datalength + 1){
					trans = xScale2(datalength);
				}
				return 'translate(' + trans + ', 0)';
			})
			.attr('stroke', circleColor)
			.attr('stroke-width', 2)
			.attr('fill', 'none')
			.attr('opacity', 1)
			.attr('marker-start', 'url(#linePoint)');

		var pathLength = enterPath.node().getTotalLength();

		enterPath
			.attr('stroke-dasharray', pathLength + ' ' + pathLength)
			.attr('stroke-dashoffset', pathLength)
			.transition()
			.duration(duration)
			.ease(d3.easeLinear)
			.attr('stroke-dashoffset', 0)
			.on('start', (d, i) => {
				svg2.append('circle')
					.classed('blink', true)
					.attr('cx', () => xScale2(i + 1))
					.attr('cy', () => yScale2(preScale(d[1].f)))
					.attr('transform', () => {
						var trans = xScale2(2) + unit2.padding/2;
						if(i >= datalength - 1){
							trans = unit2.padding/2;
						}
						return 'translate(' + trans + ', 0)';
					})
					.attr('r', 0)
					.attr('fill', circleColor)
					.attr('opacity', 1)
					.transition()
					.duration(duration)
					// .ease(d3.easeLinear)
					.attr('opacity', 0)
					.attr('r', 30)
					.on('end', function(){
						d3.select(this).remove();
					});
				svg2.append('circle')
					.classed('blink', true)
					.attr('cx', () => xScale2(i + 1))
					.attr('cy', () => yScale2(preScale(d[1].f)))
					.attr('transform', () => {
						var trans = xScale2(2) + unit2.padding/2;
						if(i >= datalength - 1){
							trans = unit2.padding/2;
						}
						return 'translate(' + trans + ', 0)';
					})
					.attr('r', 0)
					.attr('fill', circleColor)
					.attr('opacity', 0)
					.transition()
					.duration(duration)
					// .ease(d3.easeLinear)
					.attr('opacity', 1)
					.attr('r', 6)
					.on('end', function(){
						d3.select(this).remove();
					});
				var location = svg2.select('.location');
				if(location.empty()){
					location = svg2.append('text').classed('location',true)
									.text('0%(0)')
									.attr('text-anchor', 'start')
									.attr('transform','translate(' + (unit2.width/2 - unit2.padding) + ', 0)')
									.attr('font-size', 40)
									.style('text-shadow', '2px 2px 2px #000')
									// .attr('opacity', oScale(datalength))
									// .attr('opacity', 0.7)
									.attr('dx', -180)
									.attr('dy', -150);
				}
				var text = location.text();
				var split = text.split('%');
				var p = split[0];
				var f = split[1].split('(')[1].split(')')[0];
				location.transition().duration(duration)
						.tween('pfChange', () => {
							var pInter = d3.interpolateRound(p, preScale(d[1].f*100));
							var fInter = d3.interpolateRound(f, d[1].f);
							return function(t) {
							    location.text(pInter(t) + '%(' + fInter(t) + ')');
						    }
						});
			})
			.filter((d, i) => i >= datalength - 1)
			.attr('transform', (d, i) => {
					return 'translate(' + xScale2(datalength - 1) + ', 0)';
				});
	}

	function piePlot(){
		var dataset1 = [20, 80];
		var dataset2 = [45, 55];
		var dataset3 = [100];
		var $coordinate = $('.roller-coordinate');
		var width = $coordinate.width();
		var height = width*2/3;
		var svg = d3.select('.roller-coordinate').append('svg').attr('width', width).attr('height', height);
		var outer = height/2*0.8;
		var space = 14;
		var radius = { inner: outer - space, outer: outer};
		var radius2 = { inner: outer - space*2, outer: outer - space};
		var radius3 = { inner: outer - space*2, outer: outer};
		var pie = d3.pie()
					// .value((d) => d.count) // 設定value為dataset裡的什麼值，不加則dataset必須為資料的陣列
					// .sort(function(a, b) { return a.name.localeCompare(b.name); }) // 由dataset裡的某值做排序，不加則startAngle的順序會依value大到小排列
					// .sortValues((a, b) => a - b) // 依values的大小排列，與上行可擇一撰寫
					// .startAngle(() => 0) // 設定起始的角度，預設為0
					.endAngle(() => 1.25 * Math.PI) // 設定終止的角度，預設為2π
					// .padAngle(() => 0.03) // 設定arc之間的空隙，預設為0 (you can google "pie padding animation" for Mike's work)
					(dataset1);

		var pie2 = d3.pie()
					// .value((d) => d.count) // 設定value為dataset裡的什麼值，不加則dataset必須為資料的陣列
					// .sort(function(a, b) { return a.name.localeCompare(b.name); }) // 由dataset裡的某值做排序，不加則startAngle的順序會依value大到小排列
					// .sortValues((a, b) => a - b) // 依values的大小排列，與上行可擇一撰寫
					// .startAngle(() => 0) // 設定起始的角度，預設為0
					.endAngle(() => 1.25 * Math.PI) // 設定終止的角度，預設為2π
					// .padAngle(() => 0.03) // 設定arc之間的空隙，預設為0 (you can google "pie padding animation" for Mike's work)
					(dataset2);

		var pie3 = d3.pie()
					.startAngle(() => 1.25 * Math.PI)(dataset3);

		var arc = d3.arc()
					.innerRadius(radius.inner)
					.outerRadius(radius.outer);

		var arc2 = d3.arc()
					.innerRadius(radius2.inner)
					.outerRadius(radius2.outer);

		var arc3 = d3.arc()
					.innerRadius(radius3.inner)
					.outerRadius(radius3.outer);

		var g = svg.selectAll('.g1').data(pie).enter().append('g').attr('transform', 'translate(' + width*3/5 + ', ' + height/2 + ')');
		g.append('path')
			.attr('d', (d) => arc(d))
			.attr('opacity', (d, i) => (i + 1) * 0.5)
			.attr('fill', '#51A1D3'); // 有20種color，用陣列方式讀取，index超過19會變黑色
		var g2 = svg.selectAll('.g2').data(pie2).enter().append('g').attr('transform', 'translate(' + width*3/5 + ', ' + height/2 + ')');
		g2.append('path')
			.attr('d', (d) => arc2(d))
			.attr('opacity', (d, i) => (i + 1) * 0.5)
			.attr('fill', '#A8D0E9'); // 有20種color，用陣列方式讀取，index超過19會變黑色
		var g3 = svg.selectAll('.g3').data(pie3).enter().append('g').attr('transform', 'translate(' + width*3/5 + ', ' + height/2 + ')');
		// g3.append('path')
		// 	.attr('d', (d) => arc3(d))
		// 	.attr('opacity', (d, i) => (i + 1) * 0.5)
		// 	.attr('fill', 'slategray'); // 有20種color，用陣列方式讀取，index超過19會變黑色

	}

	function piePlot2(){
		var dataset1 = [20, 80];
		var dataset2 = [45, 55];
		var dataset3 = [100];
		var $percentage = $('.roller-percentage');
		var width = $percentage.width();
		var height = width*2/3;
		var svg = d3.select('.roller-percentage').append('svg').attr('width', width).attr('height', height);
		var outer = height/2*0.8;
		var space = 14;
		var radius = { inner: outer - space, outer: outer};
		var radius2 = { inner: outer - space*2, outer: outer - space};
		var radius3 = { inner: outer - space*2, outer: outer};
		var pie = d3.pie()
					// .value((d) => d.count) // 設定value為dataset裡的什麼值，不加則dataset必須為資料的陣列
					// .sort(function(a, b) { return a.name.localeCompare(b.name); }) // 由dataset裡的某值做排序，不加則startAngle的順序會依value大到小排列
					// .sortValues((a, b) => a - b) // 依values的大小排列，與上行可擇一撰寫
					// .startAngle(() => 0) // 設定起始的角度，預設為0
					.endAngle(() => 1.25 * Math.PI) // 設定終止的角度，預設為2π
					// .padAngle(() => 0.03) // 設定arc之間的空隙，預設為0 (you can google "pie padding animation" for Mike's work)
					(dataset1);

		var pie2 = d3.pie()
					// .value((d) => d.count) // 設定value為dataset裡的什麼值，不加則dataset必須為資料的陣列
					// .sort(function(a, b) { return a.name.localeCompare(b.name); }) // 由dataset裡的某值做排序，不加則startAngle的順序會依value大到小排列
					// .sortValues((a, b) => a - b) // 依values的大小排列，與上行可擇一撰寫
					// .startAngle(() => 0) // 設定起始的角度，預設為0
					.endAngle(() => 1.25 * Math.PI) // 設定終止的角度，預設為2π
					// .padAngle(() => 0.03) // 設定arc之間的空隙，預設為0 (you can google "pie padding animation" for Mike's work)
					(dataset2);

		var pie3 = d3.pie()
					.startAngle(() => 1.25 * Math.PI)(dataset3);

		var arc = d3.arc()
					.innerRadius(radius.inner)
					.outerRadius(radius.outer);

		var arc2 = d3.arc()
					.innerRadius(radius2.inner)
					.outerRadius(radius2.outer);

		var arc3 = d3.arc()
					.innerRadius(radius3.inner)
					.outerRadius(radius3.outer);

		var g = svg.selectAll('.g1').data(pie).enter().append('g').attr('transform', 'translate(' + width*3/5 + ', ' + height/2 + ')');
		g.append('path')
			.attr('d', (d) => arc(d))
			.attr('opacity', (d, i) => (i + 1) * 0.5)
			.attr('fill', '#D351A1'); // 有20種color，用陣列方式讀取，index超過19會變黑色
		var g2 = svg.selectAll('.g2').data(pie2).enter().append('g').attr('transform', 'translate(' + width*3/5 + ', ' + height/2 + ')');
		g2.append('path')
			.attr('d', (d) => arc2(d))
			.attr('opacity', (d, i) => (i + 1) * 0.5)
			.attr('fill', '#E28BC0'); // 有20種color，用陣列方式讀取，index超過19會變黑色
		var g3 = svg.selectAll('.g3').data(pie3).enter().append('g').attr('transform', 'translate(' + width*3/5 + ', ' + height/2 + ')');
		// g3.append('path')
		// 	.attr('d', (d) => arc3(d))
		// 	.attr('opacity', (d, i) => (i + 1) * 0.5)
		// 	.attr('fill', 'slategray'); // 有20種color，用陣列方式讀取，index超過19會變黑色

	}

	function piePlot3(){
		var dataset1 = [20, 80];
		var dataset2 = [45, 55];
		var dataset3 = [100];
		var $temperature = $('.roller-temperature');
		var width = $temperature.width();
		var height = width*2/3;
		var svg = d3.select('.roller-temperature').append('svg').attr('width', width).attr('height', height);
		var outer = height/2*0.8;
		var space = 14;
		var radius = { inner: outer - space, outer: outer};
		var radius2 = { inner: outer - space*2, outer: outer - space};
		var radius3 = { inner: outer - space*2, outer: outer};
		var pie = d3.pie()
					// .value((d) => d.count) // 設定value為dataset裡的什麼值，不加則dataset必須為資料的陣列
					// .sort(function(a, b) { return a.name.localeCompare(b.name); }) // 由dataset裡的某值做排序，不加則startAngle的順序會依value大到小排列
					// .sortValues((a, b) => a - b) // 依values的大小排列，與上行可擇一撰寫
					// .startAngle(() => 0) // 設定起始的角度，預設為0
					.endAngle(() => 1.25 * Math.PI) // 設定終止的角度，預設為2π
					// .padAngle(() => 0.03) // 設定arc之間的空隙，預設為0 (you can google "pie padding animation" for Mike's work)
					(dataset1);

		var pie2 = d3.pie()
					// .value((d) => d.count) // 設定value為dataset裡的什麼值，不加則dataset必須為資料的陣列
					// .sort(function(a, b) { return a.name.localeCompare(b.name); }) // 由dataset裡的某值做排序，不加則startAngle的順序會依value大到小排列
					// .sortValues((a, b) => a - b) // 依values的大小排列，與上行可擇一撰寫
					// .startAngle(() => 0) // 設定起始的角度，預設為0
					.endAngle(() => 1.25 * Math.PI) // 設定終止的角度，預設為2π
					// .padAngle(() => 0.03) // 設定arc之間的空隙，預設為0 (you can google "pie padding animation" for Mike's work)
					(dataset2);

		var pie3 = d3.pie()
					.startAngle(() => 1.25 * Math.PI)(dataset3);

		var arc = d3.arc()
					.innerRadius(radius.inner)
					.outerRadius(radius.outer);

		var arc2 = d3.arc()
					.innerRadius(radius2.inner)
					.outerRadius(radius2.outer);

		var arc3 = d3.arc()
					.innerRadius(radius3.inner)
					.outerRadius(radius3.outer);

		var g = svg.selectAll('.g1').data(pie).enter().append('g').attr('transform', 'translate(' + width*3/5 + ', ' + height/2 + ')');
		g.append('path')
			.attr('d', (d) => arc(d))
			.attr('opacity', (d, i) => (i + 1) * 0.5)
			.attr('fill', '#A1D351'); // 有20種color，用陣列方式讀取，index超過19會變黑色
		var g2 = svg.selectAll('.g2').data(pie2).enter().append('g').attr('transform', 'translate(' + width*3/5 + ', ' + height/2 + ')');
		g2.append('path')
			.attr('d', (d) => arc2(d))
			.attr('opacity', (d, i) => (i + 1) * 0.5)
			.attr('fill', '#C0E28B'); // 有20種color，用陣列方式讀取，index超過19會變黑色
		var g3 = svg.selectAll('.g3').data(pie3).enter().append('g').attr('transform', 'translate(' + width*3/5 + ', ' + height/2 + ')');
		// g3.append('path')
		// 	.attr('d', (d) => arc3(d))
		// 	.attr('opacity', (d, i) => (i + 1) * 0.5)
		// 	.attr('fill', 'slategray'); // 有20種color，用陣列方式讀取，index超過19會變黑色

	}

	function getRandomData(){
		var x = ~~(Math.random()*32);
		var y = ~~(Math.random()*32);
		var f = ~~(Math.random()*256);
		if(dataset.length == datalength + 1){
			dataset.shift(); 
			g.selectAll('circle').filter((d, i) => i == 0).remove();
		}
		dataset.push({x: x, y: y, f: f});
		if(lineset.length == datalength){
			lineset.shift(); 
			g2.selectAll('path').filter((d, i) => i == 0).remove();
		}
		if(dataset.length > 1){
			var start = dataset[dataset.length-2];
			var end = dataset[dataset.length-1];
			lineset.push([start, end]);
		}
		
		scatterPlot();
		linePlot();
	}

	// piePlot();
	// piePlot2();
	// piePlot3();

	getRandomData();
	setInterval(getRandomData, duration);

	var win = $(window);
	// resize宣告多次導致失效，改用trigger
	win.resize(function(){
		win.trigger('window:resize');
	});

	win.on('window:resize', function(){
		var $scatter = $('.roller-scatter-chart');
		var width = $scatter.width();
		console.log(width);
		// scatterPlot();
	});

	win.on('window:resize', function(){
		var $scatter = $('.roller-scatter-chart');
		var width = $scatter.width();
		// linePlot();
	});

});
