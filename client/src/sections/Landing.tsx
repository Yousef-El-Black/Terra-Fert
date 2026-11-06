import { YellowBadge } from "../components/Badges";
import { PrimaryBtn, WhatsappBtn } from "../components/Btns";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useWhatsAppSettings } from "../components/useWhatsAppSettings";

const Landing = () => {
  const { whatsappLink } = useWhatsAppSettings();

  return (
    <section>
      <div className="container lg:h-[calc(100vh-180px)] flex flex-col lg:flex-row justify-center items-center gap-5">
        <div className="content flex flex-col justify-center gap-5 flex-1 py-5 text-center items-center lg:py-0 lg:items-start lg:text-start">
          <YellowBadge text="تجارة المستلزمات الزراعية" />
          <h1 className="display">
            كل ما تحتاجه أرضك،{" "}
            <span className="text-whatsapp">اطلبه بضغطة واتساب</span>
          </h1>
          <p className="body text-soil">
            تصفّح الأسمدة والبذور والمستلزمات الزراعية، اختر ما يناسبك، ثم أرسل
            طلبك مباشرة إلى واتساب.
          </p>
          <div className="btns flex gap-5 py-5">
            <PrimaryBtn text="تصفح المنتجات" link="/products" />
            <WhatsappBtn
              text="اطلب عبر الواتساب"
              link={whatsappLink}
              icon={<ChatIcon />}
            />
          </div>
        </div>
        <div className="hero-image flex-1 hidden lg:flex justify-center items-center p-5 h-full">
          <img
            src="/assets/logo.png"
            alt="Terra Fert Hero Image"
            className="h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Landing;
