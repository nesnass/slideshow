import { ref, Ref, watch } from 'vue'

const controlState = ref({
  pause: false,
  currentSlideIndex: -1,
  selectedSlideIndex: -1,
  selectedCollection: ""
});

export { controlState }
