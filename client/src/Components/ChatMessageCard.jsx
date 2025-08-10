import { MsgStatusReadIcon, MsgStatusSendingIcon } from "../utils/Icons";
import { formatTime12Hour, getDayText } from "../utils/utilMethods";

const ChatMessageCard = ({ dayChanged, msg, currentUser}) => {
  const isOwnMessage = msg.from === currentUser.phone;

  const renderStatusIcon = () => {
    if(!isOwnMessage) return <></>;
    switch(msg.status){
      case 'sending':
        return <MsgStatusSendingIcon className="h-2 w-4"/>
      case 'delivered':
        return <MsgStatusReadIcon className="h-2 w-4"/>
      case 'read':
        return <MsgStatusReadIcon className="text-[#4fb6ec] h-2 w-4"/>
    }
  }

  return (
    <>
      {
        dayChanged && (
          <div className="w-full my-2">
            <div className="rounded-md text-xs bg-base-300 h-6 w-fit mx-auto px-4 flex items-center leading-[1.5rem] sticky">
              <p className="opacity-75">{getDayText(msg.createdAt)}</p>
            </div>
          </div>
        )
      }
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[65%] px-3 py-2 rounded-lg text-sm relative
            ${isOwnMessage ? 'bg-green-900 text-white' : 'bg-base-300 text-white'}`}
        >
          <p className="leading-tight break-words">{msg.text}<span className="inline-block w-14"></span></p>
          <div className="absolute h-2 w-14 right-0 bottom-1 flex items-center justify-center select-none">
            <p className="text-[8px] text-white">{formatTime12Hour(msg.createdAt)}</p>
            {renderStatusIcon()}
          </div>
        </div>
      </div>
    </>
  );

}
export default ChatMessageCard