<template lang="pug">
.pokeworld
  .layer-10.flex-center.flex-col.hw-100
    img(src="/loading.gif", alt="Loading...")
    .login-form.mw-100.w-300
      q-input.full-width.text-black(label="Username", dense, standout, filled, bg-color="white", color="black", v-model="username")
      q-input.full-width.pt-12.text-black(label="Password", dense, standout, filled, bg-color="white", color="black", type="password" v-model="password")
      q-btn.mt-12.full-width(label="enter", color="grassgreen", text-color="white" @click="enterPokeworld")
  .layer-12.flex-center.flex-col.hw-100.vis-anim.not-hidden(
    :class="{ 'hidden': !enter }"
  )
</template>
<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'Pokeworld',
  components: {},
  data() {
    return {
      enter: ref(false),
      username: ref(undefined),
      password: ref(undefined)
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
