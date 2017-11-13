$(function(){
	//declare Object & Array method 1
	var person = new Object();
	person.name = "roller";
	person.age = 20;
	person.growUp = function(){
		this.age += 1;
	}

	console.log(person.age);
	person.growUp();
	console.log(person.age);

	for(var prop in person){
		console.log(prop);
	}

	var fruit = new Array('apple', 'orange', 'banana');

	for(var prop in fruit){
		console.log(fruit[prop]);
	}


	//declare Object & Array method 2
	var person2 = {
		name: "roller",
		age: 20,
		growUp: function(){
			this.age += 1;
		}
	}

	console.log(person2.age);
	person2.growUp();
	console.log(person2.age);

	var fruit2 = ['apple', 'orange', 'banana'];

	fruit2.push('pie'); //在尾端增加項

	for (var i = fruit2.length - 1; i >= 0; i--) {
		console.log(fruit2[i]);
	}

	fruit2.pop('pie'); //將尾端項刪除並傳回

	for (var i = fruit2.length - 1; i >= 0; i--) {
		console.log(fruit2[i]);
	}

	fruit2.unshift('pie'); //從最前面推入項

	for (var i = fruit2.length - 1; i >= 0; i--) {
		console.log(fruit2[i]);
	}

	fruit2.shift('pie'); //將第一項刪除並傳回

	for (var i = fruit2.length - 1; i >= 0; i--) {
		console.log(fruit2[i]);
	}

	//declare Object mehtod 3
	function roller(name, age){
		this.name = name;
		this.age = age;
		this.growUp = function(){
			this.age += 1;
		}
	}
	var person3 = new roller('roller', 20);

	console.log(person3.age);
	person3.growUp();
	console.log(person3.age);


	//canvas
	var canvas = $('#myCanvas')[0]; // jQuery element need '[0]' or use next line
	// var canvas = document.getElementById('myCanvas');
	var canvasProp = {
		width : canvas.width,
		height : canvas.height
	};

	for(var prop in canvasProp)
		console.log(prop);

	var ctx = canvas.getContext('2d');

	//線段
	ctx.save();
		ctx.strokeStyle = "blue";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(10, 10);
		ctx.lineTo(100, 100);
		ctx.stroke();
	ctx.restore();

	//矩形
	// ctx.strokeStyle = "black";
	ctx.fillStyle = "yellow";
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.rect(140, 10, 100, 90);
	ctx.fill();
	ctx.stroke();

	//圓形
	ctx.fillStyle = "green";
	ctx.beginPath();
	ctx.arc(320, 55, 50, Math.PI*0, Math.PI*2);
	ctx.fill();

	//多邊形
	ctx.strokeStyle = "orange";
	ctx.fillStyle = "pink";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(440, 10);
	ctx.lineTo(490, 50);
	ctx.lineTo(465, 100);
	ctx.lineTo(415, 100);
	ctx.lineTo(390, 50);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	//曲線
	ctx.strokeStyle = "gray";
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(10, 200);
	ctx.quadraticCurveTo(160, 110, 150, 200); //二次貝茲曲線
	ctx.stroke();
	ctx.restore();

	ctx.strokeStyle = "purple";
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(250, 200);
	ctx.bezierCurveTo(330, 110, 400, 210, 500, 200); //三次貝茲曲線
	ctx.stroke();

	//文字
	ctx.fillStyle = "black";
	ctx.font = "bold 16px simhei";
	ctx.textAlign = "center";
	ctx.fillText("i am roller", 200, 200);

	ctx.save();
	ctx.scale(2,3);
	ctx.fillRect(300, 10, 50, 50);
	ctx.restore();

	ctx.save();
	ctx.rotate(Math.PI*0.25);
	ctx.translate(-100, 40);
	ctx.fillRect(400, 0, 50, 50);
	ctx.restore();

	//圖片
	var img = new Image();
	img.src = "../images/Logo_D3.png";
	img.onload = function(){
		ctx.drawImage(img, 10, 220, 100, 100);
	}

	var img2 = new Image();
	img2.src = "../images/Logo_D3.png";
	img2.onload = function(){
		ctx.drawImage(img2, 0, 0, 500, 500, 310, 220, 100, 100);
	}

	//漸層
	var linearGrad = ctx.createLinearGradient(100, 0, 250, 0);
	linearGrad.addColorStop(0, "steelblue");
	linearGrad.addColorStop(1, "yellow");

	ctx.fillStyle = linearGrad;
	ctx.fillRect(10, 340, 150, 100);

	var radialGrad = ctx.createRadialGradient(375, 150, 10, 375, 150, 100);
	radialGrad.addColorStop(0, "red");
	radialGrad.addColorStop(1, "white");

	ctx.fillStyle = radialGrad;
	ctx.fillRect(375, 150, 250, 200);


})