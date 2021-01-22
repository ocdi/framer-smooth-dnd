import * as React from "react";
import { Position } from "./Common";
// import { clamp, distance } from "@popmotion/popcorn";
import { findIndex } from "./find-index";
import move from "array-move";
import { AnimateSharedLayout } from "framer-motion";

// Prevent rapid reverse swapping
// const buffer = 5;

// export const findIndex = (
//   i: number,
//   yOffset: number,
//   positions: Position[]
// ) => {
//   let target = i;
//   const { top, height } = positions[i];
//   const bottom = top + height;

//   // If moving down
//   if (yOffset > 0) {
//     const nextItem = positions[i + 1];
//     if (nextItem === undefined) return i;

//     const swapOffset =
//       distance(bottom, nextItem.top + nextItem.height / 2) + buffer;
//     if (yOffset > swapOffset) target = i + 1;

//     // If moving up
//   } else if (yOffset < 0) {
//     const prevItem = positions[i - 1];
//     if (prevItem === undefined) return i;

//     const prevBottom = prevItem.top + prevItem.height;
//     const swapOffset = distance(top, prevBottom - prevItem.height / 2) + buffer;
//     if (yOffset < -swapOffset) target = i - 1;
//   }

//   return clamp(0, positions.length, target);
// };

interface IContainerProps {
  orientation?: "vertical" | "horizontal";
  onReorderItems?: (keys: string[]) => void;
}

/*
const applyDrag = (arr: any, dragResult: any) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};
*/

export const debounce = (fn: Function, delay: number, immediate?: boolean) => {
  let timer: any = null;
  return (...params: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate && !timer) {
      fn.call(null, ...params);
    } else {
      timer = setTimeout(() => {
        timer = null;
        fn.call(null, ...params);
      }, delay);
    }
  };
};

export const Container: React.FC<IContainerProps> = ({
  orientation,
  onReorderItems,
  children
}) => {
  const positions = React.useRef<Position[]>([]).current;
  const setPosition = (i: number, offset: Position) => (positions[i] = offset);

  //const [draggedTargetIndex, setDraggedTargetIndex] = React.useState(undefined);
  //const [draggedIndex, setDraggedIndex] = React.useState(undefined);
  const [indexes, setIndexes] = React.useState(
    React.Children.toArray(children)
  );
  React.useEffect(() => setIndexes(React.Children.toArray(children)), [
    children
  ]);
  // todo add a useEffect if children change

  const lastOffset = React.useRef<number>();

  const moveItem = (i: number, dragOffset: number) => {
    if (lastOffset.current === dragOffset) return;
    lastOffset.current = dragOffset;
    const targetIndex = findIndex(i, dragOffset, positions);
    //console.log("moving item", dragOffset);
    // setDraggedIndex(i);
    // setDraggedTargetIndex(targetIndex);
    if (targetIndex !== i) {
      // setColors(move(colors, i, targetIndex)
      // we should not re-order until the next re-render has occurred
      //needRender.current = true;
      setIndexes(move(indexes, i, targetIndex));
    }
  };

  function dragEnd() {
    const orderedKeys = React.Children.map(indexes, (child, index) => {
      if (React.isValidElement(child)) {
        return child.props.itemId;
      }
      return false;
    }).filter(Boolean);
    console.log(orderedKeys);

    onReorderItems?.(orderedKeys);
  }

  return (
    <AnimateSharedLayout>
      <div
        style={{
          display: "flex",
          flexDirection: orientation === "horizontal" ? "row" : "column"
        }}
      >
        {JSON.stringify(positions)}
        {React.Children.map(indexes, (child, index) => {
          /*if (index === draggedIndex) {
          return <></>;
        }*/
          if (React.isValidElement(child)) {
            //child.type ==
            return React.cloneElement(child, {
              moveItem: moveItem,
              dragIndex: index,
              dragEnd,
              setPosition
            });
          }

          return child;
        })}
      </div>
    </AnimateSharedLayout>
  );
};
