const TopBar = () => {
  const mobileNumber = "010123456789";

  return (
    <div className="lg:block hidden py-1.5 text-center bg-soil-deep text-paper">
      عميلنا العزيز لو واجهتك أي مشكلة أو صعوبة في عمل الأوردر برجاء التواصل
      معنا اتصال او واتساب علي {mobileNumber}
    </div>
  );
};

export default TopBar;
