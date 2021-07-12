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

type CardType = 'item' | 'details';

interface CardPreviewProps {
  card?: Card;
  isCardInFavorite?: boolean;
  href?: string;
  loading?: boolean;
  /**
   * @remark May be in future - make sense to split independent components - CardItem, CardDetails
   * @default "item"
   */
  type?: CardType;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  isCardInFavorite,
  href,
  loading = false,
  type = 'item',
}) => {
  // FIXME: refine size of card pre-detecting
  if (loading) return <Skeleton />;
  if (!card) return null;
  return (
    <PaperContainerStyled data-type={type}>
      {/*<Container>*/}
      <Header>
        <Content
          title={card.title}
          content={card.content}
          href={href}
          type={type}
          updatedAt={card.updatedAt}
        />
        <AddButton isCardToDeckAdded={isCardInFavorite} />
      </Header>
      {type === 'item' && (
        <Meta author={card.author} updatedAt={card.updatedAt} />
      )}
    </PaperContainerStyled>
  );
};

const PaperContainerStyled = styled(PaperContainer)<{
  'data-type': CardType;
}>`
  justify-content: space-between;

  &[data-type='item'] {
    height: 190px;
    transition: 0.25s;

    &:hover {
      box-shadow: 0px 3px 9px #ebebeb;
    }
  }

  &[data-type='details'] {
    background: #fff;
    min-height: 190px;
  }
`;

type ContentProps = Pick<Card, 'title' | 'content' | 'updatedAt'> &
  Pick<CardPreviewProps, 'href' | 'type'>;

const Content: React.FC<ContentProps> = ({
  content,
  title,
  href,
  type,
  updatedAt,
}) => {
  return (
    <ContentStyled>
      {/* FIXME: Add text-overflow processing */}
      <Text type={TextType.header4}>
        {href && <TitleLink to={href}>{title}</TitleLink>}
        {!href && title}
      </Text>
      {type === 'details' && (
        <>
          <MetaStyled>
            <Text type={TextType.mini}>
              Update {dayjs(updatedAt).format('HH:mm DD.MM.YYYY')}
            </Text>
          </MetaStyled>
          <Editor value={editorLib.getValueNode(content)} readOnly={true} />
        </>
      )}
      {type === 'item' && (
        <ContentText type={TextType.small}>{content}</ContentText>
      )}
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
        title={addButtonData[isCardToDeckAdded.toString()].alt}
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
