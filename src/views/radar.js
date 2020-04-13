import * as d3 from "d3";
import View from "./view";

export default class RadarChart extends View {
  constructor(container) {
    super(container, true);

    this.cfg = {
      radius: 4,
      levels: 5,
      maxValue: 20,
      ToRight: 5,
      margin_y: 20,
    };   
    this.axis_scale = d3.scaleLinear();
  }

  init(container) {
    super.init(container);

    this.players_number = 100;

    this.legend_label = "Selected countries";

    this.svg.append("g")
      //.attr("transform", "translate(" + this.cfg.TranslateX + "," + this.cfg.TranslateY + ")");
    
    // add level circles
    var fill_color = ["#c87572","#e3bf6b","#eee9a6","#cadd9e","#9eb36f"]
    for (var j = this.cfg.levels -1; j >= 0; j--) {
      
      var levelFactor = (this.height * ((j + 1) / this.cfg.levels))/2 - this.cfg.margin_y;
      var fillc = fill_color[j];
      this.svg.select('g')
        .append("svg:circle")
        .attr("class", "levels")
        .attr("cx", this.width / 2)
        .attr("cy", this.height / 2)
        .attr("fill", fillc)
        .attr("stroke", "gray")
        .attr("r", levelFactor)        
        //.attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
    }

    for (var j = this.cfg.levels -1; j >= 0; j--) {
      var levelFactor = (this.height * ((j + 1) / this.cfg.levels))/2 - 20;
      var fillc = fill_color[j];
      // text indicating at what value each level is
      this.svg.select('g')
      .append("svg:text")
      .attr("class", "legend")
      .attr("x", (this.width / 2) + this.cfg.ToRight)
      .attr("y", (this.height / 2) - levelFactor)
      .text((j + 1) * this.cfg.maxValue / this.cfg.levels);
    }

    this.svg.select('g').append("g").attr("id","axis_group")
    this.svg.select('g').append("g").attr("id", "circles_group")

    //Tooltip
    this.tooltip = this.container
      .append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 0);

    this.axis_scale.domain([0, 20]);
    this.axis_scale.range([0, this.height / 2 - this.cfg.margin_y]);
  }

  // draw axis + labels, legend, circles and area 
  draw() {


    //console.log(this.data);

    //Update legend text
    d3.select('#radar-legend-color')
    .text(this.legend_label);

    // draw axis + labels
    this.svg.select('#axis_group')
      .selectAll(".axis")
      .data(this.data, d => d.axis)
      .join(
        // add an axis for each new axis in data
        enter => {
          let axis = enter.append('g')
            .attr("class", "axis" )
            .on('mouseover', d => this.showTooltip(d))
            .on('mouseout', () => this.hideTooltip());
          
          axis.append("line")
            .attr("class", "line");

          axis.append("text")
            .attr("class", "axis_legend");

          this.update(axis, 'axis');
        },
        // update an axis for each already existent axis in data
        update => {
          update = update.transition().duration(1000);
          this.update(update, 'axis');
        },
      )

    // draw areas
    this.svg.select('#circles_group')
      .selectAll(".area")
      .data([true])
      .join(
        enter => {
          let area = enter.append("polygon")
            .attr("class", "area")
          
          this.update(area, 'area')
        },
        update => {
          update = update.transition().duration(1000);
          this.update(update,'area');
        }
      )

    let color = "#88419D";
    if(this.players_number==1)
      color = "#1f77b4";

    // draw circles
    this.svg.select("#circles_group")
      .selectAll(".node")
      .data(this.data)
      .join(
        enter => {
          let nodes = enter.append("svg:circle")
            .attr("class", "node")
            .attr("fill", color )
            .attr('r', this.cfg.radius)
            .on('mouseover', d => {
              this.showTooltip(d);

              d3.select('#radar')
                .select('.polygon')
                .transition(200)
                .style("fill-opacity", 0.7);
            })
            .on('mouseout', () => {
              this.hideTooltip()
              d3.select('#radar')
                .selectAll("polygon")
                .transition(200)
                .style("fill-opacity", 0.2);
            });

          this.update(nodes, 'node');
        },
        update => {
          update = update.transition().duration(1000);
          this.update(update, 'node');
        },
      )

  }

  update(elems, type) {
    switch(type) {
      case 'axis':
        let radius = this.height / 2 - this.cfg.margin_y;
        
        elems.selectAll('.line')
          .attr("x1", this.width / 2)
          .attr("y1", this.height / 2)
          .attr("x2", d => {
            let i = this.getDatumIndex(d);
            return this.projectOnX(radius, i);
          })
          .attr("y2", d => {
            let i = this.getDatumIndex(d);
            return this.projectOnY(radius, i);
          });
        
        let i = 0;
        let label_position = radius + 15;
        elems.selectAll('.axis_legend')
          .text(d => d.axis)
          .attr("transform", "translate(0, 5)")
          .attr("x", d => {
            i = this.getDatumIndex(d);
            return this.projectOnX(label_position, i);
          })
          .attr("y", d => {
            i = this.getDatumIndex(d);
            return this.projectOnY(label_position, i);
          })
          .attr('text-anchor', (d) => {
            i = this.getDatumIndex(d);
            let x_coordinate = this.projectOnX(label_position, i)
            if (x_coordinate == this.width / 2 ) {
              return 'middle';
            } else if (x_coordinate > this.width / 2 ) { 
              return 'start';
            } else {
              return 'end';
            }
          });

        break;

      case 'node':
        elems.attr("cx", d => {
            let i = this.getDatumIndex(d);
            let value = this.axis_scale(d.value);
            return this.projectOnX(value, i)
          })
          .attr("cy", d => {
            let i = this.getDatumIndex(d);
            let value = this.axis_scale(d.value);
            return this.projectOnY(value, i);
          })
        break

      case 'area':
        elems.attr("points", this.getPolygon(this.data))
    }

  }

  showTooltip(d) {
    let newX = d3.event.pageX;
    let newY = d3.event.pageY - 30;

    this.tooltip
      .style('left', newX + 'px')
      .style('top', newY + 'px')
      .text(d.value.toFixed(2))
      .style('opacity', 1);
  }

  hideTooltip() {
    this.tooltip.style('opacity', 0);
  }

  projectOnX(value, i) {
    /**
     * projection on X axis = r * cos(alfa) 
     * our alfa is i times angle
     * our r is value
     * 
     * this.width / 2 is the center of the circle
     * 
     * this if we start from 0 radians, we want to start from pi/2 instead.
     * this is actually the same as using the sin
    **/
    let alfa = (i * this.angle) + Math.PI / 2
    return this.width / 2 + (Math.cos(alfa) * value)
  }

  projectOnY(value, i) {
    /**
     * projection on Y axis = r * sin(alfa) 
     * our alfa is i times angle
     * our r is value
     * 
     * this.height / 2 is the center of the circle
     * 
     * this if we start from 0 radians, we want to start from pi/2 instead.
    **/
    let alfa = (i * this.angle) + Math.PI / 2
    // minus because the Y axis goes down instead of up
    return this.height / 2 - (Math.sin(alfa) * value)
  }

  getDatumIndex(d) {
    return this.data.findIndex(elem => elem.axis === d.axis)
  }

  get angle() {
    return (2 * Math.PI) / this.data.length;
  }

  // for now series is always this.data
  getPolygon(series) {
    let poly = [];

    series.forEach((d, i) => {
      let value_on_axis = this.axis_scale(d.value);
      let x = this.projectOnX(value_on_axis, i);
      let y = this.projectOnY(value_on_axis, i);
      poly.push([x,y].join(','));
    })
    
    return poly.join(' ');
  }

  updateColor(){
    //console.log(this.players_number);

    let color = "#88419D";
    if(this.players_number == 1)
      color = "#1F77B4";

    this.svg.selectAll(".area")
      .style("fill", color)
      .style("stroke", color);
    
      this.svg.selectAll(".node")
      .attr("fill", color);

      d3.select(".radar-legend-square")
      .style("background", color);
  }
}