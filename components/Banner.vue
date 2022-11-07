<template>
  <div class="w-full flex flex-col md:flex-row py-16 items-center justify-center">
    <div
      v-if="image"
      class="w-full md:w-6/12 flex items-center justify-center"
      :class="{
        'md:order-2': swap,
      }"
    >
      <img
        :src="image"
        :class="{
          'rounded-full': imageCircle
        }"
      >
    </div>
    <div
      class="flex flex-col w-full md:w-6/12 justify-center"
      :class="{
        'items-center': !image
      }"
    >
      <div v-if="tagline" class="text-4xl -mb-4 font-bold text-black">
        {{ tagline }}
      </div>
      <div
        v-if="title"
        class="text-6xl font-bold text-black"
        :class="{
          'text-center': !image
        }"
      >
        {{ title }}
      </div>
      <div v-if="description" class="text-black text-3xl pt-3">
        {{ description }}
      </div>
      <div v-if="descriptions" class="text-black flex flex-col text-xl pt-3">
        <div v-for="(description, key) in descriptions" :key="key" class="pb-3">
          {{ description }}
        </div>
      </div>
      <div v-if="keywords" class="text-grass font-bold text-sm pt-6">
        {{ keywords }}
      </div>
      <div v-if="links?.length" class="text-black font-bold text-sm pt-6 flex flex-row">
        <a v-for="(link, key) in links" :key="key" target="_blank" class="pb-2 text-grass pr-2 text-lg" :href="link.link">{{ link.text }}{{ key !== links.length-1 ? ', ' : '' }} </a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    image: {
      type: String
    },
    imageCircle: {
      type: Boolean,
      default: false
    },
    swap: {
      type: Boolean,
      default: false
    },
    tagline: {
      type: String
    },
    // The title of the banner
    title: {
      type: String
    },
    // The description of the banner
    description: {
      type: String
    },
    descriptions: {
      type: Array
    },
    // The keywords of the banner
    keywords: {
      type: String
    },
    links: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  }
}</script>
