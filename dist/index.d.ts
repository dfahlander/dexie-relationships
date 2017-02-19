import Dexie from 'dexie';

//
// Extend Dexie interface
//
declare module 'dexie' {
    module Dexie {
        interface Table<T, Key> {
            with(spec: Object): Promise<Array<T>>;
        }
        interface Collection<T, Key> {
            with(spec: Object): Promise<Array<T>>;
        }
    }
}
