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
        if(data.length == 0) {
          resolve(result);
          return;
        }
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
          if (this.actualRole.role_id != 1 && player.hasRole(this.rolesettings[1])) {
            return;
          } 
          else if (this.actualRole.role_id == 1 && !player.hasRole(this.rolesettings[1])) {
            return
          }
          
          matrix_row = [];

          // init result entries
          result.push({
            id: player.uid,
            role: player.role_id,
            x: 0,
            y: 0,
            name: player.name,
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