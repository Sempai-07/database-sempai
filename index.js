import { CreateSqlite } from "database-sempai";

const db = new CreateSqlite({
 path: "database",
 table: "main"
});

db.set('main', 27, 57);

const number = db.get('main', 27);

console.log(number.toString());