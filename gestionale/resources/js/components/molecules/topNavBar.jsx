import React, { useState, useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { DatePicker } from "./datePicker.jsx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdNotificationAdd } from "react-icons/md";
import { WelcomeMessage } from "../molecules/atoms/welcomeMessage.jsx";
import ModalContentInviaNotifica from "../molecules/ModalContentInviaNotifica";
import NotificationDropdown from "../NotificationDropdown.jsx";
import {
    getNotifiche,
    segnaNotificaComeLetta,
} from "../../data/api/notifiche.js";

export const TopNavBar = ({ mode = "full" }) => {
    const { props } = usePage();
    const ruolo = props?.ruolo || null;

    const isAdmin = ruolo === "admin";
    const isStaff = ruolo === "staff";
    const isPatient = ruolo === "paziente";

    const notifRef = useRef(null);

    const iconCls = "w-[20px] h-[20px] mr-4 cursor-pointer";

    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [notifiche, setNotifiche] = useState([]);
    const [nonLette, setNonLette] = useState(0);

    useEffect(() => {
        fetchNotifiche();
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
    const handleSendNotification = () => {
        setOpenDropdown(false); // chiude dropdown
        setShowNotificationModal(true); // apre modal
    };

    /* MOBILE: SOLO DATE PICKER */
    if (mode === "date") {
        return <DatePicker isAdmin={isAdmin} />;
    }

    /* MOBILE: WELCOME + ICONE */
    if (mode === "welcome") {
        return (
            <>
                <WelcomeMessage />

                <div className="flex items-center gap-3 relative">
                    {/* TUTTI */}
                    <div ref={notifRef} className="relative">
                        <IoMdNotificationsOutline
                            className={iconCls}
                            onClick={() => setOpenDropdown((prev) => !prev)}
                        />

                        {nonLette > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {nonLette}
                            </span>
                        )}
                    </div>

                    {/* ADMIN → ICONA INVIA */}
                    {isAdmin && (
                        <MdNotificationAdd
                            className={`${iconCls} text-gray-500`}
                            onClick={() => setShowNotificationModal(true)}
                        />
                    )}
                </div>

                {/* DROPDOWN MOBILE (SOLO STAFF + PAZIENTE) */}
                {openDropdown && !isAdmin && (
                    <NotificationDropdown
                        notifiche={notifiche}
                        onRead={handleRead}
                        onClose={() => setOpenDropdown(false)}
                        onSend={isStaff ? handleSendNotification : undefined}
                        mobile
                    />
                )}

                {/* MODAL (ADMIN + STAFF) */}
                <ModalContentInviaNotifica
                    isOpen={showNotificationModal}
                    onRequestClose={() => setShowNotificationModal(false)}
                />
            </>
        );
    }

    /* DESKTOP FULL */
    return (
        <>
            <div className="bg-navbar opacity-[60%] w-full h-[55px] rounded-[20px] flex items-center shadow-xs px-4 gap-6">
                <WelcomeMessage />

                <DatePicker isAdmin={isAdmin} />

                <div className="flex-1" />

                <div className="flex items-center gap-4">
                    {/* TUTTI */}
                    <div ref={notifRef} className="relative">
                        <IoMdNotificationsOutline
                            className={iconCls}
                            onClick={() => setOpenDropdown((prev) => !prev)}
                        />

                        {nonLette > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {nonLette}
                            </span>
                        )}
                    </div>

                    {/* ADMIN */}
                    {isAdmin && (
                        <MdNotificationAdd
                            className={iconCls}
                            onClick={() => setShowNotificationModal(true)}
                        />
                    )}
                </div>
            </div>

            {/* DROPDOWN DESKTOP */}
            {openDropdown && (
                <NotificationDropdown
                    anchorRef={notifRef}
                    notifiche={notifiche}
                    onRead={handleRead}
                    onClose={() => setOpenDropdown(false)}
                    onSend={isStaff ? handleSendNotification : undefined}
                />
            )}

            {/* MODAL */}
            <ModalContentInviaNotifica
                isOpen={showNotificationModal}
                onRequestClose={() => setShowNotificationModal(false)}
            />
        </>
    );
};
