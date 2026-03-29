import React from 'react';

export const TextInput = ({ label, type = "text", name, value, onChange, placeholder, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
    />
  </div>
);

export const SelectInput = ({ label, name, value, onChange, options, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
    >
      <option value="" disabled>Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export const MultiSelectInput = ({ label, name, selectedValues = [], onChange, options, required }) => {
  const toggleOption = (opt) => {
    let newValues;
    if (selectedValues.includes(opt)) {
      newValues = selectedValues.filter(v => v !== opt);
    } else {
      newValues = [...selectedValues, opt];
    }
    onChange({ target: { name, value: newValues } });
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleOption(opt)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                isSelected
                  ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
