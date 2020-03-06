import 'normalize.css';
import './index.scss';
import app from './app';

app();

/*
to be removed and to be put in assets (maybe) or in another place
*/
const roles_settings = window.app.rolesettings;


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
for(var j = 0; j <= 3; j++){
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