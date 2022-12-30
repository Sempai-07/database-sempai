<h1>Database sempai</h1>

[![Discord Server](https://img.shields.io/discord/796504104565211187?color=7289da&logo=discord&logoColor=white)](https://discord.gg/EuSbT5HH8b)
[![NPM Version](https://img.shields.io/npm/v/database-sempai.svg?maxAge=3600)](https://www.npmjs.com/package/database-sempai)
[![NPM Downloads](https://img.shields.io/npm/dt/database-sempai.svg?maxAge=3600)](https://www.npmjs.com/package/database-senpai)

### Установка
```js
npm i database-sempai@1.0.0
```

### Подключение database

```js
const {Create} = require('database-sempai');

const db = new Create({
  path: "./database",
  // можете дать другое название
  table: ["main", "test"]
  // можете назвать как хотите
  // только всегда указывайте название в []. ["name", "users"]
})
```

#### Функции
`add('table', 'key', 'value')` - добавит к старому значению, новое значение

`set('table', 'key', 'value')` - изменит значение переменной, если переменной нет она создаться автоматически

`editName('table', 'oldkey', 'newkey')` - изменит название переменной
`get('table', 'key', false/true)` - выдаст значение переменной

`all('table')` - покажет всё содержимое таблицы

`delete('table', 'key')` - удалит переменною

`deleteAll('table')` - удалит всё содержимое таблицы

`has('table', 'key')` - проверит существует ли переменная

`ping()` - покажет задержку в ms

#### Примеры
```js
db.set('main', 'sempai', 0)
// Переменная создана

db.get('main', 'sempai')
// Вернёт: 0
db.get('main', 'sempai', true)
// Вернёт {key: "sempai", value: 0}
db.get('main', 'sempai', true).value
// Вернёт: 0

db.add('main', 'sempai', '10')
// Добавит к переменной "sempai" 10
db.get('main', 'sempai')
// Вернёт: 010

db.all('main')
// Вернёт: {
//  "sempai": "010"
//}

db.has('table', 'sempai')
// Вернёт true
db.has('table', 'name')
// Вернёт false

db.set('main', 'weredok', '15')
// Создаём переменную
db.delete('main', 'weredok')
// Удаляем переменную
db.get('main', 'weredok')
// Вернёт: undefined, потому что переменная удаленна

db.editName('main', 'sempai', 'weredok')
db.get('main', 'weredok')
// Вернёт 010
// Старое значение переменной, присваивается к новому

db.deleteAll('main')
// Удалит все переменные

db.ping()
// Вернёт задержку в ms
```

В противных случаях: `undefined`