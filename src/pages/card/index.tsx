import React from 'react';
import styled from 'styled-components';
import { CardPreview } from '@cardbox/entities/card';
import {
  ContentCenteredTemplate,
  IconSave,
  UserCard,
  button,
} from '@cardbox/ui';

const SaveEditIcon = ({ fill = 'black' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.9504 9.04956L17 12V17C17 17.5523 16.5523 18 16 18H8C7.44771 18 7 17.5523 7 17V12L4.04957 9.04956"
      stroke={fill}
      strokeWidth="1.5"
    />
    <path d="M12 6V10" stroke={fill} strokeWidth="1.5" strokeLinecap="square" />
    <path d="M14.8284 8L12 10.8284L9.17157 8" stroke={fill} strokeWidth="1.5" />
  </svg>
);

export const CardPage = () => (
  <ContentCenteredTemplate>
    <Container>
      <Main>
        <CardPreview card={card} />
      </Main>
      <Sidebar>
        <UserCard user={user} />
        <Links>
          <button.Outline>
            <Icon>
              <img src={IconSave} alt="edit" />
            </Icon>
            Edit card
          </button.Outline>
          <DeleteCardButton>
            <Icon>
              <SaveEditIcon fill="#ef3a5b" />
            </Icon>
            Delete card
          </DeleteCardButton>
        </Links>
      </Sidebar>
    </Container>
  </ContentCenteredTemplate>
);

const card = {
  id: 1,
  title:
    'Manage map or Set in effector store. Manage map or Set in effector store. Manage map or Set in effector store.',
  updatedAt: '05:03 03.01.2',
  author: 'Sova',
  content:
    'Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item). Sometimes we need to save Set in effector store. Simple createStore(new Set) will not trigger updates on.add(item)',
};

const user = {
  avatar:
    'https://images.pexels.com/photos/2927811/pexels-photo-2927811.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  name: 'LangCreator',
  role: 'Owner',
};

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

const DeleteCardButton = styled(button.Outline)`
  color: #ef3a5b;
`;

const Icon = styled.div`
  margin-right: 0.75rem;
`;
