"use strict";$(function(){d3.queue().defer(d3.json,"./files/gooee/name_map.json").defer(d3.json,"./files/gooee/data_B.json").awaitAll(function(t,e){if(t)throw t;var r={width:500,height:500},n=d3.select("body").append("svg").attr("width",r.width).attr("height",r.height),a=e[0],c=e[1],o=[],i=[];for(var l in a)o.push({code:l,name:a[l],index:o.length});for(var f=d3.map(o,function(t){return t.code}),d=0;d<c.length;d++){var u=c[d].start,s=c[d].end,h=c[d].count,y=f.get(u).index,g=f.get(s).index;i.push({source:y,target:g,count:h})}var x=d3.forceManyBody().strength(-1e3),p=d3.forceCenter(r.width/2,r.height/2),v=d3.forceLink(i),m=d3.forceSimulation(o).force("charge",x).force("center",p).force("links",v);m.on("tick",function(){w.attr("x1",function(t){return t.source.x}).attr("y1",function(t){return t.source.y}).attr("x2",function(t){return t.target.x}).attr("y2",function(t){return t.target.y}),k.attr("cx",function(t){return t.x}).attr("cy",function(t){return t.y}),A.attr("x",function(t){return t.x}).attr("y",function(t){return t.y})});var w=n.selectAll(".forceLine").data(i).enter().append("line").classed("forceLine",!0).attr("stroke","slategray"),j=d3.schemeCategory20b,k=n.selectAll(".forceCircle").data(o).enter().append("circle").attr("class","forceCircle").attr("r",20).style("fill",function(t,e){return j[e]}),A=n.selectAll(".forceText").data(o).enter().append("text").attr("class","forceText").style("fill","ivory").attr("text-anchor","middle").attr("dy",".35rem").text(function(t){return t.name}),C=d3.drag().on("start",function(t){d3.event.active||m.alphaTarget(.3).restart(),k.each(function(t){t.fx=null,t.fy=null}),t.fx=t.x,t.fy=t.y}).on("drag",function(t){d3.select(this).style("fill","gold"),t.fx=d3.event.x,t.fy=d3.event.y}).on("end",function(t,e){d3.event.active||m.alphaTarget(0),d3.select(this).style("fill",j[e])});k.call(C)})});
//# sourceMappingURL=force_directed.js.map