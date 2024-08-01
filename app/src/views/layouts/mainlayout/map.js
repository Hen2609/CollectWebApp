let map;

async function initMap() {
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker",
  );

  const locations = (await (await fetch("/api/location")).json() )?? []

  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(31.969753609344288, 34.77124947062489),
    zoom: 16,
    mapId: "DEMO_MAP_ID",
  });

  // const iconBase =
  //   "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
  const icons = {
    info: {
      icon: "https://developers.google.com/static/maps/documentation/javascript/images/default-marker.png"
    },
  };
  const features = locations.map(loc => ({position: new google.maps.LatLng(loc.lat,loc.lng), type: "info"}) )

  for (let i = 0; i < features.length; i++) {
    const iconImage = document.createElement("img");

    iconImage.src = icons[features[i].type].icon;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: features[i].position,
      content: iconImage,
    });
  }
}

initMap();