import 'normalize.css';
import './index.scss';
import app from './app';
import * as d3 from "d3"
app();

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

          //change color scale in the map
          //Update map only if select of its view change
          graph_type = this.parentNode.parentNode.parentNode.parentNode.parentNode;
          if(graph_type.id=="top-bar"){
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


// slider code
var inputsRy = {
  sliderWidth: 300,
  minRange: 0,
  maxRange: 60,
  outputWidth:30, // output width
  thumbWidth: 20, // thumb width
  thumbBorderWidth: 4,
  trackHeight: 4,
  theValue: [10, 50] // theValue[0] < theValue[1]
};
var isDragging0 = false;
var isDragging1 = false;

var range = inputsRy.maxRange - inputsRy.minRange;
var rangeK = inputsRy.sliderWidth / range;
var container = document.querySelector(".slider-container");
var thumbRealWidth = inputsRy.thumbWidth + 2 * inputsRy.thumbBorderWidth;

// styles
var slider = document.querySelector(".slider");
slider.style.height = inputsRy.trackHeight + "px";
slider.style.width = inputsRy.sliderWidth + "px";
slider.style.paddingLeft = (inputsRy.theValue[0] - inputsRy.minRange) * rangeK + "px";
slider.style.paddingRight = inputsRy.sliderWidth - inputsRy.theValue[1] * rangeK + "px";

var track = document.querySelector(".track");
track.style.width = inputsRy.theValue[1] * rangeK - inputsRy.theValue[0] * rangeK + "px";

var thumbs = document.querySelectorAll(".thumb");
for (var i = 0; i < thumbs.length; i++) {

  thumbs[i].style.width = thumbs[i].style.height = inputsRy.thumbWidth + "px";
  thumbs[i].style.borderWidth = inputsRy.thumbBorderWidth + "px";
  thumbs[i].style.top = -(inputsRy.thumbWidth / 2 + inputsRy.thumbBorderWidth - inputsRy.trackHeight / 2 - 4) + "px";
  thumbs[i].style.left = (inputsRy.theValue[i] - inputsRy.minRange) * rangeK - (thumbRealWidth / 2) + "px";

}
var outputs = document.querySelectorAll(".output");
for (var i = 0; i < outputs.length; i++) {
  outputs[i].style.width = outputs[i].style.height = outputs[i].style.lineHeight = outputs[i].style.left = inputsRy.outputWidth + "px";
  outputs[i].style.top = -(Math.sqrt(2 * inputsRy.outputWidth * inputsRy.outputWidth) + inputsRy.thumbWidth / 2 - inputsRy.trackHeight / 2) + "px";
  outputs[i].style.left = (inputsRy.theValue[i] - inputsRy.minRange) * rangeK - inputsRy.outputWidth / 2 + "px";
  outputs[i].innerHTML = "<p>" + inputsRy.theValue[i] + "</p>";
}

//events

thumbs[0].addEventListener("mousedown", function(evt) {
  evt.preventDefault();
  isDragging0 = true;
}, false);
thumbs[1].addEventListener("mousedown", function(evt) {
  evt.preventDefault();
  isDragging1 = true;
}, false);
container.addEventListener("mouseup", function(evt) {
  if (isDragging0 || isDragging1) {
    var theValue0 = inputsRy.theValue[0];
    var theValue1 = inputsRy.theValue[1];

    window.app.changeAgeRange(theValue0, theValue1);
  }

  isDragging0 = false;
  isDragging1 = false;
}, false);

container.addEventListener("mousemove", function(evt) {
  var mousePos = oMousePos(this, evt);
  var theValue0 = (isDragging0) ? Math.round(mousePos.x / rangeK) + inputsRy.minRange : inputsRy.theValue[0];
  var theValue1 = (isDragging1) ? Math.round(mousePos.x / rangeK) + inputsRy.minRange : inputsRy.theValue[1];

  if (isDragging0) {

    if (theValue0 < theValue1 - 4 &&
      theValue0 >= inputsRy.minRange) {
      inputsRy.theValue[0] = theValue0;
      thumbs[0].style.left = (theValue0 - inputsRy.minRange) * rangeK - (thumbRealWidth / 2) + "px";
      outputs[0].style.left = (theValue0 - inputsRy.minRange) * rangeK - inputsRy.outputWidth / 2 + "px";
      outputs[0].innerHTML = "<p>" + theValue0 + "</p>";
      slider.style.paddingLeft = (theValue0 - inputsRy.minRange) * rangeK + "px";
      track.style.width = (theValue1 - theValue0) * rangeK + "px";

    }
  } else if (isDragging1) {

    if (theValue1 > theValue0 + 4 &&
      theValue1 <= inputsRy.maxRange) {
      inputsRy.theValue[1] = theValue1;
      thumbs[1].style.left = (theValue1 - inputsRy.minRange) * rangeK - (thumbRealWidth / 2) + "px";
      outputs[1].style.left = (theValue1 - inputsRy.minRange) * rangeK - inputsRy.outputWidth / 2 + "px";
      outputs[1].innerHTML = "<p>" + theValue1 + "</p>";
      slider.style.paddingRight = (inputsRy.maxRange - theValue1) * rangeK + "px";
      track.style.width = (theValue1 - theValue0) * rangeK + "px";

    }
  }
}, false);

// helpers

function oMousePos(elmt, evt) {
  var ClientRect = elmt.getBoundingClientRect();
  return { //objeto
    x: Math.round(evt.clientX - ClientRect.left),
    y: Math.round(evt.clientY - ClientRect.top)
  }
}