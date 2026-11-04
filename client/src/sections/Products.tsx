import { useState } from "react";
import { SearchInput } from "../components/Inputs";
import { CategoryTag } from "../components/Tags";
import { ProductCard } from "../components/Cards";
import { products } from "../data/DemoDB";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const [params, setParams] = useSearchParams({ cat: "all", page: "1" });
  const activeTag = params.get("cat") || "all";
  const [search, setSearch] = useState<string>("");
  const [activePage, setActivePage] = useState<string>("1");
  const searchTerm = search.trim().toLocaleLowerCase();

  // FIXME: Change it With The Server Data & I will Send The Active Page to Get The new Products
  const productsCounter = 40;

  const handleChangeCat = (cat: string) => {
    setParams({ cat });
  };

  const handleSearch = (s: string) => {
    setSearch(s);
  };

  const handleNextPage = () => {
    if (Math.ceil(productsCounter / 18) > +activePage) {
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

  return (
    <section>
      <div className="container py-8">
        <h2 className="text-soil py-3">منتجاتنا</h2>
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
        <div className="products-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-5">
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
                .map((product) => (
                  <ProductCard key={product.id} id={product.id} />
                ))
            )
          ) : params.get("cat") !== "all" ? (
            products.filter((item) => item.category === params.get("cat"))
              .length == 0 ? (
              <div className="text-soil font-bold text-xl text-center py-5">
                لا توجد منتجات بهذا القسم
              </div>
            ) : (
              products
                .filter((item) => item.category === params.get("cat"))
                .map((product) => (
                  <ProductCard key={product.id} id={product.id} />
                ))
            )
          ) : products.length == 0 ? (
            <div className="text-soil font-bold text-xl text-center py-5">
              لا توجد منتجات حتى الان
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} id={product.id} />
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
          {Array.from({ length: Math.ceil(productsCounter / 18) }, (_, i) => (
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
          ))}
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

export default Products;
