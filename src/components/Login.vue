<template>
  <div
    class="flex flex-col md:flex-row justify-center md:items-center p-12 bg-black"
    id="login"
  >
    <div class=" max-w-md">
      <input
        class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
        id="inline-password"
        type="password"
        placeholder="enter password.."
        @keyup.enter="login"
        v-model="password"
      />
    </div>

    <div class="flex flex-col items-end  max-w-md">
      <button
        class="bg-blue75 font-playful focus:shadow-outline focus:outline-none text-white font-bold mt-2 md:mt-0 md:ml-4 py-2 px-2 rounded w-20"
        type="button"
        @click="login"
      >
        Log In
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useControlStore } from '../store/useControlStore'
const { actions: controlActions } = useControlStore()

export default defineComponent({
  name: 'Slideshow',
  setup() {
    const password = ref('')
    function login() {
      controlActions.login(password.value)
    }
    return {
      password,
      login,
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
