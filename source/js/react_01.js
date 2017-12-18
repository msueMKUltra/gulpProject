$(function(){
	//https://ithelp.ithome.com.tw/articles/10155643					

	/**
	* 我們舉例一個機器人物件，機器人有一些基本的 function 來執行動作
	* 不過問題是當我們要求機器人執行動作的時候，他需要先到確定還有沒有能量。
	* 
	*
	* Note: 這段程式碼只是希望能夠用具像化一點的比喻來說明。
	*/
	var Robot = {
		/** private */
		power: 100,

		walk: function () {
			console.log('Robot walked');
			this.power -= 10;
		},

		fly: function () {
			console.log('Robot flied');
			this.power -= 20;
		},

		check: function (excute) {
			if (this.power > 0)
			  excute();
		},
			/** public */
		showoff: function () {
			// var that = this;
			this.check(function () {
			  this.walk(); /* 實際執行的動作。 */
			  this.fly();
			}.bind(this));
		}
	}

	Robot.showoff();

	// Function.prototype.bind = function (scope) {
	//     var fn = this;
	//     return function () {
	//         return fn.apply(scope);
	//     };
	// }

	var foo = {
	    x: 3
	}

	var bar = function () {
	  console.log(this.x);
	}

	// bar(); // undefined

	var boundFunc = bar.bind(foo);

	boundFunc(); // 3

	var logger = {
	  x: 0,
	  increment: function () {
	    this.x++;
	    console.log(this.x);
	  }
	}

	// document.querySelector('button').addEventListener('click', function () {
	//   logger.increment();
	// });
	//不過上面這種做法，我們已經建立了一個不必要的匿名函式，並且因為這個匿名函式使用了
	//logger 呼叫了 increment() 所以產生了一個閉包用以確保了 this 是正確的參考物件。


	// document.querySelector('button').addEventListener('click', logger.increment); // NaN
	// 根據 this 的定義他其實是指的是誰(哪個物件)呼叫這個函式 this 就是指向它。
	// it should be...
	// document.querySelector('button').addEventListener('click', logger.increment.bind(logger)); 

});