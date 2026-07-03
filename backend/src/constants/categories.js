const VALID_CATEGORIES = [
  'Bebidas',
  'Lácteos',
  'Snacks',
  'Limpieza',
  'Frutas',
  'Granos',
];

function isValidCategory(value) {
  return VALID_CATEGORIES.includes(String(value || '').trim());
}

module.exports = {
  VALID_CATEGORIES,
  isValidCategory,
};
