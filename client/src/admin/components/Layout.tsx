import { Outlet } from "react-router-dom";
import Header from "./Header";
import MsgsContainer from "./MsgsContainer";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <MsgsContainer />
    </>
  );
};

export default Layout;
