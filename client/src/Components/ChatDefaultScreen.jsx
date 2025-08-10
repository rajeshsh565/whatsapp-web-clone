import whatsappHero from "../assets/whatsapp-hero.png";
import { UnlockIcon } from "../utils/Icons";

const ChatDefaultScreen = () => {
  return (
    <div className="h-full flex flex-col justify-between py-8 gap-6 select-none">
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <img
          src={whatsappHero}
          alt="whatsapp hero image"
          width={300}
          height={300}
        />
        <h1 className="text-3xl w-2/3 px-4 text-center">
          Download WhatsApp for Windows
        </h1>
        <p className=" w-2/4 px-4 text-center text-xs">
          Make calls, share your screen and get a faster experience when you
          download the Windows app.
        </p>
        <button className="btn btn-primary btn-sm">Download</button>
      </div>
      <div className="flex justify-center text-xs items-center">
        <UnlockIcon />
        <p>Your personal messages are not yet end-to-end encrypted</p>
      </div>
    </div>
  )
}
export default ChatDefaultScreen