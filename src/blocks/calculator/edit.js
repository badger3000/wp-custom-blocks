/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {useBlockProps, InspectorControls} from "@wordpress/block-editor";
import {
  PanelBody,
  ColorPalette,
  RangeControl,
  TextControl,
  Button,
} from "@wordpress/components";
import {useState} from "@wordpress/element";

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
      firstNumber,
      secondNumber,
      result,
      backgroundColor,
      textColor,
      padding,
    },
    setAttributes,
  } = props;

  // Local state for calculation
  const [localFirstNumber, setLocalFirstNumber] = useState(firstNumber);
  const [localSecondNumber, setLocalSecondNumber] = useState(secondNumber);

  const handleCalculation = () => {
    // Convert to numbers and add
    const num1 = parseFloat(localFirstNumber) || 0;
    const num2 = parseFloat(localSecondNumber) || 0;
    const calculatedResult = (num1 + num2).toString();

    // Update block attributes with all values
    setAttributes({
      firstNumber: localFirstNumber,
      secondNumber: localSecondNumber,
      result: calculatedResult,
    });
  };

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
        <div className="calculator-block">
          <h3 className="calculator-block__title">
            {__("Calculator", "custom-blocks")}
          </h3>

          <div className="calculator-block__input-group">
            <TextControl
              label={__("First Number", "custom-blocks")}
              value={localFirstNumber}
              onChange={setLocalFirstNumber}
              type="number"
              className="calculator-block__input"
            />
          </div>

          <div className="calculator-block__input-group">
            <TextControl
              label={__("Second Number", "custom-blocks")}
              value={localSecondNumber}
              onChange={setLocalSecondNumber}
              type="number"
              className="calculator-block__input"
            />
          </div>

          <div className="calculator-block__button-container">
            <Button
              isPrimary
              onClick={handleCalculation}
              className="calculator-block__button"
            >
              {__("Calculate", "custom-blocks")}
            </Button>
          </div>

          <div className="calculator-block__result">
            <strong>{__("Result:", "custom-blocks")}</strong> {result}
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
