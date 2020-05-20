import 'normalize.css';
import './index.scss';
import app from './app';
import * as d3 from "d3";
import slider from './range-slider';

app();

const roles_settings = window.app.rolesettings;


//mode selection: dark or light mode
d3.select('#switch-mode')
      .on("click", function() {
        d3.select('body').classed("light-mode", !d3.select('body').classed("light-mode"));
        if(d3.select('body').classed("light-mode")){
          d3.select(".mode-label").text("Light mode");
        }else{
          d3.select(".mode-label").text("Dark mode");
        }
      });



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
var role_j = roles_settings[0];
var created_content = "";

created_content = "<img class='role_img' src='assets/" + role_j.img_path + "' height='24' width='24' alt='" + role_j.role_name + "'>";
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

  created_content = created_content + "<img class='role_img' src='assets/" + role_j.img_path + "' height='24' width='24' alt='" + role_j.role_name + "'>";
  created_content = created_content + "<span class='role_name_container'>" + role_j.role_name + "</span>";
  created_content = created_content + "</span>";
}

document.getElementById("scale-container").innerHTML = created_content;
/* End dinamically create select box color scale */

//+++ Scatterplot selects +++//
var all_features = [];

//populate the selects
const object = roles_settings[0]["attributes"];

for (const [key, value] of Object.entries(object)) {
  value.forEach(function(feature){
    all_features.push(feature);
  })
}

roles_settings[1]["attributes"]["principal"].forEach(f => all_features.push(f))

var f_count = 0;
var first_content = "";
created_content = "";
all_features.sort();
all_features.forEach(function(feature){
  if(f_count==0){
    first_content =  "<span class='role_name_container'>" + feature + "</span>";
    created_content = "<span class='custom-option selected' data-value='" + feature + "'> " + "<span class='role_name_container'> "+ feature +" </span> </span>";
  }
  else{
    created_content += "<span class='custom-option' data-value='" + feature + "'> " + "<span class='role_name_container'> "+ feature +" </span> </span>";
  }
  f_count += 1;

});

document.getElementById("first-x-axis").innerHTML = first_content;
document.getElementById("first-y-axis").innerHTML = first_content;

document.getElementById("x-axis-container").innerHTML = created_content;
document.getElementById("y-axis-container").innerHTML = created_content;



/* Select box code */

for (const dropdown of document.querySelectorAll(".custom-select-wrapper")) {
  //check if the element has no off class
  dropdown.addEventListener('click', function () {
      if(!this.classList.contains("off")){
        this.querySelector('.custom-select').classList.toggle('open');
      }
  })

}
var graph_type;
for (const option of document.querySelectorAll('.custom-option')) {
  option.addEventListener('click', function () {
      if (!this.classList.contains('selected')) {
          this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
          this.classList.add('selected');
          this.closest('.custom-select').querySelector('.custom-select__trigger span').innerHTML = this.innerHTML;

          //change color scale in the map
          //Update map only if select of its view change
          graph_type = this.parentNode.parentNode.parentNode.parentNode.parentNode;
          if(graph_type.id=="age-and-role"){
            if(this.getAttribute('data-value')==1){
              document.getElementById("map").classList.add("goalkeeper");
              document.getElementById("scatter").classList.add("goalkeeper");
              document.getElementById("bubble").classList.add("goalkeeper");
            }else{
              document.getElementById("map").classList.remove('goalkeeper');
              document.getElementById("scatter").classList.remove("goalkeeper");
              document.getElementById("bubble").classList.remove("goalkeeper");
            }
            window.app.onRoleChange(parseInt(this.getAttribute('data-value')));
          }else{
            //Update Bubblechart axis
            window.app.onAxisChange(d3.select("#first-x-axis > span").text(), d3.select("#first-y-axis > span").text())
          }
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

let zoom_button = document.querySelector('#zoom-button');
zoom_button.addEventListener('click', () => {
  zoom_button.classList.contains('enabled') ? window.app.zoomBrush() : null;
})

let age_slider_options = {
  label: 'Age Range',
  onRangeChange: window.app.changeAgeRange.bind(window.app),
};
slider(document.querySelector('#age-range-slider'), age_slider_options);

let sampling_slider_options = {
  label: 'Sampling Level',
  minRange: 0,
  maxRange: 200,
  theValue: 100,
  onRangeChange: window.app.changeSamplingRate.bind(window.app),
};
slider(document.querySelector('#sampling-slider'), sampling_slider_options);
