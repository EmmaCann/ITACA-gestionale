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

const therapistColor = (id = 0) => {
    const palette = [
        "#2563EB",
        "#DC2626",
        "#7C3AED",
        "#F59E0B",
        "#059669",
        "#D946EF",
        "#0EA5E9",
        "#EA580C",
        "#10B981",
        "#9333EA",
        "#14B8A6",
        "#EF4444",
    ];
    if (!id) return "#64748B";
    return palette[(id - 1) % palette.length];
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
    const selectRootRef = useRef(null); // <-- riuso della root del Select
    const { props } = usePage();
    const canEdit = props.canEdit === true;

    const [selectedId, setSelectedId] = useState(null);
    const [therapists, setTherapists] = useState([]);
    const [selectedTherapist, setSelectedTherapist] = useState(null);

    const isDraggingRef = useRef(false);
    const isResizingRef = useRef(false);

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
            const id = p.id ?? p.value; // supporta {id,...} o {value,...}
            const fullName =
                p.nome || p.cognome
                    ? `${p.nome ?? ""} ${p.cognome ?? ""}`.trim()
                    : p.label
                    ? p.label.replace(/^Dr\.?\s*/i, "").trim()
                    : `ID ${id}`;
            return {
                ...p,
                id,
                value: id,
                fullName, // per ricerca/format
                label: p.label ?? `Dr. ${fullName}`, // fallback consistente
                color: therapistColor(Number(id) || 0), // colore coerente con backend
            };
        });

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/terapisti");

                setTherapists(normalizeTerapisti(Object.values(data)));
            } catch (e) {
                console.error(e);
                alert("Errore nel recupero dei terapisti");
            }
        })();
    }, []);

    useEffect(() => {
        const api = calRef.current?.getApi();
        if (!api) return;

        // è sempre un <button>, lo "neutralizziamo"
        const btn = document.querySelector(".fc-therapistFilter-button");
        if (!btn) return;

        // reset totale del bottone FC (niente bg, niente opacity/grayscale)
        btn.classList.remove("fc-button", "fc-button-primary");
        btn.style.background = "transparent";
        btn.style.border = "none";
        btn.style.boxShadow = "none";
        btn.style.padding = "0";
        btn.style.lineHeight = "normal";
        btn.style.opacity = "1";
        btn.style.filter = "none";
        btn.style.color = "inherit"; // non forzare bianco

        // crea la root UNA volta sola
        if (!selectRootRef.current) {
            btn.innerHTML = "";
            selectRootRef.current = ReactDOM.createRoot(btn);
        }
        const root = selectRootRef.current;

        const components = {
            Option: (props) => (
                <div
                    {...props.innerProps}
                    ref={props.innerRef}
                    style={{
                        padding: 8,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            marginRight: 8,
                            backgroundColor: props.data.color,
                        }}
                    />
                    <span>{props.data.label}</span>
                </div>
            ),
            SingleValue: ({ data }) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                        style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            marginRight: 8,
                            backgroundColor: data?.color || "#999",
                        }}
                    />
                    <span>{data?.label || "Tutti i terapisti"}</span>
                </div>
            ),
        };

        root.render(
            <div style={{ all: "unset", display: "inline-block" }}>
                <Select
                    instanceId="therapist-select"
                    options={[
                        {
                            id: null,
                            value: null,
                            label: "Tutti i terapisti",
                            fullName: "Tutti i terapisti",
                            color: "#999",
                        },
                        ...therapists,
                    ]}
                    value={
                        selectedTherapist !== null
                            ? therapists.find(
                                  (o) => o.id === selectedTherapist
                              ) || {
                                  id: null,
                                  value: null,
                                  label: "Tutti i terapisti",
                                  fullName: "Tutti i terapisti",
                                  color: "#999",
                              }
                            : {
                                  id: null,
                                  value: null,
                                  label: "Tutti i terapisti",
                                  fullName: "Tutti i terapisti",
                                  color: "#999",
                              }
                    }
                    onChange={(opt) => {
                        const val = opt?.id ?? opt?.value ?? null;
                        setSelectedTherapist(val);
                        calRef.current?.getApi()?.refetchEvents();
                    }}
                    placeholder="Seleziona terapista"
                    isClearable
                    isSearchable
                    // — come nel tuo snippet —
                    getOptionLabel={(p) =>
                        p.label || `${p.nome} ${p.cognome}`.trim()
                    }
                    getOptionValue={(p) => p.id || p.value}
                    // pallino + testo
                    formatOptionLabel={(opt) => (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    marginRight: 8,
                                    backgroundColor:
                                        opt.color ||
                                        therapistColor(
                                            Number(opt.id || opt.value) || 0
                                        ),
                                }}
                            />
                            <span>{opt.label || `Dr. ${opt.fullName}`}</span>
                        </div>
                    )}
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
                        option: (b, s) => ({
                            ...b,
                            fontSize: 13,
                            color: "#111",
                            backgroundColor: s.isFocused ? "#f3f4f6" : "#fff",
                        }),
                        menu: (b) => ({ ...b, zIndex: 9999, fontSize: 13 }),
                    }}
                />
            </div>
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
                            })
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
                eventSources={[
                    {
                        url: "/appuntamenti",
                        method: "GET",
                        extraParams: () => ({
                            terapista_id: selectedTherapist || "",
                        }),
                    },
                ]}
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
