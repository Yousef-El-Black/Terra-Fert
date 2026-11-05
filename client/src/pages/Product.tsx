import { Link, useLocation } from "react-router-dom";
import NotFound from "./NotFound";
import PlantIcon from "@mui/icons-material/Grass";
import { useEffect, useState } from "react";
import { AvailableBadge } from "../components/Badges";
import { AddToCartBtn, WhatsappOrderBtn } from "../components/Btns";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateQuantity } from "../redux/slices/cartSlice";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { ProductCard } from "../components/Cards";
import axios from "axios";
import { addMsg } from "../redux/slices/msgSlice";

type ProductData = {
  _id: string;
  category: string;
  title: string;
  description: string;
  images: string[];
  unit: string;
};

const Product = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;

  const [activeImg, setActiveImg] = useState<number>(0);
  const [amount, setAmount] = useState<number>(1);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);

  const getProduct = async () => {
    try {
      await axios
        .get(`${serverUrl}/api/products/${productId}`)
        .then((res) => {
          setProduct(res.data);
        })
        .catch(() => {
          const date = Date.now();
          dispatch(addMsg({ id: date, text: "خطأ بالسيرفر", type: "error" }));
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async () => {
    try {
      await axios
        .get(`${serverUrl}/api/products/`)
        .then((res) => {
          setProducts(res.data);
        })
        .catch(() => {
          const date = Date.now();
          dispatch(addMsg({ id: date, text: "خطأ بالسيرفر", type: "error" }));
        });
    } catch (error) {
      console.log(error);
    }
  };

  const productId =
    location.pathname.split("/")[location.pathname.split("/").length - 1];

  const cart = useSelector(
    (state: { cart: { value: { id: string; quantity: number }[] } }) =>
      state.cart.value,
  );

  const handleChangeImage = (index: number) => {
    setActiveImg(index);
  };

  const handlePlus = () => {
    setAmount(amount + 1);
  };

  const handleMinus = () => {
    if (amount > 1) setAmount(amount - 1);
  };

  const addToCart = () => {
    if (!product) return;

    if (cart.filter((item) => item.id === productId).length > 0) {
      dispatch(updateQuantity({ id: product._id, quantity: amount }));
    } else {
      dispatch(addProduct({ id: product._id, quantity: amount }));
    }
  };

  useEffect(() => {
    getProduct();
    getProducts();
  }, []);

  if (!product) {
    return <NotFound />;
  }

  return (
    <section>
      <div className="container py-10">
        <div className="tree flex gap-2 text-soil pb-4">
          <Link className="underline" to="/">
            الرئيسية
          </Link>
          <span>/</span>
          <Link className="underline" to="/shop">
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-bold">{product.title}</span>
        </div>
        <div className="content flex flex-col lg:flex-row gap-5">
          <div className="image flex-1">
            <div className="main-image w-full flex justify-center items-center flex-col gap-4 bg-tile-1 rounded-lg aspect-square overflow-hidden">
              {product.images ? (
                <img
                  src={serverUrl + product.images[activeImg]}
                  alt={product.title + " Image"}
                  className="h-full aspect-square"
                />
              ) : (
                <>
                  <PlantIcon
                    className="text-soil"
                    style={{ fontSize: "48px" }}
                  />
                  <span className="text-soil label">
                    الصورة الرئيسية للمنتج
                  </span>
                </>
              )}
            </div>
            <div className="images flex gap-4 py-3">
              {product.images.map((img: string, index: number) => {
                return (
                  <div
                    key={index}
                    className="w-1/4 aspect-square overflow-hidden rounded-lg cursor-pointer duration-300"
                    style={{
                      backgroundColor: `var(--color-tile-${index + 1})`,
                      borderColor:
                        activeImg === index ? "var(--color-soil)" : "",
                      borderWidth: activeImg === index ? "1px" : "  ",
                    }}
                    onClick={() => handleChangeImage(index)}
                  >
                    <img
                      src={serverUrl + img}
                      alt={product.title + "Image-" + index}
                      className="bg-cover w-full h-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text flex-1 flex-col gap-5 flex">
            <div className="tag py-3 flex justify-center lg:justify-start items-center">
              <AvailableBadge text={product.category} />
            </div>
            <h2 className="title display text-soil py-3 text-center lg:text-start">
              {product.title}
            </h2>
            <p className="desc text-muted label text-center lg:text-start">
              وصف المنتج : {product.description}
            </p>
            <div className="amount flex-col flex justify-center items-center lg:items-start">
              <label className="text-soil price-lg py-3 block">الكمية</label>
              <div className="btns flex gap-3 items-center">
                <div className="amount flex items-center justify-center text-soil-strong font-bold text-2xl">
                  <div
                    className="plus rounded-r-lg bg-field w-20 lg:w-12 h-20 lg:h-12 flex justify-center items-center cursor-pointer select-none"
                    onClick={handlePlus}
                  >
                    +
                  </div>
                  <input
                    type="text"
                    className="bg-field w-20 lg:w-12 h-20 lg:h-12 flex justify-center items-center text-center text-soil outline-none ring-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={amount.toLocaleString("ar-EG")}
                  />
                  <div
                    className="minus rounded-l-lg bg-field w-20 lg:w-12 h-20 lg:h-12 flex justify-center items-center cursor-pointer select-none"
                    onClick={handleMinus}
                  >
                    -
                  </div>
                </div>
              </div>
            </div>
            <div className="btns flex-col gap-4 flex">
              <WhatsappOrderBtn
                text="اطلب الآن عبر الواتساب"
                link="/"
                icon={<ChatIcon fontSize="small" />}
              />
              <AddToCartBtn text="أضف الى السلة" onClick={addToCart} />
            </div>
            <ul className="details">
              <li className="flex gap-5 border-b-2 border-border-strong py-4">
                <span className="text-muted w-20">القسم</span>
                <span className="text-soil font-semibold">
                  {product.category ? product.category : "غير معروف"}
                </span>
              </li>
              <li className="flex gap-5 border-b-2 border-border-strong py-4">
                <span className="text-muted w-20">وحدة البيع</span>
                <span className="text-soil font-semibold">
                  {product.unit ? product.unit : "غير معروف"}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="other-products py-5">
          <h2 className="text-center lg:text-start text-soil">منتجات مشابهة</h2>
          <div className="products-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-5">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product._id} id={product._id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
