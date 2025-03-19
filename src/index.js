/**
 * Import WordPress dependencies
 */
import {registerBlockType} from "@wordpress/blocks";
import {__} from "@wordpress/i18n";

/**
 * Import block registration
 */
import * as sampleBlock from "./blocks/sample-block";

/**
 * Function to register an individual block.
 *
 * @param {Object} block The block to be registered.
 */
const registerBlock = (block) => {
  if (!block) {
    return;
  }

  const {name, settings} = block;
  registerBlockType(name, settings);
};

/**
 * Register blocks
 */
[
  sampleBlock,
  // Add more blocks here as needed
].forEach(registerBlock);
