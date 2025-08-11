import React from "react";
import { IoMdClose } from "react-icons/io";
import { CgDanger } from "react-icons/cg";

/**  ErrorBox  shows a message error and it can be closed using the X icon.
 * params required: text (errore message) and onClick function (close)
 */

export const ErrorBox = ({ text, onClick }) => {
    return (
        <div className="flex items-center justify-center w-auto h-[52px] bg-white rounded-[8px] drop-shadow-md px-2">
            <CgDanger className="text-bluPrimary text-[20px] " />

            <p className=" font-inter text-[14px] text-bluPrimary  px-2  ">
                {text}
            </p>

            <IoMdClose
                className="text-bluPrimary text-[20px]  cursor-pointer"
                onClick={onClick}
            />
        </div>
    );
};

//w-[310px]
