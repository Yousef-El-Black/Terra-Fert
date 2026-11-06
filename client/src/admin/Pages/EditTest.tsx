import DeleteIcon from "@mui/icons-material/Delete";
import LabIcon from "@mui/icons-material/AnalyticsOutlined";
import PreviewIcon from "@mui/icons-material/RemoveRedEye";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addMsg } from "../../redux/slices/msgSlice";
import { getAdminAuthConfig } from "../utils/adminAuth";

type Product = { _id: string | number; title: string };

type Test = {
  title: string;
  text: string;
  productId?: string;
  images: string[];
};

const EditTest = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [productId, setProductId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [enableRedBorder, setEnableRedBorder] = useState(false);
  const filteredProducts = products.filter((product) =>
    product.title
      .toLocaleLowerCase()
      .includes(productSearch.toLocaleLowerCase()),
  );
  const selectedProduct = products.find(
    (product) => String(product._id) === productId,
  );

  const showError = useCallback((text: string) => {
    dispatch(addMsg({ id: Date.now(), text, type: "error" }));
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;

    axios
      .get<Test>(`${serverUrl}/api/tests/${id}`)
      .then(({ data }) => {
        if (cancelled) return;
        setTitle(data.title);
        setText(data.text);
        setProductId(data.productId ?? "");
        setUploadedImages(data.images ?? []);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load test:", error);
        showError("تعذر تحميل بيانات التجربة");
      });

    axios
      .get<Product[]>(`${serverUrl}/api/products/`)
      .then(({ data }) => {
        if (!cancelled) setProducts(data);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Failed to load products:", error);
        showError("تعذر تحميل المنتجات");
      });

    return () => {
      cancelled = true;
    };
  }, [id, serverUrl, showError]);

  const validateInputs = () => {
    setEnableRedBorder(true);
    if (title.trim() && text.trim()) return true;

    showError("برجاء اكمال الحقول المطلوبة");
    return false;
  };

  const uploadImages = async () =>
    Promise.all(
      images.map(async (image) => {
        const formData = new FormData();
        formData.append("image_input", image);
        const { data } = await axios.post<{ fileInfo: { path: string } }>(
          `${serverUrl}/api/upload/`,
          formData,
          getAdminAuthConfig(),
        );
        return data.fileInfo.path;
      }),
    );

  const handleSubmit = async () => {
    try {
      const newImagePaths = await uploadImages();
      const { data } = await axios.put<Test>(
        `${serverUrl}/api/tests/${id}`,
        {
          title,
          text,
          productId: productId || undefined,
          images: [...uploadedImages, ...newImagePaths],
        },
        getAdminAuthConfig(),
      );
      dispatch(
        addMsg({
          id: Date.now(),
          text: `تم تعديل "${data.title}" بنجاح`,
          type: "success",
        }),
      );
      document.location.assign("/admin/tests/");
    } catch (error) {
      console.error("Failed to update test:", error);
      showError("تعذر حفظ تعديلات التجربة");
    }
  };

  return (
    <section>
      <div className="container py-10">
        <div className="head py-5">
          <h1 className="text-soil py-3">تعديل تجربة حقلية</h1>
          <p className="label text-muted">
            عدل بيانات التجربة وستظهر التغييرات في صفحة التجارب الحقلية.
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
                    accept="image/jpeg,image/png"
                    className="opacity-0 w-full h-full absolute top-0 left-0 block cursor-pointer"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) setImages((current) => [...current, file]);
                      event.currentTarget.value = "";
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
                    {uploadedImages.map((image) => (
                      <div
                        key={image}
                        className="img w-15 h-15 bg-tile-1 rounded-lg border-2 border-border relative overflow-hidden"
                      >
                        <img
                          src={`${serverUrl}${image}`}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          aria-label="حذف الصورة"
                          className="delete-img absolute h-full w-full opacity-0 hover:opacity-60 top-0 left-0 flex justify-center items-center bg-danger-tint text-danger cursor-pointer"
                          onClick={() =>
                            setUploadedImages((current) =>
                              current.filter((item) => item !== image),
                            )
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    ))}
                    {images.map((image) => (
                      <div
                        key={`${image.name}-${image.lastModified}`}
                        className="img w-15 h-15 bg-tile-1 rounded-lg border-2 border-border relative overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          aria-label="حذف الصورة"
                          className="delete-img absolute h-full w-full opacity-0 hover:opacity-60 top-0 left-0 flex justify-center items-center bg-danger-tint text-danger cursor-pointer"
                          onClick={() =>
                            setImages((current) =>
                              current.filter((item) => item !== image),
                            )
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    ))}
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
                  id="ttitle"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
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
                onBlur={(event) => {
                  if (
                    !(event.relatedTarget instanceof Node) ||
                    !event.currentTarget.contains(event.relatedTarget)
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
                    onChange={(event) => {
                      setProductSearch(event.target.value);
                      setProductId("");
                      setIsProductMenuOpen(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setIsProductMenuOpen(false);
                      } else if (event.key === "Enter" && filteredProducts[0]) {
                        event.preventDefault();
                        setProductId(String(filteredProducts[0]._id));
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
                              aria-selected={productId === String(product._id)}
                              className="w-full cursor-pointer p-3 text-right hover:bg-paper"
                              onClick={() => {
                                setProductId(String(product._id));
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
                  id="tdesc"
                  value={text}
                  style={{
                    outlineColor:
                      enableRedBorder && !text ? "#ff0000" : "transparent",
                    outlineWidth: "4px",
                    outlineStyle: enableRedBorder && !text ? "auto" : undefined,
                  }}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>
              <div className="submit flex items-center gap-5">
                <button
                  className="flex-3 border-border border-2 px-5 py-3 rounded-lg font-bold cursor-pointer bg-leaf text-leaf-tint"
                  onClick={(event) => {
                    event.preventDefault();
                    if (validateInputs()) void handleSubmit();
                  }}
                >
                  حفظ التعديلات
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
                style={{ backgroundColor: "var(--color-tile-1)" }}
              >
                {images[0] || uploadedImages[0] ? (
                  <img
                    src={
                      images[0]
                        ? URL.createObjectURL(images[0])
                        : `${serverUrl}${uploadedImages[0]}`
                    }
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
                  {title || "عنوان التجربة"}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditTest;
