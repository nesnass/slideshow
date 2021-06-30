import { ref, Ref, computed, ComputedRef } from 'vue'
import moment from 'moment'
import L, { LatLng } from 'leaflet'

interface Slide {
  exif: Record<string, string>
  url: string
  thumbnailUrl?: string
  sortDate: moment.Moment
  isVideo: boolean
}

interface Location {
  lat: string
  lng: string
}

interface ControlState {
  slides: Slide[]
  collections: string[]
  paused: boolean
  currentSlideIndex: number
  currentLocation: LatLng
  requestedSlideIndex: number
  selectedCollection: string
}

const _controlState: Ref<ControlState> = ref({
  collections: [],
  slides: [],
  paused: false,
  currentSlideIndex: -1,
  currentLocation: L.latLng(59.91, 10.75),
  requestedSlideIndex: -1,
  selectedCollection: 'vietnam',
})

const host =
  process.env.NODE_ENV === 'production'
    ? ''
    : `https://${process.env.VUE_APP_HOST}:${process.env.VUE_APP_PORT}`

const emptySlide: Slide = {
  exif: {},
  url: '',
  thumbnailUrl: '',
  sortDate: moment(),
  isVideo: false,
}

interface Getters {
  collections: ComputedRef<string[]>
  slides: ComputedRef<Slide[]>
  currentSlide: ComputedRef<Slide>
  nextSlide: ComputedRef<Slide>
  paused: ComputedRef<boolean>
  requestedSlideIndex: ComputedRef<number> // Slide selected by user
  currentSlideIndex: ComputedRef<number> // Current slide on display
  currentLocation: ComputedRef<LatLng>
  selectedCollection: ComputedRef<string>
}
const getters = {
  get collections(): ComputedRef<string[]> {
    return computed(() => _controlState.value.collections)
  },
  get slides(): ComputedRef<Slide[]> {
    return computed(() => _controlState.value.slides)
  },
  get paused(): ComputedRef<boolean> {
    return computed(() => _controlState.value.paused)
  },
  get currentSlide(): ComputedRef<Slide> {
    return computed(() => {
      return _controlState.value.currentSlideIndex <
        _controlState.value.slides.length - 1
        ? _controlState.value.slides[_controlState.value.currentSlideIndex]
        : emptySlide
    })
  },
  get nextSlide(): ComputedRef<Slide> {
    return computed(() => {
      const currentIndex = _controlState.value.currentSlideIndex
      const slides = _controlState.value.slides
      if (slides.length === 0) return emptySlide
      return currentIndex < slides.length - 2
        ? slides[currentIndex + 1]
        : slides[0]
    })
  },
  get requestedSlideIndex(): ComputedRef<number> {
    return computed(() => _controlState.value.requestedSlideIndex)
  },
  get currentSlideIndex(): ComputedRef<number> {
    return computed(() => _controlState.value.currentSlideIndex)
  },
  get currentLocation(): ComputedRef<LatLng> {
    return computed(() => _controlState.value.currentLocation)
  },
  get selectedCollection(): ComputedRef<string> {
    return computed(() => _controlState.value.selectedCollection)
  },
}
interface Actions {
  setPaused: (isPaused: boolean) => void
  requestSlideIndex: (index: number) => void // Request a slide to be displayed (on next slide)
  setCurrentSlideIndex: (index: number) => void // Set the current slide on display
  setCurrentLocation: (loc: LatLng) => void
  selectCollection: (c: string) => void
  fetchCollections: () => void
  fetchSelectedCollection: () => void
}
const actions = {
  setPaused(isPaused: boolean): void {
    _controlState.value.paused = isPaused
  },
  // Request a slide to be displayed (on next slide)
  requestSlideIndex(index: number): void {
    _controlState.value.requestedSlideIndex = index
  },
  // Set the current slide on display
  setCurrentSlideIndex(index: number): void {
    const item = _controlState.value.slides[index].exif
    if (item.GPSLatitude && item.GPSLongitude) {
      const newLoc = L.latLng(
        parseFloat(item.GPSLatitude),
        parseFloat(item.GPSLongitude)
      )
      actions.setCurrentLocation(newLoc)
    }
    _controlState.value.currentSlideIndex = index
  },
  setCurrentLocation(loc: LatLng): void {
    _controlState.value.currentLocation = loc
  },
  selectCollection(c: string): void {
    _controlState.value.selectedCollection = c
    if (_controlState.value.collections.indexOf(c) > -1) {
      actions.fetchSelectedCollection()
    }
  },
  fetchCollections(): void {
    fetch(`${host}/collections`, {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          _controlState.value.collections = data
          _controlState.value.selectedCollection = data[0]
          actions.fetchSelectedCollection()
        }
      })
  },
  fetchSelectedCollection(): void {
    fetch(
      `${host}/listing?collection=${_controlState.value.selectedCollection}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      }
    )
      .then(response => response.json())
      .then(result => {
        _controlState.value.slides.length = 0
        result.forEach((exif: Record<string, string>) => {
          let sortDate
          if (exif.MIMEType === 'video/mp4') {
            sortDate = moment.parseZone(
              exif.CreationDate,
              'YYYY:MM:DD hh:mm:ss+ZZ'
            )
          } else {
            sortDate = moment.parseZone(
              exif.DateTimeOriginal,
              'YYYY:MM:DD hh:mm:ss'
            )
          }
          const slide: Slide = {
            url: `${host}/images/${_controlState.value.selectedCollection}/${exif.FileName}`,
            thumbnailUrl: `${host}/images/${_controlState.value.selectedCollection}/thumbnails/${exif.ThumbnailUrl}`,
            exif,
            sortDate,
            isVideo: exif.MIMEType === 'video/mp4',
          }
          _controlState.value.slides.push(slide)
        })
        _controlState.value.slides.sort((a: Slide, b: Slide) =>
          a.sortDate.isBefore(b.sortDate) ? -1 : 1
        )
      })
  },
}

interface ServiceInterface {
  actions: Actions
  getters: Getters
}
export function useControlStore(): ServiceInterface {
  return {
    getters,
    actions,
  }
}

export type ControlStoreType = ReturnType<typeof useControlStore>
