$(function(){					
	d3.json("./files/ch09/taiwan.json", function(error, data){ // 檔案讀不出來，要注意格式有沒有錯
		var dataset = data.data;
		console.log(data);
		console.log(dataset);
		var svg = d3.select('body').append('svg').attr('width', 500).attr('height', 500);
		svg.selectAll('text').data(dataset).enter().append('text')
			.attr('x', (d, i) => i * 70 + 10).attr('y', 20).text((d) => d);
		svg.call(downloadable());
	});

	d3.csv('./files/ch09/taiwan.csv', function(error, data){ // d3.csv 讀的副檔名，要對應相同方法
		console.log(data.columns); // 會是第一行標題的array
	});

	var tsv = d3.dsvFormat("	"); // dsv可用來自行定義分隔的符號
	d3.text("./files/ch09/taiwan.tsv") // v3. d3.dsv => d3.dsvFormat 再用text讀取純文字，接著parse
		.get(function(error,rows){ // 得到的rows為原始內容，需用parse做轉換
			if (error) throw error;
			var rows = tsv.parse(rows);

			var newRows = [];

			console.log(rows);

		});

	d3.xml('./files/ch09/taiwan.xml', function(error, data){
		var name = data.getElementsByTagName('name')[0].innerHTML; // 取得tag為name的標韱
		var taiwan = data.getElementsByTagName('name')[0].innerHTML; // 取得標韱的內容
		console.log(data);
		console.log(name);
		console.log(taiwan);
	});

	let a = () => console.log('aaa');
	let b = {
				method: function(){
					console.log(this);
					var sentence = function(){
						console.log(this);
					}.bind(this);
					sentence();
				}
			}
	b.method();
});