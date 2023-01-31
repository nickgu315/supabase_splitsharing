import {useEffect, useRef} from 'react';
import {Loader} from '@googlemaps/js-api-loader';

//{lat: -34.397, lng: 150.644}
//{lat: lat, lng: lng}

function MapWithMarker({lat, lng}) {
  const googlemap = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,

    });
    let map;
    let marker;
    var Latlng = {lat: lat, lng: lng}
    if (Latlng.lat == undefined){
      Latlng.lat = 34.0663971
      Latlng.lng = -118.4491148
    }

    console.log("inside map", lat, lng)


    loader.load().then(() => {
      const google = window.google;
      map = new google.maps.Map(googlemap.current, {
        center: Latlng,
        zoom: 17,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        backgroundColor: 'white',
        controlSize: 20,
      });

      var icon = {
          url: "/SplitSharing_toF6.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
      };

      marker = new google.maps.Marker({
        position: Latlng,
        map,
        title: "Pick Up Location!",
        icon: icon
      });
    });
  });
  return (
    <div className='w-[320px] h-[320px] lg:w-[500px] lg:h-[500px] rounded-xl' id="map" ref={googlemap} />
  );
}

export default MapWithMarker;
