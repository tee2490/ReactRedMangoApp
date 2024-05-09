import { Footer, Header } from "../Components/Layout";
import {
  AccessDenied,
  AuthenticationTest,
  AuthenticationTestAdmin,
  Home,
  Login,
  MenuItemDetails,
  NotFound,
  Register,
  ShoppingCart,
} from "../Pages";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetShoppingCartQuery } from "../Apis/shoppingCartApi";
import { setShoppingCart } from "../Redux/shoppingCartSlice";
import { userModel } from "../Interfaces";
import { jwtDecode } from "jwt-decode";
import { setLoggedInUser } from "../Redux/userAuthSlice";
import { RootState } from "../Storage/Redux/store";

function App() {
  const dispatch = useDispatch();

  const userData = useSelector((state: RootState) => state.userAuthStore);

  const { data, isLoading } = useGetShoppingCartQuery(userData.id);

  useEffect(() => {
    if (!isLoading) {
      console.log(data.result);
      dispatch(setShoppingCart(data.result?.cartItems));
    }
  }, [data]);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, email, role }: userModel = jwtDecode(localToken);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/menuItemDetails/:menuItemId"
            element={<MenuItemDetails />}
          ></Route>
          <Route path="/shoppingCart" element={<ShoppingCart />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/authentication"
            element={<AuthenticationTest />}
          ></Route>
          <Route
            path="/authorization"
            element={<AuthenticationTestAdmin />}
          ></Route>
          <Route path="/accessDenied" element={<AccessDenied />} />
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
