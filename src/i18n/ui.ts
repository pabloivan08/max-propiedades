export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

export const ui = {
  es: {
    'nav.home': 'Inicio',
    'search.placeholder': 'Buscar por ubicación...',
    'filters.price': 'Precio Máximo',
    'filters.type': 'Tipo de Propiedad',
    'button.map': 'Ver Mapa',
    'button.list': 'Ver Lista',
    'property.priceText': 'USD'
  },
  en: {
    'nav.home': 'Home',
    'search.placeholder': 'Search by location...',
    'filters.price': 'Max Price',
    'filters.type': 'Property Type',
    'button.map': 'Show Map',
    'button.list': 'Show List',
    'property.priceText': 'USD'
  }
} as const;