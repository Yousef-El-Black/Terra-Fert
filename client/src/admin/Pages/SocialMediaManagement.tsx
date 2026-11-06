import DeleteIcon from "@mui/icons-material/Delete";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EditIcon from "@mui/icons-material/Edit";
import FacebookIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import LinkIcon from "@mui/icons-material/Link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import PopUp from "../components/PopUp";
import { addMsg } from "../../redux/slices/msgSlice";

type SocialMedia = {
  _id: string;
  name: string;
  link: string;
  platform?: SocialPlatform;
  active: boolean;
};

type SocialPlatform =
  | "whatsapp"
  | "facebook"
  | "instagram"
  | "website"
  | "email"
  | "phone"
  | "address"
  | "other";

const platformLabels: Record<SocialPlatform, string> = {
  whatsapp: "واتساب",
  facebook: "فيسبوك",
  instagram: "إنستغرام",
  website: "الموقع الإلكتروني",
  email: "البريد الإلكتروني",
  phone: "الهاتف",
  address: "العنوان",
  other: "أخرى",
};

const PlatformIcon = ({ platform }: { platform: SocialPlatform }) => {
  switch (platform) {
    case "whatsapp":
      return <WhatsAppIcon fontSize="large" />;
    case "facebook":
      return <FacebookIcon fontSize="large" />;
    case "instagram":
      return <InstagramIcon fontSize="large" />;
    case "email":
      return <EmailOutlinedIcon fontSize="large" />;
    case "phone":
      return <PhoneIcon fontSize="large" />;
    case "address":
      return <LocationOnIcon fontSize="large" />;
    case "website":
      return <LanguageIcon fontSize="large" />;
    default:
      return <LinkIcon fontSize="large" />;
  }
};

const PlatformSelector = ({
  value,
  onChange,
}: {
  value: SocialPlatform;
  onChange: (platform: SocialPlatform) => void;
}) => (
  <div
    className="flex flex-wrap gap-3"
    role="group"
    aria-label="اختر نوع وسيلة التواصل"
  >
    {(Object.keys(platformLabels) as SocialPlatform[]).map((platform) => (
      <button
        key={platform}
        type="button"
        aria-pressed={value === platform}
        onClick={() => onChange(platform)}
        className={`flex min-w-24 flex-col items-center gap-2 rounded-lg border-2 px-4 py-3 ${
          value === platform
            ? "border-leaf bg-tile-1 text-soil"
            : "border-border bg-field text-muted"
        }`}
      >
        <PlatformIcon platform={platform} />
        <span className="text-sm font-bold">{platformLabels[platform]}</span>
      </button>
    ))}
  </div>
);

const inferPlatform = (item: SocialMedia): SocialPlatform => {
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

const getSocialHref = (item: SocialMedia) =>
  inferPlatform(item) === "whatsapp"
    ? `https://wa.me/${item.link.replace(/\D/g, "")}`
    : inferPlatform(item) === "phone"
      ? `tel:${item.link.replace(/\D/g, "")}`
      : inferPlatform(item) === "email"
        ? `mailto:${item.link}`
        : inferPlatform(item) === "address"
          ? `https://maps.google.com/?q=${encodeURIComponent(item.link)}`
          : item.link;

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const SocialMediaManagement = () => {
  const dispatch = useDispatch();
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [items, setItems] = useState<SocialMedia[]>([]);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform>("whatsapp");
  const [active, setActive] = useState(true);
  const [editing, setEditing] = useState<SocialMedia | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingLink, setEditingLink] = useState("");
  const [editingPlatform, setEditingPlatform] =
    useState<SocialPlatform>("whatsapp");
  const [editingActive, setEditingActive] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<SocialMedia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [accessError, setAccessError] = useState<
    "login" | "superadmin" | null
  >(null);

  const notify = (text: string, type: "success" | "error") => {
    dispatch(addMsg({ id: Date.now(), text, type }));
  };

  useEffect(() => {
    let activeRequest = true;

    const loadItems = async () => {
      try {
        const { data } = await axios.get<SocialMedia[]>(
          `${serverUrl}/api/social/manage`,
          { headers: getAuthHeaders() },
        );
        if (activeRequest) {
          setItems(data);
          setAccessError(null);
        }
      } catch (error) {
        if (!activeRequest) return;
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAccessError("login");
        } else if (
          axios.isAxiosError(error) &&
          error.response?.status === 403
        ) {
          setAccessError("superadmin");
        } else {
          console.error("Failed to load social media:", error);
          dispatch(
            addMsg({
              id: Date.now(),
              text: "تعذر تحميل وسائل التواصل",
              type: "error",
            }),
          );
        }
      } finally {
        if (activeRequest) setIsLoading(false);
      }
    };

    void loadItems();
    return () => {
      activeRequest = false;
    };
  }, [dispatch, serverUrl]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const { data } = await axios.post<SocialMedia>(
        `${serverUrl}/api/social/`,
        { name: name.trim(), link: link.trim(), platform, active },
        { headers: getAuthHeaders() },
      );
      setItems((current) => [data, ...current]);
      setName("");
      setLink("");
      setPlatform("whatsapp");
      setActive(true);
      notify("تمت إضافة وسيلة التواصل بنجاح", "success");
    } catch (error) {
      console.error("Failed to create social media:", error);
      notify(getApiError(error, "تعذرت إضافة وسيلة التواصل"), "error");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (item: SocialMedia) => {
    setEditing(item);
    setEditingName(item.name);
    setEditingLink(item.link);
    setEditingPlatform(inferPlatform(item));
    setEditingActive(item.active);
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;

    setIsSaving(true);
    try {
      const { data } = await axios.put<SocialMedia>(
        `${serverUrl}/api/social/${editing._id}`,
        {
          name: editingName.trim(),
          link: editingLink.trim(),
          platform: editingPlatform,
          active: editingActive,
        },
        { headers: getAuthHeaders() },
      );
      setItems((current) =>
        current.map((item) => (item._id === data._id ? data : item)),
      );
      setEditing(null);
      notify("تم تعديل وسيلة التواصل بنجاح", "success");
    } catch (error) {
      console.error("Failed to update social media:", error);
      notify(getApiError(error, "تعذر تعديل وسيلة التواصل"), "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${serverUrl}/api/social/${pendingDelete._id}`, {
        headers: getAuthHeaders(),
      });
      setItems((current) =>
        current.filter((item) => item._id !== pendingDelete._id),
      );
      if (editing?._id === pendingDelete._id) setEditing(null);
      notify("تم حذف وسيلة التواصل", "success");
    } catch (error) {
      console.error("Failed to delete social media:", error);
      notify(getApiError(error, "تعذر حذف وسيلة التواصل"), "error");
    } finally {
      setIsDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <section>
      <div className="container py-10">
        <div className="head py-5">
          <h1 className="text-soil py-3">إدارة وسائل التواصل</h1>
          <p className="label text-muted">
            أضف روابط حساباتك وعدّلها، وستظهر الوسائل المفعلة للعملاء في صفحة
            التواصل.
          </p>
        </div>

        {accessError ? (
          <div className="rounded-lg border-2 border-border bg-paper p-6 text-soil">
            <p className="font-bold">
              {accessError === "login"
                ? "سجل الدخول للمتابعة."
                : "إدارة وسائل التواصل متاحة للمدير العام فقط."}
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
              onSubmit={handleCreate}
            >
              <h2 className="text-xl font-bold">إضافة وسيلة تواصل</h2>
              <PlatformSelector value={platform} onChange={setPlatform} />
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 font-bold">
                  الاسم الظاهر
                  <input
                    className="rounded-lg border-2 border-border bg-field p-3 font-normal"
                    type="text"
                    placeholder={platformLabels[platform]}
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-2 font-bold">
                  {platform === "whatsapp"
                    ? "رقم واتساب"
                    : platform === "phone"
                      ? "رقم الهاتف"
                      : platform === "email"
                        ? "البريد الإلكتروني"
                        : platform === "address"
                          ? "العنوان"
                        : "الرابط"}
                  {platform === "address" ? (
                    <textarea
                      className="rounded-lg border-2 border-border bg-field p-3 font-normal"
                      placeholder="اكتب عنوانك بالتفصيل"
                      required
                      value={link}
                      onChange={(event) => setLink(event.target.value)}
                    />
                  ) : (
                    <input
                      className="rounded-lg border-2 border-border bg-field p-3 font-normal"
                      type={
                        platform === "whatsapp" || platform === "phone"
                          ? "tel"
                          : platform === "email"
                            ? "email"
                            : "url"
                      }
                      placeholder={
                        platform === "whatsapp" || platform === "phone"
                          ? "+201012345678"
                          : platform === "email"
                            ? "name@example.com"
                            : "https://..."
                      }
                      dir="ltr"
                      required
                      inputMode={
                        platform === "whatsapp" || platform === "phone"
                          ? "tel"
                          : platform === "email"
                            ? "email"
                            : "url"
                      }
                      value={link}
                      onChange={(event) => setLink(event.target.value)}
                    />
                  )}
                </label>
              </div>
              <label className="flex w-fit items-center gap-3">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(event) => setActive(event.target.checked)}
                  className="h-5 w-5"
                />
                <span>إظهار الرابط للعملاء</span>
              </label>
              <button
                type="submit"
                disabled={isSaving}
                className="w-fit rounded-lg border-2 border-border bg-leaf px-5 py-3 font-bold text-leaf-tint disabled:opacity-60"
              >
                {isSaving ? "جارٍ الحفظ..." : "إضافة"}
              </button>
            </form>

            <div className="overflow-hidden rounded-lg border-2 border-border bg-paper text-soil">
              <h2 className="border-b-2 border-border p-5 text-xl font-bold">
                وسائل التواصل المضافة
              </h2>
              {isLoading ? (
                <p className="p-5 text-muted">جارٍ تحميل وسائل التواصل...</p>
              ) : items.length === 0 ? (
                <p className="p-5 text-muted">لم تتم إضافة وسائل تواصل بعد.</p>
              ) : (
                <ul>
                  {items.map((item) => (
                    <li
                      key={item._id}
                      className="border-b border-border p-5 last:border-b-0"
                    >
                      {editing?._id === item._id ? (
                        <form
                          className="flex flex-col gap-4"
                          onSubmit={handleUpdate}
                        >
                          <PlatformSelector
                            value={editingPlatform}
                            onChange={setEditingPlatform}
                          />
                          <div className="grid gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-2 font-bold">
                              الاسم الظاهر
                              <input
                                className="rounded-lg border-2 border-border bg-field p-3 font-normal"
                                required
                                value={editingName}
                                onChange={(event) =>
                                  setEditingName(event.target.value)
                                }
                              />
                            </label>
                            <label className="flex flex-col gap-2 font-bold">
                              {editingPlatform === "whatsapp"
                                ? "رقم واتساب"
                                : editingPlatform === "phone"
                                  ? "رقم الهاتف"
                                  : editingPlatform === "email"
                                    ? "البريد الإلكتروني"
                                    : editingPlatform === "address"
                                      ? "العنوان"
                                    : "الرابط"}
                              {editingPlatform === "address" ? (
                                <textarea
                                  className="rounded-lg border-2 border-border bg-field p-3 font-normal"
                                  required
                                  value={editingLink}
                                  onChange={(event) =>
                                    setEditingLink(event.target.value)
                                  }
                                />
                              ) : (
                                <input
                                  className="rounded-lg border-2 border-border bg-field p-3 font-normal"
                                  type={
                                    editingPlatform === "whatsapp" ||
                                    editingPlatform === "phone"
                                      ? "tel"
                                      : editingPlatform === "email"
                                        ? "email"
                                        : "url"
                                  }
                                  dir="ltr"
                                  inputMode={
                                    editingPlatform === "whatsapp" ||
                                    editingPlatform === "phone"
                                      ? "tel"
                                      : editingPlatform === "email"
                                        ? "email"
                                        : "url"
                                  }
                                  required
                                  value={editingLink}
                                  onChange={(event) =>
                                    setEditingLink(event.target.value)
                                  }
                                />
                              )}
                            </label>
                          </div>
                          <label className="flex w-fit items-center gap-3">
                            <input
                              type="checkbox"
                              checked={editingActive}
                              onChange={(event) =>
                                setEditingActive(event.target.checked)
                              }
                              className="h-5 w-5"
                            />
                            <span>إظهار الرابط للعملاء</span>
                          </label>
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="rounded-lg border-2 border-border bg-leaf px-4 py-2 font-bold text-leaf-tint disabled:opacity-60"
                            >
                              حفظ التعديلات
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditing(null)}
                              className="rounded-lg border-2 border-border bg-field px-4 py-2 font-bold"
                            >
                              إلغاء
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-tile-1 text-soil">
                                <PlatformIcon platform={inferPlatform(item)} />
                              </span>
                              <div className="flex min-w-0 flex-col gap-1">
                                <span className="font-bold">{item.name}</span>
                                <span className="text-sm text-muted">
                                  {platformLabels[inferPlatform(item)]}
                                </span>
                              </div>
                            </div>
                            {inferPlatform(item) === "address" ? (
                              <span className="whitespace-pre-line text-muted">
                                {item.link}
                              </span>
                            ) : (
                              <a
                                href={getSocialHref(item)}
                                target="_blank"
                                rel="noopener noreferrer"
                                dir="ltr"
                                className="break-all text-muted underline"
                              >
                                {item.link}
                              </a>
                            )}
                            <span className="text-sm text-muted">
                              {item.active ? "ظاهر للعملاء" : "مخفي عن العملاء"}
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => startEditing(item)}
                              className="flex items-center gap-2 rounded-lg border-2 border-border bg-field px-4 py-2 font-bold"
                            >
                              <EditIcon fontSize="small" />
                              تعديل
                            </button>
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={() => setPendingDelete(item)}
                              className="flex items-center gap-2 rounded-lg border-2 border-border bg-field px-4 py-2 font-bold text-danger hover:bg-danger-tint disabled:opacity-60"
                            >
                              <DeleteIcon fontSize="small" />
                              حذف
                            </button>
                          </div>
                        </div>
                      )}
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
          text={`هل تريد حذف "${pendingDelete.name}" نهائيًا؟`}
          onClose={() => {
            if (!isDeleting) setPendingDelete(null);
          }}
          onConfirm={() => void handleDelete()}
        />
      )}
    </section>
  );
};

const getApiError = (error: unknown, fallback: string) =>
  axios.isAxiosError<{ error?: string }>(error) && error.response?.data?.error
    ? error.response.data.error
    : fallback;

export default SocialMediaManagement;
