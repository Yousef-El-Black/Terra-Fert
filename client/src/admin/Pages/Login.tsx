import { Link } from "react-router-dom";
import { useEffect, useState, type MouseEvent } from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import HideIcon from "@mui/icons-material/VisibilityOff";
import { validateUsername, validatePassoword } from "../../utils/form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const isSetupRegistration =
    new URLSearchParams(location.search).get("setup") === "1";
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [setupState, setSetupState] = useState<
    "checking" | "register" | "login" | "error"
  >("checking");
  const [setupRetry, setSetupRetry] = useState(0);

  useEffect(() => {
    let active = true;

    const checkSetup = async () => {
      try {
        const { data } = await axios.get<{ needsSetup: boolean }>(
          `${serverUrl}/api/admins/setup-status`,
        );
        if (active) {
          if (data.needsSetup && !isSetupRegistration) {
            navigate("/admin/welcome", { replace: true });
          } else {
            setSetupState(data.needsSetup ? "register" : "login");
          }
        }
      } catch (error) {
        console.error("Failed to check admin setup:", error);
        if (active) setSetupState("error");
      }
    };

    void checkSetup();
    return () => {
      active = false;
    };
  }, [isSetupRegistration, navigate, serverUrl, setupRetry]);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!validateUsername(username) || !validatePassoword(password)) {
      setErrorMessage(
        "اسم المستخدم يجب أن يتكون من 6 أحرف وكلمة المرور من 8 أحرف على الأقل",
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const { data } = await axios.post<{ token: string }>(
        `${serverUrl}/api/admins/${
          setupState === "register"
            ? "register-super-admin"
            : "login"
        }`,
        { username, password },
      );
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
      (remember ? localStorage : sessionStorage).setItem(
        "adminToken",
        data.token,
      );
      document.location.assign("/admin/");
    } catch (error) {
      console.error("Failed to authenticate admin:", error);
      const apiError = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error
        : undefined;
      setErrorMessage(
        axios.isAxiosError(error) && error.response?.status === 401
          ? "اسم المستخدم أو كلمة المرور غير صحيحة"
          : apiError === "Admin setup is already complete."
            ? "تم إعداد حساب المدير مسبقًا. يرجى تسجيل الدخول."
            : apiError === "Authentication is not configured."
              ? "إعدادات تسجيل الدخول غير مكتملة على الخادم. أعد تشغيل الخادم بعد ضبط JWT_SECRET."
              : setupState === "register"
                ? "تعذر إنشاء حساب المدير العام، يرجى المحاولة لاحقًا"
                : "تعذر تسجيل الدخول، يرجى المحاولة لاحقًا",
      );
      if (
        setupState === "register" &&
        axios.isAxiosError(error) &&
        error.response?.status === 409
      ) {
        setSetupState("login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <div className="flex flex-col lg:flex-row min-h-screen text-center lg:text-start">
        <div className="logo flex-1 bg-soil-deep flex flex-col justify-center items-center text-field gap-5 p-5">
          <div className="image bg-cream w-1/2 rounded-lg aspect-square overflow-hidden p-5">
            <img
              src="/assets/logo.png"
              alt="Terra Fert Logo"
              className="w-full h-full"
            />
          </div>
          <div className="title display">لوحة إدارة المنتجات</div>
          <p className="label text-cream">
            أضف المنتجات وعدّل أسعارها وحالتها، وتظهر فورًا في المتجر.
          </p>
        </div>
        <div className="login flex-1 bg-cream flex flex-col justify-center items-center p-5">
          <div className="box w-full lg:w-1/2">
            <div className="head mb-4">
              <h1 className="text-soil py-3">
                {setupState === "register"
                  ? "إنشاء حساب المدير العام"
                  : "تسجيل الدخول"}
              </h1>
              <span className="label text-muted">
                {setupState === "register"
                  ? "أنشئ حساب المدير العام الأول لبدء استخدام لوحة الإدارة."
                  : "هذه الصفحة للمدير فقط."}
              </span>
            </div>
            {setupState === "checking" ? (
              <p className="py-5 text-soil" role="status">
                جارٍ التحقق من إعداد حسابات المديرين...
              </p>
            ) : setupState === "error" ? (
              <div className="py-3 text-soil">
                <p className="mb-4 text-danger" role="alert">
                  تعذر الاتصال بالخادم للتحقق من إعداد المديرين.
                </p>
                <button
                  type="button"
                  className="rounded-lg border-2 border-border bg-field p-3 font-bold"
                  onClick={() => {
                    setSetupState("checking");
                    setSetupRetry((current) => current + 1);
                  }}
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : (
            <form className="py-3 flex flex-col gap-5 text-soil">
              <div className="username flex-col flex">
                <label className="font-bold text-md" htmlFor="admin-username">
                  اسم المستخدم
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="bg-field p-3 my-2 rounded-lg border-border border-2"
                  dir="ltr"
                  id="admin-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="password flex-col flex w-full">
                <label className="font-bold text-md" htmlFor="admin-password">
                  كلمة المرور
                </label>
                <div className="pass-input w-full flex relative">
                  <input
                    type={!passwordVisibility ? "password" : "text"}
                    className="bg-field p-3 my-2 rounded-lg border-border border-2 w-full"
                    placeholder="Enter Password"
                    dir="ltr"
                    id="admin-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="show-password cursor-pointer absolute top-1/2 -translate-y-1/2 right-4"
                    onClick={togglePasswordVisibility}
                  >
                    {!passwordVisibility ? <EyeIcon /> : <HideIcon />}
                  </div>
                </div>
              </div>
              <div className="remember-me flex items-center gap-4">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  className="w-5 h-5"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="text-soil" htmlFor="remember">
                  تذكّرني على هذا الجهاز
                </label>
              </div>
              <div className="submit">
                {errorMessage && (
                  <p className="mb-3 text-danger" role="alert">
                    {errorMessage}
                  </p>
                )}
                <button
                  className="bg-leaf hover:opacity-80 cursor-pointer rounded-lg p-4 font-bold text-field text-xl w-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? setupState === "register"
                      ? "جارٍ إنشاء الحساب..."
                      : "جارٍ تسجيل الدخول..."
                    : setupState === "register"
                      ? "إنشاء حساب المدير العام"
                      : "دخول"}
                </button>
              </div>
            </form>
            )}
            <Link
              to="/"
              className="text-center underline mx-auto w-full block py-4"
            >
              العودة إلى المتجر
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
