import { CartCard } from "../components/Cards";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { WhatsappOrderBtn } from "../components/Btns";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

type CartProduct = { id: string | number; quantity: number };
type CartState = { cart: { value?: CartProduct[] } };

const Cart = () => {
  const cartProducts = useSelector((state: CartState) => state.cart.value);

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
          <form className="order flex-1 bg-paper border-2 border-border rounded-lg p-5 flex flex-col gap-3 text-soil">
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
              />
            </div>
            <div className="mobile flex-col flex py-2">
              <label htmlFor="mobile" className="text-soil font-bold pb-2">
                رقم الهاتف
              </label>
              <input
                type="text"
                name="mobile"
                id="mobile"
                placeholder="رقم الهاتف"
                className="text-soil bg-field p-3 rounded-lg border-border-strong outline-none border-2"
                required
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
              />
            </div>
            <div className="notes flex-col flex py-2">
              <label htmlFor="notes">ملاحظات</label>
              <textarea
                name="notes"
                id="notes"
                placeholder="ملاحظات إضافية"
                className="text-soil bg-field p-3 rounded-lg border-border-strong outline-none border-2"
              />
            </div>
            <WhatsappOrderBtn
              text="إرسال الطلب عبر الواتساب"
              icon={<ChatIcon fontSize="small" />}
              link="/"
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Cart;
