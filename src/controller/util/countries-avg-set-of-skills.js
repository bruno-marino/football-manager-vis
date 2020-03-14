import roles from '../rolesettings'

export default function countriesAvgSetOfSkills(countries, model) {
  return new Promise( (resolve, reject) => {
    try {
      setTimeout(() => {
        let results = [];
        let entry = {};
        let count = 0;
        
        let concat_array = []
        // get mental attributes for each roles
        roles.forEach(role => {
          // merged array
          concat_array = [...concat_array, ...role.attributes.mental];
        })

        // new array that holds union
        let attributes = [...new Set(concat_array)];
        let player;
        attributes.forEach(attribute => {
          entry = { "desc" : attribute, "value" : 0};
          count = 0;

          countries.forEach(country_code => {
            model.playersByCountry[country_code].forEach(player_uid =>{
              player = model.players[model.playersById[player_uid]]
              entry.value += parseInt(player[attribute]);
              count++;
            });
          });

          /*
          players.forEach(player => {
            // if no countries selected, consider them all
            if (countries.length == 0 || countries.includes(player.country_code)) {
              entry.value += parseInt(player[attribute]);
              count++;
            }
          });
          */
          // if count = 0 set entry to 0 (can't divide for 0)
          entry.value = count ? entry.value /= count : 0;
          results.push(entry);
        });

        results = results.sort((a,b) => a.value - b.value)
        resolve(results)
      }, 0);  
    } catch(err) {reject(err)}
  })
}