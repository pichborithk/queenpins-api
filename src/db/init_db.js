const { db } = require('../config/default');

const { rebuildDatabase } = require('./seed');

db.connect()
  .then(rebuildDatabase)
  // .then(testDB)
  .catch(console.error)
  .finally(() => db.end());
