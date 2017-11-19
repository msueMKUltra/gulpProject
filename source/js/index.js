$(function(){

	$('[data-toggle="popover"]').popover();

	var $rollerList = $('.roller-list');
	var $rollerTaiwan = $('.roller-taiwan');
	var $rollerForein = $('.roller-forein');
	var $rollerMap = $('.roller-map');

	var $gameTaiwan = $('.roller-game-taiwan');
	var $gameAsia = $('.roller-game-asia');
	var $gameAmerica = $('.roller-game-america');
	var $gameEurope = $('.roller-game-europe');

	$rollerList.hover(function(){
		$rollerList.removeClass('col-md-6 col-md-2 col-md-3');
		$(this).addClass('col-md-6')
			.siblings('.roller-list').addClass('col-md-2');
	},function(){
		$rollerList.removeClass('col-md-6 col-md-2').addClass('col-md-3');
	});


	function listGroupItemHover($target, $class){
		$target.find('li').hover(function(){
			$(this).addClass($class);
		},function(){
			$(this).removeClass($class);
		})		
	}

	listGroupItemHover($gameTaiwan, 'list-group-item-warning');
	listGroupItemHover($gameAsia, 'list-group-item-danger');
	listGroupItemHover($gameAmerica, 'list-group-item-info');
	listGroupItemHover($gameEurope, 'list-group-item-success');

	// $rollerTab.click(showMap($(this)));

	// showMap();

	// function showMap($click){
	// 	$mapTaiwan.hide();
	// 	$mapForein.hide();
	// 	if($click.hasClass('active')){
	// 		$mapTaiwan.show();
	// 	}else if($click.hasClass('active')){
	// 		$mapForein.show();
	// 	}				
	// }

	var cardData = [
					{
						id: '001',
						// total: 12,
						data:[{month: 'Aug', people: 10}, {month: 'Sep', people: 6}, {month: 'Oct', people: 17}, {month: 'Nov', people: 12}] },
					{
						id: '002',
						// total: 99,
						data:[{month: 'Aug', people: 50}, {month: 'Sep', people: 77}, {month: 'Oct', people: 43}, {month: 'Nov', people: 99}]
					},
					{
						id: '003',
						// total: 54,
						data:[{month: 'Aug', people: 81}, {month: 'Sep', people: 71}, {month: 'Oct', people: 69}, {month: 'Nov', people: 54}]
					},
					{
						id: '004',
						// total: 22,
						data:[{month: 'Aug', people: 4}, {month: 'Sep', people: 7}, {month: 'Oct', people: 15}, {month: 'Nov', people: 22}]
					}
				];

	function getCardData(array, id){
		var map = d3.map(array, function(d){ return d.id; }); // 定義map的key值為id
		var mapFromId = map.get(id); // 利用id找出對應的object
		return mapFromId;
	}

	var cardData001 = getCardData(cardData, '001');
	var cardData002 = getCardData(cardData, '002');
	var cardData003 = getCardData(cardData, '003');
	var cardData004 = getCardData(cardData, '004');

	function cardDrawing(){		
		rendering('.roller-svg-001', cardData001);
		rendering('.roller-svg-002', cardData002);
		rendering('.roller-svg-003', cardData003);
		rendering('.roller-svg-004', cardData004);
	}

	var win = d3.select(window);

	cardDrawing();

	win.on('resize', cardDrawing);

	function rendering($class, $data){

		var dataset = $data.data;

		var rpw = $('.roller-piece').eq(2).width();
		var rpp = 30; 

		var svg = {width: rpw - rpp, height: 100};

		var card = d3.select('.roller-card-zone').select($class);

		card.selectAll('*').remove();

		var cardSvg = card.append('svg')
						.attr('width', svg.width)
						.attr('height', svg.height);

		// var map = d3.map(dataset, function(d){ return d.month; });
		// map.each(function(key, value){ // v3. forEach => v4. each
		// 	console.log(key);
		// 	console.log(value);
		// });
		// console.log(map.values());

		var month = dataset.map(function(d){ return d.month;});
		var people = dataset.map(function(d){ return d.people;});
		var dataMax = d3.max(people);

		var padding = { top: 14, right: 20, bottom:20, left: 40};
		var rect = { step: 35, width: 30};


		var linear = {
			width: d3.scaleBand() 
						.domain(month)
						.range([ 0, svg.width - padding.left - padding.right])
						.padding(.5),
			height: d3.scaleLinear() // v3. scale.linear() => v4. scaleLinear()
						.domain([0, dataMax])
						.range([svg.height - padding.top - padding.bottom, 0])
		};

		var bar = cardSvg.selectAll('rect')
				.data(dataset)
				.enter()
				.append('rect')
				.attr('fill', 'steelblue')
				.attr('x', function(d){ return linear.width(d.month) + padding.left})
				.attr('y', function(d){
					return linear.height(d.people) + padding.top;
				})
				.attr('width', linear.width.bandwidth())
				.attr('height', function(d){
					return svg.height - padding.top - padding.bottom - linear.height(d.people);
				});


		var text = cardSvg.selectAll('text')
				.data(dataset)
				.enter()
				.append('text')
				.attr('fill', 'steelblue')
				.attr('font-size', '10px')
				.attr('text-anchor', 'middle')
				.attr('x', function(d){ return linear.width(d.month) + padding.left; })
				.attr('y', function(d){ return linear.height(d.people) + padding.top; })
				.attr('dx', linear.width.bandwidth() / 2)
				.attr('dy', -4)
				.text(function(d){
					return d.people;
				});

		cardSvg.append('g').call(d3.axisBottom(linear.width))
			.attr('transform', 'translate(' + padding.left + ',' + (svg.height - padding.bottom) + ')');

		cardSvg.append('g').call(d3.axisLeft(linear.height).ticks(3).tickFormat(function(d){return d+'人';}))
			.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');	
	}

	// 在未知資料長度的情況下
	// var update = cardSvg.data(cardData); // 綁定資料後，即為update的部分(元素對應資料)
	// var enter = update.enter(); // 取出enter的部分(元素小於資料)
	// var exit = update.exit(); // 取出exit的部分(元素大於資料)

	// update.text(function(d){ return d;}); // update資料可直接寫入
	// enter.append('p')
	// 	.text(function(d){ return d;}); // enter先append元素，再寫入資料
	// exit.remove(); // exit直接刪除元素

	// var linear = d3.scaleLinear() // v3. scale.linear() => v4. scaleLinear()
	// 				.domain([0, rect.step * (dataset.length - 1) + rect.width + padding.left + padding.right])
	// 				.range([0, 100]);



	// this is v3.
	// var axis = d3.cardSvg.axis()
	// 			.scale(linear.width)
	// 			.orient('bottom');
	// var gAxis = cardSvg.append('g');
	// axis(gAxis);

	// var axis = d3.axisBottom(linear.width);
	// var gAxis = cardSvg.append('g');
	// axis(gAxis);

	// d3.axisBottom(linear.width)(cardSvg.append('g'));

		// console.log(linear(100));
		// console.log(linear.invert(100));
		// console.log(linear.domain());
		// console.log(linear.range());

		// linear.domain([10, 450]);
		// linear.range([50, 200]);

		// console.log(linear(100));
		// console.log(linear.invert(100));
		// console.log(linear.domain());
		// console.log(linear.range());

		// linear.domain([9.99, 450.111]);
		// linear.nice();
		// linear.rangeRound([50, 200]);

		// console.log(linear(100));
		// console.log(linear.invert(100));
		// console.log(linear.domain());
		// console.log(linear.range());
		// console.log(linear.ticks(5));

		//rwd reference
		//https://kuro.tw/posts/2015/12/20/use-d3js-to-create-responsive-histogram/
		//==================
		// var svg = d3.select('.svg');

		// // 將繪製動作包裝至 function 內
		// function rendering() {
		//    // 將繪製的程式碼通通搬到裡面
		//    // 內略
		// }

		// // 將 window 綁定 resize 事件，並重新繪製圖型
		// d3.select(window).on('resize', rendering);

		// // 首次繪製
		// rendering();
		//==================

	var listSvg = d3.select('.roller-list-zone').selectAll('.roller-svg svg');

	listSvg.style('width', '100%')
		.style('height', '200px');

	var mapSvg = d3.select('.roller-jumbotron-zone').selectAll('.roller-svg svg');

	mapSvg.style('width', '100%')
		.style('height', '200px');
})