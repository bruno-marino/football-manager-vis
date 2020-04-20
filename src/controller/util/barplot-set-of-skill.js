export default function barplotSetOfSkills(players) {
  return new Promise( (resolve, reject) => {
    try {
      setTimeout(() => {
        let results = [];
        let entry = {};
        let count = 0;
        let attributes =  ['consistency','dirtiness',
          'versatility','adaptability','ambition','loyalty','pressure','professional',
          'sportsmanship','temperament','controversy'];
        
        attributes.forEach(attribute => {
          entry = { "desc" : attribute, "value" : 0};
          count = 0;

          players.forEach(player => {
            if(!this.isValidPlayer(player))
              return // equal to continue
            
            entry.value += parseInt(player[attribute]);
            count++;
          });

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