import { useRef } from 'react';

// todo:
//  currently used only in card-list,
//  need to optimize this hook for navigation with keyboard
//  e.g. - handle arrow down (focus on cur item index + row len)
export function useKeyboardFocus() {
  const containerRef = useRef<null | HTMLDivElement>(null);

  const focusNext = () => {
    if (!containerRef.current) return;
    const children = [...containerRef.current.children];
    const curFocusIndex = children.findIndex(
      (el) => el === document.activeElement,
    );
    const indexToFocus = curFocusIndex + 1;
    const isIndexIncorrect = indexToFocus >= children.length;
    if (isIndexIncorrect) return;
    const el = containerRef.current.children[indexToFocus] as HTMLElement;
    el.focus();
  };

  const focusPrev = () => {
    if (!containerRef.current) return;
    const children = [...containerRef.current.children];
    const curFocusIndex = children.findIndex(
      (el) => el === document.activeElement,
    );
    const indexToFocus = curFocusIndex - 1;
    const isIndexIncorrect = indexToFocus < 0;
    if (isIndexIncorrect) return;
    const el = containerRef.current.children[indexToFocus] as HTMLElement;
    el.focus();
  };

  const focusItemChanged = (direction: 'next' | 'prev') => {
    if (direction === 'next') focusNext();
    else focusPrev();
  };

  return {
    containerRef,
    focusItemChanged,
  };
}
