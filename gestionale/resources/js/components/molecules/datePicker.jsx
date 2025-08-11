import { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaChevronDown } from "react-icons/fa";

export const DatePicker = () => {
  const today = new Date().toISOString().split("T")[0]; // Data di oggi in formato YYYY-MM-DD
  const [date, setDate] = useState(today);
  const dateInputRef = useRef(null); // Riferimento all'input di tipo date

  // Funzione per cambiare la data manualmente
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  // Funzione per spostarsi avanti o indietro di un giorno
  const changeDate = (days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split("T")[0]); // Aggiorna la data
  };

  // Funzione per aprire il date picker quando si clicca sull'icona del calendario
  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker(); // Apri il selettore di date
    }
  };

  return (
    <div className="flex items-center justify-between bg-bluSecondary text-white  rounded-full px-2 py-1 w-[220px] h-[35px] shadow-lg space-x-1">
      {/* Pulsante sinistro */}
      <button onClick={() => changeDate(-1)} className="p-1 hover:bg-blue-500 rounded-full transition">
        <FaChevronLeft size={12} />
      </button>

      {/* Icona Calendario (Cliccabile per aprire il selettore di date) */}
      <button onClick={openDatePicker} className="p-1">
        <FaCalendarAlt size={14} />
      </button>

      {/* Campo Data Modificabile (senza icona predefinita) */}
      <input
        type="date"
        ref={dateInputRef}
        value={date}
        onChange={handleDateChange}
        className="bg-transparent outline-none text-[14px] text-white text-center font-marcellusSC w-20 cursor-pointer date-input"
      />

      {/* Freccia giù (non funzionante per ora) */}
      <button className="p-1 hover:bg-blue-500 rounded-full transition">
        <FaChevronDown size={12} />
      </button>

      {/* Pulsante destro */}
      <button onClick={() => changeDate(1)} className="p-1 hover:bg-blue-500 rounded-full transition">
        <FaChevronRight size={12} />
      </button>
    </div>
  );
};
