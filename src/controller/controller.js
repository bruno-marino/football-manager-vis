import views from '../views';
import model from '../model';

export default class Controller {
  constructor() {
    this.model = model;
    this.mapchart = new views.mapchart();
    this.mapcolor = new views.ColorBrewerLinear();

    // register callback function for model upddate events
    this.model.bindPlayersListChanged(this.onPlayersListChanged.bind(this));
    this.model.bindCountriesListChanged(this.onCountriesListChanged.bind(this));

  }
  
  handleAddPlayer(player) {
    this.model.addPlayer(player);
  }

  handleAddCountry(Country) {
    this.model.addCountry(Country);
  }

  onPlayersListChanged() {

  }

  onCountriesListChanged() {
    this.mapchart.data = this.model.countries;
  }

  onRampChange(scalenumber) {
    this.mapchart.changeRamp(scalenumber);
  }
}