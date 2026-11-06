import { useEffect, useState } from "react";
import axios from "axios";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FacebookIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import PublicIcon from "@mui/icons-material/Public";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";

type SocialPlatform =
  | "whatsapp"
  | "facebook"
  | "instagram"
  | "website"
  | "email"
  | "phone"
  | "address"
  | "other";

type SocialMedia = {
  _id: string;
  name: string;
  link: string;
  value?: string;
  platform?: SocialPlatform;
};

const getPlatform = (item: SocialMedia): SocialPlatform => {
  if (item.platform) return item.platform;
  const name = item.name.toLocaleLowerCase();
  if (name.includes("whatsapp") || name.includes("واتساب")) return "whatsapp";
  if (name.includes("facebook") || name.includes("فيسبوك")) return "facebook";
  if (name.includes("instagram") || name.includes("إنستغرام")) return "instagram";
  if (name.includes("email") || name.includes("بريد")) return "email";
  if (name.includes("phone") || name.includes("هاتف")) return "phone";
  if (name.includes("address") || name.includes("عنوان")) return "address";
  return "website";
};

const Contact = () => {
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);

  useEffect(() => {
    let active = true;

    const loadSocialMedia = async () => {
      try {
        const { data } = await axios.get<SocialMedia[]>(
          `${serverUrl}/api/social/`,
        );
        if (active) setSocialMedia(data);
      } catch (error) {
        console.error("Failed to load social media links:", error);
      }
    };

    void loadSocialMedia();
    return () => {
      active = false;
    };
  }, [serverUrl]);

  const whatsapp = socialMedia.find((item) => getPlatform(item) === "whatsapp");

  return (
    <section>
      <div className="container py-10 text-soil">
        <div className="flex flex-col lg:flex-row justify-center gap-5">
          <div className="contact flex-3 py-5 flex flex-col gap-3 items-center lg:items-start">
            <h2>تواصل معنا</h2>
            {socialMedia
              .filter((item) => getPlatform(item) === "email")
              .map((item) => (
                <p key={item._id} dir="ltr">
                  {item.value ?? item.link}
                </p>
              ))}
            {socialMedia
              .filter((item) => getPlatform(item) === "address")
              .map((item) => (
                <p key={item._id} className="whitespace-pre-line">
                  العنوان : {item.value ?? item.link}
                </p>
              ))}
            {socialMedia
              .filter((item) => getPlatform(item) === "phone")
              .map((item) => (
                <p key={item._id} dir="ltr">
                  {item.value ?? item.link}
                </p>
              ))}
            {whatsapp && (
              <>
                <p dir="ltr">
                  رقم الواتساب : {whatsapp.value ?? whatsapp.link}
                </p>
                <a
                  href={whatsapp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-whatsapp text-paper flex justify-center items-center gap-2 px-4 py-3 w-fit rounded-md label-lg hover:bg-whatsapp-hover"
                >
                  <ChatIcon fontSize="small" />
                  ابدأ المحادثة على الواتساب
                </a>
              </>
            )}
          </div>
          <div className="social-media flex-1 flex flex-col items-center gap-5 py-5">
            <h2>انضم الى مواقعنا</h2>
            <ul className="justify-center flex flex-wrap gap-5">
              {socialMedia.map((item) => {
                const platform = getPlatform(item);
                const Icon = platform === "facebook"
                  ? FacebookIcon
                  : platform === "instagram"
                    ? InstagramIcon
                    : platform === "email"
                      ? EmailIcon
                      : platform === "phone"
                        ? PhoneIcon
                    : PublicIcon;

                if (platform === "whatsapp") return null;
                if (platform === "address") return null;

                return (
                  <li key={item._id} className="hover:text-soil-deep">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name}
                      title={item.name}
                    >
                      <Icon fontSize="large" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
