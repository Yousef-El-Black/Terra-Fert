const PopUp = ({
  text,
  onConfirm,
  onClose,
}: {
  text: string;
  onConfirm: () => void;
  onClose: () => void;
}) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
      <div className="box w-3/4 lg:w-1/2 bg-cream rounded-lg flex-col p-5 items-center justify-center gap-5 z-90">
        <div className="text flex-1 text-soil text-xl text-semibold pb-8">
          {text}
        </div>
        <div className="btns flex items-center gap-5 justify-end">
          <button
            className="flex-3 border-border border-2 px-5 py-3 rounded-lg font-bold cursor-pointer bg-danger text-danger-tint"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            حذف
          </button>
          <button
            className="flex-1 border-border border-2 px-5 py-3 rounded-lg font-bold cursor-pointer bg-field"
            onClick={onClose}
          >
            الغاء
          </button>
        </div>
      </div>
      <div
        className="overlay bg-[#00000030] absolute w-full h-full"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default PopUp;
