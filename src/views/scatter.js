import * as d3 from "d3";
import View from "./view";
import rolesettings from '../controller/rolesettings.json'

export default class Scatterplot extends View {
    constructor(container, isPca) {
        super(container);
      this.pca = isPca;

      this.x_axis = "acceleration";
      this.y_axis = "acceleration";

      if(isPca){
        this.x_axis = "";
        this.y_axis = "";
      }

      this.minimum_distance = 100;
    }

    init(container) {
        super.init(container);

        this.pca_role = "0";

        this.idleTimeout = null;

        this.domain_start_x = 0;
        this.domain_end_x = 20;
        this.domain_start_y = this.domain_start_x;
        this.domain_end_y = this.domain_end_x;

        this.margin = {top: 10, right: 30, bottom: 40, left: 60};
        this.width_nomargin = this.width - this.margin.left - this.margin.right;
        this.height_nomargin = this.height - this.margin.top - this.margin.bottom;
        let real_svg = this.svg;
        // Update this.svg in ordert to contain axis
        this.svg = this.svg.append("g")
                .attr("transform","translate(" + this.margin.left + "," + this.margin.top + ")");

        // Add X axis
        this.x = d3.scaleLinear()
            .range([ 0, this.width_nomargin ]);

        // Add Y axis
        this.y = d3.scaleLinear()
            .range([ this.height_nomargin, 0]);

        var x_bar = this.svg.append("g");

        var y_bar = this.svg.append("g");

        //setting axes label
        x_bar.append('text')
            .attr('id', 'axis-x-label')
            .attr('class', 'axis-label')
            .attr('x', this.width_nomargin / 2)
            .attr('y', this.height - (this.margin.bottom/2) + 5);

        y_bar.append('text')
            .attr('id', 'axis-y-label')
            .attr('class', 'axis-label')
            .attr('x', -this.height_nomargin / 2)
            .attr('y', -this.margin.left / 2 - 5)
            .attr('transform', `rotate(-90)`)
            .style('text-anchor', 'middle');

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height_nomargin + ")")
            .call(d3.axisBottom(this.x));

        this.svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(this.y));

        this.tooltip = this.container.append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Add brushing
        this.brush = d3.brush()  // Add the brush feature using the d3.brush function
            .extent( [ [0,0], [this.width_nomargin,this.height_nomargin] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            //.on("start brush", this.updateBrush.bind(this)) // Each time the brush selection changes, trigger the 'updateChart' function
            .on("end", this.endBrush.bind(this));

        this.svg.append('g')
          .attr('id', 'dots_area')
          .attr("clip-path", "url(#clip)")
          .append('g')
          .attr('id', 'brush')
          .call(this.brush);

        real_svg.append("defs").append("svg:clipPath")
          .attr("id", "clip")
          .append("svg:rect")
          .attr("width", this.width_nomargin )
          .attr("height", this.height_nomargin )
          .attr("x", 0)
          .attr("y", 0);


        this.domain_start_x = 0;
        this.domain_end_x = 20;
        this.domain_start_y = this.domain_start_x;
        this.domain_end_y = this.domain_end_x;
        this.draw();
    }

    // draw dots
    draw(doSampling) {
        if (doSampling) {
            if(this.pca) {
              let arr_x = this.data.map(elm => elm.x);
              let arr_y = this.data.map(elm => elm.y);

              this.domain_start_x = d3.min(arr_x);
              this.domain_end_x = d3.max(arr_x);

              this.domain_start_y = d3.min(arr_y);
              this.domain_end_y = d3.max(arr_y);
            }

            // update x axis labels
            this.x.domain([this.domain_start_x, this.domain_end_x])
            this.svg.select('g.x.axis')
                .transition()
                .duration(1000)
                .call(d3.axisBottom().scale(this.x));

            // update y axis labels
            this.y.domain([this.domain_start_y, this.domain_end_y])
            this.svg.select('g.y.axis')
                .transition()
                .duration(1000)
                .call(d3.axisLeft().scale(this.y));
        }
        var min = 0;

        // compute the max number of players in a single bubble
        // for each object in data, return the number of players in it and take the max
        var max;
        if(!this.pca){
            max = Math.max.apply(null, this.data.map(obj => obj.players_list.length));
        }else{
            max = 10;
            /*
            min = Math.min(d3.min(this.data.x), d3.min(this.data.y));
            max = Math.max(d3.max(this.data.x), d3.max(this.data.y));
            */
        }


        //define scale for r of points (maybe this function has some problems)
        this.sizeScale = d3.scaleLinear()
            .domain([min, max])
            .range([1,16]);
        //+++ end compute a matrix to give points size +++//

        //setting axes label
        this.svg.select('#axis-x-label')
            .transition()
            .duration(1000)
            .text(this.x_axis);

        this.svg.select('#axis-y-label')
            .transition()
            .duration(1000)
            .text(this.y_axis);

        // sampling
        //need to check the two dimensions
        this.drawed_points_x = [];
        this.drawed_points_y = [];

        this.svg.select('#dots_area')
          .selectAll("circle")
          .remove();
        //draw points
        let update = this.svg.select('#dots_area')
          .selectAll("circle")
          .data(this.data)
          .join(
            enter => {
              // active sampling based on flags
              enter = doSampling && this.pca ? enter.filter(d => this.sample(d)) : enter;

              return enter.append("circle")
                .on("click", d => {
                  this.resetBrush();
                  this.resetSelection();
                  this.handleElemSelection(d);
                })
                .on("mouseover", d => {
                  this.tooltip.transition().duration(300)
                    .style("opacity", 1)
                  if (!this.pca) {
                    this.tooltip.html( "<b>Players number:</b> <br> "
                    + d.players_list.length)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY -30) + "px");
                  }else{
                    this.tooltip.html( "<b>"
                    + d.name +"</b>")
                    .style("left", (d3.event.pageX - 152) + "px")
                    .style("top", (d3.event.pageY -30) + "px");
                  }
                })
                .on("mouseout", () => {
                  //if (!this.pca) {
                      this.tooltip.transition().duration(300)
                      .style("opacity", 0);
                  //}
                })
            },
            update => update,
            exit => exit.remove()
          );

      this.update(update);
      if (this.hasBrushActive) this.endBrush();
    }

    update(dots) {
      if (!dots) {
        if (!this.svg) return
        dots = this.svg.select('#dots_area')
          .selectAll("circle")
        if (!dots) return
      }
      if(!this.pca){
        dots.attr("cx", d => this.x(d.x))
            .attr("cy", d => this.y(d.y))
            .attr("r", d => this.sizeScale(d.players_list.length))
            .style("fill", "#a2a2a2")
            .style("opacity", "0.7")
            .attr("class", "bubble");
      }else{
        dots.classed("bubble", false);

        dots.attr("cx", d => this.x(d.x))
            .attr("cy", d => this.y(d.y))
            .attr("r", "3")
            .style("fill", d => rolesettings[d.role].color )
            .style("opacity", d => (d.role == this.pca_role) || this.pca_role == 0 ? "0.8" : "0.2");
      }
    }

    // A function that return TRUE or FALSE according if a dot is in the selection or not
    isBrushed(brush_coords, cx, cy) {
        if (!brush_coords) return false
        var x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
    }

    endBrush() {
        let extent = d3.event ? d3.event.selection : d3.brushSelection(this.svg.select('#brush').node());
        if (!extent && !d3.event) return // if brush is null and there's no event, don't do anything

        // If no selection, back to initial coordinate. Otherwise, select players
        if(!extent){
          if (d3.event.sourceEvent &&
            d3.event.sourceEvent.type !== 'end' &&
            d3.event.sourceEvent.type !==  'click')
            this.handleElemSelection();

          if (!this.idleTimeout) return this.idleTimeout = setTimeout(() => this.idled(), 350); // This allows to wait a little bit
          this.x.domain([ this.domain_start_x,this.domain_end_x])
          this.y.domain([ this.domain_start_y,this.domain_end_y])


          this.svg.select('g.x.axis').transition().duration(300).call(d3.axisBottom(this.x));
          this.svg.select('g.y.axis').transition().duration(300).call(d3.axisLeft(this.y));
          this.svg
            .selectAll("circle")//.selectAll(".brush_selected")
            .transition().duration(300)
            .attr("cx", d => this.x(d.x) )
            .attr("cy", d => this.y(d.y) )
          if (this.pca) {
            this.drawed_points_x = [];
            this.drawed_points_y = [];
            this.svg.selectAll('circle').filter(d => !this.sample(d)).remove();
          }
        } else {
            this.resetSelection();
            //this.x.domain([ this.x.invert(extent[0][0]), this.x.invert(extent[1][0]) ])
            //this.y.domain([ this.y.invert(extent[1][1]), this.y.invert(extent[0][1]) ])
            //this.svg.select('#brush').call(this.brush.move, null); // This remove the grey brush area as soon as the selection has been done

            // select all the players from data, not only those visible
            let dots = this.data.filter(d => {
              if(!this.pca || this.pca_role == d.role || this.pca_role==0){
                return this.isBrushed(extent, this.x(d.x), this.y(d.y))
              } else {
                return false
              }
            })

            // apply class to visible players
            this.svg.selectAll('circle')
              .classed('brush_selected',  d => {
                if(!this.pca || this.pca_role == d.role || this.pca_role==0){
                  return this.isBrushed(extent, this.x(d.x), this.y(d.y))
                } else {
                  return false
                }
              });
            // set dots to null at empty brush
            dots = dots.length > 0 ? dots : null
            this.handleElemSelection(dots);
        }
        /*
        // Update axis and circle position
        this.svg.select('g.x.axis').transition().duration(1000).call(d3.axisBottom(this.x))
        this.svg.select('g.y.axis').transition().duration(1000).call(d3.axisLeft(this.y))
        this.svg
          .selectAll("circle")//.selectAll(".brush_selected")
          .transition().duration(1000)
          .attr("cx", d => this.x(d.x) )
          .attr("cy", d => this.y(d.y) )
        */
    }

    resetSelection() {
      super.resetSelection();
      if (this.svg) this.svg.selectAll('.brush_selected').classed('brush_selected', false);
    }

    resetBrush() {
      if (this.svg) this.svg.select('#brush').call(this.brush.move, null);
      this.resetSelection();
    }

    hasBrushActive() {
      return d3.brushSelection(this.svg.select('#brush').node()) != null ? true : false
    }

    idled(){
        this.idleTimeout = null;
    }

    highlight(highlighted_data){

      //remove to all circle "selected" class
      this.svg.selectAll(".selected")
        .classed("selected", false);

      //if highlighted data array is not empty
      if(Array.isArray(highlighted_data) && highlighted_data.length){
        if (this.pca) {
          //add selected class to right data
          /*
          this.svg.selectAll("circle")
            .data(highlighted_data, d => d.id)
            .classed("selected", true);
          */

          this.svg.selectAll("circle")
            .filter( d => highlighted_data.includes(d.id))
            .classed("selected",true)

        } else {
          this.svg.selectAll("circle")
            .each(function(d) {
              for( let id of highlighted_data) {
                if(d.players_list.includes(id)) {
                  this.classList.add('selected'); //'this' now referes to html elem of d
                  return;
                }
              }
            })
        }
      }
    }

    sample(d) {
        let x_1=0, y_1 = 0, n_decimal = 0, computed_distance=0.0, rounded_x = 0.0, rounded_y = 0.0, too_near=false;
        //return false;

        x_1 = this.x(d.x);
        y_1 = this.y(d.y);

        rounded_x = this.round(x_1,n_decimal);
        too_near=false;
        //check if this role exist
        if(typeof this.drawed_points_x[d.role] === 'undefined') {
          this.drawed_points_x[d.role] = {};
        }
        //check line parallel to y axes proximity
        if(typeof this.drawed_points_x[d.role][rounded_x] === 'undefined') {
            // does not exist
            this.drawed_points_x[d.role][rounded_x] = Array();
        }

        // does exist
        //check if near y exist
        for (let y_2 of this.drawed_points_x[d.role][rounded_x]) {
          //here x_2 == x_1
          computed_distance = this.euclideanDist( x_1, y_1, x_1, y_2);

          if(computed_distance < this.minimum_distance){

            too_near = true;
            break;
          }
        }

        if(too_near)
          return false;


        too_near=false;
        rounded_y = this.round(y_1,n_decimal);
        //check if this role exist
        if(typeof this.drawed_points_y[d.role] === 'undefined') {
          this.drawed_points_y[d.role] = {};
        }
        //check line parallel to x axes proximity
        if(typeof this.drawed_points_y[d.role][rounded_y] === 'undefined') {
            // does not exist
            this.drawed_points_y[d.role][rounded_y] = Array();
        }

        // does exist
        //check if near x exist
        for ( let x_2 of this.drawed_points_y[d.role][rounded_y]) {
          //here y_2 == y_1
          computed_distance = this.euclideanDist( x_1, y_1, x_2, y_1);

          if(computed_distance < this.minimum_distance){

            too_near = true;
            break;
          }
        }

        if(too_near)
          return false;
        //if I survive to previous condition.. ok let's draw the point
        this.drawed_points_y[d.role][rounded_y].push(x_1);
        this.drawed_points_x[d.role][rounded_x].push(y_1);
        return true;
    }

  /**
   * return the euclidean distance between two points.
   *
   * @param {number} x1		x position of first point
   * @param {number} y1		y position of first point
   * @param {number} x2		x position of second point
   * @param {number} y2		y position of second point
   * @return {number} 		distance between given points
   */
    euclideanDist( x1, y1, x2, y2 ){

        var 	xs = x2 - x1,
          ys = y2 - y1;

        xs *= xs;
        ys *= ys;

        return Math.sqrt( xs + ys );

    }

    round(number, n_decimal){
      return parseFloat(number).toFixed(n_decimal);
    }

    // override
    handleElemSelection(elems) {
      try{ d3.event.stopPropagation() } catch {}
      const manageElem = (e) => {
        if (!this.selected_elems.includes(e)) {
          // if it is not selected then select it
          this.selected_elems.push(e)
          try { d3.event.target.classList.add('selected') } catch {}
        }
      }

      // on empty selection deselect all
      if(!elems) {
        this.resetSelection();
      } else if (elems.length >= 1) {
        elems.forEach(e => manageElem(e));
      } else {
        this.resetSelection();
        manageElem(elems);
      }

      // call callback and give the selected elems (to the controller)
      this.onElemSelection(this.selected_elems);
    }

    zoomBrush() {
      let point0 = this.svg.select('rect.handle--nw'); //north west
      let point1 = this.svg.select('rect.handle--se'); //south east

      this.x.domain([ this.x.invert(point0.attr('x')), this.x.invert(point1.attr('x')) ]);
      this.y.domain([ this.y.invert(point1.attr('y')), this.y.invert(point0.attr('y')) ]);
      this.svg.select('#brush').call(this.brush.move, null);
      this.draw();
      this.svg.select('g.x.axis').transition().duration(300).call(d3.axisBottom(this.x));
      this.svg.select('g.y.axis').transition().duration(300).call(d3.axisLeft(this.y));
      this.svg
        .selectAll("circle")//.selectAll(".brush_selected")
        .transition().duration(300)
        .attr("cx", d => this.x(d.x) )
        .attr("cy", d => this.y(d.y) )


    }

    get x_ax() {
        return this.x_axis;
    }

    set x_ax(val) {
        this.x_axis = val;
    }

    get y_ax() {
        return this.y_axis;
    }

    set y_ax(val) {
        this.y_axis = val;
    }

    get data() {
      return this._data;
    }

    set data(data) {
      this._data = data;
      if (this.svg) this.draw(true);
    }

    set minimum_distance(dist) {
      this._minimum_distance = parseFloat(dist + 50);
    }

    get minimum_distance() {
      return this._minimum_distance;
    }
}