import * as d3 from "d3";
import { timeThursday } from "d3";

export default class MapChart {
  constructor(container) {
    this._data = []; 
    this.selected_countries = [];
    
    this.onCountriesSelection = () => {};

    if (container)
      this.init(container);
  }

  // insert svg in container and init interaction events
  init(container) {    
    this.container = container || this.container;
    this.zoom = d3.zoom()
        .on("zoom", this.zoomed.bind(this));

    this.svg = this.container.append("svg")
      .attr("width",this.width)
      .attr("height", this.height)
      .on("click", () => { this.reset(); })
      .call(this.zoom);

    this.svg.append("g");     

    this.projection = d3.geoMercator()
      .center([0,45])
      .translate([this.width /2, this.height /2])
      .scale((this.height / (2 * Math.PI))*1.5);
  }

  // draw countries
  draw() {
    this.svg.select("g")
      .selectAll("path")
      .data(this._data)
      .enter()
      .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(this.projection)
      )
      // set the color of each country
      .attr("fill", d => this.colorScale(d.total))
      .style("vector-effect", "non-scaling-stroke") 
      .attr("class", d => "Country")
      //.on("mouseover", this.mouseOverCountry )
      //.on("mouseleave", this.mouseLeaveCountry )
      .on("click",  this.toggleCountrySelection.bind(this));
  }

  changeRamp(domain, range) {
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
      this.svg.selectAll('.Country')
        .attr("fill", d => this.colorScale(d.total))
    }
  }

  updateData(data) {
    this.data.forEach(d => {
      d.total = data[d.id];
    });

    this.draw();
  }

  reset() {
    this.svg.transition().duration(750).call(
      this.zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(this.svg.node()).invert([this.width / 2, this.height / 2])
    );
  }
  
  zoomed() {
    const {transform} = d3.event;
    this.svg.select("g").attr("transform", transform);
  }
/*
  mouseOverCountry() {
    d3.selectAll(".Country")
      .style("opacity", .5)
      .style("cursor", "pointer");
    d3.select(d3.event.target)
      .style("opacity", 1)
      .style("stroke-width", 2)
  }

  mouseLeaveCountry() {
    d3.selectAll(".Country")
      .style("opacity", .8)
      .style("stroke-width", 0.3);
  }
*/
  toggleCountrySelection(country) {
    if(!country) {
      // reset selected countries
      d3.selectAll('.Country.selected').classed('selected', false);
      this.selected_countries = [];
    } else {
      d3.event.stopPropagation();
      if (this.selected_countries.includes(country.id)) {
        this.selected_countries.splice(
          this.selected_countries.findIndex(code => code == country.id),
          1);
      } else {
        this.selected_countries.push(country.id)
      }
      d3.event.target.classList.toggle('selected')
    }
    
    //perform visual change and give the selected countries to the controller
    this.onCountriesSelection(this.selected_countries);
  }

  bindCountriesSelection(callback) {
    this.onCountriesSelection = callback;
  }

  calcDomain(arr){
    //compute the first usefull percentile
    let integer = true;
    var firstChunk = Math.round(arr.length/7);
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
    return domain; //return an array of six value
  }

  // getters and setters
  get width() {
    return this.container.node().getBoundingClientRect().width;
  }
  
  get height() {
    return this.container.node().getBoundingClientRect().height;
  }
  
  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
    if (this.svg) this.draw();
  }
}