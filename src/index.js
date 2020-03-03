import 'normalize.css';
import './index.scss';
import app from './app';

app();

/*
to be removed and to be put in assets (maybe)
*/
const mapcolor = window.app.mapcolor;
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
          window.app.onRampChange(this.getAttribute('data-value'));
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