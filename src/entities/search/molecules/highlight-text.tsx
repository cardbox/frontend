import { useUnit } from 'effector-react/scope';
import React from 'react';
import styled from 'styled-components';

import { $highlightQuery } from '../model';

interface HighlightTextProps {
  text: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({ text }) => {
  const query = useUnit($highlightQuery);
  const data = React.useMemo(() => getFoundData({ search: text, query }), [text, query]);

  if (query === '') {
    return <>{text}</>;
  }

  return (
    <>
      {data.map(({ isFound, segment }, index) => (
        // no need to handle index issue here
        // eslint-disable-next-line react/jsx-key,react/no-array-index-key
        <PartText key={index} data-is-selected={isFound}>
          {segment}
        </PartText>
      ))}
    </>
  );
};

const PartText = styled.span<{ 'data-is-selected': boolean }>`
  &[data-is-selected='true'] {
    color: blue;
  }
`;

interface SelectedText {
  isFound: boolean;
  segment: string;
}

type Ret = SelectedText[];

/* eslint-disable unicorn/prefer-string-slice */
export function getFoundData({ query, search }: { query: string; search: string }): Ret {
  const lowerSearch = search.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const hasNoResult = lowerSearch.split(lowerQuery).length === 1;
  if (hasNoResult) return [{ isFound: false, segment: search }];

  const lowerCaseList = lowerSearch.split(lowerQuery);
  const startedIndexes = lowerCaseList.map((searchPart) => lowerSearch.indexOf(searchPart));
  const hasAtTheBeginning = lowerCaseList[0] === '';

  return startedIndexes.reduce<Ret>((prev, startedIndex, index) => {
    const isFirst = index === 0;
    const isLast = index + 1 === startedIndexes.length;

    const regularItem = search.substr(startedIndex, lowerCaseList[index].length);
    const queryItem = search.substr(startedIndex + lowerCaseList[index].length, query.length);

    if (isFirst && hasAtTheBeginning) {
      prev.push({ isFound: true, segment: queryItem });
    }
    if (regularItem) {
      prev.push({ isFound: false, segment: regularItem });
      if (isFirst) prev.push({ isFound: true, segment: queryItem });
    }
    if (!isFirst && !isLast && queryItem) {
      prev.push({ isFound: true, segment: queryItem });
    }

    return prev;
  }, []);
}
