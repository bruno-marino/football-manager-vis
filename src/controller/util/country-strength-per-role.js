export default function countryStrengthPerRole() {
  let data = {};
  let total = {};
  this.model.players.forEach(player => {
    if(player.hasRole(this.actualRole)) {
      if (!data[player.country_code]) {
        data[player.country_code] = [];
      }

     data[player.country_code].push(player.computeAvgRoleSkill(this.actualRole));
    }
  });
  
  Object.keys(data).forEach(country => {
    data[country].sort((a,b) => b - a);

    let max = data[country].length >= 500 ? 500 : data[country].length;
    let result = 0;
    for (let i = 0; i < max; i++) {
      result += data[country][i];
    }

    data[country] = result / max;
  });

  // apply malus
  return data;
}