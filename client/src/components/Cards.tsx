import { useEffect, useState } from "react";
import { AvailableBadge, UnavailableBadge } from "./Badges";
import PlantIcon from "@mui/icons-material/Grass";
import { WhatsappOrderBtn, AddToCartBtn } from "./Btns";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import {
  addProduct,
  deleteProduct,
  editAmountOfProduct,
} from "../redux/slices/cartSlice";
import { Link } from "react-router-dom";
import PreviewIcon from "@mui/icons-material/RemoveRedEye";
import PopUp from "../admin/components/PopUp";
import axios from "axios";
import { addMsg } from "../redux/slices/msgSlice";

export const ProductCard = ({ id }: { id: string | number }) => {
  const [product, setProduct] = useState({
    images: [],
    category: "",
    title: "",
    description: "",
  });
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const dispatch = useDispatch();
  const getProduct = async () => {
    try {
      await axios.get(`${serverUrl}/api/products/${id}`).then((res) => {
        setProduct(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  if (!product) return null;

  const addToCart = () => {
    dispatch(addProduct({ id: id, quantity: 1 }));
  };

  return (
    <div className="product-card flex flex-col gap-4 overflow-hidden border-2 border-border rounded-lg bg-paper hover:-translate-y-2">
      <div
        className="img-box flex justify-center items-center text-soil label flex-col cursor-pointer relative"
        style={{
          backgroundColor:
            product.category === "مبيدات حشائش"
              ? "var(--color-tile-1)"
              : product.category === "مبيدات حشرية"
                ? "var(--color-tile-2)"
                : product.category === "مبيدات فطرية"
                  ? "var(--color-tile-3)"
                  : product.category === "مبيدات أكاروسية"
                    ? "var(--color-tile-4)"
                    : product.category === "مبيدات نيماتودا"
                      ? "var(--color-tile-5)"
                      : product.category === "منظمات النمو"
                        ? "var(--color-tile-6)"
                        : product.category === "مصائد"
                          ? "var(--color-tile-7)"
                          : product.category === "أسمدة"
                            ? "var(--color-tile-8)"
                            : product.category === "بذور"
                              ? "var(--color-tile-9)"
                              : product.category === "مخصبات"
                                ? "var(--color-tile-10)"
                                : "var(--color-tile-1)",
        }}
      >
        {product.images ? (
          <img
            src={`${serverUrl}${product.images.length > 0 && product.images[0]}`}
            alt={product.title}
            className="w-full h-full"
          />
        ) : (
          <>
            <PlantIcon className="text-soil" style={{ fontSize: "48px" }} />
            <span className="text-soil label">صورة المنتج</span>
          </>
        )}
        <Link
          to={"/product/" + id}
          className="preview absolute left-0 top-0 hover:bg-[#00000050] w-full h-full flex justify-center items-center text-transparent hover:text-soil"
          target="_blank"
        >
          <PreviewIcon fontSize="large" />
        </Link>
      </div>
      <div className="content-box px-3 py-2 text-soil">
        <AvailableBadge text={product.category} />
        <h4 className="text-xl font-bold py-2">{product.title}</h4>
        <p className="body text-muted py-2">{product.description}</p>
        <div className="btns py-3 flex flex-col items-center justify-center gap-2">
          <AddToCartBtn text="اضف الى السلة" onClick={addToCart} />
          <WhatsappOrderBtn
            text="اطلب عبر الواتساب"
            link="https://wa.me/1234567890"
            icon={<ChatIcon fontSize="small" />}
          />
        </div>
      </div>
    </div>
  );
};

export const CartCard = ({
  id,
  quantity,
}: {
  id: string;
  quantity: number;
}) => {
  const dispatch = useDispatch();
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [amount, setAmount] = useState<number>(quantity);
  const [previousQuantity, setPreviousQuantity] = useState<number>(quantity);
  const [product, setProduct] = useState<{
    _id: string;
    images: string[];
    category: string;
    title: string;
  } | null>(null);

  if (quantity !== previousQuantity) {
    setPreviousQuantity(quantity);
    setAmount(quantity);
  }

  const handlePlus = () => {
    setAmount(amount + 1);
    dispatch(editAmountOfProduct({ id, quantity: amount + 1 }));
  };

  const handleMinus = () => {
    if (amount > 1) {
      setAmount(amount - 1);
      dispatch(editAmountOfProduct({ id, quantity: amount - 1 }));
    }
  };

  const DeleteFromCart = () => {
    dispatch(deleteProduct(id));
  };

  const getProduct = async () => {
    try {
      await axios.get(`${serverUrl}/api/products/${id}`).then((res) => {
        setProduct(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  if (!product) return null;

  const { images, category, title } = product;

  return (
    <div className="cart-card flex flex-col md:flex-row justify-between items-center gap-4 border-2 border-border rounded-lg bg-paper p-3 text-soil">
      <div className="data flex items-center gap-4 text-soil">
        <Link
          to={"/product/" + product._id}
          className="img-box w-20 h-20 rounded-lg flex justify-center items-center overflow-hidden"
          style={{
            backgroundColor:
              category === "مبيدات حشائش"
                ? "var(--color-tile-1)"
                : category === "مبيدات حشرية"
                  ? "var(--color-tile-2)"
                  : category === "مبيدات فطرية"
                    ? "var(--color-tile-3)"
                    : category === "مبيدات أكاروسية"
                      ? "var(--color-tile-4)"
                      : category === "مبيدات نيماتودا"
                        ? "var(--color-tile-5)"
                        : category === "منظمات النمو"
                          ? "var(--color-tile-6)"
                          : category === "مصائد"
                            ? "var(--color-tile-7)"
                            : category === "أسمدة"
                              ? "var(--color-tile-8)"
                              : category === "بذور"
                                ? "var(--color-tile-9)"
                                : category === "مخصبات"
                                  ? "var(--color-tile-10)"
                                  : "var(--color-tile-1)",
          }}
        >
          {images[0] ? (
            <img
              src={serverUrl + images[0]}
              alt={title + " Image"}
              className="bg-cover w-full h-full"
            />
          ) : (
            <PlantIcon className="text-soil" style={{ fontSize: "48px" }} />
          )}
        </Link>
        <div className="text flex flex-col gap-2">
          <h3 className="title font-bold">{title}</h3>
          <span className="body-sm lg:label text-muted">{category}</span>
        </div>
      </div>
      <div className="btns flex gap-3 items-center">
        <div className="amount flex items-center justify-center text-soil-strong font-bold text-2xl">
          <div
            className="plus rounded-r-lg bg-field w-12 h-12 flex justify-center items-center cursor-pointer select-none"
            onClick={handlePlus}
          >
            +
          </div>
          <input
            type="text"
            className="bg-field w-12 h-12 flex justify-center items-center text-center text-soil outline-none ring-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            value={amount.toLocaleString("ar-EG")}
          />
          <div
            className="minus rounded-l-lg bg-field w-12 h-12 flex justify-center items-center cursor-pointer select-none"
            onClick={handleMinus}
          >
            -
          </div>
        </div>
        <div
          className="delete-btn bg-danger-tint text-danger rounded-lg w-12 h-12 flex justify-center items-center select-none cursor-pointer"
          onClick={DeleteFromCart}
        >
          <DeleteIcon />
        </div>
      </div>
    </div>
  );
};

export const AddedProductCard = ({
  product,
}: {
  product: {
    images: string[];
    category: string;
    title: string;
    unit: string;
    id: string | number;
    status: string;
  };
}) => {
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [popUp, setPopUp] = useState<null | {
    text: string;
    action: () => void;
  }>(null);
  const dispatch = useDispatch();

  const deleteProduct = async (id: string | number) => {
    try {
      await axios
        .delete(`${serverUrl}/api/products/${id}`)
        .then(() => {
          const date = Date.now();
          dispatch(
            addMsg({ text: `تم حذف المنتج بنجاح`, type: "success", id: date }),
          );
        })
        .then(() => {
          document.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="product-card w-full flex flex-col lg:flex-row gap-5 justify-between items-center p-3 bg-paper rounded-lg border-2 border-border my-1">
      <div className="right flex items-center gap-5 lg:gap-3">
        <div className="img-box w-20 h-20 overflow-hidden rounded-lg">
          <img
            src={serverUrl + product.images[0]}
            alt={product.title + "Image"}
          />
        </div>
        <div className="text-soil flex flex-col gap-2">
          <h3 className="title">{product.title}</h3>
          <div className="category-unit text-muted label">
            {product.category} - {product.unit}
          </div>
        </div>
      </div>
      <div className="left flex gap-4 items-center">
        <div className="availablity">
          {product.status == "متوفر" ? (
            <AvailableBadge text="متوفر" />
          ) : (
            <UnavailableBadge text="غير متوفر" />
          )}
        </div>
        {/* FIXME: Add Link for Edit Products */}
        <Link
          to={"/admin/products/edit/" + product.id}
          className="flex-1 border-border border-2 px-5 py-3 rounded-lg font-bold cursor-pointer bg-field hover:bg-paper text-soil"
          reloadDocument
        >
          تعديل
        </Link>
        <button
          className="flex-1 border-border border-2 px-5 py-3 rounded-lg font-bold cursor-pointer hover:bg-danger-tint bg-field text-danger"
          onClick={() =>
            setPopUp({
              text: "هل تريد حذف المنتج نهائياً ؟",
              action: () => deleteProduct(product.id),
            })
          }
        >
          حذف
        </button>
        {popUp && (
          <PopUp
            text={popUp.text}
            onClose={() => setPopUp(null)}
            onConfirm={() => {
              popUp.action();
            }}
          />
        )}
      </div>
    </div>
  );
};
