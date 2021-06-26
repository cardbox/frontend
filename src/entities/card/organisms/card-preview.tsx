import * as editorLib from '@box/lib/editor';
import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import type { Card } from '@box/api';
import { Editor } from '@cardbox/editor';
import { Link } from 'react-router-dom';
import {
  PaperContainer,
  Skeleton,
  Text,
  TextType,
  button,
  iconDeckArrow,
  iconDeckCheck,
} from '@box/ui';

interface CardPreviewProps {
  card: Card | null;
  isCardInFavorite: boolean;
  href?: string;
  loading?: boolean;
}

export const CardPreview = ({
  card,
  isCardInFavorite,
  href,
  loading,
}: CardPreviewProps) => {
  if (loading) return <Skeleton />;
  if (!card) return null;

  return (
    <PaperContainerStyled>
      <Header>
        <Content title={card.title} content={card.content} href={href}>
          {card.content}
        </Content>
        <AddButton isCardToDeckAdded={isCardInFavorite} />
      </Header>

      <Meta author={card.author} updatedAt={card.updatedAt} />
    </PaperContainerStyled>
  );
};

const PaperContainerStyled = styled(PaperContainer)`
  justify-content: space-between;
  height: 190px;
  transition: 0.25s;

  &:hover {
    box-shadow: 0px 3px 9px #ebebeb;
  }
`;

type ContentProps = Pick<Card, 'title' | 'content'> &
  Pick<CardPreviewProps, 'href'>;

const Content: React.FC<ContentProps> = ({ content, title, href }) => {
  return (
    <ContentStyled>
      {/* FIXME: Add text-overflow processing */}
      <Text type={TextType.header4}>
        {href && <TitleLink to={href}>{title}</TitleLink>}
        {!href && title}
      </Text>
      <Editor value={editorLib.getValueNode(content)} readOnly={true} />
    </ContentStyled>
  );
};

const TitleLink = styled(Link)`
  color: unset;
  text-decoration: unset;
  transition: 0.25s;

  &:hover {
    color: var(--wizard500);
  }
`;

const Meta = ({ author, updatedAt }: Pick<Card, 'author' | 'updatedAt'>) => (
  <MetaStyled>
    {/* FIXME: bind with API later */}
    <Text type={TextType.small}>EffectorMaster</Text>
    <Text type={TextType.mini}>
      Update {dayjs(updatedAt).format('HH:mm DD.MM.YYYY')}, {author.username}
    </Text>
  </MetaStyled>
);

const ContentStyled = styled.div`
  width: 100%;
`;

const addButtonData = {
  true: { src: iconDeckCheck, alt: 'Remove card from my deck' },
  false: { src: iconDeckArrow, alt: 'Add card to my deck' },
};
const AddButton = ({ isCardToDeckAdded }: { isCardToDeckAdded: boolean }) => {
  return (
    <AddButtonStyled data-is-card-to-deck-added={isCardToDeckAdded}>
      <img
        src={addButtonData[isCardToDeckAdded.toString()].src}
        alt={addButtonData[isCardToDeckAdded.toString()].alt}
      />
    </AddButtonStyled>
  );
};

const AddButtonStyled = styled(button.Icon)<{
  'data-is-card-to-deck-added': boolean;
}>`
  &[data-is-card-to-deck-added='true'] {
    background-color: #f7f6ff;

    &:hover {
      background-color: inherit;
    }
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;

  & > *:not(:first-child) {
    margin-left: 1rem;
  }
`;

const MetaStyled = styled.div`
  color: #9b99ac;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
