const esmImporter = require('esm')(module);

module.exports = {
  transform: {
    '\\.m?jsx?$': 'jest-esm-transformer',
  },
};
