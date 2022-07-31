import { useEffect, useRef } from 'react';
import emitter from '../helpers/emitter';

const useHorizontalResizer = <O extends HTMLElement = HTMLElement, P extends HTMLElement = HTMLElement, Q extends HTMLElement = HTMLElement>() => {
  const ref = useRef<O>(null);
  const leftChild = useRef<P>(null);
  const rightChild = useRef<Q>(null);

  useEffect(() => {
    if (!ref.current) return;

    const resizer = ref.current;
    let resizing = false;
    let painting = false;
    let dx = 0;
    let leftWidth = 0;
    let rightWidth = 0;

    const onMouseDown = (e: MouseEvent) => {
      resizing = true;
      dx = e.clientX;
      leftWidth = leftChild.current?.offsetWidth || 0;
      rightWidth = rightChild.current?.offsetWidth || 0;

      return false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!resizing || painting) {
        return;
      }

      e = e || window.event;
      const diff = e.clientX - dx;

      if (leftWidth + diff > 100 && rightWidth - diff > 100) {
        painting = true;
        requestAnimationFrame(() => {
          if (leftChild.current) {
            leftChild.current.style.width = `${leftWidth + diff}px`;
          }
          if (rightChild.current) {
            rightChild.current.style.width = `${rightWidth - diff}px`;
          }
          painting = false;
          emitter.emit('editor:resize');
        });
      }
    };

    const onMouseUp = () => {
      resizing = false;
    };

    resizer.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      resizer.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return [ref, leftChild, rightChild];
};

export default useHorizontalResizer;
