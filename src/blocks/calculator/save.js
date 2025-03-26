/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {useBlockProps} from "@wordpress/block-editor";

const Save = ({attributes}) => {
  const {backgroundColor, textColor, padding} = attributes;

  const blockProps = useBlockProps.save({
    style: {
      backgroundColor,
      color: textColor,
      padding: `${padding}px`,
    },
    className: "calculator-block-container",
  });

  // Unique ID for this block instance
  const calculatorId = `calculator-${Math.floor(Math.random() * 10000)}`;

  const debtOptions = [
    {label: "Credit Card", value: "credit-card"},
    {label: "Mortgage", value: "mortgage"},
    {label: "Student Loan", value: "student-loan"},
  ];

  return (
    <div {...blockProps}>
      <div className="calculator-block" id={calculatorId}>
        <h3 className="calculator-block__title">
          {__("Debt Calculator", "custom-blocks")}
        </h3>

        <div className="calculator-block__container">
          <form 
            className="calculator-block__form" 
            aria-labelledby={`${calculatorId}-title`}
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
                  value={attributes.balanceOwed}
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
                  value={attributes.interestRate}
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
                  value={attributes.debtType}
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
                  value={attributes.monthlyPayment}
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
                <dd data-result="monthly-payment">{attributes.monthlyPayment || "$0.00"}</dd>
              </div>
              <div className="calculator-block__result-item">
                <dt>{__("Months to Pay Off:", "custom-blocks")}</dt>
                <dd data-result="months-to-pay">{attributes.monthsToPay || "0"}</dd>
              </div>
              <div className="calculator-block__result-item">
                <dt>{__("Total Principal Paid:", "custom-blocks")}</dt>
                <dd data-result="total-principal">{attributes.totalPrincipal || "$0.00"}</dd>
              </div>
              <div className="calculator-block__result-item">
                <dt>{__("Total Interest Paid:", "custom-blocks")}</dt>
                <dd data-result="total-interest">{attributes.totalInterest || "$0.00"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Save;
