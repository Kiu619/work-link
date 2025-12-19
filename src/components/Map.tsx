import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

// Fix for default marker icon in Leaflet with Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export interface MapMarker {
  position: [number, number]
  popupContent?: React.ReactNode
  icon?: L.Icon
}

export interface MapProps {
  center: [number, number]
  zoom?: number
  height?: number | string
  markers?: MapMarker[]
  showCenterButton?: boolean
  className?: string
}

// Component to handle map resizing and center button
const MapControls = ({
  center,
  showCenterButton = false
}: {
  center: [number, number]
  showCenterButton?: boolean
}) => {
  const map = useMap()

  const handleCenterClick = () => {
    map.flyTo(center, 15)
  }

  useEffect(() => {
    // Delay để đảm bảo modal animation hoàn thành
    const timer1 = setTimeout(() => {
      map.invalidateSize()
    }, 200)

    // Thêm delay thứ 2 để chắc chắn
    const timer2 = setTimeout(() => {
      map.invalidateSize()
    }, 500)

    // Thêm listener cho resize window
    const handleResize = () => {
      map.invalidateSize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('resize', handleResize)
    }
  }, [map])

  return showCenterButton ? (
    <div className="absolute top-2 right-2 z-10000">
      <button
        type="button"
        onClick={handleCenterClick}
        className="bg-white hover:bg-gray-100 border border-gray-300 rounded-md px-3 py-2 shadow-lg flex items-center gap-2 text-sm font-medium"
        title="Về vị trí đánh dấu"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="10" r="3"></circle>
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 0 0-16 0c0 3 2.7 6.9 8 11.7z"></path>
        </svg>
        Về vị trí
      </button>
    </div>
  ) : null
}

const Map = ({
  center,
  zoom = 15,
  height = 250,
  markers = [],
  showCenterButton = false,
  className = '',
}: MapProps) => {
  const heightStyle = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`rounded-lg overflow-hidden relative ${className}`}
      style={{ height: heightStyle }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <MapControls center={center} showCenterButton={showCenterButton} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={marker.icon || defaultIcon}
          >
            {marker.popupContent && (
              <Popup>{marker.popupContent}</Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default Map

