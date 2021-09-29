import React from 'react';
import styled from 'styled-components';
import { ButtonGroup } from '@box/shared/ui';

import * as Controls from '../atoms';

interface Props {
  okText?: string;
  _name: string;
}

export const Form = ({ okText, _name }: Props) => (
  <div>
    <Header>
      <Controls.EditTitle />
    </Header>
    <Controls.Tags />
    <Controls.TagInput />
    <Content>
      <Controls.EditContent />
    </Content>
    <Footer>
      <ButtonGroup>
        {/* FIXME: поправить _name в тикете BOX-167 */}
        <Controls.ResetChanges _name={_name} />
        <Controls.SubmitChanges title={okText} _name={_name} />
      </ButtonGroup>
    </Footer>
  </div>
);

// Layout
const Header = styled.div`
  margin-bottom: 50px;
`;

const Content = styled.div`
  min-height: 500px;
`;

const Footer = styled.div`
  margin-top: 100px;
`;
