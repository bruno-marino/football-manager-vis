export default function countryStrengthPerRole(role, players) {
  let data = {};
  let total = {};
  players.forEach(player => {
    if(role.positions.filter(pos => player.positions_desc.includes(pos)).length) {
      if (!data[player.country_code]) {
        data[player.country_code] = 0;
        total[player.country_code] = 0;
      }

      data[player.country_code] += player.computeAvgRoleSkill(role);
      total[player.country_code] += 1;
    }
  });
  console.log(data['ITA'])
  console.log(total['ITA'])
  
  Object.keys(data).forEach(country => {
    data[country] /= total[country];
  });

  return data;
}