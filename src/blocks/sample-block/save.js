/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {useBlockProps, RichText} from "@wordpress/block-editor";

/**
 * Save function for the Sample Block.
 *
 * @param {Object} props Block properties.
 * @return {JSX.Element} Block rendering component.
 */
const Save = (props) => {
  const {
    attributes: {content, backgroundColor, textColor, padding},
  } = props;

  const blockProps = useBlockProps.save({
    style: {
      backgroundColor,
      color: textColor,
      padding: `${padding}px`,
    },
  });

  return (
    <div {...blockProps}>
      <RichText.Content tagName="p" value={content} />
    </div>
  );
};

export default Save;
