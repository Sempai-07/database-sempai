class ErrorTable extends Error {
  constructor(error) {
    super(error)
  }
}

class ErrorExtension extends Error {
  constructor(error) {
    super(error)
  }
}

class ErrorKey extends Error {
  constructor(error) {
    super(error)
  }
}

class ErrorType extends Error {
  constructor(error) {
    super(error)
  }
}

module.exports = {
  ErrorTable,
  ErrorExtension,
  ErrorKey,
  ErrorType
}