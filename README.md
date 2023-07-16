## Database-Sempai

`Database-Sempai` is a TypeScript class that provides a simple key-value storage mechanism using JSON files. It allows you to create and manage multiple tables and perform various operations on them.

### Installation

The `CreateStorage` class can be used in a TypeScript project by importing it as follows:

```typescript
import { CreateStorage } from "database-sempai";
```

### Constructor

The `CreateStorage` class accepts an optional configuration object in its constructor. The available configuration options are:

- `path`: The directory path where the database files will be stored. Default is "database".
- `table`: An array of table names to be created. Default is ["main"].
- `extname`: The file extension for the database files. Default is ".sql".
- `key`: A secret key used for data encryption (optional).

### Methods

The `CreateStorage` class provides the following methods to interact with the storage:

#### Add, Update, and Delete Operations:

- `set`: Add or update a key-value pair in the specified table.
- `delete`: Remove a key-value pair from the specified table.
- `clear`: Clear all data from the specified table.

#### Retrieval Operations:

- `get`: Get the value associated with a specific key in the specified table.
- `all`: Get all key-value pairs from the specified table.
- `findByValue`: Find key-value pairs in the specified table based on a specific value.

#### Query Operations:

- `filter`: Filter key-value pairs in the specified table based on a custom filtering function.
- `at`: Access a value in the specified table by its index or key.
- `randomAt`: Get a random value from the specified table.
- `endKey`: Get the last key from the specified table.
- `endValue`: Get the last value from the specified table.
- `firtsKey`: Get the first key from the specified table.
- `firtsValue`: Get the first value from the specified table.
- `includes`: Check if a specific value exists in the specified table.
- `keys`: Get all keys from the specified table.
- `values`: Get all values from the specified table.

#### Miscellaneous:

- `length`: Get the number of key-value pairs in the specified table.
- `getPath`: Get the current database directory path.
- `hasTable`: Check if a table with the given name exists.
- `getTables`: Get an array of all table names.
- `isTable`: Check if a specific table exists.
- `connect`: Emit a "ready" event when the database is ready to be used.

### Error Handling

The `CreateStorage` class throws custom error types for various scenarios, such as invalid table names, missing extensions, encryption key not specified, etc.

### Asynchronous File Operations

The class uses asynchronous file operations (`fs.promises.readFile` and `fs.promises.writeFile`) for reading and writing data to the database files. This helps to prevent blocking the main thread and enhances performance.

### Usage Example

Here is an example of how to use the `CreateStorage` class:

```typescript
// Import the class
import { CreateStorage } from "database-sempai";

// Create a new instance of CreateStorage
const db = new CreateStorage<number, string>({
  path: "myDatabase",
  table: ["users"],
  extname: ".json",
});

// Set data in the "users" table
await db.set("users", 1, "John Doe");
await db.set("users", 2, "Jane Smith");

// Get a value from the "users" table
const user = await db.get("users", 1);
console.log(user); // Output: "John Doe"

// Get all key-value pairs from the "users" table
const allUsers = await db.all("users");
console.log(allUsers); // Output: { "1": "John Doe", "2": "Jane Smith" }

// Filter key-value pairs in the "users" table
const filteredUsers = await db.filter("users", ({ value }) =>
  value.startsWith("John")
);
console.log(filteredUsers); // Output: [[1, "John Doe"]]

// Delete a value from the "users" table
await db.delete("users", 2);

// Clear all data from the "users" table
await db.clear("users");
```

Please note that the example above assumes the use of numeric keys (`number`) and string values (`string`). You can customize the types of keys and values by providing different generic types when creating an instance of `CreateStorage`.

### Contributing

Contributions to this project are welcome! If you encounter any issues or have ideas for improvements, feel free to open an issue or submit a pull request. Happy coding!
