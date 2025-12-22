import React from "react";

export const LoginButton = ({ text = "Login", disabled = false }) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            className={`
                m-4
                w-full
                h-[42px]
                mt-14
                rounded-[14px]
                bg-bluPrimary
                text-white
                text-center
                text-[16px]
                font-marcellus
                drop-shadow
                transition
                ${
                    disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-80 hover:opacity-100 active:scale-95"
                }
            `}
        >
            {text}
        </button>
    );
};
