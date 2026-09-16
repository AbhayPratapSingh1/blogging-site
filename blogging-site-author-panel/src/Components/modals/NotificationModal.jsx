import { useEffect } from "react";
import Portal from "./portal";
import { BiSolidErrorAlt } from "react-icons/bi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function NotificationModal(props) {
  useEffect(() => {
    if (props.modelOpen && !props.error) {
      const timer = setTimeout(() => {
        props.modelClose({ error: false });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [props.modelOpen, props.error, props.modelClose]);

  return (
    <>
      {props.modelOpen && (
        <Portal selector="#modal">
          <div className="fixed z-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-96 p-6">
              <div className="flex flex-col items-center">
                {props.error ? (
                  <BiSolidErrorAlt className="text-red-500 text-5xl mb-4" />
                ) : (
                  <RiVerifiedBadgeFill className="text-green-500 text-5xl mb-4" />
                )}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {props.error ? "Error" : "Success"}
                </h3>
                <p className="text-gray-600 text-center mb-6">{props.message}</p>
                <button
                  onClick={() => props.modelClose({ error: !!props.error })}
                  className={`w-full py-2 rounded-md text-white font-medium ${
                    props.error 
                      ? "bg-red-500 hover:bg-red-600" 
                      : "bg-green-500 hover:bg-green-600"
                  } transition-colors`}
                >
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
