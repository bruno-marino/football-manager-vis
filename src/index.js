import 'normalize.css'
import './index.scss'

import * as d3 from "d3";

/*
d3.csv("/assets/dataset.csv").then(function(data) {
    console.log(data);
});
*/

// The svg
var svg = d3.select("svg"),
  width = +svg.node().getBoundingClientRect().width,
  height = +svg.node().getBoundingClientRect().height;

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .center([0,45])
  .translate([width /2, height /2])
  .scale((height / (2 * Math.PI))*1.5);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
/*
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .defer(d3.csv, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
  .await(ready);
*/
var promises = [
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
 ]
  
Promise.all(promises).then(ready)

//function ready(error, topo) {
function ready(topo) {
  // remove antartica
  let index_ata = topo[0].features.findIndex(country => country.id === 'ATA');
  topo[0].features.splice(index_ata, 1);

  //console.log(topo[0].features);
  let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
      .style("cursor", "pointer")
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(0)
      .style("stroke", "transparent")
  }

  // Draw the map
  const g = svg.append("g")
    .selectAll("path")
    .data(topo[0].features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .on("click", () => {d3.event.stopPropagation()})
    
    svg.on("click", reset);
    const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
    
    svg.call(zoom);
    
    function reset() {
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
    }
    
    function zoomed() {
      const {transform} = d3.event;
      g.attr("transform", transform);
    }
}