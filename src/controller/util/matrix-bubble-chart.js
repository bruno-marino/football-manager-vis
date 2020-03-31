export default function matrixBubbleChart(x_axis, y_axis, players) {
  return new Promise( (resolve, reject) => {
    try {
      setTimeout(() => {
        let matrix = [];
        let y_i;
        let x_i;

        x_axis = x_axis.trim();
        y_axis = y_axis.trim();
        if(!players) {
          // if no selected countries, consider all players
          //this.model.players.forEach(player => matrixIncrease(player));

        } else {
          // otherwise consider selected countries
          players.forEach(player => {
            // if player has not the actual role then skip
            if(!player.hasRole(this.actualRole))
              return // equal to continue

            y_i = parseInt(player[y_axis]);
            x_i = parseInt(player[x_axis]);

            // now find this player position in the matrix and append to the list for that position
            let matrix_obj = matrix[ matrix.findIndex(obj => (obj.x == x_i && obj.y == y_i)) ];
            if (!matrix_obj) {
              matrix.push({
                x : x_i,
                y : y_i,
                players_list: [player.uid],
              });
            } else {
              matrix_obj.players_list.push(player.uid);
            }
          });

        }

        resolve(matrix);
      }, 0);
    } catch(error) { reject(error); }
  });
}