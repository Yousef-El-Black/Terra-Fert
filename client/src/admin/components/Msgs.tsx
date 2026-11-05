import { useEffect, useState } from "react";

// Success Message
export const SuccessMessage = ({ msg }: { msg: string }) => {
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const frame = requestAnimationFrame(() => {
      setActive(true);
      timeout = setTimeout(() => {
        setActive(false);
      }, 3_000);
    });

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [msg]);
  return (
    <div
      className="success-message w-1/2 text-lg mx-auto fixed bottom-10 left-1/2 text-leaf bg-leaf-tint border-2 border-leaf rounded-lg p-5 flex items-center text-center lg:text-start duration-1000 ease-in-out"
      style={{
        transform: `${!active ? "translate(-50% , calc(100% + 40px))" : "translate(-50% , 0)"} `,
      }}
    >
      نجاح : {msg}
    </div>
  );
};

// Error Message
export const ErrorMessage = ({ msg }: { msg: string }) => {
  const [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const frame = requestAnimationFrame(() => {
      setActive(true);
      timeout = setTimeout(() => {
        setActive(false);
      }, 3_000);
    });

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [msg]);
  return (
    <div
      className="success-message w-1/2 text-lg mx-auto fixed bottom-10 left-1/2 text-danger bg-danger-tint border-2 border-danger rounded-lg p-5 flex items-center text-center lg:text-start duration-700"
      style={{
        transform: `${!active ? "translate(-50% , calc(100% + 40px))" : "translate(-50% , 0)"} `,
      }}
    >
      خطأ : {msg}
    </div>
  );
};
