import styled from 'styled-components';

const Base = styled.button`
  align-items: center;
  background-color: #000;
  border: 1px solid #000;
  border-radius: 3px;
  color: #fff;
  display: flex;
  font-size: 1.125rem;
  height: 42px;
  outline: 0;
  padding: 0 1.125rem;
  cursor: pointer;
`;

const Secondary = styled(Base)`
  background-color: #f4f2f7;
  border-color: #f4f2f7;
  color: #000;
`;

const Text = styled(Base)`
  background-color: transparent;
  border-color: transparent;
  color: #1d1a23;
  font-size: 0.9375rem;
`;

const Outline = styled(Base)`
  background-color: #ffffff;
  border: 1px solid #eeeef1;
  border-radius: 0.188rem;
  color: #000000;
`;

export const button = {
  Base,
  Secondary,
  Text,
  Outline,
};
