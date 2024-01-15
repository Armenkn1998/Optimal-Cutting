import React, { useEffect, useState } from "react";
import "./Board.css";
const Board = ({ cuts, cut, setCut, item, setItem, count, setCount }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    updateBoard();
  }, [cuts]);

  const updateBoard = () => {
    try {
      calculateScraps(cuts[count]);
      if (cuts.length) {
        setCount(count + 1);
      }
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const [boards, setBoards] = useState({
    width: 1830,
    height: 3630,
    x: 0,
    y: 0,
  });

  let currentX = 0;
  let currentY = 0;
  async function optim(obj, cuts) {
    let arr3 = [];
    cuts.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(
      16
    )}`;
    for (let k = 0; k < cuts.quantity; k++) {
      if (cuts.height * [k + 1] > 3630) {
        currentX += cuts.width;
        if (currentX + obj.x * 2 >= 1830) {
          alert("error");
          break;
        }
      }
      if (k > 0 && cuts.height * [k + 1] < 3630) {
        currentY += cuts.height;
      }
      if (currentX > 0) {
        let newobj = { ...cuts };
        newobj.x = obj.x + currentX;
        newobj.y = obj.y + currentY;

        arr3.push(newobj);

        let obj1 = {
          width: obj.width - newobj.width * [k + 1],
          height: obj.height,
          x: obj.x + cuts.width * [k + 1],
          y: obj.y,
          active: false,
        };
        let obj2 = {
          width: cuts.width * [k + 1],
          height: 3630 - cuts.height,
          x: obj.x,
          y: obj.y + cuts.height * [k + 1],
          active: false,
        };
        let newObj = item?.filter((el) => {
          if (el.x !== obj.x && el.y !== obj.y) {
            return el;
          }
        });
        let x = [...newObj, obj1, obj2];
        setUp(x);
      } else if (currentY > 0) {
        let newobj = { ...cuts };
        newobj.x = obj.x + currentX;
        newobj.y = obj.y + currentY;

        arr3.push(newobj);

        let obj1 = {
          width: obj.width - cuts.width,
          height: obj.height,
          x: obj.x + cuts.width,
          y: obj.y,
          active: false,
        };
        let obj2 = {
          width: cuts.width,
          height: 3630 - cuts.height * [k + 1],
          x: obj.x,
          y: obj.y + cuts.height * [k + 1],
          active: false,
        };
        let newObj = item?.filter((el) => {
          if (el.x !== obj.x && el.y !== obj.y) {
            return el;
          }
        });
        let x = [...newObj, obj1, obj2];
        setUp(x);
      } else {
        cuts.x = obj.x;
        cuts.y = obj.y;

        arr3.push(cuts);

        let obj1 = {
          width: obj.width - cuts.width,
          height: obj.height,
          x: obj.x + cuts.width,
          y: obj.y,
          active: false,
        };
        let obj2 = {
          width: cuts.width,
          height: obj.height - cuts.height,
          x: obj.x,
          y: obj.y + cuts.height,
          active: false,
        };
        let newObj = item?.filter((el) => {
          if (el.x !== obj.x && el.y !== obj.y) {
            return el;
          }
        });
        let x = [...newObj, obj1, obj2];

        setUp(x);
      }
    }
    let y = [...cut, ...arr3];
    setCut(y);
  }

  useEffect(() => {
    if (cuts.length > 1 && count !== cuts.length && count !== 0) {
      setCount(count + 1);
      calculateScraps(cuts[count]);
    }
  }, [item.length]);

  function setUp(x) {
    let arr = [];

    let newitem = x.sort((a, b) => a.height - b.height);
    for (let i = 0; i < newitem.length; i++) {
      if (
        newitem[i].y === newitem[i + 1]?.y &&
        newitem[i].height === newitem[i + 1]?.height &&
        !newitem[i].active &&
        !newitem[i + 1]?.active
      ) {
        let newobj = {
          width: newitem[i].width + newitem[i + 1]?.width,
          height: newitem[i + 1]?.height,
          y: newitem[i].y,
          x: newitem[i].x,
          active: false,
        };
        i++;
        arr.push(newobj);
      } else {
        arr.push(newitem[i]);
      }
    }
    setItem(arr);
  }

  function calculateScraps(el) {
    let obj = {
      width: el?.width,
      height: el?.height,
      quantity: el?.quantity,
    };

    if (item.length > 0) {
      let x = item.sort((a, b) => a.width - b.width);

      for (let i = 0; i < x.length; i++) {
        if (x[i].width >= obj.width && x[i].height >= obj.height) {
          optim(x[i], obj);
          break;
        } else if (obj.width <= 1830) {
          let arr1 = [
            {
              width: obj.width,
              height: obj.height,
              x: 0,
              y: 0,
              active: true,
              quantity: obj.quantity,
              backgroundColor: `#${Math.floor(Math.random() * 167772).toString(
                16
              )}`,
            },
          ];
          let arr2 = [];
          let obj1 = {
            width: 1830 - obj.width,
            height: obj.height,
            x: obj.width,
            y: 0,
            active: false,
          };
          item.map((el) => {
            let newobj = {
              width: el.width,
              height: el.height - obj.height,
              x: el.x,
              y: el.y + obj.height,
              active: true,
            };
            arr2.push(newobj);
          });

          setItem([...arr2, obj1]);
          cut.map((el) => {
            let newobj = {
              width: el.width,
              height: el.height,
              x: el.x,
              y: el.y + obj.height,
              backgroundColor: el.backgroundColor,
              active: true,
              quantity: el.quantity,
            };
            arr1.push(newobj);
          });
          setCut(arr1);
        } else if (x[x.length - 1].y + obj.height > 3630) {
          optim(x[i], obj);
        }
      }
    } else if (obj.width <= boards.width && obj.height <= boards.height) {
      optim(boards, obj);
    } else if (obj.width !== undefined || obj.height !== undefined) {
      alert("error, max-width-1830,max-height-3630");
    }
  }

  return (
    <div
      id="board"
      style={{
        display: "flex",
        width: "1830px",
        height: "3630px",
        border: "1px dashed #000",
        position: "relative",
      }}
    >
      {cut.length > 0 &&
        cut.map((scrap, index) => (
          <div
            key={`scrap-${index}`}
            style={{
              border: "1px dashed #000",
              position: "absolute",
              backgroundColor: scrap.backgroundColor,
              width: `${scrap?.width}px`,
              height: `${scrap?.height}px`,
              left: `${scrap?.x}px`,
              top: `${scrap?.y}px`,
            }}
          >
            <p>
              {scrap?.height} / {scrap?.width}
            </p>
          </div>
        ))}

      {errorMessage && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <p style={{ color: "red" }}>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Board;
