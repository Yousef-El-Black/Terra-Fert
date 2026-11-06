import { WhatsappBtn } from "../components/Btns";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useWhatsAppSettings } from "../components/useWhatsAppSettings";

const HowToOrder = () => {
  const { whatsappLink } = useWhatsAppSettings();

  return (
    <>
      <section className="py-20">
        <div className="container text-soil">
          <h2 className="pb-8 mb-5 display text-center lg:text-center">
            كيف تطلب؟
          </h2>
          <h3 className="pb-3 text-center lg:text-start">الطريقة الأولى</h3>
          <span className="block text-center lg:text-start">
            يفضل عند طلب منتج واحد مباشرة
          </span>
          <div className="steps flex flex-col lg:flex-row justify-around gap-8 py-8 border-b-2 border-border mb-5">
            <div className="step flex flex-col items-center lg:items-start gap-4">
              <div className="step-icon bg-wheat text-soil rounded-full w-16 h-16 flex justify-center items-center text-2xl font-bold">
                {(1).toLocaleString("ar-EG")}
              </div>
              <p className="text-xl font-semibold">اختر المنتج</p>
              <span className="label text-muted block text-center lg:text-start">
                تصفّح الأقسام أو ابحث بالاسم، وحدّد ما تحتاجه.
              </span>
            </div>
            <div className="step flex flex-col items-center lg:items-start gap-4">
              <div className="step-icon bg-wheat text-soil rounded-full w-16 h-16 flex justify-center items-center text-2xl font-bold">
                {(2).toLocaleString("ar-EG")}
              </div>
              <p className="text-xl font-semibold">اضغط «اطلب عبر واتساب»</p>
              <span className="label text-muted block text-center lg:text-start">
                تُفتح محادثة واتساب جاهزة برسالة تحمل اسم المنتج.
              </span>
            </div>
            <div className="step flex flex-col items-center lg:items-start gap-4">
              <div className="step-icon bg-wheat text-soil rounded-full w-16 h-16 flex justify-center items-center text-2xl font-bold">
                {(3).toLocaleString("ar-EG")}
              </div>
              <p className="text-xl font-semibold">أكّد الكمية والاستلام</p>
              <span className="label text-muted block text-center lg:text-start">
                نتفق معك على الكمية والسعر وطريقة الاستلام داخل المحادثة.
              </span>
            </div>
          </div>
          <h3 className="pb-3 text-center lg:text-start">الطريقة الثانية</h3>
          <span className="block text-center lg:text-start">
            يفضل عند طلب أكثر من منتج
          </span>
          <div className="steps flex flex-col lg:flex-row justify-around gap-8 py-8 border-b-2 border-border mb-5">
            <div className="step flex flex-col items-center lg:items-start gap-4 flex-1">
              <div className="step-icon bg-wheat text-soil rounded-full w-16 h-16 flex justify-center items-center text-2xl font-bold">
                {(1).toLocaleString("ar-EG")}
              </div>
              <p className="text-xl font-semibold">اختر المنتجات</p>
              <span className="label text-muted block text-center lg:text-start">
                تصفّح الأقسام أو ابحث بالاسم، وحدّد ما تحتاجه وأضفه الى سلتك.
              </span>
            </div>
            <div className="step flex flex-col items-center lg:items-start gap-4 flex-1">
              <div className="step-icon bg-wheat text-soil rounded-full w-16 h-16 flex justify-center items-center text-2xl font-bold">
                {(2).toLocaleString("ar-EG")}
              </div>
              <p className="text-xl font-semibold">
                ادخل السلة الخاصة بك لتأكيد الطلب
              </p>
              <span className="label text-muted block text-center lg:text-start">
                ادخل السلة الخاصة بك لتأكيد الطلب، ثم اضغط على «اطلب عبر واتساب»
                لتفتح محادثة واتساب جاهزة برسالة تحمل اسم المنتجات وكمياتها.
              </span>
            </div>
            <div className="step flex flex-col items-center lg:items-start gap-4 flex-1">
              <div className="step-icon bg-wheat text-soil rounded-full w-16 h-16 flex justify-center items-center text-2xl font-bold">
                {(3).toLocaleString("ar-EG")}
              </div>
              <p className="text-xl font-semibold">أكّد الكمية والاستلام</p>
              <span className="label text-muted block text-center lg:text-start">
                نتفق معك على الكمية والسعر وطريقة الاستلام داخل المحادثة.
              </span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-5 items-center pt-8">
            <p className="text-2xl text-soil text-center lg:text-start flex-1">
              لو واجهتك أي مشكلة أو صعوبة في عمل الأوردر تواصل معنا على الواتساب
            </p>
            <div className="flex-1 flex justify-center items-center">
              <WhatsappBtn
                text="واتساب"
                link={whatsappLink}
                icon={<ChatIcon fontSize="small" />}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowToOrder;
