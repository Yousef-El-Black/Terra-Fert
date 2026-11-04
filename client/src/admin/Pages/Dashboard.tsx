import { Link } from "react-router-dom";
import GrassIcon from "@mui/icons-material/GrassOutlined";
import TestIcon from "@mui/icons-material/AnalyticsOutlined";
import SocialMediaIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";

const Dashboard = () => {
  return (
    <section>
      <div className="container py-10">
        <ul className="grid grid-cols-1 lg:grid-cols-2  gap-8">
          <li className="bg-tile-1 rounded-lg overflow-hidden">
            <Link
              className="cursor-pointer text-soil font-bold text-2xl h-60 flex justify-center items-center flex-col gap-5"
              to={"/admin/products"}
            >
              <GrassIcon fontSize="large" />
              ادارة المنتجات
            </Link>
          </li>
          <li className="bg-tile-2 rounded-lg overflow-hidden">
            <Link
              className="cursor-pointer text-soil font-bold text-2xl h-60 flex justify-center items-center flex-col gap-5"
              to={"/admin/tests"}
            >
              <TestIcon fontSize="large" />
              ادارة التجارب الحقلية
            </Link>
          </li>
          <li className="bg-tile-3 rounded-lg overflow-hidden">
            <Link
              className="cursor-pointer text-soil font-bold text-2xl h-60 flex justify-center items-center flex-col gap-5"
              to={"/admin/social"}
            >
              <SocialMediaIcon fontSize="large" />
              ادارة وسائل التواصل
            </Link>
          </li>
          <li className="bg-tile-5 rounded-lg overflow-hidden">
            <Link
              className="cursor-pointer text-soil font-bold text-2xl h-60 flex justify-center items-center flex-col gap-5"
              to={"/admin/settings"}
            >
              <SettingsIcon fontSize="large" />
              الاعدادات
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Dashboard;
