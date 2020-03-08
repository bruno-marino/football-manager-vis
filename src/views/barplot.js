import * as d3 from 'd3';
import View from './view';

export default class BarPlot extends View{
  constructor(container) {
    super(container);
  }

  init(container) {
    super.init(container);
    let margin = {top: 10, right: 20, bottom: 25, left: 100};

    // X axis scale
    this.x = d3.scaleLinear()
    .domain([0, 20])
    .range([ margin.left , this.width - margin.right]);

    this.svg
      .append('g')
      .attr('id','x-axis')
      .attr("transform", "translate(0," + (this.height - margin.bottom) + ")")
      .call(d3.axisBottom().scale(this.x));
    
    // Y axis scale
    this.y = d3.scaleBand()
      .range([this.height - margin.bottom, margin.top])
      .padding(1);

    this.svg
      .append('g')
      .attr('id','y-axis')
      .attr("transform", "translate(" + margin.left + ", 0 )");
  }

  draw() {
    // update y axis labels
    this.y.domain(this.data.map(d => d.desc));
    this.svg.select('#y-axis')
      .transition()
      .duration(1000)
      .call(d3.axisLeft().scale(this.y));
      
    
    // Lines
    this.svg.selectAll(".line")
      .data(this.data)
      .join(
        enter => {
          let lines = enter.append("line").attr('class','line');
          this.update(lines, 'line');
        },
        update => {
          let lines = update.transition().duration(1000);
          this.update(lines, 'line');
        }          
      )
      

    // Circles
    this.svg.selectAll(".circle")
      .data(this.data)
      .join(
        enter => {
          let circles = enter.append("circle")
            .attr("class","circle")
            .attr("r",6);
          this.update(circles, 'circle');
        },
        update => {
          let circles = update.transition().duration(1000);
          this.update(circles, 'circle');
        }
      )
  }

  update(elems, type) {
    switch(type) {
      case 'line' :
        elems.attr("y1", d => this.y(d.desc) )
          .attr("y2", d => this.y(d.desc) )
          .attr("x1", d => this.x(d.value) )
          .attr("x2", this.x(0));
        break;
      case 'circle' :
        elems.attr("cy", d => this.y(d.desc) )
          .attr("cx", d => this.x(d.value) )
        break;
    }
  }
}