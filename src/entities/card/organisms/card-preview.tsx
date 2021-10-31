import 'dayjs/plugin/relativeTime';

import dayjs from 'dayjs';
import styled from 'styled-components';
import React, { forwardRef, useCallback } from 'react';
import {
  Button,
  IconDeckArrow,
  IconDeckCheck,
  PaperContainer,
  Skeleton,
  Text,
} from '@box/shared/ui';
import type { Card, User } from '@box/shared/api';
import { Editor, useExtendedEditor } from '@cardbox/editor';
import type { EditorValue } from '@cardbox/editor';
import { HighlightText } from '@box/entities/search';
import { Link } from 'react-router-dom';
import { cardModel } from '@box/entities/card';
import { createStore } from 'effector';
import { navigationModel } from '@box/entities/navigation';
import { theme } from '@box/shared/lib/theme';
import { useEvent } from 'effector-react';
import { useMouseSelection } from '@box/shared/lib/use-mouse-selection';
import { useStore } from 'effector-react/ssr';

type CardSize = 'small' | 'large';

interface CardPreviewProps {
  card: Card;
  href?: string;
  loading?: boolean;
  /**
   * @remark May be in future - make sense to split independent components - CardItem, CardDetails
   * @default "small"
   */
  size?: CardSize;
}

export const $isCardInFavorites = createStore(false);

export const CardPreview = ({
  card,
  href,
  loading = false,
  size = 'small',
}: CardPreviewProps) => {
  const favoritesCards = useStore(cardModel.$favoritesCards);
  const isCardInFavorites = favoritesCards.some((s) => s.id === card.id);

  const addToFavorites = useEvent(cardModel.addedToFavorites);
  const removeFromFavorites = useEvent(cardModel.removedFromFavorites);
  const historyPush = useEvent(navigationModel.historyPush);

  const handleFavoritesAdd = useCallback((cardId: string) => {
    addToFavorites({ id: cardId });
  }, []);

  const handleFavoritesRemove = useCallback((cardId: string) => {
    removeFromFavorites({ id: cardId });
  }, []);

  const { handleMouseDown, handleMouseUp, buttonRef } = useMouseSelection(
    (inNewTab = false) => {
      if (!href) return;
      if (inNewTab) window.open(href, '_blank');
      else historyPush(href);
    },
  );

  const handleCardClick = (cardId: string) => {
    if (!isCardInFavorites) {
      handleFavoritesAdd(cardId);
    } else {
      handleFavoritesRemove(cardId);
    }
  };

  // FIXME: refine size of card pre-detecting
  if (loading) return <Skeleton />;

  return (
    <PaperContainerStyled
      data-size={size}
      // fixme: make paper as a link? (Link, a)
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      aria-label="Open card"
    >
      <Header>
        <Content card={card} href={href} size={size} />
        <AddButton
          ref={buttonRef}
          onClick={handleCardClick}
          isCardToDeckAdded={isCardInFavorites}
          card={card}
        />
        <OverHelm />
      </Header>

      {size === 'small' && <Meta card={card} />}
    </PaperContainerStyled>
  );
};

const OverHelm = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(
    to bottom,
    rgba(var(--card-background), 0) 0%,
    rgba(var(--card-background), 0) 20%,
    rgba(var(--card-background), 0.5) 60%,
    rgba(var(--card-background), 1) 100%
  );
`;

const PaperContainerStyled = styled(PaperContainer)<{
  'data-size': CardSize;
}>`
  justify-content: space-between;
  overflow: hidden;
  border-color: var(${theme.palette.bnw900});
  box-shadow: ${theme.shadows[1]};
  --card-background: 255, 255, 255;
  background-color: rgb(var(--card-background));

  &[data-size='small'] {
    box-shadow: ${theme.shadows[2]};
    height: 190px;

    &:hover,
    &:focus {
      --card-background: 250, 249, 250;
      border-color: var(${theme.palette.wizard800});
      cursor: pointer;
    }
  }

  &[data-size='large'] {
    min-height: 190px;
  }
`;

type ContentProps = { card: Card } & Pick<CardPreviewProps, 'href' | 'size'>;

const Content = ({ card, size, href }: ContentProps) => {
  const editor = useExtendedEditor();
  return (
    <ContentStyled>
      {/* FIXME: Add text-overflow processing */}
      <TextStyled type="h5">
        {href && (
          <TitleLink to={href}>
            <HighlightText text={card.title} />
          </TitleLink>
        )}
        {!href && card.title}
      </TextStyled>
      {size === 'large' && (
        <>
          <Meta card={card} />
          {/* FIXME: resolve better later */}
          <Editor
            editor={editor}
            value={card.content as EditorValue}
            readOnly
          />
        </>
      )}
      {size === 'small' && (
        <ItemEditorContainer>
          {/* FIXME: resolve better later */}
          <Editor
            editor={editor}
            value={card.content as EditorValue}
            readOnly
          />
        </ItemEditorContainer>
      )}
    </ContentStyled>
  );
};
const TextStyled = styled(Text)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const TitleLink = styled(Link)`
  color: unset;
  text-decoration: unset;
  transition: 0.25s;

  &:hover {
    color: var(${theme.palette.wizard500});
  }
`;

const ItemEditorContainer = styled.div`
  --editor-color: var(${theme.palette.bnw400});
  --editor-font-size: 15px;
  --editor-line-height: 21px;
  display: flex;
  max-height: 122px;
`;
const Meta: React.FC<{ card: Card }> = ({ card }) => {
  const date = dayjs(card.updatedAt);
  const isJustCreated = card.updatedAt === card.createdAt;
  const label = isJustCreated ? 'Created' : 'Updated';
  return (
    <MetaStyled>
      <Text type="p" title={date.format('HH:mm DD.MM.YYYY')}>
        {label} {date.fromNow()}
      </Text>
    </MetaStyled>
  );
};

const ContentStyled = styled.div`
  width: 100%;
  overflow: hidden;
`;

const AddButton = forwardRef<
  HTMLButtonElement,
  {
    isCardToDeckAdded: boolean;
    card: Card;
    onClick: (id: string) => void;
  }
>(({ isCardToDeckAdded, card, onClick }, ref) => {
  const handleClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    onClick(card.id);
  };
  if (isCardToDeckAdded) {
    return (
      <Button
        ref={ref}
        onClick={handleClick}
        variant="outlined"
        theme="primary"
        icon={<IconDeckCheck title="Remove card from my deck" />}
      />
    );
  }

  return (
    <Button
      ref={ref}
      onClick={handleClick}
      variant="outlined"
      theme="secondary"
      icon={<IconDeckArrow title="Add card to my deck" />}
    />
  );
});

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  position: relative;

  & > *:not(:first-child):not(:last-child) {
    margin-left: 1rem;
  }
`;

const MetaStyled = styled.div`
  color: var(${theme.palette.bnw600});
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserLink = styled(Link)`
  text-decoration: none;
  color: var(${theme.palette.bnw600});
`;
