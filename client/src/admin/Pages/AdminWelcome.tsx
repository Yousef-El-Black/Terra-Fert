import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

const AdminWelcome = () => {
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [setupState, setSetupState] = useState<
    "checking" | "first-use" | "complete" | "error"
  >("checking");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    const checkSetup = async () => {
      try {
        const { data } = await axios.get<{ needsSetup: boolean }>(
          `${serverUrl}/api/admins/setup-status`,
        );
        if (active) {
          setSetupState(data.needsSetup ? "first-use" : "complete");
        }
      } catch (error) {
        console.error("Failed to check initial admin setup:", error);
        if (active) setSetupState("error");
      }
    };

    void checkSetup();
    return () => {
      active = false;
    };
  }, [retry, serverUrl]);

  if (setupState === "complete") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-field p-5 text-soil">
      <section className="w-full max-w-2xl rounded-xl border-2 border-border bg-paper p-6 text-center shadow-lg sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-tile-1 text-4xl font-bold text-leaf">
          TF
        </div>
        {setupState === "checking" ? (
          <p role="status">جارٍ التحقق من إعداد لوحة الإدارة...</p>
        ) : setupState === "error" ? (
          <>
            <h1 className="mb-4 text-2xl font-bold">تعذر التحقق من الإعداد</h1>
            <p className="mb-6 text-muted">
              لم نتمكن من الاتصال بالخادم لمعرفة ما إذا كانت هذه أول مرة
              تستخدم فيها لوحة الإدارة.
            </p>
            <button
              type="button"
              className="rounded-lg border-2 border-border bg-field px-5 py-3 font-bold"
              onClick={() => {
                setSetupState("checking");
                setRetry((current) => current + 1);
              }}
            >
              إعادة المحاولة
            </button>
          </>
        ) : (
          <>
            <p className="mb-2 font-bold text-leaf">مرحبًا بك في Terra Fert</p>
            <h1 className="mb-4 text-2xl font-bold sm:text-3xl">
              لنبدأ بإعداد لوحة الإدارة
            </h1>
            <p className="mb-4 leading-8 text-muted">
              يبدو أن هذه أول مرة تستخدم فيها لوحة الإدارة، ولا توجد حسابات
              مديرين حتى الآن. أنشئ حساب المدير العام الأول للبدء.
            </p>
            <p className="mb-8 leading-8 text-muted">
              اختر اسم مستخدم من 6 أحرف على الأقل وكلمة مرور من 8 أحرف على
              الأقل. سيتيح لك حساب المدير العام إدارة محتوى المتجر وإضافة
              حسابات مديرين أخرى من الإعدادات.
            </p>
            <Link
              to="/admin/login?setup=1"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-border bg-leaf px-6 py-3 font-bold text-leaf-tint hover:opacity-90"
            >
              إنشاء حساب المدير العام
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </>
        )}
      </section>
    </main>
  );
};

export default AdminWelcome;
