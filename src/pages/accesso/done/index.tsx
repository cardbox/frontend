import React from 'react';
import { ContentCenteredTemplate } from 'ui';
import { useStart } from 'lib/page-routing';

import * as model from './model';

export const AccessoDonePage = () => {
  useStart(model.pageReady);

  return <ContentCenteredTemplate>Hello it</ContentCenteredTemplate>;
};
