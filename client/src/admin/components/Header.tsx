import { Link } from "react-router-dom";
import RightArrowIcon from "@mui/icons-material/ArrowRightAlt";

const Header = () => {
  return (
    <header className="h-auto sticky z-90 top-0 border-b-2 border-border bg-cream">
      <div className="container flex items-center justify-between py-3">
        <div className="logo flex-1">
          <Link to={"/admin"} className="flex items-center gap-3 mx-2">
            <img
              src="/assets/logo-icon.png"
              alt="Terra Fert Logo Image"
              className="h-18"
            />
            <div className="lg:flex hidden text-soil flex-col items-center">
              <strong className="text-2xl font-extrabold">Terra Fert</strong>
              <span className="label">لوحة ادارة المنتجات</span>
            </div>
          </Link>
        </div>
        <div className="gap-8 items-center flex-2 text-soil justify-center hidden lg:flex">
          <Link
            to="/"
            className="border-border border-2 bg-field hover:bg-paper flex justify-center items-center gap-3 text-soil py-3 px-5 font-bold rounded-lg cursor-pointer"
          >
            <RightArrowIcon />
            عرض المتجر
          </Link>
        </div>
        <button className="logout border-border border-2 bg-field flex justify-center items-center gap-3 text-soil py-3 px-5 font-bold rounded-lg cursor-pointer hover:bg-paper">
          تسجيل الخروج
        </button>
      </div>
    </header>
  );
};

export default Header;
