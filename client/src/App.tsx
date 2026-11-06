import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import Shop from "./pages/Shop";
import HowToOrder from "./pages/HowToOrder";
import ContactUs from "./pages/ContactUs";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Login from "./admin/Pages/Login";
import AdminLayout from "./admin/components/Layout";
import AddProduct from "./admin/Pages/AddProduct";
import Dashboard from "./admin/Pages/Dashboard";
import ProductsManagement from "./admin/Pages/ProductsManagement";
import EditProduct from "./admin/Pages/EditProduct";
import TestsManagement from "./admin/Pages/TestsManagement";
import AddTest from "./admin/Pages/AddTest";
import EditTest from "./admin/Pages/EditTest";
import Settings from "./admin/Pages/Settings";
import AdminAuthGuard from "./admin/components/AdminAuthGuard";
import AdminWelcome from "./admin/Pages/AdminWelcome";
import SocialMediaManagement from "./admin/Pages/SocialMediaManagement";
import { WhatsAppSettingsProvider } from "./components/WhatsAppSettings";
import Tests from "./pages/Tests";
import TestDetails from "./pages/TestDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/shop", element: <Shop /> },
      { path: "/how", element: <HowToOrder /> },
      { path: "/contact", element: <ContactUs /> },
      { path: "/cart", element: <Cart /> },
      { path: "/product/:id", element: <Product /> },
      { path: "/tests", element: <Tests /> },
      { path: "/tests/:id", element: <TestDetails /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminAuthGuard>
        <AdminLayout />
      </AdminAuthGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "products/add", element: <AddProduct /> },
      { path: "products/edit/:id", element: <EditProduct /> },
      { path: "products", element: <ProductsManagement /> },
      { path: "tests/add", element: <AddTest /> },
      { path: "tests/edit/:id", element: <EditTest /> },
      { path: "tests", element: <TestsManagement /> },
      { path: "settings", element: <Settings /> },
      { path: "social", element: <SocialMediaManagement /> },
    ],
  },
  {
    path: "/admin/welcome",
    element: <AdminWelcome />,
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <>
      <WhatsAppSettingsProvider>
        <RouterProvider router={router} />
      </WhatsAppSettingsProvider>
    </>
  );
}

export default App;
