# Database-Sempai

`Database-Sempai` is a `Node.js` library for creating and managing local `JSON` databases.

## Installation
You can install `Database-Sempai` using npm:

```
npm install database-sempai
```

## Usage
First, import the library:

```javascript
const DatabaseSempai = require('database-sempai');
```

## Creating a Database
To create a new database, create an instance of the `CreateStorage` class:

```javascript
const db = new DatabaseSempai.CreateStorage({
   path: 'myDatabase', // The directory name for storing database files (default: "database")
   table: ['main', 'users'], // An array of table names (default: ["main"])
   extname: '.json', // The file extension for database files (default: ".sql")
   key: 'mySecretKey' // Optional encryption key
});
```

This will create a new directory named `myDatabase` in the current working directory with two subdirectories: `main` and `users`. It will also create two `JSON` files (`storage.json`) inside each directory.

### Adding Data
You can add data to the database using the `set` method:

```javascript
db.set('main', 'key', 'value');
```
This will add a new key-value pair to the main table.

If you set the encryption flag to `true`, the value will be encrypted using the encryption key provided when creating the database:

```javascript
db.set('main', 'key', 'value', true);
```

### Retrieving Data
You can retrieve data from the database using the `get` method:

```javascript
const value = db.get('main', 'key');
```
If the value was encrypted, you can decrypt it by setting the encryption flag to `false`:

```javascript
const value = db.get('main', 'key', false);
```

### Updating Data
You can update data in the database using the `set` method:

```javascript
db.set('main', 'key', 'new_value');
```
This will update the value associated with the key in the main table.

### Deleting Data
You can delete data from the database using the delete method:

```javascript
db.delete('main', 'key');
```
This will delete the key-value pair associated with the key from the main table.

### Listening for Updates
You can listen for updates to the database using the `on` method:

```javascript
db.on('update', (newValue, oldValue) => {
   console.log(`Updated: ${oldValue.key} (${oldValue.value}) => ${newValue.key} (${newValue.value})`);
});
```

This will print a message to the console every time the value associated with the key is updated.

## Documentation

In progress.

## License

`Database Sempai` is available under the `MIT` license. See the <a href="https://github.com/Sempai-07/database-sempai/blob/v2/LICENSE">LICENSE</a> file for more information.