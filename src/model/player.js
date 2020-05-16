import rolesettings from '../controller/rolesettings.json'

export default class Player {
  constructor(player) {
    Object.keys(player).forEach(feature => {
      if (feature === 'Positions_Desc') {
        let roles = player[feature].split(' ')[0].split('/');
        this[feature.toLowerCase()] = roles;
      } else {
        this[feature.toLowerCase()] = player[feature];
      }
    })

    //add the role id to the player
    /* //old role id
    this["role_id"] = "";
    rolesettings.forEach(role => {
      if(role.positions.filter(pos => this.positions_desc.includes(pos)).length) {
        this["role_id"] = role.role_id;
      }
    })
    */

    //new role id based on points
    this["role_id"] = this.mainRole();

  }

  computeAvgGkSkill() {//to be reviewed or deleted, actually not used
    let result = 0;

    rolesettings[1].attributes.principal.forEach(attr => {
      result += this[attr];
    });


    rolesettings[1].attributes.negative.forEach(attr => {
      result += (1 - this[attr]);
    });

    let num_attr = rolesettings[1].attributes.principal.length +
                   rolesettings[1].attributes.negative.length;

    let final_result = 0;
    if(result!=0){
      final_result = result / num_attr;
    }

    return final_result;
  }

  get avgGkSkill() {
    return this.computeAvgRoleSkill(rolesettings[1]);
  }

  get avgDefSkill() {
    return this.computeAvgRoleSkill(rolesettings[2]);
  }

  get avgMidSkill() {
    return this.computeAvgRoleSkill(rolesettings[3]);
  }

  get avgAtkSkill() {
    return this.computeAvgRoleSkill(rolesettings[4]);
  }

  computeAvgRoleSkill(role) {
    let result = 0;
    role.attributes.principal.forEach(attr => {
      if(!this[attr]) return
      result += parseInt(this[attr]);
    })

    role.attributes.mental.forEach(attr => {
      if(!this[attr]) return
      result += parseInt(this[attr]);
    })

    role.attributes.physical.forEach(attr => {
      if(!this[attr]) return
      result += parseInt(this[attr]);
    })

    let num_attr =
      role.attributes.principal.length +
      role.attributes.mental.length +
      role.attributes.physical.length;

   let final_result = 0;
   if(result!=0){
      final_result = result / num_attr;
   }

    return final_result;
  }

  hasRole(role) {
    if(role.role_id == 0) return this.role_id != 1 ? true : false;

    return role.role_id == this.role_id;
    //return role.positions.filter(pos => this.positions_desc.includes(pos)).length === 0 ? false : true;
  }

  mainRole(){
    let role_points = [
      {"role_id": 0, "value": 0}, //for player without role
      {"role_id": 1, "value": this.computeAvgRoleSkill(rolesettings[1])}, //Goalkeeper
      {"role_id": 2, "value": this.computeAvgRoleSkill(rolesettings[2])}, //Defender
      {"role_id": 3, "value": this.computeAvgRoleSkill(rolesettings[3])}, //Midfielder
      {"role_id": 4, "value": this.computeAvgRoleSkill(rolesettings[4])}  //Striker
    ]

    let id_max = 0;

    //get id having max skill value
    role_points.forEach(row => {
      if(row.value > role_points[id_max].value){
        id_max = row.role_id;
      }
    })

    return id_max;
  }
  get playerMainRole() {
    // To do
    // P portiere
    // D difensore
    // C centrocampista
    // A attaccante
    return this.mainRole();
  }
}