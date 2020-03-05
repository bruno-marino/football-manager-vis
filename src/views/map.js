import * as d3 from "d3";
import RoleSettings from "./rolesettings"
import { timeThursday } from "d3";

export default class MapChart {
  constructor(container) {
    this._data = [];
    this.RoleSetting = new RoleSettings;    
    this.selected_countries = [];
    
    this.onCountriesSelection = () => {};

    if (container)
      this.init(container);
  }

  // insert svg in container and init interaction events
  init(container) {    
    this.container = container || this.container;
    this.zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", this.zoomed.bind(this));

    this.svg = this.container.append("svg")
      .attr("width",this.width)
      .attr("height", this.height)
      .on("click", this.reset.bind(this))
      .call(this.zoom);

    this.svg.append("g");     

    this.projection = d3.geoMercator()
      .center([0,45])
      .translate([this.width /2, this.height /2])
      .scale((this.height / (2 * Math.PI))*1.5);

    this.changeRamp(1);
    this.draw();
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
      .style("stroke", "transparent")
      .attr("class", d => "Country")
      .style("opacity", .8)
      .on("mouseover", this.mouseOverCountry )
      .on("mouseleave", this.mouseLeaveCountry )
      .on("click", () => {d3.event.stopPropagation()});
  }

  changeRamp(role_number) {

    /* map color initialization */
    var RampSettings = this.RoleSetting.settings(role_number);
    var BrewerRange = RampSettings.role_scale;
    var CustomDomain = RampSettings.role_domain;
    /* end map color initialization */

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
      .domain(CustomDomain)
      //.range(d3.schemeBlues[7]);
      /* RGB version
      .range(["rgb(237,248,251)", "rgb(204,236,230)", "rgb(153,216,201)",
        "rgb(102,194,164)", "rgb(65,174,118)", "rgb(35,139,69)", "rgb(0,88,36)"]);
      */
      //.range(["#edf8fb", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"]);
      .range(BrewerRange);

    this.svg.selectAll('.Country')
      .attr("fill", d => this.colorScale(d.total))
  }

  updateData() {

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

  mouseOverCountry() {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
      .style("cursor", "pointer");
    d3.select(d3.event.target)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black");
  }

  mouseLeaveCountry() {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8);
    d3.select(d3.event.target)
      .transition()
      .duration(0)
      .style("stroke", "transparent");
  }

  countrySelected() {
    //perform visual change and give the selected countries to the controller
    this.onCountriesSelection(this.selected_countries);
  }

  bindCountriesSelection(callback) {
    this.onCountriesSelection = callback;
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