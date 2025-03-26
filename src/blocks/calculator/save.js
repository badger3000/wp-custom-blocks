/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {useBlockProps} from "@wordpress/block-editor";

const Save = (props) => {
  const {
    attributes: {backgroundColor, textColor, padding},
  } = props;

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
          <div className="calculator-block__form">
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
              />
            </div>

            <div className="calculator-block__button-container">
              <button
                className="calculator-block__button wp-element-button"
                data-action="calculate"
                type="button"
              >
                {__("Calculate", "custom-blocks")}
              </button>
            </div>
          </div>

          <div className="calculator-block__results">
            <h4>{__("Results", "custom-blocks")}</h4>
            <div className="calculator-block__result-item">
              <span>{__("Monthly Payment:", "custom-blocks")}</span>
              <strong data-result="monthly-payment">$0.00</strong>
            </div>
            <div className="calculator-block__result-item">
              <span>{__("Months to Pay Off:", "custom-blocks")}</span>
              <strong data-result="months-to-pay">0</strong>
            </div>
            <div className="calculator-block__result-item">
              <span>{__("Total Principal Paid:", "custom-blocks")}</span>
              <strong data-result="total-principal">$0.00</strong>
            </div>
            <div className="calculator-block__result-item">
              <span>{__("Total Interest Paid:", "custom-blocks")}</span>
              <strong data-result="total-interest">$0.00</strong>
            </div>
          </div>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              document.addEventListener('DOMContentLoaded', function() {
                const calculator = document.getElementById('${calculatorId}');
                if (!calculator) return;
                
                const calculateBtn = calculator.querySelector('[data-action="calculate"]');
                const balanceInput = calculator.querySelector('[data-input="balance-owed"]');
                const interestInput = calculator.querySelector('[data-input="interest-rate"]');
                const debtTypeSelect = calculator.querySelector('[data-input="debt-type"]');
                const paymentInput = calculator.querySelector('[data-input="monthly-payment"]');
                const monthlyPaymentResult = calculator.querySelector('[data-result="monthly-payment"]');
                const monthsToPayResult = calculator.querySelector('[data-result="months-to-pay"]');
                const totalPrincipalResult = calculator.querySelector('[data-result="total-principal"]');
                const totalInterestResult = calculator.querySelector('[data-result="total-interest"]');
                
                if (calculateBtn && balanceInput && interestInput && debtTypeSelect && paymentInput && monthlyPaymentResult && monthsToPayResult && totalPrincipalResult && totalInterestResult) {
                  calculateBtn.addEventListener('click', function() {
                    const balance = parseFloat(balanceInput.value) || 0;
                    const interestRate = parseFloat(interestInput.value) || 0;
                    const debtType = debtTypeSelect.value;
                    const monthlyPayment = parseFloat(paymentInput.value) || 0;
                    
                    // Calculate results
                    const monthsToPay = Math.ceil(balance / monthlyPayment);
                    const totalPrincipal = balance;
                    const totalInterest = (balance * interestRate / 100) * monthsToPay;
                    
                    // Update results
                    monthlyPaymentResult.textContent = monthlyPayment.toFixed(2);
                    monthsToPayResult.textContent = monthsToPay;
                    totalPrincipalResult.textContent = totalPrincipal.toFixed(2);
                    totalInterestResult.textContent = totalInterest.toFixed(2);
                  });
                }
              });
            })();
          `,
        }}
      />
    </div>
  );
};

export default Save;
