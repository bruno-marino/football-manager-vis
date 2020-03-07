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
  }

  get avgGkSkill() {
    let result = 0;

    rolesettings[0].attributes.principal.forEach(attr => {
      result += this[attr];
    });

    rolesettings[0].attributes.negative.forEach(attr => {
      result += (1 - this[attr]);
    });
    let num_attr = rolesettings[0].attributes.principal.length +
                   rolesettings[0].attributes.negative.length;
    
    return result / num_attr; 
  }

  get avgDefSkill() {
    return this.computeAvgRoleSkill(1);
  }

  get avgMidSkill() {
    return this.computeAvgRoleSkill(2);
  }

  get avgAtkSkill() {
    return this.computeAvgRoleSkill(3);
  }

  computeAvgRoleSkill(role) {
    let result = 0;
    role.attributes.principal.forEach(attr => {
      if(!this[attr]) console.log(attr)
      result += parseInt(this[attr]);
    })

    role.attributes.mental.forEach(attr => {
      if(!this[attr]) console.log(attr)
      result += parseInt(this[attr]);
    })

    role.attributes.physical.forEach(attr => {
      if(!this[attr]) console.log(attr)
      result += parseInt(this[attr]);
    })

    let num_attr = 
      role.attributes.principal.length +
      role.attributes.mental.length +
      role.attributes.physical.length
    /*
    let invalid_attr = [
      "uid","positions_desc","name","height","weight","nation_id","age","born","country_code"
    ];
    let num_attr = 0;
    Object.keys(this).forEach(attr => {
      if (!invalid_attr.includes(attr)) {
        result += parseInt(this[attr]);
        num_attr++;
      }
    })
    */
    return result / num_attr;
  }
}