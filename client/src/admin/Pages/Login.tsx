import { Link } from "react-router-dom";
import { useState, type MouseEvent } from "react";
import EyeIcon from "@mui/icons-material/Visibility";
import HideIcon from "@mui/icons-material/VisibilityOff";
import { validateUsername, validatePassoword } from "../../utils/form";

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [remember, setRemember] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateUsername(username) && validatePassoword(password)) {
      return true;
    } else {
      throw new Error("Errrrrrror");
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
              <h1 className="text-soil py-3">تسجيل الدخول</h1>
              <span className="label text-muted">هذه الصفحة للمدير فقط.</span>
            </div>
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
                <button
                  className="bg-leaf hover:opacity-80 cursor-pointer rounded-lg p-4 font-bold text-field text-xl w-full"
                  onClick={handleSubmit}
                >
                  دخول
                </button>
              </div>
            </form>
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
