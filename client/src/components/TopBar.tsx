import { useWhatsAppSettings } from "./useWhatsAppSettings";

const TopBar = () => {
  const { contactNumber } = useWhatsAppSettings();

  return (
    <div className="lg:block hidden py-1.5 text-center bg-soil-deep text-paper">
      {contactNumber && (
        <>
          عميلنا العزيز لو واجهتك أي مشكلة أو صعوبة في عمل الأوردر برجاء التواصل
          معنا اتصال او واتساب علي{" "}
          <a
            href={`tel:${contactNumber.replace(/[^\d+]/g, "")}`}
            dir="ltr"
            className="font-bold underline"
          >
            {contactNumber}
          </a>
        </>
      )}
    </div>
  );
};

export default TopBar;
