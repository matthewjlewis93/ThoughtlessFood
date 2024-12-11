import { useEffect, useState } from "react";
export default function SearchBar({ itemList, setItemList }) {
  const handleSearch = (value) => {
    if (value === "") return setItemList(itemList);
    let filteredList = [];
    filteredList = itemList.filter((item) =>
      item.name.toLowerCase().startsWith(value.toLowerCase())
    );
    filteredList = filteredList.concat(
      itemList.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) &&
          !item.name.toLowerCase().startsWith(value.toLowerCase())
      )
    );
    setItemList(filteredList);
  };

  return (
      <input
      className="search-bar"
      style={{width:"calc(100% - 4px)",padding:"0",margin:"0px 0px 5px 0px",display:"inline-block"}}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search"
      />
  );
}