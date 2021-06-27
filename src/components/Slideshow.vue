<template>
  <div class="flex flex-row justify-center bg-black" id="slides">
    <div
      class="flex flex-row justify-center bg-contain bg-no-repeat bg-center transition-opacity duration-700 ease-in h-screen"
      :class="[showTheSlide ? 'showSlide' : 'hideSlide']"
      :style="slideStyle"
    >
      <div
        v-if="currentSlide.isVideo"
        class="relative flex flex-col justify-center items-center"
      >
        <video :src="currentSlide.url" ref="videoRef" @ended="videoPauseOrStop">
          <track label="English" kind="captions" srclang="en" src="" default />
        </video>
        <img
          alt="play or pause video"
          class="z-20 w-12 m-4 cursor-pointer"
          :class="{ 'filter-green': playing }"
          src="@/assets/playpause.svg"
          @click="playpause()"
        />
      </div>
    </div>
    <p class="absolute z-10 text-white bg-blue25 bottom-0 right-0 p-2">
      <!--span v-if="currentSlide.exif.GPSLatitude"
        >{{ currentSlide.exif.GPSLatitude }}° + " " +
        {{ currentSlide.exif.GPSLongitude }}° <br
      /></span-->
      <span
        >F {{ Number.parseFloat(currentSlide.exif.ApertureValue).toFixed(1)
        }}<br
      /></span>
      <span
        >1/{{
          Math.round(1 / Number.parseFloat(currentSlide.exif.ShutterSpeed))
        }}s<br
      /></span>
      <span>{{ currentSlide.exif.FocalLength }}mm<br /></span>
      <span>ISO {{ currentSlide.exif.ISO }}<br /></span>
      <span class="text-xs">{{ currentSlide.exif.LensModel }}<br /></span>
    </p>
    <div
      class="absolute z-10 text-white bg-blue25 font-playful bottom-0 left-0 p-2"
    >
      <p v-if="currentSlide.exif.Title" class="font-bold">
        {{ currentSlide.exif.Title }}
      </p>
      <p v-if="currentSlide.exif.Description" class="text-sm">
        {{ currentSlide.exif.Description }}
      </p>
    </div>
    <img
      class="hidden"
      alt="next slide url"
      :src="nextSlide.url"
      width="1"
      height="1"
    />
  </div>
</template>

<script>
import { computed, ref, watch, toRefs } from "vue";
import { useDrag } from "vue-use-gesture";
import { useSpring } from "vue-use-spring";
const slide_interval = process.env.VUE_APP_SLIDE_INTERVAL;

export default {
  name: "Slideshow",
  props: {
    control: { type: Object, required: true },
    slides: { type: Array, required: true }
  },
  setup(props) {
    const showTheSlide = ref(true);
    const { control, slides } = toRefs(props);
    const videoRef = ref(null);
    const playing = ref(false);
    let currentSlideIndex = ref(0);
    let changeTimeout;
    let fadeTimeout;

    const videoPauseOrStop = () => {
      control.value.paused = false;
      playing.value = false;
    };

    const playpause = () => {
      if (playing.value) {
        videoRef.value.pause();
        playing.value = false;
        control.value.paused = false;
      } else {
        videoRef.value.play();
        playing.value = true;
        control.value.paused = true;
      }
    };

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
            control.value.currentSlideIndex = currentSlideIndex.value;
            changeSlide();
          }, 2000);
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

    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }));

    const bindDrag = useDrag(({ down, movement: [mx, my] }) => {
      set({ x: down ? mx : 0, y: down ? my : 0 });
    });

    const slideStyle = computed(() => ({
      transform: `translate3d(${x.value}px,${y.value}px,0)`,
      "background-image": !currentSlide.value.isVideo
        ? `url(${currentSlide.value.url})`
        : ""
    }));

    return {
      currentSlide,
      nextSlide,
      showTheSlide,
      videoPauseOrStop,
      videoRef,
      playpause,
      playing,
      bindDrag,
      slideStyle
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.touch-box {
  touch-action: none;
  cursor: grab;
}
.showSlide {
  opacity: 1;
}
.hideSlide {
  opacity: 0;
}
.slideTransition {
  transition: 0.5s linear opacity;
}
.filter-green {
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg)
    brightness(118%) contrast(119%);
}
</style>
