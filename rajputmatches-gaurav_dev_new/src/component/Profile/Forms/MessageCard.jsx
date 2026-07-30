import React from "react";
import style from "./Form.module.css";
import { useState } from "react";
import { useAuth } from "../../Layout/AuthContext";
import { useNavigate } from "react-router-dom";
import { MdOutlineCancelPresentation } from "react-icons/md";

function MessageCard({ profile, closeMessageCard }) {
  const { updateData } = useAuth();
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleAction = async (action, profileId) => {
    try {
      let data = { message: message, user2: profileId };
      let route = `profile/${action}`;
      await updateData(route, data, true);
      navigate("/message");
    } catch (error) {
      console.error(`Error performing action: ${action}`, error);
    }
  };

  return (
    <div className={style.modalContainer}>
      <div className={style.modalContent}>
        <div className={style.modalHeader}>
          <h4 className={style.headerTitle}>Message</h4>
          <div>
            <MdOutlineCancelPresentation
              onClick={closeMessageCard}
              className={style.closeIcon}
            />
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="row">
              <div className="col-12 align-baseline">
                <textarea
                  id="message"
                  name="message"
                  className="form-control border"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message here"
                />
              </div>
            </div>
          </div>

          <div className={style.modalFooter}>
            <button
              type="button"
              className={`btn btn-primary ${style.saveButton}`}
              onClick={() => handleAction("message", profile._id)}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MessageCard;
