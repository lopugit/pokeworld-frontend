<template lang="pug">
q-layout(view='lHh Lpr lFf')
  q-header.header(
    floating
  )
    q-toolbar
      q-btn(
        flat,
        dense,
        round,
        icon='menu',
        aria-label='Menu',
        @click='leftDrawerOpen = !leftDrawerOpen'
      )
      q-toolbar-title.text-bold(style='padding-left: 14px')
        a(href='/') Pokeworld

      .app-description-container(style='padding-right: 14px')
        | Behold the Pokeworld!
  q-drawer(v-model='leftDrawerOpen', overlay, dark)
    q-list
      q-item
        //- q-item-section
        q-item-section(avatar)
          q-btn(
            flat,
            dense,
            round,
            icon='close',
            aria-label='Menu',
            @click='leftDrawerOpen = false'
          )
      q-item
        q-item-section.text-bold
          | Menu
      q-item(clickable, href='/')
        q-item-section
          q-item-label Home
      template(v-for='(suggestion, idx) in suggestions')
        q-item(clickable, :href='suggestion[0].replace(/ /gi, "-")')
          q-item-section
            q-item-label {{ suggestion[0] }}
      q-item.p-12
        q-item-section.text-bold
          | Privacy
      q-item(clickable, href='/privacy-policy')
        q-item-section
          q-item-label Privacy Policy
      q-item(clickable, href='https://www.youtube.com/t/terms')
        q-item-section
          q-item-label YouTube Terms of Service
      q-item(clickable, href='https://policies.google.com/privacy')
        q-item-section
          q-item-label Google Privacy Policy
  q-page-container.pa-0
    router-view
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {},
  setup() {
    return {
      leftDrawerOpen: ref(false),
    }
  },
  data() {
    return {}
  },
  computed: {
    suggestions: {
      get() {
        return this.$store.state.pokeworld.suggestions
      },
      set(val) {
        this.$store.commit('pokeworld/thing', {
          key: 'suggestions',
          val,
        })
      },
    },
  },
})
</script>
<style lang="sass">
.header
  background: $primary

@media (max-width: 481px)
  .app-description-container
    display: none
</style>
