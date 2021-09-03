import React from 'react';
import { sample } from 'effector';

import { createHatch, withHatch } from '../../../src';
import { pageNameSet, root } from './internal';

const hatch = createHatch(root);

const PageAnother = withHatch(hatch, () => {
  return <div>For example just another page</div>;
});

export default PageAnother;

sample({
  source: hatch.enter,
  fn: () => 'page-another',
  target: pageNameSet,
});
