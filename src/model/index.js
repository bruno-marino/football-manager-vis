import Player from './player'
import Country from './country'

class Model {
  constructor() {
    this.players = []
    this.playersById = {}
    this.countries = []
    this.countriesById = {}

    this.onPlayersListChanged = () => {}
    this.onCountriesListChanged = () => {}
  }
  //
  bindEntriesListChanged(callback) {
    this.onEntriesListChanged = callback
  }
  //
  addPlayer(player) {
    //if (entry.id === undefined) throw new Error('Entry with missing id')
    this.players.push(new Player(player))
    this.playersById[player.UID] = this.players.length - 1
    this.onPlayersListChanged()
  }
  updateEntry(entry) {
    this.entries[this.entriesById[entry.UID]] = { ...this.entriesById[entry.UID], ...entry }
    this.onEntriesListChanged()
  }
  deleteEntry(entryId) {
    const entryIndex = this.entriesById[entryId]
    this.entries.splice(entryIndex, 1)
    delete this.entriesById[entryId]
    this.entries.forEach(e => {
      if (this.entriesById[e.id] > entryIndex) this.entriesById[e.id] -= 1
    })
    this.onEntriesListChanged()
  }

  // countries
  addCountry(country) {
    this.countries.push(new Country(country));
    this.countriesById[country.id] = this.countries.length -1;
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
}

export default new Model()