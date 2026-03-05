import { useState } from "react";

function TemperatureConverter() {
  // Input typed by user.
  const [temperature, setTemperature] = useState("");

  // Conversion direction selected by user.
  const [conversionType, setConversionType] = useState("C_TO_F");

  // Final text shown after conversion.
  const [result, setResult] = useState("");

  // Validation message shown for invalid input.
  const [error, setError] = useState("");

  const handleConvert = () => {
    const trimmedValue = temperature.trim();

    // Validation: input should not be empty.
    if (trimmedValue === "") {
      setError("Please enter a temperature value.");
      setResult("");
      return;
    }

    const numericValue = Number(trimmedValue);

    // Validation: value must be numeric.
    if (Number.isNaN(numericValue)) {
      setError("Please enter a valid numeric value.");
      setResult("");
      return;
    }

    setError("");

    if (conversionType === "C_TO_F") {
      const fahrenheit = (numericValue * 9) / 5 + 32;
      setResult(`Result: ${fahrenheit.toFixed(2)}\u00B0F`);
    } else {
      const celsius = ((numericValue - 32) * 5) / 9;
      setResult(`Result: ${celsius.toFixed(2)}\u00B0C`);
    }
  };

  return (
    <section className="converter-card">
      <h1 className="title">Temperature Converter</h1>

      <div className="form-group">
        <label htmlFor="temperatureInput" className="label-text">
          Enter Temperature
        </label>
        <input
          id="temperatureInput"
          type="text"
          className="temperature-input"
          value={temperature}
          onChange={(event) => setTemperature(event.target.value)}
          placeholder="e.g. 25"
        />
      </div>

      <div className="form-group">
        <p className="label-text">Conversion Direction</p>
        <div className="radio-row">
          <label className="radio-option">
            <input
              type="radio"
              name="conversionType"
              value="C_TO_F"
              checked={conversionType === "C_TO_F"}
              onChange={(event) => setConversionType(event.target.value)}
            />
            Celsius to Fahrenheit
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="conversionType"
              value="F_TO_C"
              checked={conversionType === "F_TO_C"}
              onChange={(event) => setConversionType(event.target.value)}
            />
            Fahrenheit to Celsius
          </label>
        </div>
      </div>

      <button className="convert-btn" onClick={handleConvert}>
        Convert
      </button>

      {error && <p className="error-text">{error}</p>}
      {result && <p className="result-text">{result}</p>}

      <div className="test-values">
        <p className="test-title">Example Test Values</p>
        <ul>
          <li>0 C to 32 F</li>
          <li>100 C to 212 F</li>
          <li>32 F to 0 C</li>
          <li>68 F to 20 C</li>
        </ul>
      </div>
    </section>
  );
}

export default TemperatureConverter;
