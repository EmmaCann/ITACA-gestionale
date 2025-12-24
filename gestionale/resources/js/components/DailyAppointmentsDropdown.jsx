import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getAppuntamentiGiorno } from "../data/api/appuntamenti.js";
import { FaCheck, FaTimes, FaPen } from "react-icons/fa";

const STATUS_ICON = {
    present: <FaCheck className="text-green-500" />,
    pending: <FaPen className="text-yellow-500" />,
    absent: <FaTimes className="text-red-500" />,
};



/* ✅ COMPONENTE SECTION – FUORI */
const Section = ({ title, grouped }) => {
    if (!grouped || Object.keys(grouped).length === 0) return null;

    return (
        <div className="mb-4">
            <div className="text-xs font-semibold text-gray-600 mb-2">
                {title}
            </div>

            <div className="space-y-2">
                {Object.entries(grouped).map(([time, items]) => (
                    <div key={time} className="space-y-1">
                        <div className="text-xs font-bold text-gray-700">
                            {time}
                        </div>

                        {items.map((a) => (
                            <div
                                key={a.id}
                                className="
                                    flex items-center justify-between
                                    bg-gray-50
                                    rounded-lg px-3 py-2
                                    text-xs
                                    hover:bg-gray-100
                                "
                            >
                                <div className="flex flex-col">
                                    <span>{a.paziente}</span>
                                    <span className="italic text-gray-400">
                                        {a.terapista}
                                    </span>
                                </div>

                                {STATUS_ICON[a.status]}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const DailyAppointmentsDropdown = ({
    open,
    onClose,
    anchorRef,
    date,
}) => {
    const [pos, setPos] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const isEmpty =
    data &&
    (!data.mattina || Object.keys(data.mattina).length === 0) &&
    (!data.pomeriggio || Object.keys(data.pomeriggio).length === 0);

    /* posizione */
    useEffect(() => {
        if (open && anchorRef?.current) {
            const r = anchorRef.current.getBoundingClientRect();
            const dropdownWidth = 380;
            const padding = 12;
            const viewportWidth = window.innerWidth;
            let left = r.left;
            if (left + dropdownWidth > viewportWidth) {
                left = viewportWidth - dropdownWidth - padding;
            }
            if (left < padding) left = padding;

            setPos({
                top: r.bottom + 8,
                left,
            });
        }
    }, [open]);

    /* fetch dati */
    useEffect(() => {
        if (!open || !date) return;

        setLoading(true);
        getAppuntamentiGiorno(date)
            .then((res) => setData(res.data))
            .catch((err) => console.error("Errore appuntamenti giorno:", err))
            .finally(() => setLoading(false));
    }, [open, date]);

    /* click outside */
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
            <h1 className="mb-3 font-marcellus text-base font-bold">
                Appuntamenti del giorno
            </h1>

            {loading && (
                <div className="text-sm text-gray-500">Caricamento…</div>
            )}

            {!loading && data && (
                <>
                    <Section title="Mattina (08–14)" grouped={data.mattina} />
                    <Section
                        title="Pomeriggio (14–20)"
                        grouped={data.pomeriggio}
                    />
                </>
            )}
            {!loading && data && isEmpty && (
                <div className="text-sm text-gray-500 italic text-center py-6">
                    Nessun appuntamento per questa giornata
                </div>
            )}
        </div>,
        document.body
    );
};
