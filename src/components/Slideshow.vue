<template>
  <div class="flex flex-row justify-center bg-black">
    <div
      :src="currentSlide.url"
      class="flex flex-row justify-center bg-contain bg-no-repeat bg-center transition-opacity duration-700 ease-in h-screen w-screen"
      :class="[showTheSlide ? 'showSlide' : 'hideSlide']"
      :style="{ 'background-image': `url(${currentSlide.url})` }"
    >
      <div
        v-if="currentSlide.isVideo"
        class="relative flex flex-row items-center"
      >
        <video
          :src="currentSlide.url"
          ref="videoRef"
          @ended="videoPauseOrStop"
        ></video>
        <img
          alt="play or pause video"
          class="absolute z-20 w-12 bottom-0 left-0 ml-4 mb-4 cursor-pointer"
          :class="{ 'filter-green': playing }"
          src="@/assets/playpause.svg"
          @click="playpause()"
        />
      </div>
    </div>
    <p class="absolute z-10 text-white bg-blue25 bottom-50 right-0 p-2">
      <span v-if="exif.latitude"
        >{{ exif.latitude }}° + " " + {{ exif.longitude }}° <br
      /></span>
      <span>F {{ exif.aperture }}<br /></span>
      <span>1/{{ exif.shutter }}s<br /></span>
      <span>{{ exif.focallength }}mm<br /></span>
      <span>ISO {{ exif.iso }}<br /></span>
      <span>{{ exif.lens }}<br /></span>
    </p>
    <p
      v-if="currentSlide.caption"
      class="absolute z-10 text-white bg-blue25 font-bold bottom-0 right-0 p-2"
    >
      {{ currentSlide.caption }}
    </p>
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
import { computed, ref, reactive, watch, toRefs } from "vue";
import exifr from "exifr/dist/full.esm.mjs";
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
    const videoRef = ref(null);
    const playing = ref(false);
    const exif = reactive({
      latitude: "",
      longitude: "",
      aperture: "",
      shutter: "",
      focallength: "",
      iso: "",
      lens: ""
    });
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

    const getExif = async () => {
      let result = await exifr.parse(currentSlide.value.url);
      exif.latitude = result.latitude;
      exif.longitude = result.longitude;
      exif.shutter = result.ShutterSpeedValue;
      exif.aperture = result.FNumber;
      exif.focallength = result.FocalLength;
      exif.iso = result.ISO;
      exif.lens = result.LensModel;
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
            getExif();
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
      showTheSlide,
      videoPauseOrStop,
      videoRef,
      playpause,
      playing,
      exif
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
.filter-green {
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg)
    brightness(118%) contrast(119%);
}
</style>
