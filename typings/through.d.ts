declare module 'through' {
  // Type definitions for through
  // Project: https://github.com/dominictarr/through
  // Definitions by: Andrew Gaspar <https://github.com/AndrewGaspar>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

  /// <reference types="node" />

  import stream = require('stream');

  export default function through(
    write?: (this: Through, data: any) => void,
    end?: (this: Through) => void,
    opts?: {
      autoDestroy: boolean;
    },
  ): through.ThroughStream;

  interface Through {
    queue: (chunk: any) => any;
  }

  namespace through {
    export interface ThroughStream extends stream.Transform {
      autoDestroy: boolean;
      queue: (chunk: any) => any;
    }
  }
}
