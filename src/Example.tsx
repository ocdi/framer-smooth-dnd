import * as React from "react";

import { Container } from "./Container";
import { Draggable } from "./Draggable";
import { SharedDragContainer } from "./SharedDragContainer";

export const Example = () => {
  const stuckColours = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF"];

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
  const [columnB, setColumnB] = React.useState([]);

  function reorderStuff(keys: string[]) {
    console.log("reordering", keys);
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
        <SharedDragContainer>
          <Container onReorderItems={reorderStuff} containerId="col1">
            {columnA.map((c, i) => {
              return (
                <Draggable key={c.key} itemId={c.key}>
                  <div
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 5,
                      height: c.height,
                      backgroundColor: c.colour
                    }}
                  >
                    {c.key}
                  </div>
                </Draggable>
              );
            })}
          </Container>
          <Container containerId="col2">
            {columnB.map((c, i) => {
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
          </Container>
        </SharedDragContainer>

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
