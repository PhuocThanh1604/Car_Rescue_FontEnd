import React from 'react'
import { withGoogleMap, withScriptjs, GoogleMap } from "react-google-maps"

const Map = () => {
  return (
    <div>
      <GoogleMap
          defaultZoom={15}
          defaultCenter={{ lat: 21.027763, lng: 105.834160 }}
        >
         <Marker
              icon={{
                url: 'https://insulationpads.co.uk/wp-content/uploads/2017/10/Home.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              position={{ lat: 21.027763, lng: 105.834160 }}
          />
      </GoogleMap>
    </div>
  );
}

export default withScriptjs(withGoogleMap(Map));

