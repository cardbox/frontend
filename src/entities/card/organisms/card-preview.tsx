import dayjs from 'dayjs';
import styled from 'styled-components';
import React, { forwardRef } from 'react';
import {
  Button,
  IconDeckArrow,
  IconDeckCheck,
  PaperContainer,
  Skeleton,
  Text,
} from '@box/shared/ui';
import type { Card, User } from '@box/shared/api';
import { Editor } from '@cardbox/editor';
import type { EditorValue } from '@cardbox/editor';
import { HighlightText } from '@box/entities/search';
import { Link } from 'react-router-dom';
import { breakpoints } from '@box/shared/lib/breakpoints';
import { navigationModel } from '@box/entities/navigation';
import { theme } from '@box/shared/lib/theme';
import { useEvent } from 'effector-react';
import { useMouseSelection } from '@box/shared/lib/use-mouse-selection';

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
      </Header>

      {size === 'small' && (
        <Meta author={author} userHref={userHref} updatedAt={card.updatedAt} />
      )}

      <AddButton ref={buttonRef} isCardToDeckAdded={isCardInFavorite} />
    </PaperContainerStyled>
  );
};

const PaperContainerStyled = styled(PaperContainer)<{
  'data-size': CardSize;
}>`
  position: relative;
  justify-content: space-between;
  overflow: hidden;
  border-color: var(${theme.palette.bnw900});
  box-shadow: ${theme.shadows[1]};

  &[data-size='small'] {
    background-color: var(${theme.palette.bnw950});
    box-shadow: ${theme.shadows[2]};
    height: 190px;
    transition: 0.25s;

    &:hover,
    &:focus {
      border-color: var(${theme.palette.wizard800});
      background-color: var(${theme.palette.bnw1000});
      cursor: pointer;
    }
  }

  &[data-size='large'] {
    background: var(${theme.palette.bnw1000});
    min-height: 190px;
  }
`;

type ContentProps = Pick<Card, 'title' | 'content' | 'updatedAt'> &
  Pick<CardPreviewProps, 'href' | 'size'>;

const Content = ({ content, title, href, size, updatedAt }: ContentProps) => {
  return (
    <ContentStyled>
      {/* FIXME: Add text-overflow processing */}
      <TextStyled type="h4">
        {href && (
          <TitleLink to={href}>
            <HighlightText text={title} />
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
    color: var(${theme.palette.wizard500});
  }
`;

const ItemEditorContainer = styled.div`
  --editor-color: var(${theme.palette.bnw400});
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

const AddButton = forwardRef<HTMLButtonElement, { isCardToDeckAdded: boolean }>(
  ({ isCardToDeckAdded }, ref) => {
    const handleClick: React.MouseEventHandler = (e) => {
      e.stopPropagation();
    };

    if (isCardToDeckAdded) {
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
  },
);

const Header = styled.header`
  display: flex;
  justify-content: space-between;

  & > *:not(:first-child) {
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
