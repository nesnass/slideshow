<template>
  <div class="flex flex-col" ref="fullscreenElement">
    <img
      class="absolute z-20 w-4 top-0 right-0 mr-2 mt-2 cursor-pointer"
      src="@/assets/hamburger.svg"
      @click="showMenu = !showMenu"
    />
    <control
      class="fixed z-10 w-full"
      :slides="slides"
      :collections="collections"
      v-show="showMenu"
      :control="controlState"
      :fselement="fullscreenElement"
    />
    <div
      v-if="slides.length"
      class="relative flex-col transition-all duration-500 ease-linear"
    >
      <slideshow :slides="slides" :control="controlState" />
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from "vue";
import Slideshow from "@/components/Slideshow";
import Control from "@/components/Control";

const host = process.env.VUE_APP_HOST;

export default {
  name: "App",
  components: {
    slideshow: Slideshow,
    control: Control
  },
  setup() {
    const thumbnails = ref(null);
    const main = ref(null);
    const showMenu = ref(false);
    const fullscreenElement = ref(null);
    const controlState = reactive({
      pause: false,
      selectSlideIndex: -1,
      selectedCollection: ""
    });
    const collections = ref([]);
    const slides = ref([]);

    const getSelectedCollection = () => {
      fetch(`${host}/listing?collection=${controlState.selectedCollection}`, {
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors"
      })
        .then(response => response.json())
        .then(data => {
          slides.value = data.images.map(d => {
            return {
              url: `${host}/images/${controlState.selectedCollection}/${d}`,
              caption: data.captions[d.slice(0, -4)]
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
            controlState.selectedCollection = data[0];
            getSelectedCollection();
          }
        });
    };

    watch(
      () => controlState.selectedCollection,
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
      controlState,
      fullscreenElement
    };
  }
};
</script>

<style>
body {
  background-color: black;
}
</style>
