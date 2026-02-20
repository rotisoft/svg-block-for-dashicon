# SVG Block for Dashicons by RotiStudio

Adds a native Gutenberg block for inserting 334 WordPress Dashicons as inline SVG — fast, lightweight, and fully customizable.

**Contributors:** [Tamas Rottenbacher](https://profiles.wordpress.org/rtomo/)  
**Tags:** dashicons, svg, gutenberg, block, icons  
**Requires at least:** 5.9  
**Tested up to:** 6.9  
**Requires PHP:** 7.4  
**Stable version:** 1.3.0  
**License:** GPLv2 or later  
**License URI:** https://www.gnu.org/licenses/gpl-2.0.html  
**Donate:** https://rotisoft.hu/kapcsolat/

Hungarian: [Magyar nyelvű bővítmény leírás](https://rotistudio.hu/bovitmenyek/dashicon-svg-block/)

## Description

This plugin adds a Gutenberg block that lets you pick a Dashicon and render it on the frontend as an inline SVG. The icons are lightweight, scalable, and fully customizable, making them ideal for modern WordPress block-based sites.

The plugin does not rely on the traditional icon rendering approach (CSS-based icon fonts with pseudo-elements and large icons.css files). Instead, it uses a far more optimized yet fully compatible method. There is no separate CSS icon font file, and not a single extra asset is loaded on the frontend. Only the pure SVG icon markup is embedded and rendered by the browser. There are no image files and no CSS files involved, while icons remain perfectly sharp at any size.

### Why is this plugin beneficial?

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

### Icons the way Gutenberg expects

The Dashicons set is finally available as a native block element. No HTML hacks, no font dependency — just clean inline SVG markup directly from the editor.

### Faster loading, more stable layout

Instead of downloading and rendering icon fonts, icons appear instantly in the HTML. No FOIT, no CSS pseudo-elements, no CLS risk — better Core Web Vitals and predictable rendering.

### Safe SVG usage

No SVG uploads, no sanitizer, no risky pipeline. The plugin exclusively uses the official SVG sources of WordPress Dashicons — deterministic, verified markup.

### JS-free, cache-friendly

No icon library JavaScript, no sprite loader, no runtime processing. SVG is static HTML — ideal for SSR, static caching, and block themes.

### Editor experience for users

The Dashicons picker block uses a fast, familiar UI. Simple and consistent to use. Content creators choose icons — not edit code.

### In your own language

The plugin can be easily and quickly translated on the official translate.wordpress.org platform, making it even easier to use in your own language.

Do you have other plugins? Yes, check: https://rotistudio.hu/  
More about my work: https://rottenbacher.hu/

## Installation

1. Upload the plugin folder to `/wp-content/plugins/svg-block-for-dashicon-rotistudio`
2. Activate the plugin in **Plugins → Installed Plugins**

## FAQ

### How can I use?

Install and activate the plugin. In the Gutenberg editor, type `/svg` in a paragraph block, or search for **SVG** when adding blocks.

### How many icons are included?

334 Dashicons in SVG path format (no files).

### How compatible is inline SVG?

SVG path markup has long been supported by all modern browsers.

### Does it work with existing themes?

Yes. Inline styles ensure compatibility with all block themes and most classic themes.

### Is it lightweight and fast?

Yes. Minimal, performance-optimized code. Only the selected SVG is rendered on frontend and editor.

### Can I customize the icons?

Yes: size, color, background, border, border-radius, padding, margin.

### Why do I see a color contrast warning in the editor?

The block editor compares icon color with page background, which may differ from the icon background used on frontend.

**Editor check:** text vs page background  
**Frontend reality:** text vs icon background  

Frontend colors are applied directly to the SVG element, ensuring correct contrast where it matters.

### Is the plugin translated?

Yes. Fully internationalized. Hungarian included. WordPress 4.6+ loads translations automatically.

### Compatible with Classic Editor?

No. Gutenberg-only block.

## Changelog

### 1.3.0
- Fix 100% border-radius  
- Fix original SVG paths for 4 admin-site icons  
- Increased accessibility  
- Add `fit-content` width/height  
- Gradient background support  
- Link support  

### 1.2.0
- Rename plugin, slug, textdomain  
- WPCS and ESLint fixes  
- Block preview  

### 1.1.0
- Full i18n with Hungarian  
- WordPress.org Plugin Check compliant  

### 1.0.0
- Initial release  
