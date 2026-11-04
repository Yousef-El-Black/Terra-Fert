const HowSection = () => {
  return (
    <section className="bg-soil py-20">
      <div className="container text-paper">
        <h2 className="pb-4 text-center lg:text-start">كيف تطلب؟</h2>
        <div className="steps flex flex-col lg:flex-row justify-around gap-8 py-8">
          <div className="step flex flex-col items-center lg:items-start gap-4">
            <div className="step-icon bg-wheat text-soil rounded-full w-16 h-16 flex justify-center items-center text-2xl font-bold">
              {(1).toLocaleString("ar-EG")}
            </div>
            <p className="text-xl font-semibold">اختر المنتج</p>
            <span className="label text-cream">
              تصفّح الأقسام أو ابحث بالاسم، وحدّد ما تحتاجه.
            </span>
          </div>
          <div className="step flex flex-col items-center lg:items-start gap-4">
            <div className="step-icon bg-wheat text-soil rounded-full w-16 h-16 flex justify-center items-center text-2xl font-bold">
              {(2).toLocaleString("ar-EG")}
            </div>
            <p className="text-xl font-semibold">اضغط «اطلب عبر واتساب»</p>
            <span className="label text-cream">
              تُفتح محادثة واتساب جاهزة برسالة تحمل اسم المنتج.
            </span>
          </div>
          <div className="step flex flex-col items-center lg:items-start gap-4">
            <div className="step-icon bg-wheat text-soil rounded-full w-16 h-16 flex justify-center items-center text-2xl font-bold">
              {(3).toLocaleString("ar-EG")}
            </div>
            <p className="text-xl font-semibold">أكّد الكمية والاستلام</p>
            <span className="label text-cream">
              نتفق معك على الكمية والسعر وطريقة الاستلام داخل المحادثة.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowSection;
