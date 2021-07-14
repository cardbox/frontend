import React, { useState } from 'react';
import { ContentCenteredTemplate } from '@box/ui';
import { Editor } from '@cardbox/editor';
import type { EditorValue } from '@cardbox/editor';
import { getValueNode } from '@box/lib/editor';

export const CardEditPage = () => {
  const [value, setValue] = useState<EditorValue>(getValueNode('Test'));

  return (
    <ContentCenteredTemplate>
      <Editor value={value} onChange={setValue} />
    </ContentCenteredTemplate>
  );
};
