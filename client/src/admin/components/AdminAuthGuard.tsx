import axios from "axios";
import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

const getAdminToken = () =>
  localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

const AdminAuthGuard = ({ children }: { children: ReactNode }) => {
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const token = getAdminToken();
  const [status, setStatus] = useState<
    "checking" | "authorized" | "unauthorized" | "first-use" | "error"
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
          setStatus(data.needsSetup ? "first-use" : "unauthorized");
        }
      } catch (error) {
        if (!active) return;
        console.error("Failed to check admin setup:", error);
        setStatus("error");
      }
    };

    if (!token) {
      void checkSetup();
      return () => {
        active = false;
      };
    }

    const verifyAdmin = async () => {
      try {
        await axios.get(`${serverUrl}/api/admins/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (active) setStatus("authorized");
      } catch (error) {
        if (!active) return;
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("adminToken");
          sessionStorage.removeItem("adminToken");
          await checkSetup();
        } else {
          console.error("Failed to verify admin session:", error);
          setStatus("error");
        }
      }
    };

    void verifyAdmin();
    return () => {
      active = false;
    };
  }, [retry, serverUrl, token]);

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" replace />;
  }

  if (status === "first-use") {
    return <Navigate to="/admin/welcome" replace />;
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-5 text-soil">
        <p role="alert">تعذر التحقق من تسجيل الدخول. تحقق من الاتصال بالخادم.</p>
        <button
          type="button"
          className="rounded-lg border-2 border-border bg-field px-5 py-3 font-bold"
          onClick={() => {
            setStatus("checking");
            setRetry((current) => current + 1);
          }}
        >
          إعادة المحاولة
        </button>
      </main>
    );
  }

  if (status === "checking") {
    return (
      <main
        className="flex min-h-screen items-center justify-center text-soil"
        role="status"
      >
        جارٍ التحقق من تسجيل الدخول...
      </main>
    );
  }

  return children;
};

export default AdminAuthGuard;
