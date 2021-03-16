export const toCamelCase = (str) =>
  str.trim().replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));

export function clean(obj) {
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.toString.call(obj[key])) {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    }
  });
}

export function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}
