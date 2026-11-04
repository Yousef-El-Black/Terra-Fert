import { Link } from "react-router-dom";
import { WhatsappBtn } from "../components/Btns";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FacebookIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";

const Contact = () => {
  return (
    <section>
      <div className="container py-10 text-soil">
        <div className="flex flex-col lg:flex-row justify-center gap-5">
          <div className="contact flex-3 py-5 flex flex-col gap-3 items-center lg:items-start">
            <h2>تواصل معنا</h2>
            <p>رقم الواتساب : 010123456789</p>
            <p>العنوان الالكتروني : info@terrafert.com</p>
            <p>العنوان : القاهرة - القاهرة</p>
            <WhatsappBtn
              text="ابدأ المحادثة على الواتساب"
              link="https://wa.me/1234567890"
              icon={<ChatIcon fontSize="small" />}
            />
          </div>
          <div className="social-media flex-1 flex flex-col items-center gap-5 py-5">
            <h2>انضم الى مواقعنا</h2>
            <ul className="justify-center flex flex-wrap gap-5">
              <li className="hover:text-soil-deep">
                <Link to="/">
                  <FacebookIcon fontSize="large" />
                </Link>
              </li>
              <li className="hover:text-soil-deep">
                <Link to="/">
                  <InstagramIcon fontSize="large" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
