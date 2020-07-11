import * as React from 'react';
import { useEvent, useStore } from 'effector-react/ssr';
import styled from 'styled-components';

import { assignStart } from 'lib/effector';
import * as model from './model';

export const HomePage = () => {
  const pageLoaded = useEvent(model.pageLoaded);
  const increment = useEvent(model.incrementClicked);
  const reset = useEvent(model.resetClicked);

  const counterValue = useStore(model.$counterValue);
  const pagePending = useStore(model.$pagePending);

  React.useEffect(() => {
    pageLoaded({});
  }, [pageLoaded]);

  return (
    <section>
      <h2>Hello world! Effector SSR example</h2>
      <div>
        <h4>Counter value: {counterValue}</h4>
        <Button disabled={pagePending} onClick={increment}>
          Increment
        </Button>
        <Button disabled={pagePending} onClick={reset}>
          Reset
        </Button>
      </div>
    </section>
  );
};

assignStart(HomePage, model.pageLoaded);

const Button = styled.button`
  background-color: transparent;
  border: 1px solid lightblue;
  padding: 1rem;
  border-radius: 1rem;
`;
