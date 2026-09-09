import { useState, useEffect, useMemo, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.PUBLIC_MAPBOX_TOKEN;

export default function MapboxSearch({ properties, hoveredId, onMarkerHover, onMarkerClick }) {

  const [isMounted, setIsMounted] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initialViewState = useMemo(() => {
    if (!properties?.length) {
      return { longitude: -87.0739, latitude: 20.6296, zoom: 10 };
    }
    return {
      longitude: properties[0].coordinates.lng,
      latitude: properties[0].coordinates.lat,
      zoom: 11,
    };
  }, [properties]);

  if (!isMounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-brand-50">
        <p className="text-sm text-brand-900/60">Cargando mapa…</p>
      </div>
    );
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-brand-50 p-6 text-center">
        <p className="text-sm text-red-600">
          Falta la variable de entorno <code>PUBLIC_MAPBOX_TOKEN</code>. Agrégala a tu
          archivo <code>.env</code>.
        </p>
      </div>
    );
  }

  const selectedProperty = properties.find((p) => p.id === selectedId);

  return (
    <div className="h-full w-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
        reuseMaps
      >
        <NavigationControl position="top-right" />

        {properties.map((property) => {
          const isActive = hoveredId === property.id;
          return (
            <Marker
              key={property.id}
              longitude={property.coordinates.lng}
              latitude={property.coordinates.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedId(property.id);
                onMarkerClick?.(property.id);
              }}
            >
              <button
                type="button"
                onMouseEnter={() => onMarkerHover?.(property.id)}
                onMouseLeave={() => onMarkerHover?.(null)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-lg transition-transform cursor-pointer ${
                  isActive
                    ? 'scale-110 text-white bg-[#3e5b4b]'
                    : 'text-brand-900 bg-[#f8f6f1]'
                }`}
              >
                ${Math.round(property.price / 1000)}k
              </button>
            </Marker>
          );
        })}

        {selectedProperty && (
          <Popup
            longitude={selectedProperty.coordinates.lng}
            latitude={selectedProperty.coordinates.lat}
            anchor="top"
            onClose={() => setSelectedId(null)}
            closeOnClick={true}
            className='cursor-pointer'
          >
            <a href={selectedProperty.url.es}>
              <img 
                className='popup-image'
                src={selectedProperty.gallery.find((g) => g.type === 'image')?.url}
                alt="" 
              />
              <div className='popup-content'>
                <p className="max-w-45 text-sm font-medium text-brand-900">
                  {selectedProperty.title.es}
                </p>
                <span>${Math.round(selectedProperty.price / 1000)}k </span>
              </div>
            </a>
          </Popup>
        )}
      </Map>
    </div>
  );
}
