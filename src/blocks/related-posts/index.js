import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import Save from './save';
import './style.scss';
import './editor.scss';

registerBlockType('custom-blocks/related-posts', {
    edit: Edit,
    save: Save,
});
