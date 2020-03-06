import Controller from './controller/controller';
import * as d3 from 'd3';

const controller = new Controller();

const app = function() {
  window.app = controller;

  loadData().then(() => {
    const mapchartContainer = d3.select('#root')
        .append('div')
        .attr('id', 'map');
    
    controller.mapchart.init(mapchartContainer);
  });
}

const loadData = function() {
    return new Promise((resolve, reject) => {
      // temp
      let data = d3.map();
      let promises = [
        d3.json("./assets/world.geojson"),
        d3.csv("./assets/dataset.csv"),
        d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) { data.set(d.code, +d.pop); }),
      ];
      
      Promise.all(promises).then(loaded_data => {
        loaded_data[0].features.forEach(country => {
          country.total = data.get(country.id);
          country.id === 'ATA' ? null : controller.handleAddCountry(country);
        });

        /*
        loaded_data[1].forEach(player => {
          controller.handleAddPlayer(player);
        })*/
        resolve(true)
      })
      .catch(error => reject(error));
    })
}

export default app;