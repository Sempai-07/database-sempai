export class DatabaseError extends TypeError {
    constructor(error: any) {
        super(error);
    }
}