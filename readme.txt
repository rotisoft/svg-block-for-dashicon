=== SVG Block for Dashicons by RotiStudio ===
Contributors: rtomo, rotistudio
Tags: dashicons, svg, gutenberg, block, icons
Requires at least: 5.9
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.3.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Donate link: https://rotistudio.hu/kapcsolat/

Adds a native Gutenberg block for inserting 334 WordPress Dashicons as inline SVG — fast, lightweight, and fully customizable.

== Description ==

Hungarian: [Magyar nyelvű bővítmény leírás](https://rotistudio.hu/bovitmenyek/dashicon-svg-block/) 

This plugin adds a Gutenberg block that lets you pick a Dashicon and render it on the frontend as an inline SVG. The icons are lightweight, scalable, and fully customizable, making them ideal for modern WordPress block-based sites.

The plugin does not rely on the traditional icon rendering approach (CSS-based icon fonts with pseudo-elements and large icons.css files). Instead, it uses a far more optimized yet fully compatible method. There is no separate CSS icon font file, and not a single extra asset is loaded on the frontend. Only the pure SVG icon markup is embedded and rendered by the browser. There are no image files and no CSS files involved, while icons remain perfectly sharp at any size.

**Why is this plugin beneficial?**
- Easily use Dashicons on the frontend
- Choose from 334 icons
- Core Web Vitals friendly
- No icon font or CSS file loading
- No images or image files
- No overengineered or unnecessary features
- No accessibility-hindering CSS pseudo-elements
- Icons scale to any size and stay sharp
- SVG icons appear as clean inline code in the content
- Secure and validated

**Icons the way Gutenberg expects**
The Dashicons set is finally available as a native block element. No HTML hacks, no font dependency — just clean inline SVG markup directly from the editor.

**Faster loading, more stable layout**
Instead of downloading and rendering icon fonts, icons appear instantly in the HTML. No FOIT, no CSS pseudo-elements, no CLS risk — better Core Web Vitals and predictable rendering.

**Safe SVG usage**
No SVG uploads, no sanitizer, no risky pipeline. The plugin exclusively uses the official SVG sources of WordPress Dashicons — deterministic, verified markup.

**JS-free, cache-friendly**
No icon library JavaScript, no sprite loader, no runtime processing. SVG is static HTML — ideal for SSR, static caching, and block themes.

**Editor experience for users**
The Dashicons picker block uses a fast, familiar UI. Simple and consistent to use. Content creators choose icons — not edit code.

**In your own language**
The plugin can be easily and quickly translated on the official translate.wordpress.org platform, making it even easier to use in your own language.

Do you have other plugins? Yes, check my plugins website: [rotistudio.com](https://rotistudio.com/)
Where can we learn more about your work? Check my personal website there: [rottenbacher.hu](https://rottenbacher.hu/)

== Installation ==

1. Upload the plugin folder to the `/wp-content/plugins/svg-block-for-dashicon-rotistudio` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.

== Frequently Asked Questions ==

= How can I use? =

First install and activate it, then in the editor (Gutenberg) if you start typing /svg in a paragraph it will output it. Or you will find it in the editor when adding blocks if you search for SVG there.

= How many icons are included in the plugin? =

The plugin includes 334 Dashicons in SVG code format. (No files, just paths.)

= How compatible is inline SVG icon usage? =

Icons are rendered using SVG path markup, which has long been supported by all modern browsers.

= Does it work with existing themes? =

Yes. Styles are applied inline, so it works with all block themes and most classic themes as well.

= Is it lightweight and fast? =

Yes. The plugin code is minimal, fast, and performance-optimized. Only the selected SVG icon is rendered on the frontend and in the editor.

= Can I customize the icons? =

Yes. You can customize icon size, color, background color, border, border radius, padding, and margin.

= Why do I see a color contrast warning in the block editor? =

The WordPress block editor may show a contrast warning when comparing the icon’s text color to the page background. This warning can be safely ignored because it checks an incorrect color combination.

**What the editor checks:** Text color vs. page background color  
**What matters on the frontend:** Text color vs. icon background color (applied to the SVG element)

On the frontend, all colors (text, background, padding, margin) are correctly applied directly to the SVG element, ensuring proper contrast ratios where they actually matter.

= Is the plugin translated into other languages? =

Yes. The plugin is fully internationalized and ready for translation. Hungarian translation is included by default. Translation files are automatically loaded by WordPress 4.6+, making the plugin WordPress.org Plugin Check compliant.

= Compatible with Classic Editor? =

Unfortunately no, this is specifically designed for the Gutenberg editor.

== Screenshots ==

1. Rendered inline SVG icon on the frontend.
2. Dashicons SVG block selector in the Gutenberg editor.
3. Customization options: color, size, background, spacing, and border.

== Upgrade Notice ==

= 1.3.1 =
* WordPress 7.0 compatibility check
* PHP 8.5 compatibility check

= 1.3.0 =
* Fix 100% border-radius.
* Fix the original SVG paths for the 4 admin-site icons.
* Increased accessibility.
* Add fit-content width and height style value.
* Add gradient background color support.
* Add link support.

= 1.2.0 =
* Change plugin name, slug and textdomain.
* WordPress Coding Standards (WPCS) and ESLint fixes.
* Add block preview.

= 1.1.0 =
* Full internationalization (i18n) support with Hungarian translation included.
* Minor code changes.

= 1.0.0 =
* Initial release.

== Changelog ==

= 1.3.1 =
* WordPress 7.0 compatibility check
* PHP 8.5 compatibility check

= 1.3.0 =
* Fix 100% border-radius.
* Fix the original SVG paths for the 4 admin-site icons.
* Increased accessibility.
* Add fit-content width and height style value.
* Add gradient background color support.
* Add link support.

= 1.2.0 =
* Change plugin name, slug and textdomain.
* WordPress Coding Standards (WPCS) and ESLint fixes.
* Add block preview.

= 1.1.0 =
* Full internationalization (i18n) support with Hungarian translation included.
* WordPress.org Plugin Check compliant (automatic translation loading for WordPress 4.6+).

= 1.0.0 =
* Initial release.
