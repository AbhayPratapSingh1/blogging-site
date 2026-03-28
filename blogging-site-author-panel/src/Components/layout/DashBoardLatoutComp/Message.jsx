import { AiOutlineMessage } from "react-icons/ai";

const Message = () => {
    return (
        <div className="px-2 relative w-fit">
            <span className="absolute flex h-3 w-3 right-0 ">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75">
                </span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500">
                </span>
            </span>
            <AiOutlineMessage className="w-8 h-8 border-2 rounded-full p-1 text-2xl text-gray-600" />
        </div>
    );
};

export default Message;
