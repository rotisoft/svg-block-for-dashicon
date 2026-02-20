(function () {
	const { registerBlockType } = wp.blocks;
	const { __ } = wp.i18n;
	const { Fragment, createElement: el, useState, useRef, useEffect } = wp.element;
	const {
		InspectorControls,
		BlockControls,
		useBlockProps,
		__experimentalLinkControl: LinkControl,
	} = wp.blockEditor;
	const { SVG, Path } = wp.primitives;

	const linkIcon = el(
		SVG,
		{ xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24' },
		el( Path, {
			d: 'M10 17.389H8.444A5.194 5.194 0 1 1 8.444 7H10v1.5H8.444a3.694 3.694 0 0 0 0 7.389H10v1.5ZM14 7h1.556a5.194 5.194 0 0 1 0 10.39H14v-1.5h1.556a3.694 3.694 0 0 0 0-7.39H14V7Zm-4.5 6h5v-1.5h-5V13Z',
		} )
	);
	const {
		PanelBody,
		TextControl,
		ToolbarGroup,
		ToolbarButton,
		Popover,
		__experimentalToggleGroupControl: ToggleGroupControl,
		__experimentalToggleGroupControlOption: ToggleGroupControlOption,
		BaseControl,
	} = wp.components;

	function getPaths() {
		const data = window.rsdsbDashiconData || {};
		return data.paths || {};
	}

	const wrapperStyleKeys = [
		'backgroundColor',
		'background',
		'backgroundImage',
		'paddingTop',
		'paddingRight',
		'paddingBottom',
		'paddingLeft',
		'marginTop',
		'marginRight',
		'marginBottom',
		'marginLeft',
		'borderRadius',
		'borderTopLeftRadius',
		'borderTopRightRadius',
		'borderBottomLeftRadius',
		'borderBottomRightRadius',
	];

	function splitStyles( allStyles ) {
		const svgOnly = {};
		const wrapperOnly = {};

		if ( allStyles ) {
			for ( var key in allStyles ) {
				if ( -1 !== wrapperStyleKeys.indexOf( key ) ) {
					wrapperOnly[ key ] = allStyles[ key ];
				} else {
					svgOnly[ key ] = allStyles[ key ];
				}
			}
		}

		return { svgOnly, wrapperOnly };
	}

	function renderSvg( iconName, size, sizeUnit, svgExtraStyles ) {
		const paths = getPaths();
		const pathData = paths[ iconName ] || paths[ 'admin-home' ] || '';

		const sizeValue = size + ( sizeUnit || 'px' );

		const style = {
			width: sizeValue,
			height: sizeValue,
			display: 'inline-block',
			verticalAlign: 'middle',
		};

		if ( svgExtraStyles ) {
			for ( var key in svgExtraStyles ) {
				style[ key ] = svgExtraStyles[ key ];
			}
		}

		return el(
			'svg',
			{
				xmlns: 'http://www.w3.org/2000/svg',
				viewBox: '0 0 20 20',
				className: 'rsdsb-svg-dashicon',
				style,
				'aria-hidden': true,
				focusable: 'false',
			},
			el( 'path', { d: pathData, fill: 'currentColor' } )
		);
	}

	// Custom Icon Picker Component with thumbnails and search.
	function IconPickerControl(props) {
		const { label, value, onChange } = props;
		const [searchTerm, setSearchTerm] = useState('');
		const paths = getPaths();
		const allIcons = Object.keys(paths);

		const filteredIcons = searchTerm
			? allIcons.filter(function (iconName) {
					return (
						-1 !==
						iconName.toLowerCase().indexOf(searchTerm.toLowerCase())
					);
				})
			: allIcons;

		return el(
			BaseControl,
			{
				label,
				className: 'rsdsb-icon-picker',
				__nextHasNoMarginBottom: true,
			},
			el(
				'div',
				{ style: { marginBottom: '12px' } },
				el(TextControl, {
					placeholder: __('Search icons…', 'svg-block-for-dashicon-rotistudio'),
					value: searchTerm,
					onChange: setSearchTerm,
					__nextHasNoMarginBottom: true,
					__next40pxDefaultSize: true,
				})
			),
			el(
				'div',
				{
					style: {
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
						gap: '8px',
						maxHeight: '220px',
						overflowY: 'auto',
						padding: '8px',
						border: '1px solid #ddd',
						borderRadius: '4px',
						backgroundColor: '#fff',
					},
				},
				filteredIcons.map(function (iconName) {
					const isSelected = iconName === value;
					return el(
						'button',
						{
							key: iconName,
							type: 'button',
							onClick() {
								onChange(iconName);
							},
							title: iconName,
							style: {
								padding: '8px',
								border: isSelected
									? '2px solid #2271b1'
									: '1px solid #ddd',
								borderRadius: '4px',
								backgroundColor: isSelected ? '#f0f6fc' : '#fff',
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								minHeight: '40px',
								transition: 'all 0.2s',
							},
							onMouseEnter(e) {
								if (!isSelected) {
									e.currentTarget.style.borderColor =
										'#2271b1';
									e.currentTarget.style.backgroundColor =
										'#f6f7f7';
								}
							},
							onMouseLeave(e) {
								if (!isSelected) {
									e.currentTarget.style.borderColor = '#ddd';
									e.currentTarget.style.backgroundColor =
										'#fff';
								}
							},
						},
						el(
							'svg',
							{
								xmlns: 'http://www.w3.org/2000/svg',
								viewBox: '0 0 20 20',
								style: {
									width: '20px',
									height: '20px',
									display: 'block',
								},
								'aria-hidden': true,
								focusable: 'false',
							},
							el('path', {
								d: paths[iconName],
								fill: 'currentColor',
							})
						)
					);
				})
			)
		);
	}

	// Custom Size Control with range slider and unit selector.
	function SizeUnitControl(props) {
		const { label, value, unit, onChangeValue, onChangeUnit } = props;

		return el(
			BaseControl,
			{
				label,
				className: 'rsdsb-size-unit-control',
				__nextHasNoMarginBottom: true,
			},
			el(
				'div',
				{ style: { marginBottom: '12px' } },
				el('input', {
					type: 'range',
					value: value || 20,
					onChange(e) {
						const newValue = parseFloat(e.target.value) || 20;
						onChangeValue(newValue);
					},
					min: 0,
					max: 200,
					step: 1,
					style: {
						width: '100%',
					},
				})
			),
			el(
				'div',
				{
					style: {
						display: 'flex',
						alignItems: 'center',
						position: 'relative',
						border: '1px solid #757575',
						borderRadius: '2px',
						backgroundColor: '#fff',
					},
				},
				el('input', {
					type: 'number',
					value: value || '',
					onChange(e) {
						const newValue = parseFloat(e.target.value) || 0;
						onChangeValue(newValue);
					},
					min: 0,
					step: 1,
					style: {
						flex: '1',
						border: 'none',
						padding: '6px 8px',
						fontSize: '13px',
						outline: 'none',
						width: '100%',
					},
				}),
				el(
					'span',
					{
						style: {
							borderLeft: '1px solid #ddd',
							backgroundColor: '#fff',
						},
					},
					el(
						'select',
						{
							value: unit || 'px',
							onChange(e) {
								onChangeUnit(e.target.value);
							},
							'aria-label': __('Select unit', 'svg-block-for-dashicon-rotistudio'),
							style: {
								border: 'none',
								padding: '6px 22px 6px 8px',
								fontSize: '13px',
								outline: 'none',
								cursor: 'pointer',
								backgroundColor: 'transparent',
							},
						},
						el('option', { value: 'px' }, 'px'),
						el('option', { value: '%' }, '%'),
						el('option', { value: 'em' }, 'em'),
						el('option', { value: 'rem' }, 'rem'),
						el('option', { value: 'vw' }, 'vw'),
						el('option', { value: 'vh' }, 'vh')
					)
				)
			)
		);
	}

	// Alignment Control with ToggleGroupControl.
	function AlignmentControl(props) {
		const { label, value, onChange } = props;

		return el(
			BaseControl,
			{ label, __nextHasNoMarginBottom: true },
			el(
				ToggleGroupControl,
				{
					value,
					onChange,
					isBlock: true,
				},
				el(ToggleGroupControlOption, {
					value: 'none',
					label: el('span', {
						className: 'dashicons dashicons-no',
						title: __('No alignment', 'svg-block-for-dashicon-rotistudio'),
					}),
					'aria-label': __('No alignment', 'svg-block-for-dashicon-rotistudio'),
				}),
				el(ToggleGroupControlOption, {
					value: 'left',
					label: el('span', {
						className: 'dashicons dashicons-align-left',
						title: __('Align left', 'svg-block-for-dashicon-rotistudio'),
					}),
					'aria-label': __('Align left', 'svg-block-for-dashicon-rotistudio'),
				}),
				el(ToggleGroupControlOption, {
					value: 'center',
					label: el('span', {
						className: 'dashicons dashicons-align-center',
						title: __('Align center', 'svg-block-for-dashicon-rotistudio'),
					}),
					'aria-label': __('Align center', 'svg-block-for-dashicon-rotistudio'),
				}),
				el(ToggleGroupControlOption, {
					value: 'right',
					label: el('span', {
						className: 'dashicons dashicons-align-right',
						title: __('Align right', 'svg-block-for-dashicon-rotistudio'),
					}),
					'aria-label': __('Align right', 'svg-block-for-dashicon-rotistudio'),
				})
			)
		);
	}

	registerBlockType('rsdsb/dashicon', {
		title: __('SVG block for Dashicon', 'svg-block-for-dashicon-rotistudio'),
		description: __(
			'Insert a WordPress Dashicon rendered as inline SVG.',
			'svg-block-for-dashicon-rotistudio'
		),
		icon: 'smiley',
		category: 'common',
		keywords: [
			__('icon', 'svg-block-for-dashicon-rotistudio'),
			__('dashicon', 'svg-block-for-dashicon-rotistudio'),
			__('svg', 'svg-block-for-dashicon-rotistudio'),
		],

		attributes: {
			icon: {
				type: 'string',
				default: 'admin-home',
			},
			size: {
				type: 'number',
				default: 20,
			},
			sizeUnit: {
				type: 'string',
				default: 'px',
			},
			align: {
				type: 'string',
				default: 'none',
			},
			linkUrl: {
				type: 'string',
				default: '',
			},
			linkTarget: {
				type: 'string',
				default: '',
			},
			linkRel: {
				type: 'string',
				default: '',
			},
			linkLabel: {
				type: 'string',
				default: '',
			},
		},

		example: {
			attributes: {
				icon: 'star-filled',
				size: 48,
				sizeUnit: 'px',
				align: 'center',
			},
		},

		supports: {
			color: {
				text: true,
				background: true,
				gradients: true,
			},
			spacing: {
				padding: true,
				margin: true,
			},
			__experimentalBorder: {
				radius: true,
			},
		},

	edit( props ) {
		const { attributes, setAttributes } = props;

		// eslint-disable-next-line react-hooks/rules-of-hooks -- WP block API requires lowercase 'edit'.
		const [ isLinkOpen, setIsLinkOpen ] = useState( false );

		// eslint-disable-next-line react-hooks/rules-of-hooks -- WP block API requires lowercase 'edit'.
		const blockProps = useBlockProps( {
			className:
				'none' !== attributes.align
					? 'align' + attributes.align
					: '',
		} );

		// Split WordPress-generated styles: visual ones go to inner wrapper, color to SVG.
		const wpStyles = blockProps.style || {};
		const { svgOnly, wrapperOnly } = splitStyles( wpStyles );

		// Outer div: blockProps without visual inline styles (stripped via editor CSS).
		blockProps.style = {};

		// Inner wrapper styles.
		const centerStyles =
			'center' === attributes.align
				? {
						marginRight: wrapperOnly.marginRight || 'auto',
						marginLeft: wrapperOnly.marginLeft || 'auto',
					}
				: {};

		const innerStyle = Object.assign(
			{},
			wrapperOnly,
			{ width: 'fit-content', height: 'fit-content', lineHeight: 0 },
			centerStyles
		);

		// Preset gradient: add as inline value (class-based gradient is stripped from outer div).
		if ( ! innerStyle.background && attributes.gradient ) {
			innerStyle.background = 'var(--wp--preset--gradient--' + attributes.gradient + ')';
		}

		// Preset background color: add as inline value.
		if ( ! innerStyle.backgroundColor && attributes.backgroundColor ) {
			innerStyle.backgroundColor = 'var(--wp--preset--color--' + attributes.backgroundColor + ')';
		}

		// Apply inner wrapper styles with !important via DOM API.
		// eslint-disable-next-line react-hooks/rules-of-hooks -- WP block API requires lowercase 'edit'.
		const innerRef = useRef( null );

		// eslint-disable-next-line react-hooks/rules-of-hooks -- WP block API requires lowercase 'edit'.
		useEffect( function () {
			var node = innerRef.current;
			if ( ! node ) {
				return;
			}
			var cssText = '';
			for ( var styleKey in innerStyle ) {
				if ( innerStyle.hasOwnProperty( styleKey ) ) {
					var cssKey = styleKey.replace( /([A-Z])/g, '-$1' ).toLowerCase();
					var val = innerStyle[ styleKey ];
					if ( typeof val === 'number' ) {
						val = String( val );
					}
					cssText += cssKey + ': ' + val + ' !important; ';
				}
			}
			node.style.cssText = cssText;
		} );

		return el(
			Fragment,
			null,
			el(
				BlockControls,
				null,
				el(
					ToolbarGroup,
					null,
					el( ToolbarButton, {
						icon: linkIcon,
						title: __( 'Link' ),
						onClick() {
							setIsLinkOpen( ! isLinkOpen );
						},
						isActive: !! attributes.linkUrl,
					} )
				)
			),
			isLinkOpen && el(
				Popover,
				{
					position: 'bottom center',
					onClose() {
						setIsLinkOpen( false );
					},
					anchor: innerRef.current,
					focusOnMount: 'firstElement',
				},
				el( LinkControl, {
					value: {
						url: attributes.linkUrl || '',
						opensInNewTab: '_blank' === attributes.linkTarget,
						noFollow: -1 !== ( attributes.linkRel || '' ).indexOf( 'nofollow' ),
					},
					settings: [
						{
							id: 'opensInNewTab',
							title: __( 'Open in new tab' ),
						},
						{
							id: 'noFollow',
							title: __( 'Mark as nofollow' ),
						},
					],
					onChange( nextValue ) {
						var relParts = [];
						if ( nextValue.opensInNewTab ) {
							relParts.push( 'noopener' );
						}
						if ( nextValue.noFollow ) {
							relParts.push( 'nofollow' );
						}
						setAttributes( {
							linkUrl: nextValue.url || '',
							linkTarget: nextValue.opensInNewTab ? '_blank' : '',
							linkRel: relParts.length ? relParts.join( ' ' ) : '',
						} );
					},
					onRemove() {
						setAttributes( {
							linkUrl: '',
							linkTarget: '',
							linkRel: '',
						} );
						setIsLinkOpen( false );
					},
				} )
			),
			el(
				InspectorControls,
				null,
				el(
					PanelBody,
					{
						title: __(
							'Dashicon settings',
							'svg-block-for-dashicon-rotistudio'
						),
						__nextHasNoMarginBottom: true,
					},
					el( IconPickerControl, {
						label: __( 'Icon', 'svg-block-for-dashicon-rotistudio' ),
						value: attributes.icon,
						onChange( newIcon ) {
							setAttributes( { icon: newIcon } );
						},
					} )
				),
				el(
					PanelBody,
					{
						title: __( 'Link settings', 'svg-block-for-dashicon-rotistudio' ),
						initialOpen: false,
						__nextHasNoMarginBottom: true,
					},
					el( TextControl, {
						label: __( 'Link label (aria-label)', 'svg-block-for-dashicon-rotistudio' ),
						help: __( 'Descriptive text for screen readers, e.g. "Go to homepage".', 'svg-block-for-dashicon-rotistudio' ),
						value: attributes.linkLabel || '',
						onChange( val ) {
							setAttributes( { linkLabel: val } );
						},
						__nextHasNoMarginBottom: true,
						__next40pxDefaultSize: true,
					} )
				)
			),
			el(
				InspectorControls,
				{ group: 'styles' },
				el(
					PanelBody,
					{
						title: __( 'Icon styles', 'svg-block-for-dashicon-rotistudio' ),
						initialOpen: true,
						__nextHasNoMarginBottom: true,
					},
					el( SizeUnitControl, {
						label: __( 'Size', 'svg-block-for-dashicon-rotistudio' ),
						value: attributes.size,
						unit: attributes.sizeUnit,
						onChangeValue( newSize ) {
							setAttributes( { size: newSize } );
						},
						onChangeUnit( newUnit ) {
							setAttributes( { sizeUnit: newUnit } );
						},
					} ),
					el( AlignmentControl, {
						label: __( 'Alignment', 'svg-block-for-dashicon-rotistudio' ),
						value: attributes.align,
						onChange( newAlign ) {
							setAttributes( { align: newAlign } );
						},
					} )
				)
			),
			el(
				'div',
				blockProps,
				el(
					'div',
					{
						ref: innerRef,
						className: 'rsdsb-inner-wrapper',
						role: 'presentation',
					},
					renderSvg(
						attributes.icon,
						attributes.size,
						attributes.sizeUnit,
						svgOnly
					)
				)
			)
		);
	},

		// Dynamic block rendered in PHP.
		save() {
			return null;
		},
	});
})();


