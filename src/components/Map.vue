<template>
  <div id="mapid" class="h-full w-full"></div>
</template>

<script lang="ts">
import { defineComponent, watch, onMounted, ref, Ref } from 'vue'
import { useControlStore } from '../store/useControlStore'
import L, { Icon, Map, Marker, TileLayerOptions } from 'leaflet'
import myIconImage from '../assets/mappin.svg'

interface ExtendedTLOptions extends TileLayerOptions {
  ext: string
}

const { getters: controlGetters } = useControlStore()

export default defineComponent({
  name: 'Map',
  setup() {
    let marker: Marker
    const mymap: Ref<Map | undefined> = ref()
    const mapType = 'terrain' // 'toner', 'watercolor'
    const myIcon: Icon = L.icon({
      iconUrl: myIconImage,
      iconSize: [47, 64],
      iconAnchor: [22, 94],
    })

    const tlOptions: ExtendedTLOptions = {
      attribution:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 20,
      ext: 'jpg',
    }

    onMounted(() => {
      mymap.value = L.map('mapid', { zoomControl: false }).setView(
        controlGetters.currentLocation.value,
        14
      )
      const layer = L.tileLayer(
        `https://stamen-tiles-{s}.a.ssl.fastly.net/${mapType}/{z}/{x}/{y}.{ext}`,
        tlOptions
      )
      mymap.value.addLayer(layer)
    })

    watch(
      () => controlGetters.currentLocation.value,
      newLocation => {
        if (marker) marker.remove()
        if (mymap.value) {
          marker = L.marker(newLocation, { icon: myIcon }).addTo(mymap.value)
          mymap.value.flyTo(newLocation, 13)
        }
      }
    )

    return {
      mymap,
    }
  },
})
</script>
