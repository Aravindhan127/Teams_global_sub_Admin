import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'
import Scooter from '../../../assets/images/Scooter.png'
import Car from '../../../assets/images/car.png'
import Van from '../../../assets/images/van.png'
import Truck from '../../../assets/images/truck.png'

import CurrentLocation from '../../../assets/images/ic_Pin.png'
function Directions({ origin, destination, vehicleType }) {

  console.log('origin', origin)
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')
  const [directionsService, setDirectionsService] = useState('')
  const [directionsRenderer, setDirectionsRenderer] = useState('')
  const [routes, setRoutes] = useState([])
  const [routeIndex, setRouteIndex] = useState(0)
  const selected = routes[routeIndex]
  const leg = selected?.legs[0]

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return
    setDirectionsService(new routesLibrary.DirectionsService())
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }))
  }, [routesLibrary, map])

  // Use directions service
  useEffect(() => {
    // console.log('orderData?.pickUpLocation?.lat', orderData?.pickUpLocation?.lat)
    if (!directionsService || !directionsRenderer) return

    directionsService
      .route({
        origin: { lat: origin?.lat, lng: origin?.lng },
        destination: { lat: destination?.lat, lng: destination?.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
      })
      .then(response => {
        // directionsRenderer.setDirections(response)
        const customRouteStyle = {
          strokeColor: '#0C7362',
          strokeWeight: 4
        }
        const userDirection = (Math.atan2(destination?.lat, destination?.lng) * 180) / Math.PI
        console.log('userDirection', userDirection)
        // if(orderData)

        const OriginCustomIcon = {
          url:
            vehicleType === 'Bike'
              ? Scooter
              : vehicleType === 'Car'
                ? Car
                : vehicleType === 'Van'
                  ? Van
                  : vehicleType === 'Truck'
                    ? Truck
                    : Car,
          size: new window.google.maps.Size(30, 30), // Example: 40 pixels wide by 60 pixels tall
          scaledSize: new window.google.maps.Size(30, 30),
          scale: 1,
          fillColor: '#0C7362',
          fillOpacity: 1,
          strokeColor: '#0C7362'
        }
        const destCustomIcon = {
          url: CurrentLocation,
          scale: 1,
          fillColor: '#0C7362',
          fillOpacity: 1,
          strokeColor: '#0C7362'
        }

        // After setting directions
        directionsRenderer.setDirections(response)

        // Get the position of the default start and end markers
        const startMarkerPosition = response.routes[0].legs[0].start_location
        const endMarkerPosition = response.routes[0].legs[0].end_location

        // Create custom markers at the start and end positions
        const startMarker = new window.google.maps.Marker({
          position: startMarkerPosition,
          map: directionsRenderer.getMap(),
          icon: OriginCustomIcon,
          // Offset the custom icon to align with the default marker
          label: {
            // text: 'A', // Keep the 'A' label
            color: '#9CE26E', // Custom color for the label
            fontSize: '16px' // Custom font size for the label
          }
        })

        const endMarker = new window.google.maps.Marker({
          position: endMarkerPosition,
          map: directionsRenderer.getMap(),
          icon: destCustomIcon,
          // Offset the custom icon to align with the default marker
          label: {
            // text: 'B', // Keep the 'B' label
            color: '#9CE26E', // Custom color for the label
            fontSize: '16px' // Custom font size for the label
          }
        })

        directionsRenderer.setOptions({
          polylineOptions: {
            strokeColor: customRouteStyle.strokeColor,
            strokeWeight: customRouteStyle.strokeWeight
          },
          suppressMarkers: true
        })
        setRoutes(response.routes)
      })

    return () => directionsRenderer.setMap(null)
  }, [directionsService, directionsRenderer])

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return
    directionsRenderer.setRouteIndex(routeIndex)
  }, [routeIndex, directionsRenderer])

  if (!leg) return null

  return (
    <>
    </>
  )
}

export default Directions
