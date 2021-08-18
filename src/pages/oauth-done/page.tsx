import React from 'react';
import { createStart, withStart } from '@box/lib/page-routing';

export const pageStart = createStart();

export const OAuthDonePage: React.FC = withStart(pageStart, () => {
  return null;
});
