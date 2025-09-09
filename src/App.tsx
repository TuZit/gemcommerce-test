import React, { useState } from "react";

const App = () => {
  const [value, setValue] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("1");
  const [lastValidValue, setLastValidValue] = useState<number>(1);
  const [unit, setUnit] = useState<Unit>("%");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const normalized = raw.replace(/,/g, ".");
    setInputValue(normalized);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let raw = (e.target.value || "").trim();

    if (!raw) {
      setValue(lastValidValue);
      setInputValue(String(lastValidValue));
      return;
    }

    raw = raw.replace(/,/g, ".");

    const fullValidPattern = /^-?\d+(\.\d+)?$/;
    const partialPattern = /^-?\d*\.?\d*/;

    if (fullValidPattern.test(raw)) {
      let parsed = parseFloat(raw);
      if (isNaN(parsed)) parsed = lastValidValue;

      if (parsed < 0) parsed = 0;
      if (unit === "%" && parsed > 100) parsed = 100;

      setValue(parsed);
      setLastValidValue(parsed);
      setInputValue(String(parsed));
      return;
    }

    const dotCount = (raw.match(/\./g) || []).length;
    if (dotCount > 1) {
      setValue(lastValidValue);
      setInputValue(String(lastValidValue));
      return;
    }

    const match = raw.match(partialPattern);
    const matched = match ? match[0] : "";

    if (!matched || matched === "-" || matched === ".") {
      setValue(lastValidValue);
      setInputValue(String(lastValidValue));
      return;
    }

    const parsedCandidate = parseFloat(matched);
    if (isNaN(parsedCandidate)) {
      setValue(lastValidValue);
      setInputValue(String(lastValidValue));
      return;
    }

    let parsed = parsedCandidate;
    if (parsed < 0) parsed = 0;
    if (unit === "%" && parsed > 100) parsed = 100;
    setValue(parsed);
    setInputValue(String(parsed));
    setLastValidValue(parsed);
  };

  const step = 1;
  const increment = () => {
    let next = value + step;
    if (unit === "%" && next > 100) next = 100;
    setValue(next);
    setInputValue(next.toString());
  };
  const decrement = () => {
    let next = value - step;
    if (next < 0) next = 0;
    setValue(next);
    setInputValue(next.toString());
  };

  const handleUnitSwitch = (newUnit: Unit) => {
    let newValue = value;
    let newLastValid = lastValidValue;

    if (newUnit === "%" && newValue > 100) {
      newValue = 100;
      newLastValid = 100;
      setInputValue("100");
    }

    setValue(newValue);
    setLastValidValue(newLastValid);
    setUnit(newUnit);
  };

  const getParsedInput = () => {
    const normalized = inputValue.replace(/,/g, ".");
    const num = parseFloat(normalized);
    return isNaN(num) ? null : num;
  };

  const parsedInput = getParsedInput();

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center text-neutral-100">
      <div className="w-96 bg-neutral-800 p-4 rounded-lg flex justify-center items-center">
        <div className="p-4 bg-black text-white rounded-lg space-y-4 w-[280px] h-[120px]">
          <div className="flex items-center space-x-2 justify-between">
            <span className="w-12 text-xs leading-[20px]">Unit</span>
            <div className="flex bg-gray-800 rounded-lg overflow-hidden">
              {(["%", "px"] as Unit[]).map((u) => (
                <button
                  key={u}
                  onClick={() => handleUnitSwitch(u)}
                  className={`px-3 py-1 w-[70px] h-[36px] text-xs leading-[20px] ${
                    unit === u
                      ? "bg-[#3B3B3B] text-white rounded-lg"
                      : "text-gray-400"
                  }`}>
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 justify-between">
            <span className="w-12 text-xs leading-[20px]">Value</span>
            <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={decrement}
                disabled={parsedInput === null || parsedInput <= 0}
                className={`px-3 py-1 h-[36px] w-[36px] text-[20px] leading-[20px] ${
                  parsedInput === null || parsedInput <= 0
                    ? "text-gray-600 cursor-not-allowed"
                    : "hover:bg-[#3B3B3B]"
                }`}>
                -
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                className="text-center bg-transparent outline-none h-[36px] w-[68px] text-xs leading-[20px]"
              />

              <button
                onClick={increment}
                disabled={
                  parsedInput === null || (unit === "%" && parsedInput >= 100)
                }
                className={`px-3 py-1 h-[36px] w-[36px] text-[20px] leading-[20px] ${
                  parsedInput === null || (unit === "%" && parsedInput >= 100)
                    ? "text-gray-600 cursor-not-allowed"
                    : "hover:bg-[#3B3B3B]"
                }`}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

type Unit = "%" | "px";
