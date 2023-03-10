import { EventEmitter } from "events";
export declare class CreateSqlite extends EventEmitter {
    path: string;
    table: string[];
    key?: string;
    constructor(options: any);
    set(table: string, key: string, value: any, encryption?: boolean): void;
    get(table: string, key: string, encryption?: any): any;
    all(table: string): any;
    add(table: string, key: string, value: any, encryption?: boolean): void;
    delete(table: string, key: any, oldValue?: boolean): any;
    deleteAll(table: string): void;
    has(table: string, key: string): boolean;
    info(table: string, type?: string): any;
    isTable(table: string): boolean;
    get Events(): {
        READY: string;
    };
    connect(): void;
}
//# sourceMappingURL=CreateSqlite.d.ts.map