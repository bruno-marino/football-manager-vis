import * as d3 from "d3";
import View from "./view";
import rolesettings from '../controller/rolesettings.json'

export default class Scatterplot extends View {
    constructor(container) {
        super(container);
    }

    init(container) {    
        super.init(container);

        this.x_axis = "aerial_ability";
        this.y_axis = "aerial_ability";

        this.pca = false;
        this.pca_role = "0";
        
        this.idleTimeout = null;

        this.domain_start_x = 0;
        this.domain_end_x = 20;
        this.domain_start_y = this.domain_start_x;
        this.domain_end_y = this.domain_end_x;
        
        this.margin = {top: 10, right: 30, bottom: 60, left: 60};
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
            .attr('y', this.height - (this.margin.bottom/2))
            .style("fill", "#000000");
        
        y_bar.append('text')
            .attr('id', 'axis-y-label')
            .attr('class', 'axis-label')
            .attr('x', -this.height_nomargin / 2)
            .attr('y', -this.margin.bottom / 2)
            .attr('transform', `rotate(-90)`)
            .style("fill", "#000000") 
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
            .extent( [ [0,0], [this.width,this.height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("start brush", this.updateBrush.bind(this)) // Each time the brush selection changes, trigger the 'updateChart' function
            .on("end", this.endBrush.bind(this));

        this.svg.append('g')
          .attr('id', 'brush')
          .attr("clip-path", "url(#clip)")
          .call(this.brush);

        real_svg.append("defs").append("svg:clipPath")
          .attr("id", "clip")
          .append("svg:rect")
          .attr("width", this.width_nomargin )
          .attr("height", this.height_nomargin )
          .attr("x", 0)
          .attr("y", 0);

        //console.log(this.data);
        this.draw();
    
    }

    // draw countries
    draw() {
        this.domain_start_x = 0;
        this.domain_end_x = 20;
        this.domain_start_y = this.domain_start_x;
        this.domain_end_y = this.domain_end_x;

        if(this.pca){
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

        //draw points
        this.svg.select('#brush')
          .selectAll("circle")
          .data(this.data)
          .join(
            enter => {
              let circles = enter.append("circle")
                .on("click", this.handleElemSelection.bind(this));
                
                if (!this.pca) {
                  //ToolTip
                  circles.on("mouseover", d => {
                    this.tooltip.transition().duration(300)
                    .style("opacity", 1)
                    this.tooltip.html( "<b>Players number:</b> <br> "
                    + d.players_list.length)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY -30) + "px");
                  })
                  .on("mouseout", () => {
                        this.tooltip.transition().duration(300)
                        .style("opacity", 0);
                  })
                }

              this.update(circles);
            },

            update => this.update(update),
          );

    }

    update(dots) {

      if(!this.pca){
        dots.transition().duration(300)
            .attr("cx", d => this.x(d.x))
            .attr("cy", d => this.y(d.y))
            .attr("r", d => this.sizeScale(d.players_list.length))
            .style("fill", "#a2a2a2")
            .style("opacity", "0.7")
            .style("stroke", "#000000")
            .style("stroke-width", 1);
      }else{
        dots.transition().duration(300)
            .attr("cx", d => this.x(d.x))
            .attr("cy", d => this.y(d.y))
            .attr("r", "3")
            .style("fill", d => rolesettings[d.role].color )
            .style("opacity", d => (d.role == this.pca_role) || this.pca_role == 0 ? "0.8" : "0.2")
            .style("stroke", "none");//resetting stroke
            //.on("end", this.brushsing);
            /*
            .style("stroke", "#000000")
            .style("stroke-width", 1);
            */
      }
    }

    updateBrush(){
        let circles = this.svg.selectAll('circle');
        //console.log(d3.event);
        let extent = d3.event.selection

        if(!extent && d3.event.sourceEvent.type === 'end') {
          return
        }

        circles.classed("brush_selected", d => { 
            if(!this.pca || this.pca_role == d.role || this.pca_role==0){
                return this.isBrushed(extent,this.x(d.x), this.y(d.y) ) 
            }else{
                return false;
            }
        } )

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
        let extent = d3.event.selection
        // If no selection, back to initial coordinate. Otherwise, update X axis domain
        if(!extent){
            if (!this.idleTimeout) return this.idleTimeout = setTimeout(() => this.idled(), 350); // This allows to wait a little bit
            this.x.domain([ this.domain_start_x,this.domain_end_x])
            this.y.domain([ this.domain_start_y,this.domain_end_y])
        }else{
          this.x.domain([ this.x.invert(extent[0][0]), this.x.invert(extent[1][0]) ])
          this.y.domain([ this.y.invert(extent[1][1]), this.y.invert(extent[0][1]) ])
          this.svg.select('#brush').call(this.brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }
        // Update axis and circle position
        this.svg.select('g.x.axis').transition().duration(1000).call(d3.axisBottom(this.x))
        this.svg.select('g.y.axis').transition().duration(1000).call(d3.axisLeft(this.y))
        this.svg
          .selectAll("circle")//.selectAll(".brush_selected")
          .transition().duration(1000)
          /*
          .filter(d => {
            if(!this.pca || this.pca_role == d.role || this.pca_role==0){
                return true; 
            }else{
                return false;
            }
           })*/
          .attr("cx", d => this.x(d.x) )
          .attr("cy", d => this.y(d.y) )
    }

    idled(){
        this.idleTimeout = null;
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

}