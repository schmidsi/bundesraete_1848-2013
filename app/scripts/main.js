var width = window.innerWidth;
var height = window.innerHeight;

var color = d3.scale.category10();
var force = d3.layout.force()
  .charge(-300)
  .linkDistance(75)
  .size([width, height]);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

function getYear(wholeDate) {
  var split = wholeDate.split(".");
  return split[2];
}

d3.json("/scripts/data.json", function(error, graph) {
  if (error) throw error;

  var links = [];

  graph.nodes.forEach(function(source) {
    graph.nodes.forEach(function(target) {
      var sourceElection = moment(source.electionDate, 'DD.MM.YYYY')
      var sourceRegression = moment(source.regressionDate, 'DD.MM.YYYY')
      var targetElection = moment(target.electionDate, 'DD.MM.YYYY')
      var targetRegression = moment(target.regressionDate, 'DD.MM.YYYY')

      if (sourceElection.isBetween(targetElection, targetRegression, 'year')) {
        var found = false

        links.forEach(function(link) {
          if ((link.source == source && link.target == target) ||
            (link.source == target && link.target == source)) {
            found = true
          }
        })

        if (!found) {
          links.push({
            source: source,
            target: target
          });
        }
      }
    });
  });

  graph.links = links;

  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", 4);

  var nodes = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append('g')
    .attr("class", "node")
    .call(force.drag);

  nodes.append("circle")
    .attr("r", function(d) {
      return (getYear(d.regressionDate) - getYear(d.electionDate)) * 1.5
    })
    .style("fill", function(d) {
      return color(d.party);
    })

  nodes.append("text")
    .attr('dx', 30)
    .attr('dy', '.35em')
    .text(function(d) {
      return d.name
    });


  nodes.append("title")
    .text(function(d) {
      return "Name: " + d.name + "\nPartei: " + d.party;
    });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    nodes.attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
  });

});
