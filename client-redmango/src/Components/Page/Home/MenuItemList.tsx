import React, { useState, useEffect } from "react";
import { menuItemModel } from "../../../Interfaces";

function MenuItemList() {
  const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);

  useEffect(() => {
    fetch("https://localhost:44305/api/MenuItem")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMenuItems(data.result);
      });
  }, []);

  return <div>MenuItemList</div>;
}

export default MenuItemList;
