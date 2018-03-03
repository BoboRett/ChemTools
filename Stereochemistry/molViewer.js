function ButtonGen( root, id, x, y, rx, ry, w, h, text, onclick ){ //Button template
	var onclick = onclick || ""
	var tmp = root.append( "g" ).attr( "class", "button" ).attr( "id", id );

	var bg = tmp.append( "rect" )
		.attr( "x", x )
		.attr( "y", y )
		.attr( "rx", rx )
		.attr( "ry", ry )
		.attr( "width", w )
		.attr( "height", h )
		.attr( "onclick", onclick)

	var txt = tmp.append( "text" )
		.attr( "x", x + w/2 )
		.attr( "y", y + 2.4 + h/2 )
		.text( text )
}
function LineGen( root, cls, id, x1, x2, y1, y2, attributes, styles ){ //Line template
	var attributes = attributes || []
	var styles = styles || []

	tmp = root.append( "line" )
		.attr( "class", cls )
		.attr( "id" ,id )
		.attr( "x1" ,x1 )
		.attr( "x2" ,x2 )
		.attr( "y1" ,y1 )
		.attr( "y2" ,y2 )

	for( var attribute of attributes ){ tmp.attr( ...attribute ) };
	for( var style of styles ){	tmp.style( ...style[0] ) };

	return tmp
}
function TextGen( root, cls, id, x, y, text, attributes, styles ){ //Text template
	var attributes = attributes || []
	var styles = styles || []

	tmp = root.append( "text" )
		.attr( "class", cls )
		.attr( "id", id )
		.attr( "x", x )
		.attr( "y", y )
		.text( text )

	for( var attribute of attributes ){ tmp.attr( ...attribute ) };
	for( var style of styles ){	tmp.style( ...style[0] ) };

	return tmp
}

var Mol2D = function( container, dims ){
	var self = this
	self.container = container;
	self.molecule = {};
	self.molfile = "";
	self.svg = self.container.append( "svg" ).attr( "viewBox", dims.join( "," ) ).attr( "id", "view2d" );
	var root = self.svg.append( "g" ).attr( "id", "rootframe" );

	var zoomFunc = d3.zoom().on( "zoom", function(){

				var screenScale = root.node().getBoundingClientRect().width / self.svg.node().viewBox.baseVal.width;
				var d = root.datum();

				root.transition()
					.duration( 300 )
					.ease( d3.easeCircleOut )
					.attr( "transform", d3.event.transform )
	})

	//////Get 2D Molecule from OCL//////
	self.getFromSMILE = function( smile, addH ){

		var molecule = OCL.Molecule.fromSmiles( smile );
		addH && molecule.addImplicitHydrogens();
		data = molecule.toMolfile();
		var mol = self.parse( data );

		self.molfile = mol;
		return mol

	};

	//////Parse 2D data into object//////
	self.parse = function( data ){
		var mol2d = {};
		const [numatoms,numbonds] = data.split( "\n" )[3].match( /.{1,3}/g ).slice( 0, 2 ).map( el => parseInt( el ) );

		mol2d.atoms = data.split( "\n" )
						.slice( 4, 4 + numatoms )
						.map( function( el, i ){
							const tmp = el.match( /\S+/g );
							return {
								index: i,
								pos:[parseFloat( tmp[0] ) * 40, parseFloat( tmp[1] ) * 40],
								element: tmp[3]
							}
						});
		mol2d.bonds = data.split( "\n" )
						.slice( 4 + numatoms, 4 + numatoms + numbonds )
						.map( function( el, i ){
							const tmp = el.match( /.{1,3}/g );
							return {
								index: i,
								start: mol2d.atoms[tmp[0] - 1],
								end: mol2d.atoms[tmp[1] - 1],
								type: parseInt( tmp[2] ) + "_" + parseInt( tmp[3] ),
								claimed: false
							}
						});

		mol2d.atoms.forEach( function( atom, i ){
			atom.bondedTo = []
			mol2d.bonds
				.filter( bond => bond.start.index === i || bond.end.index === i )
				.map( function( bond ){
					var from = i;
					var to = ( bond.start.index === i ? bond.end.index : bond.start.index );
					atom.bondedTo.push( {el: mol2d.atoms[to], bond: bond} );
				})
		})

		mol2d.fGroups = fGroupSearcher( mol2d );

		self.molecule = mol2d

		return mol2d;
	}

	//////Draw 2D Molecule//////
	self.draw = function( ){
		const atoms = self.molecule.atoms
		const bonds = self.molecule.bonds;
		root.attr( "transform", null ) ;
		root.html( "" );

		//////ATOMS//////
		const atomsroot = root.append( "g" ).attr( "class", "atoms" )
		atoms.map( function( atom, i ){

			const tmp = atomsroot.append( "g" ).attr( "class", "atom_" + atom.element );
			tmp.append( "circle" ).attr( "class", "highlight" ).attr( "id", i ).attr( "cx", atom.pos[0] ).attr( "cy", atom.pos[1] ).attr( "r", 12 );

			atom.element != "C" && TextGen( tmp, "label_" + atom.element, "", atom.pos[0], atom.pos[1] + 6, atom.element, [], [] );
			TextGen( tmp, "atomind", "", atom.pos[0]+7, atom.pos[1] -3, i, [], [] );
			atom.element != "H" && tmp.append( "g" ).attr( "class", "hydrogens" );

		})

		//////BONDS//////
		const bondsroot = root.append( "g" ).attr( "class", "bonds" );
		const labelOffset = 8;

		bonds.map( function( bond, j ){

			const tmp = bondsroot.append( "g" ).attr( "class", "bond_" + bond.type );
			const theta = Math.atan2( bond.end.pos[1] - bond.start.pos[1], bond.end.pos[0] - bond.start.pos[0] );
			const length = Math.hypot( bond.end.pos[0] - bond.start.pos[0], bond.end.pos[1] - bond.start.pos[1] );

			tmp.append( "rect" )
				.attr( "x", -labelOffset ).attr( "y", -7.5 )
				.attr( "rx", 7.5 ).attr( "ry", 7.5 )
				.attr( "width", length + 2*labelOffset ).attr( "height", 15)
				.attr("transform", "translate(" + bond.start.pos[0] + "," + bond.start.pos[1] + ")rotate(" + theta*180/Math.PI + ")" )
				.attr( "class", "highlight" )
				.attr( "id", bond.start.index + "_" + bond.end.index );

			var bondline = LineGen( tmp, "bondline", "",
				bond.start.pos[0] + ( bond.start.element === "C" ? 0 : labelOffset * Math.cos( theta ) ),
				bond.end.pos[0] - ( bond.end.element === "C" ? 0 : labelOffset * Math.cos( theta ) ),
				bond.start.pos[1] + ( bond.start.element === "C" ? 0 : labelOffset * Math.sin( theta ) ),
				bond.end.pos[1] - ( bond.end.element === "C" ? 0 : labelOffset * Math.sin( theta ) ),
				[],[]);

			if( bond.start.element === "H" || bond.end.element === "H" ){

				document.getElementById( bond.start.element === "H" ? bond.end.index : bond.start.index ).parentNode.getElementsByClassName("hydrogens")[0].appendChild( tmp.node() )
				document.getElementById( bond.start.element === "H" ? bond.end.index : bond.start.index ).parentNode.getElementsByClassName("hydrogens")[0].appendChild( document.getElementById( ( bond.start.element === "H" ? bond.start.index : bond.end.index ) ).parentNode )

			}

		});

		multiBonds();

		//////FIT self.svg TO SCREEN//////
		const rootBox = root.node().getBBox()
		const viewBox = self.svg.node().viewBox.baseVal
		const zoom = rootBox.width > rootBox.height ? viewBox.width/rootBox.width : viewBox.height/rootBox.height

		self.svg
			.call( zoomFunc )
			.call( zoomFunc.transform, d3.zoomIdentity.translate( viewBox.width/2 + ( - rootBox.x - rootBox.width/2 )*zoom, viewBox.height/2 + ( - rootBox.y - rootBox.height/2 )*zoom ).scale( zoom ) )

		//////CONVERT BONDS//////
		function multiBonds(){
			d3.selectAll( ".bondline" ).each( function(){
				var line = d3.select( this ).attr( "class", null );
				var parent = d3.select( this.parentNode );

				const theta = Math.atan2( line.attr( "y2" ) - line.attr( "y1" ), line.attr( "x2" ) - line.attr( "x1" ) );
				const length = Math.hypot( line.attr( "y2" ) - line.attr( "y1" ), line.attr( "x2" ) - line.attr( "x1" ) );
				const coords = [parseFloat( line.attr( "x1" ) ), parseFloat( line.attr( "x2" ) ), parseFloat( line.attr( "y1" ) ), parseFloat( line.attr( "y2" ) )];

				switch( parent.attr( "class" ).split( "_" )[1] ){

					case "1": //single bond

						switch( parseInt( parent.attr( "class" ).split( "_" )[2] ) ){

							case 0: //normal bond

								parent.attr( "class", "bond" );
								break;

							case 1: //wedge bond

								var tmp = parent.attr( "class", "bond_wedge" ).append( "polygon" )
									.attr( "id", line.attr( "id" ) )
									.attr( "points", coords[0] + "," + coords[2] + " " +
										 ( coords[1] + 5*Math.cos( theta + Math.PI/2 ) ).toFixed( 2 ) + "," + ( coords[3] + 5*Math.sin( theta + Math.PI/2 ) ).toFixed( 2 ) + " " +
										 ( coords[1] - 5*Math.cos( theta + Math.PI/2 ) ).toFixed( 2 ) + "," + ( coords[3] - 5*Math.sin( theta + Math.PI/2 ) ).toFixed( 2 ) );
								line.remove()
								break;

							case 6: //hash bond

								var tmp = parent.attr( "class", "bond_hash" );
								for( var i = 1; i < 15; i++ ){
									tmp.append( "line" ).attr( "class", "bond" )
										.attr( "x1", ( coords[0] + i/15 * length*Math.cos( theta ) + i/3 * Math.cos( theta + Math.PI/2 ) ).toFixed( 2 ) )
										.attr( "x2", ( coords[0] + i/15 * length*Math.cos( theta ) - i/3 * Math.cos( theta + Math.PI/2 ) ).toFixed( 2 ) )
										.attr( "y1", ( coords[2] + i/15 * length*Math.sin( theta ) + i/3 * Math.sin( theta + Math.PI/2 ) ).toFixed( 2 ) )
										.attr( "y2", ( coords[2] + i/15 * length*Math.sin( theta ) - i/3 * Math.sin( theta + Math.PI/2 ) ).toFixed( 2 ) );
								};
								line.remove()
								break;

						}

						break;

					case "2": //double bond

						parent.attr( "class", "bond_dbl" );
						parent.node().appendChild( line
							.attr( "x1", coords[0] - 2.5*Math.cos( theta + Math.PI/2 ) )
							.attr( "x2", coords[1] - 2.5*Math.cos( theta + Math.PI/2 ) )
							.attr( "y1", coords[2] - 2.5*Math.sin( theta + Math.PI/2 ) )
							.attr( "y2", coords[3] - 2.5*Math.sin( theta + Math.PI/2 ) )
							.node() );
						parent.node().appendChild( d3.select( line.node().cloneNode() )
							.attr( "x1", coords[0] + 2.5*Math.cos( theta + Math.PI/2 ) )
							.attr( "x2", coords[1] + 2.5*Math.cos( theta + Math.PI/2 ) )
							.attr( "y1", coords[2] + 2.5*Math.sin( theta + Math.PI/2 ) )
							.attr( "y2", coords[3] + 2.5*Math.sin( theta + Math.PI/2 ) )
							.node() );
						break;

					case "3": //triple bond

						parent.attr( "class", "bond_trp" );
						parent.node().appendChild( line.node().cloneNode() );
						parent.node().appendChild( line
							.attr( "x1", coords[0] - 2.5*Math.cos( theta + Math.PI/2 ) )
							.attr( "x2", coords[1] - 2.5*Math.cos( theta + Math.PI/2 ) )
							.attr( "y1", coords[2] - 2.5*Math.sin( theta + Math.PI/2 ) )
							.attr( "y2", coords[3] - 2.5*Math.sin( theta + Math.PI/2 ) )
							.node() );
						parent.node().appendChild( d3.select( line.node().cloneNode() )
							.attr( "x1", coords[0] + 2.5*Math.cos( theta + Math.PI/2 ) )
							.attr( "x2", coords[1] + 2.5*Math.cos( theta + Math.PI/2 ) )
							.attr( "y1", coords[2] + 2.5*Math.sin( theta + Math.PI/2 ) )
							.attr( "y2", coords[3] + 2.5*Math.sin( theta + Math.PI/2 ) )
							.node() );
						break;

					case "4": //aromatic bond

						line.attr("class","bond")
						break;

				}

			})

		}
	}

	self.showH = function( showH ){

		d3.selectAll( ".hydrogens" ).each( function(){

			d3.select(this).attr("display",	showH ? "all" : "none" );

		});

	}
}

var Mol3D = function( container, params ){

	params = params || {}
	var self = this

	self.container = container.node();
	self.molecule;
	self.camActive;
	self.renderer;
	self.stats;
	var ajaxRunning;
	self.animID;


	var material, mesh, hydrogens;
	var	intersected;
	var aspect = self.container.getBoundingClientRect().width / self.container.getBoundingClientRect().height
	var frustum = 10;
	var effect;

	//////BUILT-INS//////
	self.frameFunctions = {
		//////Highlight elements on hover//////
		highlight: {enabled: false, fn: function(){
								var raycaster = new THREE.Raycaster();
								raycaster.setFromCamera( self.mouse, self.camActive );

								var intersects = raycaster.intersectObjects( self.scene.children, true );

								if( self.mouse.x > -1 && self.mouse.x < 1 && self.mouse.y > -1 && self.mouse.y < 1 && intersects.length > 0){
									intersected && intersected.material.emissive.setHex( intersected.currentHex );

									if( intersects[0].object instanceof THREE.Mesh ){
										intersected = intersects[0].object;
										intersected.currentHex = intersected.material.emissive.getHex();
										intersected.material.emissive.setHex ( 0xff0000 );
									}
									else{
										intersected = null;
									}

								} else {
									intersected && intersected.material.emissive.setHex( intersected.currentHex );

								}

							}
			},
		//////Auto rotate//////
		autoRotate: {enabled: false, fn: function(){ self.molGroup.rotateOnWorldAxis( new THREE.Vector3( 0, 1, 0 ), 0.01 ) } },
		//////Highlight svg elements from 3D//////
		highlightSync: {enabled: false, fn: function(){
												var raycaster = new THREE.Raycaster();
												raycaster.setFromCamera( self.mouse, self.camActive );

												var intersects = raycaster.intersectObjects( self.scene.children, true );

												if( self.mouse.x > -1 && self.mouse.x < 1 && self.mouse.y > -1 && self.mouse.y < 1 && intersects.length > 0){

													self.hovered && self.hovered.attr( "class", "highlight" );

													var highlighted = intersects[0].object;
													switch( highlighted.userData.type ){

														case "fGroup":

															self.hovered = d3.selectAll( "[id='" + highlighted.userData.source.source.index + "'], " + highlighted.userData.source.domain.map( el =>  "[id='" + el.index + "']" ).join( ", " ) )
															break;

														case "atom":
														case "bond":

															self.hovered = highlighted.name.toString().includes("_") ?
																d3.select( "[id='" + highlighted.name + "'], [id='" + highlighted.name.toString().split("").reverse().join("") + "']" ) :
																d3.select( "[id='" + highlighted.name + "']" )
															break;

													}

													self.hovered && self.hovered.attr( "class", "highlight_hover" );

												} else {

													self.hovered && self.hovered.attr( "class", "highlight" )

												}
											}
		}
	};

	//////PROPS//////
	var disableInteractions = params.disableInteractions !== undefined ? params.disableInteractions : false;
	var showfGroups = params.showfGroups !== undefined ? params.showfGroups : true;
	self.frameFunctions.highlight.enabled = params.highlight !== undefined ? params.highlight : true;
	self.frameFunctions.highlightSync.enabled = params.highlightSync !== undefined ? params.highlightSync : false;
	self.frameFunctions.autoRotate.enabled = params.autoRotate !== undefined ? params.autoRotate : false;

	self.scene = new THREE.Scene();
	self.stats = new Stats()
	self.mouse = new THREE.Vector2()

	//////CAMERAS//////
	var camPersp = new THREE.PerspectiveCamera( 70, aspect, 1, 100);
	var	camOrtho = new THREE.OrthographicCamera( -frustum*aspect / 2, frustum*aspect / 2, frustum / 2, -frustum / 2, -100, 100 );
	self.camActive = camPersp;
	self.controls = new THREE.TrackballControls( camPersp, self.container );
	disableInteractions && self.controls.dispose()

	//////LIGHTS//////
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( 3, 3, 3 );
	self.scene.add( directionalLight );

	//////RENDERER SETUP//////
	self.renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} );
	self.renderer.setPixelRatio( window.devicePixelRatio );
	self.renderer.setClearColor( 0xffffff, 0 );
	self.renderer.setSize( self.container.getBoundingClientRect().width, self.container.getBoundingClientRect().height );
	self.container.appendChild( self.renderer.domElement );
	self.renderer.domElement.parentNode.appendChild( self.stats.dom )

	effect = new THREE.OutlineEffect( self.renderer, {defaultThickness: 0.002} );

	//////CPK Colours//////
	var atomCols = new Proxy( {
		H: 		[1,1,1],
		He: 	[0.85,1,1],
		Li: 	[0.8,0.5,1],
		Be: 	[0.76,1,0],
		B: 		[1,0.71,0.71],
		C: 		[0.56,0.56,0.56],
		N: 		[0.19,0.31,0.97],
		O: 		[1,0.05,0.05],
		F: 		[0.56,0.88,0.31],
		Ne: 	[0.7,0.89,0.96],
		Na: 	[0.67,0.36,0.95],
		Mg: 	[0.54,1,0],
		Al: 	[0.75,0.65,0.65],
		Si: 	[0.94,0.78,0.63],
		P: 		[1,0.5,0],
		S: 		[1,1,0.19],
		Cl: 	[0.12,0.94,0.12],
		Ar: 	[0.5,0.82,0.89],
		K: 		[0.56,0.25,0.83],
		Ca: 	[0.24,1,0],
		Sc: 	[0.9,0.9,0.9],
		Ti: 	[0.75,0.76,0.78],
		V: 		[0.65,0.65,0.67],
		Cr: 	[0.54,0.6,0.78],
		Mn: 	[0.61,0.48,0.78],
		Fe: 	[0.88,0.4,0.2],
		Co: 	[0.94,0.56,0.63],
		Ni: 	[0.31,0.82,0.31],
		Cu: 	[0.78,0.5,0.2],
		Zn: 	[0.49,0.5,0.69],
		Ga: 	[0.76,0.56,0.56],
		Ge: 	[0.4,0.56,0.56],
		As: 	[0.74,0.5,0.89],
		Se: 	[1,0.63,0],
		Br: 	[0.65,0.16,0.16],
		Kr: 	[0.36,0.72,0.82],
		Rb: 	[0.44,0.18,0.69],
		Sr: 	[0,1,0],
		Y: 		[0.58,1,1],
		Zr: 	[0.58,0.88,0.88],
		Nb: 	[0.45,0.76,0.79],
		Mo: 	[0.33,0.71,0.71],
		Tc: 	[0.23,0.62,0.62],
		Ru: 	[0.14,0.56,0.56],
		Rh: 	[0.04,0.49,0.55],
		Pd: 	[0,0.41,0.52],
		Ag: 	[0.75,0.75,0.75],
		Cd: 	[1,0.85,0.56],
		In: 	[0.65,0.46,0.45],
		Sn: 	[0.4,0.5,0.5],
		Sb: 	[0.62,0.39,0.71],
		Te: 	[0.83,0.48,0],
		I: 		[0.58,0,0.58],
		Xe: 	[0.26,0.62,0.69],
		Cs: 	[0.34,0.09,0.56],
		Ba: 	[0,0.79,0],
		La: 	[0.44,0.83,1],
		Ce: 	[1,1,0.78],
		Pr: 	[0.85,1,0.78],
		Nd: 	[0.78,1,0.78],
		Pm: 	[0.64,1,0.78],
		Sm: 	[0.56,1,0.78],
		Eu: 	[0.38,1,0.78],
		Gd: 	[0.27,1,0.78],
		Tb: 	[0.19,1,0.78],
		Dy: 	[0.12,1,0.78],
		Ho: 	[0,1,0.61],
		Er: 	[0,0.9,0.46],
		Tm: 	[0,0.83,0.32],
		Yb: 	[0,0.75,0.22],
		Lu: 	[0,0.67,0.14],
		Hf: 	[0.3,0.76,1],
		Ta: 	[0.3,0.65,1],
		W: 		[0.13,0.58,0.84],
		Re: 	[0.15,0.49,0.67],
		Os: 	[0.15,0.4,0.59],
		Ir: 	[0.09,0.33,0.53],
		Pt: 	[0.82,0.82,0.88],
		Au: 	[1,0.82,0.14],
		Hg: 	[0.72,0.72,0.82],
		Tl: 	[0.65,0.33,0.3],
		Pb: 	[0.34,0.35,0.38],
		Bi: 	[0.62,0.31,0.71],
		Po: 	[0.67,0.36,0],
		At: 	[0.46,0.31,0.27],
		Rn: 	[0.26,0.51,0.59],
		Fr: 	[0.26,0,0.4],
		Ra: 	[0,0.49,0],
		Ac: 	[0.44,0.67,0.98],
		Th: 	[0,0.73,1],
		Pa: 	[0,0.63,1],
		U: 		[0,0.56,1],
		Np: 	[0,0.5,1],
		Pu: 	[0,0.42,1],
		Am: 	[0.33,0.36,0.95],
		Cm: 	[0.47,0.36,0.89],
		Bk: 	[0.54,0.31,0.89],
		Cf: 	[0.63,0.21,0.83],
		Es: 	[0.7,0.12,0.83],
		Fm: 	[0.7,0.12,0.73],
		Md: 	[0.7,0.05,0.65],
		No: 	[0.74,0.05,0.53],
		Lr: 	[0.78,0,0.4],
		Rf: 	[0.8,0,0.35],
		Db: 	[0.82,0,0.31],
		Sg: 	[0.85,0,0.27],
		Bh: 	[0.88,0,0.22],
		Hs: 	[0.9,0,0.18],
		Mt: 	[0.92,0,0.15]
	}, {
		get: function( target, name ){
				return target.hasOwnProperty( name ) ? target[name]: [1, 0.1, 0.55];
		}
	});

	var bondCols = new Proxy( {
		1 : [0.1, 0.1, 0.1],
		2 : [0.5, 0.1, 0.3],
		3 : [0.1, 0.2, 0.5]
	}, {
		get: function( target, name ){
				return target.hasOwnProperty( name ) ? target[name]: [0, 0, 0];
		}
	});

	var groupCols = new Proxy( {
		Carboxyl : [0.3, 0.3, 0.3],
		"Carboxyl + Alkyl (Ester)" : [0.3, 0.3, 0.3],
		Amide : [0.56, 0.56, 1.0],
		"Acyl Chloride" : [1.0, 1.0, 0.0],
		Acetal : [1.0, 0.0, 0.0],
		Carbonyl : [1.0, 0.5, 0.5],
		Alkoxy : [1.0, 0.0, 0.0],
		Amino : [0.56, 0.56, 1.0],
		Nitro : [0.56, 0.56, 1.0],
		Hydroxyl : [1.0, 0.0, 0.0],
		Fluoro : [0.0, 1.0, 0.0],
		Chloro : [0.0, 1.0, 0.0],
		Bromo : [0.64, 0.18, 0.18],
		Iodo : [0.0, 1.0, 0.0],
		Nitrile : [0.56, 0.56, 1.0],
	}, {
		get: function( target, name ){
				return target.hasOwnProperty( name ) ? target[name]: [1, 0.1, 0.55];
		}
	});

	//////Get 3D Molecule from NCI CIR//////
	self.getFromSMILE = function( smile ){

		ajaxRunning = true
		var event = new Event( "ajaxComplete" )

		d3.request( "https://cactus.nci.nih.gov/chemical/structure/" + smile.replace( /\#/g, "%23" ).replace( /\[/g, "%5B" ).replace( /\]/g, "%5D" ) + "/file/xml?format=sdf&get3d=true")
			.get( function( err, d ){
				self.molfile = d.responseXML.children[0].children[0].children[0].innerHTML;
				self.parse( self.molfile )
				ajaxRunning = false
				document.dispatchEvent( event )
			})

	};

	//////Parse 3D data into object//////
	self.parse = function( data ){

		var mol3d = {}
		const [numatoms, numbonds] = data.split( "\n" )[3].match( /.{1,3}/g ).slice( 0, 2 ).map( el => parseInt( el ) );

		mol3d.atoms = data.split( "\n" )
						.slice( 4, 4 + numatoms )
						.map( function( el, i ){
							const tmp = el.match( /\S+/g );
							return {
								index: i,
								pos:[parseFloat( tmp[0] ),parseFloat( tmp[1] ), parseFloat( tmp[2] )],
								element: tmp[3]
							}
						});

		mol3d.bonds = data.split( "\n" )
						.slice( 4 + numatoms, 4 + numatoms + numbonds )
						.map( function( el, i ){
							const tmp = el.match( /.{1,3}/g );
							return {
								index: i,
								start: mol3d.atoms[tmp[0] - 1],
								end: mol3d.atoms[tmp[1] - 1],
								type: tmp[2].trim(),
								claimed: false
							}
						});

		mol3d.atoms.forEach( function( atom, i ){
			atom.bondedTo = []
			mol3d.bonds
				.filter( bond => bond.start.index === i || bond.end.index === i )
				.map( function( bond ){
					var from = i;
					var to = ( bond.start.index === i ? bond.end.index : bond.start.index );
					atom.bondedTo.push( {el: mol3d.atoms[to], bond: bond} );
				})
		});

		mol3d.fGroups = fGroupSearcher( mol3d );
		self.molecule = mol3d
		return mol3d

	};

	//////Draw Molecule//////
	self.draw = function( hidden ) {

		if( ajaxRunning ){ console.warn( "AJAX Request currently in progress: no data to draw. Listen for event 'ajaxComplete' after calling getFromSMILE() to call draw()." ) }
		else{
			if (Detector.webgl) {
				self.addtoScene( hidden );
				if( self.animID ){ window.cancelAnimationFrame( self.animID ) };
				self.animate()
				self.onWindowResize();
				window.addEventListener( "resize", self.onWindowResize );
			} else {
				var warning = Detector.getWebGLErrorMessage();
				d3.select( self.container ).appendChild( warning );
			};
		}

	};

	//////Initialise Scene//////
	self.addtoScene = function( hidden ) {

		self.molGroup = new THREE.Group()

		drawAtoms( self.molecule.atoms );
		drawBonds( self.molecule.bonds );

		hidden && console.warn("Molecule hidden. Use .molGroup to access scene objects.")
		self.molGroup.traverse( obj => { if( obj instanceof THREE.Mesh ){ obj.visible = !hidden } } )
		self.scene.add( self.molGroup );

		drawFunctionalGroups( self.molecule.fGroups );

 		//////Fit molecule to view///
		const sceneBox = new THREE.Box3().setFromObject( self.molGroup );
		sceneBox.width = sceneBox.max.x - sceneBox.min.x;;
		sceneBox.height = sceneBox.max.y - sceneBox.min.y;
		const zoom = sceneBox.width > sceneBox.height ? sceneBox.width : sceneBox.height;
		camPersp.position.z = zoom;

		//////MOUSE EVENTS//////
		d3.select( document ).on( 'mousemove', self.onMouseMove, false );

		function drawAtoms( atoms ){
			//////ATOMS//////
			atoms.forEach(function( el, i ){

				material = new THREE.MeshToonMaterial({
								color: new THREE.Color().setRGB( ...atomCols[el.element] ),
								reflectivity: 0.8,
								shininess: 0.8,
								specular: 0.8,
							});

				const sphere = new THREE.SphereGeometry( ( el.element === "H" ? 0.2 : 0.25 ) , 16, 16 )
				mesh = new THREE.Mesh( sphere, material );
				mesh.position.set( ...el.pos );

				mesh.name = el.index;
				mesh.userData.tooltip = el.element;
				mesh.userData.type = "atom";
				mesh.userData.source = el;

				self.molGroup.add( mesh );

			});
		}

		function drawBonds( bonds ){

			//////BONDS//////
			bonds.forEach( function( el, i ){
				var vec = new THREE.Vector3( ...el.end.pos ).sub( new THREE.Vector3( ...el.start.pos ) );//[el.end.pos[0] - el.start.pos[0], el.end.pos[1] - el.start.pos[1], el.end.pos[2] - el.start.pos[2]];

				switch ( el.type ){

					case "1":

						var bond = new THREE.TubeGeometry(
							new THREE.LineCurve3(
								new THREE.Vector3( 0, 0, 0 ),
								vec,
							), 0, .05, 14, false );
						break;

					case "2":
					case "3":

						const polar_sphere = [vec.length(), Math.acos(vec.z/vec.length()), Math.atan2(vec.y,vec.x)]; //[r,theta,phi]
						var bond = new THREE.Geometry();

						bond.merge( new THREE.TubeGeometry(
							new THREE.QuadraticBezierCurve3(
								new THREE.Vector3( 0, 0, 0 ),
								new THREE.Vector3(
											vec.x/2 + 0.5*Math.sin( polar_sphere[1] )*Math.cos( polar_sphere[2] + Math.PI/2 ),
											vec.y/2 + 0.5*Math.sin( polar_sphere[1] )*Math.sin( polar_sphere[2] + Math.PI/2 ),
											vec.z/2 + 0.5*Math.cos( polar_sphere[1] )
											),
								vec
							), 10, .05, 8, false )
						);

						bond.merge( new THREE.TubeGeometry(
							new THREE.QuadraticBezierCurve3(
								new THREE.Vector3( 0, 0, 0 ),
								new THREE.Vector3(
											vec.x/2 - 0.5*Math.sin( polar_sphere[1] )*Math.cos( polar_sphere[2] + Math.PI/2 ),
											vec.y/2 - 0.5*Math.sin( polar_sphere[1] )*Math.sin( polar_sphere[2] + Math.PI/2 ),
											vec.z/2 - 0.5*Math.cos( polar_sphere[1] )
											),
								vec
							), 10, .05, 8, false )
						);

						if ( el.type === "3" ) {

							bond.merge(
								new THREE.TubeGeometry(
									new THREE.LineCurve3(
										new THREE.Vector3( 0, 0, 0 ),
										vec,
								), 0, .05, 14, false )
							);

						};
						break;

				};

				material = new THREE.MeshToonMaterial({
										color: new THREE.Color().setRGB( ...bondCols[el.type] ),
										reflectivity: 0.8,
										shininess: 0.8,
										specular: 0.8,
									});
				mesh = new THREE.Mesh( bond, material );

				mesh.name = el.start.index + "_" + el.end.index;
				mesh.userData.source = el;
				mesh.userData.tooltip = el;
				mesh.userData.type = "bond";

				mesh.position.set( ...el.start.pos );



				self.molGroup.add( mesh );

				////// attach bond to root atom
				//THREE.SceneUtils.attach( mesh, self.scene, self.scene.getObjectByName( el.start.index ) )
				////// attach target atom to bond
				//THREE.SceneUtils.attach( self.scene.getObjectByName( el.end.index ), self.scene, mesh )

				//mesh.children[0].position.copy( new THREE.Vector3( ...el.end.pos ) ).sub( new THREE.Vector3( ...el.start.pos ) )



			})

		}

		function drawFunctionalGroups( fGroups ){
			//////FUNCTIONAL-GROUPS//////
			fGroups.forEach( function( el, i ){

				var hlmat = new THREE.MeshToonMaterial( {
							color: new THREE.Color().setHex( Math.random() * 0xffffff ),
							transparent: true,
							visible: true,
							opacity: 0.7,
							flatShading: true,
						});

				//Draw bonds//////
				// el.claimed.forEach( function ( d ){

					// var vec = new THREE.Vector3( ...d.end.pos ).sub( new THREE.Vector3( ...d.start.pos ) )//[d.end.pos[0] - d.start.pos[0], d.end.pos[1] - d.start.pos[1], d.end.pos[2] - d.start.pos[2]];

					// var hlgeo = new THREE.TubeGeometry(
								// new THREE.LineCurve3( new THREE.Vector3( 0, 0, 0 ), vec),
								// 0, 0.5, 14, false );

					// var hlmesh = new THREE.Mesh( hlgeo, hlmat );
					// hlmesh.userData.tooltip = el.type;
					// hlmesh.userData.type = "rGroup";
					// hlmesh.userData.source = el;
					// scene.getObjectByName( d.start.index + "_" + d.end.index ).add( hlmesh );
				// })

				//Draw atoms//////
				var hlgeo = new THREE.IcosahedronBufferGeometry( 0.5, 1 );
				var hlmesh = new THREE.Mesh( hlgeo, hlmat );

				var source = self.scene.getObjectByName( el.source.index );
				hlmesh.userData.tooltip = el.type;
				hlmesh.userData.type = "fGroup";

				el.domain.forEach( function( d ){

					const hlmeshNEW = hlmesh.clone();
					hlmeshNEW.userData.source = el;
					self.scene.getObjectByName( d.index ).add( hlmeshNEW );

					hlmeshNEW.visible = showfGroups

				});

				hlmesh.userData.source = el;


				source.add( hlmesh )

				hlmesh.visible = showfGroups


			})

		}

	}

	//////Show Scene hierarchy//////
	self.printHierarchy = function( obj ) {

		console.group( ' <' + obj.type + '> ' + obj.name );
		obj.children.forEach( printGraph );
		console.groupEnd();

	}

	//////Handle Click Event//////
	self.onMouseDown = {

		f: function(){},

		set fn( fn ) {
			this.f = fn;
			d3.select( self.container ).on( "mousedown", this.f, true );
		},

		get fn(){
			return this.f
		}

	}

	//////Handle Drag Event//////
	self.onMouseMove = function( evt ){

		event.preventDefault();
		elBox = self.renderer.domElement.getBoundingClientRect()
		self.mouse.x = (event.clientX-elBox.x) / elBox.width * 2 - 1;
		self.mouse.y = 1 - ((event.clientY-elBox.y) / elBox.height * 2);

	}

	//////Frame Calculations//////
	self.animate = function( ){

		self.animID = requestAnimationFrame( self.animate );
		self.controls.update();

		camOrtho.position.copy( new THREE.Vector3().copy( camPersp.position ) );
		camOrtho.rotation.copy( camPersp.rotation );
		frustum = frustum * self.controls.zoomFactor
		camOrtho.left = -frustum*aspect / 2;
		camOrtho.right = frustum*aspect / 2;
		camOrtho.top = frustum / 2;
		camOrtho.bottom = -frustum / 2;

		camOrtho.updateProjectionMatrix();

		self.stats.update()

		for( var el in self.frameFunctions ){ self.frameFunctions[el].enabled && self.frameFunctions[el].fn() }

		effect.render( self.scene, self.camActive );

	}

	//////Handle window resizing//////
	self.onWindowResize = function( ) {

		var elBox = self.container.getBoundingClientRect();
		aspect = elBox.width / elBox.height;
		camPersp.aspect = aspect;

		camOrtho.left   = - frustum * aspect / 2;
		camOrtho.right  =   frustum * aspect / 2;
		camOrtho.top    =   frustum / 2;
		camOrtho.bottom = - frustum / 2;

		self.camActive.updateProjectionMatrix();
		self.renderer.setSize( elBox.width, elBox.height );
		effect.render( self.scene, self.camActive );

	}

	self.toggleCam = function( ){

		self.camActive = self.camActive === camPersp ? camOrtho : camPersp;

	}

	self.showH = function( showH ){

		self.scene.traverse( function( ob ){

			switch( ob.userData.type ){

				case "atom":

					if( ob.userData.source.element === "H" ) ob.visible = showH;
					break;

				case "bond":

					if( ob.userData.source.start.element === "H" || ob.userData.source.end.element === "H" ) ob.visible = showH;
					break;

				case "rGroup":

					break;

			}
		});

	}

	self.showfGroups = function( show ){
		showfGroups = show;
		self.scene.traverse( function( obj ){
			if( obj.userData.type === "fGroup" ){
				obj.visible = show
			}
		})
	}

	self.interactions = function ( on ){
		if( on ){
			disableInteractions = false;
			!self.controls.registered && self.controls.register();
		} else{
			disableInteractions = true;
			self.controls.dispose();
		}
	}

	self.highlight = function( on ){
		self.frameFunctions.highlight.enabled = on
	}

	self.highlightSync = function( on ){
		self.frameFunctions.highlightSync.enabled = on
	}

	self.autoRotate = function( on ){
		self.frameFunctions.autoRotate.enabled = on
	}
}

//////UTILS//////
fGroupSearcher = function( mol ){
	var fGroups = []

	mol.atoms.filter( atom => atom.element != "H" ).forEach( function( atom ){
		var scanning = true

		var subStructures = [
							 {type: "Carboxylic Acid", root: "C", bonds:[{el: "O", btype: "2"}, {el: "O", btype: "1", bondedTo:[{el: "H", btype: "1"}]}]},
							 {type: "Ester", root: "C", bonds:[{el: "O", btype: "2"}, {el: "O", btype: "1", bondedTo:[{el: "R", btype: "1"}]}]},
							 {type: "Amide", root: "C", bonds:[{el: "O", btype: "2"}, {el: "N", btype: "1", bondedTo:[{el: "R", btype: "1"}, {el: "R", btype: "1"}]}]},

							 {type: "Acyl Halide", root: "C", bonds:[{el: "O", btype: "2"}, {el: "X", btype: "1"}]},

							 {type: "Aldehyde", root: "C", bonds:[{el: "O", btype: "2"}, {el: "H", btype: "1"}]},
							 {type: "Ketone", root: "C", bonds:[{el: "O", btype: "2"}]},

							 {type: "Primary Amine", root: "N", bonds:[{el: "H", btype: "1"},{el: "H", btype: "1"}]},
							 {type: "Secondary Amine", root: "N", bonds:[{el: "H", btype: "1"},{el: "R", btype: "1"}]},
							 {type: "Tertiary Amine", root: "N", bonds:[{el: "R", btype: "1"},{el: "R", btype: "1"}]},

							 {type: "Nitro", root: "N", bonds:[{el: "O", btype: "2"},{el: "O", btype: "1"}]},
							 {type: "Alcohol", root: "O", bonds:[{el: "H", btype: "1"}]},
							 {type: "Halo", root: "R", bonds:[{el: "X", btype: "1"}]},
							 {type: "Nitrile", root: "C", bonds:[{el: "N", btype: "3"}]},

							 {type: "Acetal", root: "C", bonds:[{el: "O", btype: "1"}, {el: "O", btype: "1"}]},
							 {type: "Ether", root: "O", bonds:[{el: "R", btype: "1"},{el: "R", btype: "1"}]},
							];

		while( scanning ){
			scanning = false

			for( ss of subStructures.filter( ss => ( ss.root === "R" ? true : ss.root === atom.element ) ) ) {

				var foundStructures = inBonds( atom, ss.bonds, atom.index, [] );

				if( foundStructures.hasOwnProperty( "source" ) ){
					foundStructures.type = ss.type;
					fGroups = fGroups.concat( foundStructures );
					foundStructures.claimed.map( el => {mol.bonds[el.index].claimed = true} )
					scanning = true;
					break;
				}

			}
		}

	})

	//////SEARCH BONDS OF ATOM//////
	function inBonds( source, subStruct, rootIndex, domain ){

		var results = [];

		var claimed = [];

		subStruct.forEach( function( ss ){

			ss.found = false;
			source.bondedTo.filter( link => link.el.index !== rootIndex && domain.map( dom => dom.index ).indexOf( link.el.index ) === -1 && link.bond.claimed === false ).forEach( function( link ){
					if( !ss.found && link.bond.type.split( "_" )[0] === ss.btype ){
						if( ( ss.el === "R" ? true : ( ss.el === "X" ? ["Cl", "Br", "I", "F"].indexOf(link.el.element) !== -1 : link.el.element === ss.el ) ) ){

							domain.push( link.el );
							claimed.push( link.bond );

							if( ss.hasOwnProperty( "bondedTo" ) ){

								//////Recursive search//////
								var deepSearch = inBonds( link.el , ss.bondedTo, rootIndex, domain );

								if( deepSearch.hasOwnProperty( "source" ) ){
									claimed = claimed.concat( deepSearch.claimed);
									ss.found = true;
								}

							} else{
								ss.found = true;
							}

						}
					}
				})

		})

		if( subStruct.filter( el => !el.found ).length < 1 ){
			results = {source: source, domain: domain, claimed: claimed};
		}

		return results
	}

	console.log( fGroups.map( el => el.type + " " + el.source.index + "," + el.domain.map( dom => dom.index ).join(",") ) )

	return fGroups
}