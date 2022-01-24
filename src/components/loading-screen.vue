<template lang="pug">
.loading-screen
  .loading-img.flex-center
    img(src="/loading.gif", alt="Loading...")
  .login-form.mw-100.w-300(v-if="!enter")
    q-input.full-width.text-black(label="Username", dense, standout, filled, bg-color="white", color="black", v-model="username")
    q-input.full-width.pt-12.text-black(label="Password", dense, standout, filled, bg-color="white", color="black", type="password" v-model="password")
    q-btn.mt-12.full-width(label="enter", color="grassgreen", text-color="white" @click="enterPokeworld")
  .loading-text.text-center.text-h5.text-white(v-if='enter') Loading...
</template>
<script>
import { defineComponent } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'

export default defineComponent({
  name: 'Loading Screen',
  components: {},
  data() {
    return {
      enter: false,
      username: undefined,
      password: undefined,
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    return {
      username: { required, email },
      password: { required, minLength: minLength(8) }
    }
  },
  methods: {
    enterPokeworld() {
      this.$emit('enter')
      this.enter = true
    },
  },
  computed: {},
})
</script>
<style lang="sass">
</style>
