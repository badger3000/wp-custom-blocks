/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {useBlockProps} from "@wordpress/block-editor";

/**
 * Save function for the Calculator Block.
 *
 * @param {Object} props Block properties.
 * @return {JSX.Element} Block rendering component.
 */
const Save = (props) => {
  const {
    attributes: {
      firstNumber,
      secondNumber,
      result,
      backgroundColor,
      textColor,
      padding,
    },
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

  return (
    <div {...blockProps}>
      <div className="calculator-block" id={calculatorId}>
        <h3 className="calculator-block__title">
          {__("Calculator", "custom-blocks")}
        </h3>

        <div className="calculator-block__input-group">
          <label
            htmlFor={`${calculatorId}-first`}
            className="calculator-block__label"
          >
            {__("First Number", "custom-blocks")}
          </label>
          <input
            id={`${calculatorId}-first`}
            type="number"
            className="calculator-block__input"
            defaultValue={firstNumber}
            data-input="first-number"
          />
        </div>

        <div className="calculator-block__input-group">
          <label
            htmlFor={`${calculatorId}-second`}
            className="calculator-block__label"
          >
            {__("Second Number", "custom-blocks")}
          </label>
          <input
            id={`${calculatorId}-second`}
            type="number"
            className="calculator-block__input"
            defaultValue={secondNumber}
            data-input="second-number"
          />
        </div>

        <div className="calculator-block__button-container">
          <button
            className="calculator-block__button wp-element-button"
            data-action="calculate"
          >
            {__("Calculate", "custom-blocks")}
          </button>
        </div>

        <div className="calculator-block__result">
          <strong>{__("Result:", "custom-blocks")}</strong>{" "}
          <span className="calculator-block__result-value">{result}</span>
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
                const firstInput = calculator.querySelector('[data-input="first-number"]');
                const secondInput = calculator.querySelector('[data-input="second-number"]');
                const resultDisplay = calculator.querySelector('.calculator-block__result-value');
                
                if (calculateBtn && firstInput && secondInput && resultDisplay) {
                  calculateBtn.addEventListener('click', function() {
                    const num1 = parseFloat(firstInput.value) || 0;
                    const num2 = parseFloat(secondInput.value) || 0;
                    const calculatedResult = (num1 + num2).toString();
                    resultDisplay.textContent = calculatedResult;
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
