import { CartCard } from "../components/Cards";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { WhatsappOrderBtn } from "../components/Btns";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useWhatsAppSettings } from "../components/useWhatsAppSettings";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

type CartProduct = { id: string | number; quantity: number };
type CartState = { cart: { value?: CartProduct[] } };
type Product = { _id: string; title: string; status: string };

const Cart = () => {
  const cartProducts = useSelector(
    (state: CartState) => state.cart.value ?? [],
  );
  const { whatsappLink } = useWhatsAppSettings();
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    address: "",
    notes: "",
  });
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [productsLoadError, setProductsLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const { data } = await axios.get<Product[]>(`${serverUrl}/api/products/`);
        if (active) setProducts(data);
      } catch (error) {
        console.error("Failed to load cart product names:", error);
        if (active) setProductsLoadError(true);
      } finally {
        if (active) setProductsLoaded(true);
      }
    };

    void loadProducts();
    return () => {
      active = false;
    };
  }, [serverUrl]);

  const orderMessage = useMemo(() => {
    const productTitles = new Map(
      products.map((product) => [product._id, product.title]),
    );
    const orderLines = cartProducts.map(
      (item) =>
        `- ${productTitles.get(String(item.id)) ?? "منتج"} — الكمية: ${item.quantity}`,
    );

    return [
      "السلام عليكم، أرغب في طلب المنتجات التالية:",
      ...orderLines,
      "",
      `الاسم: ${customer.name || "-"}`,
      `رقم الهاتف: ${customer.mobile || "-"}`,
      `العنوان: ${customer.address || "-"}`,
      ...(customer.notes ? [`ملاحظات: ${customer.notes}`] : []),
    ].join("\n");
  }, [cartProducts, customer, products]);
  const unavailableCartProducts = cartProducts.filter((item) => {
    const product = products.find(
      (candidate) => candidate._id === String(item.id),
    );
    return !product || product.status !== "متوفر";
  });

  return (
    <section className="cart pb-10 bg-cream min-h-[calc(100vh-80px)]">
      <div className="container">
        <div className="head py-8 text-soil">
          <h2 className="py-5 display text-center lg:text-start">سلة الطلب</h2>
          <span className="text-muted label-lg text-center lg:text-start block">
            راجع منتجاتك ثم أرسل الطلب كاملًا في رسالة واتساب واحدة. السعر
            النهائي يُؤكَّد معك في المحادثة.
          </span>
        </div>
        <div className="content flex flex-col lg:flex-row gap-5">
          <div className="products flex-col flex gap-2 flex-2">
            {Array.isArray(cartProducts) && cartProducts.length > 0 ? (
              cartProducts.map((product) => (
                <CartCard
                  key={product.id}
                  id={String(product.id)}
                  quantity={product.quantity}
                />
              ))
            ) : (
              <span className="block text-soil font-bold text-xl text-center">
                لا يوجد منتجات في سلتك
              </span>
            )}
            <Link
              to={"/shop"}
              className="add-more text-leaf underline font-bold py-5"
            >
              + اضف منتجات اخرى
            </Link>
          </div>
          <form
            className="order flex-1 bg-paper border-2 border-border rounded-lg p-5 flex flex-col gap-3 text-soil"
            onSubmit={(event) => event.preventDefault()}
          >
            <h2>بيانات الطلب</h2>
            <div className="name flex-col flex py-2">
              <label htmlFor="name" className="text-soil font-bold pb-2">
                الاسم
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="الاسم الكامل"
                className="text-soil bg-field p-3 rounded-lg border-border-strong outline-none border-2"
                required
                value={customer.name}
                onChange={(event) =>
                  setCustomer((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div className="mobile flex-col flex py-2">
              <label htmlFor="mobile" className="text-soil font-bold pb-2">
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="mobile"
                id="mobile"
                placeholder="رقم الهاتف"
                className="text-soil bg-field p-3 rounded-lg border-border-strong outline-none border-2"
                required
                value={customer.mobile}
                onChange={(event) =>
                  setCustomer((current) => ({
                    ...current,
                    mobile: event.target.value,
                  }))
                }
              />
            </div>
            <div className="address flex-col flex py-2">
              <label htmlFor="address" className="text-soil font-bold pb-2">
                العنوان
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="text-soil bg-field p-3 rounded-lg border-border-strong outline-none border-2"
                placeholder="العنوان الكامل"
                required
                value={customer.address}
                onChange={(event) =>
                  setCustomer((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
              />
            </div>
            <div className="notes flex-col flex py-2">
              <label htmlFor="notes">ملاحظات</label>
              <textarea
                name="notes"
                id="notes"
                placeholder="ملاحظات إضافية"
                className="text-soil bg-field p-3 rounded-lg border-border-strong outline-none border-2"
                value={customer.notes}
                onChange={(event) =>
                  setCustomer((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
              />
            </div>
            {cartProducts.length > 0 &&
              productsLoaded &&
              !productsLoadError &&
              unavailableCartProducts.length === 0 && (
                <WhatsappOrderBtn
                  text="إرسال الطلب عبر الواتساب"
                  icon={<ChatIcon fontSize="small" />}
                  link={whatsappLink}
                  message={orderMessage}
                />
              )}
            {cartProducts.length > 0 &&
              productsLoaded &&
              !productsLoadError &&
              unavailableCartProducts.length > 0 && (
                <p className="text-center text-danger" role="alert">
                  لا يمكن إرسال الطلب: أزل المنتجات غير المتوفرة أو التي لم تعد
                  موجودة في المتجر من السلة أولاً.
                </p>
              )}
            {cartProducts.length > 0 && productsLoadError && (
              <p className="text-center text-danger" role="alert">
                تعذر تحميل أسماء المنتجات لإعداد رسالة الطلب. يرجى تحديث الصفحة
                والمحاولة مرة أخرى.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Cart;
