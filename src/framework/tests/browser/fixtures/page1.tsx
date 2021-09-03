import React from 'react';
import { sample } from 'effector';

import { createHatch, withHatch } from '../../../src';
import { pageNameSet, root } from './internal';

const hatch = createHatch(root);

hatch.enter.watch((e) => console.info('PAGE1 Hatch Enter', e));

const Page1 = withHatch(hatch, () => {
  return <div>For example first page</div>;
});

export default Page1;

sample({
  source: hatch.enter,
  fn: () => 'page1',
  target: pageNameSet,
});
