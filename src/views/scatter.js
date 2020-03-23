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

        
        var margin = {top: 10, right: 30, bottom: 60, left: 60};
        var width = this.width - margin.left - margin.right;
        var height = this.height - margin.top - margin.bottom;

        // Update this.svg in ordert to contain axis
        this.svg = this.svg.append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        this.x = d3.scaleLinear()
            .domain([0, 20])
            .range([ 0, width ]);

        // Add Y axis
        this.y = d3.scaleLinear()
            .domain([0, 20])
            .range([ height, 0]);

        var x_bar = this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(this.x));          
            
        var y_bar = this.svg.append("g")
            .call(d3.axisLeft(this.y));

        //setting axes label
        x_bar.append('text')
            .attr('id', 'axis-x-label')
            .attr('class', 'axis-label')
            .attr('x', width / 2)
            .attr('y', (margin.left/2) + 10)
            .style("fill", "#000000");
      
        y_bar.append('text')
            .attr('id', 'axis-y-label')
            .attr('class', 'axis-label')
            .attr('x', -height / 2)
            .attr('y', -margin.bottom / 2)
            .attr('transform', `rotate(-90)`)
            .style("fill", "#000000") 
            .style('text-anchor', 'middle');

        this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(this.x));          
            
        this.svg.append("g")
            .call(d3.axisLeft(this.y));


        this.tooltip = this.container.append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);

        /*
        this.data = [
            {name: "Ronaldo", crossing: 12, kicking: 16 },
            {name: "Messi", crossing: 13, kicking: 15 },
            {name: "Bruno", crossing: 20, kicking: 19 },
            {name: "Gianluca", crossing: 19, kicking: 20 }
        ]
        */
        //console.log(this.data);
        this.draw();
    }

    // draw countries
    draw() {
        var min = 0;

        // compute the max number of players in a single bubble
        // for each object in data, return the number of players in it and take the max
        var max = Math.max.apply(null, this.data.map(obj => obj.players_list.length));

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
                //ToolTip
                .on("mouseover", d => {
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
                .on("click", this.handleElemSelection.bind(this));

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
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
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