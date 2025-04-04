import { useState, useRef } from "react";

const SelectableNumbers = () => {
  const [values, setValues] = useState({});
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Only allow single digits (0-9)
    if (!/^\d?$/.test(value)) return;

    setValues((prev) => ({
      ...prev,
      [index]: value,
    }));

    // Move to the next input if a number is entered
    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace clears and moves to the previous input
    if (e.key === "Backspace" && values[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <div className="flex gap-4">
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          type="text" // Prevents up/down arrows for number input
          maxLength={1} // Ensures only one digit can be entered
          ref={(el) => (inputRefs.current[index] = el)}
          value={values[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-16 h-16 text-center border-2 rounded-lg transition-all focus:outline-none border-gray-300 focus:border-blue-500 shadow-blue-300"
        />
      ))}
    </div>
  );
};

export default SelectableNumbers;
