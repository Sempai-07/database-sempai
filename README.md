<h1>Database sempai</h1>

[![Discord Server](https://img.shields.io/discord/796504104565211187?color=7289da&logo=discord&logoColor=white)](https://discord.gg/EuSbT5HH8b)
[![NPM Version](https://img.shields.io/npm/v/database-sempai.svg?maxAge=3600)](https://www.npmjs.com/package/database-sempai)
[![NPM Downloads](https://img.shields.io/npm/dt/database-sempai.svg?maxAge=3600)](https://www.npmjs.com/package/database-sempai)

### Установка
```js
npm i database-sempai@2.0.2
```

### Подключение база данных Sql
```js
const { CreateSql } = require('database-sempai');

const db = new CreateSql({
  path: "./database-sql",
  // можете дать другое название
  table: ["main", "test"],
  // можете назвать как хотите
  // только всегда указывайте название таблицы в []. ["name", "users"]
  key: "sql"
  // Эта строка отвечает за кодеровку текста, точнее это ключ
  // Это необязательно, если вы не укажете это, оно будет отключено, без этого ключа вы не сможете зашифровать данные (значение в переменной)
  // Если вы потеряли/забыли свой ключ, вы потеряете свои данные
})
```

### Подключение база данных Json
```js
const { CreateJson } = require('database-sempai');

const db = new CreateJson({
  path: "./database-json",
  // можете дать другое название
  table: ["main", "test"],
  // можете назвать как хотите
  // только всегда указывайте название таблицы в []. ["name", "users"]
  key: "json"
  // Эта строка отвечает за кодеровку текста, точнее это ключ
  // Это необязательно, если вы не укажете это, оно будет отключено, без этого ключа вы не сможете зашифровать данные (значение в переменной)
  // Если вы потеряли/забыли свой ключ, вы потеряете свои данные
})
```

#### Функции
`add('table', 'key', 'value', 'encryption?')` - добавит к старому значению, новое значение

`set('table', 'key', 'value', 'encryption?')` - изменит значение переменной, если переменной нет она создаться автоматически

`get('table', 'key', 'encryption?')` - выдаст значение переменной

`all('table')` - покажет всё содержимое таблицы

`delete('table', 'key', 'oldValue?')` - удалит переменною

`deleteAll('table')` - удалит всё содержимое таблицы

`has('table', 'key')` - проверит существует ли переменная

`ping()` - покажет задержку в ms

`connect()` - чтобы использовать событие ready, вы должны это указать в конце кода

#### Событие
```js
const { CreateJson, CreateSql} = require('database-sempai');
// Нет разницы для события

const db = new CreateJson({
  path: "./database-json",
  table: ["main", "test"],
  key: "json"
})

db.on("ready", () => {
  console.log("База данных подключена")
})

// Ваш код

db.connect()
// Если вы не укажите это, событие ready не сработает
```

#### Примеры без шифрование текста
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

db.has('main', 'sempai')
// Вернёт true
db.has('main', 'name')
// Вернёт false

db.set('main', 'weredok', '15')
// Создаём переменную
db.delete('main', 'weredok', true)
// Удаляем переменную, если в третьем аргументе будет true, тогда эта функция вернёт в последний раз значение переменной

db.get('main', 'weredok')
// Вернёт: undefined, потому что переменная удаленна

db.deleteAll('main')
// Удалит все переменные в таблице

db.ping()
// Вернёт задержку в ms
```

#### Примеры с шифрованием текста
```js
db.add('main', 'test', 'sempai', true')
// true - зашифрует добавленный текст
// false - не будет шифровать добавленный текст (по умолчанию)


db.set('main', 'test', 'sempai', true)
// true - зашифрует
// false - не будет шифровать (по умолчанию)

db.get('main', 'test', true)
// true - зашифрует текст
// false - расшифрует текст
// normal - вернёт просто значение, даже если оно зашифрованное (по умолчанию)
```

В противных случаях: `undefined`
Надеюсь вам понравится 🤧

### Installation
 ```js
 npm i database-sempai@2.0.2
 ```

 ### Sql database connection
 ```js
 const { CreateSql } = require('database-sempai');

 const db = new CreateSql({
   path: "./database-sql",
   // you can give another name
   table: ["main", "test"],
   // you can call it whatever you want
   // just always put the table name in [].  ["name", "users"]
   key: "sql"
   // This line is responsible for encoding the text, or rather, this is the key
   // This is optional, if you don't specify this it will be disabled, without this key you won't be able to encrypt the data (the value in the variable)
   // If you lost/forgot your key, you will lose your data
 })
 ```

 ### Json database connection
 ```js
 const { CreateJson } = require('database-sempai');

 const db = new CreateJson({
   path: "./database-json",
   // you can give another name
   table: ["main", "test"],
   // you can call it whatever you want
   // just always put the table name in [].  ["name", "users"]
   key: "json"
   // This line is responsible for encoding the text, or rather, this is the key
   // This is optional, if you don't specify this it will be disabled, without this key you won't be able to encrypt the data (the value in the variable)
   // If you lost/forgot your key, you will lose your data
 })
 ```

 #### Functions
 `add('table', 'key', 'value', 'encryption?')` - add new value to old value

 `set('table', 'key', 'value', 'encryption?')` - change the value of the variable, if the variable does not exist it will be created automatically

 `get('table', 'key', 'encryption?')` - will return the value of the variable

 `all('table')` - show the entire contents of the table

 `delete('table', 'key', 'oldValue?')` - will delete a variable

 `deleteAll('table')` - delete all contents of the table

 `has('table', 'key')` - check if variable exists

 `ping()` - show delay in ms

 `connect()` - to use the ready event, you must specify it at the end of the code

 #### Event
 ```js
 const { CreateJson, CreateSql} = require('database-sempai');
 // No difference for event

 const db = new CreateJson({
   path: "./database-json",
   table: ["main", "test"],
   key: "json"
 })

 db.on("ready", () => {
   console.log("Database connected")
 })
 
 // Your code

 db.connect()
 // If you don't specify this, the ready event won't fire
 ```

 #### Examples without text encryption
 ```js
 db.set('main', 'sempai', 0)
 // Variable created

 db.get('main', 'sempai')
 // Returns: 0
 db.get('main', 'sempai', true)
 // Returns {key: "sempai", value: 0}
 db.get('main', 'sempai', true).value
 // Returns: 0

 db.add('main', 'sempai', '10')
 // Add 10 to "sempai" variable
 db.get('main', 'sempai')
 // Returns: 010

 db.all('main')
 // Returns: {
 // "sempai": "010"
 //}

 db.has('main', 'sempai')
 // Returns true
 db.has('main', 'name')
 // Returns false

 db.set('main', 'weredok', '15')
 // Create a variable
 db.delete('main', 'weredok', true)
 // Delete the variable, if the third argument is true, then this function will return the value of the variable for the last time

 db.get('main', 'weredok')
 // Returns: undefined because the variable is deleted

 db.deleteAll('main')
 // Delete all variables in the table

 db.ping()
 // Return delay in ms
 ```

 #### Examples with text encryption
 ```js
 db.add('main', 'test', 'sempai', true')
 // true - will encrypt the added text
 // false - will not encrypt the added text (default)


 db.set('main', 'test', 'sempai', true)
 // true - will encrypt
 // false - will not encrypt (default)

 db.get('main', 'test', true)
 // true - will encrypt the text
 // false - will decrypt the text
 // normal - will return just the value, even if it's encrypted (default)
 ```

 Otherwise: `undefined`
 I hope you enjoy it 🤧