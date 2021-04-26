import React from 'react';
import styled from 'styled-components';
import { Can, CurrentUserCard } from '@cardbox/entities/session';
import { CardFull } from '@cardbox/entities/card';
import { ContentCenteredTemplate } from '@cardbox/ui';
import { reflect } from '@effector/reflect/ssr';
import { useEvent, useStore } from 'effector-react/ssr';
import { withStart } from '@cardbox/lib/page-routing';

import { $card, start } from './contract';

const Content = () => {
  const card = useStore($card);
  React.useEffect(() => {
    console.log('view rendered', card);
  }, [card]);
  if (card) {
    return <CardFull card={card} />;
  }
  return <div>Loading...</div>;
};

export const CardPage = withStart(start, () => (
  <ContentCenteredTemplate>
    <Container>
      <Main>
        <Content />
      </Main>
      <Sidebar>
        <CurrentUserCard role="Owner" />
        <Links>
          <Check action={{ name: 'edit' }}>
            <LinkEdit href="#edit">Edit card</LinkEdit>
          </Check>
          <Check action={{ name: 'archive' }}>
            <LinkDelete href="#archive">Archive card</LinkDelete>
          </Check>
          <Check action={{ name: 'delete' }}>
            <LinkDelete href="#delete">Delete card</LinkDelete>
          </Check>
        </Links>
      </Sidebar>
    </Container>
  </ContentCenteredTemplate>
));

const nullCard = {
  id: '00000000-0000-0000-0000-000000000000',
  type: 'card' as const,
};

const Check = reflect({
  view: Can,
  bind: {
    resource: $card.map((card) => card ?? nullCard),
  },
});

const Container = styled.div`
  display: flex;

  & > *:first-child {
    margin-right: 2.25rem;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Sidebar = styled.div`
  flex-shrink: 0;
  width: 324px;

  & > *:first-child {
    margin-bottom: 1.625rem;
  }
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 0.5625rem;
  }
`;

const Link = styled.a`
  font-size: 0.9375rem;
  line-height: 1.1875rem;

  &:not(:hover) {
    text-decoration: none;
  }
`;

const LinkEdit = styled(Link)`
  color: #683aef;
`;

const LinkDelete = styled(Link)`
  color: #ef3a5b;
`;
