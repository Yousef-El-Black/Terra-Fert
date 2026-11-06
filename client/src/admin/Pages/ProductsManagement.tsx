import { useState, useEffect, useCallback } from "react";
import { SearchInput } from "../../components/Inputs";
import { CategoryTag } from "../../components/Tags";
import { Link, useSearchParams } from "react-router-dom";
import { AddedProductCard } from "../../components/Cards";
import axios from "axios";

interface Product {
  _id: string | number;
  title: string;
  category: string;
  unit: string;
  status: string;
  images: string[];
}

const ProductsManagement = () => {
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [params, setParams] = useSearchParams({ cat: "all", page: "1" });
  const activeTag = params.get("cat") || "all";
  const [search, setSearch] = useState<string>("");
  const [activePage, setActivePage] = useState<string>(
    params.get("page") || "1",
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [productsCounter, setProductsCounter] = useState(0);
  const searchTerm = search.trim().toLocaleLowerCase();

  const maxItems = 30;

  // FIXME: Change it With The Server Data & I will Send The Active Page to Get The new Products

  const handleChangeCat = (cat: string) => {
    setParams({ cat });
  };

  const handleSearch = (s: string) => {
    setSearch(s);
  };

  const handleNextPage = () => {
    if (Math.ceil(productsCounter / maxItems) > +activePage) {
      setActivePage(String(+activePage + 1));
      setParams({ cat: activeTag, page: String(+activePage + 1) });
    }
  };

  const handlePrevPage = () => {
    if (+activePage > 1) {
      setActivePage(String(+activePage - 1));
      setParams({ cat: activeTag, page: String(+activePage - 1) });
    }
  };

  const getProducts = useCallback(async () => {
    try {
      await axios.get(`${serverUrl}/api/products/`).then((res) => {
        setProducts(res.data);
        setProductsCounter(res.data.length);
      });
    } catch (error) {
      console.log(error);
    }
  }, [serverUrl]);

  useEffect(() => {
    void getProducts();
  }, [getProducts]);

  return (
    <section>
      <div className="container py-8">
        <div className="flex flex-col-reverse gap-5 lg:flex-row items-center justify-between text-soil py-5">
          <h2 className="text-soil py-3">المنتجات المضافة</h2>
          <Link
            to="/admin/products/add/"
            className="border-border border-2 px-5 py-3 rounded-lg font-bold cursor-pointer bg-leaf text-leaf-tint"
          >
            اضافة منتج جديد
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 justify-between">
          <div className="products-counter text-muted">
            {searchTerm
              ? products
                  .filter((item) =>
                    item.title.toLocaleLowerCase().includes(searchTerm),
                  )
                  .length.toLocaleString("ar-EG")
              : params.get("cat") !== "all"
                ? products
                    .filter((item) => item.category === params.get("cat"))
                    .length.toLocaleString("ar-EG")
                : products.length.toLocaleString("ar-EG")}{" "}
            منتج
          </div>
          <div className="search flex justify-center">
            <SearchInput
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="tags py-3 flex gap-3 overflow-x-auto">
          <CategoryTag
            text="كل المنتجات"
            value="all"
            isActive={activeTag === "all"}
            setActiveTag={handleChangeCat}
          />
          <CategoryTag
            text="مبيدات حشائش"
            value="مبيدات حشائش"
            isActive={activeTag === "مبيدات حشائش"}
            setActiveTag={handleChangeCat}
          />
          <CategoryTag
            text="مبيدات حشرية"
            value="مبيدات حشرية"
            isActive={activeTag === "مبيدات حشرية"}
            setActiveTag={handleChangeCat}
          />
          <CategoryTag
            text="مبيدات فطرية"
            value="مبيدات فطرية"
            isActive={activeTag === "مبيدات فطرية"}
            setActiveTag={handleChangeCat}
          />
          <CategoryTag
            text="مبيدات أكاروسية"
            value="مبيدات أكاروسية"
            isActive={activeTag === "مبيدات أكاروسية"}
            setActiveTag={handleChangeCat}
          />
          <CategoryTag
            text="مبيدات نيماتودا"
            value="مبيدات نيماتودا"
            isActive={activeTag === "مبيدات نيماتودا"}
            setActiveTag={handleChangeCat}
          />
          <CategoryTag
            text="منظمات النمو"
            value="منظمات النمو"
            isActive={activeTag === "منظمات النمو"}
            setActiveTag={handleChangeCat}
          />
          <CategoryTag
            text="مصائد"
            value="مصائد"
            isActive={activeTag === "مصائد"}
            setActiveTag={handleChangeCat}
          />
          <CategoryTag
            text="أسمدة"
            value="أسمدة"
            isActive={activeTag === "أسمدة"}
            setActiveTag={handleChangeCat}
          />
          <CategoryTag
            text="بذور"
            value="بذور"
            isActive={activeTag === "بذور"}
            setActiveTag={handleChangeCat}
          />
          <CategoryTag
            text="مخصبات"
            value="مخصبات"
            isActive={activeTag === "مخصبات"}
            setActiveTag={handleChangeCat}
          />
        </div>
        <div className="products-container flex flex-col">
          {searchTerm ? (
            products.filter((item) =>
              item.title.toLocaleLowerCase().includes(searchTerm),
            ).length == 0 ? (
              <div className="text-soil font-bold text-xl text-center py-5">
                لا توجد منتجات بهذا الاسم
              </div>
            ) : (
              products
                .filter((item) =>
                  item.title.toLocaleLowerCase().includes(searchTerm),
                )
                .slice((+activePage - 1) * maxItems, +activePage * maxItems)
                .map((product) => (
                  <AddedProductCard
                    key={product._id}
                    product={{
                      id: product._id,
                      images: product.images,
                      title: product.title,
                      category: product.category,
                      status: product.status,
                      unit: product.unit,
                    }}
                  />
                ))
            )
          ) : params.get("cat") !== "all" ? (
            products.filter((item) => item.category === params.get("cat"))
              .length == 0 ? (
              <div className="text-soil font-bold text-xl text-center py-5">
                لا توجد منتجات حتى الان بهذا القسم
              </div>
            ) : (
              products
                .filter((item) => item.category === params.get("cat"))
                .slice((+activePage - 1) * maxItems, +activePage * maxItems)
                .map((product) => (
                  <AddedProductCard
                    key={product._id}
                    product={{
                      id: product._id,
                      images: product.images,
                      title: product.title,
                      category: product.category,
                      status: product.status,
                      unit: product.unit,
                    }}
                  />
                ))
            )
          ) : products.length == 0 ? (
            <div className="text-soil font-bold text-xl text-center py-5">
              لا توجد منتجات حتى الان
            </div>
          ) : (
            products
              .slice((+activePage - 1) * maxItems, +activePage * maxItems)
              .map((product) => (
                <AddedProductCard
                  key={product._id}
                  product={{
                    id: product._id,
                    images: product.images,
                    title: product.title,
                    category: product.category,
                    status: product.status,
                    unit: product.unit,
                  }}
                />
              ))
          )}
        </div>
        <div className="change-page-controls flex gap-3 flex-wrap justify-center items-centers">
          <button
            className="prev select-none px-4 py-3 cursor-pointer hover:bg-paper hover:text-soil-deep text-soil rounded-lg w-fit shadow flex justify-center items-center bg-field"
            onClick={handlePrevPage}
          >
            الصفحة السابقة
          </button>
          {Array.from(
            { length: Math.ceil(productsCounter / maxItems) },
            (_, i) => (
              <div
                key={i + 1}
                className="px-4 py-3 cursor-pointer hover:bg-paper hover:text-soil-deep text-soil rounded-lg w-fit shadow flex justify-center items-center bg-field"
                onClick={() => {
                  const page = String(i + 1);
                  setActivePage(page);
                  setParams({ cat: activeTag, page });
                }}
              >
                {i + 1}
              </div>
            ),
          )}
          <button
            className="next select-none px-3 py-3 cursor-pointer hover:bg-paper hover:text-soil-deep text-soil rounded-lg w-fit shadow flex justify-center items-center bg-field"
            onClick={handleNextPage}
          >
            الصفحة التالية
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsManagement;
