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

  handleElemSelection(elems) {
    try{ d3.event.stopPropagation() } catch {}
    const manageElem = (e) => {
      // if elem is already selected, deselect it
      if (this.selected_elems.includes(e)) {
        this.selected_elems.splice(
          this.selected_elems.findIndex(elm => elm == e),
          1);
      } else {
        // if it is not selected then select it
        this.selected_elems.push(e)
      }
      // toggle css class
      try { d3.event.target.classList.toggle('selected') } catch {}
    }

    // on empty selection deselect all
    if(!elems) {
      this.resetSelection();
    } else {
      if (elems.length > 1) {
        elems.forEach(e => manageElem(e));
      } else {
        manageElem(elems);
      }

      
    }
    
    // call callback and give the selected elems (to the controller)
    this.onElemSelection(this.selected_elems);
  }

  bindElemSelection(callback) {
    this.onElemSelection = callback;
  }

  resetSelection() {
    // reset selected elems
    this.svg.selectAll('.selected').classed('selected', false);
    this.selected_elems = [];
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

  set selected_elems(elems) {
    this._selected_elems = elems;
  }
  
  get data() {
    return this._data;
  }

  set data(data) {
    this._data = data;
    if (this.svg) this.draw();
  }
}