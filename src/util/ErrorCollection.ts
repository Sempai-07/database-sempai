class ErrorTable extends Error {
  constructor(error: string) {
    super(error);
  }
}

class ErrorExtension extends Error {
  constructor(error: string) {
    super(error);
  }
}

class ErrorKey extends Error {
  constructor(error: string) {
    super(error);
  }
}

class ErrorType extends Error {
  constructor(error: string) {
    super(error);
  }
}

export { ErrorTable, ErrorExtension, ErrorKey, ErrorType };
