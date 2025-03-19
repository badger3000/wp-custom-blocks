/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {registerBlockType} from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import Edit from "./edit";
import Save from "./save";
import "./style.scss";

/**
 * Block Name
 */
export const name = "custom-blocks/sample-block";

/**
 * Block configuration
 */
export const settings = {
  title: __("Sample Block", "custom-blocks"),
  description: __(
    "A sample block for demonstration purposes.",
    "custom-blocks"
  ),
  category: "common",
  icon: "smiley",
  keywords: [
    __("sample", "custom-blocks"),
    __("example", "custom-blocks"),
    __("custom", "custom-blocks"),
  ],
  attributes: {
    content: {
      type: "string",
      source: "html",
      selector: "p",
      default: "",
    },
    backgroundColor: {
      type: "string",
      default: "#f8f9fa",
    },
    textColor: {
      type: "string",
      default: "#212529",
    },
    padding: {
      type: "number",
      default: 20,
    },
  },
  supports: {
    html: false,
    align: true,
  },
  example: {
    attributes: {
      content: __("Hello from the sample block!", "custom-blocks"),
      backgroundColor: "#f8f9fa",
      textColor: "#212529",
      padding: 20,
    },
  },
  edit: Edit,
  save: Save,
};
