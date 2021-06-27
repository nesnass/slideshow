<template>
  <div id="mapid" class="h-full w-full"></div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useControlStore } from '../store/useControlStore'
import L, { Icon, Map, Marker } from 'leaflet'
import '../tile.stamen'
import myIconImage from '../assets/mappin.svg'

const { getters: controlGetters } = useControlStore()

export default defineComponent({
  name: 'Map',
  setup() {
    let marker: Marker
    const mapType = 'terrain' // 'toner', 'watercolor'
    const myIcon: Icon = L.icon({
      iconUrl: myIconImage,
      iconSize: [47, 64],
      iconAnchor: [22, 94],
    })

    const mymap: Map = L.map('mapid', { zoomControl: false }).setView(
      controlGetters.currentLocation.value,
      13
    )
    const layer = L.tileLayer(
      `https://stamen-tiles-{s}.a.ssl.fastly.net/${mapType}/{z}/{x}/{y}.{ext}`,
      {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 20,
      }
    )
    mymap.addLayer(layer)

    watch(
      () => controlGetters.currentLocation.value,
      newLocation => {
        if (marker) marker.remove()
        marker = L.marker(newLocation, { icon: myIcon }).addTo(mymap)
        mymap.flyTo(newLocation, 8)
      }
    )

    return {
      mymap,
    }
  },
})
</script>
