import 'normalize.css';
import './index.scss';
import app from './app';
import * as d3 from "d3"
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
/*
d3.select("#pca_check").on("change", function(){
  if(d3.select("#pca_check").property("checked")){
    //window.app.scatterplot.pca = true;
    //make select boxes unselectable
    d3.select("#scatter-settings").selectAll(".custom-select-wrapper")
    .classed("off", true);
  }else{
    //window.app.scatterplot.pca = false;
    //make select boxes selectable
    d3.select("#scatter-settings").selectAll(".custom-select-wrapper")
    .classed("off", false);
  }
});


//Update settings
d3.select("#apply-settings").on("click", function () {

  //console.log(d3.select("#first-x-axis > span").text());

  if(d3.select("#pca_check").property("checked")){
    //window.app.scatterplot.pca = true;
    
    window.app.onPcaActivation();

  }else{
    //window.app.scatterplot.pca = false;
    //get x and y features and update scatterplot
    //window.app.scatterplot.x_axis = d3.select("#first-x-axis > span").text();
    //window.app.scatterplot.y_axis = d3.select("#first-y-axis > span").text();
    window.app.onAxisChange(d3.select("#first-x-axis > span").text(), d3.select("#first-y-axis > span").text())
  }
  //Update scatterplot
  //?????
});*/

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

//+++ Scatterplot selects +++//
var all_features = [];

//populate the selects
const object = roles_settings[0]["attributes"];

for (const [key, value] of Object.entries(object)) {
  value.forEach(function(feature){
    all_features.push(feature);
  })
}


var f_count = 0;
var first_content = "";
created_content = "";
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
          //console.log(this.innerHTML);
          //change color scale in the map
          //Update map only if select of its view change
          graph_type = this.parentNode.parentNode.parentNode.parentNode.parentNode;
          if(graph_type.id=="map_container"){
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

/* end to be removed and put in assets*/