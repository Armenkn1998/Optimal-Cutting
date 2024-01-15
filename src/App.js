import React, { useEffect, useState } from "react";
import "./index.css";
import Board from "./Board";

const App = () => {
  const [cuts, setCuts] = useState([]);
  const [formData, setFormData] = useState({
    height: "",
    width: "",
    quantity: "",
  });
  const [cut, setCut] = useState([]);
  const [box, setBox] = useState([]);
  const [item, setItem] = useState([]);
  const [count, setCount] = useState(0);
  const addData = () => {
    const { height, width, quantity } = formData;

    if (
      height &&
      width &&
      quantity &&
      height > 0 &&
      width > 0 &&
      quantity > 0
    ) {
      setCuts([
        ...cuts,
        {
          height: parseInt(height),
          width: parseInt(width),
          quantity: parseInt(quantity),
        },
      ]);
      setFormData({ height: "", width: "", quantity: "" });
    } else {
      alert("Please enter valid dimensions and quantity.");
    }
  };

  const editCut = (items) => {
    setFormData({
      height: items.height,
      width: items.width,
      quantity: items.quantity,
    });

    setCount(0);
    let newItem = box.filter(
      (el) => el.width !== items.width || el.height !== items.height
    );
    setCut([]);
    setItem([]);
    setBox(newItem);
    let arr = [];
    for (let i = 0; i < newItem.length; i++) {
      let newObj = { ...newItem[i] };
      delete newObj.x;
      delete newObj.y;
      arr.push(newObj);
    }
    setCuts(arr);
  };

  const deleteCut = async (items) => {
    let newItem = box.filter(
      (el) => el.width !== items.width || el.height !== items.height
    );
    setCut([]);
    setItem([]);
    setBox(newItem);
    setCount(0);
    let arr = [];

    for (let i = 0; i < newItem.length; i++) {
      let newObj = { ...newItem[i] };
      delete newObj.x;
      delete newObj.y;
      arr.push(newObj);
    }

    setCuts(arr);
  };

  useEffect(() => {
    let filteredArray = cut?.reduce((uniqueArray, currentItem) => {
      if (
        !uniqueArray.some(
          (item) =>
            item.width === currentItem.width &&
            item.height === currentItem.height
        )
      ) {
        uniqueArray.push(currentItem);
      }
      return uniqueArray;
    }, []);
    setBox(filteredArray);
    // setItem([])
  }, [cut]);

  return (
    <div className="container">
      <h1>Optimal Cutting Program</h1>

      <div id="data-entry">
        <div>
          <label htmlFor="height">Height:</label>
          <input
            type="number"
            id="height"
            min={1}
            value={formData.height}
            onChange={(e) =>
              setFormData({ ...formData, height: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="width">Width:</label>
          <input
            type="number"
            id="width"
            min={1}
            value={formData.width}
            onChange={(e) =>
              setFormData({ ...formData, width: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min={1}
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
          />
        </div>
        <button onClick={addData}>Add</button>
      </div>

      <table id="cutting-table">
        <thead>
          <tr>
            <th>Height</th>
            <th>Width</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {box.length > 0 &&
            box.map((cut, index) => (
              <tr key={index}>
                <td>{cut?.height}</td>
                <td>{cut?.width}</td>
                <td>{cut?.quantity}</td>
                <td>
                  <button onClick={() => editCut(cut)}>Edit</button>
                  <button onClick={() => deleteCut(cut)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="board">
        <Board
          cuts={cuts}
          cut={cut}
          setCut={setCut}
          item={item}
          setItem={setItem}
          count={count}
          setCount={setCount}
        />
      </div>
    </div>
  );
};

export default App;
