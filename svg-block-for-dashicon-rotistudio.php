<?php
/**
 * Plugin Name: SVG Block for Dashicons
 * Plugin URI: https://rotistudio.hu/bovitmenyek/dashicon-svg-block/
 * Description: Adds a native Gutenberg block for inserting 334 WordPress Dashicons as inline SVG — fast, lightweight, and fully customizable.
 * Version: 1.3.1
 * Requires at least: 5.9
 * Requires PHP: 7.4
 * Author: RotiStudio - Tamas Rottenbacher
 * Author URI: https://rotistudio.hu
 * License: GPLv2 or later
 * Text Domain: svg-block-for-dashicon-rotistudio
 * Domain Path: /languages
 *
 * @package SVG_Block_for_Dashicons_by_RotiStudio
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'RSDSB_VERSION', '1.3.1' );
define( 'RSDSB_PATH', plugin_dir_path( __FILE__ ) );
define( 'RSDSB_URL', plugin_dir_url( __FILE__ ) );

/**
 * Register Dashicons SVG block.
 *
 * @return void
 */
function rsdsb_register_dashicons_svg_block() {
	$js_rel_path  = 'assets/js/dashicon-block.js';
	$js_abs_path  = RSDSB_PATH . $js_rel_path;
	$css_rel_path = 'assets/css/editor.css';
	$css_abs_path = RSDSB_PATH . $css_rel_path;

	wp_register_script(
		'rsdsb-dashicons-svg-block-editor',
		RSDSB_URL . $js_rel_path,
		array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-primitives' ),
		file_exists( $js_abs_path ) ? filemtime( $js_abs_path ) : RSDSB_VERSION,
		true // Load in footer
	);

	// Register editor-only CSS
	wp_register_style(
		'rsdsb-dashicons-svg-block-editor',
		RSDSB_URL . $css_rel_path,
		array(),
		file_exists( $css_abs_path ) ? filemtime( $css_abs_path ) : RSDSB_VERSION
	);

	// Pass SVG path data to JavaScript (for the picker preview in editor).
	wp_localize_script(
		'rsdsb-dashicons-svg-block-editor',
		'rsdsbDashiconData',
		array(
			'paths' => rsdsb_get_dashicon_svg_paths(),
		)
	);

	// Set up JavaScript translations.
	wp_set_script_translations(
		'rsdsb-dashicons-svg-block-editor',
		'svg-block-for-dashicon-rotistudio',
		RSDSB_PATH . 'languages'
	);

	register_block_type(
		'rsdsb/dashicon',
		array(
			'editor_script'   => 'rsdsb-dashicons-svg-block-editor',
			'editor_style'    => 'rsdsb-dashicons-svg-block-editor',
			'render_callback' => 'rsdsb_render_dashicon_block',
			'attributes'      => array(
				'icon'       => array(
					'type'    => 'string',
					'default' => 'admin-home',
				),
				'size'       => array(
					'type'    => 'number',
					'default' => 20,
				),
				'sizeUnit'   => array(
					'type'    => 'string',
					'default' => 'px',
				),
				'align'      => array(
					'type'    => 'string',
					'default' => 'none',
				),
				'linkUrl'    => array(
					'type'    => 'string',
					'default' => '',
				),
				'linkTarget' => array(
					'type'    => 'string',
					'default' => '',
				),
				'linkRel'    => array(
					'type'    => 'string',
					'default' => '',
				),
				'linkLabel'  => array(
					'type'    => 'string',
					'default' => '',
				),
			),
			'supports'        => array(
				'color'   => array(
					'text'       => true,
					'background' => true,
					'gradients'  => true,
				),
				'spacing' => array(
					'padding' => true,
					'margin'  => true,
				),
				'__experimentalBorder' => array(
					'radius' => true,
				),
			),
		)
	);
}
add_action( 'init', 'rsdsb_register_dashicons_svg_block', 10 );

/**
 * Convert WordPress preset variable to CSS variable format.
 *
 * @param string $value Value that might contain preset variable.
 * @return string Converted value.
 */
function rsdsb_convert_preset_to_css_var( $value ) {
	// Check if value contains 'var:preset|'.
	if ( false !== strpos( $value, 'var:preset|' ) ) {
		// Convert var:preset|spacing|40 to var(--wp--preset--spacing--40)
		$value = preg_replace_callback(
			'/var:preset\|([a-z-]+)\|([a-z0-9-]+)/i',
			function ( $matches ) {
				return 'var(--wp--preset--' . $matches[1] . '--' . $matches[2] . ')';
			},
			$value
		);
	}
	return $value;
}

/**
 * Render block as inline SVG.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 * @return string
 */
function rsdsb_render_dashicon_block( $attributes, $content = '', $block = null ) {
	$icon      = isset( $attributes['icon'] ) ? sanitize_key( $attributes['icon'] ) : 'admin-home';
	$size      = isset( $attributes['size'] ) ? absint( $attributes['size'] ) : 20;
	$size_unit = isset( $attributes['sizeUnit'] ) ? sanitize_text_field( $attributes['sizeUnit'] ) : 'px';
	$align     = isset( $attributes['align'] ) ? sanitize_key( $attributes['align'] ) : 'none';

	// Validate size unit
	$allowed_units = array( 'px', '%', 'em', 'rem', 'vw', 'vh' );
	if ( ! in_array( $size_unit, $allowed_units, true ) ) {
		$size_unit = 'px';
	}

	$svg_paths = rsdsb_get_dashicon_svg_paths();
	$path_data = isset( $svg_paths[ $icon ] ) ? $svg_paths[ $icon ] : ( $svg_paths['admin-home'] ?? '' );

	if ( empty( $path_data ) ) {
		return '';
	}

	$size_value = $size . $size_unit;

	// SVG styles: only size, display and color.
	$svg_styles = array(
		'width'          => $size_value,
		'height'         => $size_value,
		'display'        => 'inline-block',
		'vertical-align' => 'middle',
	);

	// Wrapper styles: background, padding, margin, border-radius.
	$wrapper_styles = array();

	$style = isset( $attributes['style'] ) ? $attributes['style'] : array();

	// Padding on wrapper.
	if ( isset( $style['spacing']['padding'] ) ) {
		$padding = $style['spacing']['padding'];
		if ( is_array( $padding ) ) {
			if ( isset( $padding['top'] ) ) {
				$wrapper_styles['padding-top'] = rsdsb_convert_preset_to_css_var( $padding['top'] );
			}
			if ( isset( $padding['right'] ) ) {
				$wrapper_styles['padding-right'] = rsdsb_convert_preset_to_css_var( $padding['right'] );
			}
			if ( isset( $padding['bottom'] ) ) {
				$wrapper_styles['padding-bottom'] = rsdsb_convert_preset_to_css_var( $padding['bottom'] );
			}
			if ( isset( $padding['left'] ) ) {
				$wrapper_styles['padding-left'] = rsdsb_convert_preset_to_css_var( $padding['left'] );
			}
		}
	}

	// Margin on wrapper.
	if ( isset( $style['spacing']['margin'] ) ) {
		$margin = $style['spacing']['margin'];
		if ( is_array( $margin ) ) {
			if ( isset( $margin['top'] ) ) {
				$wrapper_styles['margin-top'] = rsdsb_convert_preset_to_css_var( $margin['top'] );
			}
			if ( isset( $margin['right'] ) ) {
				$wrapper_styles['margin-right'] = rsdsb_convert_preset_to_css_var( $margin['right'] );
			}
			if ( isset( $margin['bottom'] ) ) {
				$wrapper_styles['margin-bottom'] = rsdsb_convert_preset_to_css_var( $margin['bottom'] );
			}
			if ( isset( $margin['left'] ) ) {
				$wrapper_styles['margin-left'] = rsdsb_convert_preset_to_css_var( $margin['left'] );
			}
		}
	}

	// Background color on wrapper.
	if ( isset( $style['color']['background'] ) ) {
		$wrapper_styles['background-color'] = rsdsb_convert_preset_to_css_var( $style['color']['background'] );
	} elseif ( isset( $attributes['backgroundColor'] ) ) {
		$wrapper_styles['background-color'] = 'var(--wp--preset--color--' . $attributes['backgroundColor'] . ')';
	}

	// Gradient background on wrapper.
	if ( isset( $style['color']['gradient'] ) ) {
		$wrapper_styles['background'] = $style['color']['gradient'];
	} elseif ( isset( $attributes['gradient'] ) ) {
		$wrapper_styles['background'] = 'var(--wp--preset--gradient--' . $attributes['gradient'] . ')';
	}

	// Text color on SVG (for currentColor).
	if ( isset( $style['color']['text'] ) ) {
		$svg_styles['color'] = rsdsb_convert_preset_to_css_var( $style['color']['text'] );
	} elseif ( isset( $attributes['textColor'] ) ) {
		$svg_styles['color'] = 'var(--wp--preset--color--' . $attributes['textColor'] . ')';
	}

	// Border radius on wrapper.
	if ( isset( $style['border']['radius'] ) ) {
		$border_radius = $style['border']['radius'];
		if ( is_string( $border_radius ) ) {
			$wrapper_styles['border-radius'] = rsdsb_convert_preset_to_css_var( $border_radius );
		} elseif ( is_array( $border_radius ) ) {
			if ( isset( $border_radius['topLeft'] ) ) {
				$wrapper_styles['border-top-left-radius'] = rsdsb_convert_preset_to_css_var( $border_radius['topLeft'] );
			}
			if ( isset( $border_radius['topRight'] ) ) {
				$wrapper_styles['border-top-right-radius'] = rsdsb_convert_preset_to_css_var( $border_radius['topRight'] );
			}
			if ( isset( $border_radius['bottomLeft'] ) ) {
				$wrapper_styles['border-bottom-left-radius'] = rsdsb_convert_preset_to_css_var( $border_radius['bottomLeft'] );
			}
			if ( isset( $border_radius['bottomRight'] ) ) {
				$wrapper_styles['border-bottom-right-radius'] = rsdsb_convert_preset_to_css_var( $border_radius['bottomRight'] );
			}
		}
	}

	// Build SVG inline style string.
	$svg_style_parts = array();
	foreach ( $svg_styles as $property => $value ) {
		$svg_style_parts[] = $property . ': ' . $value;
	}
	$svg_style_string = implode( '; ', $svg_style_parts ) . ';';

	$svg_html = sprintf(
		'<svg class="rsdsb-svg-dashicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true" focusable="false" style="%s"><path d="%s" fill="currentColor"></path></svg>',
		esc_attr( $svg_style_string ),
		esc_attr( $path_data )
	);

	// Wrap SVG in link if URL is set.
	$link_url = isset( $attributes['linkUrl'] ) ? esc_url( $attributes['linkUrl'] ) : '';

	if ( $link_url ) {
		$link_target = isset( $attributes['linkTarget'] ) ? sanitize_text_field( $attributes['linkTarget'] ) : '';
		$link_rel    = isset( $attributes['linkRel'] ) ? sanitize_text_field( $attributes['linkRel'] ) : '';
		$link_label  = isset( $attributes['linkLabel'] ) ? sanitize_text_field( $attributes['linkLabel'] ) : '';

		$link_attrs = sprintf( 'href="%s"', $link_url );

		if ( $link_target ) {
			$link_attrs .= sprintf( ' target="%s"', esc_attr( $link_target ) );
		}

		$rel_parts = array();
		if ( $link_rel ) {
			$rel_parts[] = $link_rel;
		}
		if ( '_blank' === $link_target && false === strpos( $link_rel, 'noopener' ) ) {
			$rel_parts[] = 'noopener';
		}
		if ( ! empty( $rel_parts ) ) {
			$link_attrs .= sprintf( ' rel="%s"', esc_attr( implode( ' ', $rel_parts ) ) );
		}

		if ( $link_label ) {
			$link_attrs .= sprintf( ' aria-label="%s"', esc_attr( $link_label ) );
		}

		$icon_html = sprintf( '<a %s>%s</a>', $link_attrs, $svg_html );
	} else {
		$icon_html = $svg_html;
	}

	// Build wrapper classes.
	$wrapper_classes = array( 'wp-block-rsdsb-dashicon' );

	if ( 'center' === $align ) {
		$wrapper_classes[] = 'aligncenter';
	} elseif ( 'left' === $align ) {
		$wrapper_classes[] = 'alignleft';
	} elseif ( 'right' === $align ) {
		$wrapper_classes[] = 'alignright';
	}

	$wrapper_class_string = implode( ' ', $wrapper_classes );

	// Wrapper base styles.
	$wrapper_styles['width']       = 'fit-content';
	$wrapper_styles['height']      = 'fit-content';
	$wrapper_styles['line-height'] = '0';

	if ( 'center' === $align ) {
		$wrapper_styles['margin-right'] = isset( $wrapper_styles['margin-right'] ) ? $wrapper_styles['margin-right'] : 'auto';
		$wrapper_styles['margin-left']  = isset( $wrapper_styles['margin-left'] ) ? $wrapper_styles['margin-left'] : 'auto';
	}

	$wrapper_style_parts = array();
	foreach ( $wrapper_styles as $property => $value ) {
		$wrapper_style_parts[] = $property . ': ' . $value;
	}
	$wrapper_style_string = implode( '; ', $wrapper_style_parts ) . ';';

	$wrapper_aria = $link_url ? '' : ' aria-hidden="true"';

	return sprintf(
		'<div class="%s" role="presentation"%s style="%s">%s</div>',
		esc_attr( $wrapper_class_string ),
		$wrapper_aria,
		esc_attr( $wrapper_style_string ),
		$icon_html
	);
}

/**
 * Load Dashicon SVG path data.
 *
 * @return array<string,string> Icon name => SVG path data
 */
function rsdsb_get_dashicon_svg_paths() {
	static $paths = null;

	if ( null !== $paths ) {
		return $paths;
	}

	$paths_file = RSDSB_PATH . 'assets/dashicon-paths.php';

	if ( file_exists( $paths_file ) ) {
		$loaded = require $paths_file;
		$paths  = is_array( $loaded ) ? $loaded : array();
	} else {
		$paths = array(
			'admin-home' => 'M16 8.5l1.53 1.53l-1.06 1.06L10 4.62l-6.47 6.47l-1.06-1.06L10 2.5l4 4v-2h2v4zm-6-2.46l6 5.99V18H4v-5.97zM12 17v-5H8v5h4z',
		);
	}

	return $paths;
}
