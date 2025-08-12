import React, { useRef, useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventDetailsModal from "./molecules/EventDetailModal.jsx";

// format YYYY-MM-DD in **local time**
const formatLocalYMD = (d) => {
  if (!(d instanceof Date)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export function CalendarBoard() {
  const calRef = useRef(null);
  const { props } = usePage();
  const canEdit = props.canEdit === true;
  const [selectedId, setSelectedId] = useState(null);

  // per evitare click durante drag/resize
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const handler = () => calRef.current?.getApi()?.refetchEvents();
    window.addEventListener("calendar:refresh", handler);
    return () => window.removeEventListener("calendar:refresh", handler);
  }, []);

  // ascolta la data dal DatePicker e naviga
  useEffect(() => {
    const goto = (e) => {
      const dateStr = e?.detail?.date; // "YYYY-MM-DD"
      if (!dateStr) return;
      const api = calRef.current?.getApi();
      api?.gotoDate(dateStr); // naviga alla data
      api?.refetchEvents();   // opzionale
    };
    window.addEventListener("calendar:goto", goto);
    return () => window.removeEventListener("calendar:goto", goto);
  }, []);

  return (
    <div className="h-full w-full">
      <FullCalendar
        eventDisplay="block"
        ref={calRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        timeZone="local"
        locale="it"
        headerToolbar={{
          left: "today", // tieni solo Oggi
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Oggi",
          month: "Mese",
          week: "Settimana",
          day: "Giorno",
          list: "Lista",
        }}
        height="100%"
        expandRows
        editable={canEdit}
        eventStartEditable={canEdit}
        eventDurationEditable={canEdit}
        eventResizableFromStart={true}
        // Sync inverso: quando cambia la vista/range, aggiorna il DatePicker (in locale)
        datesSet={() => {
          const api = calRef.current?.getApi();
          const d = api?.getDate(); // Date centrata sulla vista
          const dateStr = d ? formatLocalYMD(d) : null;
          if (dateStr) {
            window.dispatchEvent(
              new CustomEvent("calendar:datesSet", { detail: { date: dateStr } })
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
            failure: () => alert("Errore nel caricamento degli appuntamenti"),
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
