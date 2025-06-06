import React from "react";
import { ChatAutoComplete, useMessageInputContext } from "stream-chat-react";
import { IoSend } from "react-icons/io5";

function CustomInput() {
  const { handleSubmit } = useMessageInputContext();

  return (
    <div className="str-chat__input-flat str-chat__input-flat--send-button-active">
      <div className="str-chat__input-flat-wrapper">
        <div className="str-chat__input-flat--textarea-wrapper">
          <ChatAutoComplete />
          <div className="str-chat__message-reactions-list">
          </div>
        </div>
        <button onClick={handleSubmit} className="send">
          <IoSend />
        </button>
      </div>
    </div>
  );
}

export default CustomInput;
