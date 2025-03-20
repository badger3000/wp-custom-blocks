/**
 * WordPress dependencies
 */
import {registerBlockType} from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import "./style.scss";
import "./editor.scss";
import Edit from "./edit";
import Save from "./save";
import metadata from "./block.json";

/**
 * Register the block
 */
registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
});
