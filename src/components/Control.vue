<template>
  <div class="flex flex-col">
    <div
      class="absolute bg-opacity-75 bg-blue flex flex-row h-8 w-full justify-around"
    >
      <button
        @click="pauseSlides()"
        class="noOutline"
        :class="[control.paused ? 'text-goldenrod' : 'text-white']"
      >
        Pause
      </button>
      <button
        @click="fullscreen()"
        class="noOutline"
        :class="[showFullscreen ? 'text-goldenrod' : 'text-white']"
      >
        Fullscreen
      </button>
      <button
        @click="callThumbs()"
        class="noOutline"
        :class="[showThumbs ? 'text-goldenrod' : 'text-white']"
      >
        Thumbs
      </button>
      <button
        @click="callCollections()"
        class="noOutline"
        :class="[showCollections ? 'text-goldenrod' : 'text-white']"
      >
        Collections
      </button>
    </div>
    <div class="flex flex-row flex-wrap mt-8" v-if="showThumbs">
      <div v-for="(slide, index) in slides" :key="index" class="flex">
        <img :src="slide.url" @click="selectItem(index)" class="h-20" />
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

<script>
import { ref, toRefs } from "vue";
export default {
  name: "Control",
  props: {
    control: { type: Object },
    slides: { type: Array },
    collections: { type: Array },
    fselement: { type: HTMLElement }
  },
  setup(props) {
    const { control, fselement } = toRefs(props);
    const showThumbs = ref(false);
    const showFullscreen = ref(false);
    const showCollections = ref(false);
    const selectItem = index => {
      control.value.selectedSlideIndex = index;
      showThumbs.value = false;
      control.value.paused = true;
    };
    const selectCollection = name => {
      control.value.selectedCollection = name;
      showCollections.value = false;
    };
    const pauseSlides = () => {
      control.value.paused = !control.value.paused;
    };
    const fullscreen = () => {
      const element = fselement.value;
      // Safari iOS
      if (typeof document.webkitCurrentFullScreenElement !== "undefined") {
        if (document.webkitFullscreenElement) {
          document.webkitCancelFullScreen();
          showFullscreen.value = false;
        } else {
          element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          showFullscreen.value = true;
        }
      } else {
        if (!document.fullscreenElement) {
          element.requestFullscreen();
          showFullscreen.value = true;
        } else {
          document.exitFullscreen();
          showFullscreen.value = false;
        }
      }
    };
    const callThumbs = () => {
      showThumbs.value = !showThumbs.value;
      showCollections.value = false;
    };
    const callCollections = () => {
      showCollections.value = !showCollections.value;
      showThumbs.value = false;
    };
    return {
      selectItem,
      pauseSlides,
      showFullscreen,
      fullscreen,
      showThumbs,
      callThumbs,
      showCollections,
      callCollections,
      selectCollection
    };
  }
};
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
