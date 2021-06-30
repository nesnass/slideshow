<template>
  <div class="relative flex flex-col bg-black" ref="fullscreenElement">
    <lmap class="fixed top-0 left-0" />
    <slideshow
      class="relative flex-col transform transition-transform duration-1000 ease-out"
      @click="showTheMap(false)"
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
        @click="showTheMap()"
      />
      <img
        class="w-4 mr-2 cursor-pointer"
        src="@/assets/hamburger.svg"
        alt="menu icon"
        @click="showTheMenu()"
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
    const showMenu = ref(false)
    const showMap = ref(false)
    const fullscreenElement = ref(null)

    controlActions.fetchCollections()

    function showTheMap(show?: boolean) {
      if (show !== undefined) showMap.value = show
      else showMap.value = !showMap.value
    }
    function showTheMenu() {
      showMenu.value = !showMenu.value
    }
    function keyPressed(evt: KeyboardEvent) {
      if (evt.code === 'Space') {
        controlActions.setPaused(!controlGetters.paused.value)
      } else if (evt.code === 'ArrowLeft') {
        controlActions.setPaused(true)
        let i = controlGetters.currentSlideIndex.value
        i = i > 0 ? i - 1 : 0
        controlActions.setCurrentSlideIndex(i)
      } else if (evt.code === 'ArrowRight') {
        controlActions.setPaused(true)
        let i = controlGetters.currentSlideIndex.value
        const l = controlGetters.slides.value.length - 2
        i = i < l ? i + 1 : i
        controlActions.setCurrentSlideIndex(i)
      }
    }
    document.addEventListener('keyup', keyPressed)

    return {
      slides: controlGetters.slides,
      collections: controlGetters.collections,
      showMenu,
      showMap,
      fullscreenElement,
      showTheMap,
      showTheMenu,
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
