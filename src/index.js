import 'normalize.css';
import './index.scss';
import app from './app';

app();

/*
to be removed and to be put in assets (maybe) or in another place
*/

const roles_settings = window.app.rolesettings;

//Radar chart -Range selection
var radar_type = new Array();
radar_type["1"] = "principal";
radar_type["2"] = "physical";
radar_type["3"] = "mental";

d3.select('#range-type') 
  .on('change', function() {
    var value = eval(d3.select(this).property('value'));
    //radarchart.data = radarSetOfSkills(radar_type[value], countries, this.model.players);
    window.app.onRadarTypeChange(radar_type[value]);
});
//End Radar chart -Range selection

/* Dinamically create select box color scale */

/* sample to be injected
<span class='custom-option selected' data-value='1'>
<img class="role_img" src="/assets/img/role_1.png" height="24" width="24" alt="Goalkeepers">
<span class="role_name_container">Goalkeepers</span>
</span>
*/
var role_j = roles_settings[0];
var created_content = "";

created_content = "<img class='role_img' src='/assets/" + role_j.img_path + "' height='24' width='24' alt='" + role_j.role_name + "'>";
created_content = created_content + "<span class='role_name_container'>" + role_j.role_name + "</span>";
document.getElementById("first-scale").innerHTML = created_content;


created_content = "";
for(var j = 0; j <= 4; j++){
  role_j = roles_settings[j];
  if(j==0){
    created_content = created_content + "<span class='custom-option selected' data-value='" + j + "'>";
  }else{
    created_content = created_content + "<span class='custom-option' data-value='" + j + "'>";
  }

  created_content = created_content + "<img class='role_img' src='/assets/" + role_j.img_path + "' height='24' width='24' alt='" + role_j.role_name + "'>";
  created_content = created_content + "<span class='role_name_container'>" + role_j.role_name + "</span>";
  created_content = created_content + "</span>";
}

document.getElementById("scale-container").innerHTML = created_content;
/* End dinamically create select box color scale */

/* Select box code */

for (const dropdown of document.querySelectorAll(".custom-select-wrapper")) {
  dropdown.addEventListener('click', function () {
      this.querySelector('.custom-select').classList.toggle('open');
  })
}

for (const option of document.querySelectorAll('.custom-option')) {
  option.addEventListener('click', function () {
      if (!this.classList.contains('selected')) {
          this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
          this.classList.add('selected');
          this.closest('.custom-select').querySelector('.custom-select__trigger span').innerHTML = this.innerHTML;
          //console.log(this.innerHTML);
          //change color scale in the map
          window.app.onRoleChange(parseInt(this.getAttribute('data-value')));
      }
  })
}

window.addEventListener('click', function (e) {
  for (const select of document.querySelectorAll('.custom-select')) {
      if (!select.contains(e.target)) {
          select.classList.remove('open');
      }
  }
});

/* End select box code */

/* end to be removed and put in assets*/




import * as d3 from "d3";


var wMaior = 400;
var wMenor = 200;

var colorscale = d3.scaleOrdinal(d3.schemeCategory10);
var legendOptions = ['Legend 1'];
var size = 2;

if (size > 0) {
  var json = [
    [{
      "axis": "A",
      "value": 6
    }, {
      "axis": "B",
      "value": 4
    }, {
      "axis": "C",
      "value": 6
    }, {
      "axis": "D",
      "value": 5.5
    }, {
      "axis": "E",
      "value": 8
    }, {
      "axis": "F",
      "value": 7
    }, {
      "axis": "G",
      "value": 9
    }, {
      "axis": "H",
      "value": 10
    }, {
      "axis": "I",
      "value": 3.5
    }]
  ];
}

function drawRadarCharts() {
  drawRadarChart('#chart-radar', wMaior, wMaior);
};

function drawRadarChart(divId, w, h) {
  var textSizeLevels = "10px !important";
  var textSizeTooltip = "13px !important";
  var textSizeLegend = "11px !important";
  var circleSize = 5;
  var strokeWidthPolygon = "2px";

  var RadarChart = {
    draw: function(id, data, options) {
      var cfg = {
        radius: circleSize,
        w: w,
        h: h,
        factor: 1,
        factorLegend: .85,
        levels: 3,
        maxValue: 0,
        radians: 2 * Math.PI,
        opacityArea: 0.001,
        ToRight: 5,
        TranslateX: 80,
        TranslateY: 30,
        ExtraWidthX: 10,
        ExtraWidthY: 100,
        color: d3.scaleOrdinal(d3.schemeCategory10)
      };

      if ('undefined' !== typeof options) {
        for (var i in options) {
          if ('undefined' !== typeof options[i]) {
            cfg[i] = options[i];
          }
        }
      }

      cfg.maxValue = Math.max(cfg.maxValue, d3.max(data, function(i) {
        return d3.max(i.map(function(o) {
          return o.value;
        }));
      }));
      var allAxis = (data[0].map(function(i, j) {
        return i.axis;
      }));
      var total = allAxis.length;
      var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
      
      var svg = d3.select(id).select('svg'),
          polyPoints = null;
      if (svg.node()){
         polyPoints = svg.select("polygon").attr("points");
         svg.remove(); 
      }

      var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w + cfg.ExtraWidthX)
        .attr("height", cfg.h + cfg.ExtraWidthY)
        .attr("class", "graph-svg-component")
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

      var tooltip;

      // Circular segments
      /*
      for (var j = 0; j < cfg.levels - 1; j++) {
        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        g.selectAll(".levels")
          .data(allAxis)
          .enter()
          .append("svg:line")
          .attr("x1", function(d, i) {
            return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
          })
          .attr("y1", function(d, i) {
            return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
          })
          .attr("x2", function(d, i) {
            return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
          })
          .attr("y2", function(d, i) {
            return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
          })
          .attr("class", "line")

        .style("stroke", "grey")
          .style("stroke-opacity", "0.75")
          .style("stroke-width", "0.3px")
          .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
      }
      */
     //let ticks = [2,4,6,8,10];


     // ['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641']
      //old ["#c87572","#e3bf6b","#eee9a6","#cadd9e","#9eb36f"]
     //color brewer //['#d7191c','#fdae61','#ffffbf','#a6d96a','#1a9641']
     //circle of the radar
     var fill_color = ["#c87572","#e3bf6b","#eee9a6","#cadd9e","#9eb36f"]
     for (var j = cfg.levels -1; j >= 0; j--) {
     
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      var fillc = fill_color[j];
      g.selectAll(".levels")
        .data(allAxis)
        .enter()
        .append("svg:circle")
        .attr("cx", cfg.w / 2)
        .attr("cy", cfg.h / 2)
        .attr("fill", fillc)
        .attr("stroke", "gray")
        .attr("r", levelFactor)

        .style("stroke", "#E8E8E8")
        .style("stroke-opacity", "0.50")
        .style("stroke-width", "1px")
        //.attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
    }



      // Text indicating at what % each level is
      for (var j = 0; j < cfg.levels; j++) {
        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        g.selectAll(".levels")
          .data([1]) //dummy data
          .enter()
          .append("svg:text")
          .attr("x", function(d) {
            return levelFactor * (1 - cfg.factor * Math.sin(0));
          })
          .attr("y", function(d) {
            return levelFactor * (1 - cfg.factor * Math.cos(0));
          })
          .attr("class", "legend")
          .style("font-family", "sans-serif")
          .style("font-size", textSizeLevels)
          .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
          .attr("fill", "#737373")
          .text((j + 1) * cfg.maxValue / cfg.levels);
      }

      var series = 0;

      var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", axis);

      axis.append("line")
        .attr("x1", cfg.w / 2)
        .attr("y1", cfg.h / 2)
        .attr("x2", function(d, i) {
          return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
        })
        .attr("y2", function(d, i) {
          return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
        })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");

      axis.append("text")
        .attr("class", "legend")
        .text(function(d) {
          return d;
        })
        .style("font-family", "sans-serif")
        .style("font-size", textSizeLegend)
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function(d, i) {
          return "translate(0, -10)";
        })
        .attr("x", function(d, i) {
          return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
        })
        .attr("y", function(d, i) {
          return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
        });
      
      var dataValues = [];
      var z = "";
      data.forEach(function(y, x) {
        
        g.selectAll(".nodes")
          .data(y, function(j, i) {
            dataValues.push([
              cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
              cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
            ]);
          });
        dataValues.push(dataValues[0]);
        g.selectAll(".area")
          .data([dataValues])
          .enter()
          .append("polygon")
          .attr("points", function(d){
            if (polyPoints)
              return polyPoints;
            else
              return d3.range(d.length).map(function(){
                return (cfg.w / 2) + "," + (cfg.h / 2)
              }).join(" ");
          })
          .attr("class", "radar-chart-series_" + series)
          .style("stroke-width", strokeWidthPolygon)
          .style("stroke", cfg.color(series))
          .style("fill-opacity", cfg.opacityArea)
          .on('mouseover', function(d) {
            z = "polygon." + d3.select(this).attr("class");
            g.selectAll("polygon")
              .transition(200)
              .style("fill-opacity", 0.1);
            g.selectAll(z)
              .transition(200)
              .style("fill-opacity", 0.7);
          })
          .on('mouseout', function() {
            g.selectAll("polygon")
              .transition(200)
              .style("fill-opacity", cfg.opacityArea);
          })
          .transition()
          .duration(2000)
          .attr("points", function(d) {
            var str = "";
            for (var pti = 0; pti < d.length; pti++) {
              str = str + d[pti][0] + "," + d[pti][1] + " ";
            }
            return str;
          })
          .style("fill", function(j, i) {
            return cfg.color(series);
          })

        series++;
      });

      series = 0;
      var newX = 0;
      var newY = 0;
      data.forEach(function(y, x) {
        var c = g.selectAll(".nodes")
          .data(y).enter()
          .append("svg:circle")
          .attr("class", "radar-chart-series_" + series)
          .attr('r', cfg.radius)
          .attr("alt", function(j) {
            return Math.max(j.value, 0);
          })
          .attr("cx", function(j, i) {
            dataValues.push([
              cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
              cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
            ]);
            return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
          })
          .attr("cy", function(j, i) {
            return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
          })
          .attr("data-id", function(j) {
            return j.axis;
          })
          .style("fill", cfg.color(series))
          .style("fill-opacity", 0)
          .on('mouseover', function(d) {
            newX = parseFloat(d3.select(this).attr('cx')) - 10;
            newY = parseFloat(d3.select(this).attr('cy')) - 5;

            tooltip.attr('x', newX)
              .attr('y', newY)
              .text(d.value)
              .transition(200)
              .style('opacity', 1);

            z = "polygon." + d3.select(this).attr("class");
            g.selectAll("polygon")
              .transition(200)
              .style("fill-opacity", 0.1);
            g.selectAll(z)
              .transition(200)
              .style("fill-opacity", 0.7);
          })
          .on('mouseout', function() {
            tooltip.transition(200)
              .style('opacity', 0);
            g.selectAll("polygon")
              .transition(200)
              .style("fill-opacity", cfg.opacityArea);
          });
          
        c.transition()
          .delay(1750)
          .duration(100)
          .style("fill-opacity", 0.9);
          
          c.append("svg:title")
          .text(function(j) {
            return Math.max(j.value, 0);
          });
          

        series++;
      });

      //Tooltip
      tooltip = g.append('text')
        .style('opacity', 0)
        .style('font-family', 'sans-serif')
        .style('font-size', textSizeTooltip);
    }
  };

  // Options for the Radar chart, other than default
  var myOptions = {
    w: w,
    h: h,
    ExtraWidthX: 180,
    labelScale: 0.7,
    levels: 5,
    levelScale: 0.85,
    facetPaddingScale: 1.9,
    maxValue: 0.6,
    showAxes: true,
    showAxesLabels: true,
    showLegend: true,
    showLevels: true,
    showLevelsLabels: false,
    showPolygons: true,
    showVertices: true
  };

  RadarChart.draw(divId, json, myOptions);

  ////////////////////////////////////////////
  /////////// Initiate legend ////////////////
  ////////////////////////////////////////////

  var svg = d3.select('#chart-radar')
    .selectAll('svg')
    .append('svg')
    .attr("width", w + 300)
    .attr("height", h)
    .style("font-size", textSizeLegend);

  // Initiate Legend
  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 200)
    .attr('transform', 'translate(90,20)');

  // Create colour squares
  legend.selectAll('rect')
    .data(legendOptions)
    .enter()
    .append("rect")
    .attr("x", w - 8)
    .attr("y", function(d, i) {
      return i * 20;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i) {
      return colorscale(i);
    });

  // Create text next to squares
  legend.selectAll('text')
    .data(legendOptions)
    .enter()
    .append("text")
    .attr("x", w + 3)
    .attr("y", function(d, i) {
      return i * 20 + 9;
    })
    .attr("font-size", textSizeLegend)
    .attr("fill", "#737373")
    .text(function(d) {
      return d;
    });
};

function update() {
  console.log("here");
  json = [
    [{
      "axis": "A",
      "value": 4
    }, {
      "axis": "B",
      "value": 13
    }, {
      "axis": "C",
      "value": 8
    }, {
      "axis": "D",
      "value": 15
    }, {
      "axis": "E",
      "value": 2
    }, {
      "axis": "F",
      "value": 5
    }, {
      "axis": "G",
      "value": 9
    }, {
      "axis": "H",
      "value": 3
    }, {
      "axis": "I",
      "value": 1
    }]
  ];
  drawRadarChart('#chart-radar', wMaior, wMaior);
};

drawRadarCharts();

d3.select("button").on("click", update);
