import { MouseEventHandler, MutableRefObject, useRef } from 'react';

export function useMouseSelection({
  callback,
  preventingRef,
}: {
  callback: (inNewTab?: boolean) => void;
  preventingRef?: MutableRefObject<HTMLElement | null>;
}) {
  const mouseDownCoords = useRef({
    x: 0,
    y: 0,
  });
  const isUpPreventing = useRef(false);
  const handleMouseDown: MouseEventHandler = (e) => {
    if (e.button === 1) {
      callback(true);
      return;
    }
    if (e.button === 0) {
      if (preventingRef?.current) {
        isUpPreventing.current = preventingRef.current.contains(
          e.target as Node,
        );
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
      callback();
    }
  };

  return {
    handleMouseDown,
    handleMouseUp,
  };
}
