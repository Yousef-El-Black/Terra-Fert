import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import PopUp from "../components/PopUp";
import { addMsg } from "../../redux/slices/msgSlice";

type Admin = {
  _id: string;
  username: string;
  superAdmin: boolean;
  createdAt?: string;
};

const getAdminToken = () =>
  localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

const getAuthHeaders = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const Settings = () => {
  const dispatch = useDispatch();
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Admin | null>(null);
  const [accessError, setAccessError] = useState<
    "login" | "superadmin" | null
  >(null);

  const notify = (text: string, type: "success" | "error") => {
    dispatch(addMsg({ id: Date.now(), text, type }));
  };

  useEffect(() => {
    let active = true;

    const loadAdmins = async () => {
      try {
        const { data } = await axios.get<Admin[]>(
          `${serverUrl}/api/admins/`,
          { headers: getAuthHeaders() },
        );
        if (active) {
          setAdmins(data);
          setAccessError(null);
        }
      } catch (error) {
        if (!active) return;
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAccessError("login");
        } else if (
          axios.isAxiosError(error) &&
          error.response?.status === 403
        ) {
          setAccessError("superadmin");
        } else {
          console.error("Failed to load admins:", error);
          dispatch(
            addMsg({
              id: Date.now(),
              text: "تعذر تحميل قائمة المديرين",
              type: "error",
            }),
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadAdmins();
    return () => {
      active = false;
    };
  }, [serverUrl, dispatch]);

  const handleCreateAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.trim().length < 6 || password.length < 8) {
      notify("اسم المستخدم يجب أن يتكون من 6 أحرف وكلمة المرور من 8 أحرف على الأقل", "error");
      return;
    }

    setIsSaving(true);
    try {
      const { data } = await axios.post<Admin>(
        `${serverUrl}/api/admins/`,
        { username: username.trim(), password, superAdmin: false },
        { headers: getAuthHeaders() },
      );
      setAdmins((current) => [...current, data]);
      setUsername("");
      setPassword("");
      notify(`تم إضافة المدير "${data.username}" بنجاح`, "success");
    } catch (error) {
      console.error("Failed to create admin:", error);
      const message =
        axios.isAxiosError<{ error?: string }>(error) &&
        error.response?.data?.error
          ? error.response.data.error
          : "تعذر إضافة المدير";
      notify(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!pendingDelete) return;

    setIsRemoving(true);
    try {
      await axios.delete(`${serverUrl}/api/admins/${pendingDelete._id}`, {
        headers: getAuthHeaders(),
      });
      setAdmins((current) =>
        current.filter((admin) => admin._id !== pendingDelete._id),
      );
      notify(`تم حذف المدير "${pendingDelete.username}"`, "success");
    } catch (error) {
      console.error("Failed to remove admin:", error);
      const message =
        axios.isAxiosError<{ error?: string }>(error) &&
        error.response?.data?.error
          ? error.response.data.error
          : "تعذر حذف المدير";
      notify(message, "error");
    } finally {
      setIsRemoving(false);
      setPendingDelete(null);
    }
  };

  return (
    <section>
      <div className="container py-10">
        <div className="head py-5">
          <h1 className="text-soil py-3">إعدادات المديرين</h1>
          <p className="label text-muted">
            أضف المديرين وتابع الحسابات التي يمكنها الوصول إلى لوحة الإدارة.
          </p>
        </div>

        {accessError ? (
          <div className="rounded-lg border-2 border-border bg-paper p-6 text-soil">
            <p className="font-bold">
              {accessError === "login"
                ? "سجل الدخول بحساب مدير عام للوصول إلى هذه الصفحة."
                : "هذه الصفحة متاحة للمدير العام فقط."}
            </p>
            {accessError === "login" && (
              <Link
                to="/admin/login"
                className="mt-4 inline-block rounded-lg border-2 border-border bg-leaf px-5 py-3 font-bold text-leaf-tint"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <form
              className="flex flex-col gap-4 rounded-lg border-2 border-border bg-paper p-5 text-soil"
              onSubmit={handleCreateAdmin}
            >
              <h2 className="text-xl font-bold">إضافة مدير</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 font-bold">
                  اسم المستخدم
                  <input
                    className="rounded-lg border-2 border-border bg-field p-3 font-normal"
                    type="text"
                    autoComplete="off"
                    minLength={6}
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 font-bold">
                  كلمة المرور
                  <input
                    className="rounded-lg border-2 border-border bg-field p-3 font-normal"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>
              </div>
              <p className="text-muted">
                سيتم إنشاء الحساب بصلاحيات مدير عادي، وليس مديرًا عامًا.
              </p>
              <button
                type="submit"
                disabled={isSaving}
                className="w-fit rounded-lg border-2 border-border bg-leaf px-5 py-3 font-bold text-leaf-tint disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "جارٍ الإضافة..." : "إضافة المدير"}
              </button>
            </form>

            <div className="overflow-hidden rounded-lg border-2 border-border bg-paper text-soil">
              <h2 className="border-b-2 border-border p-5 text-xl font-bold">
                قائمة المديرين
              </h2>
              {isLoading ? (
                <p className="p-5 text-muted">جارٍ تحميل المديرين...</p>
              ) : admins.length === 0 ? (
                <p className="p-5 text-muted">لا يوجد مديرون حتى الآن</p>
              ) : (
                <ul>
                  {admins.map((admin) => (
                    <li
                      key={admin._id}
                      className="flex flex-col gap-4 border-b border-border p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{admin.username}</span>
                        <span className="text-sm text-muted">
                          {admin.superAdmin ? "مدير عام" : "مدير"}
                          {admin.createdAt &&
                            ` · أُضيف في ${new Date(admin.createdAt).toLocaleDateString("ar-EG")}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={isRemoving}
                        onClick={() => setPendingDelete(admin)}
                        className="flex w-fit items-center gap-2 rounded-lg border-2 border-border bg-field px-4 py-2 font-bold text-danger hover:bg-danger-tint disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <DeleteIcon fontSize="small" />
                        حذف
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
      {pendingDelete && (
        <PopUp
          text={`هل تريد حذف المدير "${pendingDelete.username}" نهائيًا؟`}
          onClose={() => {
            if (!isRemoving) setPendingDelete(null);
          }}
          onConfirm={() => void handleRemoveAdmin()}
        />
      )}
    </section>
  );
};

export default Settings;
