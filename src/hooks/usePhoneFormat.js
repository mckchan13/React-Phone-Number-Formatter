import { useState } from "react";

const digits = new Set("0123456789".split(""));

const formats = {
  0: "(",
  4: ")",
  5: " ",
  9: "-",
};

const inputArray = new Array(14)
  .fill()
  .map((_, i) => (formats[i] ? formats[i] : null));

const rawToFormatMap = {
  0: 1,
  1: 2,
  2: 3,
  3: 6,
  4: 7,
  5: 8,
  6: 10,
  7: 11,
  8: 12,
  9: 13,
};

export default function usePhoneFormat() {
  const [caretIdx, setCaretIdx] = useState(0);
  const [value, setValue] = useState("");

  const setPhoneFormat = (event) => {
    const newInputArray = inputArray.slice();
    const currentInput = event.target.value.split("").filter((char) => {
      return digits.has(char);
    });

    const length = currentInput.length;
    currentInput.forEach((digit, idx) => {
      const formatIdx = rawToFormatMap[idx];
      newInputArray[formatIdx] = digit;
    });

    const startIdx = length > 3 ? 0 : 1;
    const endIdx = length < 10 ? rawToFormatMap[length - 1] + 1 : 14;

    const formattedNumber = newInputArray.slice(startIdx, endIdx).join("");

    setValue((prevValue) => {
      setCaretIdx((prevIdx) => updateCaretPosition(event, prevValue, prevIdx));
      return formattedNumber;
    });
  };

  return {
    phoneFormat: value,
    setPhoneFormat,
    setCaretIdx
  };
}

function updateCaretPosition(event, prevValue, prevIdx) {
  const {
    nativeEvent: { inputType },
  } = event;

  const inputElement = event.target;
  const caretPosition = prevIdx;
  const prevLength = prevValue.length;

  let delta = 0;

  if (inputType === "deleteContentBackward") {
    if (caretPosition === 11) delta = -2;
    else if (caretPosition === 7 && !inputElement.value[8]) delta = -3;
    else if (caretPosition === 4 && prevLength === 7) delta = -2;
    else delta = -1;
  } else if (inputType === "deleteContentForward") {
    if (caretPosition === 11 && prevLength === 12) delta = -1;
    else if (caretPosition <= 3 && caretPosition >= 1 && prevLength === 7)
      delta = -1;
  } else {
    if (prevLength >= 3 && caretPosition === 0) delta = 2;
    else if (prevLength === 3 && caretPosition === 3) delta = 4;
    else if (prevLength > 3 && caretPosition === 3) delta = 3;
    else if (caretPosition === 9) delta = 2;
    else delta = 1;
  }

  const nextPosition = caretPosition + delta;

  setTimeout(() => {
    inputElement.setSelectionRange(nextPosition, nextPosition);
  }, 0);

  return nextPosition;
}



/** 
idx:     01234567890123
phase1:  123            length: 0 - 3, raw length: 0 - 3
phase2:  (123) 456      length: 7 - 9, raw length: 4 - 6
phase3:  (123) 456-7    length: 11 - 14 raw length: 7 - 10
phase3:  (123) 456-7890

Changes
idx:     0123456789
phase1:  123
idx:     0123456789
phase2:  (123) 4

phase 1 => 2 (length: 0 - 3 => 7 - 9)
indices 0-2, delta +1;
indices 3, delta +3;

phase 2 => 1
indices 0-2, delta -1;
index   6,   delta 


 */
