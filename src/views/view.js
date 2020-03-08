import * as d3 from 'd3';

export default class View {
  constructor(container, zoom_active = false) {
    this.zoom_active = zoom_active;
    this._data  = [];
    this._selected_elems = [];

    this.onElemSelection = () => {};

    if (container)
      this.init(container);
  }

  // insert svg in container and init zoom
  init(container) {    
    this.container = container || this.container;
    this.svg = this.container.append("svg")
      .attr("width",this.width)
      .attr("height", this.height)
      .on("click", () => { this.reset(); });

    if (this.zoom_active) {
      this.zoom = d3.zoom()
        .on("zoom", this.zoomed.bind(this));

      this.svg.call(this.zoom);
    }  
  }

  draw() {}

  reset() {
    if (!this.zoom_active) return 

    this.svg.transition().duration(750).call(
      this.zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(this.svg.node()).invert([this.width / 2, this.height / 2])
    );
  }
  
  zoomed() {
    if (!this.zoom_active) return 

    const {transform} = d3.event;
    this.svg.select("g").attr("transform", transform);
  }

  handleElemSelection(elem) {
    // on empty selection deselect all
    if(!elem) {
      // reset selected countries
      this.svg.selectAll('.selected').classed('selected', false);
      this.selected_elems = [];
    } else {
      d3.event.stopPropagation();
      // if elem is already selected, deselect it
      if (this.selected_elems.includes(elem.id)) {
        this.selected_elems.splice(
          this.selected_elems.findIndex(code => code == elem.id),
          1);
      } else {
        // if it is not selected then select it
        this.selected_elems.push(elem.id)
      }
      // toggle css class
      d3.event.target.classList.toggle('selected')
    }
    
    // call callback and give the selected elems (to the controller)
    this.onElemSelection(this.selected_elems);
  }

  bindElemSelection(callback) {
    this.onElemSelection = callback;
  }

  get width() {
    return this.container.node().getBoundingClientRect().width;
  }
  
  get height() {
    return this.container.node().getBoundingClientRect().height;
  }

  get selected_elems() {
    return this._selected_elems;
  }
  
  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
    if (this.svg) this.draw();
  }
}