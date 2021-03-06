import views from '../views';
import model from '../model';
import rolesettings from './rolesettings';
import countryStrengthPerRole from './util/country-strength-per-role';
import barplotSetOfSkills from './util/barplot-set-of-skill';
import radarSetOfSkills from './util/radar-set-of-skills';
import matrixBubbleChart from './util/matrix-bubble-chart';
import pcaScatterplotMatrix from './util/pca2';

export default class Controller {
  constructor() {
    this.model = model;
    this.mapchart = new views.mapchart();
    this.barplot = new views.barplot();
    this.radarchart = new views.radarchart();
    this.scatterplot = new views.scatterplot( null , true);
    this.bubblechart = new views.scatterplot();
    this.rolesettings = rolesettings;
    this.radar_type = 'principal';
    this._role_id = '0';
    this.ageRange = [10,50];

    // register callback function for model upddate events
    this.model.bindPlayersListChanged(this.onPlayersListChanged.bind(this));
    this.model.bindCountriesListChanged(this.onCountriesListChanged.bind(this));
    this.mapchart.bindElemSelection(this.onCountriesSelection.bind(this));
    this.scatterplot.bindElemSelection(this.onScatterSelection.bind(this));
    this.bubblechart.bindElemSelection(this.onBubbleSelection.bind(this));

    this.zoom_button = document.querySelector('#zoom-button');
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
    let old_role = this.role_id;
    this.role_id = role_id;
    this.scatterplot.pca_role = role_id;
    this.mapchart.values = this.countryStrengthPerRole();
    this.mapchart.changeRamp(this.actualRole.role_scale);

    let countries = this.mapchart.selected_elems.map(country => country.id);
    let players = this.model.playersByCountries(countries, this.isValidPlayer.bind(this));

    // compute new pca only when gk are selected or were selected.
    if (role_id == 1 || old_role == 1) {
      this.updateScatter(this.model.playersByCountries(countries, this.isInAgeRange.bind(this)));
    } else { // otherwise the postions won't change, just opacity
      this.scatterplot.update(); // visually update
    }

    if (this.scatterplot.hasBrushActive())
      this.scatterplot.endBrush();

    if ( this.bubblechart.selected_elems.length == 1 || this.scatterplot.selected_elems.length == 1) {
      this.scatterplot.resetSelection();
      this.bubblechart.resetSelection();
      this.updateBarPlot([]);
      this.updateRadar([], 'players')
    }

    this.updateRadar(players, 'countries')
    // for bubble instead, consider both role selected and age
    this.updateBubble(players);
  }

  onAxisChange(x_axis, y_axis) {

    let countries = this.mapchart.selected_elems.map(country => country.id);
    let players = this.model.playersByCountries(countries, this.isValidPlayer.bind(this));

    //this.bubblechart.resetBrush();
    //this.scatterplot.resetBrush();

    this.radarchart.legend_label = "Selected countries";
    this.updateBubble(players, x_axis, y_axis);
  }

  onCountriesSelection(countries) {
    //this.scatterplot.resetBrush();
    //this.bubblechart.resetBrush();

    countries = countries.map(country => country.id);
    let players = this.model.playersByCountries(countries, this.isValidPlayer.bind(this));

    this.radarchart.legend_label = "Selected countries";

    this.updateBarPlot([]);
    this.updateRadar(players, 'countries');
    // for scatter consider valid all roles (for comparison!)
    this.updateScatter(this.model.playersByCountries(countries, this.isInAgeRange.bind(this)));
    // for bubble instead, consider both role selected and age
    this.updateBubble(players);
  }

  onScatterSelection(elems) {
    this.bubblechart.resetBrush();
    let players = [];
    if ( elems.length == 0) {
      let countries = this.mapchart.selected_elems.map(country => country.id);
      players = this.model.playersByCountries(countries, this.isValidPlayer.bind(this));

      this.radarchart.legend_label = "Selected countries";

      this.updateBarPlot([]);
      // on radar show only country avg
      this.updateRadar(players, 'countries');
      this.updateRadar([], 'players');
      this.zoom_button.classList.remove('enabled')
    } else {
      players = [];
      elems.forEach(elm => {
        players.push(this.model.players[this.model.playersById[elm.id]]);
      });

      this.updateBarPlot(players);
      this.updateRadar(players, 'players');
      //this.radarchart.legend_label = "Selected players";
      this.highlightBubble(players);
      this.zoom_button.classList.add('enabled');
    }
  }

  onBubbleSelection(bubbles) {
    this.scatterplot.resetBrush();
    let players = [];
    if (bubbles.length == 0) {
      let countries = this.mapchart.selected_elems.map(country => country.id);
      players = this.model.playersByCountries(countries, this.isValidPlayer.bind(this));

      this.updateBarPlot([]);
      // on radar show only country avg
      this.updateRadar(players, 'countries');
      this.updateRadar([], 'players');

    } else {

      bubbles.forEach(bubble => {
        bubble.players_list.forEach(id => {
          players.push(this.model.players[this.model.playersById[id]]);
        });
      });

      this.updateRadar(players, 'players');
      this.updateBarPlot(players);
      this.highlightScatter(players);
    }

    this.zoom_button.classList.remove('enabled');
  }

  onRadarTypeChange(radar_type) {
    this.radar_type = radar_type;
    let countries = this.mapchart.selected_elems.map(country => country.id);

    let players = [];
    let selected = this.bubblechart.selected_elems;
    let scatter_selected = this.scatterplot.selected_elems;
    // if something is selected
    if (selected.length > 0) {
      if (selected[0].players_list) {
        // take players from scatter bubbles
        selected.forEach(bubble => {
          bubble.players_list.forEach(id => {
            players.push(this.model.players[this.model.playersById[id]]);
          });
        });
      }
    }
    else if (scatter_selected.length > 0) {
        // take players from individual ids
        scatter_selected.forEach(elm => {
          players.push(this.model.players[this.model.playersById[elm.id]]);
        })
    }

    let countries_avgs = this.model.playersByCountries(countries, this.isValidPlayer.bind(this))

    this.updateRadar(players, 'players');
    this.updateRadar(countries_avgs, 'countries');
  }

  updateRadar(players, polyline) {
    //check how many players are selected
    this.radarSetOfSkills(this.radar_type, players).then(data => {
      if (polyline === 'players') {
        this.radarchart.data_players = data;
      } else if (polyline === 'countries') {
        this.radarchart.data_countries = data;
      }
    });
  }

  updateBarPlot(players) {
    this.barplotSetOfSkills(players).then(data => {
      this.barplot.data = data;
    });
  }

  updateBubble(players, x_axis, y_axis) {
    this.bubblechart.x_axis = x_axis || this.bubblechart.x_axis;
    this.bubblechart.y_axis = y_axis || this.bubblechart.y_axis;
    this.matrixBubbleChart(this.bubblechart.x_axis, this.bubblechart.y_axis, players).then(data => {
      this.bubblechart.data = data;
      if (this.scatterplot.selected_elems && this.scatterplot.selected_elems.length > 0) {
        this.highlightBubble(this.scatterplot.selected_elems.map( e => {
          return this.model.players[this.model.playersById[e.id]];
        }))
      }
    })

  }

  updateScatter(players) {

    this.scatterplot.x_axis = "";
    this.scatterplot.y_axis = "";

    this.pcaScatterplotMatrix(players).then( data => {
      this.scatterplot.data = data;
    })

  }

  highlightBubble(players){
    this.bubblechart.highlight(players.map( p => p.uid ));
  }

  highlightScatter(players){
    this.scatterplot.highlight(players.map( p => p.uid ));
  }

  zoomBrush() {
    this.scatterplot.zoomBrush();
  }

  changeAgeRange(min, max) {
    this.ageRange = [min, max];
    this.mapchart.values = this.countryStrengthPerRole();
    this.mapchart.changeRamp(this.actualRole.role_scale);
    if (this.mapchart.selected_elems.length > 0)
      this.onCountriesSelection(this.mapchart.selected_elems);
  }

  changeSamplingRate(rate) {
    this.scatterplot.minimum_distance = rate;
    this.scatterplot.draw(true)
  }

  isValidPlayer(player) {
    return player.hasRole(this.actualRole) && this.isInAgeRange(player);
  }

  isInAgeRange(player) {
    return player.age >= this.ageRange[0] &&
           player.age <= this.ageRange[1];
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

Controller.prototype.barplotSetOfSkills = barplotSetOfSkills;
Controller.prototype.countryStrengthPerRole = countryStrengthPerRole;
Controller.prototype.radarSetOfSkills = radarSetOfSkills;
Controller.prototype.matrixBubbleChart = matrixBubbleChart;
Controller.prototype.pcaScatterplotMatrix = pcaScatterplotMatrix;