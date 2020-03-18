import * as d3 from "d3";
import View from "./view";

export default class Scatterplot extends View {
    constructor(container) {
        super(container);
    }

    init(container) {    
        super.init(container);
        this.x_axis = "crossing";
        this.y_axis = "kicking";

        var margin = {top: 10, right: 30, bottom: 60, left: 60};
        var width = this.width - margin.left - margin.right;
        var height = this.height - margin.top - margin.bottom;

        // Update this.svg in ordert to contain axis
        this.svg = this.svg.append("g")
                .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 20])
            .range([ 0, width ]);

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 20])
            .range([ height, 0]);

        var x_bar = this.svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));          
            
        var y_bar = this.svg.append("g")
            .call(d3.axisLeft(y));

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
            .call(d3.axisBottom(x));          
            
        this.svg.append("g")
            .call(d3.axisLeft(y));



        this.draw();
    }

    // draw countries
    draw() {

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
        this.svg.append('g')
          .selectAll("dot")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x( d[this.x_axis]); } )
            .attr("cy", function (d) { return y( d[this.y_axis]); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2")    

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