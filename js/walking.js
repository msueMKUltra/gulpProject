"use strict";$(function(){function t(){var t=m.selectAll("circle").data(n),a=t.enter();t.exit();t.transition().duration(d).attr("cx",function(t,a){return u(t.x)}).attr("cy",function(t,a){return f(t.y)}).attr("r",function(t,a){return g(l-n.length+a+1)}).attr("fill",o).attr("opacity",.3),a.append("circle").attr("cx",function(t,a){return u(1==n.length?t.x:n[a-1].x)}).attr("cy",function(t,a){return f(1==n.length?t.y:n[a-1].y)}).attr("r",function(t,a){return 1==n.length?0:g(a-1)}).attr("fill",o).attr("opacity",0).transition().duration(d).attr("cx",function(t,a){return u(t.x)}).attr("cy",function(t,a){return f(t.y)}).attr("r",function(t,a){return g(l)}).attr("opacity",1).on("start",function(t,a){d3.select(".roller-possibility").text(parseInt(100*z(t.f))+"%"),d3.select(".roller-location").text("("+t.x+", "+t.y+")"),p.append("circle").classed("blink",!0).attr("cx",function(){return u(1==n.length?t.x:n[a-1].x)}).attr("cy",function(){return f(1==n.length?t.y:n[a-1].y)}).attr("r",0).attr("fill",o).attr("opacity",1).transition().duration(d).attr("cx",u(t.x)).attr("cy",f(t.y)).attr("opacity",0).attr("r",30).on("end",function(){d3.select(this).remove()});var r=p.select(".location");r.empty()&&(r=p.append("text").classed("location",!0).text("(0, 0)").attr("text-anchor","start").attr("transform","translate("+(s.width-s.padding)+", 0)").attr("font-size",40).style("text-shadow","2px 2px 2px #000").attr("dx",-140).attr("dy",-130));var e=r.text().split(", "),i=e[0].split("(")[1],l=e[1].split(")")[0];r.transition().duration(d).tween("xyChange",function(){var a=d3.interpolateRound(i,t.x),n=d3.interpolateRound(l,t.y);return function(t){r.attr("fill","#1781C4").text("("+a(t)+", "+n(t)+")")}})})}function a(){if(1!=n.length){var t=d3.select(".noOneCircle");t.empty()||t.remove();var a=b.selectAll("path").data(e),r=a.enter(),o=(a.exit(),d3.line().x(function(t,a){return k(a+1)}).y(function(t){return R(z(t.f))}));a.attr("stroke-dashoffset",0).attr("stroke",i).attr("stroke-width",2).attr("fill","none").transition().duration(d).ease(d3.easeLinear).attr("transform",function(t,a){r=k(a+1);if(e.length>=l)var r=k(a);return"translate("+r+", 0)"});var c=r.append("path").attr("d",function(t){return o(t)}).attr("transform",function(t,a){var r=k(a+1);return e.length>=l+1&&(r=k(l)),"translate("+r+", 0)"}).attr("stroke",i).attr("stroke-width",2).attr("fill","none").attr("opacity",1).attr("marker-start","url(#linePoint)"),s=c.node().getTotalLength();c.attr("stroke-dasharray",s+" "+s).attr("stroke-dashoffset",s).transition().duration(d).ease(d3.easeLinear).attr("stroke-dashoffset",0).on("start",function(t,a){w.append("circle").classed("blink",!0).attr("cx",function(){return k(a+1)}).attr("cy",function(){return R(z(t[1].f))}).attr("transform",function(){var t=k(2)+v.padding/2;return a>=l-1&&(t=v.padding/2),"translate("+t+", 0)"}).attr("r",0).attr("fill",i).attr("opacity",1).transition().duration(d).attr("opacity",0).attr("r",30).on("end",function(){d3.select(this).remove()}),w.append("circle").classed("blink",!0).attr("cx",function(){return k(a+1)}).attr("cy",function(){return R(z(t[1].f))}).attr("transform",function(){var t=k(2)+v.padding/2;return a>=l-1&&(t=v.padding/2),"translate("+t+", 0)"}).attr("r",0).attr("fill",i).attr("opacity",0).transition().duration(d).attr("opacity",1).attr("r",6).on("end",function(){d3.select(this).remove()});var r=w.select(".location");r.empty()&&(r=w.append("text").classed("location",!0).text("0%(0)").attr("text-anchor","start").attr("transform","translate("+(v.width/2-v.padding)+", 0)").attr("font-size",40).style("text-shadow","2px 2px 2px #000").attr("dx",-180).attr("dy",-150));var n=r.text().split("%"),e=n[0],o=n[1].split("(")[1].split(")")[0];r.transition().duration(d).tween("pfChange",function(){var a=d3.interpolateRound(e,z(100*t[1].f)),n=d3.interpolateRound(o,t[1].f);return function(t){r.text(a(t)+"%("+n(t)+")")}})}).filter(function(t,a){return a>=l-1}).attr("transform",function(t,a){return"translate("+k(l-1)+", 0)"})}else b.append("circle").classed("noOneCircle",!0).data(n).attr("cx",function(t,a){return k(a+1)}).attr("cy",function(t){return R(z(t.f))}).attr("fill","black").attr("r",0).attr("fill",i).attr("opacity",0).transition().duration(d).attr("r",6).attr("opacity",1).on("start",function(t,a){w.append("circle").classed("blink",!0).attr("cx",function(){return k(a+1)}).attr("cy",function(){return R(z(t.f))}).attr("transform","translate("+v.padding/2+", 0)").attr("r",0).attr("fill",i).attr("opacity",1).transition().duration(d).attr("opacity",0).attr("r",30).on("end",function(){d3.select(this).remove()});var r=w.select(".location");r.empty()&&(r=w.append("text").classed("location",!0).text("0%(0)").attr("text-anchor","start").attr("transform","translate("+(v.width-v.padding)+", 0)").attr("font-size",40).style("text-shadow","2px 2px 2px #000").attr("dx",-180).attr("dy",-150));var n=r.text().split("%"),e=n[0],o=n[1].split("(")[1].split(")")[0];r.transition().duration(d).tween("pfChange",function(){var a=d3.interpolateRound(e,z(100*t.f)),n=d3.interpolateRound(o,t.f);return function(t){r.attr("fill","#C41781").text(a(t)+"%("+n(t)+")")}})})}function r(){var r=~~(32*Math.random()),i=~~(32*Math.random()),o=~~(256*Math.random());if(n.length==l+1&&(n.shift(),m.selectAll("circle").filter(function(t,a){return 0==a}).remove()),n.push({x:r,y:i,f:o}),e.length==l&&(e.shift(),b.selectAll("path").filter(function(t,a){return 0==a}).remove()),n.length>1){var d=n[n.length-2],c=n[n.length-1];e.push([d,c])}t(),a()}var n=[],e=[],i="violet",o="DarkTurquoise",d=2e3,l=10,c=$(".roller-scatter-chart").width(),s={width:c,height:c,padding:c/10},p=d3.select(".roller-scatter-chart").append("svg").attr("preserveAspectRatio","xMidYMid meet").attr("viewBox","0 0 "+s.width+" "+s.height).append("g").attr("transform","translate("+s.padding+","+s.padding+")"),u=d3.scaleLinear().domain([0,32]).range([0,s.width-2*s.padding]),f=d3.scaleLinear().domain([0,32]).range([s.height-2*s.padding,0]),g=d3.scaleQuantile().domain(d3.range(l+1)).range([0,4,5,6,7,8]),h=(d3.scaleQuantile().domain(d3.range(l+1)).range([0,.3,.4,.5,.6,.7]),d3.axisBottom().tickValues([2,9,16,23,30]).tickFormat("").tickSize(s.height-2*s.padding).scale(u));p.append("g").classed("y-grid",!0).call(h);var x=d3.axisRight().tickValues([2,9,16,23,30]).tickFormat("").tickSize(s.width-2*s.padding).scale(f);p.append("g").classed("x-grid",!0).call(x);var m=p.append("g").classed("circle-group",!0),y=$(".roller-line-chart").width(),v={width:y,height:c,padding:y/10},w=d3.select(".roller-line-chart").append("svg").attr("preserveAspectRatio","xMidYMid meet").attr("viewBox","0 0 "+v.width+" "+v.height).append("g").attr("transform","translate("+v.padding+","+v.padding+")"),k=d3.scaleLinear().domain([1,l]).range([0,v.width-2*v.padding]),z=d3.scaleLinear().domain([0,255]).range([0,1]),R=d3.scaleLinear().domain([0,1]).range([v.height-2*v.padding,0]),L=(d3.scaleQuantile().domain(d3.range(l)).range([4,6,8,10,12]),d3.scaleQuantile().domain(d3.range(l)).range([.3,.4,.5,.6,.7]),d3.axisBottom().tickValues(d3.range(1,l+1)).tickFormat(d3.format("d")).scale(k));w.append("g").classed("x-axis",!0).attr("transform","translate("+v.padding/2+","+(v.height-2*v.padding)+")").call(L);var C=d3.axisRight().tickValues(d3.range(0,1.25,.25)).tickSize(0).tickFormat(d3.format(".0%")).scale(R);w.append("g").classed("y-axis",!0).attr("transform","translate( -36, -10)").call(C);var M=d3.axisRight().tickValues(d3.range(0,1.25,.25)).tickFormat("").tickSize(v.width).scale(R);w.append("g").classed("x-grid",!0).attr("transform","translate("+-v.padding+", 0)").call(M);var b=w.append("g").classed("line-group",!0).attr("transform","translate("+v.padding/2+", 0)");w.append("defs").append("marker").attr("id","linePoint").attr("viewBox","0 0 12 12").attr("refX","6").attr("refY","6").attr("markerHeight","6").attr("markerWidth","6").attr("orient","auto").append("circle").attr("cx",6).attr("cy",6).attr("r",6).attr("fill",i),r(),setInterval(r,d);var A=$(window);A.resize(function(){A.trigger("window:resize")}),A.on("window:resize",function(){$(".roller-scatter-chart").width()}),A.on("window:resize",function(){$(".roller-scatter-chart").width()})});
//# sourceMappingURL=walking.js.map