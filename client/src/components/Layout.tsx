import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Header from "./Header";
import PlantPreloader from "./Preloader";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <PlantPreloader />
      <TopBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
