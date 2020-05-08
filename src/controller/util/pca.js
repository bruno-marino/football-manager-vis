import PCA from 'pca-js';

export default function pcaScatterplotMatrix(players) {
  return new Promise( (resolve, reject) => {
    let result = [];
    try {
      setTimeout(() => {
        let data = getPlayersMatrix(players, this.rolesettings[0].attributes);
        let vectors = PCA.getEigenVectors(data);
        // sort vectors by variance
        vectors.sort( (a,b) => a.eigenvalue < b.eigenvalue );
        let new_data = PCA.computeAdjustedData(data, vectors[0], vectors[1]);

        result.forEach( (player, i) => {
          player.x = new_data.adjustedData[0][i];
          player.y = new_data.adjustedData[1][i];
        });
        resolve(result);
      }, 0);


      function getPlayersMatrix(players, attributes) {
        let matrix = [];
        let matrix_row = [];

        players.forEach(player => {
          matrix_row = [];

          // init result entries
          result.push({
            id : player.uid,
            role: player.role_id,
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