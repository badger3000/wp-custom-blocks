/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
  PanelBody,
  ColorPalette,
  RangeControl,
  TextControl,
  SelectControl,
} from "@wordpress/components";
import { useState } from "@wordpress/element";

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
    },
    setAttributes,
  } = props;

  // Local state for calculation
  const [localBalanceOwed, setLocalBalanceOwed] = useState(balanceOwed);
  const [localInterestRate, setLocalInterestRate] = useState(interestRate);
  const [localDebtType, setLocalDebtType] = useState(debtType);
  const [localMonthlyPayment, setLocalMonthlyPayment] = useState(monthlyPayment);

  const handleCalculation = () => {
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
      monthsToPay: Math.round(months),
      totalPrincipal: principal.toFixed(2),
      totalInterest: interestPaid.toFixed(2),
    });
  };

  const debtOptions = [
    { label: 'Credit Card', value: 'credit-card' },
    { label: 'Mortgage', value: 'mortgage' },
    { label: 'Student Loan', value: 'student-loan' },
  ];

  const blockProps = useBlockProps({
    style: {
      backgroundColor,
      color: textColor,
      padding: `${padding}px`,
    },
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
                onChange={(color) => setAttributes({ backgroundColor: color })}
              />
            </div>
            <div className="custom-blocks-color-setting">
              <h2>{__("Text Color", "custom-blocks")}</h2>
              <ColorPalette
                value={textColor}
                onChange={(color) => setAttributes({ textColor: color })}
              />
            </div>
          </div>
          <RangeControl
            label={__("Padding", "custom-blocks")}
            value={padding}
            onChange={(value) => setAttributes({ padding: value })}
            min={0}
            max={100}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="calculator-block">
          <h3 className="calculator-block__title">
            {__("Debt Calculator", "custom-blocks")}
          </h3>

          <div className="calculator-block__form">
            <div className="calculator-block__input-group">
              <TextControl
                label={__("Balance Owed", "custom-blocks")}
                type="number"
                value={localBalanceOwed}
                onChange={setLocalBalanceOwed}
                className="calculator-block__input"
              />
            </div>

            <div className="calculator-block__input-group">
              <TextControl
                label={__("Estimated Interest Rate (%)", "custom-blocks")}
                type="number"
                value={localInterestRate}
                onChange={setLocalInterestRate}
                step="0.1"
                className="calculator-block__input"
              />
            </div>

            <div className="calculator-block__input-group">
              <SelectControl
                label={__("Debt Type", "custom-blocks")}
                value={localDebtType}
                options={debtOptions}
                onChange={setLocalDebtType}
                className="calculator-block__select"
              />
            </div>

            <div className="calculator-block__input-group">
              <TextControl
                label={__("Monthly Payment", "custom-blocks")}
                type="number"
                value={localMonthlyPayment}
                onChange={setLocalMonthlyPayment}
                className="calculator-block__input"
              />
            </div>

            <div className="calculator-block__button-container">
              <button
                className="calculator-block__button wp-element-button"
                type="button"
                onClick={handleCalculation}
              >
                {__("Calculate", "custom-blocks")}
              </button>
            </div>
          </div>

          <div className="calculator-block__results">
            <h4>{__("Results", "custom-blocks")}</h4>
            <div className="calculator-block__result-item">
              <span>{__("Monthly Payment:", "custom-blocks")}</span>
              <strong>{monthlyPayment}</strong>
            </div>
            <div className="calculator-block__result-item">
              <span>{__("Months to Pay Off:", "custom-blocks")}</span>
              <strong>{monthsToPay}</strong>
            </div>
            <div className="calculator-block__result-item">
              <span>{__("Total Principal Paid:", "custom-blocks")}</span>
              <strong>{totalPrincipal}</strong>
            </div>
            <div className="calculator-block__result-item">
              <span>{__("Total Interest Paid:", "custom-blocks")}</span>
              <strong>{totalInterest}</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
