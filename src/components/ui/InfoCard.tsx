"use client";
import React from "react";
import { LucideIcon } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface InfoCardProps<T = any> {
  icon?: LucideIcon; // optional icon component
  label: string; // display name (ex: "Company Name")
  value: string | number | null; // actual data value
  isEditing?: boolean; // edit mode toggle
  field?: keyof T; // optional field key (for object-based forms)
  onChange?: (field: keyof T, value: string) => void; // callback for editing
  disableEdit?: boolean; // disable editing for certain cards
  className?: string; // extra tailwind classes
  placeholder?: string; // placeholder when empty
}

const InfoCard = <T,>({
  icon: Icon,
  label,
  value,
  isEditing = false,
  field,
  onChange,
  disableEdit = false,
  className = "",
  placeholder = "-",
}: InfoCardProps<T>) => {
  return (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg bg-white shadow-sm ${className}`}
    >
      {/* Optional Icon */}
      {Icon && (
        <Icon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>

        {!isEditing || disableEdit ? (
          <p className="text-base text-gray-900 font-medium break-words">
            {value || placeholder}
          </p>
        ) : (
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) =>
              field && onChange ? onChange(field, e.target.value) : undefined
            }
            placeholder={placeholder}
            className="border rounded px-2 py-1 text-sm w-full mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        )}
      </div>
    </div>
  );
};

export default InfoCard;
