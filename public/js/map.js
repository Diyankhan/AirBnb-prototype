var map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=iPfNdgRoxm2JZZanCvgl', // style URL
    center: listing.geoCode.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
})

console.log(listing)
new maplibregl.Marker({color : "red"})
  .setLngLat(listing.geoCode.coordinates)
  .setPopup(
    new maplibregl.Popup({ offset: 25 })
      .setHTML(`<h4>${listing.title}</h4>`)
  )
  .addTo(map);
