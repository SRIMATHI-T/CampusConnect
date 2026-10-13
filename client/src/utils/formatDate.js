export function formatDate(value, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat(undefined, options).format(date);
}
