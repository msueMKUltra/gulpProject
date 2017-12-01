$(function(){
  var test = [];
	
var width = 270,
    height = 270,
    margin = {top: 20, right: 10, bottom: 20, left: 35},
    n = 10000; // number of samples to generate

var chart = d3.qq()
    .width(width)
    .height(height)
    .domain([-.1, 1.1])
    .tickFormat(function(d) { return ~~(d * 100); }); // ~~ 等於Math.floor

var vis = d3.select("body").append("svg")
    .attr("width", (width + margin.right + margin.left) * 3)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("./json/compass/turkers.json", function(error, turkers) {
  if (error) throw error;

  var tm = mean(turkers),
      td = Math.sqrt(variance(turkers)),
      dd = [
        [0.10306430789206111, 0.0036139086950272735, 0.30498647327844536],
        [0.5924252668569606, 0.0462763685758622, 0.4340870312025223],
        [0.9847627827855167, 2.352350767874714e-4, 0.2609264955190324]
      ];
  console.log(d3.range(n));


  var g = vis.selectAll("g")
      .data([{
        x: d3.range(n).map(normal1(tm, td)),
        y: turkers,
        label: "Gaussian (Normal) Distribution"
      }])
    .enter().append("g")
      .attr("class", "qq")
      .attr("transform", function(d, i) { return "translate(" + (width + margin.right + margin.left) * i + ")"; });

      console.log(test);

  g.append("rect")
      .attr("class", "box")
      .attr("width", width)
      .attr("height", height);

  g.call(chart);

  g.append("text")
      .attr("dy", "1.3em")
      .attr("dx", ".6em")
      .text(function(d) { return d.label; });

  chart.duration(1000);

  window.transition = function() {
    g.datum(randomize).call(chart);
  };

  // d3.select('.box').style('fill', 'blue');
  // d3.selectAll('.quantile').style('stroke', 'white').style('fill', 'slateblue');
  d3.selectAll('.quantile').each(function(d, i){
    // d3.select(this);
    // node.style('cx', 0).style('cy', 0);
    // console.log(d3.select(this));
    var node = d3.select(this);
    var qq = d3.select('.qq');
    var cx = Number(node.attr('data-x'));
    var cy = Number(node.attr('data-y'));
    var raw = Math.round(node.attr('data-raw')*100)/100;
    var dataset = [[cx, cy, cy - 10], [cx + 10, cy, cy - 10], [cx + 10, cy + 6, cy - 16], [cx + 20, cy - 5, cy - 5]];
    console.log(dataset);
    var nodeTmp, textTmp, areaTmp;
    // console.log(node.style('transform'));

    // nodeTr.transition().duration(2000).style('cx', cx).style('cy', cy);
    node.on("mouseover", function(){
      // node.style('r', 12)
      //   .style('stroke', 'slateblue').style('fill', 'white');
      var areaPath = d3.svg.area()
          .x( (d) => d[0] + 10)
          .y0( (d) => d[1] + 6 )
          .y1( (d) => d[2] + 6 );
      areaTmp = qq.append('path').attr('d', areaPath(dataset)).attr('fill', 'violet');
      textTmp = qq.append('text').attr('x', cx + 32).attr('y', cy + 5).attr('text-anchor', 'start').attr('font-size', '12px').text(raw).attr('fill', 'hotpink');
      nodeTmp = qq.append(() => node.node()).style('r', 12)
        .style('stroke', 'blueviolet').style('fill', 'white');
      // d3.svg.area()
      //     .x(function(d, i){ return 500 + i * 80;})
      //     .y0(function(d, i){ return 400;})
      //     .y1(function(d, i){ return 400 - d;});
    });
    node.on("mouseout", function(){
      nodeTmp.style('r', 6)
        .style('stroke', 'white').style('fill', 'slateblue');
      textTmp.remove();
      areaTmp.remove();
    });
  });



});

function randomize(d) {
  d.y = d3.range(n).map(Math.random);
  return d;
}

// Sample from a normal distribution with mean 0, stddev 1.
function normal() {
  var x = 0, y = 0, rds, c;
  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    rds = x * x + y * y;
  } while (rds == 0 || rds > 1);
  c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
  return x * c; // throw away extra sample y * c
}


// Simple 1D Gaussian (normal) distribution
function normal1(mean, deviation) {
  return function() {
    test.push(mean + deviation + normal());
    return mean + deviation * normal();
  };
}

// Gaussian Mixture Model (k=3) fit using E-M algorithm
function normal3(dd) {
  return function() {
    var r = Math.random(),
        i = r < dd[0][2] ? 0 : r < dd[0][2] + dd[1][2] ? 1 : 2,
        d = dd[i];
    return d[0] + Math.sqrt(d[1]) * normal();
  }
}

// Welford's algorithm.
function mean(x) {
  var n = x.length;
  if (n === 0) return NaN;
  var m = 0,
      i = -1;
  while (++i < n) m += (x[i] - m) / (i + 1);
  return m;
}

// Unbiased estimate of a sample's variance.
// Also known as the sample variance, where the denominator is n - 1.
function variance(x) {
  var n = x.length;
  if (n < 1) return NaN;
  if (n === 1) return 0;
  var m = mean(x),
      i = -1,
      s = 0;
  while (++i < n) {
    var v = x[i] - m;
    s += v * v;
  }
  return s / (n - 1);
}

function a() {
  return function(){
    return 3 * 3;
  };
}

var s = a;
// alert('break');
// alert(s());

var persons = [
    {firstname : "Malcom", lastname: "Reynolds"},
    {firstname : "Kaylee", lastname: "Frye"},
    {firstname : "Jayne", lastname: "Cobb"}
];
function func(a, b){
  console.log(a);
  console.log(b);
  console.log(this);
  var div = document.createElement('div');
  console.log(div);
  var divv = $(div).appendTo(this);
  console.log(divv);
}
// persons.map(function(c, i, a){
//   console.log(c);
//   console.log(i);
//   console.log(a);
//   console.log(persons);
// });

persons.map(func, $('body'));

});