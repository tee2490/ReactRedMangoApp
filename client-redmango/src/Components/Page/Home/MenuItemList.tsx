import "./MenuItemList.css";
import { useEffect, useState } from "react";
import { menuItemModel } from "../../../Interfaces";
import MenuItemCard from "./MenuItemCard";
import { useGetMenuItemsQuery } from "../../../Apis/menuItemApi";
import { useDispatch, useSelector } from "react-redux";
import { setMenuItem } from "../../../Redux/menuItemSlice";
import { MainLoader } from "../../../Common";
import { RootState } from "../../../Redux/store";

function MenuItemList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryList, setCategoryList] = useState([""]);
  const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);
  const dispatch = useDispatch();
  const { data, isLoading } = useGetMenuItemsQuery(null);

  const searchValue = useSelector(
    (state: RootState) => state.menuItemStore.search
  );

  useEffect(() => {
    if (data && data.result) {
      const tempMenuArray = handleFilters(searchValue);
      setMenuItems(tempMenuArray);
    }
  }, [searchValue]);

  const handleFilters = (search: string) => {
    let tempMenuItems = [...data.result];

    //search functionality
    if (search) {
      const tempSearchMenuItems = [...tempMenuItems];
      tempMenuItems = tempSearchMenuItems.filter((item: menuItemModel) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
    }

    return tempMenuItems;
  };

  useEffect(() => {
    if (!isLoading) {
      dispatch(setMenuItem(data.result));
      setMenuItems(data.result);

      const tempCategoryList = ["All"];
      data.result.forEach((item: menuItemModel) => {
        if (tempCategoryList.indexOf(item.category) === -1) {
          tempCategoryList.push(item.category);
        }
      });
      setCategoryList(tempCategoryList);
    }
  }, [isLoading]);

  if (isLoading) {
    return <MainLoader />;
  }

  return (
    <div className="container row">
      <div className="my-3">
        <ul className="nav w-100 d-flex justify-content-center">
          {categoryList.map((categoryName, index) => (
            <li className="nav-item" key={index}>
              <button
                className={`nav-link p-0 pb-2 custom-buttons fs-5 ${
                  index === 0 && "active"
                } `}
              >
                {categoryName}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {menuItems.length > 0 &&
        menuItems.map((menuItem: menuItemModel, index: number) => (
          <MenuItemCard menuItem={menuItem} key={index} />
        ))}
    </div>
  );
}

export default MenuItemList;
