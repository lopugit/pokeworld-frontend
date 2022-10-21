<template>
  <div class="w-full flex items-center justify-center">
    <canvas id="pwg" ref="pwg" class="border border-grass" width="512px" height="512px" />
  </div>
</template>
<script>
import { get } from 'lodash'
export default {
  name: 'Game',
  data() {
    return {
      blocks: [],
      tiles: [],
      currentBlock: {},
      currentTiles: [],
      images: [],
      storedImages: {},
      tileSize: 32,
      coords: {
        blockX: 0,
        blockY: 0,
        x: 0,
        y: 0
      },
      player: null
    }
  },
  beforeMount() {
    this.initializePlayer()
  },
  async mounted() {
    await this.getBlocks()
    clearInterval(window.gameInterval)
    window.gameInterval = setInterval(this.renderCanvas, 1000 / 60)
  },
  methods: {
    initializePlayer() {
      this.player = {
        sprite: 'char-walk-1',
        blockX: 0,
        blockY: 0,
        x: 32 * (this.tileSize / 4),
        y: 32 * (this.tileSize / 4),
        keydown: this.onKeydown
      }

      document.removeEventListener('keydown', window?.player?.keydown)
      window.player = this.player
      document.addEventListener('keydown', this.player.keydown)
    },
    onKeydown(e) {
      if (e.key === 'ArrowRight') {
        if (this.player.x === this.tileSize * 15) {
          this.player.blockX++
          this.player.x = 0
        } else {
          this.player.x = this.player.x + 32
        }
      } else if (e.key === 'ArrowLeft') {
        if (this.player.x === 0) {
          this.player.blockX--
          this.player.x = 32 * 15
        } else {
          this.player.x = this.player.x - 32
        }
      } else if (e.key === 'ArrowUp') {
        if (this.player.y === 0) {
          this.player.blockY--
          this.player.y = this.tileSize * 15
        } else {
          this.player.y = this.player.y - 32
        }
      } else if (e.key === 'ArrowDown') {
        if (this.player.y === this.tileSize * 15) {
          this.player.blockY++
          this.player.y = 0
        } else {
          this.player.y = this.player.y + 32
        }
      }
    },
    renderCanvas() {
      const canvas = this.$refs.pwg

      // render floor tiles
      if (this.currentTiles) {
        this.currentTiles.forEach((tile, index) => {
          if (this.tileShouldRender(tile)) {
            const x = tile.x
            const y = tile.y
            const canvasX = (x * this.tileSize)
            const canvasY = (y * this.tileSize)
            const imageKey = this.images.indexOf(tile.img)
            if (typeof imageKey === 'number') {
              const image = this.storedImages[imageKey]
              if (image?.loaded) {
                try {
                  canvas.getContext('2d').drawImage(image.imgEl, canvasX, canvasY, this.tileSize, this.tileSize)
                } catch {
                }
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
              canvas.getContext('2d').drawImage(image.imgEl, this.player.x + 2, this.player.y - 10, 28, 42)
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
      if (this.coords.blockX === tile.blockX && this.coords.blockY === tile.blockY) {
        return true
      }
    },
    async getBlocks() {
      const resp = await this.$axios.get(process.env.API + '/block', {
        params: {
          lng: 145.00569971273293,
          lat: -37.87569351417865
        }
      }).catch(err => console.error(err))

      if (get(resp, 'data.tiles')) {
        console.log('main block', resp.data)
        this.blocks.push(resp.data.block)
        this.tiles.push(...resp.data.tiles)
        this.currentBlock = resp.data.block
        this.currentTiles = resp.data.tiles
        this.coords.blockX = this.currentBlock.x
        this.coords.blockY = this.currentBlock.y
        this.storeTileData()
      }
    },
    storeTileData() {
      this.currentTiles.forEach((tile) => {
        if (tile.img) {
          if (!this.images.includes(tile.img)) {
            this.images.push(tile.img)
            const imagesId = this.images.length - 1
            const imgEl = new Image()
            this.storedImages[imagesId] = {
              tile,
              imgEl
            }
            imgEl.onload = (e) => {
              this.storedImages[imagesId].loaded = true
            }
            imgEl.src = '/tiles/' + tile.img + '.png'
          }
        }
      })
    }
  }
}
</script>
