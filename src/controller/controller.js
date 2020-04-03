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
    this.scatterplot = new views.scatterplot();
    this.bubblechart = new views.scatterplot();
    this.rolesettings = rolesettings;
    this.radar_type = 'principal';
    this._role_id = '0';
    this.scatterplot.x_axis = "";
    this.scatterplot.y_axis = "";

    // register callback function for model upddate events
    this.model.bindPlayersListChanged(this.onPlayersListChanged.bind(this));
    this.model.bindCountriesListChanged(this.onCountriesListChanged.bind(this));
    this.mapchart.bindElemSelection(this.onCountriesSelection.bind(this));
    this.scatterplot.bindElemSelection(this.onScatterSelection.bind(this));
    this.bubblechart.bindElemSelection(this.onScatterSelection.bind(this));
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
    this.scatterplot.pca_role = role_id;
    this.mapchart.values = this.countryStrengthPerRole();
    this.mapchart.changeRamp(this.actualRole.role_scale);
    if(this.mapchart.selected_elems.length > 0)
      this.onCountriesSelection(this.mapchart.selected_elems);
  }

  onAxisChange(x_axis, y_axis) {
    this.bubblechart.pca = false;

    let countries = this.mapchart.selected_elems.map(country => country.id);
    let players = this.model.playersByCountries(countries);

      this.updateRadar(players);
      this.bubblechart.resetSelection();
      this.updateBarPlot([]);
      this.radarchart.legend_label = "Selected countries";
    this.updateScatter(players, x_axis, y_axis);
  }

  onCountriesSelection(countries) {
    this.bubblechart.resetSelection();
    countries = countries.map(country => country.id);
    let players = this.model.playersByCountries(countries);
    
    this.radarchart.legend_label = "Selected countries";
    
    this.updateBarPlot([]);
    this.updateRadar(players);
    this.updateScatter(players);
  }

  onScatterSelection(elems) {
    // check if elems are bubbles or players
    if ( elems.length == 0 || elems[0].players_list) {
      this.onBubbleSelection(elems);
    } else {
      let players = [];
      elems.forEach(elm => {
        players.push(this.model.players[this.model.playersById[elm.id]]);
      })

      this.updateBarPlot(players);
      this.updateRadar(players);
      this.radarchart.legend_label = "Selected players";
    }
  }

  onBubbleSelection(bubbles) {
    let players = [];
    bubbles.forEach(bubble => {
      bubble.players_list.forEach(id => {
        players.push(this.model.players[this.model.playersById[id]]);
      });
    });

    if(players.length>0){
      this.radarchart.legend_label = "Selected players";
    }
    this.radarchart.legend_label = "Selected players";
    
    this.updateBarPlot(players); 
        
    if (bubbles.length == 0) {
      this.onCountriesSelection(this.mapchart.selected_elems);
    } else {
      this.updateRadar(players);
    }
  }

  onRadarTypeChange(radar_type) {
    this.radar_type = radar_type;
    let countries = this.mapchart.selected_elems.map(country => country.id);

    let players = [];
    let selected = this.bubblechart.selected_elems;
    console.log(selected)
    // if something is selected don't consider countries averages
    if (selected.length > 0) {
      if (selected[0].players_list) {
        // take players from scatter bubbles
        selected.forEach(bubble => {
          bubble.players_list.forEach(id => {
            players.push(this.model.players[this.model.playersById[id]]);
          });
        });
      } else {
        console.log('ok')
        // take players from individual ids
        selected.forEach(elm => {
          players.push(this.model.players[this.model.playersById[elm.id]]);
        })
      }
    } else {
      players = this.model.playersByCountries(countries)
    }
    
    this.updateRadar(players);
  }
/*
  onPcaActivation(){
    this.scatterplot.pca = true;
    this.onCountriesSelection(this.mapchart.selected_elems);
  }
*/
  updateRadar(players) {
    this.radarSetOfSkills(this.radar_type, players).then(data => {
      this.radarchart.data = data;
    });
  }

  updateBarPlot(players) {
    this.barplotSetOfSkills(players).then(data => {
      this.barplot.data = data;
    });
  }

  updateScatter(players, x_axis, y_axis) {

    // if pca activated then do something else and remove axis labels
    this.bubblechart.x_axis = x_axis || this.bubblechart.x_axis;
    this.bubblechart.y_axis = y_axis || this.bubblechart.y_axis;

    if(this.bubblechart.pca == true){

      this.scatterplot.x_axis = "";
      this.scatterplot.y_axis = "";

      this.pcaScatterplotMatrix(players).then( data => {
        this.scatterplot.data = data;
      })
    }else{
      this.matrixBubbleChart(this.bubblechart.x_axis, this.bubblechart.y_axis, players).then(data => {
        this.bubblechart.data = data;
      })
    } 
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