import 'normalize.css'
import './index.scss'
import * as d3 from "d3";
import views from "./views"
import model from "./model"

/**
 * TO DO: refactor in model view controller
 * temporal
 */
//const mapchart = views.mapchart()


const mapchartContainer = d3.select('#root')
      .append('div')
      .attr('id', 'map')

// mapchartContainer.call(mapchart) 
const mapchart = new views.mapchart(mapchartContainer);
// data sarebbero i dati che ci restituisce il model, in questo esempio li prendiamo da quei link
let data = d3.map();
var promises = [
  d3.json("./assets/world.geojson"),
  d3.csv('assets/dataset.csv'),
  d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
]
Promise.all(promises).then((loaded_data) => {
  loaded_data[0].features.forEach(country => {
    country.id === 'ATA' ? null : model.addCountry(country);
  })

  loaded_data[1].forEach(player => {
    model.addPlayer(player);
  })

  // iniziamo a visualizzare roba
  mapchart.topo = model.countries;
  mapchart.data = data;
  mapchart.draw();
});

/* Applying new color scale to the map */
/*
const mapcolor = new views.ColorBrewerLinear;


function apply_color_filter(scalenumber){
    //color range array
    var color_range = mapcolor.scale(parseInt(scalenumber));
    //new color range
    var colorScale = d3.scaleThreshold()
      .domain(mapcolor.domain())
      .range(color_range);
    
    
    var data = d3.map();
    var promises = [
      d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
      d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); })
  ]
    
  Promise.all(promises).then(ready)

  //function ready(error, topo) {
  function ready(topo) {
    
    d3.selectAll("path")    
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
  } 
    //how to set the new ColorScale in the map without reload the data???

}
*/
/* End applying new color scale to the map */


/*
to be removed and to be put in assets (maybe)
*/
const mapcolor = new views.ColorBrewerLinear;
/* Dinamically create select box color scale */

var created_content = "";
var current_scale = mapcolor.scale(1);
for(var i = 0; i <= current_scale.length; i++){
   created_content = created_content + "<div class='scale-square' style='background:" + current_scale[i] + "' ></div>";
}
document.getElementById("first-scale").innerHTML = created_content;


created_content = "";
for(var j = 1; j <= 12; j++){
  current_scale = mapcolor.scale(j);
  if(j==1){
    created_content = created_content + "<span class='custom-option selected' data-value='" + j + "'>";
  }else{
    created_content = created_content + "<span class='custom-option' data-value='" + j + "'>";
  }
  for(var i = 0; i < current_scale.length; i++){
    created_content = created_content + "<div class='scale-square' style='background:" + current_scale[i] + "' ></div>";
  }
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
          //document.getElementById("colorscale").value = this.getAttribute('data-value');
          //change color scale in the map
          //apply_color_filter(this.getAttribute('data-value'));
          mapchart.onRampChange(this.getAttribute('data-value'));
      }
  })
}

// window.addEventListener('click', function (e) {
//     const select = document.querySelector('.custom-select')
//     if (!select.contains(e.target)) {
//         select.classList.remove('open');
//     }
// });

window.addEventListener('click', function (e) {
  for (const select of document.querySelectorAll('.custom-select')) {
      if (!select.contains(e.target)) {
          select.classList.remove('open');
      }
  }
});

/* End select box code */

/* end to be removed and put in assets*/