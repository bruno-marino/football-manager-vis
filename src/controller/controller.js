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
    this.scatterplot = new views.scatterplot();
    this.rolesettings = rolesettings;
    this.radar_type = 'principal';
    this._role_id = '0';

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
    this.role_id = role_id;
    let role_scale = this.rolesettings[role_id].role_scale;
    this.mapchart.values = this.countryStrengthPerRole(this.rolesettings[role_id]);
    this.mapchart.changeRamp(role_scale);
    this.onCountriesSelection(this.mapchart.selected_elems);
  }

  onCountriesSelection(countries) {
    this.updateBarPlot(countries);
    this.updateRadar(countries);
    this.scatterplot.data = this.model.players;
  }

  onRadarTypeChange(radar_type) {
    this.radar_type = radar_type;
    let countries = this.mapchart.selected_elems;
    this.updateRadar(countries);
  }

  updateRadar(countries) {
    this.radarSetOfSkills(this.radar_type, countries).then(data => {
      this.radarchart.data = data;
    });
  }

  updateBarPlot(countries) {
    this.countriesAvgSetOfSkills(countries).then(data => {
      this.barplot.data = data;
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

  get role_id() {
    return this._role_id;
  }

  set role_id(id) {
    this._role_id = id;
  }

  get actualRole() {
    return this.rolesettings[this.role_id];
  }
}

Controller.prototype.countriesAvgSetOfSkills = countriesAvgSetOfSkills;
Controller.prototype.countryStrengthPerRole = countryStrengthPerRole;
Controller.prototype.radarSetOfSkills = radarSetOfSkills;