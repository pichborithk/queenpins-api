const { db } = require('../config/default');

const { rebuildDatabase, initialData } = require('./seed');

db.connect()
  .then(rebuildDatabase)
  .then(initialData)
  .catch(console.error)
  .finally(() => db.end());
