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

        this.data = [
            {name: "Ronaldo", crossing: 12, kicking: 16 },
            {name: "Messi", crossing: 13, kicking: 15 },
            {name: "Bruno", crossing: 20, kicking: 19 },
            {name: "Gianluca", crossing: 19, kicking: 20 }
        ]

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
            .attr("cx", d => this.x( d[this.x_axis] ) )
            .attr("cy", d => this.y( d[this.y_axis] ) )
            .attr("r", 10)
            .style("fill", "#69b3a2")

            //ToolTip
            .on("mouseover", d => {
                this.tooltip.transition().duration(300)
                .style("opacity", 1)
                this.tooltip.html("<b>" + d["name"] + "</b> <br> " + this.x_axis
                + ": " + parseFloat( d[this.x_axis]).toFixed(2) +"<br>" + this.y_axis
                + ": " + parseFloat( d[this.y_axis]).toFixed(2))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -30) + "px");
            })
            .on("mouseout", () => {
                this.tooltip.transition().duration(300)
                .style("opacity", 0);
            });

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