import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { DatePicker } from "./datePicker.jsx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";
import { WelcomeMessage } from "../molecules/atoms/welcomeMessage.jsx";
import { MdNotificationAdd } from "react-icons/md";
import ModalContentInviaNotifica from "../molecules/ModalContentInviaNotifica";
import NotificationDropdown from "../NotificationDropdown.jsx";
import {
    getNotifiche,
    segnaNotificaComeLetta,
} from "../../data/api/notifiche.js";
import { useRef } from "react";

export const TopNavBar = ({ mode = "full" }) => {
    const { props } = usePage();
    const ruolo = props?.ruolo || null;
    const isAdmin = ruolo === "admin";
    const notifRef = useRef(null);

    const iconCls = "w-[20px] h-[20px] mr-4 cursor-pointer";

    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

    const [notifiche, setNotifiche] = useState([]);
    const [nonLette, setNonLette] = useState(0);

    useEffect(() => {
        if (!isAdmin) {
            fetchNotifiche();
        }
    }, []);

    const fetchNotifiche = async () => {
        const res = await getNotifiche();
        setNotifiche(res.data.notifiche);
        setNonLette(res.data.non_lette);
    };

    const handleRead = async (id) => {
        await segnaNotificaComeLetta(id);
        fetchNotifiche();
    };

    /* MOBILE: SOLO DATE PICKER */
    if (mode === "date") {
        return <DatePicker />;
    }

    /* MOBILE: WELCOME + ICONE */
    if (mode === "welcome") {
        return (
            <>
                <WelcomeMessage />

                <div className="flex items-center gap-3 relative">
                    {!isAdmin && (
                        <div className="relative">
                            <IoMdNotificationsOutline
                                className={iconCls}
                                onClick={() => setOpenDropdown(true)}
                            />

                            {nonLette > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {nonLette}
                                </span>
                            )}
                        </div>
                    )}

                    {isAdmin && <FiMessageSquare className={iconCls} />}
                </div>

                {/* MOBILE DROPDOWN (FUORI) */}
                {openDropdown && !isAdmin && (
                    <NotificationDropdown
                        notifiche={notifiche}
                        onRead={handleRead}
                        onClose={() => setOpenDropdown(false)}
                        mobile
                    />
                )}
            </>
        );
    }

    /* DESKTOP FULL */
    return (
        <>
            {/* NAVBAR (opaca, MA SENZA DROPDOWN DENTRO) */}
            <div
                className="
                    bg-navbar opacity-[60%]
                    w-full h-[55px] rounded-[20px]
                    flex items-center shadow-xs px-4 gap-6
                "
            >
                <WelcomeMessage />

                <div className="flex items-center">
                    <DatePicker />
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-4">
                    {!isAdmin && (
                        <div className="relative">
                            <IoMdNotificationsOutline
                                ref={notifRef}
                                className={iconCls}
                                onClick={() => setOpenDropdown(!openDropdown)}
                            />

                            {nonLette > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {nonLette}
                                </span>
                            )}
                        </div>
                    )}

                    {isAdmin && (
                        <MdNotificationAdd
                            className={iconCls}
                            onClick={() => setShowNotificationModal(true)}
                        />
                    )}
                </div>
            </div>

            {/* DESKTOP DROPDOWN (FUORI DALLA NAVBAR) */}
            {openDropdown && !isAdmin && (
                <NotificationDropdown
                    anchorRef={notifRef}
                    notifiche={notifiche}
                    onRead={handleRead}
                    onClose={() => setOpenDropdown(false)}
                />
            )}

            {/* MODAL ADMIN */}
            <ModalContentInviaNotifica
                isOpen={showNotificationModal}
                onRequestClose={() => setShowNotificationModal(false)}
            />
        </>
    );
};
