import * as React from "react";
import { Position } from "./Common";
// import { clamp, distance } from "@popmotion/popcorn";
import { findIndex } from "./find-index";
import move from "array-move";
import { AnimateSharedLayout } from "framer-motion";
import { useSharedDragContext } from "./SharedDragContainer";

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
  containerId: string;
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

export const Container: React.FC<IContainerProps> = ({
  orientation,
  onReorderItems,
  containerId,
  children
}) => {
  const { draggingItem } = useSharedDragContext();

  const positions = React.useRef<Position[]>([]).current;
  const setPosition = (i: number, offset: Position) => (positions[i] = offset);

  const [indexes, setIndexes] = React.useState(
    React.Children.toArray(children)
  );
  React.useEffect(() => {
    setIndexes(React.Children.toArray(children));
    console.log("children changed");
  }, [children]);
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

  function dragStartItem(item) {
    console.log("drag start, item", item, containerId);

    let stolen = false;

    function steal() {
      if (stolen) {
        console.log("already stolen");
        return;
      }

      stolen = true;
      const index = indexes.indexOf(item);
      console.log("item being stolen", containerId, index);
      if (index >= 0) {
        indexes.splice(index, 1);
        setIndexes(indexes);
        positions.splice(index, 1);
      }
    }

    draggingItem.current = { item, containerId, steal };
  }

  function dragStart(index: number) {
    const item = indexes[index];
    dragStartItem(item);
  }

  function dragEnd() {
    draggingItem.current = undefined;
    const orderedKeys = React.Children.map(indexes, (child, index) => {
      if (React.isValidElement(child)) {
        return child.props.itemId;
      }
      return false;
    }).filter(Boolean);
    console.log(orderedKeys);

    // onReorderItems?.(orderedKeys);
  }

  function mouseOver() {
    if (
      draggingItem.current &&
      draggingItem.current.containerId !== containerId
    ) {
      console.log(
        "we have an item from column ",
        draggingItem.current.containerId,
        "and we are",
        containerId
      );
      draggingItem.current.steal();

      const item = draggingItem.current.item;
      const newIndexes = [...indexes, item];
      dragStartItem(item);
      setIndexes(newIndexes);
    } else {
      console.log("we are not dragging", containerId);
    }
  }

  console.log("rendering", containerId, indexes);
  return (
    <div
      style={{
        display: "flex",
        minWidth: "300px",
        background: "green",
        padding: 10,
        borderRadius: 5,
        flexDirection: orientation === "horizontal" ? "row" : "column"
      }}
      onMouseEnter={mouseOver}
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
            dragStart,
            setPosition
          });
        }

        return child;
      })}
    </div>
  );
};
