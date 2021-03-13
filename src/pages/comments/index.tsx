import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { Comments } from './comments';

export const CommentsPage = () => {
  return (
    <Template>
      <Globals />
      <Container>
        <Main>
          <Card title="Manage Map or Set in Effector store">
            <Paragraph>
              Sometimes we need to save Set or Map in an Effector store.
              <br />
              Simple createStore(new Set()) will not trigger updates after .add(item)
            </Paragraph>
          </Card>
          <Comments />
        </Main>
        <Aside>
          <Describer footer="See all members (3)">Effector Magister</Describer>
          <Describer title="Card info" footer="See all tags">
            The card description here
          </Describer>
        </Aside>
      </Container>
    </Template>
  );
};

const Globals = createGlobalStyle`
  body, html {
    background-color: #ffffff;
    color: #1a1e23;
  }
`;

const Template = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  padding-top: 38px;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 1300px;

  & > * + * {
    margin-left: 54px;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 324px;

  & > :not(:first-child) {
    margin-top: 50px;
  }
`;

const Surface = styled.div`
  background-color: #ffffff;
  border: 1px solid #e7e5ee;
  box-sizing: border-box;
  box-shadow: 0 6px 9px #f6f5f8;
  border-radius: 6px;
  display: flex;
  flex-direction: column;

  & *:last-child {
    border-radius: inherit;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  & *:first-child {
    border-radius: inherit;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const Card: React.FC<{ title: string }> = ({ title, children }) => (
  <CardContainer>
    <Surface>
      <CardFiller>
        <CardTitle>{title}</CardTitle>
        <CardContent>{children}</CardContent>
      </CardFiller>
    </Surface>
  </CardContainer>
);

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 66px;
`;

const CardFiller = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  box-sizing: border-box;
`;

const CardTitle = styled.h3`
  padding: 0;
  margin: 0;
  display: block;
  font-size: 30px;
  line-height: 30px;
  font-weight: 500;
  font-style: normal;
  box-sizing: border-box;
`;

const CardContent = styled.div`
  margin-top: 30px;
`;

const Paragraph = styled.p`
  padding: 0;
  margin: 0;
  line-height: 21px;
  font-size: 15px;
  color: #1a1e23;
  box-sizing: border-box;
`;

interface Describer {
  title?: string;
  footer: React.ReactNode;
}

const Describer: React.FC<Describer> = ({ title, footer, children }) => (
  <DescriberContainer>
    {title && <DescriberTitle>{title}</DescriberTitle>}
    <Surface>
      <DescriberContent>{children}</DescriberContent>
      <DescriberFooter>{footer}</DescriberFooter>
    </Surface>
  </DescriberContainer>
);

const DescriberContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DescriberTitle = styled.div`
  font-size: 15px;
  line-height: 21px;
  color: #a39bb2;
  padding-bottom: 6px;
  box-sizing: border-box;
  margin-top: -24px;
`;

const DescriberContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
  border-radius: inherit;
`;

const DescriberFooter = styled.div`
  background-color: #f7f6f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 9px;
  box-sizing: border-box;
`;
