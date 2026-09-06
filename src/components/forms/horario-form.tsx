"use client";

import { Horario } from "@/types";
import { useState } from "react";

interface HorarioFormProps {
  horario: Horario;
  onChange: (horario: Horario) => void;
  onEliminar: () => void;
  diaOcupado?: boolean;
}

const DIAS: Horario["dia"][] = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

const DIAS_DISPLAY: Record<Horario["dia"], string> = {
  lunes: "Lunes",
  martes: "Martes",
  miércoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sábado: "Sábado",
  domingo: "Domingo",
};

export function HorarioForm({
  horario,
  onChange,
  onEliminar,
  diaOcupado = false,
}: HorarioFormProps) {
  const [errores, setErrores] = useState<{
    horarios?: string;
    dia?: string;
  }>({});

  /**
   * Validar que horaFin > horaInicio
   */
  const validarHoras = (inicio: string, fin: string): boolean => {
    if (!inicio || !fin) return true; // No validar si está vacío

    if (fin <= inicio) {
      setErrores((prev) => ({
        ...prev,
        horarios: "La hora final debe ser mayor a la inicial",
      }));
      return false;
    }
    setErrores((prev) => ({ ...prev, horarios: undefined }));
    return true;
  };

  const handleDiaChange = (nuevoDia: Horario["dia"]) => {
    if (diaOcupado && nuevoDia !== horario.dia) {
      setErrores((prev) => ({
        ...prev,
        dia: `Ya existe un horario para ${DIAS_DISPLAY[nuevoDia]}`,
      }));
      return;
    }
    setErrores((prev) => ({ ...prev, dia: undefined }));
    onChange({ ...horario, dia: nuevoDia });
  };

  const handleInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoInicio = e.target.value;
    onChange({ ...horario, horaInicio: nuevoInicio });
    validarHoras(nuevoInicio, horario.horaFin);
  };

  const handleFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoFin = e.target.value;
    onChange({ ...horario, horaFin: nuevoFin });
    validarHoras(horario.horaInicio, nuevoFin);
  };

  return (
    <div className="space-y-3 border rounded-lg p-4 bg-gray-50 border-gray-200">
      {/* Día */}
      <div>
        <label
          htmlFor={`dia-${horario.id}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Día
        </label>
        <select
          id={`dia-${horario.id}`}
          value={horario.dia}
          onChange={(e) => handleDiaChange(e.target.value as Horario["dia"])}
          className={`w-full border rounded-lg px-3 py-2 text-sm transition focus:outline-none focus:ring-2 ${
            errores.dia
              ? "border-red-500 bg-red-50 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        >
          {DIAS.map((dia) => (
            <option key={dia} value={dia}>
              {DIAS_DISPLAY[dia]}
            </option>
          ))}
        </select>
        {errores.dia && (
          <p className="text-red-600 text-xs mt-1">{errores.dia}</p>
        )}
      </div>

      {/* Horas */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`inicio-${horario.id}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Desde
          </label>
          <input
            id={`inicio-${horario.id}`}
            type="time"
            value={horario.horaInicio}
            onChange={handleInicioChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm transition focus:outline-none focus:ring-2 ${
              errores.horarios
                ? "border-red-500 bg-red-50 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        <div>
          <label
            htmlFor={`fin-${horario.id}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hasta
          </label>
          <input
            id={`fin-${horario.id}`}
            type="time"
            value={horario.horaFin}
            onChange={handleFinChange}
            className={`w-full border rounded-lg px-3 py-2 text-sm transition focus:outline-none focus:ring-2 ${
              errores.horarios
                ? "border-red-500 bg-red-50 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>
      </div>

      {/* Error de horas */}
      {errores.horarios && (
        <p className="text-red-600 text-xs">{errores.horarios}</p>
      )}

      {/* Botón Eliminar */}
      <div className="flex justify-end pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={onEliminar}
          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition"
        >
          Eliminar horario
        </button>
      </div>
    </div>
  );
}
