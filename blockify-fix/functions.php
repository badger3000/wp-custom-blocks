<?php

// Error suppression - absolutely must load first before any other code
require_once __DIR__ . '/inc/error-suppressor.php';

// Then load autoloader and main theme
require_once __DIR__ . '/inc/core-fixes.php';
require_once __DIR__ . '/inc/class-safe-block-parser.php';
require_once __DIR__ . '/vendor/autoload.php';

// Load blockify after fixes are in place
add_action('after_setup_theme', function () {
    Blockify::register(__FILE__);
}, 20);
