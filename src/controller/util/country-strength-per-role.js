export default function countryStrengthPerRole() {
  let data = {};
  let total = {};
  this.model.players.forEach(player => {
    if(this.isValidPlayer(player)) {
      if (!data[player.country_code]) {
        data[player.country_code] = [];
      }

     data[player.country_code].push(player.computeAvgRoleSkill(this.actualRole));
    }
  });

  let num_countries=0;
  let sum = 0;
  let avg;
  let r=0;
  let variance;
  let standard_dev;

  
  Object.keys(data).forEach(country => {

    data[country].sort((a,b) => b - a);

    let max = data[country].length >= 500 ? 500 : data[country].length;
    let result = 0;
    for (let i = 0; i < max; i++) {
      result += data[country][i];
    }

    //data[country] = result / max;//first try
    //data[country] = (result/max) * [(500 - (500 - max)) / 500];
    //data[country] = (result/max) * (max/500);
    //data[country] = result/500;
    data[country] = result/500;
    /* alternative with less malus*/
    //let adjNP = data[country].length <= 400 ? max+50 : max;
    //data[country] = (result/max) * (adjNP/500); 

    num_countries++;
    sum = sum + data[country];
  });

  avg = sum/num_countries;

  //variance computation
  Object.keys(data).forEach(country => {
    r = Math.pow((data[country]-avg),2)+r;
  });
  variance = r/num_countries;

  //standard dev computation
  standard_dev = Math.sqrt(variance);

  //z-score computation for each country
  Object.keys(data).forEach(country => {
    data[country] = (data[country] - avg) / standard_dev;
  });

  return data;
}