import { createHatch, withHatch } from 'framework';
import React from 'react';
import { Helmet } from 'react-helmet-async';

const hatch = createHatch();

export const Error404Page = withHatch(hatch, () => (
  <>
    <Helmet title="Not found" />
    <div>Page not found</div>
  </>
));
