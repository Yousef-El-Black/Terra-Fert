import { Link } from "react-router";

const NavBar = () => {
  return (
    <nav className="hidden lg:block border-t-2 border-border-strong">
      <div className="container flex justify-between items-center">
        <ul className="flex justify-between items-center w-full py-3">
          <li className="text-soil hover:text-soil-deep hover:font-bold">
            <Link to={`/shop?cat=مبيدات حشائش`}>مبيدات حشائش</Link>
          </li>
          <li className="text-soil hover:text-soil-deep hover:font-bold">
            <Link to={"/shop?cat=مبيدات حشرية"}>مبيدات حشرية</Link>
          </li>
          <li className="text-soil hover:text-soil-deep hover:font-bold">
            <Link to={"/shop?cat=مبيدات فطرية"}>مبيدات فطرية</Link>
          </li>
          <li className="text-soil hover:text-soil-deep hover:font-bold">
            <Link to={"/shop?cat=مبيدات أكاروسية"}>مبيدات أكاروسية</Link>
          </li>
          <li className="text-soil hover:text-soil-deep hover:font-bold">
            <Link to={"/shop?cat=مبيدات نيماتودا"}>مبيدات نيماتودا</Link>
          </li>
          <li className="text-soil hover:text-soil-deep hover:font-bold">
            <Link to={"/shop?cat=منظمات نمو"}>منظمات نمو</Link>
          </li>
          <li className="text-soil hover:text-soil-deep hover:font-bold">
            <Link to={"/shop?cat=مصائد"}>مصائد</Link>
          </li>
          <li className="text-soil hover:text-soil-deep hover:font-bold">
            <Link to={"/shop?cat=أسمدة"}>أسمدة</Link>
          </li>
          <li className="text-soil hover:text-soil-deep hover:font-bold">
            <Link to={"/shop?cat=بذور"}>بذور</Link>
          </li>
          <li className="text-soil hover:text-soil-deep hover:font-bold">
            <Link to={"/shop?cat=مخصبات"}>مخصبات</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
