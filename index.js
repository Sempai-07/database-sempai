const { CreateStorage } = require("./src/index");

const db = new CreateStorage({
  table: ['main'],
  path: 'db',
  tableNot: true,
  tablePath: 'oldTable'
});

db.get('main', 'key')