import React from 'react';
import styled from 'styled-components';
import { button } from '@box/ui';

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
    <Content>
      <Controls.EditContent />
    </Content>
    <Footer>
      <button.Group>
        {/* FIXME: поправить _name в тикете BOX-167 */}
        <Controls.SubmitChanges title={okText} _name={_name} />
        <Controls.ResetChanges />
      </button.Group>
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
