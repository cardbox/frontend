import styled from 'styled-components';

const Base = styled.button`
  align-items: center;
  background-color: transparent;
  border: 1px solid var(--wizard500);
  // background-color: #000;
  // border: 1px solid #000;
  border-radius: 3px;
  color: var(--wizard500)
  // color: #fff;
  display: flex;
  font-size: 1.125rem;
  height: 42px;
  outline: 0;
  padding: 0 1.125rem;
  transition: 0.25s;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }

  &:disabled {
    opacity: 0.5;
  }
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

const Outline = styled(Base)`
  background-color: #ffffff;
  border: 1px solid #eeeef1;
  border-radius: 0.188rem;
  color: #000000;
`;

const Primary = styled(Base)`
  background-color: #4231ff;
  color: #ffffff;
`;

const Group = styled.div`
  button + button {
    margin-left: 12px;
  }
`;

export const button = {
  Base,
  Primary,
  Secondary,
  Text,
  Icon,
  Outline,
  Group,
};
