import * as React from "react";
import { motion } from "framer-motion";
import { Position } from "./Common";

export interface IDraggableProps {
  children: any;
  itemId: string;
  moveItem?: (i: number, dragOffset: number) => void;
  dragIndex?: number;
  setPosition?: (dragIndex: number, pos: Position) => void;
  dragStart?: (index: number) => void;
  dragEnd?: () => void;
}

// Spring configs
const onTop = { zIndex: 1 };
const flat = {
  zIndex: 0,
  transition: { delay: 0.3 }
};

type DragState = {
  dragging: boolean;
  offset?: number;
};

type DragActions = "STOP" | { type: "START"; offset: number };
const DRAG_INITIAL_STATE = { dragging: false };

function dragReducer(state: DragState, action: DragActions): DragState {
  if (action === "STOP") {
    return DRAG_INITIAL_STATE;
  }

  return { dragging: true, offset: action.offset };
}

// big todo - handle horizontal dragging
export const Draggable = (props: IDraggableProps) => {
  const ref = React.useRef(null);

  const [{ dragging, offset }, dispatch] = React.useReducer(
    dragReducer,
    DRAG_INITIAL_STATE
  );
  const { setPosition, dragIndex, moveItem } = props;

  // Update the measured position of the item so we can calculate when we should rearrange.
  React.useEffect(() => {
    setPosition(dragIndex, {
      height: ref.current.offsetHeight,
      top: ref.current.offsetTop
    });
  });

  // when the drag index changes the drag offset must be updated to our new position
  React.useEffect(() => {
    if (dragging) dispatch({ type: "START", offset: ref.current.offsetTop });
  }, [dragIndex, dragging]);

  return (
    <motion.div
      initial={false}
      layout
      layoutId={props.itemId}
      drag
      ref={ref}
      onDrag={(e, { point }) => {
        // setPosition(dragIndex, {
        //   height: ref.current.offsetHeight,
        //   top: ref.current.offsetTop
        // });
        //console.log("the y pos", point.y);
        setPosition(dragIndex, {
          height: ref.current.offsetHeight,
          top: point.y
        });
        moveItem(dragIndex, point.y - offset);
      }}
      animate={dragging ? onTop : flat}
      onDragStart={(a, { point }) => {
        props.dragStart?.(dragIndex);
        dispatch({ type: "START", offset: point.y });
      }}
      onDragEnd={() => {
        dispatch("STOP");
        props.dragEnd();
      }}
    >
      {props.children}
      drag index: {props.dragIndex} id: {props.itemId}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 5
        }}
      >
        {ref.current?.offsetTop}
        <span>{ref.current?.offsetHeight}</span>
      </div>
    </motion.div>
  );
};
