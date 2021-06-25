import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import type { Card } from '@cardbox/api';
import {
  PaperContainer,
  Text,
  TextType,
  button,
  iconDeckArrow,
  iconDeckCheck,
} from '@cardbox/ui';

interface CardPreviewProps {
  card: Card;
  isCardInFavorite: boolean;
}

export const CardPreview = ({ card, isCardInFavorite }: CardPreviewProps) => (
  <PaperContainerStyled>
    <Header>
      <Content title={card.title}>{card.content}</Content>
      <AddButton isCardToDeckAdded={isCardInFavorite} />
    </Header>

    <Meta author={card.author} updatedAt={card.updatedAt} />
  </PaperContainerStyled>
);
const PaperContainerStyled = styled(PaperContainer)`
  justify-content: space-between;
  height: 190px;
`;
const Content: React.FC<Pick<Card, 'title'>> = ({ children, title }) => {
  return (
    <ContentStyled>
      {/* FIXME: Add text-overflow processing */}
      <Text type={TextType.header4}>{title}</Text>
      <ContentText type={TextType.small}>{children}</ContentText>
    </ContentStyled>
  );
};
const ContentText = styled(Text)`
  color: #62616d;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: pre-line;
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
