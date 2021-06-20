<template>
  <div class="relative flex flex-col bg-black" ref="fullscreenElement">
    <lmap class="fixed top-0 left-0" :control="controlState" :slides="slides" />
    <slideshow
      v-if="slides.length"
      class="relative flex-col transform transition-transform duration-1000 ease-out"
      :class="[
        showMap ? 'scale-25 origin-top-left' : 'scale-100 origin-top-left'
      ]"
      :slides="slides"
      :control="controlState"
    />
    <control
      class="fixed w-full z-10"
      :collections="collections"
      v-show="showMenu"
      :slides="slides"
      :control="controlState"
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

<script>
import { ref, watch } from "vue";
import Slideshow from "@/components/Slideshow";
import Control from "@/components/Control";
import LMap from "@/components/Map";

const host =
  process.env.NODE_ENV === "production"
    ? ""
    : `https://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}`;

export default {
  name: "App",
  components: {
    slideshow: Slideshow,
    control: Control,
    lmap: LMap
  },
  setup() {
    const thumbnails = ref(null);
    const main = ref(null);
    const showMenu = ref(false);
    const showMap = ref(false);
    const fullscreenElement = ref(null);
    const controlState = ref({
      pause: false,
      currentSlideIndex: -1,
      selectedSlideIndex: -1,
      selectedCollection: ""
    });
    const collections = ref([]);
    const slides = ref([]);

    const getSelectedCollection = () => {
      fetch(
        `${host}/listing?collection=${controlState.value.selectedCollection}`,
        {
          headers: {
            "Content-Type": "application/json"
          },
          mode: "cors"
        }
      )
        .then(response => response.json())
        .then(result => {
          slides.value = result.map(exif => {
            return {
              url: `${host}/images/${controlState.value.selectedCollection}/${exif.FileName}`,
              exif,
              isVideo: exif.MIMEType === "video/mp4"
            };
          });
        });
    };

    const getCollections = () => {
      fetch(`${host}/collections`, {
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors"
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            collections.value = data;
            controlState.value.selectedCollection = data[0];
            getSelectedCollection();
          }
        });
    };

    watch(
      () => controlState.value.selectedCollection,
      newName => {
        if (collections.value.indexOf(newName) > 0) {
          getSelectedCollection();
        }
      }
    );

    getCollections();

    return {
      slides,
      thumbnails,
      collections,
      main,
      showMenu,
      showMap,
      controlState,
      fullscreenElement
    };
  }
};
</script>

<style lang="postcss">
html {
  @apply font-playful;
}
body {
  background-color: black;
}
</style>
