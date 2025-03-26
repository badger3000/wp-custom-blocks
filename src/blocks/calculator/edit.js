/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {useBlockProps, InspectorControls} from "@wordpress/block-editor";
import {
  PanelBody,
  ColorPalette,
  RangeControl,
} from "@wordpress/components";
import {useState, useEffect} from "@wordpress/element";

/**
 * Internal dependencies
 */
import "./editor.scss";

/**
 * Edit function for the Calculator Block.
 *
 * @param {Object} props Block properties.
 * @return {JSX.Element} Block editing component.
 */
const Edit = (props) => {
  const {
    attributes: {
      balanceOwed,
      interestRate,
      debtType,
      monthlyPayment,
      backgroundColor,
      textColor,
      padding,
      monthsToPay,
      totalPrincipal,
      totalInterest,
      calculatorId,
    },
    setAttributes,
    clientId,
  } = props;

  // Set a stable ID based on the block's clientId
  useEffect(() => {
    if (!calculatorId) {
      setAttributes({ calculatorId: `calculator-${clientId}` });
    }
  }, [clientId, calculatorId, setAttributes]);

  // Local state for calculation
  const [localBalanceOwed, setLocalBalanceOwed] = useState(balanceOwed);
  const [localInterestRate, setLocalInterestRate] = useState(interestRate);
  const [localDebtType, setLocalDebtType] = useState(debtType);
  const [localMonthlyPayment, setLocalMonthlyPayment] =
    useState(monthlyPayment);

  const handleCalculation = (e) => {
    e.preventDefault();
    
    // Convert to numbers and calculate
    const balance = parseFloat(localBalanceOwed) || 0;
    const interest = parseFloat(localInterestRate) || 0;
    const monthly = parseFloat(localMonthlyPayment) || 0;

    // Simple calculation for demonstration purposes
    const months = balance / monthly;
    const principal = balance;
    const interestPaid = (balance * interest) / 100;

    // Update block attributes with all values
    setAttributes({
      balanceOwed: localBalanceOwed,
      interestRate: localInterestRate,
      debtType: localDebtType,
      monthlyPayment: localMonthlyPayment,
      monthsToPay: Math.round(months).toString(),
      totalPrincipal: principal.toFixed(2),
      totalInterest: interestPaid.toFixed(2),
    });
  };

  const debtOptions = [
    {label: "Credit Card", value: "credit-card"},
    {label: "Mortgage", value: "mortgage"},
    {label: "Student Loan", value: "student-loan"},
  ];

  const blockProps = useBlockProps({
    style: {
      backgroundColor,
      color: textColor,
      padding: `${padding}px`,
    },
    className: "calculator-block-container",
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Block Settings", "custom-blocks")}>
          <div className="custom-blocks-color-settings">
            <div className="custom-blocks-color-setting">
              <h2>{__("Background Color", "custom-blocks")}</h2>
              <ColorPalette
                value={backgroundColor}
                onChange={(color) => setAttributes({backgroundColor: color})}
              />
            </div>
            <div className="custom-blocks-color-setting">
              <h2>{__("Text Color", "custom-blocks")}</h2>
              <ColorPalette
                value={textColor}
                onChange={(color) => setAttributes({textColor: color})}
              />
            </div>
          </div>
          <RangeControl
            label={__("Padding", "custom-blocks")}
            value={padding}
            onChange={(value) => setAttributes({padding: value})}
            min={0}
            max={100}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="calculator-block" id={calculatorId}>
          <h3 className="calculator-block__title">
            {__("Debt Calculator", "custom-blocks")}
          </h3>

          <div className="calculator-block__container">
            <form 
              className="calculator-block__form" 
              aria-labelledby={`${calculatorId}-title`}
              onSubmit={handleCalculation}
            >
              <fieldset>
                <legend className="screen-reader-text">{__("Debt Information", "custom-blocks")}</legend>
                
                <div className="calculator-block__input-group">
                  <label
                    htmlFor={`${calculatorId}-balance`}
                    className="calculator-block__label"
                  >
                    {__("Balance Owed", "custom-blocks")}
                  </label>
                  <input
                    id={`${calculatorId}-balance`}
                    type="number"
                    className="calculator-block__input"
                    data-input="balance-owed"
                    required
                    min="0.01"
                    step="0.01"
                    aria-required="true"
                    value={localBalanceOwed}
                    onChange={(e) => setLocalBalanceOwed(e.target.value)}
                  />
                </div>

                <div className="calculator-block__input-group">
                  <label
                    htmlFor={`${calculatorId}-interest`}
                    className="calculator-block__label"
                  >
                    {__("Estimated Interest Rate (%)", "custom-blocks")}
                  </label>
                  <input
                    id={`${calculatorId}-interest`}
                    type="number"
                    className="calculator-block__input"
                    step="0.1"
                    data-input="interest-rate"
                    required
                    min="0"
                    max="100"
                    aria-required="true"
                    value={localInterestRate}
                    onChange={(e) => setLocalInterestRate(e.target.value)}
                  />
                </div>

                <div className="calculator-block__input-group">
                  <label
                    htmlFor={`${calculatorId}-debt-type`}
                    className="calculator-block__label"
                  >
                    {__("Debt Type", "custom-blocks")}
                  </label>
                  <select
                    id={`${calculatorId}-debt-type`}
                    className="calculator-block__select"
                    data-input="debt-type"
                    value={localDebtType}
                    onChange={(e) => setLocalDebtType(e.target.value)}
                  >
                    {debtOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="calculator-block__input-group">
                  <label
                    htmlFor={`${calculatorId}-payment`}
                    className="calculator-block__label"
                  >
                    {__("Monthly Payment", "custom-blocks")}
                  </label>
                  <input
                    id={`${calculatorId}-payment`}
                    type="number"
                    className="calculator-block__input"
                    data-input="monthly-payment"
                    required
                    min="0.01"
                    step="0.01"
                    aria-required="true"
                    value={localMonthlyPayment}
                    onChange={(e) => setLocalMonthlyPayment(e.target.value)}
                  />
                </div>

                <div className="calculator-block__button-container">
                  <button
                    className="calculator-block__button wp-element-button"
                    data-action="calculate"
                    type="submit"
                  >
                    {__("Calculate", "custom-blocks")}
                  </button>
                </div>
              </fieldset>
            </form>

            <div 
              className="calculator-block__results" 
              id={`${calculatorId}-results`}
              aria-live="polite"
              role="region"
              aria-label={__("Calculation Results", "custom-blocks")}
            >
              <h4>{__("Results", "custom-blocks")}</h4>
              <dl className="calculator-block__result-list">
                <div className="calculator-block__result-item">
                  <dt>{__("Monthly Payment:", "custom-blocks")}</dt>
                  <dd data-result="monthly-payment">{monthlyPayment || "$0.00"}</dd>
                </div>
                <div className="calculator-block__result-item">
                  <dt>{__("Months to Pay Off:", "custom-blocks")}</dt>
                  <dd data-result="months-to-pay">{monthsToPay || "0"}</dd>
                </div>
                <div className="calculator-block__result-item">
                  <dt>{__("Total Principal Paid:", "custom-blocks")}</dt>
                  <dd data-result="total-principal">{totalPrincipal || "$0.00"}</dd>
                </div>
                <div className="calculator-block__result-item">
                  <dt>{__("Total Interest Paid:", "custom-blocks")}</dt>
                  <dd data-result="total-interest">{totalInterest || "$0.00"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
