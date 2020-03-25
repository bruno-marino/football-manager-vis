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

        
        this.margin = {top: 10, right: 30, bottom: 60, left: 60};
        this.width_nomargin = this.width - this.margin.left - this.margin.right;
        this.height_nomargin = this.height - this.margin.top - this.margin.bottom;

        // Update this.svg in ordert to contain axis
        this.svg = this.svg.append("g")
                .attr("transform","translate(" + this.margin.left + "," + this.margin.top + ")");

        // Add X axis
        this.x = d3.scaleLinear()
            .range([ 0, this.width_nomargin ]);

        // Add Y axis
        this.y = d3.scaleLinear()
            .range([ this.height_nomargin, 0]);

        var x_bar = this.svg.append("g")
            .attr("transform", "translate(0," + this.height_nomargin + ")");       
            
        var y_bar = this.svg.append("g");

        //setting axes label
        x_bar.append('text')
            .attr('id', 'axis-x-label')
            .attr('class', 'axis-label')
            .attr('x', this.width_nomargin / 2)
            .attr('y', (this.margin.left/2) + 10)
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

        //console.log(this.data);
        this.draw();
    }

    // draw countries
    draw() {
        var domain_start_x = 0;
        var domain_end_x = 20;
        var domain_start_y = domain_start_x;
        var domain_end_y = domain_end_x;

        if(this.pca){
          let arr_x = this.data.map(elm => elm.x);
          let arr_y = this.data.map(elm => elm.y);

          domain_start_x = d3.min(arr_x);
          domain_end_x = d3.max(arr_x);
          
          domain_start_y = d3.min(arr_y);
          domain_end_y = d3.max(arr_y);
        }
      
        // update x axis labels
        this.x.domain([domain_start_x, domain_end_x])
        this.svg.select('g.x.axis')
            .transition()
            .duration(1000)
            .call(d3.axisBottom().scale(this.x));
        
        // update y axis labels
        this.y.domain([domain_start_y, domain_end_y])
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
        this.svg.selectAll("circle")
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
        dots.transition().duration(1000)
            .attr("cx", d => this.x(d.x))
            .attr("cy", d => this.y(d.y))
            .attr("r", d => this.sizeScale(d.players_list.length))
            .style("fill", "#a2a2a2")
            .style("opacity", "0.7")
            .style("stroke", "#000000")
            .style("stroke-width", 1);
      }else{
        dots.transition().duration(1000)
            .attr("cx", d => this.x(d.x))
            .attr("cy", d => this.y(d.y))
            .attr("r", "5")
            .style("fill", "#a2a2a2")
            .style("opacity", "0.7")
            .style("stroke", "#000000")
            .style("stroke-width", 1);
      }
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