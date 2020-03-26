//import PCA from 'pca-js';
import { PCA } from 'ml-pca';

export default function pcaScatterplotMatrix(players) {
  return new Promise( (resolve, reject) => {
    let result = [];
    try {
      setTimeout(() => {
        if(players.length == 0) {
          resolve(result);
          return;
        }
        let data = getPlayersMatrix(players, this.rolesettings[0].attributes);
        const pca = new PCA(data, { method: 'covarianceMatrix', scale: true, ignoreZeroVariance: true });
        const new_data = pca.predict(data, { nComponents: 2 } );

        result.forEach( (player, i) => {
          player.x = new_data.data[i][0];
          player.y = new_data.data[i][1];
        });
        
        resolve(result);
      }, 0);

      const getPlayersMatrix = (players, attributes) => {
        let matrix = [];
        let matrix_row = [];
            
        players.forEach(player => {
          //if (!player.hasRole(this.actualRole))
            //return;
          
          matrix_row = [];
          
          // init result entries
          result.push({
            id : player.uid,
            role: player.playerMainRole,
            x : 0,
            y: 0,
          })
          
          for (const [key, value] of Object.entries(attributes)) {
            value.forEach(attribute => {
              matrix_row.push( parseInt(player[attribute]) );
            })
          }
    
          matrix.push(matrix_row);
        })
        
        return matrix;
      }

    } catch(error) { reject(error); }
  });

  
}