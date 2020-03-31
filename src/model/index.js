import Player from './player'
import Country from './country'

class Model {
  constructor() {
    this.players = []
    this.playersById = {}
    this.playersByCountry = {}
    this.countries = []
    this.countriesById = {}

    this.onPlayersListChanged = () => {}
    this.onCountriesListChanged = () => {}
  }
  //
  bindPlayersListChanged(callback) {
    this.onPlayersListChanged = callback
  }

  bindCountriesListChanged(callback) {
    this.onCountriesListChanged = callback
  }

  //
  addPlayer(player) {
    //if (entry.id === undefined) throw new Error('Entry with missing id')
    player = new Player(player)
    this.players.push(player)
    this.playersById[player.uid] = this.players.length - 1
    if (!this.playersByCountry[player.country_code]) {
      this.playersByCountry[player.country_code] = []
    }
    this.playersByCountry[player.country_code].push(player.uid)
    this.onPlayersListChanged()
  }
  updatePLayer(player) {
    this.players[this.playersById[player.UID]] = { ...this.playersById[player.UID], ...player }
    this.onEntriesListChanged()
  }
  deletePlayer(playerId) {
    const entryIndex = this.playersById[playerId]
    this.entries.splice(entryIndex, 1)
    delete this.playersById[playerId]
    this.players.forEach(e => {
      if (this.playersById[e.id] > entryIndex) this.playersById[e.id] -= 1
    })
    this.onEntriesListChanged()
  }

  // countries
  addCountry(country) {
    this.countries.push(new Country(country));
    //this.countriesById[country.id] = this.countries.length -1;
    this.onCountriesListChanged();
  }

  deleteCountry(countryId) {
    const entryIndex = this.countriesById[countryId]
    this.countries.splice(entryIndex, 1)
    delete this.countriesById[countryId]
    this.countries.forEach(e => {
      if (this.countriesById[e.id] > entryIndex) this.countriesById[e.id] -= 1
    })
    this.onEntriesListChanged()
  }

  playersByCountries(countries) {
    let result = [];
    countries.forEach(country_code => {
      if (!this.playersByCountry[country_code])
        return
      
      this.playersByCountry[country_code].forEach(player_uid => {
        result.push(this.players[this.playersById[player_uid]]);
      })
    })

    return result;
  }
}

export default new Model()