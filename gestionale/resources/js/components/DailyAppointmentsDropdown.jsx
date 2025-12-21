import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaCheck, FaTimes, FaPen } from "react-icons/fa";

const STATUS_ICON = {
    present: <FaCheck className="text-green-500" />,
    pending: <FaPen className="text-yellow-500" />,
    absent: <FaTimes className="text-red-500" />,
};

export const DailyAppointmentsDropdown = ({ open, onClose, anchorRef }) => {
    const [pos, setPos] = useState(null);

    useEffect(() => {
        if (open && anchorRef?.current) {
            const r = anchorRef.current.getBoundingClientRect();
            setPos({
                top: r.bottom + 8,
                left: r.left,
            });
        }
    }, [open]);

    useEffect(() => {
        const handler = (e) => {
            if (!anchorRef?.current?.contains(e.target)) {
                onClose();
            }
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    if (!open || !pos) return null;

    return createPortal(
        <div
            style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                zIndex: 99999,
            }}
            className="
                w-[380px]
                bg-white
                rounded-2xl
                shadow-2xl
                p-4
                max-h-[420px]
                overflow-y-auto
            "
        >
            {/* TITOLO GLOBALE */}
            <h1 className="mb-3 font-marcellus text-base font-semibold">
                Appuntamenti del giorno:
            </h1>
            <Section
                title="Mattina (08–14)"
                items={[
                    {
                        id: 1,
                        time: "08:30",
                        patient: "Giulio Conti",
                        therapist: "Dr.ssa Crisafulli",
                        status: "present",
                    },
                    {
                        id: 4,
                        time: "10:45",
                        patient: "Giovanni Curti",
                        therapist: "Dr.ssa VErdi",
                        status: "present",
                    },
                ]}
            />

            <Section
                title="Pomeriggio (14–20)"
                items={[
                    {
                        id: 2,
                        time: "15:00",
                        patient: "Alessia Bianchi",
                        therapist: "Dr.ssa Fichera",
                        status: "absent",
                    },
                    {
                        id: 3,
                        time: "15:00",
                        patient: "Veronica Gallo",
                        therapist: "Dr.ssa Motta",
                        status: "pending",
                    },
                ]}
            />
        </div>,
        document.body
    );
};

const groupByTime = (items) => {
    return items.reduce((acc, item) => {
        if (!acc[item.time]) acc[item.time] = [];
        acc[item.time].push(item);
        return acc;
    }, {});
};

const Section = ({ title, items }) => {
    const grouped = groupByTime(items);

    return (
        <div className="mb-4">
            <div className="text-xs font-semibold text-gray-600 mb-2">
                {title}
            </div>

            <div className="space-y-2">
                {Object.entries(grouped).map(([time, records]) => (
                    <div
                        key={time}
                        className="
                            flex
                            bg-gray-50
                            rounded-xl
                            px-3 py-2
                            text-xs
                        "
                    >
                        {/* ORARIO */}
                        <div className="w-[45px] font-bold text-gray-700 pt-1">
                            {time}
                        </div>

                        {/* LISTA RECORD */}
                        <div className="flex-1 space-y-1">
                            {records.map((a) => (
                                <div
                                    key={a.id}
                                    className="
                                        flex items-center justify-between
                                        bg-white
                                        rounded-lg
                                        px-2 py-1
                                        hover:bg-gray-100
                                    "
                                >
                                    <div className="flex gap-1">
                                        <span>{a.patient}</span>
                                        <span className="text-gray-400">–</span>
                                        <span className="italic">
                                            {a.therapist}
                                        </span>
                                    </div>
                                    {STATUS_ICON[a.status]}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
