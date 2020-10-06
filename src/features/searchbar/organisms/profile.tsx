import * as React from 'react';
import styled from 'styled-components';
import { LoaderAccesso, button } from 'ui';
import { useEvent, useStore } from 'effector-react/ssr';

import * as LoginModel from '../models/login';

export const Profile = () => {
  const loginClicked = useEvent(LoginModel.loginClicked);
  const pending = useStore(LoginModel.$pending);

  return (
    <Button disabled={pending} onClick={loginClicked}>
      {pending ? <LoaderAccesso /> : 'Login'}
    </Button>
  );
};

const Button = styled(button.Base)`
  --loader-color: white;
`;
