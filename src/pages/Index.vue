<template lang="pug">
q-page(class="flex flex-center")
  pokeworld
</template>

<script>
import { defineComponent } from 'vue';
import pokeworld from 'components/pokeworld.vue';
export default defineComponent({
  components: {
    pokeworld
  },
  name: 'Index'
})
</script>
