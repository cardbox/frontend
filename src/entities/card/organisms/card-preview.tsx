import type { EditorValue } from '@cardbox/editor';
import { Editor, useExtendedEditor } from '@cardbox/editor';
import dayjs from 'dayjs';
import 'dayjs/plugin/relativeTime';
import { useEvent, useStoreMap } from 'effector-react/scope';
import React, { forwardRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { cardModel } from '@box/entities/card';
import { navigationModel } from '@box/entities/navigation';
import { HighlightText } from '@box/entities/search';

import type { Card } from '@box/shared/api';
import { breakpoints } from '@box/shared/lib/breakpoints';
import { theme } from '@box/shared/lib/theme';
import { useMouseSelection } from '@box/shared/lib/use-mouse-selection';
import { routes, useLink } from '@box/shared/routes';
import {
  Button,
  IconDeckArrow,
  IconDeckCheck,
  PaperContainer,
  Skeleton,
  Text,
} from '@box/shared/ui';

type CardSize = 'small' | 'large';

interface CardPreviewProps {
  card: Card;
  loading?: boolean;
  /**
   * @remark May be in future - make sense to split independent components - CardItem, CardDetails
   * @default "small"
   */
  size?: CardSize;
}

export const CardPreview = ({ card, loading = false, size = 'small' }: CardPreviewProps) => {
  const href = useLink(routes.card.view, { cardId: card.id });
  const isCardInFavorites = useStoreMap({
    store: cardModel.$favoritesCards,
    keys: [card.id],
    fn: (list, [id]) => list.some((card) => card.id === id),
  });

  const addToFavorites = useEvent(cardModel.favoritesAdd);
  const removeFromFavorites = useEvent(cardModel.favoritesRemove);
  const historyPush = useEvent(navigationModel.historyPush);

  const toggleFavorites = useCallback(() => {
    if (isCardInFavorites) removeFromFavorites(card.id);
    else addToFavorites(card.id);
  }, [addToFavorites, removeFromFavorites, card.id, isCardInFavorites]);

  const { handleMouseDown, handleMouseUp, buttonRef } = useMouseSelection((inNewTab = false) => {
    if (!href) return;
    if (inNewTab) {
      window.open(href, '_blank');
    } else {
      if (size === 'large') {
        return;
      }
      historyPush(href);
    }
  });

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
      <ContentBlock>
        <Content card={card} size={size} />

        <OverHelm />
      </ContentBlock>

      {size === 'small' && <Meta card={card} />}
      <SaveCardButton
        ref={buttonRef}
        onClick={toggleFavorites}
        isCardInFavorites={isCardInFavorites}
        card={card}
      />
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
  position: relative;
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

type ContentProps = { card: Card } & Pick<CardPreviewProps, 'size'>;

const Content = ({ card, size }: ContentProps) => {
  const href = useLink(routes.card.view, { cardId: card.id });
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
          <Editor editor={editor} value={card.content as EditorValue} readOnly />
        </>
      )}
      {size === 'small' && (
        <ItemEditorContainer>
          {/* FIXME: resolve better later */}
          <Editor editor={editor} value={card.content as EditorValue} readOnly />
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
  max-height: 108px;
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

const SaveCardButton = forwardRef<
  HTMLButtonElement,
  {
    isCardInFavorites: boolean;
    card: Card;
    onClick: (id: string) => void;
  }
>(({ isCardInFavorites, card, onClick }, ref) => {
  const handleClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    onClick(card.id);
  };

  if (isCardInFavorites) {
    return (
      <CardButton
        ref={ref}
        onClick={handleClick}
        variant="outlined"
        theme="primary"
        icon={<IconDeckCheck title="Remove card from my deck" />}
      />
    );
  }

  return (
    <CardButton
      ref={ref}
      onClick={handleClick}
      variant="outlined"
      theme="secondary"
      icon={<IconDeckArrow title="Add card to my deck" />}
    />
  );
});

const ContentBlock = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;

  & > *:not(:first-child):not(:last-child) {
    margin-left: 1rem;
  }

  ${breakpoints.devices.mobile} {
    max-width: calc(100% - 60px);
  }
`;

const MetaStyled = styled.div`
  color: var(${theme.palette.bnw600});
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${breakpoints.devices.mobile} {
    display: block;
    max-width: calc(100% - 60px);
  }
`;

const UserLink = styled(Link)`
  text-decoration: none;
  color: var(${theme.palette.bnw600});
`;

const CardButton = styled(Button)`
  position: absolute;
  right: 1.5rem;
  top: 1.125rem;
  margin-top: 0;

  ${breakpoints.devices.mobile} {
    top: unset;
    bottom: 0.625rem;
  }
`;
