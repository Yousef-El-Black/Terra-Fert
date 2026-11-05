import { useSelector, useDispatch } from "react-redux";
import { ErrorMessage, SuccessMessage } from "./Msgs";
import { deleteMsg } from "../../redux/slices/msgSlice";

type MsgType = {
  id: string | number;
  text: string;
  type: "error" | "success";
};

const MsgsContainer = () => {
  const dispatch = useDispatch();
  const msgs = useSelector(
    (state: { msg: { value: MsgType[] } }) => state.msg.value,
  );

  const deleteMessage = (id: string | number) => {
    setTimeout(() => {
      dispatch(deleteMsg(id));
    }, 3_700);
  };

  return (
    <>
      {msgs.map((msg: MsgType) => {
        deleteMessage(msg.id);
        return (
          <>
            {msg.type === "error" ? (
              <ErrorMessage msg={msg.text} key={msg.id} />
            ) : (
              <SuccessMessage msg={msg.text} key={msg.id} />
            )}
          </>
        );
      })}
    </>
  );
};

export default MsgsContainer;
