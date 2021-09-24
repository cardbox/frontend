import React from 'react';
import styled from 'styled-components';
import { Chip } from '@box/shared/ui';
import { reflect } from '@effector/reflect/ssr';
import { theme } from '@box/shared/lib/theme';
import { useStore } from 'effector-react/ssr';

import * as model from '../../model';

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
    isEmpty: model.$tags.map((tags) => !tags.length),
  },
});

interface Props {
  // tags: string[];
  onRemove: (tag: string) => void;
}

const ChipsView = ({ onRemove }: Props) => {
  const tags = useStore(model.$tags);
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
