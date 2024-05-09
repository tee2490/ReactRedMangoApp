import { jwtDecode } from "jwt-decode";
import { SD_Roles } from "../Common/SD";

const withAdminAuth = (WrappedComponent: any) => {
  return (props: any) => {
    console.log("HOC Called");
    
    const accessToken = localStorage.getItem("token") ?? "";

    if (accessToken) {
      const decode: {
        role: string;
      } = jwtDecode(accessToken);

      if (decode.role !== SD_Roles.ADMIN) {
        window.location.replace("/accessDenied");
        return null;
      }
    } else {
      window.location.replace("/login");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
