import React, { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import { MdNotificationAdd } from "react-icons/md";

const NotificationDropdown = ({
    notifiche = [],
    onRead,
    onClose,
    onSend,
    anchorRef,
    mobile = false,
}) => {
    const [style, setStyle] = useState({});

    useEffect(() => {
        if (anchorRef?.current && !mobile) {
            const rect = anchorRef.current.getBoundingClientRect();

            setStyle({
                position: "fixed",
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
                width: 320,
                zIndex: 99999,
            });
        }
    }, [anchorRef, mobile]);
    return (
        <>
            {/* OVERLAY (solo desktop) */}
            {!mobile && (
                <div className="fixed inset-0 z-[9998]" onClick={onClose} />
            )}

            <div
                style={style}
                className={`
                    ${mobile ? "fixed inset-0" : " mt-2 w-[320px] "}
                    z-[9999]
                    bg-white
                    rounded-xl
                    shadow-xl
                    border border-gray-200
                    flex flex-col
                    box-border
                `}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <IoMdNotificationsOutline />
                        <span className="font-marcellus font-semibold">
                            Notifiche
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* SOLO STAFF */}
                        {onSend && (
                            <button
                                onClick={onSend}
                                className="text-gray-500 hover:text-gray-700 transition"
                                title="Invia notifica"
                            >
                                <MdNotificationAdd className="w-5 h-5" />
                            </button>
                        )}

                        {mobile && (
                            <button
                                onClick={onClose}
                                className="text-sm text-gray-500"
                            >
                                Chiudi
                            </button>
                        )}
                    </div>
                </div>

                {/* LISTA */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[360px]">
                    {notifiche.length === 0 && (
                        <div className="text-center text-gray-400 text-sm py-6">
                            Nessuna notifica
                        </div>
                    )}

                    {notifiche.map((n) => (
                        <div
                            key={n.id}
                            className={`
                px-4 py-3 border-b cursor-pointer
                hover:bg-gray-50
                ${n.letta ? "opacity-60" : "bg-gray-50"}
            `}
                            onClick={() => {
                                if (!n.letta) onRead(n.id);
                            }}
                        >
                            <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 pr-2">
                                    <p className="text-sm font-medium">
                                        {n.tipologia ?? "Notifica"}
                                    </p>
                                    {(n.mittente_nome ||
                                        n.mittente_cognome) && (
                                        <p className="text-xs text-gray-500">
                                            da {n.mittente_nome}{" "}
                                            {n.mittente_cognome}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600 [overflow-wrap:anywhere]">
                                        {n.messaggio}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {n.created_at}
                                    </p>
                                </div>

                                {!n.letta && (
                                    <FiCheck className="flex-shrink-0 text-green-500 mt-1" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default NotificationDropdown;
