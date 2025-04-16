import { useState, useRef, useEffect } from "react";

const SelectableNumbers = ({ setVerificationCode, otp }) => {
  const [values, setValues] = useState({});

  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedValues = {
      ...values,
      [index]: value,
    };

    setValues(updatedValues);

    // Move to the next input if a digit is entered
    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Update parent with the full code whenever `values` changes
  useEffect(() => {
    const code = [0, 1, 2, 3].map((i) => values[i] || "").join("");
    setVerificationCode(code);
  }, [values, setVerificationCode]);

  return (
    <div className="flex gap-4">
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          ref={(el) => (inputRefs.current[index] = el)}
          value={values[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-16 h-16 text-center border-2 rounded-lg transition-all focus:outline-none border-gray-300 focus:border-blue-500 shadow-sm shadow-blue-300"
        />
      ))}
    </div>
  );
};

export default SelectableNumbers;
