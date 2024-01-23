import { useState } from "react";
import chair from "./assets/Chair.webp"
import "./App.css";

function App() {
  const [itemList, setItemList] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddItem = (event) => {
    event.preventDefault()

    if (inputValue.trim() !== "") {
      let newValue = {}
      if (inputValue.includes("kohler")) newValue={company: "Kohler", url: inputValue}
      setItemList((prevList) => [...prevList, newValue]);
      setInputValue("");
    }
  };

  return (
    <div>
      <img src = {chair} id="chair"></img>
      <h1> Welcome to the URL Collector </h1>
      <form onSubmit={handleAddItem}>
        <div>
          <h2>Item List</h2>
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter item"
            />
            <button type="submit">Add Item</button>
          </div>
        </div>
      </form>
      <ul>
        {itemList.map((item, index) => (
          <li key={index}><a href={item.url}>{item.company}</a></li>
        ))}
      </ul>
    </div>
  );
}

export default App;
