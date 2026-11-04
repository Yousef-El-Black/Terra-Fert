import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Menu = ({
  isMenuOpen,
  closeMenu,
}: {
  isMenuOpen: boolean;
  closeMenu: () => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isMenuOpen, closeMenu]);

  return (
    <div
      ref={menuRef}
      style={{
        transform: !isMenuOpen ? "translateX(-100vw)" : "translateX(0)",
        transition: "transform 0.8s ease-in-out",
      }}
      className="fixed top-0 left-0 z-100 w-2/3 h-screen bg-white flex flex-col justify-center items-center gap-5 text-soil text-2xl pt-10 overflow-y-scroll py-4"
    >
      <div onClick={closeMenu} className="absolute top-5 left-5 cursor-pointer">
        <CloseIcon fontSize="large" />
      </div>
      <ul className="flex flex-col gap-5 text-center border-border border-b-2 pb-5 label-lg">
        <li>
          <Link to={"/"}>الرئيسية</Link>
        </li>
        <li>
          <Link to={"/shop"}>المنتجات</Link>
        </li>
        <li>
          <Link to={"/tests"}>التجارب الحقلية</Link>
        </li>
        <li>
          <Link to={"/how"}>كيف تطلب</Link>
        </li>
        <li>
          <Link to={"/contact"}>تواصل معنا</Link>
        </li>
      </ul>
      <ul className="flex flex-col gap-5 text-center text-[20px]">
        <caption className="font-bold">اقسامنا</caption>
        <li>
          <Link to={"/shop?cat=مبيدات حشائش"}>مبيدات حشائش</Link>
        </li>
        <li>
          <Link to={"/shop?cat=مبيدات حشرية"}>مبيدات حشرية</Link>
        </li>
        <li>
          <Link to={"/shop?cat=مبيدات فطرية"}>مبيدات فطرية</Link>
        </li>
        <li>
          <Link to={"/shop?cat=مبيدات أكاروسية"}>مبيدات أكاروسية</Link>
        </li>
        <li>
          <Link to={"/shop?cat=مبيدات نيماتودا"}>مبيدات نيماتودا</Link>
        </li>
        <li>
          <Link to={"/shop?cat=منظمات نمو"}>منظمات نمو</Link>
        </li>
        <li>
          <Link to={"/shop?cat=مصائد"}>مصائد</Link>
        </li>
        <li>
          <Link to={"/shop?cat=أسمدة"}>أسمدة</Link>
        </li>
        <li>
          <Link to={"/shop?cat=بذور"}>بذور</Link>
        </li>
        <li>
          <Link to={"/shop?cat=مخصبات"}>مخصبات</Link>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
