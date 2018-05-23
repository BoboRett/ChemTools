
var intromolfile = `C10H12N2O
	APtclcactv03021811533D 0   0.00000     0.00000

	 25 26  0  0  0  0  0  0  0  0999 V2000
	   -2.9412    0.0426    0.2708 C   0  0  0  0  0  0  0  0  0  0  0  0
	   -2.3564   -1.2023    0.3322 C   0  0  0  0  0  0  0  0  0  0  0  0
	   -0.9908   -1.3410    0.1065 C   0  0  0  0  0  0  0  0  0  0  0  0
	   -0.2173   -0.2031   -0.1836 C   0  0  0  0  0  0  0  0  0  0  0  0
	   -0.8213    1.0549   -0.2437 C   0  0  0  0  0  0  0  0  0  0  0  0
	   -2.1779    1.1716   -0.0163 C   0  0  0  0  0  0  0  0  0  0  0  0
	   -2.7714    2.3937   -0.0736 O   0  0  0  0  0  0  0  0  0  0  0  0
	    1.1554   -0.6813   -0.3648 C   0  0  0  0  0  0  0  0  0  0  0  0
	    1.1354   -2.0113   -0.1836 C   0  0  0  0  0  0  0  0  0  0  0  0
	   -0.1378   -2.4245    0.0989 N   0  0  0  0  0  0  0  0  0  0  0  0
	    2.3616    0.1603   -0.6930 C   0  0  0  0  0  0  0  0  0  0  0  0
	    2.9483    0.7359    0.5975 C   0  0  0  0  0  0  0  0  0  0  0  0
	    4.1241    1.5564    0.2775 N   0  0  0  0  0  0  0  0  0  0  0  0
	   -4.0026    0.1441    0.4424 H   0  0  0  0  0  0  0  0  0  0  0  0
	   -2.9577   -2.0710    0.5560 H   0  0  0  0  0  0  0  0  0  0  0  0
	   -0.2304    1.9311   -0.4661 H   0  0  0  0  0  0  0  0  0  0  0  0
	   -3.0553    2.5240   -0.9887 H   0  0  0  0  0  0  0  0  0  0  0  0
	    1.9968   -2.6593   -0.2512 H   0  0  0  0  0  0  0  0  0  0  0  0
	   -0.4011   -3.3424    0.2690 H   0  0  0  0  0  0  0  0  0  0  0  0
	    3.1109   -0.4565   -1.1893 H   0  0  0  0  0  0  0  0  0  0  0  0
	    2.0669    0.9758   -1.3535 H   0  0  0  0  0  0  0  0  0  0  0  0
	    2.1991    1.3527    1.0937 H   0  0  0  0  0  0  0  0  0  0  0  0
	    3.2431   -0.0795    1.2580 H   0  0  0  0  0  0  0  0  0  0  0  0
	    4.4758    1.9131    1.1534 H   0  0  0  0  0  0  0  0  0  0  0  0
	    4.8267    0.9281   -0.0827 H   0  0  0  0  0  0  0  0  0  0  0  0
	  1  2  2  0  0  0  0
	  2  3  1  0  0  0  0
	  3  4  2  0  0  0  0
	  4  5  1  0  0  0  0
	  5  6  2  0  0  0  0
	  1  6  1  0  0  0  0
	  6  7  1  0  0  0  0
	  4  8  1  0  0  0  0
	  8  9  2  0  0  0  0
	  9 10  1  0  0  0  0
	  3 10  1  0  0  0  0
	  8 11  1  0  0  0  0
	 11 12  1  0  0  0  0
	 12 13  1  0  0  0  0
	  1 14  1  0  0  0  0
	  2 15  1  0  0  0  0
	  5 16  1  0  0  0  0
	  7 17  1  0  0  0  0
	  9 18  1  0  0  0  0
	 10 19  1  0  0  0  0
	 11 20  1  0  0  0  0
	 11 21  1  0  0  0  0
	 12 22  1  0  0  0  0
	 12 23  1  0  0  0  0
	 13 24  1  0  0  0  0
	 13 25  1  0  0  0  0
	M  END
	$$$$
		`

var mol3d = new Mol3D( d3.select( "#gameFrame > .view3D" ), {disableInteractions: true, showfGroups: false, highlight: false, autoRotate: true} );
var mol2d = new Mol2D( d3.select( "#gameFrame > .view2D"), [0,0,480,321] );
var mouseover = function(){};
var mouseout = function(){};

d3.csv( "data.csv", ( data ) => {d = data} )

mol3d.parse( intromolfile )
mol3d.draw()

function MenuView( state ){

	const w = 1020;
	var states = {
		root: [0, w, 2*w],
		CIP: [-w, 0, w],
		Newman: [-2*w, -w, 0],
	};

	d3.select( "#gameFrame > #root > :nth-child(1)" ).transition()
		.duration(1000)
		.ease(d3.easeBackInOut)
		.style( "left", states[state][0] + "px")

	d3.select( "#gameFrame > #root > :nth-child(2)" ).transition()
		.duration(1000)
		.ease(d3.easeBackInOut)
		.style( "left", states[state][1] + "px")

	d3.select( "#gameFrame > #root > :nth-child(3)" ).transition()
		.duration(1000)
		.ease(d3.easeBackInOut)
		.style( "left", states[state][2] + "px")
}

CIP = function( diff ){
	var self = this;
	self.diff = diff;
	self.labels = [];
	mol3d.interactions( true );
	mol3d.autoRotate( false );
	mol3d.highlightSync( true );
	mol3d.highlight( true );

	self.reset = function(){

		//////Reset game to original state//////
		mol3d.container.removeEventListener( "mouseover", self.mouseover);
		mol3d.container.removeEventListener( "mouseout", self.mouseout);
		mol2d.svg && mol2d.svg.remove();
		while( self.labels.length > 0 ){ self.labels.pop( 0 ).remove() };
		mol3d.scene.remove( mol3d.molGroup );
		d3.select( "#rootframe" ).html( "" );
		d3.selectAll( "#CIPtoggles > label > span" ).style( "fill", null ).style( "background-color", null );
		d3.selectAll( "#CIPtoggles > label > input" ).each( function(){ this.checked = false; } );
		d3.select( "#CIPinputs > .buttons > :nth-child(2)" ).html( "Skip" ).style( "background-color", null );
		d3.select( ".resultRight" ).remove()
		d3.select( "#molName" ).remove()

		d3.select( "#CIPrank" ).html(
			`<svg class="dd" id="CIPdragdrop" viewBox="0,0,600,120">
				<defs>
					<mask id="first">
						<rect  width="100%" height="100%" fill="#fff"/>
						<text x="110" y="42" fill="#b5b5b5">1st</text>
					</mask>
					<mask id="second">
						<rect  width="100%" height="100%" fill="#fff"/>
						<text x="235" y="42" fill="#b5b5b5">2nd</text>
					</mask>
					<mask id="third">
						<rect  width="100%" height="100%" fill="#fff"/>
						<text x="360" y="42" fill="#b5b5b5">3rd</text>
					</mask>
					<mask id="fourth">
						<rect  width="100%" height="100%" fill="#fff"/>
						<text x="485" y="42" fill="#b5b5b5">4th</text>
					</mask>
				</defs>
				<rect id="dd1_TAR" x="60" y="5" width="100" height="50" mask="url('#first')"></rect>
				<rect id="dd2_TAR" x="185" y="5" width="100" height="50" mask="url('#second')"></rect>
				<rect id="dd3_TAR" x="310" y="5" width="100" height="50" mask="url('#third')"></rect>
				<rect id="dd4_TAR" x="435" y="5" width="100" height="50" mask="url('#fourth')"></rect>
				<g class="draggable">
					<g id="dd1" transform="translate( 110, 100 )">
						<rect x=-50 y=-32 width=100 height=50></rect>
						<line x1="-30" x2="30" y1="5" y2="5"></line>
						<text></text>
						<line x1="-30" x2="30" y1="12" y2="12"></line>
					</g>
					<g id="dd2" transform="translate( 235, 100 )">
						<rect x=-50 y=-32 width=100 height=50></rect>
						<line x1="-30" x2="30" y1="5" y2="5"></line>
						<text></text>
						<line x1="-30" x2="30" y1="12" y2="12"></line>
					</g>
					<g id="dd3" transform="translate( 485, 100 )">
						<rect x=-50 y=-32 width=100 height=50></rect>
						<line x1="-30" x2="30" y1="5" y2="5"></line>
						<text></text>
						<line x1="-30" x2="30" y1="12" y2="12"></line>
					</g>
					<g id="dd4" transform="translate( 360, 100 )">
						<rect x=-50 y=-32 width=100 height=50></rect>
						<line x1="-30" x2="30" y1="5" y2="5"></line>
						<text></text>
						<line x1="-30" x2="30" y1="12" y2="12"></line>
					</g>
				</g>
			</svg>`
		);

		d3.selectAll( ".draggable > g" ).on( "mousedown touchstart", function(){dragLabel( this )} );
	}

	self.init = function(){

		self.reset();
		d3.select( ".help" )
			.style( "display", null )
			.on( "mouseover", function(){
				d3.select( this )
					.html( "Your job is to rank the atoms surrounding the target atom (highlighted in orange). From there, you can find the handedness of the molecule. <br/><br/> On HARD, you won't have the 3D view available to help you.")
					.style( "width", "300px")
					.style( "height", "170px")
					.on( "mouseout", function(){
						d3.select( this )
							.html( "?" )
							.style( "width", null )
							.style( "height", null )
					});
			});

		//////Frame positioning//////
		d3.transition()
			.duration( 1500 )
			.tween( null, function(){ return function( t ){mol3d.scene.traverse( obj => {obj instanceof THREE.Mesh && obj.scale.set( 1-t, 1-t, 1-t )} )} } )
			.on( "end", () => {

				self.runGame( self.diff );
				d3.selectAll( "#gameFrame > .view3D, #gameFrame > .view2D" )
					.style( "width", "480px" )
					.style( "height", "431px" )
				mol2d.onWindowResize();
				mol2d.fitToScreen();
				mol3d.onWindowResize();
			} )

		d3.select( "#gameFrame > #root" )
			.transition()
			.duration( 1500 )
			.ease( d3.easePolyInOut )
			.style( "top", "677px" )
		d3.select( "#gameFrame > #CIPinputs" )
			.transition()
			.duration( 1500 )
			.ease( d3.easePolyInOut )
			.style( "top", "184.5px")
	};

	self.runGame = function( ){
		var filtered = self.diff === 3 ? d.filter( el => el.CIPLvl !== "" ) : d.filter( el => +el.CIPLvl === ( self.diff === 1 ? 1 : 2 ) )
		self.answer = filtered[Math.floor( Math.random() * filtered.length)];

		mol2d.parse( self.answer.Data2D );
		mol3d.parse( self.answer.Data3D );

		d3.select( "#view2d" )
		mol2d.draw();

		mol2d.onWindowResize();
		mol3d.draw( true );

		//////Hide standard Hydrogens//////
		mol2d.molecule.atoms.map( el => {
			if( el.element === "H" ){
				var grp = d3.select( "[id='" + el.index + "']")
				if( grp.node().parentNode.parentNode.getAttribute( "class" ).split( "_" )[1] === "C" && grp.node().previousSibling.getAttribute( "class" ) === "bond" ){
					grp.attr( "display", "none" )
					d3.select( grp.node().previousSibling ).attr( "display", "none" )
				}
			}
		})

		//////Add molecule name//////
		d3.select( mol3d.container ).append( "p" ).attr( "id", "molName" ).text( self.answer.Name.split( "-" ).slice( -1 ) )

		//////Create labels for adjacent atoms//////
		mol3d.scene.getObjectByName( +self.answer.CIPRoot ).userData.source.bondedTo.forEach( function( el, i ){
			if( self.diff !== 3 ){
				var label = d3.select( ".view3D" ).append( "p" )
					.html( el.el.index )
					.attr( "class", "label" )
				self.labels.push( label )
			}

			var grp = d3.select( "[id='" + el.el.index + "']")
			if( grp.attr( "class" ).split( "_" )[1] === "H" ){
				grp.attr( "display", null )
				grp.node().previousSibling.setAttribute( "display", null )
			}

			d3.select( "#dd" + ( i + 1 ) + " > text" ).text( el.el.element + "-" + el.el.index );
			d3.select( "#atomind_" + el.el.index ).attr( "display", null );
		});

		//////Attach labels to atoms in 3d//////
		mol3d.frameFunctions.labelPos = {
			enabled: true,
			fn: function(){
					var widthHalf = mol3d.container.getBoundingClientRect().width/2;
					var heightHalf = mol3d.container.getBoundingClientRect().height/2;
					for( label of self.labels ){
						var vector = new THREE.Vector3().setFromMatrixPosition( mol3d.scene.getObjectByName( +label.html() ).matrixWorld );
						vector.project( mol3d.camActive );

						label.style("right", ( - ( vector.x * widthHalf ) + widthHalf ) + "px" )
						label.style("bottom", ( ( vector.y * heightHalf ) + heightHalf ) + "px" )
					}
				}
		};

		//////Highlight svg atom//////
		var rootAtom2D = d3.select( "#highlight_"+ self.answer.CIPRoot );
		mol2d.root.node().insertBefore( d3.select( rootAtom2D.node().cloneNode() ).attr( "r", 8 ).attr( "class", "atomFocus").attr( "id", null ).node(), mol2d.root.node().childNodes[0] );

		//////Highlight 3D atom//////
		var rootAtom3D =  mol3d.scene.getObjectByName( +self.answer.CIPRoot );
		rootAtom3D.geometry.scale( 1.5, 1.5, 1.5 );
		rootAtom3D.material.color.set( new THREE.Color().setRGB( 1, 0.5, 0 ) );

		//////Orient molecule//////
		var objUp = new THREE.Vector3().copy( mol3d.scene.getObjectByName( rootAtom3D.userData.source.bondedTo[0].el.index ).position ).sub( rootAtom3D.position ).normalize();
		mol3d.molGroup.rotateOnAxis( new THREE.Vector3().crossVectors( objUp, new THREE.Vector3( 0, 1, 0 ) ).normalize() , objUp.angleTo( new THREE.Vector3(0,1,0)) );

		//////Fade non-essential atoms//////
		var essentials = [ rootAtom3D ];
		rootAtom3D.userData.source.bondedTo.forEach( el => {
			essentials.push( mol3d.scene.getObjectByName( el.el.index ) );
			essentials.push( mol3d.scene.getObjectByName( el.bond.start.index + "_" + el.bond.end.index ) );
		} );
		mol3d.molGroup.traverse( obj => { if( obj instanceof THREE.Mesh && obj.userData.type !== "fGroup" ){
				obj.scale.set( 0.01, 0.01, 0.01 );
				obj.visible = true;
				if( essentials.indexOf( obj ) === -1 ){
					obj.material.transparent = true;
					obj.material.opacity = 0.2;
				}
			}
		} );

		self.mouseover = function() {
					mol3d.molGroup.traverse( obj => {
						if( obj instanceof THREE.Mesh && essentials.indexOf( obj ) === -1 ){
							obj.material.opacity = 1;
						}
					})
				};

		self.mouseout = function() {
				mol3d.molGroup.traverse( obj => {
					if( obj instanceof THREE.Mesh && essentials.indexOf( obj ) === -1 ){
						obj.material.opacity = 0.2;
					}
				})
			};

		mol3d.container.addEventListener( "mouseover", self.mouseover );
		mol3d.container.addEventListener( "mouseout", self.mouseout );

		//////Focus Camera on atom//////
		var controlsStart = mol3d.controls.target;
		d3.transition()
			.duration( 2000 )
			.tween( null, () => function( t ){
				mol3d.molGroup.traverse( obj => obj.scale.set( t, t, t ) )
				mol3d.controls.target.copy( new THREE.Vector3( ).copy( controlsStart ).lerp( new THREE.Vector3( ).copy( rootAtom3D.getWorldPosition() ), t ) );
				mol3d.camActive.up.copy( new THREE.Vector3( ).copy( mol3d.camActive.up ).lerp( new THREE.Vector3( 0, 1, 0 ), t ) )
			} )
			.on( "end", function(){
			//////Hide 3D view on hardest difficulty//////
				if( self.diff === 3 && d3.select( ".Blocker3D" ).empty() ){
					mol3d.mouse = new THREE.Vector2(1,1)
					var svg = d3.select( mol3d.container ).append( "svg" ).attr( "class", "Blocker3D" ).attr( "style", "width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;");
					svg.append( "rect" ).attr( "x", 0 ).attr( "y", 0 ).attr( "width", "50%" ).attr( "height", "100%" ).attr( "transform", "translate( -240, 0 )");
					svg.append( "rect" ).attr( "x", "50%" ).attr( "y", 0 ).attr( "width", "50%" ).attr( "height", "100%" ).attr( "transform", "translate( 240, 0 )");

					d3.selectAll( ".Blocker3D > rect" ).transition()
						.duration( 1000 )
						.ease( d3.easeBounceOut )
						.attr( "transform", "translate( 0, 0 )")
						.on( "end", () => svg.append( "text" ).attr( "x", 240 ).attr( "y", 215 ).attr( "text-anchor", "middle" ).text( "No 3D on this difficulty!" ) )
				}
			} )

	}

	self.closeGame = function(){

		self.reset();
		d3.select( ".help" ).style( "display", "none" );
		d3.select( "#CIPdragdrop" ).remove();
		d3.select( ".Blocker3D" ).remove();

		d3.transition()
			.duration( 1500 )
			.tween( null, function(){ return function( t ){ mol3d.controls.target.lerp( new THREE.Vector3( 0, 0, 0 ), t ) } })

		mol3d.molGroup.traverse( obj => {
			if( obj instanceof THREE.Mesh ){
				obj.material.opacity = 1;
			}
		})

		mol3d.interactions( false );
		mol3d.autoRotate( true );
		mol3d.highlightSync( false );
		mol3d.highlight( false );

		//////FRAME REPOSITIONING//////
		d3.selectAll( ".view2D" )
			.transition()
			.duration( 1500 )
			.style( "width", "0px" )
			.style( "height", "0px" )
		d3.select( ".view3D" )
			.transition()
			.duration( 1500 )
			.style( "width", "1020px" )
			.tween( null, function(){return function( t ){ mol3d.onWindowResize() } })
		d3.selectAll( ".menu" )
			.transition()
			.duration( 1000 )
			.ease( d3.easePolyInOut )
			.style( "top", "431px" )
		//////----------//////
	}

	self.submit = function(){
		var correct = [false, false, false, false, false, false];

		d3.selectAll( ".draggable > g" ).each( function( rank, i ){
			correct[rank - 1] = self.answer.CIPRanks.split( "," )[rank - 1] === d3.select( "#" + this.getAttribute( "id" ) + " > text" ).html().split( "-" )[1]
		} )

		d3.selectAll( "#CIPtoggles > label > input" ).each( ( d, i, arr ) => {
			correct[4 + i] = arr[i].checked === ( self.answer['CIPr/s'] === "r" ? false : true )
		})

		correct.forEach( function( el, i ){
			if( i < 4 ){
				elFlash( d3.select( "#dd" + ( i + 1 ) + "_TAR"), el )
			} else {
				elFlash( d3.select( "#CIPtoggles > :nth-child(" + ( i - 3 ) + ") > span" ), el )
			}
		})

		if( correct.indexOf( false ) === -1 ){
			d3.select( "#CIPinputs > .buttons > :nth-child(2)" ).transition()
				.delay( 300 )
				.duration( 300 )
				.style( "transform", "scale( 1.5 )" )
				.style( "background-color", "#4caf50" )
				.on( "end", function(){
					this.innerHTML = "Next";
					this.setAttribute( "onclick", "cip.init()" )
				} )
				.transition()
					.style( "transform", "scale( 1 )")
			d3.select( "#CIPinputs > .buttons > p" ).empty() && d3.select( "#CIPinputs > .buttons" ).append( "p" ).attr( "class", "resultRight" ).html( "That's right!" )
		}

	}

	self.init()
}

Newman = function( mode, diff ){
	var self = this;
	var pathway, groups, answer, rotated, wiggleNM, wiggleFlip, flipped;
	self.mode = mode;
	self.diff = diff;
	self.labels = [];
	var answerConfig = {
		1: [1, 2, 3, 4, 5, 6],
		2: [4, 5, 6, 1, 2, 3],
		3: [4, 3, 2, 1, 6, 5],
		4: [1, 6, 5, 4, 3, 2]
	}
	mol3d.interactions( true );
	mol3d.autoRotate( false );
	mol3d.highlightSync( true );
	mol3d.highlight( true );

	self.reset = function(){
		//////Reset game to original state//////
		mol2d.svg && mol2d.svg.remove();
		mol3d.scene.remove( mol3d.molGroup );
		clearInterval( wiggleNM );
		clearInterval( wiggleFlip );

		while( self.labels.length > 0 ){ self.labels.pop( 0 )[0].remove() }
		//d3.select( "#NMinputs > .buttons > label > input" ).node().checked = false;
		//d3.select( "#rootframe" ).html( "" );
		d3.select( "#NMResult" ).remove();

		if( self.mode === 1 ){
			d3.select( "#NMinputs > .inputs").html(`
				<svg class="dd" id="NMdragdrop" viewBox="0,0,550,255">
					<g id="NMbonds" transform="translate( 275, 127.5 )rotate( 0 )">
						<circle cx="0" cy="0" r="50" style="fill:none;"></circle>
						<line x1="0" y1="0" x2="0" y2="-100"></line>
						<line x1="0" y1="0" x2="87" y2="50"></line>
						<line x1="0" y1="0" x2="-87" y2="50"></line>
						<line x1="43" y1="-25" x2="87" y2="-50"></line>
						<line x1="0" y1="50" x2="0" y2="100"></line>
						<line x1="-43" y1="-25" x2="-87" y2="-50"></line>
						<rect x="-87" y="-100" width="174" height="200" style="stroke:none; opacity:0;"></rect>
					</g>
					<rect id="dd1_TAR" x="235" y="5" width="80" height="50"></rect>
					<rect id="dd2_TAR" x="321" y="40" width="80" height="50"></rect>
					<rect id="dd3_TAR" x="322" y="165" width="80" height="50"></rect>
					<rect id="dd4_TAR" x="235" y="205" width="80" height="50"></rect>
					<rect id="dd5_TAR" x="148" y="165" width="80" height="50"></rect>
					<rect id="dd6_TAR" x="148" y="40" width="80" height="50"></rect>
					<g class="draggable">
						<g id="dd1" transform="translate( 85, 75 )">
							<rect x=-40 y=-32 width=80 height=50></rect>
							<line x1="-30" x2="30" y1="5" y2="5"></line>
							<text></text>
							<line x1="-30" x2="30" y1="12" y2="12"></line>
						</g>
						<g id="dd2" transform="translate( 85, 150 )">
							<rect x=-40 y=-32 width=80 height=50></rect>
							<line x1="-30" x2="30" y1="5" y2="5"></line>
							<text></text>
							<line x1="-30" x2="30" y1="12" y2="12"></line>
						</g>
						<g id="dd3" transform="translate( 85, 225 )">
							<rect x=-40 y=-32 width=80 height=50></rect>
							<line x1="-30" x2="30" y1="5" y2="5"></line>
							<text></text>
							<line x1="-30" x2="30" y1="12" y2="12"></line>
						</g>
						<g id="dd4" transform="translate( 465, 75 )">
							<rect x=-40 y=-32 width=80 height=50></rect>
							<line x1="-30" x2="30" y1="5" y2="5"></line>
							<text></text>
							<line x1="-30" x2="30" y1="12" y2="12"></line>
						</g>
						<g id="dd5" transform="translate( 465, 150 )">
							<rect x=-40 y=-32 width=80 height=50></rect>
							<line x1="-30" x2="30" y1="5" y2="5"></line>
							<text></text>
							<line x1="-30" x2="30" y1="12" y2="12"></line>
						</g>
						<g id="dd6" transform="translate( 465, 225 )">
							<rect x=-40 y=-32 width=80 height=50></rect>
							<line x1="-30" x2="30" y1="5" y2="5"></line>
							<text></text>
							<line x1="-30" x2="30" y1="12" y2="12"></line>
						</g>
					</g>
				</svg>`
			)
		} else{
			d3.select( "#NMinputs > .inputs").html(`
				<svg class="dd" id="NMdragdrop" viewBox="0 0 550 255">
					<g id="rootframe" transform="translate( 275, 132 )rotate( 33 )scale(2, 2)">

						<g class="bond_wedge" display="null">
							<polygon points="15,-10 31.07,-15.80 28.07,-21.00"></polygon>
						</g>
						<g class="bond_wedge" display="null">
							<polygon points="-15,10 -1.95,21.00 1.05,15.80"></polygon>
						</g>
						<g class="bond">
							<line x1="15" x2="49.6" y1="-10" y2="10"></line>
						</g>
						<g class="bond_hash">
							<line class="bond" x1="15" x2="15" y1="-10.00" y2="-10.00"></line>
							<line class="bond" x1="15.29" x2="14.71" y1="-13.00" y2="-13.00"></line>
							<line class="bond" x1="15.57" x2="14.43" y1="-16.00" y2="-16.00"></line>
							<line class="bond" x1="15.85" x2="14.15" y1="-19.00" y2="-19.00"></line>
							<line class="bond" x1="16.13" x2="13.87" y1="-22.00" y2="-22.00"></line>
							<line class="bond" x1="16.41" x2="13.69" y1="-25.00" y2="-25.00"></line>
							<line class="bond" x1="16.69" x2="13.31" y1="-28.00" y2="-28.00"></line>
							<line class="bond" x1="16.97" x2="13.03" y1="-31.00" y2="-31.00"></line>
							<line class="bond" x1="17.25" x2="12.75" y1="-34.00" y2="-34.00"></line>
							<line class="bond" x1="17.54" x2="12.46" y1="-37.00" y2="-37.00"></line>
							<line class="bond" x1="17.82" x2="12.18" y1="-40.00" y2="-40.00"></line>
						</g>
						<g class="bond">
							<line x1="15" x2="-15" y1="-10" y2="10"></line>
						</g>
						<g class="bond_hash">
							<line class="bond" x1="-15" x2="-15" y1="10.00" y2="10.00"></line>
							<line class="bond" x1="-15.28" x2="-14.72" y1="13.00" y2="13.00"></line>
							<line class="bond" x1="-15.56" x2="-14.44" y1="16.00" y2="16.00"></line>
							<line class="bond" x1="-15.84" x2="-14.16" y1="19.00" y2="19.00"></line>
							<line class="bond" x1="-16.12" x2="-13.88" y1="22.00" y2="22.00"></line>
							<line class="bond" x1="-16.4" x2="-13.6" y1="25.00" y2="25.00"></line>
							<line class="bond" x1="-16.68" x2="-13.32" y1="28.00" y2="28.00"></line>
							<line class="bond" x1="-16.96" x2="-13.04" y1="31.00" y2="31.00"></line>
							<line class="bond" x1="-17.25" x2="-12.75" y1="34.00" y2="34.00"></line>
							<line class="bond" x1="-17.53" x2="-12.47" y1="37.00" y2="37.00"></line>
							<line class="bond" x1="-17.81" x2="-12.19" y1="40.00" y2="40.00"></line>
						</g>
						<g class="bond">
							<line x1="-15" x2="-50" y1="10" y2="-10"></line>
						</g>
					</g>
					<g>
						<rect id="flipper" x="150" y="50" width="230" height="180" style="opacity:0.0"></rect>
					</g>
					<rect id="dd1_TAR" x="360" y="190" width="80" height="50" style="fill: rgb(211, 211, 211); stroke: black;"></rect>
					<rect id="dd2_TAR" x="140" y="195" width="80" height="50" style="fill: rgb(211, 211, 211); stroke: black;"></rect>
					<rect id="dd3_TAR" x="330" y="25" width="80" height="50" style="fill: rgb(211, 211, 211); stroke: black;"></rect>
					<rect id="dd4_TAR" x="115" y="40" width="80" height="50" style="fill: rgb(211, 211, 211); stroke: black;"></rect>
					<rect id="dd5_TAR" x="355" y="109" width="80" height="50" style="fill: rgb(211, 211, 211); stroke: black;"></rect>
					<rect id="dd6_TAR" x="230" y="175" width="80" height="50" style="fill: rgb(211, 211, 211); stroke: black;"></rect>
				</svg>
				`)
			d3.select( ".draggable" ).remove();
			d3.selectAll( "#NMdragdrop > rect" ).style( "fill", "#d3d3d3" ).style( "stroke", "black" )
			d3.select( "#NMinputs > .inputs > svg").append( "g" ).attr( "class", "draggable" ).html(
				`<g id="dd1" transform="translate( 60, 75 )">
					<rect x=-40 y=-32 width=80 height=50></rect>
					<line x1="-30" x2="30" y1="5" y2="5"></line>
					<text></text>
					<line x1="-30" x2="30" y1="12" y2="12"></line>
				</g>
				<g id="dd2" transform="translate( 60, 150 )">
					<rect x=-40 y=-32 width=80 height=50></rect>
					<line x1="-30" x2="30" y1="5" y2="5"></line>
					<text></text>
					<line x1="-30" x2="30" y1="12" y2="12"></line>
				</g>
				<g id="dd3" transform="translate( 60, 225 )">
					<rect x=-40 y=-32 width=80 height=50></rect>
					<line x1="-30" x2="30" y1="5" y2="5"></line>
					<text></text>
					<line x1="-30" x2="30" y1="12" y2="12"></line>
				</g>
				<g id="dd4" transform="translate( 490, 75 )">
					<rect x=-40 y=-32 width=80 height=50></rect>
					<line x1="-30" x2="30" y1="5" y2="5"></line>
					<text></text>
					<line x1="-30" x2="30" y1="12" y2="12"></line>
				</g>
				<g id="dd5" transform="translate( 490, 150 )">
					<rect x=-40 y=-32 width=80 height=50></rect>
					<line x1="-30" x2="30" y1="5" y2="5"></line>
					<text></text>
					<line x1="-30" x2="30" y1="12" y2="12"></line>
				</g>
				<g id="dd6" transform="translate( 490, 225 )">
					<rect x=-40 y=-32 width=80 height=50></rect>
					<line x1="-30" x2="30" y1="5" y2="5"></line>
					<text></text>
					<line x1="-30" x2="30" y1="12" y2="12"></line>
				</g>
				`)
		}

		d3.selectAll( ".draggable > g" ).on( "mousedown touchstart", function(){dragLabel( this )} );
		d3.select( "#NMinputs > .buttons > :nth-child(2)" ).html( "Skip" ).style( "background-color", null );
		d3.select( ".resultRight" ).remove()
	}

	self.init = function( refresh ){

		self.reset();
		d3.select( ".help" )
			.style( "display", null )
			.on( "mouseover", function(){
				d3.select( this )
					.html( self.mode === 1 ? "Here, you'll need to take the molecule displayed at the top and give its Newman representation. <br/><br/>On HARD, it's also up to you to work out the orientation of the Newman figure, and from what direction you're looking at it. Clicking the parts will flip them." : "For this one, you need to work out the original molecule that gave the Newman representation. <br/><br/>On HARD, you also have to work out which way up the molecule needs to be. Clicking it will flip it upside-down. " )
					.style( "width", "300px")
					.style( "height", "170px")
					.on( "mouseout", function(){
						d3.select( this )
							.html( "?" )
							.style( "width", null )
							.style( "height", null )
					});
			});

		groups = shuffle( ["Me","Et","Ph","Br"," H",["Cl", " F"][Math.floor( Math.random() * 2 )]] );
		pathway = Math.floor( Math.random() * 4 ) + 1

		if( refresh ){
			if( self.mode === 1 ){
				self.runGame1()
			} else{
				self.runGame2()
			}
		} else{
			d3.transition()
				.duration( 1500 )
				.tween( null, function(){ return function( t ){mol3d.scene.traverse( obj => {obj instanceof THREE.Mesh && obj.scale.set( 1-t, 1-t, 1-t )} )} } )
				.on( "end", () => {

					mol3d.scene.remove( mol3d.molGroup );
					d3.selectAll( "#gameFrame > .view3D, #gameFrame > .view2D" )
						.style( "width", "480px" )
						.style( "height", "321px" )
					mol3d.onWindowResize();

					if( self.mode === 1 ){
						self.runGame1()
					} else{
						self.runGame2()
					}

				} )

			d3.select( "#gameFrame > #root" )
				.transition()
				.duration( 1500 )
				.ease( d3.easePolyInOut )
				.style( "top", "677px" )
			d3.select( "#gameFrame > #NMinputs" )
				.transition()
				.duration( 1500 )
				.ease( d3.easePolyInOut )
				.style( "top", "-171px")
			}
	}

	self.draw3D = function(){

		var templateMol3D = [2,3].indexOf( pathway ) !== -1 ? `
			APtclcactv04271809453D 0   0.00000     0.00000

			 8  7   0  0  1  0  0  0  0  0999 V2000
			    0.4892    0.0420   -2.0506 ` + groups[( pathway === 2 ? 1 : 5 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			    0.3143    0.4552   -1.0572 C   0  0  1  0  0  0  0  0  0  0  0  0
			    0.6266    1.9530   -1.0655 ` + groups[( pathway === 2 ? 3 : 3 )] + `  0  0  0  0  0  0  0  0  0  0  0  0
			    1.4785   -0.4498    0.2432 ` + groups[( pathway === 2 ? 5 : 1 )] + `  0  0  0  0  0  0  0  0  0  0  0  0
			   -1.1495    0.2416   -0.6664 C   0  0  2  0  0  0  0  0  0  0  0  0
			   -1.7962    0.6667   -1.4340 ` + groups[( pathway === 2 ? 2 : 4 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			   -1.4750    1.0527    0.9106 ` + groups[( pathway === 2 ? 4 : 2 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			   -1.4292   -1.2570   -0.5365 ` + groups[( pathway === 2 ? 0 : 0 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			  1  2  1  0  0  0  0
			  2  3  1  0  0  0  0
			  2  4  1  0  0  0  0
			  2  5  1  0  0  0  0
			  5  6  1  0  0  0  0
			  5  7  1  0  0  0  0
			  5  8  1  0  0  0  0
			M  END
			$$$$
			` : `
			APtclcactv04271809453D 0   0.00000     0.00000

			 8  7   0  0  1  0  0  0  0  0999 V2000
				1.4785   -0.4498    0.2432 ` + groups[( pathway === 1 ? 2 : 4 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
				0.3143    0.4552   -1.0572 C   0  0  1  0  0  0  0  0  0  0  0  0
				0.6266    1.9530   -1.0655 ` + groups[( pathway === 1 ? 4 : 2 )] + `  0  0  0  0  0  0  0  0  0  0  0  0
				0.4892    0.0420   -2.0506 ` + groups[( pathway === 1 ? 0 : 0 )] + `  0  0  0  0  0  0  0  0  0  0  0  0
			   -1.1495    0.2416   -0.6664 C   0  0  2  0  0  0  0  0  0  0  0  0
			   -1.7962    0.6667   -1.4340 ` + groups[( pathway === 1 ? 5 : 1 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			   -1.4750    1.0527    0.9106 ` + groups[( pathway === 1 ? 3 : 3 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			   -1.4292   -1.2570   -0.5365 ` + groups[( pathway === 1 ? 1 : 5 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			  1  2  1  0  0  0  0
			  2  3  1  0  0  0  0
			  2  4  1  0  0  0  0
			  2  5  1  0  0  0  0
			  5  6  1  0  0  0  0
			  5  7  1  0  0  0  0
			  5  8  1  0  0  0  0
			M  END
			$$$$
			`

		mol3d.parse( templateMol3D );
		mol3d.draw( false );

		//////Add labels to 3D//////
		mol3d.molGroup.traverse( obj => {
			if( obj.userData.tooltip !== "C" && typeof( obj.name ) === "number" ){
				var label = d3.select( ".view3D" ).append( "p" )
					.html( obj.userData.source.element )
					.attr( "class", "label" )
				self.labels.push( [label, obj.userData.source.index] )
			}

		})

		//////Attach labels to atoms in 3d//////
		mol3d.frameFunctions.labelPos = {
			enabled: true,
			fn: function(){
					var widthHalf = mol3d.container.getBoundingClientRect().width/2;
					var heightHalf = mol3d.container.getBoundingClientRect().height/2;
					for( label of self.labels ){
						var vector = new THREE.Vector3().setFromMatrixPosition( mol3d.scene.getObjectByName( label[1] ).matrixWorld );
						vector.project( mol3d.camActive );

						label[0].style("right", ( - ( vector.x * widthHalf ) + widthHalf ) + "px" )
						label[0].style("bottom", ( ( vector.y * heightHalf ) + heightHalf ) + "px" )
					}
				}
		};
	}

	//////2D/3D to Newman//////
	self.runGame1 = function(){
		shuffle( groups ).forEach( ( el, i ) => d3.select( "#dd" + ( i + 1 ) + " > text" ).text( el ) );

		var templateMol2D = [2,3].indexOf( pathway ) !== -1 ? `
			APtclcactv04271809452D 0   0.00000     0.00000

			 8  7   0  0  1  0  0  0  0  0999 V2000
			    5.3350    0.7600    0.0000 ` + groups[( pathway === 2 ? 1 : 5 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			    4.5981    0.2500    0.0000 C   0  0  1  0  0  0  0  0  0  0  0  0
			    5.4641   -0.2500    0.0000 ` + groups[( pathway === 2 ? 3 : 3 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			    4.5981    1.2500    0.0000 ` + groups[( pathway === 2 ? 5 : 1 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			    3.7321   -0.2500    0.0000 C   0  0  2  0  0  0  0  0  0  0  0  0
			    4.3690   -0.6600    0.0000 ` + groups[( pathway === 2 ? 2 : 4 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			    3.7321   -1.2500    0.0000 ` + groups[( pathway === 2 ? 4 : 2 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			    2.8660    0.2500    0.0000 ` + groups[( pathway === 2 ? 0 : 0 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			  2  1  1  1  0  0  0
			  2  3  1  0  0  0  0
			  2  4  1  6  0  0  0
			  2  5  1  0  0  0  0
			  5  6  1  1  0  0  0
			  5  7  1  6  0  0  0
			  5  8  1  0  0  0  0
			M  END
			$$$$
			` : `
			APtclcactv04271809452D 0   0.00000     0.00000

			8  7   0  0  1  0  0  0  0  0999 V2000
				5.3350    0.7600    0.0000 ` + groups[( pathway === 1 ? 2 : 4 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
				4.5981    0.2500    0.0000 C   0  0  1  0  0  0  0  0  0  0  0  0
				5.4641   -0.2500    0.0000 ` + groups[( pathway === 1 ? 4 : 2 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
				4.5981    1.2500    0.0000 ` + groups[( pathway === 1 ? 0 : 0 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
				3.7321   -0.2500    0.0000 C   0  0  2  0  0  0  0  0  0  0  0  0
				4.0000    0.5000    0.0000 ` + groups[( pathway === 1 ? 5 : 1 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
				3.7321   -1.2500    0.0000 ` + groups[( pathway === 1 ? 3 : 3 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
				2.8660    0.2500    0.0000 ` + groups[( pathway === 1 ? 1 : 5 )] + `   0  0  0  0  0  0  0  0  0  0  0  0
			  2  1  1  6  0  0  0
			  2  3  1  1  0  0  0
			  2  4  1  0  0  0  0
			  2  5  1  0  0  0  0
			  5  6  1  1  0  0  0
			  5  7  1  0  0  0  0
			  5  8  1  6  0  0  0
			M  END
			$$$$
			`

		mol2d.parse( templateMol2D );
		mol2d.draw();
		mol2d.showH( true );
		mol2d.onWindowResize();


		if( self.diff === 1 ){
			//////Give 2 answers//////
			var ans1 = Math.floor( Math.random() * 6 );
			var ans2 = Math.floor( Math.random() * 6 );
			while( ans2 === ans1 || [0,3].indexOf( ans2 ) !== -1 ){
				ans2 = Math.floor( Math.random() * 6 );
			}

			[ans1, ans2].forEach( el => {
				d3.selectAll( ".draggable > g" ).each( function(){
					if( d3.select( "#" + this.getAttribute( "id" ) + " > text").html() === groups[el] ){
						var tarNode = d3.select( "#NMdragdrop > #dd" + ( el + 1 ) + "_TAR" ).node()

						d3.select( tarNode ).attr( "disabled", true);
						d3.select( this ).attr( "disabled", true).attr( "pointer-events", "none" ).attr( "fill", "dimgrey" );
						this.transform.baseVal.consolidate()
						this.transform.baseVal.removeItem( 0 )
						var transform = this.ownerSVGElement.createSVGTransform()
						transform.setTranslate( +tarNode.getAttribute( "x" ) + tarNode.getBoundingClientRect().width/2, +tarNode.getAttribute( "y" ) + tarNode.getBoundingClientRect().height/2 + 7 )
						this.transform.baseVal.appendItem( transform )
						d3.select( this ).datum( tarNode.getAttribute( "id" ).substr( 2, 1 ) )
					}
				})
			})

			//////Draw 3D, label atom//////
			self.draw3D()

			//////Highlight 3D atom//////
			mol3d.scene.getObjectByName( "1_4" ).material.color.set( new THREE.Color().setRGB( 1, 0.5, 0 ) );
		} else{
			//////Hide 3D view//////
			if( d3.select( ".Blocker3D" ).empty() ){
				mol3d.mouse = new THREE.Vector2(1,1)
				var svg = d3.select( mol3d.container ).append( "svg" ).attr( "class", "Blocker3D" ).attr( "style", "width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;");
				svg.append( "rect" ).attr( "x", 0 ).attr( "y", 0 ).attr( "width", "50%" ).attr( "height", "100%" ).attr( "transform", "translate( -240, 0 )");
				svg.append( "rect" ).attr( "x", "50%" ).attr( "y", 0 ).attr( "width", "50%" ).attr( "height", "100%" ).attr( "transform", "translate( 240, 0 )");

				d3.selectAll( ".Blocker3D > rect" ).transition()
					.duration( 1000 )
					.ease( d3.easeBounceOut )
					.attr( "transform", "translate( 0, 0 )")
					.on( "end", () => svg.append( "text" ).attr( "x", "50%" ).attr( "y", "50%" ).attr( "text-anchor", "middle" ).text( "No 3D on this difficulty!" ) )
			}
		}

		//////Highlight svg atom//////
		var tarBond = d3.select( document.querySelector( "#highlight_1_4" ).nextElementSibling ).style( "stroke", "orange" )
		var eyeAngle = ( [2,4].indexOf( pathway ) !== -1 ? 180 : 0 ) + Math.atan2( tarBond.datum().end.pos[1] - tarBond.datum().start.pos[1], tarBond.datum().end.pos[0] - tarBond.datum().start.pos[0] ) * 180/Math.PI

		//////Draw eye on Newman represntation//////
		d3.select( "#rootframe" )
			.append( "g" )
			.attr( "id", "eye" )
			.html(`
				<line x1="-130" x2="-110" y1="0" y2="20"></line>
				<line x1="-130" x2="-110" y1="0" y2="-20"></line>
				<path d="M -118 -12 Q -110 0 -118 12"></path>
				<line x1="-114" x2="0" y1="0" y2="0" opacity="0.15" style="stroke-dasharray: 10px;"></line>
				`)
			.attr( "transform", "translate(" + d3.select( "#highlight_" + ( [2,4].indexOf( pathway ) !== -1 ? 4 : 1 ) ).attr( "cx" ) + " , " + d3.select( "#highlight_" + ( [2,4].indexOf( pathway ) !== -1 ? 4 : 1 ) ).attr( "cy" ) + " )scale( 0.5 )rotate( " + eyeAngle +" )")

		mol2d.fitToScreen();

		//////Mouseover/Mousedown Animations//////
		rotated = false;

		if( self.diff === 2 ){
			d3.selectAll( "#NMbonds > rect" )
				.on( "mouseover", function(){
					clearInterval( wiggleNM )
					d3.select( this.parentNode )
						.transition()
						.duration( 500 )
						.ease( d3.easeBackOut )
						.attr( "transform", "translate( 275, 127.5 )rotate( " + ( rotated ? 190 : 10 ) + " )")
				})
				.on( "mouseout", function(){
					d3.select( this.parentNode )
						.transition()
						.duration( 500 )
						.ease( d3.easeBackOut )
						.attr( "transform", "translate( 275, 127.5 )rotate( " + ( rotated ? 180 : 0 ) + " )")
				})
				.on( "mousedown", function(){
					d3.select( this.parentNode )
						.transition()
						.duration( 1000 )
						.ease( d3.easeBackInOut )
						.attr( "transform", "translate( 275, 127.5 )rotate( " + ( rotated ? 0 : 180 ) + " )")
					rotated = !rotated
				})

			//////Wiggle Interactables//////
			wiggleNM = setInterval( function(){
					d3.select( "#NMbonds" )
						.transition()
						.duration( 500 )
						.attr( "transform", "translate( 275, 127.5 )rotate( -5 )")
						.transition()
						.duration( 300 )
						.ease( d3.easeBackOut )
						.attr( "transform", "translate( 275, 127.5 )rotate( 10 )")
						.transition()
						.duration( 300 )
						.ease( d3.easeBackOut )
						.attr( "transform", "translate( 275, 127.5 )rotate( 0 )")
				}, 4000 )
		} else{
			rotated = pathway > 2;
			d3.select( "#NMbonds" ).attr( "transform", "translate( 275, 127.5 )rotate( " + ( rotated ? 180 : 0 ) + " )")
		}
		//////Focus camera on root atom//////
		var controlsStart = mol3d.controls.target;
		d3.transition()
			.duration( 2000 )
			.tween( null, () => function( t ){
				if( mol3d.scene.getObjectByName( "1_4" ) ){
					mol3d.controls.target.copy( new THREE.Vector3( ).copy( controlsStart ).lerp( new THREE.Vector3().copy( mol3d.scene.getObjectByName( "1_4" ).getWorldPosition() ), t ) );
				}
			} )


	}

	//////Newman to 2D//////
	self.runGame2 = function(){

		//////Initialise 2D display//////
		if( d3.select( ".view2D > svg" ).empty() ){
			d3.select( ".view2D" ).html(`
				<svg viewBox="0,0,480,321">
					<g id="NMbonds" transform="translate( 240, 165 )rotate( 0 )">
						<circle cx="0" cy="0" r="50" style="stroke:black; fill:none;"></circle>
						<line x1="0" y1="0" x2="0" y2="-100"></line>
						<line x1="0" y1="0" x2="87" y2="50"></line>
						<line x1="0" y1="0" x2="-87" y2="50"></line>
						<line x1="43" y1="-25" x2="87" y2="-50"></line>
						<line x1="0" y1="50" x2="0" y2="100"></line>
						<line x1="-43" y1="-25" x2="-87" y2="-50"></line>
					</g>
					<g id="NMatoms" transform="translate( 0, 40 )scale( 1 )">
						<text id="model1" x="240" y="5" style="cursor: unset"></text>
						<text id="model2" x="367" y="85" style="cursor: unset"></text>
						<text id="model3" x="367" y="195" style="cursor: unset"></text>
						<text id="model4" x="240" y="265" style="cursor: unset"></text>
						<text id="model5" x="113" y="195" style="cursor: unset"></text>
						<text id="model6" x="113" y="85" style="cursor: unset"></text
					</g>
				</svg>`
			)

			d3.select( ".view2D > svg" )
				.append( "g" )
				.attr( "id", "eye" )
				.attr( "transform", "translate( 240, 165 )")
				.html(`
					<line x1="-170" x2="-150" y1="0" y2="20"></line>
					<line x1="-170" x2="-150" y1="0" y2="-20"></line>
					<path d="M -158 -12 Q -150 0 -158 12"></path>
					<line x1="-154" x2="-50" y1="0" y2="0" opacity="0.3" style="stroke-dasharray: 10px;"></line>
				`)
		}

		d3.select( "#eye" )
			.transition()
			.duration( 1000 )
			.attr( "transform", [1,3].indexOf( pathway ) === -1 ? "translate( 240, 165 )scale( -1, 1 )" : "translate( 240, 165 )scale( 1, 1 )" )

		d3.select( "#NMbonds" )
			.transition()
			.duration( 1000 )
			.ease( d3.easeBackInOut )
			.attr( "transform", pathway > 2 ? "translate( 240, 165 )rotate( 180 )" : "translate( 240, 165 )rotate( 0 )");

		//////Transition target rects//////
		function targetAnim( el, x, y ){
			d3.select( el )
				.transition()
				.duration( 500 )
				.attr( "x", x )
				.attr( "y", y )
			return d3.select( el )
		}


		//////Mouseover/mousedown interactions//////
		flipped = false;

		if( self.diff === 2 ){
			d3.select( "#flipper" )
				.on( "mouseover", function(){
					clearInterval( wiggleFlip );
					d3.select( "#rootframe" )
						.transition()
						.duration( 500 )
						.ease( d3.easeBackOut )
						.attr( "transform", flipped ? "translate( 275, 132 )rotate( -25 )scale(2, -1.8)" : "translate( 275, 132 )rotate( 25 )scale(2, 1.8)" )
				})
				.on( "mouseout", function(){
					d3.select( "#rootframe" )
						.transition()
						.duration( 500 )
						.ease( d3.easeBackOut )
						.attr( "transform", flipped ? "translate( 275, 132 )rotate( -33 )scale(2, -2)" : "translate( 275, 132 )rotate( 33 )scale(2, 2)" )
				})
				.on( "mousedown", function(){

					d3.selectAll( ".draggable > g" ).each( function( d, i ){
						d3.select( this )
							.datum("")
							.transition()
							.duration( 500 )
							.attr( "transform", "translate( " + ["61, 75", "60, 150", "60, 225", "490, 75", "490, 150", "490, 225"][i] + " )" )
					})


					d3.select( "#rootframe" )
						.transition()
						.duration( 1000 )
						.ease( d3.easeBackInOut )
						.attr( "transform", flipped ? "translate( 275, 132 )rotate( 33 )scale(2, 2)" : "translate( 275, 132 )rotate( -33 )scale(2, -2)" )
					if( flipped ){
						targetAnim( "#dd1_TAR", 360, 190 );
						targetAnim( "#dd2_TAR", 140, 195 );
						targetAnim( "#dd3_TAR", 330, 25 );
						targetAnim( "#dd4_TAR", 115, 40 );
						targetAnim( "#dd5_TAR", 355, 109 );
						targetAnim( "#dd6_TAR", 230, 175 );
					} else{
						targetAnim( "#dd1_TAR", 345, 10 );
						targetAnim( "#dd2_TAR", 135, 23 );
						targetAnim( "#dd3_TAR", 330, 195 );
						targetAnim( "#dd4_TAR", 135, 204 );
						targetAnim( "#dd5_TAR", 355, 109 );
						targetAnim( "#dd6_TAR", 235, 48 );
					}
					flipped = !flipped;
				})

			wiggleFlip = setInterval( function(){
				d3.select( "#NMdragdrop> #rootframe" )
					.transition()
					.delay( 300 )
					.duration( 500 )
					.attr( "transform", "translate( 275, 132 )rotate( 35 )scale(2, 2.1)")
					.transition()
					.duration( 300 )
					.ease( d3.easeBackOut )
					.attr( "transform", "translate( 275, 132 )rotate( 25 )scale(2, 1.7)")
					.transition()
					.duration( 300 )
					.ease( d3.easeBackOut )
					.attr( "transform", "translate( 275, 132 )rotate( 33 )scale(2, 2)")
			}, 3000)
		} else{
			flipped = [1,4].indexOf( pathway ) !== -1;
			d3.select( "#NMdragdrop> #rootframe" ).attr( "transform", flipped ? "translate( 275, 132 )rotate( -33 )scale(2, -2)" : "translate( 275, 132 )rotate( 33 )scale(2, 2)" )
			if( !flipped ){
				d3.select( "#dd1_TAR" ).attr( "x", 360 ).attr( "y", 190 );
				d3.select( "#dd2_TAR" ).attr( "x", 140 ).attr( "y", 195 );
				d3.select( "#dd3_TAR" ).attr( "x", 330 ).attr( "y", 25 );
				d3.select( "#dd4_TAR" ).attr( "x", 115 ).attr( "y", 40 );
				d3.select( "#dd5_TAR" ).attr( "x", 355 ).attr( "y", 109 );
				d3.select( "#dd6_TAR" ).attr( "x", 230 ).attr( "y", 175 );
			} else{
				d3.select( "#dd1_TAR" ).attr( "x", 345 ).attr( "y", 10 );
				d3.select( "#dd2_TAR" ).attr( "x", 135 ).attr( "y", 23 );
				d3.select( "#dd3_TAR" ).attr( "x", 330 ).attr( "y", 195 );
				d3.select( "#dd4_TAR" ).attr( "x", 135 ).attr( "y", 204 );
				d3.select( "#dd5_TAR" ).attr( "x", 355 ).attr( "y", 109 );
				d3.select( "#dd6_TAR" ).attr( "x", 235 ).attr( "y", 48 );
			}
		}

		if( self.diff === 1 ){
			//////Draw 3D, add labels//////
			self.draw3D();
		} else{
			if( d3.select( ".Blocker3D" ).empty() ){
				//////Hide 3D view//////
				mol3d.mouse = new THREE.Vector2(1,1)
				var svg = d3.select( mol3d.container ).append( "svg" ).attr( "class", "Blocker3D" ).attr( "style", "width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;");
				svg.append( "rect" ).attr( "x", 0 ).attr( "y", 0 ).attr( "width", "50%" ).attr( "height", "100%" ).attr( "transform", "translate( -240, 0 )");
				svg.append( "rect" ).attr( "x", "50%" ).attr( "y", 0 ).attr( "width", "50%" ).attr( "height", "100%" ).attr( "transform", "translate( 240, 0 )");

				d3.selectAll( ".Blocker3D > rect" ).transition()
					.duration( 1000 )
					.ease( d3.easeBounceOut )
					.attr( "transform", "translate( 0, 0 )")
					.on( "end", () => svg.append( "text" ).attr( "x", "50%" ).attr( "y", "50%" ).attr( "text-anchor", "middle" ).text( "No 3D on this difficulty!" ) )
			}
		}

		shuffle( groups ).forEach(function( group, i ){
			d3.select( "#dd" + ( i + 1 ) + " > text" ).text( group );
		})
		groups.forEach(function( group, i ){
			d3.select( "#model" + ( i + 1 ) ).text( group )
		})

	}

	self.closeGame = function(){

		self.reset();
		d3.select( ".help" ).style( "display", "none" )
		d3.select( "#NMinputs > .inputs > svg" ).remove();
		d3.select( ".view2D > svg" ).remove();
		d3.select( ".Blocker3D" ).remove();

		mol3d.interactions( false );
		mol3d.autoRotate( true );
		mol3d.highlightSync( false );
		mol3d.highlight( false );
		mol3d.parse( intromolfile )
		mol3d.draw()

		//////FRAME REPOSITIONING//////
		d3.selectAll( ".view2D" )
			.transition()
			.duration( 1500 )
			.style( "width", "0px" )
			.style( "height", "0px" )
		d3.select( ".view3D" )
			.transition()
			.duration( 1500 )
			.style( "width", "1020px" )
			.style( "height", "431px" )
			.tween( null, function(){return function( t ){ mol3d.onWindowResize() } })
		d3.selectAll( ".menu" )
			.transition()
			.duration( 1000 )
			.ease( d3.easePolyInOut )
			.style( "top", "431px" )
		//////----------//////
	}

	self.submit = function(){

		var correct = [false, false, false, false, false, false, false];

		d3.selectAll( ".draggable > g" ).each( function( rank, i ){
			if( groups[ self.mode === 1 ? rank - 1 : answerConfig[pathway].indexOf( +rank ) ] === d3.select( "#" + this.getAttribute( "id" ) + " > text").html() ){
				correct[rank - 1] = true
			}
		} )

		switch( pathway ){
			case 1:
				correct[6] = self.mode === 1 ? !rotated : flipped;
				break;

			case 2:
				correct[6] = self.mode === 1 ? !rotated : !flipped;
				break;

			case 3:
				correct[6] = self.mode === 1 ? rotated : !flipped;
				break;

			case 4:
				correct[6] = self.mode === 1 ? rotated : flipped;
				break;
			}


		correct.forEach( ( el, i ) => {
			if( i < 6 ){
				elFlash( d3.select( "#dd" + ( i + 1 ) + "_TAR" ), el );
			} else if( i === 6 ) {
				 self.mode === 1 && elFlash( d3.select( "#NMbonds" ), el );
				 self.mode === 2 && elFlash( d3.select( "#NMdragdrop > #rootframe" ), el )
			}
		})
		if( correct.indexOf( false ) === -1 ){
			d3.select( "#NMinputs > .buttons > :nth-child(2)" ).transition()
				.delay( 300 )
				.duration( 300 )
				.style( "transform", "scale( 1.5 )" )
				.style( "background-color", "#4caf50" )
				.on( "end", function(){
					this.innerHTML = "Next";
					this.setAttribute( "onclick", "nm.init( true )" )
				} )
				.transition()
					.style( "transform", "scale( 1 )" )
			d3.select( "#NMinputs > .buttons > p" ).empty() && d3.select( "#NMinputs > .buttons" ).append( "p" ).attr( "class", "resultRight" ).html( "That's right!" );
		}

	}

	self.orient = function( eclipse ){
		var centre = d3.select( "#NMdragdrop > circle" );
		//d3.selectAll( "#NMdragdrop > [back]" ).attr( "back", eclipse ? "true" : "false" )
		var angleOffset = - Math.PI/3.5
		var positions = eclipse ?
			[
				[ 100 * Math.sin( 0 ), -100 * Math.cos( 0 ), -35, 0 ],
				[ 100 * Math.sin( Math.PI/3 * 2 ), -100 * Math.cos( Math.PI/3 * 2 ), 30, -15 ],
				[ 100 * Math.sin( Math.PI/3 * 4 ), -100 * Math.cos( Math.PI/3 * 4 ), 20, 15 ],
				[ 100 * Math.sin( angleOffset + Math.PI/3 ), -100 * Math.cos( angleOffset + Math.PI/3 ), 35, 0 ],
				[ 100 * Math.sin( angleOffset + Math.PI/3 * 3 ), -100 * Math.cos( angleOffset + Math.PI/3 * 3 ), -20, 15 ],
				[ 100 * Math.sin( angleOffset + Math.PI/3 * 5 ), -100 * Math.cos( angleOffset + Math.PI/3 * 5 ), -25, -15 ]
			] :
			[
				[ 100 * Math.sin( 0 ), -100 * Math.cos( 0 ), 0, 0 ],
				[ 100 * Math.sin( Math.PI/3 * 2 ), -100 * Math.cos( Math.PI/3 * 2 ), 0, 0 ],
				[ 100 * Math.sin( Math.PI/3 * 4 ), -100 * Math.cos( Math.PI/3 * 4 ), 0, 0 ],
				[ 100 * Math.sin( Math.PI/3 ), -100 * Math.cos( Math.PI/3 ), 0, 0 ],
				[ 100 * Math.sin( Math.PI/3 * 3 ), -100 * Math.cos( Math.PI/3 * 3 ), 0, 0 ],
				[ 100 * Math.sin( Math.PI/3 * 5 ), -100 * Math.cos( Math.PI/3 * 5 ), 0, 0 ]
			]

		d3.selectAll( "#NMdragdrop > text" ).each( function ( d, i ){
			if( d ){
				d3.select( this ).transition()
					.duration( 200 )
					.ease( d3.easeBackInOut )
					.attr( "x", +centre.attr( "cx" ) + positions[d-1][0] + positions[d-1][2] )
					.attr( "y", +centre.attr( "cy" ) + positions[d-1][1] + 13 + positions[d-1][3] )
			}
		})
		d3.selectAll( "#NMdragdrop > line" ).each( function( d, i ){
			d3.select( this ).transition()
				.duration( 200 )
				.ease( d3.easeBackInOut )
				.attr( "x1", +centre.attr( "cx" ) + ( i > 2 ? positions[i][0]*0.5 : 0 ) )
				.attr( "x2", +centre.attr( "cx" ) + positions[i][0] )
				.attr( "y1", +centre.attr( "cy" ) + ( i > 2 ? positions[i][1]*0.5 : 0 ) )
				.attr( "y2", +centre.attr( "cy" ) + positions[i][1] )
		});
		d3.selectAll( "#NMdragdrop > rect" ).each( function( d, i ){
			d3.select( this ).transition()
				.duration( 200 )
				.ease( d3.easeBackInOut )
				.attr( "x", +centre.attr( "cx" ) + positions[i][0] - 40 + positions[i][2] )
				.attr( "y", +centre.attr( "cy" ) + positions[i][1] - 20 + positions[i][3] )
		});

	}

	self.init();
}

function elFlash( el, correct ){
	if( correct ){
		d3.selectAll( "#" + el.attr( "id" ) + ", #" + el.attr( "id" ) + " line" ).each( function(){
			d3.select( this )
				.transition()
				.duration( 200 )
				.style( "fill", "#387d3b" )
				.style( "stroke", "#387d3b" )
				.style( "background-color", "#387d3b" )
		})
	} else{
		d3.selectAll( "#" + el.attr( "id" ) + ", #" + el.attr( "id" ) + " line" ).each( function(){
			d3.select( this )
				.transition()
				.duration( 200 )
				.style( "fill", "red" )
				.style( "stroke", "red" )
				.style( "background-color", "red" )
				.on( "end", () => {
					d3.selectAll( "#" + el.attr( "id" ) + ", #" + el.attr( "id" ) + " line" ).each( function(){
						d3.select( this )
							.transition()
							.duration( 800 )
							.style( "fill", this.tagName === "rect" ? "lightgray" : "black" )
							.style( "stroke", "black" )
							.style( "background-color", "#5b7da0" )
						})
				})
		})
	}
}

function shuffle(array) {
  var arr = [...array];
  var currentIndex = array.length, temporaryValue, randomIndex;
  while ( 0 !== currentIndex ) {
	randomIndex = Math.floor( Math.random() * currentIndex );
	currentIndex -= 1;
	temporaryValue = arr[currentIndex];
	arr[currentIndex] = arr[randomIndex];
	arr[randomIndex] = temporaryValue;
  }
  return arr;
}

function dragLabel( el ){
	evt = d3.event;
	evt.preventDefault();
	evt.stopPropagation();
	var matrix = el.transform.baseVal.consolidate().matrix
	start = [matrix.e, matrix.f]
	var downPos = evt.type === "touchstart" ? [ evt.changedTouches[0].clientX, evt.changedTouches[0].clientY ] : [ evt.clientX, evt.clientY ];
	var drag = ( evt ) => {
			evt.preventDefault();
			evt.stopPropagation();

			var delta = [ downPos[0] - ( evt.type === "touchmove" ? evt.changedTouches[0].clientX : evt.clientX ), downPos[1] - ( evt.type === "touchmove" ? evt.changedTouches[0].clientY : evt.clientY ) ];
			downPos = evt.type === "touchmove" ? [ evt.changedTouches[0].clientX, evt.changedTouches[0].clientY ] : [ evt.clientX, evt.clientY ];

			var transform = el.ownerSVGElement.createSVGTransform();
			transform.setTranslate( -delta[0], -delta[1] );
			el.transform.baseVal.appendItem( transform );
			el.transform.baseVal.consolidate();

	}
	var drop = ( evt ) => {
			evt.preventDefault();
			evt.stopPropagation();

			matrix = el.transform.baseVal.consolidate().matrix
			var upPos = evt.type === "touchend" ? [ evt.changedTouches[0].clientX, evt.changedTouches[0].clientY ] : [ evt.clientX, evt.clientY ];
			var end = [matrix.e, matrix.f]
			var hitNode = null;
			d3.selectAll( "#" + el.parentNode.parentNode.getAttribute( "id" ) + " > rect" ).each( function(){
				var bBox = this.getBoundingClientRect();
				if( upPos[0] > bBox.left && upPos[0] < bBox.right && upPos[1] < bBox.bottom && upPos[1] > bBox.top && this.getAttribute( "disabled" ) !== "true" ){
					hitNode = this;
				}
			})
			if( hitNode ){
				d3.select( el ).transition()
					.duration( 500 )
					.tween( null, function (){
						return function ( t ){
								var transform = el.ownerSVGElement.createSVGTransform();
								transform.setTranslate( d3.interpolateNumber( end[0], +hitNode.getAttribute( "x" ) + hitNode.getBoundingClientRect().width/2 )( t ), d3.interpolateNumber( end[1], +hitNode.getAttribute( "y" ) + hitNode.getBoundingClientRect().height/2 + 7 )( t ) )
								el.transform.baseVal.removeItem( 0 );
								el.transform.baseVal.appendItem( transform );
								el.transform.baseVal.consolidate();

							}
					})
				d3.selectAll( ".draggable > g" ).each( function( e ){
					if( e === hitNode.getAttribute( "id" ).substr( 2, 1 ) && el !== this ){
						var startLoc = start;
						var overlapNode = this;
						matrix = this.transform.baseVal.consolidate().matrix
						var overlapNodeLoc = [matrix.e, matrix.f];
						d3.transition()
							.duration( 500 )
							.tween( null, function (){
								return function ( t ){
										var transform = overlapNode.ownerSVGElement.createSVGTransform();
										transform.setTranslate( d3.interpolateNumber( overlapNodeLoc[0], startLoc[0] )( t ), d3.interpolateNumber( overlapNodeLoc[1], startLoc[1] )( t ) )
										overlapNode.transform.baseVal.removeItem( 0 );
										overlapNode.transform.baseVal.appendItem( transform );
										overlapNode.transform.baseVal.consolidate();
									}
							})
						d3.select( this ).datum( d3.select( el ).datum() || null )
					}
				});

				d3.select( el ).datum( hitNode.getAttribute( "id" ).substr( 2, 1 ) );
			} else{
				el.setAttribute( "transform", "translate( " + start[0] + " , " + start[1] + " )" );
			}

			window.removeEventListener( "mousemove", drag )
			window.removeEventListener( "touchmove", drag )
			window.removeEventListener( "mouseup", drop )
			window.removeEventListener( "touchend", drop )

	}

	window.addEventListener( "mousemove", drag );
	window.addEventListener( "touchmove", drag, {passive: false} );
	window.addEventListener( "mouseup", drop );
	window.addEventListener( "touchend", drop, {passive: false} );


}

function resetViews(){
	try{
		mol2d.fitToScreen();
	} catch( error ){
	} finally{
		mol3d.resetView();
	}
}
