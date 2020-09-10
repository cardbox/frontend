import * as React from 'react';
import styled from 'styled-components';
import { useEvent, useStore } from 'effector-react/ssr';

import * as LoginModel from '../models/login';

export const Profile = () => {
  const loginClicked = useEvent(LoginModel.loginClicked);

  return <Login onClick={loginClicked}>Login</Login>;
};

const Login = styled.button``;
