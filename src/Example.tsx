import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { findIndex, Position } from "./find-index";
import move from "array-move";
import { Container } from "./Container";
import { Draggable } from "./Draggable";

const Item = ({ color, setPosition, moveItem, i }) => {
  const [isDragging, setDragging] = useState(false);

  // We'll use a `ref` to access the DOM element that the `motion.li` produces.
  // This will allow us to measure its height and position, which will be useful to
  // decide when a dragging element should switch places with its siblings.
  const ref = useRef(null);

  // By manually creating a reference to `dragOriginY` we can manipulate this value
  // if the user is dragging this DOM element while the drag gesture is active to
  // compensate for any movement as the items are re-positioned.
  const dragOriginY = useMotionValue(0);

  // Update the measured position of the item so we can calculate when we should rearrange.
  useEffect(() => {
    setPosition(i, {
      height: ref.current.offsetHeight,
      top: ref.current.offsetTop
    });
  });

  return (
    <motion.div
      ref={ref}
      initial={false}
      // If we're dragging, we want to set the zIndex of that item to be on top of the other items.
      animate={isDragging ? onTop : flat}
      style={{ background: color, height: heights[color] }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 1.12 }}
      drag="y"
      dragOriginY={dragOriginY}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={1}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onDrag={(e, { point }) => moveItem(i, point.y)}
      positionTransition={({ delta }) => {
        if (isDragging) {
          // If we're dragging, we want to "undo" the items movement within the list
          // by manipulating its dragOriginY. This will keep the item under the cursor,
          // even though it's jumping around the DOM.
          dragOriginY.set(dragOriginY.get() + delta.y);
        }

        // If `positionTransition` is a function and returns `false`, it's telling
        // Motion not to animate from its old position into its new one. If we're
        // dragging, we don't want any animation to occur.
        return !isDragging;
      }}
    >
      <ul></ul>
    </motion.div>
  );
};

export const Example = () => {
  const [colors, setColors] = useState(initialColors);

  // We need to collect an array of height and position data for all of this component's
  // `Item` children, so we can later us that in calculations to decide when a dragging
  // `Item` should swap places with its siblings.
  const positions = useRef<Position[]>([]).current;
  const setPosition = (i: number, offset: Position) => (positions[i] = offset);

  // Find the ideal index for a dragging item based on its position in the array, and its
  // current drag offset. If it's different to its current index, we swap this item with that
  // sibling.
  const moveItem = (i: number, dragOffset: number) => {
    const targetIndex = findIndex(i, dragOffset, positions);
    if (targetIndex !== i) setColors(move(colors, i, targetIndex));
  };
  const stuckColours = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF"];
  const stuckColours2 = ["red", "green", "blue", "#7700FF"];

  const [columnA, setColumnA] = React.useState([
    {
      colour: stuckColours[0],
      height: 50,
      key: "keya"
    },
    {
      colour: stuckColours[1],
      height: 78,
      key: "b"
    },
    {
      colour: stuckColours[2],
      height: 40,
      key: "c"
    },
    {
      colour: stuckColours[3],
      height: 150,
      key: "d"
    }
  ]);

  function reorderStuff(keys: string[]) {
    setColumnA(
      keys.map((k) => {
        return columnA.find((f) => f.key === k);
      })
    );
  }

  return (
    <>
      {" "}
      columnA:
      {JSON.stringify(columnA)}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 300px",
          columnGap: 30
        }}
      >
        <Container onReorderItems={reorderStuff}>
          {columnA.map((c, i) => {
            return (
              <Draggable key={c.key} itemId={c.key}>
                <div
                  style={{
                    width: 300,
                    height: c.height,
                    backgroundColor: c.colour
                  }}
                />
              </Draggable>
            );
          })}
          {/*<Draggable>
            <div
              style={{
                width: 300,
                height: 45,
                backgroundColor: stuckColours[0]
              }}
            >
              hello
            </div>
          </Draggable>
          <Draggable>
            <div
              style={{
                width: 300,
                height: 77,
                backgroundColor: stuckColours[1]
              }}
            >
              hello 2
            </div>
          </Draggable>
          <Draggable>
            <div
              style={{
                width: 300,
                height: 32,
                backgroundColor: stuckColours[2]
              }}
            >
              hello 2
            </div>
            </Draggable>*/}
        </Container>
        {/*         
        <Container>
          <Draggable>
            <div
              style={{
                width: 300,
                height: 45,
                backgroundColor: stuckColours2[0]
              }}
            >
              hello
            </div>
          </Draggable>
          <Draggable>
            <div
              style={{
                width: 300,
                height: 77,
                backgroundColor: stuckColours2[1]
              }}
            >
              hello 2
            </div>
          </Draggable>
          <Draggable>
            <div
              style={{
                width: 300,
                height: 105,
                backgroundColor: stuckColours2[3]
              }}
            >
              hello 2
            </div>
          </Draggable>
          <Draggable>
            <div
              style={{
                width: 300,
                height: 32,
                backgroundColor: stuckColours2[2]
              }}
            >
              hello 2
            </div>
          </Draggable>
        </Container> */}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* <div>
        {colors.map((color, i) => (
          <Item
            key={color}
            i={i}
            color={color}
            setPosition={setPosition}
            moveItem={moveItem}
          />
        ))}
      </div> */}
    </>
  );
};

// Spring configs
const onTop = { zIndex: 1 };
const flat = {
  zIndex: 0,
  transition: { delay: 0.3 }
};

const initialColors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF"];
const heights = {
  "#FF008C": 60,
  "#D309E1": 80,
  "#9C1AFF": 40,
  "#7700FF": 100
};
