import usePhoneFormat from "../hooks/usePhoneFormat";

export default function PhoneInput() {
  const { phoneFormat, setPhoneFormat, setCaretIdx } = usePhoneFormat();

  const handleChange = (event) => {
    setPhoneFormat(event);
  };
  
  const handleSelect = (event) => {
    setCaretIdx(event.target.selectionStart)
  }

  return (
    <div className="container text-center">
      <input
        type="tel"
        id="phone"
        maxLength="16"
        placeholder="mobile number"
        autoComplete="off"
        value={phoneFormat}
        onChange={handleChange}
        onSelect={handleSelect}
      />
      <div>
        <label htmlFor="phone">(123) 456-7890</label>
      </div>
    </div>
  );
}
