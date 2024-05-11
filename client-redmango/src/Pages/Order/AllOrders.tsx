import { withAdminAuth } from "../../HOC";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import OrderList from "../../Components/Page/Order/OrderList";
import { MainLoader } from "../../Common";
import { SD_Status } from "../../Common/SD";
import { useEffect, useState } from "react";
import { inputHelper } from "../../Helper";
import { orderHeaderModel } from "../../Interfaces";

const filterOptions = [
  "All",
  SD_Status.CONFIRMED,
  SD_Status.BEING_COOKED,
  SD_Status.READY_FOR_PICKUP,
  SD_Status.CANCELLED,
];

function AllOrders() {
  const [orderData, setOrderData] = useState([]);
  const { data, isLoading } = useGetAllOrdersQuery("");
  const [filters, setFilters] = useState({ searchString: "", status: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempValue = inputHelper(e, filters);
    setFilters(tempValue);
  };

  const handleFilters = () => {
    const tempData = data.result.filter((orderData: orderHeaderModel) => {
      if (
        (orderData.pickupName &&
          orderData.pickupName.includes(filters.searchString)) ||
        (orderData.pickupEmail &&
          orderData.pickupEmail.includes(filters.searchString)) ||
        (orderData.pickupPhoneNumber &&
          orderData.pickupPhoneNumber.includes(filters.searchString))
      ) {
        return orderData;
      }
    });

    const finalArray = tempData.filter((orderData: orderHeaderModel) =>
      filters.status !== "" ? orderData.status === filters.status : orderData
    );

    setOrderData(finalArray);
  };

  useEffect(() => {
    if (data) {
      setOrderData(data.result);
    }
  }, [data]);

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
            <h1 className="text-success">Orders List</h1>
            <div className="d-flex" style={{ width: "40%" }}>
              <input
                type="text"
                className="form-control mx-2"
                placeholder="Search Name, Email or Phone"
                name="searchString"
                onChange={handleChange}
              />
              <select
                className="form-select w-50 mx-2"
                onChange={handleChange}
                name="status"
              >
                {filterOptions.map((item, index) => (
                  <option key={index} value={item === "All" ? "" : item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                onClick={handleFilters}
                className="btn btn-outline-success"
              >
                Filter
              </button>
            </div>
          </div>

          <OrderList isLoading={isLoading} orderData={orderData} />
        </>
      )}
    </>
  );
}

export default withAdminAuth(AllOrders);
