$(function(){
	var linear = d3.scaleLinear()
					.domain([0, 500])
					.range([0, 100]); //domain, range 的數字數量需相等
	console.log(linear(50));
	console.log(linear.invert(50));
	console.log(linear.domain());
	console.log(linear.range());

	linear.domain([0, 50]);
	console.log(linear(50));

	linear.range([0, 10]);
	console.log(linear(33));
	linear.rangeRound([0, 10]); // 四捨五入range的值
	console.log(linear(33));

	console.log(linear(100));
	linear.clamp(true); // default is false, true for limited range
	console.log(linear(100));

	linear.nice([0.111111, 50.55555]); // 取理想的domain
	console.log(linear.domain());

	console.log(linear.ticks()); // default is 10, but it will set a value make sense. Most for axis
	console.log(linear.ticks(5)); // ticks 吐出分出的domain (針對domain)

	var tickFormat = linear.tickFormat(5, '+'); // 設定後，用法如function，還有 % or $ 等
	console.log(tickFormat(33));

	var pow = d3.scalePow().exponent(3)
				.domain([0, 3])
				.range([0, 90]);
	console.log(pow(1.5)); // domain 和餵的值先三次方，再做線性對應

	var linear = d3.scaleLinear()
					.domain([0, Math.pow(3, 3)])
					.range([0, 90]);
	console.log(linear(Math.pow(1.5, 3))); // 此線性等同上方pow

	var quantize = d3.scaleQuantize() // 連續區間對應到離散區間
					.domain([0, 10]) // domain不論數字有多少個，都只考慮頭尾
					.range(['red', 'green', 'blue', 'yellow', 'black']);

	console.log(quantize(1));
	console.log(quantize(3));
	console.log(quantize(5.999));
	console.log(quantize(6));

	var quantize = d3.scaleQuantize() 
					.domain([0, 50])
					.range(['#ff0000', '#ff3300', '#ff6600', '#ff9900', '#ffcc00']);
	var svg = d3.select('body').append('svg').attr('width', 500).attr('height', 500);
	var dataset = [5, 15, 25, 35, 45];
	svg.selectAll('circle').data(dataset.sort(d3.descending)).enter().append('circle')
		.attr('cx', 250).attr('cy', 250).attr('r', function(d){ return d;})
		.attr('fill', function(d){ return quantize(d);}).attr('opacity', 0.8);

	var qutile = d3.scaleQuantile()
					.domain([0, 2, 4, 10]) //每個數都會考慮，所以中間取3
					.range([1, 100]);
	console.log(qutile(2.9));
	console.log(qutile(3.1));

	var threshold = d3.scaleThreshold()
					.domain([10, 20, 30]) // 將數字為中斷點設區間
					.range(['red', 'green', 'blue', 'black']);
	console.log(threshold(5));
	console.log(threshold(15));
	console.log(threshold(25));
	console.log(threshold(33));
	console.log(threshold.invertExtent('red')); // invertExtent可以返回看區間	
	console.log(threshold.invertExtent('green'));
	console.log(threshold.invertExtent('blue'));
	console.log(threshold.invertExtent('black'));

	var ordinal = d3.scaleOrdinal() // 離散值對應離散值，v4.把 rangePoints 獨立成 scalePoint()
					.domain([1, 2, 3, 4, 5])
					.range([10, 20, 30, 40, 50]); 
	console.log(ordinal.range());

	// range = step*0.1 + st ep * (n-1) + step*0.1
	var point = d3.scalePoint() // v3. ordinal.rangePoints([0, 100], 5) => v4. scalePoint();
					.domain([1, 2, 3, 4, 5])
					.range([0, 100]); // rangeRound 取整數
	console.log(point(2));
	point.padding(.1); // defalt = 0
	console.log(point(2));

	// step = bandwidth + step*paddingInner
	// range = step*paddingOuter + step*(n-1) + bandwidth + step*paddingOuter
	var bands = d3.scaleBand() // v3. ordinal.rangeBands([0, 100], 5) => v4. scaleBands();
					.domain([1, 2, 3, 4, 5])
					.range([0, 100]); // it will be the start point of interval
	console.log(bands(2));
	bands.padding(.1); // both set paddingInner & paddingOuter
	console.log(bands(2));
	bands.paddingInner(.2);
	console.log(bands(2));
	bands.paddingOuter(.2);
	console.log(bands(2));

	var color = d3.scaleOrdinal(d3.schemeCategory10); // v3. d3.scaleCategory20() => v4. d3.scaleOrdinal(d3.schemeCategory10)
	var color1 = d3.scaleOrdinal(d3.schemeCategory20);
	var color2 = d3.scaleOrdinal(d3.schemeCategory20a);
	var color3 = d3.scaleOrdinal(d3.schemeCategory20b);
	svg.append('g').selectAll('circle').data(dataset.sort(d3.descending)).enter().append('circle')
		.attr('cx', 400).attr('cy', 250).attr('r', function(d){ return d;})
		.attr('fill', function(d){ return color(d);}).attr('opacity', 0.8);

	var xScale = d3.scaleLinear()
					.domain([0, 100])
					.range([0, 300]);
	var xPow = d3.scalePow().exponent(2).domain([0, 1]).range([0, 500]);
	var xLog = d3.scaleLog().domain([0.01, 1]).range([0, 500]);
	var axis = d3.axisBottom(xScale).ticks(5);
	var axis2 = d3.axisBottom(xScale).tickValues([30]);
	var axis3 = d3.axisBottom(xScale).tickSizeInner(2);
	var axis4 = d3.axisBottom(xScale).tickSize(12);
	var axis5 = d3.axisBottom(xPow);
	var axis6 = d3.axisBottom(xLog);
	// fix: innerTickSize => tickSizeInner
	// fix: outerTickSize => tickSizeOuter
	var gAxis = svg.append('g')
					.attr('transform','translate(100,300)').call(axis);
	var gAxis = svg.append('g')
					.attr('transform','translate(100,340)').call(axis2);
	var gAxis = svg.append('g')
					.attr('transform','translate(100,380)').call(axis3);
	var gAxis = svg.append('g')
					.attr('transform','translate(100,420)').call(axis4);
	var gAxis = svg.append('g')
					.attr('transform','translate(0,10)').call(axis5);
	var gAxis = svg.append('g')
					.attr('transform','translate(0,50)').call(axis6);
	// axis(gAxis);

	var center = [[0.5, 0.5], [0.7, 0.8], [0.4, 0.9], [0.11, 0.32], [0.88, 0.25], [0.75, 0.12], [0.5, 0.1], [0.2, 0.3], [0.4, 0.1], [0.6, 0.7]];
	var svg2 = d3.select('body').append('svg').attr('width', 500).attr('height', 500);
	var svg2g = svg2.append('g').attr('transform','translate(50,50)');
	var xScale = d3.scaleLinear().domain([0, 1]).range([0, 400]);
	var yScale = d3.scaleLinear().domain([0, 1]).range([400, 0]);
	svg2g.selectAll('circle').data(center).enter().append('circle')
		.attr('cx', function(d){ return xScale(d[0]);}).attr('cy', function(d){ return yScale(d[1]);})
		.attr('r', 4).attr('fill', 'steelblue');
	var xAxis = d3.axisBottom(xScale).tickValues(center.map(function(d){ return d[0];})).tickFormat(d3.format(".2f"));
	var yAxis = d3.axisLeft(yScale).tickValues(center.map(function(d){ return d[1];})).tickFormat(d3.format(".2f"));
	svg2g.append('g').attr('transform','translate(0,400)').call(xAxis); 
	svg2g.append('g').call(yAxis); 
});