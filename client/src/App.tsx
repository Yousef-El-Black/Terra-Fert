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
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "products/add", element: <AddProduct /> },
      { path: "products", element: <ProductsManagement /> },
    ],
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
