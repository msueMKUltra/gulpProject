$(function(){
	var $rollerList = $('.roller-list');
	var $rollerTaiwan = $('.roller-taiwan');
	var $rollerForein = $('.roller-forein');
	var $rollerMap = $('.roller-map');

	var $gameTaiwan = $('.roller-game-taiwan');
	var $gameAsia = $('.roller-game-asia');
	var $gameAmerica = $('.roller-game-america');
	var $gameEurope = $('.roller-game-europe');

	// 比賽資訊動畫
	//=====================
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
	//=====================

	// 揪團d3 start=====================
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
		cardRendering('.roller-svg-001', cardData001);
		cardRendering('.roller-svg-002', cardData002);
		cardRendering('.roller-svg-003', cardData003);
		cardRendering('.roller-svg-004', cardData004);
	}

	var win = $(window);
	// resize宣告多次導致失效，改用trigger
	win.resize(function(){
		win.trigger('window:resize');
	});

	var cardTrigger = true;
	var listTrigger = true;

	function watchScroll( $zone, $trigger, $drawing){
		var zoneTop = $zone.offset().top - 100;
		var docTop = $(document).scrollTop();
		var zoneHeight = $zone.height() + 200;
		if($trigger){			
			if(docTop >= zoneTop){
				$drawing();
				$trigger = false;
			}
		}else{
			if(docTop < zoneTop || docTop > zoneTop + zoneHeight){
				$trigger = true;
			}
		}
		return $trigger;		
	}

	win.scroll(function(){
		cardTrigger = watchScroll($('.roller-card-zone'), cardTrigger, cardDrawing);
		listTrigger = watchScroll($('.roller-list-zone'), listTrigger, listDrawing);
	});

	cardDrawing();

	win.on('window:resize', function(){
		cardDrawing();
	});

	function cardRendering($class, $data){

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
				.attr('fill', 'skyblue')
				.attr('x', function(d){ return linear.width(d.month) + padding.left})
				.attr('y', svg.height - padding.bottom)
				.attr('width', linear.width.bandwidth())
				.attr('height', 0)
				.transition()
				.duration(600)
				.ease(d3.easeSin)
				.delay( (d, i) => i * 200)
				.attr('y', function(d){
					return linear.height(d.people) + padding.top;
				})
				.attr('height', function(d){
					return svg.height - padding.top - padding.bottom - linear.height(d.people);
				});

		var text = cardSvg.selectAll('text')
				.data(dataset)
				.enter()
				.append('text')
				.attr('fill', 'deepskyblue')
				.attr('font-size', '10px')
				.attr('text-anchor', 'middle')
				.attr('opacity', 0)
				.attr('x', function(d){ return linear.width(d.month) + padding.left; })
				.attr('y', function(d){ return linear.height(d.people) + padding.top; })
				.attr('dx', linear.width.bandwidth() / 2)
				.attr('dy', -4)
				// .classed('roller-text-shadow', true)
				.text(function(d){
					return d.people;
				})
				.transition()
				.duration(400)
				.delay( (d, i) => 400 + (i * 200))
				.attr('opacity', 1);

		cardSvg.append('g').call(d3.axisBottom(linear.width))
			.attr('transform', 'translate(' + padding.left + ',' + (svg.height - padding.bottom) + ')');

		cardSvg.append('g').call(d3.axisLeft(linear.height).ticks(3).tickFormat(function(d){return d+'人';}))
			.attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');	
	}
	// 揪團d3 end=====================

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

	// 比賽資訊d3 start=====================
	var listData = [
					{
						id: '001',
						// total: 12,
						data:[{sportType: 'Running', gameCount: 10}, {sportType: 'Swimming', gameCount: 6}, {sportType: 'Cycling', gameCount: 17}] },
					{
						id: '002',
						// total: 99,
						data:[{sportType: 'Running', gameCount: 50}, {sportType: 'Swimming', gameCount: 77}, {sportType: 'Cycling', gameCount: 43}]
					},
					{
						id: '003',
						// total: 54,
						data:[{sportType: 'Running', gameCount: 81}, {sportType: 'Swimming', gameCount: 71}, {sportType: 'Cycling', gameCount: 69}]
					},
					{
						id: '004',
						// total: 22,
						data:[{sportType: 'Running', gameCount: 4}, {sportType: 'Swimming', gameCount: 7}, {sportType: 'Cycling', gameCount: 15}]
					}
				];

	var listZone = d3.select('.roller-list-zone');

	function getListData(array, id){
		var map = d3.map(array, function(d){ return d.id; }); // 定義map的key值為id
		var mapFromId = map.get(id); // 利用id找出對應的object
		var sum = 0;
		mapFromId.data.map(function(d){ // 針對data裡的array去做map
			sum += d.gameCount; // 計算總和
		});
		var mapId = d3.map(mapFromId); // 將id取得的object去做map
		mapId = mapId.set('total', sum); // 設定total的值
		var start = 0;
		var angle = [];
		mapFromId.data.map(function(d){
			var end = start + d.gameCount; // 計算angle需累加
			angle.push({
				startAngle: Math.PI * start/sum * 2, endAngle: Math.PI * end/sum * 2 // 圓圈角度為0~2π
			});
			start = end; // 設下一次累加的起點
		});
		mapId = mapId.set('angle', angle); // 設定angle的值
		var object = {};
		mapId.each(function(key, value){ // 把map的資料轉回object
			object[value] = key;
		})
		return object;
	}

	var listData001 = getListData(listData, '001');
	var listData002 = getListData(listData, '002');
	var listData003 = getListData(listData, '003');
	var listData004 = getListData(listData, '004');

	listDrawing();

	function listDrawing(){
		listRendering('.roller-svg-001', listData001);
		listRendering('.roller-svg-002', listData002);
		listRendering('.roller-svg-003', listData003);
		listRendering('.roller-svg-004', listData004);
	}

	function listRendering($class, $data){
		var svg = {width: 200, height: 100};
		var padding = {top: 10, bottom: 10, left: 12, right: 20};
		var radius = {inner: 0, outer: (svg.height - padding.top - padding.bottom)/2};
		var tag = {width: 12, height: 12};
		var listClass = listZone.select($class);
		listClass.selectAll('*').remove();
		var listSvg = listClass.append('svg').attr('width', svg.width).attr('height', svg.height);

		var dataset = $data.angle;

		var datacount = $data.data.map(function(d){ return d.gameCount});

		var datatype = $data.data.map(function(d){ return d.sportType});

		var arcPath = d3.arc() // v3. d3.svg.arc() => v4. d3.arc()
						.innerRadius(radius.inner)
						.outerRadius(radius.outer);

		var color = d3.scaleOrdinal(d3.schemeCategory10); // v3. d3.scale.category10() => v4. d3.scaleOrdinal(d3.schemeCategory10)

		var range = d3.range(datacount.length);

		var ordinal = d3.scaleOrdinal() // v3. d3.scale.ordinal() => v4. d3.scaleOrdinal()
						.domain(range)
						.range(['#E4B54E', '#96CFDB', '#D1427F']);

		listSvg.append('text')
				.attr('x', svg.width)
				.attr('y', svg.height)
				.attr('text-anchor', 'end')
				.attr('fill', 'white')
				.text('本月參與人次')
				.classed('roller-text-shadow', true)
				.attr('transform', 'translate( -10, -10)');


		var listCircle = listSvg.append('g').classed('cilcle', true);

		listCircle.selectAll('path')
				.data(dataset)
				.enter()
				.append('path')
				.attr('transform','translate(' + (padding.left + radius.outer) + ',' + (padding.top + radius.outer) + ')')
				.attr('d', function(d){ return arcPath(d); })
				// .attr('stroke', 'transparent')
				// .attr('stroke-width', '3px')
				.attr('fill', function(d, i){return ordinal(i);})
				.attr('opacity', 0)
				.transition()
				.duration(1000)
				.ease(d3.easeSin)
				.delay( (d, i) => 500 * i)
				.attr('opacity', 0.6);

		listCircle.selectAll('text')
				.data(dataset)
				.enter()
				.append('text')
				.attr('text-anchor', 'middle')
				.attr('fill', 'white')
				.attr('font-size', '10px')
				.attr('y', 4)
				.attr('transform', function(d){
					return 'translate(' + (padding.left + radius.outer) + ',' + (padding.top + radius.outer) + ')' +
							'translate(' + arcPath.centroid(d) + ')';
				})
				.data(datacount)
				.text(function(d){ return d; })
				.attr('opacity', 0)
				.transition()
				.duration(1200)
				.ease(d3.easeSin)
				.delay( (d, i) => 500 * i)
				.attr('opacity', 1);

		var listTag = listSvg.append('g').classed('tag', true);

		listTag.selectAll('rect')
				.data(dataset)
				.enter()
				.append('rect')
				.attr('width', tag.width)
				.attr('height', tag.height)
				.attr('x', radius.outer*3 - 12)
				.attr('y', function(d, i){
					return 20 * i + padding.top;
				})
				.attr('fill', function(d, i){return ordinal(i);})
				.attr('opacity', 0)
				.transition()
				.duration(1000)
				.ease(d3.easeSin)
				.delay( (d, i) => 500 * i)
				.attr('opacity', 0.7);

		listTag.selectAll('text')
				.data(datatype)
				.enter()
				.append('text')
				.attr('font-size', '12px')
				.attr('fill', 'white')
				.attr('x', radius.outer*3 - 12)
				.attr('y', function(d, i){
					return 20 * i + padding.top;
				})
				.attr('transform', 'translate(' + (tag.width + 4) + ',' + (tag.height - 2) + ')')
				.text(function(d){ return d; })
				.attr('opacity', 0)
				.transition()
				.duration(1200)
				.ease(d3.easeSin)
				.delay( (d, i) => 500 * i)
				.attr('opacity', 1);
				
	}
	// 比賽資訊d3 end=====================


	// 新手教學d3 start=====================
	var jumbotronZone = d3.select('.roller-jumbotron-zone .roller-svg');

	function map(width, height, json, shp, x, y, scale){
		this.svg = {width: width, height: height};
		this.files = {json: json, shp: shp};
		this.projection = {center: [ x, y], scale: scale};
	}

	var map001 = new map(300, 400, 'map/taiwan/taiwan.json', 'COUNTY_MOI_1060525', 124, 23.3, 6000);
	var map002 = new map(600, 400, 'map/world/world.json', 'ne_110m_admin_0_countries_lakes', 120, 20, 90);

	map001.btn = [{title: '北部據點', content: '大佳河濱公園', x: 40, y: -150}, {title: '中部據點', content: '圳前仁愛公園', x: -50, y: -30}, {title: '南部據點', content: '巴克禮紀念公園', x: -70, y: 80}, {title: '東部據點', content: '台東森林公園', x: 50, y: 50}];
	map002.btn = [{title: '北美洲據點', content: '黃石國家公園', x: -200, y: -40}, {title: '南美洲據點', content: '泰羅那國家公園', x: -110, y: 90}, {title: '歐洲據點', content: '迷你歐洲公園', x: 10, y: -10}, {title: '非洲據點', content: '克留格爾國家公園', x: 40, y: 100}, {title: '亞洲據點', content: '張家界國家森林公園', x: 150, y: 20}, {title: '大洋洲據點', content: '努沙國家公園', x: 220, y: 120}];
	// map002.btn = [{title: ,content: ''}, {title: ,content: ''}, {title: ,content: ''}, {title: ,content: ''}, {title: ,content: ''}, {title: ,content: }];

	function topoJsoning(object){
		// http://blog.infographics.tw/2015/04/visualize-geographics-with-d3js/
		d3.json(object.files.json, function(topodata) {
			var features = topojson.feature(topodata, topodata.objects[object.files.shp]).features; // 這裡要注意的是 topodata.objects["county"] 中的 "county" 為原本 shp 的檔名
			var projection = d3.geoMercator().center(object.projection.center).scale(object.projection.scale); // 座標變換函式 v3. d3.geo.mercator() => v4. d3.geoMercator()
			var path = d3.geoPath().projection(projection); // 路徑產生器 v3. d3.geo.path() => v4. d3.geoPath()
			var mapSvg = jumbotronZone.append('svg')
							.attr('width', object.svg.width)
							.attr('height', object.svg.height);

			//若roller-map的寬度小於svg時，縮小svg大小做rwd
			function mapResizing(){
				var rollerMap = $('.roller-map');
				var width = rollerMap.width() - 30;
				var percent = width/object.svg.width;
				percent = percent > 1 ? 1 : percent;
				mapSvg.attr('transform', 'scale(' + percent + ')');
				var btn = jumbotronZone.selectAll('button');
				if(!btn.empty()){
					btn.data(object.btn)
					.style('transform', function(d){ return 'translate(' + (d.x * percent) + 'px,' + (d.y * percent) + 'px)';});		
				}
				return percent;
			}

			// 劃地圖
			function mapDrawing(){
				mapSvg.selectAll("path")
					.data(features)
					.enter()
					.append("path")
					.attr("d", path);

				var percent = mapResizing();

				jumbotronZone
					.selectAll('button')
					.data(object.btn)
					.enter()
					.append('button')
					.attr('class', 'roller-point btn btn-lg btn-primary rounded-circle')
					.attr('type', 'button')
					.attr('data-toggle', 'popover')
					.attr('data-placement', 'top')
					.attr('title', function(d){ return d.title;})
					.attr('data-content', function(d){ return d.content;})
					.transition()
					.duration(2000)
					.style('transform', function(d){ return 'translate(' + (d.x * percent) + 'px,' + (d.y * percent) + 'px)';});

				$('[data-toggle="popover"]').popover();
			}

			mapDrawing();

			// 當視窗大小改變時，做rwd
			win.on('window:resize', function(){
				mapResizing();
			});
	    });
	}

	topoJsoning(map001);

	//tab切換時，顯示對應的地圖
    $rollerTaiwan.click(function(){
    	if(!$(this).find('a').hasClass('active')){
    		$('[data-toggle="popover"]').popover('hide');
    		jumbotronZone.selectAll('*').remove();
			topoJsoning(map001);
    	}
    });
    $rollerForein.click(function(){
    	if(!$(this).find('a').hasClass('active')){
    		$('[data-toggle="popover"]').popover('hide');
    		jumbotronZone.selectAll('*').remove();
			topoJsoning(map002);
    	}
    });

	// 新手教學d3 end=====================


	// 留言區d3 start=====================
	var $inputName = $('#inputName');
	var $inputEmail = $('#inputEmail');
	var $selectSubject = $('#selectSubject');
	var $textareaMessage = $('#textareaMessage');
	var $inputCheck = $('#inputCheck');
	var $buttonSubmit = $('#buttonSubmit');

	$buttonSubmit.click(function(e){
		e.preventDefault();
		checkInput($inputName);
		checkInput($inputEmail);
		checkInput($textareaMessage);
		checkCheck($inputCheck);
		checkSelect($selectSubject);
	});

	function checkInput($id){
		var check = $id.val() != '' ? true : false;
		addTips($id, check);
	}

	function checkSelect($id){
		var check = $id.find('option:selected').index() != 0 ? true : false;
		addTips($id, check);
	}
	
	function checkCheck($id){
		var check = $id.prop('checked');
		addTipForCheck($id, check)
	}

	function addTips($id, $boolean){
		var icon = document.createElement('i');
		if($boolean){
			$id.siblings('.roller-label').empty().append(icon).find('i').addClass('fa fa-thumbs-o-up')
				.closest('.roller-tip').addClass('has-success').removeClass('has-danger');
		}else{
			$id.siblings('.roller-label').empty().append(icon).find('i').addClass('fa fa-hand-o-left')
				.closest('.roller-tip').addClass('has-danger').removeClass('has-success');
		}
	}

	function addTipForCheck($id, $boolean){
		var icon = document.createElement('i');
		var $tip = $id.closest('.roller-tip');
		var $finger = $tip.find('i');
		$finger.remove();
		if($boolean){
			$tip.prepend(icon).find('i').addClass('custom-control mr-1 fa fa-thumbs-o-up')
				.end().removeClass('has-danger');
		}else{
			$tip.prepend(icon).find('i').addClass('custom-control mr-1 fa fa-hand-o-right')
				.end().addClass('has-danger');
		}
	}	
	// 留言區d3 end=====================

});