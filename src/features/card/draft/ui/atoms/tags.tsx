import React from 'react';
import styled from 'styled-components';
import { Chip } from '@box/ui';
import { reflect } from '@effector/reflect';
import { theme } from '@box/lib/theme';

import * as model from '../../model';
import { $tags } from '../../model';

/**
 * Теги для карточки
 * */
export const Tags = () => {
  return (
    <TagsContainer>
      <Chips />
    </TagsContainer>
  );
};

const TagsWrapperStyled = styled.div`
  display: flex;
  margin: ${theme.spacing(-2, 0, 2, -2)};
  flex-wrap: wrap;
`;
const TagsContainer = reflect<{ isEmpty: boolean }>({
  view: ({ isEmpty, children }) => {
    if (isEmpty) return null;
    return <TagsWrapperStyled>{children}</TagsWrapperStyled>;
  },
  bind: {
    isEmpty: $tags.map((tags) => !tags.length),
  },
});

const ChipsView = ({
  tags,
  onRemove,
}: {
  tags: string[];
  onRemove: (tag: string) => void;
}) => {
  const handleRemove = (tag: string) => () => onRemove(tag);
  return (
    <>
      {tags.map((tag) => (
        <Chip key={tag} label={tag} onRemove={handleRemove(tag)} />
      ))}
    </>
  );
};
const Chips = reflect({
  view: ChipsView,
  bind: {
    tags: model.$tags,
    onRemove: model.existingTagRemoved,
  },
});
