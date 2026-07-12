// src/components/react/MapboxSearch.jsx
import { useState } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapboxSearch({ properties }) {
  // Estado inicial del mapa (Centrado en las coordenadas de tu propiedad de prueba)
  const [viewState, setViewState] = useState({
    longitude: -86.8515, // Cambia esto por las coordenadas de tu ciudad
    latitude: 21.1619,
    zoom: 12
  });

  return (
    <div className="w-full h-full relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        // NOTA: Pega aquí tu token gratuito de Mapbox temporalmente para probar
        mapboxAccessToken="pk.TU_TOKEN_DE_MAPBOX_AQUI" 
        style={{ width: '100%', height: '100%' }}
      >
        {/* Recorremos el JSON y dibujamos un Pin estilo Airbnb por cada propiedad */}
        {properties.map((prop) => (
          <Marker 
            key={prop.id} 
            longitude={prop.coordinates.lng} 
            latitude={prop.coordinates.lat}
            anchor="bottom"
          >
            {/* El diseño del "Pin" con el precio */}
            <div className="bg-white px-3 py-1 rounded-2xl shadow-md font-bold text-sm border border-gray-200 hover:scale-110 hover:bg-black hover:text-white transition-all cursor-pointer">
              ${prop.price.toLocaleString()}
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}