<template>
  <div class="w-full flex flex-col items-center justify-center">
    <div class="flex flex-col md:flex-row">
      <canvas ref="pwg" class="border border-grass" width="512px" height="512px" />
      <canvas ref="gmap" class="ml-12 border border-grass" width="512px" height="512px" />
    </div>
    <div class="debug flex flex-col">
      <pre class="pt-4">{{ debug('player') }}</pre>
      <pre class="pt-4">{{ debug('map') }}</pre>
    </div>
  </div>
</template>
<script>
import { get } from 'lodash'

const tileSize = 32
const blockCount = 16
const playerBoundaryOffset = 4
export default {
  name: 'Game',
  data() {
    return {
      blocks: [],
      tiles: [],
      images: [],
      storedImages: {},
      map: {
        width: blockCount - 1,
        x: 0,
        y: 0,
        playerXBoundaryOffset: tileSize * playerBoundaryOffset,
        playerYBoundaryOffset: tileSize * playerBoundaryOffset,
        blockX: 0,
        blockY: 0
      },
      game: {
        blockCount,
        blockWidth: tileSize * blockCount,
        blockHeight: tileSize * blockCount,
        playerXBoundaryOffset: tileSize * playerBoundaryOffset,
        playerYBoundaryOffset: tileSize * playerBoundaryOffset,
        tileSize
      },
      player: {
        initialized: false,
        sprite: 'char-walk-1',
        blockX: 0,
        blockY: 0,
        x: 0,
        y: 0
      }
    }
  },
  watch: {
    'map.x'() {
      this.updateMapBlock()
    },
    'map.y'() {
      this.updateMapBlock()
    },
    'player.x'() {
      this.updatePlayerBlock()
    },
    'player.y'() {
      this.updatePlayerBlock()
    },
    'player.blockX'() {
      if (this.player.initialized) {
        this.getBlocks()
      }
    },
    'player.blockY'() {
      if (this.player.initialized) {
        this.getBlocks()
      }
    },
    'tiles'() {
      window.tiles = this.tiles
    }
  },
  async beforeMount() {
    await this.initializeMap()
    await this.initializePlayer()
  },
  mounted() {
    clearInterval(window.gameInterval)
    window.gameInterval = setInterval(this.renderCanvas, 1000 / 60)
  },
  methods: {
    // DEBUG
    debug(key) {
      return key + ' ' + JSON.stringify(this[key], undefined, 2)
    },

    // PLAYER
    updatePlayerBlock() {
      this.player.blockX = Math.floor(this.player.x / 512)
      this.player.blockY = Math.floor(this.player.y / 512)
    },
    initializePlayer() {
      this.player.x = this.map.x + ((this.game.blockCount / 2) * this.game.tileSize)
      this.player.y = this.map.y + ((this.game.blockCount / 2) * this.game.tileSize)
      this.player.initialized = true
      this.getBlocks()
      this.player.keydown = this.onKeydown

      this.updatePlayerBlock()

      document.removeEventListener('keydown', window?.player?.keydown)
      window.player = this.player
      document.addEventListener('keydown', this.player.keydown)
    },
    onKeydown(e) {
      if (e.key === 'ArrowRight') {
        const mapXRightCutoff = this.map.x + (this.game.blockWidth - this.game.playerXBoundaryOffset)
        if (this.player.x >= mapXRightCutoff) {
          this.map.x += this.game.tileSize
        }
        this.player.x = this.player.x + this.game.tileSize
      } else if (e.key === 'ArrowLeft') {
        const mapXLeftCutoff = this.map.x + this.game.playerXBoundaryOffset
        if (this.player.x < mapXLeftCutoff) {
          this.map.x -= this.game.tileSize
        }
        this.player.x = this.player.x - this.game.tileSize
      } else if (e.key === 'ArrowDown') {
        const mapYDownCutoff = this.map.y + this.game.playerYBoundaryOffset
        if (this.player.y < mapYDownCutoff) {
          this.map.y -= this.game.tileSize
        }
        this.player.y = this.player.y - this.game.tileSize
      } else if (e.key === 'ArrowUp') {
        const mapYUpCutoff = this.map.y + (this.game.blockWidth - this.game.playerYBoundaryOffset)
        if (this.player.y >= mapYUpCutoff) {
          this.map.y += this.game.tileSize
        }
        this.player.y = this.player.y + this.game.tileSize
      }
    },

    // MAP
    async initializeMap() {
      const resp = await this.$axios.get(process.env.API + '/blockLatLng', {
        params: {
          lng: 145.00569971273293,
          lat: -37.87569351417865
        }
      }).catch(err => console.error(err))
      console.log('resp', resp)
      if (resp && resp.data) {
        this.map.blockX = resp.data.block.x
        this.map.blockY = resp.data.block.y
        this.map.x = resp.data.block.x * this.game.blockWidth
        this.map.y = resp.data.block.y * this.game.blockHeight
      }
    },
    updateMapBlock() {
      if ((this.map.x + this.player.x) > ((this.map.blockX + 1) * 512)) {
        this.map.blockX++
      } else if ((this.map.x + this.player.x) < this.map.blockX * 512) {
        this.map.blockX--
      }
      if ((this.map.y + this.player.y) > ((this.map.blockY + 1) * 512)) {
        this.map.blockY++
      } else if ((this.map.y + this.player.y) < this.map.blockY * 512) {
        this.map.blockY--
      }
    },

    // GAME
    renderCanvas() {
      const canvas = this.$refs.pwg
      const gMapCanvas = this.$refs.gmap

      // render floor tiles
      if (this.tiles) {
        this.map.tileCount = 0
        this.map.blocks = []
        this.tiles.forEach((tile, index) => {
          if (this.tileShouldRender(tile)) {
            if (!this.map.blocks.includes(tile.blockX + '_' + tile.blockY)) {
              this.map.blocks.push(tile.blockX + '_' + tile.blockY)
            }
            this.map.tileCount++
            const x = (tile.mapX - this.map.x)
            const y = (tile.mapY - this.map.y)
            const imageTileKey = this.images.indexOf(tile.img)
            if (imageTileKey >= 0) {
              const imageTile = this.storedImages[imageTileKey]
              if (imageTile?.loaded) {
                try {
                  canvas.getContext('2d').drawImage(imageTile.imgEl, x, this.convertY(y), this.game.tileSize, this.game.tileSize)
                } catch {
                }
              }
            }
            const imageGmapKey = this.images.indexOf(tile.image)
            if (imageGmapKey >= 0) {
              const imageGmap = this.storedImages[imageGmapKey]
              if (imageGmap?.loaded) {
                // try {
                gMapCanvas.getContext('2d').drawImage(imageGmap.imgEl, x, this.convertY(y), this.game.tileSize, this.game.tileSize)
                // } catch {
                //   console.error('something went wrong')
                // }
              }
            }
          }
        })
      }

      // render character
      if (this.player) {
        const imageKey = this.images.indexOf(this.player.sprite)
        if (imageKey >= 0) {
          const image = this.storedImages[imageKey]
          if (image?.loaded) {
            try {
              const x = (this.player.x - this.map.x)
              const y = (this.player.y - this.map.y)

              canvas.getContext('2d').drawImage(image.imgEl, x + 2, this.convertY(y + 10), 28, 42)
            } catch {
            }
          }
        } else {
          this.images.push(this.player.sprite)
          const newImageKey = this.images.indexOf(this.player.sprite)

          const imgEl = new Image()
          this.storedImages[newImageKey] = {
            imgEl
          }
          imgEl.onload = (e) => {
            this.storedImages[newImageKey].loaded = true
          }
          imgEl.src = '/sprites/' + this.player.sprite + '.png'
        }
      }
    },
    tileShouldRender(tile) {
      let xValid = false
      let yValid = false

      if (
        tile.mapX >= this.map.x && tile.mapX < (this.map.x + 512)
      ) {
        xValid = true
      }

      if (
        tile.mapY >= this.map.y && tile.mapY < (this.map.y + 512)
      ) {
        yValid = true
      }

      return xValid && yValid
    },
    convertY(y) {
      return (this.game.tileSize * 15) - y
    },
    async getBlocks() {
      console.log('Maybe getting blocks')
      if (this.player.blockX && this.player.blockY) {
        console.log('Getting blocks')
        const resp = await this.$axios.get(process.env.API + '/block', {
          params: {
            blockX: this.player.blockX,
            blockY: this.player.blockY
          }
        }).catch(err => console.error(err))

        if (get(resp, 'data.tiles')) {
          this.blocks.push(resp.data.block)
          this.tiles.push(...resp.data.tiles)
          this.storeTileData()
        }
      } else {
        console.log('no map blockX or blockY')
      }
    },
    storeTileData() {
      this.tiles.forEach((tile) => {
        if (tile.img) {
          if (!this.images.includes(tile.img)) {
            this.images.push(tile.img)
            const imagesId = this.images.indexOf(tile.img)
            const imgEl = new Image()
            this.storedImages[imagesId] = {
              imgEl
            }
            imgEl.onload = (e) => {
              this.storedImages[imagesId].loaded = true
            }
            imgEl.src = '/tiles/' + tile.img + '.png'
          }
        }
        if (tile.image) {
          if (!this.images.includes(tile.image)) {
            this.images.push(tile.image)
            const imagesIdGmap = this.images.indexOf(tile.image)
            const imgElGmap = new Image()
            this.storedImages[imagesIdGmap] = {
              imgEl: imgElGmap
            }
            imgElGmap.onload = (e) => {
              this.storedImages[imagesIdGmap].loaded = true
            }
            imgElGmap.src = 'data:image/png;base64,' + tile.image
          }
        }
      })
    }
  }
}
</script>
