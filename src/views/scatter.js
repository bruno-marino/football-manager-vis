import * as d3 from "d3";
import View from "./view";
import rolesettings from '../controller/rolesettings.json'

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

        //+++ compute a matrix to give points size +++//

        //Initialize matrix
        var matrix = [];
        for(var i=0; i<=20; i++) {
            matrix[i] = [];
            for(var j=0; j<=20; j++) {
                matrix[i][j] = 0;
            }
        }

        var x_i = 0
        var y_i = 0
        var current = 0
        var max = 0
        var min = 0
        //conting point per matrix entry
        this.data.forEach(element => {
            y_i = parseInt(element[this.y_axis]);
            x_i = parseInt(element[this.x_axis]);
            current = matrix[y_i][x_i] + 1;
            matrix[y_i][x_i] = current;

            if(current > max){
                max = current;
            }

        });

        console.log(max)
        //define scale for r of points (maybe this function has some problems)
        var sizeScale = d3.scaleLinear()
            .domain([min, max])
            .range([1,16]);
        //+++ end compute a matrix to give points size +++//
        
        //console.log(matrix);

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
            .attr("r", d => sizeScale(matrix[parseInt(d[this.y_axis])][parseInt(d[this.x_axis])]) )
            .style("fill", "#a2a2a2")
            .style("opacity", "0.7")
            .style("stroke", "#000000")
            .style("stroke-width", 1)
            //ToolTip
            .on("mouseover", d => {
                this.tooltip.transition().duration(300)
                .style("opacity", 1)
                /*
                this.tooltip.html("<b>" + d["name"] + "</b> <br> " + this.x_axis
                + ": " + parseFloat( d[this.x_axis]) +"<br>" + this.y_axis
                + ": " + parseFloat( d[this.y_axis]))
                
                */
                y_i = parseInt(d[this.y_axis])
                x_i = parseInt(d[this.x_axis])
                this.tooltip.html( "<b>Players number:</b> <br> "
                + matrix[parseInt(d[this.y_axis])][parseInt(d[this.x_axis])] )
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