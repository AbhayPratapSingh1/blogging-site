import { useSelector } from "react-redux";

const Author = () => {
    const user = useSelector((state) => state.login.user);
    return (
        <div className="mx-2 px-2 relative flex">
            <div className="h-12 w-12 overflow-hidden rounded-full ">
                <img src={user?.profilePic?.url} alt="user" />
            </div>
            <div className="flex flex-col items-start justify-center">
                <div className="mx-4 text-[14px]">{user?.name}</div>
                <div className="mx-4 text-[12px] text-gray-500">
                    {user?.name}
                </div>
            </div>
        </div>
    );
};
export default Author;
