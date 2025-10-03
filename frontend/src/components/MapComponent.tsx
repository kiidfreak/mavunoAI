import React, { useEffect, useRef } from 'react'
import L from 'leaflet'

// Fix for default markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      // Initialize map
      mapInstance.current = L.map(mapRef.current).setView([-1.2921, 36.8219], 8)

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current)

      // Add demo farm markers
      const farmLocations = [
        {
          name: 'John Mwangi',
          location: 'Machakos',
          coordinates: [-1.2921, 36.8219],
          crops: ['maize', 'beans'],
          ndvi: 0.75,
          status: 'active'
        },
        {
          name: 'Grace Njeri',
          location: 'Kiambu',
          coordinates: [-1.2000, 36.9000],
          crops: ['tomatoes', 'coffee'],
          ndvi: 0.68,
          status: 'active'
        },
        {
          name: 'Peter Kimani',
          location: 'Meru',
          coordinates: [0.0500, 37.6500],
          crops: ['maize'],
          ndvi: 0.82,
          status: 'active'
        },
        {
          name: 'Mary Wanjiku',
          location: 'Nakuru',
          coordinates: [-0.3000, 36.0833],
          crops: ['beans', 'kale'],
          ndvi: 0.71,
          status: 'inactive'
        }
      ]

      farmLocations.forEach(farm => {
        const color = farm.status === 'active' ? 'green' : 'red'
        const marker = L.circleMarker(farm.coordinates as [number, number], {
          radius: 8,
          fillColor: color,
          color: 'white',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mapInstance.current!)

        marker.bindPopup(`
          <div class="p-2">
            <h4 class="font-semibold text-gray-900">${farm.name}</h4>
            <p class="text-sm text-gray-600">${farm.location}</p>
            <p class="text-sm text-gray-600">Crops: ${farm.crops.join(', ')}</p>
            <p class="text-sm text-gray-600">NDVI: ${farm.ndvi}</p>
            <p class="text-sm ${farm.status === 'active' ? 'text-green-600' : 'text-red-600'}">
              Status: ${farm.status}
            </p>
          </div>
        `)
      })

      // Add NDVI heatmap overlay (simplified)
      const ndviOverlay = L.circle([-1.2921, 36.8219], {
        radius: 50000, // 50km radius
        color: 'transparent',
        fillColor: 'green',
        fillOpacity: 0.3
      }).addTo(mapInstance.current!)

      ndviOverlay.bindPopup(`
        <div class="p-2">
          <h4 class="font-semibold text-gray-900">NDVI Zone</h4>
          <p class="text-sm text-gray-600">Vegetation Health: Good</p>
          <p class="text-sm text-gray-600">Average NDVI: 0.72</p>
        </div>
      `)

      // Add rainfall zones
      const rainfallZones = [
        {
          center: [-1.2921, 36.8219],
          radius: 30000,
          color: 'blue',
          label: 'High Rainfall'
        },
        {
          center: [-1.0000, 36.5000],
          radius: 40000,
          color: 'yellow',
          label: 'Moderate Rainfall'
        },
        {
          center: [-0.5000, 37.0000],
          radius: 35000,
          color: 'red',
          label: 'Low Rainfall'
        }
      ]

      rainfallZones.forEach(zone => {
        L.circle(zone.center as [number, number], {
          radius: zone.radius,
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.2,
          weight: 2
        }).addTo(mapInstance.current!).bindPopup(zone.label)
      })
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-96 rounded-lg"></div>
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Active Farms</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Inactive Farms</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 opacity-30"></div>
            <span>Rainfall Zones</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapComponent
