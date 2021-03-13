# lib/contract

## Usage

Create a model in a `model.ts` file and export all effector units:

```ts
import { createEvent, createStore } from 'effector';

export const buttonClicked = createEvent();
export const $counter = createStore(0);

$counter.on(buttonClicked, (counter) => counter + 1);
```

Create a page component in a `page.tsx`:

```tsx
import React from 'react';
import { Button, Text } from 'my-ui';

export const ExamplePage = () => (
  <div>
    <Text>Counter: 1</Text>
    <Button onClick={() => {}}>Increment</Button>
  </div>
);
```

Now create effector units to correctly connects with:

```tsx
import React from 'react';
import { Button, Text } from 'my-ui';
import { createEvent, createStore } from 'effector';
import { useEvent, useStore } from 'effector-react';

export const buttonClicked = createEvent();
export const $counter = createStore(0);

export const ExamplePage = () => (
  <div>
    <CounterText />
    <Increment />
  </div>
);

const CounterText = () => {
  const counter = useStore($counter);
  return <Text>Counter: {counter}</Text>;
};

const Increment = () => {
  const handler = useEvent(buttonClicked);
  return <Button onClick={handler}>Increment</Button>;
};
```

Also, you can use [`@effector/reflect`](https://npmjs.com/@effector/reflect):

```tsx
import React from 'react';
import { Button, Text } from 'my-ui';
import { createEvent, createStore } from 'effector';
import { reflect } from '@effector/reflect';

export const buttonClicked = createEvent();
export const $counter = createStore(0);

export const ExamplePage = () => (
  <div>
    <CounterText />
    <Increment />
  </div>
);

const CounterText = reflect({
  view: Text,
  bind: { children: $counter.map((counter) => `Counter: ${counter}`) },
});

const Increment = reflect({
  view: Button,
  bind: { onClick: buttonClicked.prepend(() => {}) },
});
```

Now you can connect the model with the page, create `index.ts` file:

```ts
import { contract } from '@cardbox/lib/contract';
import * as model from './model';
import * as page from './page';
export { ExamplePage } from './page';
contract({ page, model });
```
