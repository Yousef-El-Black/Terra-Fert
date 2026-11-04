import { PrimaryBtn } from "../components/Btns";

const NotFound = () => {
  return (
    <section>
      <div className="container min-h-[calc(100vh-240px)] text-soil flex flex-col gap-10 items-center justify-center text-center">
        <span className="font-extrabold text-8xl">404</span>
        <h1 className="display">الصفحة غير موجودة</h1>
        <div className="btn">
          <PrimaryBtn text="الذهاب للصفحة الرئيسية" link="/" />
        </div>
      </div>
    </section>
  );
};

export default NotFound;
