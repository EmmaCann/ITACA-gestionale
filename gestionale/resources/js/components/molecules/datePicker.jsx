import { useState, useRef, useEffect } from "react";
import {
    FaChevronLeft,
    FaChevronRight,
    FaCalendarAlt,
    FaChevronDown,
} from "react-icons/fa";
import { DailyAppointmentsDropdown } from "../DailyAppointmentsDropdown.jsx";

// util: format/parsing **locale** (niente UTC)
const formatLocalYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};
const parseYMD = (ymd) => {
    const [y, m, d] = ymd.split("-").map((n) => parseInt(n, 10));
    // costruttore locale (YYYY, M-1, D)
    return new Date(y, (m || 1) - 1, d || 1);
};

export const DatePicker = ({ isAdmin }) => {
    const today = formatLocalYMD(new Date()); // YYYY-MM-DD in locale
    const [date, setDate] = useState(today);
    const dateInputRef = useRef(null);

    // avvisa il calendario di andare ad una data (stringa YYYY-MM-DD)
    const dispatchGoto = (dateStr) => {
        window.dispatchEvent(
            new CustomEvent("calendar:goto", { detail: { date: dateStr } })
        );
    };

    // cambio manuale dal picker
    const handleDateChange = (e) => {
        const value = e.target.value;
        setDate(value);
        dispatchGoto(value);
    };

    // frecce: +/- 1 giorno (in locale)
    const changeDate = (days) => {
        const base = parseYMD(date);
        base.setDate(base.getDate() + days);
        const newDateStr = formatLocalYMD(base);
        setDate(newDateStr);
        dispatchGoto(newDateStr);
    };

    const openDatePicker = () => {
        if (dateInputRef.current?.showPicker) {
            dateInputRef.current.showPicker();
        } else {
            dateInputRef.current?.focus();
            dateInputRef.current?.click();
        }
    };

    // sync: quando il calendario cambia range, aggiorna il datepicker
    useEffect(() => {
        const onDatesSet = (e) => {
            if (e?.detail?.date) setDate(e.detail.date);
        };
        window.addEventListener("calendar:datesSet", onDatesSet);

        // all'avvio, porta anche il calendario ad "oggi"
        dispatchGoto(today);

        return () =>
            window.removeEventListener("calendar:datesSet", onDatesSet);
    }, [today]);

    const [openDaily, setOpenDaily] = useState(false);
    const chevronRef = useRef(null);

    useEffect(() => {
        if (!isAdmin) {
            setOpenDaily(false);
        }
    }, [isAdmin]);

    return (
        <div className=" relative flex items-center justify-between bg-bluSecondary text-white rounded-full px-2 py-1 w-[240px] h-[35px] shadow-lg space-x-1">
            {/* freccia sinistra */}
            <button
                onClick={() => changeDate(-1)}
                className="p-1 hover:bg-blue-500 rounded-full transition"
                aria-label="Giorno precedente"
            >
                <FaChevronLeft size={12} />
            </button>

            {/* icona calendario */}
            <button
                onClick={openDatePicker}
                className="p-1"
                aria-label="Apri selettore data"
            >
                <FaCalendarAlt size={14} />
            </button>

            {/* input data */}
            <input
                type="date"
                ref={dateInputRef}
                value={date}
                onChange={handleDateChange}
                className="bg-transparent outline-none text-[14px] text-white text-center font-marcellusSC w-24 cursor-pointer date-input"
            />
            {isAdmin && (
                <>
                    <span
                        ref={chevronRef}
                        className="p-1 cursor-pointer"
                        onClick={() => setOpenDaily((v) => !v)}
                    >
                        <FaChevronDown size={12} />
                    </span>

                    <DailyAppointmentsDropdown
                        open={openDaily}
                        onClose={() => setOpenDaily(false)}
                        anchorRef={chevronRef}
                    />
                </>
            )}

            {/* freccia destra */}
            <button
                onClick={() => changeDate(1)}
                className="p-1 hover:bg-blue-500 rounded-full transition"
                aria-label="Giorno successivo"
            >
                <FaChevronRight size={12} />
            </button>
        </div>
    );
};
