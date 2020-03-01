import * as d3 from "d3";
import ColorBrewerLinear from "./colorscale"

export default function() {



  /* map color initialization */
  const BrewerScale = new ColorBrewerLinear;
  var BrewerRange = BrewerScale.scale(1);
  var CustomDomain = BrewerScale.domain();
  /* end map color initialization */


  const mapchart = function() {
    console.log('ciao')
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

    /*
    
    OPTION 1 FOR COLOR: scaleThreshold
    manually specify domain and range
    
    
    */
    var colorScale = d3.scaleThreshold()
      /*
      domain specify wich color use for the range
      in the following: 
      - till 100000 -> rgb(237,248,251)
      - from 100000 to 1000000 -> rgb(204,236,230)
      - ....
      */
      .domain(CustomDomain)
      //.range(d3.schemeBlues[7]);
      /* RGB version
      .range(["rgb(237,248,251)", "rgb(204,236,230)", "rgb(153,216,201)",
       "rgb(102,194,164)", "rgb(65,174,118)", "rgb(35,139,69)", "rgb(0,88,36)"]);
      */
     //.range(["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"]);
     .range(BrewerRange);

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
  }

  return mapchart
}