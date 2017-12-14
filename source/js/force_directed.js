$(function(){					
	d3.queue()
	.defer(d3.json, "./files/gooee/name_map.json")
	.defer(d3.json, "./files/gooee/data_B.json")
	.awaitAll(forceDirected);

	function forceDirected(error, files){
		if(error) throw error;

		var plot = {width: 500, height: 500};
		var svg = d3.select('body').append('svg').attr('width', plot.width).attr('height', plot.height);

		var name_map = files[0];
		var data_B = files[1];

		var nodes = [];
		var edges = [];

		for(var key in name_map){
			nodes.push({
				code: key,
				name: name_map[key],
				index: nodes.length // 利用length來設定index，表示用在edges的node序號
			});
		}

		var map = d3.map(nodes, (d) => d.code);

		for(var i = 0; i < data_B.length ; i++){
			var start = data_B[i].start;
			var end = data_B[i].end;
			var count = data_B[i].count;
			var source = map.get(start).index;
			var target = map.get(end).index;

			// edges的陣列，物件預設source、target來表示nodes的序號
			edges.push({
				source: source, target: target, count: count
			})
		}

		var charge = d3.forceManyBody().strength(-1000);
		var center = d3.forceCenter(plot.width / 2, plot.height / 2);

		var link = d3.forceLink(edges);
					// .id((d) => d.name); // 如果 edges 的 source & target 是用node的name來設定的話

		var simulation = d3.forceSimulation(nodes)
							.force('charge', charge)
							.force('center', center)
							.force('links', link);

		// simulation.nodes(nodes); // d3.forceSimulation(nodes) -> 括號的nodes沒加，則要加這行把資料抓進來
		// simulation.force('links').links(edges); // d3.forceLink(edges) -> 括號的edges沒加，則要加這行把資料抓進來

		simulation.on('tick', ticked);

		var lines = svg.selectAll('.forceLine')
						.data(edges)
						.enter()
						.append('line')
						.classed('forceLine', true)
						.attr('stroke', 'slategray');

		var color = d3.schemeCategory20b;

		var circles = svg.selectAll('.forceCircle')
							.data(nodes)
							.enter()
							.append('circle')
							.attr('class', 'forceCircle')
							.attr('r', 20)
							.style('fill', (d, i) => color[i]);

		var texts = svg.selectAll('.forceText')
							.data(nodes)
							.enter()
							.append('text')
							.attr('class', 'forceText')
							.style('fill', 'ivory')
							.attr('text-anchor', 'middle')
							.attr('dy', '.35rem')
							.text( d => d.name);

		function ticked(){
			lines.attr("x1", d => d.source.x)
				.attr("y1", d => d.source.y)
				.attr("x2", d => d.target.x)
				.attr("y2", d => d.target.y);
			circles.attr('cx', d => d.x)
				.attr('cy', d => d.y);
			texts.attr('x', d => d.x)
				.attr('y', d => d.y);
		}

		// setTimeout(function(){
		// 	simulation.stop(); // 讓圖靜止
		// }, 200);

		// setTimeout(function(){
		// 	simulation.restart(); // 圖的引力恢復
		// }, 2000);

		var drag = d3.drag()
						.on('start', dragStarted)
						.on('drag', dragged)
						.on('end', dragEnded);

		function dragStarted(d){
			// d3.event 為當前觸發的事件，active => 0為尚未執行，1為執行中
			console.log(d3.event.active); // 0 
			if(!d3.event.active) simulation.alphaTarget(0.3).restart();

			circles.each(d => {
				d.fx = null; // 用來移動時，將每個點預設為原本會動狀態
 				d.fy = null; // 用來移動時，將每個點預設為原本會動狀態
			});

			d.fx = d.x; // 開始時，設定移動點的位置為當前位置
        	d.fy = d.y; // 開始時，設定移動點的位置為當前位置
		}
		function dragged(d){
			console.log(d3.event.active); // 1
			d3.select(this).style('fill', 'gold');
			d.fx = d3.event.x; // 拖曳時，設定移動點的位置為滑鼠的位置
        	d.fy = d3.event.y; // 拖曳時，設定移動點的位置為滑鼠的位置
		}
		function dragEnded(d, i){
			console.log(d3.event.active); // 0
			if(!d3.event.active) simulation.alphaTarget(0);
			d3.select(this).style('fill', color[i]);
			// d.fx = null; // 結束時，設為null，則會恢復成預設狀態
 			// d.fy = null; // 結束時，設為null，則會恢復成預設狀態
		}

		circles.call(drag);

		console.log(nodes);
		console.log(edges);

	}
});