$(function(){
	var box = d3.select('div').classed('box'); // true (jq. hasClass)
	var box2 = d3.select('div').classed('box2'); // false (jq. hasClass)
	var box3 = d3.select('div').classed('box3 box4', true); // (jq. addClass)
	var box4 = d3.select('div').classed('box3', false); // (jq. removeClass)
	console.log(box);
	console.log(box2);
	console.log(box3);
	console.log(box4);
	
	var box5 = d3.select('.box').append('p').node(); // <p></p>
	var box6 = d3.select('.box').append('p').empty(); // false
	var box7 = d3.selectAll('.box p').size(); // 2 (不要用到.select，不然永遠是1)
	console.log(box5);
	console.log(box6);
	console.log(box7);

	var box8 = d3.select('.box').append('input');
	var box9 = box8.property('value', 'prop'); // 設定vlaue 要用property，不是attr
	var box10 = box8.property('value'); // 取vlaue 要用property，不是attr
	console.log(box9);
	console.log(box10);

	var box11 = d3.select('.box').append('p').classed('boxP', true).text('<span>xxx</span>');

	var box12 = d3.select('.box').append('p').classed('boxP2', true).html('<span class="span">xxx</span>');

	box12.insert('div', '.span'); // 設第二個參數為insertBefore，不設等於append
	box12.remove();

	var dataset = [
		{date: 'today', time: 'now'},
		{date: 'yesterday', time: 'recently'},
		{date: 'tomorrow', time: 'future'}
	];

	var datumset = dataset[0].date;

	var box13 = d3.select('body').append('ul'); // append元素之後，相當於選擇此元素
	box13.append('li').datum(datumset).text(function(d){ return d;});
	console.log(box13);

	d3.selectAll('.list li').datum(datumset).text(function(d){ return d;}); // datum的資料只能餵一筆，非object

	var map = d3.map(dataset, function(d){ return d.date;});

	var has = map.has('today');
	var get = map.get('today');
	console.log(has);
	console.log(get);

	map.set('today', {xxx:'xxx'}); // 利用鍵去設定值
	console.log(map.get('today')); // 鍵和值是分開的，所以資料還是取得到

	var entries = map.entries(); // 列出所有鍵和值，等於object = key: ..., value: ...
	console.log(entries);
	var keys = map.keys(); // 則是取出上面object的key
	console.log(keys);
	var values = map.values(); // 取出object的value
	console.log(values);

	map.each(function(d, i){ // d = value, i = key
		console.log(d);
		console.log(i);
	});

	var svg = { width: 1000, height: 200, data:[], count: 10};
	var svgBar = d3.select('body').append('svg').attr('width', svg.width).attr('height', svg.height);
	var rect = { width: 50, step: 10}

	for (var i =  svg.count - 1; i >= 0; i--) {
		var random = Math.floor(Math.random()*100);
		svg.data.push(random);
	}

	drawBar();

	$('.roller-add').click(function(){
		addBar();
		drawBar();
	});

	$('.roller-sort').click(function(){
		sortBar();
		drawBar();
	});

	function drawBar(){

		d3.selectAll('.bar').remove();

		var barUpdate = svgBar.selectAll('g').data(svg.data);

		var barEnter = barUpdate.enter();

		var barExit = barUpdate.exit();

		barEnter.append('g').classed('bar', true).append('rect')
			.attr('x', function(d, i){
				return i * (rect.width + rect.step);
			})
			.attr('y', function(d){
				return svg.height;
			})
			.attr('width', rect.width)
			.attr('height', svg.height)
			.transition()
			.duration(500)
			.delay(function(d, i){ return 200*i;})
			.attr('y', function(d){
				return svg.height - d;
			})
			.attr('height', function(d){ return d;})
			.attr('fill', 'steelblue');

		d3.selectAll('.bar').data(svg.data).append('text')
			.attr('x', function(d, i){
				return i * (rect.width + rect.step);
			})
			.attr('y', function(d){
				return svg.height - d;
			})
			.attr('dx', rect.width/2)
			.attr('dy', -20)
			.attr('font-size', '14px')
			.attr('text-anchor', 'middle')
			.transition()
			.duration(500)
			.delay(function(d, i){ return 200 * (i + 1);})
			.text(function(d){ return d;});
	}

	function addBar(){
		var random = Math.floor(Math.random()*100);
		svg.data.push(random);
	}

	function sortBar(){
		svg.data.sort(d3.ascending);
	}

});