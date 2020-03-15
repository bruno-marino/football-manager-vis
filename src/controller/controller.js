import views from '../views';
import model from '../model';
import rolesettings from './rolesettings';
import countryStrengthPerRole from './util/country-strength-per-role';
import countriesAvgSetOfSkills from './util/countries-avg-set-of-skills';
import radarSetOfSkills from './util/radar-set-of-skills';

export default class Controller {
  constructor() {
    this.model = model;
    this.mapchart = new views.mapchart();
    this.barplot = new views.barplot();
    this.radarchart = new views.radarchart();
    this.rolesettings = rolesettings;
    this.radar_type = 'principal';

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
    this.mapchart.values = this.countryStrengthPerRole(rolesettings[role_id],this.model.players);
    this.mapchart.changeRamp(role_scale);
  }

  onCountriesSelection(countries) {
    
    this.countriesAvgSetOfSkills(countries, this.model).then(data => {
      this.barplot.data = data;
    });
      
    this.radarSetOfSkills(this.radar_type, countries, this.model).then(data => {
      this.radarchart.data = data;
    });
  }

  onRadarTypeChange(radar_type) {
    this.radar_type = radar_type;
    let countries = this.mapchart.selected_elems;
    this.radarSetOfSkills(this.radar_type, countries, this.model).then(data => {
      this.radarchart.data = data;
    });
  }

  get map_role() {
    return this._map_role;
  }

  set map_role(role) {
    this._map_role = role;
  }

  get radar_type() {
    return this._radar_type;
  }

  set radar_type(type) {
    this._radar_type = type;
  }
}

Controller.prototype.countriesAvgSetOfSkills = countriesAvgSetOfSkills;
Controller.prototype.countryStrengthPerRole = countryStrengthPerRole;
Controller.prototype.radarSetOfSkills = radarSetOfSkills;