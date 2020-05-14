import * as d3 from "d3";
import View from "./view";
import Controller from "../controller/controller";

export default class MapChart extends View{
  constructor(container) {
    super(container, true);
    this._values = [];
  }

  init(container) {
    super.init(container);

    this.svg.append("g");

    this.projection = d3.geoMercator()
      .center([0,45])
      .translate([this.width /2, this.height /2])
      .scale((this.height / (2 * Math.PI))*1.5);

    this.tooltip = this.container.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    this.draw();
  }

  // draw countries
  draw() {

    this.svg.select("g")
      .selectAll("path")
      .data(this._data)
      .join(
        // new objects to be created
        enter => enter.append("path")
          // draw each country
          .attr("d", d3.geoPath()
            .projection(this.projection)
          )
          .style("vector-effect", "non-scaling-stroke")
          .attr("class", "Country")

          //ToolTip

          .on("mouseover", d => {
            this.tooltip.transition().duration(300)
            .style("opacity", 1)
            this.tooltip.html("<b>" + d.properties.name + "</b> <br> Strenght: " + parseFloat(this.values[d.id]).toFixed(2) )
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY -30) + "px");
          })
          .on("mouseout", () => {
            this.tooltip.transition().duration(300)
            .style("opacity", 0);
          })

          .on("click", this.handleElemSelection.bind(this))
          // set the color of each country
          .attr("fill", d => this.values[d.id] ? this.colorScale(this.values[d.id]) : 'grey'),
        update => update
            .transition()
            .duration(1000)
            // set the color of each country
            .attr("fill", d => this.values[d.id] ? this.colorScale(this.values[d.id]) : 'grey'),
        exit => exit
          .transition()
          .duration(650)
          .remove()
      )
  }

  changeRamp(range) {
    let domain = this.calcDomain()
    /*

    OPTION 1 FOR COLOR: scaleThreshold
    manually specify domain and range


    */
    this.colorScale = d3.scaleThreshold()
      /*
      domain specify wich color use for the range
      in the following:
      - till 100000 -> rgb(237,248,251)
      - from 100000 to 1000000 -> rgb(204,236,230)
      - ....
      */
      .domain(domain)
      //.range(d3.schemeBlues[7]);
      /* RGB version
      .range(["rgb(237,248,251)", "rgb(204,236,230)", "rgb(153,216,201)",
        "rgb(102,194,164)", "rgb(65,174,118)", "rgb(35,139,69)", "rgb(0,88,36)"]);
      */
      //.range(["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"]);
      .range(range);

    this.legend(domain,range)

    if (this.svg) {
      this.draw();
    }

  }

  legend(domain,range){

    let domain_clone = domain.slice()

    for (let i = 0; i < domain_clone.length; i++) {
      domain_clone[i] = "< " + parseFloat(domain_clone[i]).toFixed(2)
    }

    domain_clone.push("> " + parseFloat(domain[domain.length - 1]).toFixed(2))

    this.svg.append("rect")
        .attr("class","legend-container")
        .attr("x", 5)//95
        .attr("y", this.height - 200)//75 // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", 90)
        .attr("height", 200)
        .style("fill", "#ffffff")
        .style("stroke", "#000000")
        .style("stroke-width", "1")
        .text("Strenght");

      this.svg.append("text")
        .attr("x", 15)//100
        .attr("y", this.height - 185)//90
        .text("Strenght");

    // Add one dot in the legend for each name.
    var size = 20
    this.svg.selectAll("mydots")
      .data(range)
      .enter()
      .append("rect")
        .attr("x", 15)//100
        .attr("y", (d,i) => { return (this.height - 175)  + i*(size+5)}) // 100(now 260) is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d, i){ return range[i] })

    // Add one dot in the legend for each name.
    this.svg.selectAll("mylabels")
      .data(domain_clone)
      .enter()
      .append("text")
        .attr("x", 15 + size*1.2)//100 now 15
        .attr("y", (d,i) => { return (this.height - 175) + i*(size+5) + (size/2)}) // 100 (now 260) is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return domain_clone[d.id] })
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

  }

  calcDomain(){
    let arr = [];
    for(let country in this.values ){
      arr.push(this.values[country])
    }

    //compute the first usefull percentile
    let integer = true;
    var firstChunk = arr.length/7;

    if(!Number.isInteger(firstChunk)){
      firstChunk = Math.round(firstChunk);
      integer = false;
    }

    var domain = new Array();
    //sort the array of data
    arr.sort((a, b) => a - b);

    let domain_value = 0;
    let domain_index = 0;

    for (var i = 1; i < 7; i++) {
      domain_index = firstChunk * i;
      if(integer){
        domain_value = (arr[domain_index] + arr[domain_index + 1])/2
      }else{
        domain_value = arr[domain_index];
      }
      domain.push(domain_value);
    }

    return domain; //return an array of six values
  }

  get values() {
    return this._values;
  }

  set values(data) {
    this._values = data;
  }
}