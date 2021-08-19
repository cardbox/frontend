import styled from 'styled-components';
import React, {
  ChangeEvent,
  FC,
  FormEventHandler,
  KeyboardEventHandler,
} from 'react';
import { Button, Input, iconAdd } from '@box/ui';
import { combine } from 'effector-root';
import { reflect } from '@effector/reflect';
import { theme } from '@box/lib/theme';
import { todo } from '@box/lib/todo';

import * as model from '../../model';

todo('logic for existing tags');

export const TagInput = () => {
  return (
    <NewTagForm>
      <TagReflect />
      <Submit />
    </NewTagForm>
  );
};

const FormStyled = styled.form`
  display: flex;

  & input {
    max-width: 400px;
  }

  & button[type='submit'] {
    margin-left: ${theme.spacing(2)};
  }
`;

const TagInputView = ({
  lastTagRemoved,
  onChange,
  value,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  lastTagRemoved: () => void;
}) => {
  const handleBackSpace = () => {
    if (value) return;
    lastTagRemoved();
  };
  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === 'Backspace') handleBackSpace();
  };
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder="add new tag"
      onKeyDown={handleKeyDown}
    />
  );
};

const TagReflect = reflect({
  view: TagInputView,
  bind: {
    value: model.$newTagInput,
    onChange: model.newTagChanged.prepend((e) => e.target.value),
    lastTagRemoved: model.lastTagRemoved,
  },
});

const Submit = () => {
  return (
    <Button
      type="submit"
      icon={<img src={iconAdd} alt="Submit entered tag" />}
    />
  );
};

const FormView: FC<{
  submitForm: () => void;
  existedTag: string;
}> = ({ children, submitForm, existedTag }) => {
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (existedTag) {
      todo(`maybe show some alert? Tag '${existedTag}' already exists`);
    } else submitForm();
  };
  return <FormStyled onSubmit={handleSubmit}>{children}</FormStyled>;
};

const NewTagForm = reflect({
  view: FormView,
  bind: {
    submitForm: model.newTagSubmitted.prepend(() => {}),
    existedTag: combine(
      model.$newTagInput,
      model.$tags,
      (newTag, tags) =>
        tags.find((tag) => tag.toLowerCase() === newTag.toLowerCase()) || '',
    ),
  },
});
