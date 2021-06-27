<template>
  <div class="relative flex flex-col bg-black" ref="fullscreenElement">
    <lmap class="fixed top-0 left-0" />
    <slideshow
      v-if="slides.length"
      class="relative flex-col transform transition-transform duration-1000 ease-out"
      :class="[
        showMap ? 'scale-25 origin-top-left' : 'scale-100 origin-top-left',
      ]"
    />
    <control
      class="fixed w-full z-10"
      :collections="collections"
      v-show="showMenu"
      :fselement="fullscreenElement"
    />
    <div class="fixed top-0 right-0 z-20 flex flex-row mt-1">
      <img
        class="w-4 mr-4 cursor-pointer"
        src="@/assets/mappin.svg"
        alt="map icon"
        @click="showMap = !showMap"
      />
      <img
        class="w-4 mr-2 cursor-pointer"
        src="@/assets/hamburger.svg"
        alt="menu icon"
        @click="showMenu = !showMenu"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useControlStore } from './store/useControlStore'
import Slideshow from '@/components/Slideshow.vue'
import Control from '@/components/Control.vue'
import LMap from '@/components/Map.vue'

const { actions: controlActions, getters: controlGetters } = useControlStore()

export default defineComponent({
  name: 'App',
  components: {
    slideshow: Slideshow,
    control: Control,
    lmap: LMap,
  },
  setup() {
    const thumbnails = ref(null)
    const main = ref(null)
    const showMenu = ref(false)
    const showMap = ref(false)
    const fullscreenElement = ref(null)
    const slides = ref([])

    controlActions.fetchCollections()

    return {
      slides,
      thumbnails,
      collections: controlGetters.collections,
      main,
      showMenu,
      showMap,
      fullscreenElement,
    }
  },
})
</script>

<style lang="postcss">
html {
  @apply font-playful;
}
body {
  background-color: black;
}
</style>
