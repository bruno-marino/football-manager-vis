import views from '../views';
import model from '../model';
import rolesettings from './rolesettings';
import countryStrengthPerRole from './util/country-strength-per-role';
import countriesAvgSetOfSkills from './util/countries-avg-set-of-skills';

export default class Controller {
  constructor() {
    this.model = model;
    this.mapchart = new views.mapchart();
    this.barplot = new views.barplot();
    this.radarchart = new views.radarchart();
    this.rolesettings = rolesettings;

    // register callback function for model upddate events
    this.model.bindPlayersListChanged(this.onPlayersListChanged.bind(this));
    this.model.bindCountriesListChanged(this.onCountriesListChanged.bind(this));
    this.mapchart.bindElemSelection(this.onCountriesSelection.bind(this));
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

  onRoleChange(role_id) {
    let role_scale = this.rolesettings[role_id].role_scale;
    this.mapchart.values = countryStrengthPerRole(rolesettings[role_id],this.model.players);
    this.mapchart.changeRamp(role_scale);
  }

  onCountriesSelection(countries) {
    this.barplot.data = countriesAvgSetOfSkills(countries, this.model.players);
  }
}