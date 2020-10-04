<template>
  <div class="flex flex-row justify-center bg-black">
    <div
      :src="currentSlide.url"
      class="bg-contain bg-no-repeat bg-center transition-opacity duration-700 ease-in h-screen w-screen"
      :class="[showTheSlide ? 'showSlide' : 'hideSlide']"
      :style="{ 'background-image': `url(${currentSlide.url})` }"
    ></div>
    <p
      v-if="currentSlide.caption"
      class="absolute z-10 text-white bg-blue25 font-bold bottom-0 left-0 p-2"
    >
      {{ currentSlide.caption }}
    </p>
    <img class="hidden" :src="nextSlide.url" width="1" height="1" />
  </div>
</template>

<script>
import { computed, ref, watch, toRefs } from "vue";
const slide_interval = process.env.VUE_APP_SLIDE_INTERVAL;

export default {
  name: "Slideshow",
  props: {
    control: { type: Object },
    slides: { type: Array }
  },
  setup(props) {
    const showTheSlide = ref(true);
    const { control, slides } = toRefs(props);
    let changeTimeout;
    let fadeTimeout;

    let currentSlideIndex = ref(0);
    const changeSlide = () => {
      if (!control.value.paused) {
        changeTimeout = setTimeout(() => {
          showTheSlide.value = false;
          // Fade timeout should match CSS timer or a little longer
          fadeTimeout = setTimeout(() => {
            currentSlideIndex.value =
              currentSlideIndex.value === slides.value.length - 1
                ? 0
                : currentSlideIndex.value + 1;
            showTheSlide.value = true;
            changeSlide();
          }, 1000);
        }, slide_interval);
      }
    };
    changeSlide();

    watch(
      () => control.value.selectedSlideIndex,
      newIndex => {
        if (slides.value.length > newIndex && newIndex >= 0) {
          clearTimeout(changeTimeout);
          clearTimeout(fadeTimeout);
          currentSlideIndex.value = newIndex;
          changeSlide();
          control.value.selectedSlideIndex = -1;
        }
      }
    );

    watch(
      () => control.value.paused,
      pause => {
        if (!pause) {
          changeSlide();
        } else {
          clearTimeout(changeTimeout);
          clearTimeout(fadeTimeout);
        }
      }
    );

    const currentSlide = computed(() => slides.value[currentSlideIndex.value]);

    const nextSlide = computed(() => {
      return currentSlideIndex.value < slides.value.length - 2
        ? slides.value[currentSlideIndex.value + 1]
        : slides.value[0];
    });

    return {
      currentSlide,
      nextSlide,
      showTheSlide
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.showSlide {
  opacity: 1;
  background-color: black;
}
.hideSlide {
  opacity: 0;
}
.slideTransition {
  transition: 0.5s linear opacity;
}
</style>
