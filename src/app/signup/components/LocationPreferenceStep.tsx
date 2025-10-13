import { StepProps } from "../types/FormTypes";
import locationListJson from "./json/locationList.json";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const locationList: string[] = locationListJson as string[];

export function LocationPreferenceStep({ formData, handleChange }: StepProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredList = locationList.filter((city) =>
    city.toLowerCase().includes(query.toLowerCase())
  );

  const addLocation = (location: string) => {
    const updated = [...formData.preferredLocations, location].filter(
      (v, i, arr) => arr.indexOf(v) === i
    );
    handleChange("preferredLocations", updated);
    setQuery("");
    setShowSuggestions(false); // Close after selection
  };

  const removeLocation = (location: string) => {
    const updated = formData.preferredLocations.filter((loc) => loc !== location);
    handleChange("preferredLocations", updated);
  };

  const clearAllLocations = () => {
    handleChange("preferredLocations", []);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputVal = query.trim();
      if (inputVal && !formData.preferredLocations.includes(inputVal)) {
        addLocation(inputVal);
      }
    }
  };

  const preferenceOptions = [
    "No preference, I can work anywhere",
    "Yes, I have specific suburbs or cities in mind",
  ];

  return (
    <>
      <h2 className="font-[16px] font-semibold text-[#121224]">
        Do you have any preferences or restrictions on work location?
      </h2>

      <div className="flex flex-col gap-5 mt-5 w-fit">
        {preferenceOptions.map((opt) => {
          const isSelected = formData.locationPreference === opt;
          return (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-5 h-5 flex items-center justify-center border-2 ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-400"
                  }`}
                onClick={() => handleChange("locationPreference", opt)}
              >
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="text-[14px] font-light">{opt}</span>
            </label>
          );
        })}
      </div>

      {formData.locationPreference === "Yes, I have specific suburbs or cities in mind" && (
        <div className="relative mt-5 w-full max-w-md">
          <h3 className="font-[16px] font-semibold text-[#121224] mb-2">Type or select a preferred location</h3>

          {formData.preferredLocations.length === 0 && (
            <p className="text-red-500 text-sm mt-1">
              Please enter or select a location.
            </p>
          )}

          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // Delay closing to allow clicking on suggestions
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type or select a location"
              className="w-full border rounded p-2"
            />
            {/* Arrow Icon */}
            <button
              type="button"
              onClick={() => setShowSuggestions((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-transform duration-200"
            >
              <ChevronDown
                className={`w-5 h-5 ${showSuggestions ? "rotate-180" : "rotate-0"} transition-transform duration-200`}
              />
            </button>

            {showSuggestions && filteredList.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full max-h-60 overflow-y-auto mt-1 rounded shadow">
                {filteredList.map((city, index) => (
                  <li
                    key={`${city}-${index}`}
                    onMouseDown={() => addLocation(city)}
                    className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2 mt-5">
            {formData.preferredLocations.map((loc, idx) => (
              <div
                key={`${loc}-${idx}`}
                className="inline-flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {loc}
                <button
                  type="button"
                  onClick={() => removeLocation(loc)}
                  className="ml-2 text-blue-700 hover:text-blue-900 font-bold"
                >
                  &times;
                </button>
              </div>
            ))}

            {formData.preferredLocations.length > 1 && (
              <button
                type="button"
                onClick={clearAllLocations}
                className="ml-2 px-3 py-1 text-sm font-medium rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}