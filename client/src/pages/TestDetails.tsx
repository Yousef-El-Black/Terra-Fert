import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type FieldTest = {
  _id: string;
  title: string;
  text: string;
  productId?: string;
  images: string[];
  createdAt?: string;
};

type Product = {
  _id: string;
  title: string;
};

const TestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [test, setTest] = useState<FieldTest | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">(
    "loading",
  );
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    const loadTest = async () => {
      setStatus("loading");
      try {
        const { data } = await axios.get<FieldTest>(
          `${serverUrl}/api/tests/${id}`,
        );
        if (!data?._id) {
          if (active) setStatus("not-found");
          return;
        }

        let linkedProduct: Product | null = null;
        if (data.productId) {
          try {
            const response = await axios.get<Product>(
              `${serverUrl}/api/products/${data.productId}`,
            );
            linkedProduct = response.data;
          } catch (error) {
            console.error("Failed to load linked product:", error);
          }
        }

        if (active) {
          setTest(data);
          setProduct(linkedProduct);
          setActiveImage(0);
          setStatus("ready");
        }
      } catch (error) {
        if (!active) return;
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setStatus("not-found");
        } else {
          console.error("Failed to load field test:", error);
          setStatus("error");
        }
      }
    };

    void loadTest();
    return () => {
      active = false;
    };
  }, [id, retry, serverUrl]);

  if (status === "loading") {
    return (
      <main className="container flex min-h-96 items-center justify-center py-16 text-soil">
        <p role="status">جارٍ تحميل تفاصيل التجربة...</p>
      </main>
    );
  }

  if (status === "not-found") {
    return (
      <main className="container flex min-h-96 flex-col items-center justify-center gap-5 py-16 text-center text-soil">
        <ScienceOutlinedIcon className="text-leaf" fontSize="large" />
        <h1 className="text-2xl font-bold">التجربة غير موجودة</h1>
        <p className="text-muted">قد تكون التجربة حُذفت أو أن الرابط غير صحيح.</p>
        <Link to="/tests" className="font-bold text-leaf underline">
          العودة إلى التجارب
        </Link>
      </main>
    );
  }

  if (status === "error" || !test) {
    return (
      <main className="container flex min-h-96 flex-col items-center justify-center gap-5 py-16 text-center text-soil">
        <p role="alert">تعذر تحميل التجربة. تحقق من اتصالك وحاول مرة أخرى.</p>
        <button
          type="button"
          onClick={() => setRetry((current) => current + 1)}
          className="rounded-lg bg-leaf px-5 py-3 font-bold text-leaf-tint"
        >
          إعادة المحاولة
        </button>
        <Link to="/tests" className="font-bold text-leaf underline">
          العودة إلى التجارب
        </Link>
      </main>
    );
  }

  const images = test.images ?? [];
  const currentImage = images[activeImage];

  return (
    <main className="min-h-screen bg-cream">
      <div className="container py-8 sm:py-12">
        <nav
          aria-label="مسار التنقل"
          className="mb-6 flex items-center gap-2 text-sm text-muted"
        >
          <Link to="/" className="hover:text-soil">
            الرئيسية
          </Link>
          <span>/</span>
          <Link to="/tests" className="hover:text-soil">
            التجارب الحقلية
          </Link>
          <span>/</span>
          <span className="truncate font-bold text-soil">{test.title}</span>
        </nav>

        <article className="overflow-hidden rounded-2xl border border-border bg-paper shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="bg-tile-1">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden">
                {currentImage ? (
                  <img
                    src={`${serverUrl}${currentImage}`}
                    alt={test.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-soil/60">
                    <ScienceOutlinedIcon sx={{ fontSize: 72 }} />
                    <span>لا توجد صورة للتجربة</span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto p-4">
                  {images.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      aria-label={`عرض الصورة ${index + 1}`}
                      aria-pressed={activeImage === index}
                      onClick={() => setActiveImage(index)}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                        activeImage === index
                          ? "border-leaf"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={`${serverUrl}${image}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col p-6 sm:p-10">
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-tile-1 px-3 py-1 text-sm font-bold text-soil">
                <ScienceOutlinedIcon fontSize="small" />
                تجربة حقلية
              </span>
              <h1 className="text-2xl font-extrabold leading-relaxed text-soil sm:text-4xl">
                {test.title}
              </h1>
              {test.createdAt && (
                <time className="mt-3 text-sm text-muted">
                  نُشرت في{" "}
                  {new Date(test.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              <div className="my-6 h-px bg-border" />
              <h2 className="mb-3 text-lg font-bold text-soil">
                تفاصيل التجربة
              </h2>
              <p className="whitespace-pre-line leading-8 text-muted">
                {test.text}
              </p>
              {product && test.productId && (
                <Link
                  to={`/product/${test.productId}`}
                  className="mt-8 flex w-fit items-center gap-3 rounded-lg border border-border bg-field px-4 py-3 text-soil transition hover:bg-tile-1"
                >
                  <GrassOutlinedIcon className="text-leaf" />
                  <span>
                    <span className="block text-xs text-muted">
                      المنتج المرتبط
                    </span>
                    <span className="font-bold">{product.title}</span>
                  </span>
                  <ArrowForwardIcon fontSize="small" />
                </Link>
              )}
            </div>
          </div>
        </article>

        <Link
          to="/tests"
          className="mt-6 inline-flex items-center gap-2 font-bold text-leaf hover:text-soil"
        >
          <ArrowForwardIcon fontSize="small" />
          العودة إلى جميع التجارب
        </Link>
      </div>
    </main>
  );
};

export default TestDetails;
