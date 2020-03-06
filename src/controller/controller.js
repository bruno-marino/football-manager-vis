import views from '../views';
import model from '../model';
import rolesettings from './rolesettings';
import countryStrengthPerRole from './util/country-strength-per-role'

export default class Controller {
  constructor() {
    this.model = model;
    this.mapchart = new views.mapchart();
    this.rolesettings = rolesettings;

    // register callback function for model upddate events
    this.model.bindPlayersListChanged(this.onPlayersListChanged.bind(this));
    this.model.bindCountriesListChanged(this.onCountriesListChanged.bind(this));
    this.onRoleChange(0);
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
    let role_domain = this.rolesettings[role_id].role_domain;
    this.mapchart.changeRamp(role_domain,role_scale);
    console.log(countryStrengthPerRole(rolesettings[role_id],this.model.players));
  }
}