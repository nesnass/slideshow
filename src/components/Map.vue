<template>
  <div id="mapid" class="h-full w-full"></div>
</template>

<script>
import { toRefs, watch, onMounted } from "vue";
import L from "leaflet";
import "../tile.stamen";
import myIconImage from "../assets/mappin.svg";

export default {
  name: "Map",
  props: {
    control: { type: Object },
    slides: { type: Array }
  },
  setup(props) {
    const { control, slides } = toRefs(props);
    let mymap;
    let marker;
    let myIcon = L.icon({
      iconUrl: myIconImage,
      iconSize: [47, 64],
      iconAnchor: [22, 94]
    });

    onMounted(() => {
      mymap = L.map("mapid", { zoomControl: false }).setView(
        [59.91, 10.75],
        13
      );
      var layer = new L.StamenTileLayer("terrain");
      mymap.addLayer(layer);
    });

    watch(
      () => control.value.currentSlideIndex,
      newIndex => {
        if (slides.value.length > newIndex && newIndex >= 0) {
          if (marker) marker.remove();
          const item = slides.value[newIndex].exif;
          if (mymap && item.GPSLatitude && item.GPSLongitude) {
            const latlng = L.latLng(item.GPSLatitude, item.GPSLongitude);
            marker = L.marker(latlng, { icon: myIcon }).addTo(mymap);
            mymap.flyTo(latlng, 8);
          }
        }
      }
    );

    return {
      mymap
    };
  }
};
</script>
