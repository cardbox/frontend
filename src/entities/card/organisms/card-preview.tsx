import dayjs from 'dayjs';
import styled from 'styled-components';
import React, { forwardRef } from 'react';
import type { Card, User } from '@box/api';
import { Editor } from '@cardbox/editor';
import type { EditorValue } from '@cardbox/editor';
import {
  HighlightText,
  PaperContainer,
  Skeleton,
  Text,
  button,
  iconDeckArrow,
  iconDeckCheck,
} from '@box/ui';
import { Link } from 'react-router-dom';
import { navigationModel } from '@box/entities/navigation';
import { useEvent } from 'effector-react';
import { useMouseSelection } from '@box/lib/use-mouse-selection';
import { useSearchQuery } from '@box/features/search-bar';

type CardSize = 'small' | 'large';

interface CardPreviewProps {
  card: Card;
  author: User;
  isCardInFavorite?: boolean;
  href?: string;
  userHref?: string;
  loading?: boolean;
  /**
   * @remark May be in future - make sense to split independent components - CardItem, CardDetails
   * @default "small"
   */
  size?: CardSize;
}

export const CardPreview = ({
  card,
  author,
  isCardInFavorite = false,
  href,
  userHref,
  loading = false,
  size = 'small',
}: CardPreviewProps) => {
  const historyPush = useEvent(navigationModel.historyPush);

  const { handleMouseDown, handleMouseUp, buttonRef } = useMouseSelection(
    (inNewTab = false) => {
      if (!href) return;
      if (inNewTab) window.open(href, '_blank');
      else historyPush(href);
    },
  );

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
        <Content
          title={card.title}
          content={card.content}
          href={href}
          size={size}
          updatedAt={card.updatedAt}
        />
        <AddButton ref={buttonRef} isCardToDeckAdded={isCardInFavorite} />
      </Header>

      {size === 'small' && (
        <Meta author={author} userHref={userHref} updatedAt={card.updatedAt} />
      )}
    </PaperContainerStyled>
  );
};

const PaperContainerStyled = styled(PaperContainer)<{
  'data-size': CardSize;
}>`
  justify-content: space-between;
  overflow: hidden;
  box-shadow: 0px 3px 9px #faf9fa;

  &[data-size='small'] {
    height: 190px;
    transition: 0.25s;

    &:hover,
    &:focus {
      border-color: var(--wizard300);
      background-color: var(--bnw0);
      cursor: pointer;
    }
  }

  &[data-size='large'] {
    background: #fff;
    min-height: 190px;
  }
`;

type ContentProps = Pick<Card, 'title' | 'content' | 'updatedAt'> &
  Pick<CardPreviewProps, 'href' | 'size'>;

const Content = ({ content, title, href, size, updatedAt }: ContentProps) => {
  const query = useSearchQuery();

  return (
    <ContentStyled>
      {/* FIXME: Add text-overflow processing */}
      <TextStyled type="h4">
        {href && (
          <TitleLink to={href}>
            <HighlightText query={query} text={title} />
          </TitleLink>
        )}
        {!href && title}
      </TextStyled>
      {size === 'large' && (
        <>
          <MetaStyled>
            <Text type="p">
              Update {dayjs(updatedAt).format('HH:mm DD.MM.YYYY')}
            </Text>
          </MetaStyled>
          {/* FIXME: resolve better later */}
          <Editor value={content as EditorValue} readOnly={true} />
        </>
      )}
      {size === 'small' && (
        <ItemEditorContainer>
          {/* FIXME: resolve better later */}
          <Editor value={content as EditorValue} readOnly={true} />
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
    color: var(--wizard500);
  }
`;

const ItemEditorContainer = styled.div`
  --editor-color: #62616d;
  --editor-font-size: 15px;
  --editor-line-height: 21px;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  max-height: 90px;
`;

type MetaProps = Pick<Card, 'updatedAt'> & {
  userHref?: string;
  author: User;
};

const Meta = ({ author, userHref = '', updatedAt }: MetaProps) => (
  <MetaStyled>
    {/* FIXME: Add click processing */}
    <UserLink to={userHref}>
      <Text type="span">{author.username}</Text>
    </UserLink>
    <Text type="p">
      Update {dayjs(updatedAt).format('HH:mm DD.MM.YYYY')}, {author.username}
    </Text>
  </MetaStyled>
);

const ContentStyled = styled.div`
  width: 100%;
  overflow: hidden;
`;

const addButtonData = {
  true: { src: iconDeckCheck, alt: 'Remove card from my deck' },
  false: { src: iconDeckArrow, alt: 'Add card to my deck' },
};
const AddButton = forwardRef<HTMLButtonElement, { isCardToDeckAdded: boolean }>(
  ({ isCardToDeckAdded }, ref) => {
    const click: React.MouseEventHandler = (e) => {
      e.stopPropagation();
    };
    return (
      <AddButtonStyled
        data-is-card-to-deck-added={isCardToDeckAdded}
        onClick={click}
        ref={ref}
      >
        <img
          src={addButtonData[isCardToDeckAdded.toString()].src}
          alt={addButtonData[isCardToDeckAdded.toString()].alt}
          title={addButtonData[isCardToDeckAdded.toString()].alt}
        />
      </AddButtonStyled>
    );
  },
);

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

const UserLink = styled(Link)`
  text-decoration: none;
  color: #9b99ac;
`;
