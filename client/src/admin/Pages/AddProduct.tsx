import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { AvailableBadge } from "../../components/Badges";
import { AddToCartBtn, WhatsappOrderBtn } from "../../components/Btns";
import ChatIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import PlantIcon from "@mui/icons-material/Grass";
import PreviewIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addMsg } from "../../redux/slices/msgSlice";
import { useWhatsAppSettings } from "../../components/useWhatsAppSettings";
import { getAdminAuthConfig } from "../utils/adminAuth";

const AddProduct = () => {
  const { whatsappLink } = useWhatsAppSettings();
  const dispatch = useDispatch();
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [status, setStatus] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [enableRedBorder, setEnableRedBorder] = useState<boolean>(false);

  const addImagetoList = (img: File) => {
    setImages((prev) => [...prev, img]);
  };

  const removeImageFromList = (img: File) => {
    setImages((prev) => prev.filter((i) => i !== img));
  };

  const resetInputs = () => {
    setImages([]);
    setTitle("");
    setCategory("");
    setDescription("");
    setUnit("");
    setStatus(true);
  };

  const validateInputs = () => {
    setEnableRedBorder(true);
    if (title && category && unit && status) {
      return true;
    } else {
      const date = Date.now();
      dispatch(
        addMsg({
          id: date,
          text: "برجاء اكمال الحقول المطلوبة",
          type: "error",
        }),
      );
      return false;
    }
  };

  const handleUploadImages = async () => {
    const uploadedImages = await Promise.all(
      images.map((img) => {
        const formData = new FormData();
        formData.append("image_input", img);
        return axios
          .post<{
            fileInfo: { path: string };
          }>(`${serverUrl}/api/upload/`, formData, getAdminAuthConfig())
          .then((res) => res.data.fileInfo.path);
      }),
    );
    return uploadedImages;
  };

  const handleSubmit = async () => {
    try {
      const uploadedImages = await handleUploadImages();
      await axios
        .post(
          `${serverUrl}/api/products/`,
          {
            description,
            images: uploadedImages,
            title,
            category,
            status: status ? "متوفر" : "غير متوفر",
            unit,
            rating: [],
          },
          getAdminAuthConfig(),
        )
        .then((res) => {
          const date = Date.now();
          dispatch(
            addMsg({
              id: date,
              text: `تم اضافة "${res.data.title}" بنجاح`,
              type: "success",
            }),
          );
        })
        .then(() => {
          document.location.assign("/admin/products/");
        })
        .catch((err) => {
          console.error("Failed to create product:", err.response?.data ?? err);
        });
    } catch (error) {
      console.error("Failed to upload product images:", error);
    }
  };

  return (
    <section>
      <div className="container py-10">
        <div className="head py-5">
          <h1 className="text-soil py-3">إضافة منتج جديد</h1>
          <p className="label text-muted">
            أضف بيانات المنتج وسيظهر في المتجر مع زر الطلب عبر واتساب.
          </p>
        </div>
        <div className="content flex gap-5 text-soil flex-col lg:flex-row">
          <div className="form bg-paper p-5 border-2 border-border rounded-lg flex-3">
            <form>
              <div className="imgs">
                <label className="label-lg text-soil pb-3 block">
                  صورة المنتج
                </label>
                <div className="upload w-full border-2 border-border border-dashed bg-field relative cursor-pointer p-10 h-100 flex justify-center items-center">
                  <input
                    type="file"
                    className="opacity-0 w-full h-full absolute top-0 left-0 block cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) addImagetoList(file);
                      e.currentTarget.value = "";
                    }}
                  />
                  <div className="addimage flex flex-col gap-4 justify-center items-center text-center">
                    <UploadIcon className="text-leaf" fontSize="large" />
                    <h3>اضغط لرفع صور المنتج</h3>
                    <p>JPG أو PNG</p>
                  </div>
                </div>
                <div className="images py-3 flex items-center gap-5">
                  <div className="text">
                    <span className="text-soil font-bold text-lg">
                      الصور المرفوعة :
                    </span>
                    <p className="body-sm text-muted">
                      يمكنك الضغط على الصورة لحذفها
                    </p>
                  </div>
                  <div className="imgs flex-1 flex items-center gap-5 flex-wrap">
                    {images.length > 0 &&
                      images.map((i) => {
                        return (
                          <div className="img w-15 h-15 bg-tile-1 rounded-lg border-2 border-border relative overflow-hidden">
                            <img src={URL.createObjectURL(i)} alt="" />
                            <div
                              className="delete-img absolute h-full w-full opacity-0 hover:opacity-60 top-0 left-0 flex justify-center items-center bg-danger-tint text-danger cursor-pointer"
                              onClick={() => removeImageFromList(i)}
                            >
                              <DeleteIcon fontSize="small" />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="title flex-col flex gap-3 py-3">
                <label className="font-bold text-md" htmlFor="ptitle">
                  اسم المنتج
                </label>
                <input
                  className="bg-field p-3 my-1 rounded-lg border-border border-2"
                  type="text"
                  placeholder="مثال : سماد NPK مركب"
                  id="ptitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    outlineColor:
                      enableRedBorder && !title ? "#ff0000" : "transparent",
                    outlineWidth: "4px",
                    outlineStyle:
                      enableRedBorder && !title ? "auto" : undefined,
                  }}
                />
              </div>
              <div className="category flex-col flex gap-3 py-3">
                <label className="font-bold text-md" htmlFor="pcategory">
                  القسم
                </label>
                <select
                  name="category"
                  id="pcategory"
                  className="bg-field p-3 my-1 rounded-lg border-border border-2"
                  value={category}
                  defaultValue={""}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    outlineColor:
                      enableRedBorder && !category ? "#ff0000" : "transparent",
                    outlineWidth: "4px",
                    outlineStyle:
                      enableRedBorder && !category ? "auto" : undefined,
                  }}
                >
                  <option value="" disabled>
                    اختر القسم
                  </option>
                  <option value="مبيدات حشائش">مبيدات حشائش</option>
                  <option value="مبيدات حشرية">مبيدات حشرية</option>
                  <option value="مبيدات فطرية">مبيدات فطرية</option>
                  <option value="مبيدات أكاروسية">مبيدات أكاروسية</option>
                  <option value="مبيدات نيماتودا">مبيدات نيماتودا</option>
                  <option value="منظمات نمو">منظمات نمو</option>
                  <option value="مصائد">مصائد</option>
                  <option value="أسمدة">أسمدة</option>
                  <option value="بذور">بذور</option>
                  <option value="مخصبات">مخصبات</option>
                </select>
              </div>
              <div className="unit flex-col flex gap-3 py-3">
                <label className="font-bold text-md" htmlFor="punit">
                  الوحدة
                </label>
                <select
                  name="unit"
                  id="punit"
                  className="bg-field p-3 my-1 rounded-lg border-border border-2"
                  value={unit}
                  defaultValue={""}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{
                    outlineColor:
                      enableRedBorder && !unit ? "#ff0000" : "transparent",
                    outlineWidth: "4px",
                    outlineStyle: enableRedBorder && !unit ? "auto" : undefined,
                  }}
                >
                  <option value="" disabled>
                    اختر الوحدة
                  </option>
                  <option value="كيس">كيس</option>
                  <option value="عبوة">عبوة</option>
                  <option value="زجاجة">زجاجة</option>
                  <option value="جالون">جالون</option>
                  <option value="شكارة">شكارة</option>
                  <option value="غير محدد">غير محدد</option>
                </select>
              </div>
              <div className="status flex-col flex gap-3 py-3">
                <label className="font-bold text-md" htmlFor="ptitle">
                  الحالة
                </label>
                <div className="switch flex gap-5 items-center">
                  <button
                    className={`${status ? "text-leaf-tint bg-leaf" : "text-soil bg-field"} border-border border-2 px-5 py-3 rounded-lg font-bold w-40 cursor-pointer hover:text-leaf-tint hover:bg-leaf`}
                    onClick={(e) => {
                      e.preventDefault();
                      setStatus(true);
                    }}
                  >
                    متوفر
                  </button>
                  <button
                    className={`${!status ? "text-danger-tint bg-danger" : "text-soil bg-field"} border-border border-2 px-5 py-3 rounded-lg font-bold w-40 cursor-pointer hover:text-danger-tint hover:bg-danger`}
                    onClick={(e) => {
                      e.preventDefault();
                      setStatus(false);
                    }}
                  >
                    غير متوفر
                  </button>
                </div>
              </div>
              <div className="desc flex-col flex gap-3 py-3">
                <label className="font-bold text-md" htmlFor="pdesc">
                  وصف مختصر (اختاري)
                </label>
                <textarea
                  className="bg-field p-3 my-1 rounded-lg border-border border-2 h-30"
                  placeholder="اكتب وصفاً قصيراً للمنتج"
                  id="pdesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="submit flex items-center gap-5">
                {/* FIXME: Handle Save Product Btn */}
                <button
                  className="flex-3 border-border border-2 px-5 py-3 rounded-lg font-bold cursor-pointer bg-leaf text-leaf-tint"
                  onClick={(e) => {
                    e.preventDefault();
                    if (validateInputs()) {
                      handleSubmit();
                    }
                  }}
                >
                  حفظ المنتج
                </button>
                <button
                  className="flex-1 border-border border-2 px-5 py-3 rounded-lg font-bold cursor-pointer bg-field"
                  onClick={(e) => {
                    e.preventDefault();
                    resetInputs();
                  }}
                >
                  حذف الحقول
                </button>
              </div>
            </form>
          </div>
          <div className="preview flex-1">
            <div className="head text-soil font-bold py-5">
              <h3>المعاينة كما تظهر للعميل</h3>
            </div>

            <div className="product-card flex flex-col gap-4 overflow-hidden border-2 border-border rounded-lg bg-paper hover:-translate-y-2">
              <div
                className="img-box h-50 flex justify-center items-center text-soil label flex-col cursor-pointer relative"
                style={{
                  backgroundColor: "var(--color-tile-1)",
                }}
              >
                {images[0] ? (
                  <img
                    src={URL.createObjectURL(images[0])}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <PlantIcon
                      className="text-soil"
                      style={{ fontSize: "48px" }}
                    />
                    <span className="text-soil label">صورة المنتج</span>
                  </>
                )}
                <div className="preview absolute left-0 top-0 hover:bg-[#00000050] w-full h-full flex justify-center items-center text-transparent hover:text-soil">
                  <PreviewIcon fontSize="large" />
                </div>
              </div>
              <div className="content-box px-3 py-2 text-soil">
                <AvailableBadge text={category ? category : "القسم"} />
                <h4 className="text-xl font-bold py-2">
                  {title ? title : "اسم المنتج"}
                </h4>
                <p className="body text-muted py-2">
                  {description ? description : "وصف المنتج يظهر هنا."}
                </p>
                <div className="btns py-3 flex flex-col items-center justify-center gap-2">
                  <AddToCartBtn text="اضف الى السلة" onClick={() => {}} />
                  <WhatsappOrderBtn
                    text="اطلب عبر الواتساب"
                    link={whatsappLink}
                    icon={<ChatIcon fontSize="small" />}
                    message={`السلام عليكم، أرغب في طلب:\n${title || "المنتج"}\nالكمية: 1`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
