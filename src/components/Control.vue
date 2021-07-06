<template>
  <div class="flex flex-col" id="control">
    <div
      class="absolute font-playful text-sm bg-opacity-75 bg-blue flex flex-row h-8 w-full sm:justify-around justify-start"
    >
      <div class="flex flex-row">
        <button
          @click="slideBack()"
          class="noOutline px-1 text-white font-bold"
        >
          ←
        </button>
        <button
          @click="slideForward()"
          class="noOutline px-1 text-white font-bold ml-2 md:ml-8"
        >
          →
        </button>
      </div>
      <button
        @click="pauseSlides()"
        class="noOutline px-1"
        :class="[paused ? 'text-goldenrod' : 'text-white']"
      >
        {{ paused ? 'Paused' : 'Pause' }}
      </button>
      <button
        @click="fullscreen()"
        class="noOutline px-1"
        :class="[showFullscreen ? 'text-goldenrod' : 'text-white']"
      >
        Fullscreen
      </button>
      <button
        @click="callThumbs()"
        class="noOutline px-1"
        :class="[showThumbs ? 'text-goldenrod' : 'text-white']"
      >
        Thumbs
      </button>
      <button
        @click="callCollections()"
        class="noOutline px-1"
        :class="[showCollections ? 'text-goldenrod' : 'text-white']"
      >
        Collections
      </button>
    </div>
    <div
      class="flex flex-row flex-wrap mt-8 overflow-y-auto h-screen"
      v-if="showThumbs"
    >
      <div v-for="(slide, index) in slides" :key="index" class="flex">
        <img
          :src="slide.thumbnailUrl"
          alt="slide"
          @click="selectItem(index)"
          class="h-32"
        />
      </div>
    </div>
    <div class="flex flex-row flex-wrap mt-8" v-if="showCollections">
      <div
        v-for="(c, index) in collections"
        :key="index"
        class="flex bg-blue75 rounded-md p-2 h-10 m-1"
        @click="selectCollection(c)"
      >
        <p class="text-white">{{ c }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import { useControlStore } from '../store/useControlStore'
const { getters: controlGetters, actions: controlActions } = useControlStore()

export default defineComponent({
  name: 'Control',
  props: {
    fselement: { type: HTMLElement, required: true },
  },
  setup(props) {
    const { fselement } = toRefs(props)
    const showThumbs = ref(false)
    const showFullscreen = ref(false)
    const showCollections = ref(false)
    const selectItem = (index: number) => {
      controlActions.requestSlideIndex(index)
      controlActions.setPaused(true)
      showThumbs.value = false
    }
    const selectCollection = (name: string) => {
      controlActions.selectCollection(name)
      showCollections.value = false
    }
    const pauseSlides = () => {
      controlActions.setPaused(!controlGetters.paused.value)
    }
    const fullscreen = () => {
      const element = fselement.value
      if (!document.fullscreenElement) {
        element.requestFullscreen()
        showFullscreen.value = true
      } else {
        document.exitFullscreen()
        showFullscreen.value = false
      }
    }
    const callThumbs = () => {
      showThumbs.value = !showThumbs.value
      showCollections.value = false
    }
    const callCollections = () => {
      showCollections.value = !showCollections.value
      showThumbs.value = false
    }
    const slideBack = () => {
      controlActions.setPaused(true)
      let i = controlGetters.currentSlideIndex.value
      i = i > 0 ? i - 1 : 0
      controlActions.setCurrentSlideIndex(i)
    }
    const slideForward = () => {
      controlActions.setPaused(true)
      let i = controlGetters.currentSlideIndex.value
      const l = controlGetters.slides.value.length - 1
      i = i < l ? i + 1 : i
      controlActions.setCurrentSlideIndex(i)
    }
    return {
      slides: controlGetters.slides,
      collections: controlGetters.collections,
      paused: controlGetters.paused,
      selectItem,
      pauseSlides,
      slideBack,
      slideForward,
      showFullscreen,
      fullscreen,
      showThumbs,
      callThumbs,
      showCollections,
      callCollections,
      selectCollection,
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.showSlide {
  opacity: 1;
}
.hideSlide {
  opacity: 0;
}
.slideTransition {
  transition: 0.5s linear all;
}
.noOutline {
  outline: none;
}
</style>
