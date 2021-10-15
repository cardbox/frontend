declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module '*.woff2';

declare module '*.png' {
  const content: any;
  export default content;
}

declare const INITIAL_STATE: {};
