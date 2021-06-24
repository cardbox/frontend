import styled from 'styled-components';

const Base = styled.button`
  align-items: center;
  background-color: transparent;
  border: 1px solid var(--wizard500);
  border-radius: 3px;
  color: var(--wizard500);
  display: flex;
  font-size: 1.125rem;
  height: 42px;
  outline: 0;
  padding: 0 1.125rem;
`;

const Secondary = styled(Base)`
  background-color: #f4f2f7;
  border-color: #f4f2f7;
  color: #000;
`;

const Text = styled(Base)<{ type: 'submit' | 'reset' | 'button' }>`
  background-color: transparent;
  border-color: transparent;
  color: #1d1a23;
  font-size: 0.9375rem;
`;

const Icon = styled(Base)`
  background-color: #fff;
  color: currentColor;
  border-color: #eeeef1;
  padding: 0;
  min-width: 42px;
  justify-content: center;

  transition: background-color 0.5s, box-shadow 0.5s;
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  &:focus {
    box-shadow: #969696 0 0 3px, #c3c3c3 0 0 15px;
  }
`;

export const button = {
  Base,
  Secondary,
  Text,
  Icon,
};
