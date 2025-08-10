import { EditIcon, BellIcon, XIcon, StarIcon, DisappearingMsgIcon, ShieldIcon, UnlockIcon, HeartIcon, BlockIcon, ThumbsDownIcon, BinIcon } from "../utils/Icons";
import avatar from "../assets/avatar.png";
import { useDashboardContext } from "../Pages/Dashboard";

const ContactInfo = ({ closeContactInfo }) => {
  const { counterParty } = useDashboardContext();

  const renderSettingsItem = (Icon, label, labelInfo, toggle) => {
    return (
      <li className="flex items-center h-14 cursor-pointer gap-2 w-full">
        <Icon className="w-7 h-7"/>
        <div className="flex flex-col w-full">
          <label className="flex justify-between w-full cursor-pointer" htmlFor="toggle-btn">
            {label}
            {toggle && <input type="checkbox" id="toggle-btn" className="toggle toggle-sm"/>}
          </label>
          <p className="text-sm opacity-75">{labelInfo}</p>
        </div>
      </li>
    )
  }

  const renderActionsItem = (Icon, label, danger) => {
    return (
      <li className="flex items-center h-14 cursor-pointer gap-2 w-full hover:bg-base-100 active:bg-base-100 rounded-lg">
        <Icon className={`w-7 h-7 ${danger ? 'text-red-300': ''}`}/>
        <span className={`${danger ? 'text-error': ''}`}>{label}</span>
      </li>
    )
  }

  return (
    <div className="border-l border-l-gray-700 h-full w-full bg-base-300 select-none">
      {/* Contact Info Header */}
      <div className="flex justify-between items-center min-h-14 max-h-14 px-4 select-none">
        <div className="flex gap-4 items-center w-full">
          <button className="btn btn-ghost px-1" onClick={closeContactInfo}>
            <XIcon/>
          </button>
          <h1 className="text-lg font-bold text-start w-full">
            Contact info
          </h1>
        </div>
        <div className="flex gap-2 items-center">
          <div className="cursor-pointer rounded-full hover:bg-base-100 active:bg-base-100 p-2" onClick={()=>toast.info(pendingFeature)}>
            <EditIcon />
          </div>
        </div>
      </div>
      {/* Contact Details */}
      <div className="flex flex-col overflow-auto h-[calc(100vh-56px)]">
        <div className="w-full h-72 p-4 flex flex-col justify-between select-text">
          <div className="flex flex-col justify-center items-center">
          <img src={avatar} alt="avatar" className="w-32 h-32 rounded-full"/>
          <h1 className="text-xl">{counterParty.name}</h1>
          <p className="text-xs opacity-75 mt-2">{'+91 '+counterParty.phone?.slice(0, 5)+' '+counterParty.phone?.slice(5)}</p>
          </div>
          <div className="w-full">
            <p className="text-xs opacity-75 mb-2 select-none">About</p>
            <p className="text-sm"> Hey there! I'm not online.</p>
          </div>
        </div>
        {/* Divider */}
        <div className="divider mx-4 my-0"></div>
        {/* Chat Settings */}
        <ul className="px-4 py-2 h-72 flex flex-col w-full">
          {renderSettingsItem(StarIcon, 'Starred Messages')}
          {renderSettingsItem(BellIcon, 'Mute notifications', '', true)}
          {renderSettingsItem(DisappearingMsgIcon, 'Disappearing Messages', 'Off')}
          {renderSettingsItem(ShieldIcon, 'Advanced Chat Privacy', 'Off')}
          {renderSettingsItem(UnlockIcon, 'Encryption', 'Messages are not yet end-to-end encrypted.')}
        </ul>
        {/* Divider */}
        <div className="divider mx-4 my-0"></div>
        <ul className="px-4 py-2 h-72 flex flex-col w-full mb-4">
          {renderActionsItem(HeartIcon, 'Add to Favourites')}
          {renderActionsItem(BlockIcon, `Block ${counterParty?.name}`, true)}
          {renderActionsItem(ThumbsDownIcon, `Report ${counterParty?.name}`, true)}
          {renderActionsItem(BinIcon, 'Delete chat', true)}
        </ul>
      </div>
    </div>
  )
}
export default ContactInfo;