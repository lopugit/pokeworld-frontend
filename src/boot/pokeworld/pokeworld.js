export default class Pokeworld {
  constructor() {
    this.name = 'Pokeworld'
    this.version = '0.0.1'
    this.description = 'The pokeworld'
    this.author = 'Lopu'
    this.homepage = 'pokeworld.io'

    requestAnimationFrame(loop)

  }

  loop() {

    this.updateLocation()

    requestAnimationFrame(this.loop.bind(this))
  }

  updateLocation() {

  }

}
