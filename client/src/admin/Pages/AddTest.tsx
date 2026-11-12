import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCallback, useEffect, useState } from "react";
import LabIcon from "@mui/icons-material/AnalyticsOutlined";
import PreviewIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addMsg } from "../../redux/slices/msgSlice";
import { getAdminAuthConfig } from "../utils/adminAuth";

type Product = { _id: string | number; title: string };

const AddTest = () => {
  const dispatch = useDispatch();
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [refProduct, setRefProduct] = useState<{ _id: string | number } | null>(
    null,
  );
  const [images, setImages] = useState<File[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [enableRedBorder, setEnableRedBorder] = useState<boolean>(false);
  const filteredProducts = products.filter((product) =>
    product.title
      .toLocaleLowerCase()
      .includes(productSearch.toLocaleLowerCase()),
  );
  const selectedProduct = products.find(
    (product) => product._id === refProduct?._id,
  );

  const addImagetoList = (img: File) => {
    setImages((prev) => [...prev, img]);
  };

  const removeImageFromList = (img: File) => {
    setImages((prev) => prev.filter((i) => i !== img));
  };

  const resetInputs = () => {
    setImages([]);
    setTitle("");
    setText("");
    setRefProduct(null);
    setProductSearch("");
    setIsProductMenuOpen(false);
  };

  const validateInputs = () => {
    setEnableRedBorder(true);
    if (title && text) {
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

  const getProducts = useCallback(async () => {
    try {
      await axios.get(`${serverUrl}/api/products/`).then((res) => {
        setProducts(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [serverUrl]);

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
          `${serverUrl}/api/tests/`,
          {
            text,
            images: uploadedImages,
            title,
            productId: refProduct?._id,
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
          document.location.assign("/admin/tests");
        })
        .catch((err) => {
          console.error("Failed to create test:", err.response?.data ?? err);
        });
    } catch (error) {
      console.error("Failed to upload test images:", error);
    }
  };

  useEffect(() => {
    void getProducts();
  }, [getProducts]);

  return (
    <section>
      <div className="container py-10">
        <div className="head py-5">
          <h1 className="text-soil py-3">إضافة تجربة جديد</h1>
          <p className="label text-muted">
            أضف بيانات التجربة وسيظهر في صفحة عرض التجارب الحقلية.
          </p>
        </div>
        <div className="content flex gap-5 text-soil flex-col lg:flex-row">
          <div className="form bg-paper p-5 border-2 border-border rounded-lg flex-3">
            <form>
              <div className="imgs">
                <label className="label-lg text-soil pb-3 block">
                  صور التجربة الحقلية
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
                    <h3>اضغط لرفع صور التجربة الحقلية</h3>
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
                <label className="font-bold text-md" htmlFor="ttitle">
                  عنوان التجربة الحقلية
                </label>
                <input
                  className="bg-field p-3 my-1 rounded-lg border-border border-2"
                  type="text"
                  placeholder="عنوان التجربة الحقلية سيوضع برأس الصفحة"
                  id="ttitle"
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
              <div
                className="product flex-col flex gap-3 py-3"
                onBlur={(e) => {
                  if (
                    !(e.relatedTarget instanceof Node) ||
                    !e.currentTarget.contains(e.relatedTarget)
                  ) {
                    setIsProductMenuOpen(false);
                  }
                }}
              >
                <label className="font-bold text-md" htmlFor="tproduct">
                  المنتج المرتبط
                </label>
                <div className="relative">
                  <input
                    id="tproduct"
                    type="text"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={isProductMenuOpen}
                    aria-controls="test-product-options"
                    autoComplete="off"
                    placeholder="ابحث عن منتج..."
                    className="bg-field p-3 my-1 rounded-lg border-border border-2 w-full"
                    value={
                      isProductMenuOpen
                        ? productSearch
                        : (selectedProduct?.title ?? "")
                    }
                    onFocus={() => {
                      setProductSearch("");
                      setIsProductMenuOpen(true);
                    }}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setIsProductMenuOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsProductMenuOpen(false);
                      } else if (e.key === "Enter" && filteredProducts[0]) {
                        e.preventDefault();
                        setRefProduct(filteredProducts[0]);
                        setProductSearch("");
                        setIsProductMenuOpen(false);
                      }
                    }}
                  />
                  {isProductMenuOpen && (
                    <ul
                      id="test-product-options"
                      role="listbox"
                      className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border-2 border-border bg-field shadow-lg"
                    >
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <li key={product._id} role="presentation">
                            <button
                              type="button"
                              role="option"
                              aria-selected={refProduct?._id === product._id}
                              className="w-full cursor-pointer p-3 text-right hover:bg-paper"
                              onClick={() => {
                                setRefProduct(product);
                                setProductSearch("");
                                setIsProductMenuOpen(false);
                              }}
                            >
                              {product.title}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="p-3 text-muted" role="presentation">
                          لا توجد منتجات مطابقة
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div className="desc flex-col flex gap-3 py-3">
                <label className="font-bold text-md" htmlFor="tdesc">
                  النص
                </label>
                <textarea
                  className="bg-field p-3 my-1 rounded-lg border-border border-2 h-30"
                  placeholder="اكتب تفاصل التجربة هنا"
                  id="tdesc"
                  value={text}
                  style={{
                    outlineColor:
                      enableRedBorder && !text ? "#ff0000" : "transparent",
                    outlineWidth: "4px",
                    outlineStyle: enableRedBorder && !text ? "auto" : undefined,
                  }}
                  onChange={(e) => setText(e.target.value)}
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
                  حفظ التجربة
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

            <div className="test-card flex flex-col gap-4 overflow-hidden border-2 border-border rounded-lg bg-paper hover:-translate-y-2">
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
                    <LabIcon
                      className="text-soil"
                      style={{ fontSize: "48px" }}
                    />
                    <span className="text-soil label">
                      صورة التجربة الحقلية
                    </span>
                  </>
                )}
                <div className="preview absolute left-0 top-0 hover:bg-[#00000050] w-full h-full flex justify-center items-center text-transparent hover:text-soil">
                  <PreviewIcon fontSize="large" />
                </div>
              </div>
              <div className="content-box px-3 py-2 text-soil">
                <h4 className="text-xl text-center font-bold py-2">
                  {title ? title : "عنوان التجربة"}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddTest;
