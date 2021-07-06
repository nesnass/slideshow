<template>
  <div
    class="flex flex-row justify-center bg-black"
    id="slides"
    v-if="currentSlide"
  >
    <div
      class="
        flex flex-row
        justify-center
        bg-contain bg-no-repeat bg-center
        transition-opacity
        duration-700
        ease-in
        h-screen
      "
      :class="[showTheSlide ? 'showSlide' : 'hideSlide']"
      :style="{
        'background-image': !currentSlide.isVideo
          ? `url(${currentSlide.url})`
          : '',
      }"
    >
      <div
        v-if="currentSlide && currentSlide.isVideo"
        class="relative flex flex-col justify-center items-center"
      >
        <video
          :src="currentSlide.url"
          class=" max-h-screen"
          ref="videoRef"
          @ended="videoPauseOrStop"
        >
          <track label="English" kind="captions" srclang="en" src="" default />
        </video>
        <img
          alt="play or pause video"
          class="z-20 w-12 m-4 cursor-pointer fixed top-0 right-0 pt-8"
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
      <span class="text-sm">{{ formattedCreationDate }}<br /></span>
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
      class="
        absolute
        z-10
        text-white
        bg-blue25
        font-playful
        bottom-0
        left-0
        p-2
      "
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

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'
import { useControlStore } from '../store/useControlStore'
const slideInterval = parseInt(process.env.VUE_APP_SLIDE_INTERVAL)
const { getters: controlGetters, actions: controlActions } = useControlStore()

export default defineComponent({
  name: 'Slideshow',
  setup() {
    const showTheSlide = ref(true)
    const videoRef = ref()
    const playing = ref(false)
    const currentSlide = controlGetters.currentSlide
    const slides = controlGetters.slides
    let currentSlideIndex = 0
    let changeTimeout: ReturnType<typeof setTimeout>
    let fadeTimeout: ReturnType<typeof setTimeout>

    const videoPauseOrStop = () => {
      controlActions.setPaused(false)
      playing.value = false
    }

    const playpause = () => {
      if (playing.value && videoRef.value) {
        videoRef.value.pause()
        playing.value = false
        controlActions.setPaused(false)
      } else {
        videoRef.value.play()
        playing.value = true
        controlActions.setPaused(true)
      }
    }

    const changeSlide = () => {
      if (!controlGetters.paused.value) {
        changeTimeout = setTimeout(() => {
          showTheSlide.value = false
          // Fade timeout should match CSS timer or a little longer
          fadeTimeout = setTimeout(() => {
            currentSlideIndex =
              currentSlideIndex === slides.value.length - 1
                ? 0
                : currentSlideIndex + 1
            showTheSlide.value = true
            controlActions.setCurrentSlideIndex(currentSlideIndex)
            changeSlide()
          }, 2000)
        }, slideInterval)
      }
    }
    changeSlide()

    watch(
      () => controlGetters.requestedSlideIndex.value,
      newIndex => {
        if (slides.value.length > newIndex && newIndex >= 0) {
          controlActions.setPaused(true)
          currentSlideIndex = newIndex
          controlActions.setCurrentSlideIndex(newIndex)
        }
      }
    )

    watch(
      () => controlGetters.paused.value,
      pause => {
        if (!pause) {
          changeSlide()
        } else {
          clearTimeout(changeTimeout)
          clearTimeout(fadeTimeout)
          showTheSlide.value = true
        }
      }
    )

    const formattedCreationDate = computed(() => {
      return currentSlide.value.sortDate.format('ddd, MMM d YYYY, H:mm')
    })

    return {
      formattedCreationDate,
      currentSlide,
      nextSlide: controlGetters.nextSlide,
      showTheSlide,
      videoPauseOrStop,
      videoRef,
      playpause,
      playing,
    }
  },
})
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
