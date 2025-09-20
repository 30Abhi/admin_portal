"use client";

import { useState, useMemo } from "react";

interface PillSelectProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export default function PillSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Type and press Enter to add",
  required = false,
  error,
}: PillSelectProps) {
  const [inputValue, setInputValue] = useState("");

  // Filter options based on input value
  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) return options;
    return options.filter(option => 
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [options, inputValue]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      
      // Check if the typed value matches any of the provided options
      const matchingOption = options.find(option => 
        option.toLowerCase() === trimmedValue.toLowerCase()
      );
      
      if (matchingOption && !value.includes(matchingOption)) {
        onChange([...value, matchingOption]);
        setInputValue("");
      } else if (!matchingOption) {
        // If no match found, try to find the closest match
        const closestMatch = options.find(option => 
          option.toLowerCase().includes(trimmedValue.toLowerCase())
        );
        if (closestMatch && !value.includes(closestMatch)) {
          onChange([...value, closestMatch]);
          setInputValue("");
        }
      }
    }
  };

  const removeItem = (itemToRemove: string) => {
    onChange(value.filter((item) => item !== itemToRemove));
  };

  const addOption = (option: string) => {
    if (!value.includes(option)) {
      onChange([...value, option]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm opacity-70">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="min-h-[36px] p-2 border border-black/[.08] rounded flex flex-wrap gap-1 items-center">
        {value.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(item)}
              className="text-green-600 hover:text-green-800 ml-1"
            >
              ×
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none border-none bg-transparent"
        />
      </div>

      {/* Quick add options - show filtered options */}
      <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
        {filteredOptions
          .filter((option) => !value.includes(option))
          .map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => addOption(option)}
              className={`px-2 py-1 text-xs border rounded hover:bg-gray-50 ${
                inputValue.trim() && option.toLowerCase().includes(inputValue.toLowerCase())
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              }`}
            >
              + {option}
            </button>
          ))}
        {inputValue.trim() && filteredOptions.length === 0 && (
          <span className="px-2 py-1 text-xs text-gray-500 italic">
            No matching options found
          </span>
        )}
      </div>

      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
