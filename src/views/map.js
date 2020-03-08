import * as d3 from "d3";
import View from "./view";

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
          //.on("mouseover", this.mouseOverCountry )
          //.on("mouseleave", this.mouseLeaveCountry )
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

    if (this.svg) {
      this.draw();
    }
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
    //console.log(arr)
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
    //console.log(domain)
    return domain; //return an array of six values
  }

  get values() {
    return this._values;
  }

  set values(data) {
    this._values = data;
  }
}