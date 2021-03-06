interface SelectedText {
  isFound: boolean;
  text: string;
}
type Ret = SelectedText[];

/* eslint-disable unicorn/prefer-string-slice */
export function getFoundData({
  query,
  search,
}: {
  query: string;
  search: string;
}): Ret {
  const lowerSearch = search.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const hasNoResult = lowerSearch.split(lowerQuery).length === 1;
  if (hasNoResult) return [{ isFound: false, text: search }];

  const lowerCaseList = lowerSearch.split(lowerQuery);
  const startedIndexes = lowerCaseList.map((searchPart) =>
    lowerSearch.indexOf(searchPart),
  );
  const hasAtTheBeginning = lowerCaseList[0] === '';

  return startedIndexes.reduce<Ret>((prev, startedIndex, index) => {
    const isFirst = index === 0;
    const isLast = index + 1 === startedIndexes.length;

    const regularItem = search.substr(
      startedIndex,
      lowerCaseList[index].length,
    );
    const queryItem = search.substr(
      startedIndex + lowerCaseList[index].length,
      query.length,
    );

    if (isFirst && hasAtTheBeginning) {
      prev.push({ isFound: true, text: queryItem });
    }
    if (regularItem) {
      prev.push({ isFound: false, text: regularItem });
      if (isFirst) prev.push({ isFound: true, text: queryItem });
    }
    if (!isFirst && !isLast && queryItem) {
      prev.push({ isFound: true, text: queryItem });
    }

    return prev;
  }, []);
}
