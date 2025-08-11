// resources/js/components/CalendarBoard.jsx
import React, { useRef, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export function CalendarBoard() {
    const calRef = useRef(null);
    const { props } = usePage();
    const canEdit = props.canEdit === true; // passato dalla rotta /home

    useEffect(() => {
        const handler = () => {
            const api = calRef.current?.getApi();
            api?.refetchEvents(); // <-- QUI richiami gli eventi
        };
        window.addEventListener("calendar:refresh", handler);
        return () => window.removeEventListener("calendar:refresh", handler);
    }, []);

    return (
        <div className="h-full w-full">
            <FullCalendar
                eventDisplay="block"
                ref={calRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                timeZone="local"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                height="100%"
                expandRows
                editable={canEdit}
                eventStartEditable={canEdit}
                eventDurationEditable={canEdit}
                eventResizableFromStart={true}
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
                eventSources={[
                    {
                        url: "/appuntamenti",
                        method: "GET",
                        failure: () =>
                            alert("Errore nel caricamento degli appuntamenti"),
                    },
                ]}
            />
        </div>
    );
}
