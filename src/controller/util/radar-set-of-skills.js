//skill_type can be (ex): principal, physical, mental 
export default function radarSetOfSkills(skill_type, countries) {
  return new Promise( (resolve, reject) => {
    try {
      setTimeout(() => {
        let results = [];
        let entry = {};
        let count = 0;
        
        let attributes = this.actualRole.attributes[skill_type];
        let player;
        // In case of only one player and no country passed, only feature of that player are considered
        attributes.forEach(attribute => {
          entry = { "axis" : attribute, "value" : 0};
          count = 0;

          countries.forEach(country_code => {
            if (!this.model.playersByCountry[country_code])
              return
            
            this.model.playersByCountry[country_code].forEach(player_uid =>{
              player = this.model.players[this.model.playersById[player_uid]];

              // if the intersection of selected role positions and player positions is
              // empty => skip this player.
              if(!this.actualRole.positions.filter(pos => player.positions_desc.includes(pos)).length)
                return // equal to continue
              
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
          });*/
      
          // if count = 0 set entry to 0 (can't divide for 0)
          entry.value = count ? entry.value /= count : 0;
          results.push(entry);
        });

        resolve(results);
      }, 0);
    } catch(err) {reject(err)}
  })
    
}