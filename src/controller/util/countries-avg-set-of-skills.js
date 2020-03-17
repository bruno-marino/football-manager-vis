export default function countriesAvgSetOfSkills(countries) {
  return new Promise( (resolve, reject) => {
    try {
      setTimeout(() => {
        let results = [];
        let entry = {};
        let count = 0;
        let attributes =  ['consistency','dirtiness','important_matches','injury_proness',
          'versatility','adaptability','ambition','loyalty','pressure','professional',
          'sportsmanship','temperament','controversy'];
        
        let player;
        attributes.forEach(attribute => {
          entry = { "desc" : attribute, "value" : 0};
          count = 0;

          countries.forEach(country_code => {
            if(!this.model.playersByCountry[country_code])
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