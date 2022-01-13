import { MouseEventHandler, useRef } from 'react';

// todo:
//  it's a hook to handle click on interactive elements
//  if user wants to select text on interactive element he can drag his mouse
//  over selected text
//  probably a temporary solution
export function useMouseSelection(fn: (inNewTab?: boolean) => void) {
  const preventingRef = useRef<HTMLButtonElement | null>(null);
  const mouseDownCoords = useRef({
    x: 0,
    y: 0,
  });
  const isUpPreventing = useRef(false);
  const handleMouseDown: MouseEventHandler = (e) => {
    if (e.button === 1) {
      fn(true);
      return;
    }
    if (e.button === 0) {
      if (preventingRef?.current) {
        isUpPreventing.current = preventingRef.current.contains(e.target as Node);
      }
      mouseDownCoords.current = {
        x: e.pageX,
        y: e.pageY,
      };
    }
  };

  const handleMouseUp: MouseEventHandler = (e) => {
    if (isUpPreventing.current) return;

    const yDiff = Math.abs(e.pageY - mouseDownCoords.current.y);
    const xDiff = Math.abs(e.pageX - mouseDownCoords.current.x);
    if (yDiff <= 5 && xDiff <= 5) {
      fn();
    }
  };

  return {
    handleMouseDown,
    handleMouseUp,
    buttonRef: preventingRef,
  };
}
