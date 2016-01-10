function getYear(t){var e=t.split(".");return e[2]}var width=window.innerWidth,height=window.innerHeight,color=d3.scale.category10(),force=d3.layout.force().charge(-300).linkDistance(75).size([width,height]),svg=d3.select("body").append("svg").attr("width",width).attr("height",height);d3.json("/scripts/data.json",function(t,e){if(t)throw t;var n=[];e.nodes.forEach(function(t){e.nodes.forEach(function(e){var r=moment(t.electionDate,"DD.MM.YYYY"),a=(moment(t.regressionDate,"DD.MM.YYYY"),moment(e.electionDate,"DD.MM.YYYY")),o=moment(e.regressionDate,"DD.MM.YYYY");if(r.isBetween(a,o,"year")){var i=!1;n.forEach(function(n){(n.source==t&&n.target==e||n.source==e&&n.target==t)&&(i=!0)}),i||n.push({source:t,target:e})}})}),e.links=n,force.nodes(e.nodes).links(e.links).start();var r=svg.selectAll(".link").data(e.links).enter().append("line").attr("class","link").style("stroke-width",4),a=svg.selectAll(".node").data(e.nodes).enter().append("g").attr("class","node").call(force.drag);a.append("circle").attr("r",function(t){return 1.5*(getYear(t.regressionDate)-getYear(t.electionDate))}).style("fill",function(t){return color(t.party)}),a.append("text").attr("dx",30).attr("dy",".35em").text(function(t){return t.name}),a.append("title").text(function(t){return"Name: "+t.name+"\nPartei: "+t.party}),force.on("tick",function(){r.attr("x1",function(t){return t.source.x}).attr("y1",function(t){return t.source.y}).attr("x2",function(t){return t.target.x}).attr("y2",function(t){return t.target.y}),a.attr("transform",function(t){return"translate("+t.x+","+t.y+")"})})});