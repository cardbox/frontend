import {
  allSettled,
  attach,
  createDomain,
  createEvent,
  createStore,
  fork,
  forward,
} from 'effector';

import { contract } from '.';

test('events forwarded from page to model', () => {
  const fnPage = jest.fn();
  const fnModel = jest.fn();
  const page = { source: createEvent<number>() };
  const model = { source: createEvent<number>() };
  page.source.watch(fnPage);
  model.source.watch(fnModel);
  contract({ page, model });

  page.source(1);

  expect(fnPage).toBeCalledWith(1);
  expect(fnModel).toBeCalledWith(1);
});

test('events do not forwarded from model to page', () => {
  const fnPage = jest.fn();
  const fnModel = jest.fn();
  const page = { source: createEvent<number>() };
  const model = { source: createEvent<number>() };
  page.source.watch(fnPage);
  model.source.watch(fnModel);
  contract({ page, model });

  model.source(2);

  expect(fnPage).not.toBeCalled();
  expect(fnModel).toBeCalledWith(2);
});

test('stores forwarded from model to page', () => {
  const changeModel = createEvent<number>();
  const page = { $data: createStore(1) };
  const model = { $data: createStore(1) };
  model.$data.on(changeModel, (_, value) => value);
  contract({ page, model });

  changeModel(100);

  expect(page.$data.getState()).toBe(100);
});

// Just check that it is incorrect usage
test('stores do not forwarded from page to model', () => {
  const changePage = createEvent<number>();
  const page = { $data: createStore(1) };
  const model = { $data: createStore(1) };
  page.$data.on(changePage, (_, value) => value);
  contract({ page, model });

  changePage(100);

  expect(model.$data.getState()).toBe(1);
});

test('initial state forwarded for stores', () => {
  const page = { $data: createStore(1) };
  const model = { $data: createStore(2) };
  contract({ page, model });

  expect(page.$data.getState()).toBe(2);
});

test('set initial state inside scope', () => {
  const app = createDomain();
  const page = { $data: app.createStore('PAGE_STATE') };
  const model = { $data: app.createStore('MODEL_STATE') };
  contract({ page, model });
  const scope = fork(app);

  expect(scope.getState(page.$data)).toBe('MODEL_STATE');
});

test('event from a page changes state of the model', async () => {
  const app = createDomain();
  const model = (() => {
    const happened = app.createEvent();
    const $counter = app.createStore(1);
    const effect = app.createEffect(
      (value: number) => new Promise<number>((resolve) => setTimeout(resolve, 5, value + 1)),
    );
    const changer = attach({ source: $counter, effect });
    forward({
      from: happened,
      to: changer,
    });
    $counter.on(changer.doneData, (_, value) => value);
    return { happened, $counter };
  })();
  const page = { happened: app.createEvent(), $counter: app.createStore(0) };
  contract({ page, model });
  const scope = fork(app);

  await allSettled(page.happened, { scope });

  expect(scope.getState(page.$counter)).toBe(2);
});
