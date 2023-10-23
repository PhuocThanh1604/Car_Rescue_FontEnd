import React from 'react'
import { withGoogleMap, withScriptjs, GoogleMap, Marker, Polyline } from "react-google-maps"
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox'

const options = { closeBoxURL: '', enableEventPropagation: true };

const optionsPolyline = {
  strokeColor: 'red',
  strokeOpacity: 0.8,
  strokeWeight: 3,
  fillColor: '#085daa',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
};

const positions = [{
  lat: 21.027763, lng: 105.834160, label: "position 1"
}, {
  lat: 21.027763, lng: 106, label: "position 2"
}, {
  lat: 21.127763, lng: 106.1, label: "position 3"
}]

const Map = () => {
  return (
    <div>
      <GoogleMap
          defaultZoom={12}
          defaultCenter={{ lat: 21.027763, lng: 106 }}
        >
          {
            positions && positions.map((position, index) => 
              <Marker
                position={new window.google.maps.LatLng(position)}
              >
                      
                <InfoBox
                  options={options}
                >
                  <>
                    <div style={{ backgroundColor: 'green', color: 'white', borderRadius:'1em', padding: '0.2em' }}>
                      {position.label}
                    </div>
                  </>
                </InfoBox>  
                        
              </Marker>
            )
          }
          <Polyline
            path={positions}
            options={optionsPolyline}
          />
        
      </GoogleMap>
    </div>
  );
}

export default withScriptjs(withGoogleMap(Map));

