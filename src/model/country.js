// Maybe not necessary
export default class Country {
  constructor(country) {
    Object.keys(country).forEach(feature => {
      this[feature.toLowerCase()] = country[feature]
    })
  }
}