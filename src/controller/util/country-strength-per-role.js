export default function countryStrengthPerRole(role, players) {
  let data = {};
  let total = {};
  players.forEach(player => {
    // if the intersection of role positions and player positions is
    // empty => skip this player.
    if(role.positions.filter(pos => player.positions_desc.includes(pos)).length) {
      if (!data[player.country_code]) {
        data[player.country_code] = [];
      }

     data[player.country_code].push(player.computeAvgRoleSkill(role));
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