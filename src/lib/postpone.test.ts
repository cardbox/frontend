import { allSettled, fork } from 'effector/fork';
import { createDomain } from 'effector';

import { postpone } from './postpone';

test('trigger target on source after delay', async () => {
  const app = createDomain();
  const source = app.createEvent<string>();
  const $target = app.createStore('');

  postpone({
    source,
    target: $target,
    delay: 10,
  });

  const scope = fork(app);
  const promise = allSettled(source, { scope, params: 'demo' });
  expect(scope.getState($target)).toBe('');

  await promise;
  expect(scope.getState($target)).toBe('demo');
});

test('abort triggering target', async () => {
  const app = createDomain();
  const source = app.createEvent<string>();
  const abort = app.createEvent();
  const $target = app.createStore('');

  postpone({
    source,
    target: $target,
    delay: 10,
    abort,
  });

  const scope = fork(app);
  const run = allSettled(source, { scope, params: 'demo' });
  expect(scope.getState($target)).toBe('');

  const cancel = allSettled(abort, { scope });

  await Promise.race([run, cancel]);
  expect(scope.getState($target)).toBe('');
});

test('abort correct scope', async () => {
  const app = createDomain();
  const source = app.createEvent<string>();
  const abort = app.createEvent();
  const $target = app.createStore('');

  postpone({
    source,
    target: $target,
    delay: 10,
    abort,
  });

  const scope1 = fork(app);
  const scope2 = fork(app);
  const run1 = allSettled(source, { scope: scope1, params: 'RUNNER 1' });
  const run2 = allSettled(source, { scope: scope2, params: 'SECOND' });

  expect(scope1.getState($target)).toBe('');
  expect(scope2.getState($target)).toBe('');

  const cancel1 = allSettled(abort, { scope: scope1 });

  await Promise.all([run1, run2, cancel1]);
  expect(scope1.getState($target)).toBe('');
  expect(scope2.getState($target)).toBe('SECOND');
});
