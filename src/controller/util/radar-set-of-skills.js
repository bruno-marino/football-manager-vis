//skill_type can be (ex): principal, physical, mental 
export default function radarSetOfSkills(skill_type, players) {
  return new Promise( (resolve, reject) => {
    try {
      setTimeout(() => {
        let results = [];
        let entry = {};
        let count = 0;
        
        let attributes = this.actualRole.attributes[skill_type];
        // In case of only one player and no country passed, only feature of that player are considered
        attributes.forEach(attribute => {
          entry = { "axis" : attribute, "value" : 0};
          count = 0;

          players.forEach(player => {
            if(!player.hasRole(this.actualRole))
              return // equal to continue
            
            entry.value += parseInt(player[attribute]);
            count++;
          });
      
          // if count = 0 set entry to 0 (can't divide for 0)
          entry.value = count ? entry.value /= count : 0;
          results.push(entry);
        });

        resolve(results);
      }, 0);
    } catch(err) {reject(err)}
  })
    
}