import {
  ChatsIcon,
  MetaAICircleIcon,
  SettingsIcon,
  UserGroupOutlinedIcon,
  WhatsAppChannelIcon,
  WhatsAppStatusIcon,
} from "../utils/Icons";
import avatar from "../assets/avatar.png";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const pendingFeature = "Feature not yet implemented!";
  const navigate = useNavigate();
  const logout = async () => {
    await customFetch.get("/auth/logout");
    toast.success("Logout Successful");
    navigate("/");
  };
  return (
    <div className="w-16 py-2 flex flex-col justify-between bg-base-100 z-30">
      <div className="flex flex-col items-center gap-2">
        <div
          className="rounded-full bg-base-300 p-2 cursor-pointer tooltip tooltip-right"
          data-tip="Chats"
        >
          <ChatsIcon />
        </div>
        <div
          className="rounded-full hover:bg-base-300 active:bg-base-300 p-2 cursor-pointer tooltip tooltip-right"
          data-tip="Status"
        >
          <WhatsAppStatusIcon onClick={() => toast.info(pendingFeature)} />
        </div>
        <div
          className="rounded-full hover:bg-base-300 active:bg-base-300 p-2 cursor-pointer tooltip tooltip-right"
          data-tip="Channels"
        >
          <WhatsAppChannelIcon onClick={() => toast.info(pendingFeature)} />
        </div>
        <div
          className="rounded-full hover:bg-base-300 active:bg-base-300 p-2 cursor-pointer tooltip tooltip-right"
          data-tip="Communities"
        >
          <UserGroupOutlinedIcon onClick={() => toast.info(pendingFeature)} />
        </div>
        <div className="divider px-1 my-[-0.25rem]"></div>
        <div
          className="rounded-full hover:bg-base-300 active:bg-base-300 p-2 cursor-pointer tooltip tooltip-right"
          data-tip="Meta AI"
        >
          <img
            crossOrigin="anonymous"
            alt=""
            draggable="false"
            tabIndex="-1"
            src="https://static.whatsapp.net/rsrc.php/v4/ye/r/W2MDyeo0zkf.png"
            width={24}
            height={24}
            onClick={()=>toast.info(pendingFeature)}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full hover:bg-base-300 active:bg-base-300 p-2 cursor-pointer dropdown dropdown-right">
          <SettingsIcon
            tabIndex={0}
            onClick={() => toast.info(pendingFeature)}
            role="button"
          />
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a onClick={() => logout()}>Logout</a>
            </li>
          </ul>
        </div>
        <div
          className="rounded-full hover:bg-base-300 active:bg-base-300 p-0.5 cursor-pointer tooltip tooltip-right"
          onClick={() => toast.info(pendingFeature)}
          data-tip="Profile"
        >
          <img src={avatar} alt="avatar" width={28} height={28} />
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
