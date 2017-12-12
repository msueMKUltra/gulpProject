$(function(){					
	d3.queue()
	.defer(d3.json, "./files/gooee/name_map.json")
	.defer(d3.json, "./files/gooee/data_C.json")
	.awaitAll(pieChart);

	function pieChart(error, files){
		if(error) throw error;
		var name_map = files[0];
		var data_C = files[1];
		var dataset = [];

		for(var key in name_map){
			dataset.push({
				code: key,
				name: name_map[key]
			});
		}

		var map = d3.map(dataset, (d, i) => d.code);

		for(var key in data_C){
			map.get(key).count = data_C[key];
		}

		var plot = { width: 700, height: 700};
		var radius = { inner: 10, outer: 180};

		var svg = d3.select('body').append('svg')
					.attr('width', plot.width)
					.attr('height', plot.height);

		var arcs = d3.pie()
					.value((d) => d.count) // 設定value為dataset裡的什麼值，不加則dataset必須為資料的陣列
					.sort(function(a, b) { return a.name.localeCompare(b.name); }) // 由dataset裡的某值做排序，不加則startAngle的順序會依value大到小排列
					.sortValues((a, b) => a - b) // 依values的大小排列，與上行可擇一撰寫
					.startAngle(() => 0) // 設定起始的角度，預設為0
					.endAngle(() => 2 * Math.PI) // 設定終止的角度，預設為2π
					.padAngle(() => 0.03) // 設定arc之間的空隙，預設為0 (you can google "pie padding animation" for Mike's work)
					(dataset);

		var arc = d3.arc()
					.innerRadius(radius.inner)
					.outerRadius(radius.outer);

		var color = d3.schemeCategory20c; // google Colours (v4) for color category & other

		var g = svg.selectAll('g').data(arcs).enter().append('g').attr('transform', 'translate(' + plot.width/2 + ',' + plot.height/2 + ')');

		g.append('path')
			.attr('d', (d) => arc(d))
			.attr('fill', (d, i) => color[i]); // 有20種color，用陣列方式讀取，index超過19會變黑色

		g.append('text')
			.attr('x', (d) => arc.centroid(d)[0] * 1.4) // 可以乘上數字0~2(圓心到圓周)
			.attr('y', (d) => arc.centroid(d)[1] * 1.4) // 可以乘上數字0~2(圓心到圓周)
			.attr('text-anchor', 'middle')
			.text((d) => {
				var value = d.value;
				var sum = d3.sum(arcs, (d) => d.value); // d3累加函數 (very good)
				var percent = value / sum * 100;
				return percent.toFixed(2) + '%'; // toFixed 可以設定要到小數點幾位 (also very good)
			});

		g.append('line')
			.attr('x1', (d) => arc.centroid(d)[0] * 2) // 可以乘上數字0~2(圓心到圓周)
			.attr('y1', (d) => arc.centroid(d)[1] * 2) // 可以乘上數字0~2(圓心到圓周)
			.attr('x2', (d) => arc.centroid(d)[0] * 2.3) // 可以乘上數字0~2(圓心到圓周)
			.attr('y2', (d) => arc.centroid(d)[1] * 2.3) // 可以乘上數字0~2(圓心到圓周)
			.attr('stroke', 'slategray');

		g.append('text')
			// .attr('x', (d) => arc.centroid(d)[0] * 2.5) // 可以乘上數字0~2(圓心到圓周)
			// .attr('y', (d) => arc.centroid(d)[1] * 2.5) // 可以乘上數字0~2(圓心到圓周)
			.attr('text-anchor', 'middle')
			.text( d => d.data.name)
			.attr('transform', d => {
				var midAngle = (d.startAngle + d.endAngle) / 2;
				var degree = midAngle * 180 / Math.PI;
				var rotate = 'rotate(' + degree + ')';
				var translate = 'translate(' + arc.centroid(d)[0] * 2.4 + ',' + arc.centroid(d)[1] * 2.4 + ')';
				return translate + rotate; // *重要(有順序性) : 要先translate再rotate，否則會歪掉
			});

		console.log(arcs);
	}
});