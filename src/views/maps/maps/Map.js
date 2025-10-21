import { APIProvider, Map } from '@vis.gl/react-google-maps'

import mapStyle from 'src/styles/map_style.json'
import Directions from './Directions'
function Maps({ origin, destination }) {
  console.log("originorigin", origin)
  return (
    <APIProvider apiKey='AIzaSyA7PtBJPMPZ_QEmieE0aQ11_eh8luE-Wyk'>
      <Map
        style={{ width: 'auto', height: 698, border: '1px solid #E6E6E6', borderRadius: '10px' }}
        styles={mapStyle}
        defaultCenter={{ lat: origin?.lat, lng: origin?.lng }}
        defaultZoom={10}
        // minZoom={100}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        // mapd='f90f8309a7a49925'
        options={
          {
            // minZoom: 5, // Adjust this value as needed
            // maxZoom: 500 // Adjust this value as needed
          }
        }
      >
        {/* <AdvancedMarker
    key='pickUpMarker'
    position={{ lat: orderData?.pickUpLocation?.lat, lng: orderData?.pickUpLocation?.lng }}
  >
    <Pin background={'#0C7362'} glyphColor={'#fff'} borderColor={'#fff'} />
  </AdvancedMarker>
  <AdvancedMarker
    key='deliveryMarker'
    position={{ lat: orderData?.deliveryLocation?.lat, lng: orderData?.deliveryLocation?.lng }}
  >
    <Pin background={'#000'} glyphColor={'#fff'} borderColor={'#fff'} />
  </AdvancedMarker> */}
        {origin && <Directions origin={origin} destination={destination} />}
        {/* <Directions orderData={orderData} /> */}
      </Map>
    </APIProvider>
  )
}

export default Maps
