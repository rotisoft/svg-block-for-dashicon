<?php
/**
 * Registers the plugin Dashicons with the WordPress 7.1+ Icons API.
 *
 * Makes all bundled Dashicons available in the core Icon block picker
 * under a dedicated "Dashicons" collection. On WordPress versions
 * without the Icons API this module is a no-op.
 *
 * @package SVG_Block_for_Dashicons_by_RotiStudio
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Convert a Dashicon slug to a human-readable label.
 *
 * Example: "admin-home" becomes "Admin Home". Labels are generated from
 * slugs because translating 334 dynamic strings individually is not
 * practical; the slugs themselves remain searchable in the picker.
 *
 * @param string $rsdsb_slug Icon slug, e.g. "admin-home".
 * @return string Human-readable label, e.g. "Admin Home".
 */
function rsdsb_dashicon_label_from_slug( $rsdsb_slug ) {
	return ucwords( str_replace( array( '-', '_' ), ' ', $rsdsb_slug ) );
}

/**
 * Register the Dashicons collection and all icons with the core Icons API.
 *
 * The icons then appear in the core Icon block picker in their own
 * "Dashicons" tab. Icon names are namespaced as "rsdsb-dashicons/{slug}".
 *
 * @return void
 */
function rsdsb_register_icons_with_core() {
	// Icons API is available in WordPress 7.1+ only.
	if ( ! function_exists( 'wp_register_icon_collection' ) || ! function_exists( 'wp_register_icon' ) ) {
		return;
	}

	wp_register_icon_collection(
		'rsdsb-dashicons',
		array(
			'label'       => __( 'Dashicons', 'svg-block-for-dashicon-rotistudio' ),
			'description' => __( 'WordPress Dashicons as SVG, provided by SVG Block for Dashicons.', 'svg-block-for-dashicon-rotistudio' ),
		)
	);

	foreach ( rsdsb_get_dashicon_svg_paths() as $rsdsb_slug => $rsdsb_path ) {
		wp_register_icon(
			'rsdsb-dashicons/' . $rsdsb_slug,
			array(
				'label'   => rsdsb_dashicon_label_from_slug( $rsdsb_slug ),
				// fill="currentColor" on the path survives core sanitization,
				// so the icon follows the text color wherever it is rendered.
				'content' => sprintf(
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="currentColor" d="%s" /></svg>',
					esc_attr( $rsdsb_path )
				),
			)
		);
	}
}
add_action( 'init', 'rsdsb_register_icons_with_core', 10 );
