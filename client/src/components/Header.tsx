import { PrimaryBtn, WhatsappBtn } from "./Btns";
import CartIcon from "@mui/icons-material/ShoppingCartOutlined";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useState } from "react";
import Menu from "./Menu";
import NavBar from "./NavBar";
import { useSelector } from "react-redux";
import { useWhatsAppSettings } from "./useWhatsAppSettings";

const Header = () => {
  const [isMenu, setIsMenu] = useState<boolean>(false);
  const { whatsappLink } = useWhatsAppSettings();
  const cartCounter = useSelector(
    (state: { cart: { value: unknown[] } }) => state.cart.value.length,
  );

  const openMenu = () => {
    setIsMenu(true);
  };

  const closeMenu = () => {
    setIsMenu(false);
  };

  return (
    <header className="h-auto sticky z-90 top-0 border-b-2 border-border bg-cream">
      <div className="container flex items-center py-3">
        <div className="logo flex-1">
          <Link to={"/"} className="flex items-center gap-3 mx-2">
            <img
              src="/assets/logo-icon.png"
              alt="Terra Fert Logo Image"
              className="h-18"
            />
            <div className="lg:flex hidden text-soil flex-col items-center">
              <strong className="text-2xl font-extrabold">Terra Fert</strong>
              <span className="label">للتجارة والزراعة</span>
            </div>
          </Link>
        </div>
        <ul className="gap-8 items-center flex-2 text-soil justify-center hidden lg:flex text-center">
          <li className="hover:before:w-full before:h-0.5 before:bg-soil before:absolute before:-bottom-5 relative before:w-0 before:transition-[width] before:duration-300">
            <Link to={"/"}>الرئيسية</Link>
          </li>
          <li className="hover:before:w-full before:h-0.5 before:bg-soil before:absolute before:-bottom-5 relative before:w-0 before:transition-[width] before:duration-300">
            <Link to={"/shop"}>المنتجات</Link>
          </li>
          <li className="hover:before:w-full before:h-0.5 before:bg-soil before:absolute before:-bottom-5 relative before:w-0 before:transition-[width] before:duration-300">
            <Link to={"/tests"}>التجارب الحقلية</Link>
          </li>
          <li className="hover:before:w-full before:h-0.5 before:bg-soil before:absolute before:-bottom-5 relative before:w-0 before:transition-[width] before:duration-300">
            <Link to={"/how"}>كيف تطلب</Link>
          </li>
          <li className="hover:before:w-full before:h-0.5 before:bg-soil before:absolute before:-bottom-5 relative before:w-0 before:transition-[width] before:duration-300">
            <Link to={"/contact"}>تواصل معنا</Link>
          </li>
        </ul>
        <div className="btns flex items-center gap-5 pr-5">
          <div className="hidden lg:block relative">
            <PrimaryBtn
              text="السلة"
              link="/cart"
              icon={<CartIcon fontSize="small" />}
            />
            {cartCounter > 0 && (
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-8 h-8 flex justify-center items-center label rounded-full bg-danger-tint text-danger">
                {cartCounter.toLocaleString("ar-EG")}
              </span>
            )}
          </div>
          <div className="lg:hidden block relative">
            <PrimaryBtn
              text=""
              link="/cart"
              icon={<CartIcon fontSize="small" />}
            />
            {cartCounter > 0 && (
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-8 h-8 flex justify-center items-center label rounded-full bg-danger-tint text-danger">
                {cartCounter.toLocaleString("ar-EG")}
              </span>
            )}
          </div>
          <WhatsappBtn
            text="واتساب"
            link={whatsappLink}
            icon={<ChatIcon fontSize="small" />}
          />
        </div>
        <div
          className="menu-trigger lg:hidden bg-field hover:bg-paper p-3 mr-4 rounded-lg cursor-pointer"
          onClick={openMenu}
        >
          <MenuIcon />
        </div>
      </div>
      <Menu isMenuOpen={isMenu} closeMenu={closeMenu} />
      <NavBar />
    </header>
  );
};

export default Header;
