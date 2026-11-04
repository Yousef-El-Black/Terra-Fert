import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-soil">
      <div className="container border-t-2 border-border py-5 flex justify-between items-center">
        <p>&copy; تيرا فيرت للتجارة والزراعة</p>
        <Link to={"/admin"} className="underline">
          إدارة المنتجات
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
