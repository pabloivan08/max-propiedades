import { useState, useMemo } from 'react';
import MapboxSearch from './MapboxSearch.jsx';
import propertiesData from '../data/properties.json';

const COPY = {
  es: {
    title: 'Tierra Marea',
    priceLabel: 'Rango de precio',
    min: 'Mínimo',
    max: 'Máximo',
    results: (n) => `${n} propiedades encontradas`,
    noResults: 'No hay propiedades en este rango de precio.',
    perNight: 'USD',
  },
  en: {
    title: 'Tierra Marea',
    priceLabel: 'Price range',
    min: 'Min',
    max: 'Max',
    results: (n) => `${n} properties found`,
    noResults: 'No properties match this price range.',
    perNight: 'USD',
  },
};

const ABSOLUTE_MIN = 0;
const ABSOLUTE_MAX = 2_000_000;

export default function SearchLayout({ locale = 'es' }) {
  const t = COPY[locale] ?? COPY.es;
  const allProperties = propertiesData.properties;

  const [priceRange, setPriceRange] = useState([ABSOLUTE_MIN, ABSOLUTE_MAX]);
  const [hoveredId, setHoveredId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [propertyType, setPropertyType] = useState('all');
  const [investmentType, setInvestmentType] = useState('all');

  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      const matchesPrice =
        property.price >= priceRange[0] &&
        property.price <= priceRange[1];

      const matchesPropertyType =
        propertyType === 'all' ||
        property.property_type === propertyType;

      const matchesInvestmentType =
        investmentType === 'all' ||
        property.investment_type === investmentType;

      return (
        matchesPrice &&
        matchesPropertyType &&
        matchesInvestmentType
      );
    });
  }, [
    allProperties,
    priceRange,
    propertyType,
    investmentType,
  ]);

  const handleMinChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange(([, max]) => [Math.min(value, max), max]);
  };

  const handleMaxChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange(([min]) => [min, Math.max(value, min)]);
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* ---------- Panel izquierdo: filtros + listado ---------- */}
      <section className="flex h-1/2 w-full flex-col overflow-hidden md:h-full md:w-1/2">
        <header className="border-b border-[#e9e9e9] px-6 py-4 bg-[#f8f8f8]">
          <div className="flex items-center justify-between">
            <a href="https://maxpropiedadespxm.com">
              <h1 className="font-display text-2xl text-brand-900">
                {t.title}
              </h1>
            </a>

            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              aria-label="Abrir filtros"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e9e9e9] bg-white cursor-pointer text-brand-900 transition-colors hover:border-[#bfbfbf]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h10.5M3 6h3m4.5 12h10.5M3 18h3m9-6h5.5M3 12h9"
                />
              </svg>
            </button>
          </div>

          <p className="text-xs text-brand-900/50">
            {t.results(filteredProperties.length)}
          </p>
        </header>

        {isFilterOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-brand-900/40 p-0 md:items-center md:p-6"
            onClick={() => setIsFilterOpen(false)}
          >
            <div
              className="w-full rounded-t-[2rem] bg-white p-6 shadow-2xl md:max-w-lg md:rounded-[2rem]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-brand-900">
                  Filtros
                </h2>

                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-brand-900/60 hover:bg-brand-50"
                  aria-label="Cerrar filtros"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Tipo de propiedad */}
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-brand-900">
                  Tipo de propiedad
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'terreno', label: 'Terreno' },
                    { value: 'departamento', label: 'Departamento' },
                    { value: 'casa', label: 'Casa' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPropertyType(option.value)}
                      className={`rounded-xl border px-3 py-3 text-sm transition-colors ${
                        propertyType === option.value
                          ? 'border-brand-900 bg-brand-900 text-white'
                          : 'border-brand-100 bg-white text-brand-900 hover:bg-brand-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rango de precio */}
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-brand-900">
                  Rango de precio
                </p>

                <div className="flex items-center gap-3">
                  <label className="flex flex-1 flex-col text-xs text-brand-900/50">
                    {t.min}

                    <input
                      type="number"
                      min={ABSOLUTE_MIN}
                      max={ABSOLUTE_MAX}
                      step={5000}
                      value={priceRange[0]}
                      onChange={handleMinChange}
                      className="mt-1 rounded-xl border border-brand-100 px-3 py-2 text-sm text-brand-900 focus:border-brand-500 focus:outline-none"
                    />
                  </label>

                  <span className="mt-5 text-brand-900/30">
                    —
                  </span>

                  <label className="flex flex-1 flex-col text-xs text-brand-900/50">
                    {t.max}

                    <input
                      type="number"
                      min={ABSOLUTE_MIN}
                      max={ABSOLUTE_MAX}
                      step={5000}
                      value={priceRange[1]}
                      onChange={handleMaxChange}
                      className="mt-1 rounded-xl border border-brand-100 px-3 py-2 text-sm text-brand-900 focus:border-brand-500 focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              {/* Tipo de inversión */}
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium text-brand-900">
                  Tipo de inversión
                </p>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    {
                      value: 'all',
                      label: 'Todos',
                    },
                    {
                      value: 'listo_construir',
                      label: 'Listo para construir',
                    },
                    {
                      value: 'alta_plusvalia',
                      label: 'Alta plusvalía',
                    },
                    {
                      value: 'airbnb',
                      label: 'Para Airbnb',
                    },
                    {
                      value: 'proyecto_turistico',
                      label: 'Proyecto turístico',
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setInvestmentType(option.value)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        investmentType === option.value
                          ? 'border-brand-900 bg-brand-900 text-white'
                          : 'border-brand-100 bg-white text-brand-900 hover:bg-brand-50'
                      }`}
                    >
                      <span>{option.label}</span>

                      {investmentType === option.value && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m5 12 4 4L19 6"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPropertyType('all');
                    setInvestmentType('all');
                    setPriceRange([ABSOLUTE_MIN, ABSOLUTE_MAX]);
                  }}
                  className="flex-1 rounded-full border border-brand-100 px-5 py-3 text-sm font-medium text-brand-900"
                >
                  Limpiar
                </button>

                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 rounded-full bg-brand-900 px-5 py-3 text-sm font-medium text-white"
                >
                  Ver resultados
                </button>
              </div>
            </div>
          </div>
        )}



        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredProperties.length === 0 ? (
            <p className="text-sm text-brand-900/50">{t.noResults}</p>
          ) : (
            <ul className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2">
              {filteredProperties.map((property) => {
                const image = property.gallery.find((g) => g.type === 'image');

                return (
                  <li
                    key={property.id}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredId(property.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                      <img
                        src={image?.url}
                        alt={image?.alt?.[locale] ?? ''}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="mt-1 px-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-xl font-semibold text-brand-900">
                          {property.title[locale]}
                        </p>
                      </div>

                      <p className="mt-0 text-lg- text-gray-500">
                        {property.area_m2} m² {property.bedrooms ? ` - ${property.bedrooms} habitacion${property.bedrooms > 1 ? 'es' : ''}` : ''}
                      </p>

                      <p className="mt-2 text-base font-semibold text-brand-900 underline font-1">
                        {t.perNight} {property.price.toLocaleString(locale)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ---------- Panel derecho: mapa ---------- */}
      <section className="h-1/2 w-full md:h-full md:w-1/2">
        <MapboxSearch
          properties={filteredProperties}
          hoveredId={hoveredId}
          onMarkerHover={setHoveredId}
          onMarkerClick={setHoveredId}
        />
      </section>
    </div>
  );
}
