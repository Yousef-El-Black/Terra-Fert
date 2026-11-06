import { useState, useEffect, useCallback } from "react";
import { SearchInput } from "../../components/Inputs";
import { Link, useSearchParams } from "react-router-dom";
import { AddedTestCard } from "../../components/Cards";
import axios from "axios";

interface Test {
  _id: string | number;
  title: string;
  text: string;
  productId: string;
  images: string[];
}

const TestsManagement = () => {
  const serverUrl = import.meta.env.REACT_APP_SERVER_URL;
  const [params, setParams] = useSearchParams({ cat: "all", page: "1" });
  const [search, setSearch] = useState<string>("");
  const [activePage, setActivePage] = useState<string>(
    params.get("page") || "1",
  );
  const [tests, setTests] = useState<Test[]>([]);
  const [testsCounter, setTestsCounter] = useState(0);
  const searchTerm = search.trim().toLocaleLowerCase();

  const maxItems = 30;

  const handleSearch = (s: string) => {
    setSearch(s);
  };

  const handleNextPage = () => {
    if (Math.ceil(testsCounter / maxItems) > +activePage) {
      setActivePage(String(+activePage + 1));
      setParams({ page: String(+activePage + 1) });
    }
  };

  const handlePrevPage = () => {
    if (+activePage > 1) {
      setActivePage(String(+activePage - 1));
      setParams({ page: String(+activePage - 1) });
    }
  };

  const getTests = useCallback(async () => {
    try {
      await axios.get(`${serverUrl}/api/tests/`).then((res) => {
        setTests(res.data);
        setTestsCounter(res.data.length);
      });
    } catch (error) {
      console.log(error);
    }
  }, [serverUrl]);

  useEffect(() => {
    void getTests();
  }, [getTests]);

  return (
    <section>
      <div className="container py-8">
        <div className="flex flex-col-reverse gap-5 lg:flex-row items-center justify-between text-soil py-5">
          <h2 className="text-soil py-3">التجارب الحقلية المضافة</h2>
          <Link
            to="/admin/tests/add/"
            className="border-border border-2 px-5 py-3 rounded-lg font-bold cursor-pointer bg-leaf text-leaf-tint"
          >
            اضافة تجربة جديد
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 justify-between">
          <div className="products-counter text-muted">
            {searchTerm
              ? tests
                  .filter((item) =>
                    item.title.toLocaleLowerCase().includes(searchTerm),
                  )
                  .length.toLocaleString("ar-EG")
              : tests.length.toLocaleString("ar-EG")}{" "}
            تجربة
          </div>
          <div className="search flex justify-center">
            <SearchInput
              placeholder="ابحث عن تجربة..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="tests-container flex flex-col">
          {searchTerm ? (
            tests.filter((item) =>
              item.title.toLocaleLowerCase().includes(searchTerm),
            ).length == 0 ? (
              <div className="text-soil font-bold text-xl text-center py-5">
                لا توجد تجارب بهذا الاسم
              </div>
            ) : (
              tests
                .filter((item) =>
                  item.title.toLocaleLowerCase().includes(searchTerm),
                )
                .slice((+activePage - 1) * maxItems, +activePage * maxItems)
                .map((test) => (
                  <AddedTestCard
                    key={test._id}
                    test={{
                      id: test._id,
                      title: test.title,
                      text: test.text,
                      productId: test.productId,
                      images: test.images,
                    }}
                  />
                ))
            )
          ) : tests.length == 0 ? (
            <div className="text-soil font-bold text-xl text-center py-5">
              لا توجد تجارب حتى الان
            </div>
          ) : (
            tests
              .slice((+activePage - 1) * maxItems, +activePage * maxItems)
              .map((test) => (
                <AddedTestCard
                  key={test._id}
                  test={{
                    id: test._id,
                    title: test.title,
                    text: test.text,
                    productId: test.productId,
                    images: test.images,
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
            { length: Math.ceil(testsCounter / maxItems) },
            (_, i) => (
              <div
                key={i + 1}
                className="px-4 py-3 cursor-pointer hover:bg-paper hover:text-soil-deep text-soil rounded-lg w-fit shadow flex justify-center items-center bg-field"
                onClick={() => {
                  const page = String(i + 1);
                  setActivePage(page);
                  setParams({ page });
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

export default TestsManagement;
