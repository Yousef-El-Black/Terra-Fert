import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

const Tests = () => {
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [tests, setTests] = useState<FieldTest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    const loadPageData = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const [testsResponse, productsResponse] = await Promise.all([
          axios.get<FieldTest[]>(`${serverUrl}/api/tests/`),
          axios.get<Product[]>(`${serverUrl}/api/products/`),
        ]);
        if (active) {
          setTests(testsResponse.data);
          setProducts(productsResponse.data);
        }
      } catch (loadError) {
        console.error("Failed to load field tests:", loadError);
        if (active) setError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadPageData();
    return () => {
      active = false;
    };
  }, [retry, serverUrl]);

  const productTitles = useMemo(
    () => new Map(products.map((product) => [product._id, product.title])),
    [products],
  );
  const filteredTests = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return tests;
    return tests.filter((test) =>
      `${test.title} ${test.text}`.toLocaleLowerCase().includes(term),
    );
  }, [search, tests]);

  return (
    <main className="min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-soil-deep text-field">
        <div className="pointer-events-none absolute -left-20 -top-28 h-80 w-80 rounded-full bg-leaf opacity-10 blur-3xl" />
        <div className="container relative py-14 sm:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              <ScienceOutlinedIcon fontSize="small" />
              خبرة عملية من أرض الواقع
            </div>
            <h1 className="mb-5 text-3xl font-extrabold leading-tight sm:text-5xl">
              التجارب الحقلية
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              اكتشف نتائج تطبيق المنتجات الزراعية في الحقول، وتعرّف على التجارب
              العملية المرتبطة بكل منتج.
            </p>
            <div className="mt-8 flex items-center gap-3 text-white/80">
              <GrassOutlinedIcon />
              <span>{tests.length.toLocaleString("ar-EG")} تجربة موثقة</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 sm:py-14">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-soil sm:text-3xl">
              نتائج من الميدان
            </h2>
            <p className="mt-2 text-muted">
              تصفح التجارب وابحث عن المنتج أو المعلومة التي تهمك.
            </p>
          </div>
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">ابحث في التجارب</span>
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="ابحث عن تجربة أو منتج..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border-2 border-border bg-paper py-3 pe-11 ps-4 text-soil outline-none transition focus:border-leaf indent-8"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border bg-paper"
              >
                <div className="h-56 animate-pulse bg-tile-1" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-field" />
                  <div className="h-4 animate-pulse rounded bg-field" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-field" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-border bg-paper px-6 py-12 text-center">
            <p className="mb-5 font-bold text-soil">
              تعذر تحميل التجارب حاليًا. تحقق من اتصالك وحاول مرة أخرى.
            </p>
            <button
              type="button"
              onClick={() => setRetry((current) => current + 1)}
              className="rounded-lg bg-leaf px-5 py-3 font-bold text-leaf-tint"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : tests.length === 0 ? (
          <div className="rounded-xl border border-border bg-paper px-6 py-16 text-center">
            <ScienceOutlinedIcon className="mb-3 text-leaf" fontSize="large" />
            <h3 className="text-xl font-bold text-soil">
              لا توجد تجارب منشورة بعد
            </h3>
            <p className="mt-2 text-muted">
              ستظهر التجارب الحقلية هنا عند نشرها.
            </p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="rounded-xl border border-border bg-paper px-6 py-12 text-center text-soil">
            لا توجد تجارب تطابق بحثك. جرّب كلمات أخرى.
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">
              عرض {filteredTests.length.toLocaleString("ar-EG")} من{" "}
              {tests.length.toLocaleString("ar-EG")} تجربة
            </p>
            <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredTests.map((test) => {
                const image = test.images?.[0];
                const productTitle = test.productId
                  ? productTitles.get(test.productId)
                  : undefined;

                return (
                  <Link
                    to={`/tests/${test._id}`}
                    aria-label={`عرض تفاصيل تجربة ${test.title}`}
                    key={test._id}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-paper shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf"
                  >
                    <div className="relative h-56 overflow-hidden bg-tile-1">
                      {image ? (
                        <img
                          src={`${serverUrl}${image}`}
                          alt={test.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-soil/60">
                          <ScienceOutlinedIcon sx={{ fontSize: 56 }} />
                          <span className="text-sm">تجربة حقلية</span>
                        </div>
                      )}
                      <span className="absolute right-4 top-4 rounded-full bg-paper/95 px-3 py-1 text-xs font-bold text-soil shadow">
                        تجربة ميدانية
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {productTitle && (
                        <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-tile-1 px-3 py-1 text-xs font-bold text-soil">
                          <GrassOutlinedIcon fontSize="small" />
                          {productTitle}
                        </span>
                      )}
                      <h3 className="text-xl font-bold leading-relaxed text-soil">
                        {test.title}
                      </h3>
                      {test.createdAt && (
                        <time className="mt-2 text-xs text-muted">
                          {new Date(test.createdAt).toLocaleDateString("ar-EG")}
                        </time>
                      )}
                      <p className="mt-4 whitespace-pre-line leading-7 text-muted">
                        {test.text}
                      </p>
                      <div className="mt-auto pt-5">
                        <span className="inline-flex items-center gap-2 font-bold text-leaf group-hover:text-soil">
                          عرض تفاصيل التجربة
                          <ArrowBackIcon fontSize="small" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Tests;
