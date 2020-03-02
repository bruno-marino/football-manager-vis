export default class Player {
  constructor(player) {
    Object.keys(player).forEach(feature => {
      this[feature.toLowerCase()] = player[feature]
    })
  }

  // add methods like
  // getAvgDefSkill()
  // getAvgMidSkill()
  // getAvgAtkSkill()
}