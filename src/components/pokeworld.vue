<template lang="pug">
.pokeworld
  .layer-10.flex-center.flex-col.hw-100
    loading-screen(@enter="enterPokeworld")
  .layer-12.flex-center.flex-col.hw-100.vis-anim.not-hidden(
    :class="{ 'hidden': !enter }"
  )
</template>
<script>
import { defineComponent, ref } from 'vue'
import loadingScreen from './loading-screen.vue'
export default defineComponent({
  name: 'Pokeworld',
  components: {
    loadingScreen
  },
  data() {
    return {
      enter: false,
    }
  },
  methods: {
    enterPokeworld() {
      this.enter = true
    },
  },
  computed: {},
})
</script>
<style lang="sass">
.pokeworld
  position: relative
  width: 100vw
  height: 100vh
  background: $green
</style>
