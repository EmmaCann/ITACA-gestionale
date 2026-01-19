import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Select from "react-select";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventDetailsModal from "./molecules/EventDetailModal.jsx";

// format YYYY-MM-DD in local time
const formatLocalYMD = (d) => {
    if (!(d instanceof Date)) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const Dot = ({ color }) => (
    <span
        style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            marginRight: 8,
            backgroundColor: color,
            flex: "0 0 auto",
        }}
    />
);

export function CalendarBoard() {
    const calRef = useRef(null);
    const selectRootRef = useRef(null);
    const { props } = usePage();
    const canEdit = props.canEdit === true;

    const [selectedId, setSelectedId] = useState(null);
    const [therapists, setTherapists] = useState([]);
    const [selectedTherapist, setSelectedTherapist] = useState(0);

    useEffect(() => {
        if (calRef.current) {
            calRef.current.getApi().refetchEvents();
        }
    }, [selectedTherapist]);

    const isDraggingRef = useRef(false);
    const isResizingRef = useRef(false);

    const ruolo = props?.ruolo;
    const showTherapistFilter =
        ruolo === "admin" || ruolo === "paziente" || ruolo === "staff";

    // refresh da altri componenti
    useEffect(() => {
        const handler = () => calRef.current?.getApi()?.refetchEvents();
        window.addEventListener("calendar:refresh", handler);
        return () => window.removeEventListener("calendar:refresh", handler);
    }, []);

    // goto da DatePicker
    useEffect(() => {
        const goto = (e) => {
            const dateStr = e?.detail?.date;
            if (!dateStr) return;
            const api = calRef.current?.getApi();
            api?.gotoDate(dateStr);
            api?.refetchEvents();
        };
        window.addEventListener("calendar:goto", goto);
        return () => window.removeEventListener("calendar:goto", goto);
    }, []);

    const normalizeTerapisti = (arr) =>
        (arr || []).map((p) => {
            console.log("🎨 Terapista raw:", p); // ✅ DEBUG
            return {
                value: Number(p.value),
                label: p.label,
                fullName: p.label.replace(/^Dr\.?\s*/i, ""),
                color: p.color || "#999999", // ✅ fallback esplicito
            };
        });

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/terapisti");
                console.log("📡 Risposta /terapisti:", data); // ✅ DEBUG

                const normalized = normalizeTerapisti(Object.values(data));
                console.log("✅ Terapisti normalizzati:", normalized); // ✅ DEBUG
                setTherapists(normalized);
            } catch (e) {
                console.error(e);
                alert("Errore nel recupero dei terapisti");
            }
        })();
    }, []);

    useEffect(() => {
        const api = calRef.current?.getApi();
        if (!api) return;

        const btn = document.querySelector(".fc-therapistFilter-button");
        if (!btn) return;

        // reset totale del bottone FC
        btn.classList.remove("fc-button", "fc-button-primary");
        btn.style.background = "transparent";
        btn.style.border = "none";
        btn.style.boxShadow = "none";
        btn.style.padding = "0";
        btn.style.lineHeight = "normal";
        btn.style.opacity = "1";
        btn.style.filter = "none";
        btn.style.color = "inherit";

        // crea la root UNA volta sola
        if (!selectRootRef.current) {
            btn.innerHTML = "";

            if (showTherapistFilter) {
                selectRootRef.current = ReactDOM.createRoot(btn);
            } else {
                return;
            }
        }

        const root = selectRootRef.current;

        const allOptions = [
            {
                value: 0,
                label: "Tutti i terapisti",
                fullName: "Tutti i terapisti",
                color: "#999",
            },
            ...therapists,
        ];

        console.log("🔄 Re-render Select con options:", allOptions); // ✅ DEBUG

        root.render(
            <div style={{ all: "unset", display: "inline-block" }}>
                <Select
                    instanceId="therapist-select"
                    options={allOptions}
                    value={
                        selectedTherapist && selectedTherapist !== 0
                            ? therapists.find(
                                  (t) => t.value === selectedTherapist,
                              ) || null
                            : null
                    }
                    onChange={(opt) => {
                        console.log("✅ Selezionato:", opt); // ✅ DEBUG
                        setSelectedTherapist(opt ? opt.value : 0);
                    }}
                    placeholder="Seleziona terapista"
                    isClearable
                    isSearchable
                    getOptionLabel={(p) => p.label || p.fullName}
                    getOptionValue={(p) => String(p.value)}
                    components={{
                        Option: (optionProps) => {
                            console.log(
                                "🎨 Option color:",
                                optionProps.data.color,
                            ); // ✅ DEBUG
                            return (
                                <div
                                    {...optionProps.innerProps}
                                    ref={optionProps.innerRef}
                                    style={{
                                        padding: 8,
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: optionProps.isFocused
                                            ? "#f3f4f6"
                                            : "#fff",
                                        cursor: "pointer",
                                    }}
                                >
                                    <Dot
                                        color={optionProps.data.color || "#999"}
                                    />
                                    <span>{optionProps.data.label}</span>
                                </div>
                            );
                        },
                        SingleValue: ({ data }) => (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Dot color={data?.color || "#999"} />
                                <span>
                                    {data?.label || "Tutti i terapisti"}
                                </span>
                            </div>
                        ),
                    }}
                    styles={{
                        container: (b) => ({
                            ...b,
                            minWidth: 220,
                            fontSize: 13,
                        }),
                        control: (b) => ({
                            ...b,
                            minHeight: 30,
                            height: 30,
                            borderRadius: 8,
                        }),
                        valueContainer: (b) => ({ ...b, padding: "0 6px" }),
                        indicatorsContainer: (b) => ({ ...b, padding: 0 }),
                        dropdownIndicator: (b) => ({ ...b, padding: 2 }),
                        clearIndicator: (b) => ({ ...b, padding: 2 }),
                        singleValue: (b) => ({ ...b, color: "#111" }),
                        input: (b) => ({ ...b, color: "#111" }),
                        placeholder: (b) => ({ ...b, color: "#6b7280" }),
                        menu: (b) => ({ ...b, zIndex: 9999, fontSize: 13 }),
                    }}
                />
            </div>,
        );
    }, [therapists, selectedTherapist]);

    const [initialView, setInitialView] = useState("timeGridDay");

    useEffect(() => {
        const updateView = () => {
            const w = window.innerWidth;

            if (w < 600) setInitialView("dayGridMonth");
            else if (w < 900) setInitialView("timeGridWeek");
            else setInitialView("timeGridDay");
        };

        updateView();
        window.addEventListener("resize", updateView);
        return () => window.removeEventListener("resize", updateView);
    }, []);

    return (
        <div className="h-full w-full">
            <FullCalendar
                ref={calRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                // initialView="timeGridDay"
                timeZone="local"
                locale="it"
                // height="100%"
                height="100%"
                contentHeight="auto"
                expandRows={true}
                initialView={initialView}
                eventDisplay="block"
                // expandRows
                editable={canEdit}
                eventStartEditable={canEdit}
                eventDurationEditable={canEdit}
                eventResizableFromStart={true}
                headerToolbar={{
                    left: "today therapistFilter", // contenitore Select
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                customButtons={{
                    therapistFilter: { text: "", click: () => {} },
                }}
                buttonText={{
                    today: "Oggi",
                    month: "Mese",
                    week: "Settimana",
                    day: "Giorno",
                    list: "Lista",
                }}
                datesSet={() => {
                    const api = calRef.current?.getApi();
                    const d = api?.getDate();
                    const dateStr = d ? formatLocalYMD(d) : null;
                    if (dateStr) {
                        window.dispatchEvent(
                            new CustomEvent("calendar:datesSet", {
                                detail: { date: dateStr },
                            }),
                        );
                    }
                }}
                /* === DRAG === */
                eventDragStart={() => {
                    isDraggingRef.current = true;
                }}
                eventDragStop={() => {
                    isDraggingRef.current = false;
                }}
                eventDrop={async (info) => {
                    try {
                        await axios.patch(`/appuntamenti/${info.event.id}`, {
                            start: info.event.start.toISOString(),
                        });
                    } catch (e) {
                        info.revert();
                        alert("Errore nello spostamento appuntamento");
                    }
                }}
                /* === RESIZE === */
                eventResizeStart={() => {
                    isResizingRef.current = true;
                }}
                eventResizeStop={() => {
                    isResizingRef.current = false;
                }}
                eventResize={async (info) => {
                    try {
                        await axios.patch(`/appuntamenti/${info.event.id}`, {
                            start: info.event.start.toISOString(),
                            end: info.event.end?.toISOString(),
                        });
                    } catch (e) {
                        info.revert();
                        alert("Errore nel ridimensionamento della durata");
                    }
                }}
                /* === CLICK === */
                eventClick={(info) => {
                    if (isDraggingRef.current || isResizingRef.current) return;
                    setSelectedId(info.event.id);
                }}
                // eventSources={[
                //     {
                //         url: "/appuntamenti-get",
                //         method: "GET",
                //         credentials: "include",
                //         extraParams: () => {
                //             return selectedTherapist
                //                 ? { terapista_id: selectedTherapist }
                //                 : {};
                //         },

                //         failure: (error) => {
                //             console.error(
                //                 "❌ ERRORE FULLCALENDAR FETCH:",
                //                 error,
                //             );
                //         },
                //         success: (events) => {
                //             // console.log(
                //             //     "✅ FULLCALENDAR HA RICEVUTO EVENTI:",
                //             //     events
                //             // );
                //         },
                //     },
                // ]}
                events={async (info, successCallback, failureCallback) => {
                    try {
                        const params = {};

                        if (selectedTherapist) {
                            params.terapista_id = selectedTherapist;
                        }

                        const res = await axios.get("/appuntamenti-get", {
                            params,
                            withCredentials: true,
                        });

                        successCallback(res.data);
                    } catch (e) {
                        console.error("Errore fetch eventi", e);
                        failureCallback(e);
                    }
                }}
                eventDidMount={(info) => {
                    const bg =
                        info.event.backgroundColor ||
                        info.event.extendedProps?.backgroundColor;
                    const border = info.event.borderColor || bg;
                    const text =
                        info.event.textColor ||
                        info.event.extendedProps?.textColor;

                    if (bg) info.el.style.backgroundColor = bg;
                    if (border) info.el.style.borderColor = border;
                    if (text) info.el.style.color = text;

                    // FullCalendar a volte usa un inner node per il background
                    const main = info.el.querySelector(".fc-event-main");
                    if (main && bg) main.style.backgroundColor = bg;
                    if (main && text) main.style.color = text;
                }}
            />

            {selectedId && (
                <EventDetailsModal
                    id={selectedId}
                    onClose={() => setSelectedId(null)}
                    onChanged={() => calRef.current?.getApi()?.refetchEvents()}
                    canEdit={canEdit}
                />
            )}
        </div>
    );
}
