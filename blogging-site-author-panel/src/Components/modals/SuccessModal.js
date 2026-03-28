import Portal from "./portal";
import { BiSolidErrorAlt } from "react-icons/bi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function NotificationModal(props) {
  return (
    <>
      {props.open && (
        <Portal selector="#modal">
          <div className="fixed z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-slate-800 bg-opacity-60 overflow-hidden">
            <div className="w-96 h-72 border-white border-4 bg-green-500 rounded-xl p-2 ">
              <div className="border-green-600 bg-emerald-50 border rounded-xl h-full flex items-center justify-center flex-wrap py-auto overflow-hidden">
                <RiVerifiedBadgeFill className="text-green-600 text-[100px]"/>

                
                <div className="basis-full text-xl  font-semibold">
                  <p className="text-center h-fit">{props.message}</p>
                </div>
                <button onClick={() => props.close()} className="border-green-600 bg-green-500 border-r-4 border-b-4 rounded-md text-xl text-white px-5 py-1.5 my-5">
                 OK
                </button>
              </div>
            </div>

          </div>
        </Portal>
      )}
    </>
  );
}

