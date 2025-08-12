import React, { useRef, useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventDetailsModal from "./molecules/EventDetailModal.jsx";

export function CalendarBoard() {
  const calRef = useRef(null);
  const { props } = usePage();
  const canEdit = props.canEdit === true;
  const [selectedId, setSelectedId] = useState(null);
  console.log("props.canEdit =", props.canEdit);
console.log("canEdit =", canEdit);

  // NEW: flag per evitare che il click apra il modal durante drag/resize
  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const handler = () => calRef.current?.getApi()?.refetchEvents();
    window.addEventListener("calendar:refresh", handler);
    return () => window.removeEventListener("calendar:refresh", handler);
  }, []);

  console.log("RENDER: canEdit", canEdit);

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

        /* === DRAG === */
        eventDragStart={() => { isDraggingRef.current = true; }}
        eventDragStop={() => { isDraggingRef.current = false; }}
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
        eventResizeStart={() => { isResizingRef.current = true; }}
        eventResizeStop={() => { isResizingRef.current = false; }}
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

        // /* === CLICK / DOPPIO CLICK === */
        // eventClick={(info) => {
        //   // se sto drag/resize, ignoro il click
        //   if (isDraggingRef.current || isResizingRef.current) return;

        //   // apri solo su DOPPIO click (jsEvent.detail === 2)
        //   if (info.jsEvent?.detail >= 2) {
        //     setSelectedId(info.event.id);
        //   }
        // }}
        eventClick={(info) => setSelectedId(info.event.id)}


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
