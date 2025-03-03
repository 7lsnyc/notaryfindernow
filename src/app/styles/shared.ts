export const styles = {
  // Layout
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  contentCard: 'bg-white rounded-lg shadow-md p-6',
  pageBackground: 'bg-background min-h-screen',

  // Typography
  h1: 'font-poppins text-h1 font-bold text-gray-900',
  h2: 'font-poppins text-h2 font-bold text-gray-800',
  body: 'font-poppins text-body text-gray-600',

  // Buttons
  primaryButton: 'bg-bright-yellow hover:bg-yellow-hover text-white font-poppins font-semibold px-6 py-3 rounded-button transition-colors duration-200',
  secondaryButton: 'bg-trust-blue hover:bg-blue-600 text-white font-poppins font-semibold px-6 py-3 rounded-button transition-colors duration-200',
  outlineButton: 'border-2 border-trust-blue text-trust-blue hover:bg-trust-blue hover:text-white font-poppins font-semibold px-6 py-3 rounded-button transition-colors duration-200',

  // Badges
  badges: {
    '24hour': 'bg-trust-blue text-white px-badge py-1 rounded-pill text-sm font-poppins',
    'bookToday': 'bg-fresh-green text-white px-badge py-1 rounded-pill text-sm font-poppins',
    'lowCost': 'bg-warm-gray text-gray-700 px-badge py-1 rounded-pill text-sm font-poppins'
  },

  // Forms
  input: 'w-full border-2 border-warm-gray rounded-button px-4 py-2 font-poppins text-body focus:border-trust-blue focus:outline-none',
  select: 'w-full border-2 border-warm-gray rounded-button px-4 py-2 font-poppins text-body focus:border-trust-blue focus:outline-none',
  
  // Cards
  notaryCard: 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200',
  
  // Navigation
  nav: {
    link: 'text-gray-600 hover:text-trust-blue font-poppins text-body transition-colors duration-200',
    activeLink: 'text-trust-blue font-poppins text-body font-semibold'
  },

  // Lists
  list: 'space-y-4',
  listItem: 'flex items-center space-x-3',

  // Grid
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',

  // Utility
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end'
}; 