let handler;
let subs = addSubstituents();

document.addEventListener( "DOMContentLoaded", ev => {

    d3.select( "#loading" ).remove();
    d3.select( "#menu" ).style( "display", null );
    displayHelpers();
    handler = new GameHandler();
    handler.startGame();

});

let GameHandler = function(){

    this.dragging            = false;
    this.diff               = null;
    this.snapTarget         = null;
    this.fadeGroup          = null;
    this.fadeAt             = 1;
    this.substituent        = null;
    this.state              = 0; //0: start, 1: showAnswerMolecule, 2: playing, 3: markConforms, 4: markHighEnergy, 5: result
    this.lastState          = 0;
    this.HVisible           = false;
    this.camSave            = null;
    this.answerConform      = null;
    this.activeConform      = null;
    this.inactiveConform    = null;
    this.incorrectMAT       = new THREE.MeshToonMaterial();
    this.incorrectMAT.color = new THREE.Color( 1, 0.5, 0.5 );

    this.changeState = function( newState ){

        switch( newState ){

            case 0:

                d3.select( "#intro" )           .classed( "active", true ).classed( "hidden", false );
                d3.select( "#questionMolecule" ).classed( "active", false ).classed( "hidden", false ).classed( "maximise", true );
                d3.select( "#game" )            .classed( "active", false ).classed( "hidden", false );
                d3.select( "#result" )          .classed( "active", false ).classed( "hidden", true );
                d3.select( "#markHighEnergy" )  .classed( "active", false ).classed( "hidden", true );

                stateUpdater( [], [], [], "Welcome to the game!", "This was made to test your understanding of Cyclohexane and its stable conformations.</br></br>To begin with, you'll be given a top-down view of a 2D molecule. Your first job will be to work out the two possible ways it could appear in 3D space. Once you've got that cracked, you'll need to figure out which of the two conformations is most likely to be stable...</br></br>Pick a difficulty and give it a shot" );

                break;

            case 1:

                stateUpdater( ["#intro","#questionMolecule"], ["#intro"], [], "This is Cyclohexane", "What you're looking at is a ring of 6 carbons. Attached at various points are functional groups, or substituents.</br></br>The location of each substituent depends on where it is on the ring and how it is bonded to the carbon.</br></br>Seems simple enough? The tricky part is when transferring this picture to 3D..." );

                break;

            case 2:

                stateUpdater( ["#game"], [], ["#questionMolecule"], "What to do?", "You need to recreate the Cyclohexane shown in the top right of your screen. The two common 'chair' conformations are provided, but it's up to you to place the substituents.</br></br>You can do this by dragging them from the bar along the top and dropping them onto a Hydrogen that needs to get out the way.</br></br>Made a mistake? Just click a substituent and it'll go away.</br></br>Good luck!" );

                this.enableLabels();

                break;

            case 3:

                d3.selectAll( "#game .view3D" )
                    .classed( "active", false )
                    .classed( "inactive", false )
                    .transition()
                    .duration( 1000 )
                    .tween( null, () => function(){ handler.conform1.Mol3D.onWindowResize(); handler.conform2.Mol3D.onWindowResize() })

                break;

            case 4:

                stateUpdater( ["#questionMolecule", "#game", "#markHighEnergy"], ["#questionMolecule", "#markHighEnergy"], [], "The important bit", "So, you got the conformations correct? Now comes the hard part.</br></br>An 'Axial' substituent that is pointing out of the chain is particularly uncomfortable; all the substituents would much rather be horizontal, or 'Equatorial'. Unfortunately, for the Cyclohexane, that isn't possible, and the best it can do is minimise the amount of 'stuff' it has sticking out at an awkward angle.</br></br>You need to pick which of the two conformations is carrying the least 'stuff'..." );

                break;

            case 5:

                stateUpdater( ["#markHighEnergy", "#result"], ["#result", "#game", "#markHighEnergy"], ["#questionMolecule"], false, "" );

                animateResult();

                break;


        }

        function stateUpdater( activeToggles, hiddenToggles, maximiseToggles, helpTitle, helpText ){

            activeToggles.forEach( el => document.querySelector( el ).classList.toggle( "active" ) );
            hiddenToggles.forEach( el => document.querySelector( el ).classList.toggle( "hidden" ) );
            maximiseToggles.forEach( el => document.querySelector( el ).classList.toggle( "maximise" ) );

            if( helpTitle === false ){

                d3.select( ".helpFrame" ).classed( "nohelp", true );

            } else {

                d3.select( ".helpFrame" ).classed( "nohelp", false );
                d3.select( "#helpTitle" ).html( helpTitle );
                d3.select( "#helpBody" ).html( helpText );

            }

        }

        this.lastState = this.state;
        this.state = newState;

    }

    this.correctConforms = function(){

            document.getElementById( "HighEnergyConform1" ).appendChild( handler.conform1.drawSideOn() );
            document.getElementById( "HighEnergyConform2" ).appendChild( handler.conform2.drawSideOn() );
            handler.changeState( 4 )

        }

    this.enableLabels = function(){

        d3.select( document ).on( "3DMousein.labels", function(){

            if( !handler.dragging && handler.activeConform ){

                if( d3.event.detail.objects.length > 0 ){ showLabels( handler.activeConform.Mol3D ) }
                else{ hideLabels( handler.activeConform.Mol3D ) }

            }

        })

    }

    this.startGame = function(){

        //////Last Run Cleanup//////
        d3.selectAll( ".canvas3D" ).classed( "correct incorrect", false );

        if( handler.answerConform ){

            handler.answerConform.Mol3D.dispose();

            [handler.conform1,handler.conform2].forEach( conform => {

                conform.Mol3D.dispose();
                conform.svg.remove();

            })

        }

        handler.changeState( 0 );

        //////New Run//////
        handler.conform1 = new Conformation( chair1, d3.select( "#conform1 > .canvas3D" ) );
        handler.conform2 = new Conformation( chair2, d3.select( "#conform2 > .canvas3D" ) );

        [handler.conform1, handler.conform2].forEach( conform => {

            conform.draw();
            setTimeout( () => conform.Mol3D.pause(), 50 );

        });

        d3.select( "#questionMolecule" ).append( "h2" ).text( "Remember: Carbon 1 bears the sterically largest substituent" );
        d3.select( "#questionMolecule" ).append( "h2" ).text( "Click to continue..." ).style( "top", "80%" );



        //////MOUSEDOWN//////
        d3.selectAll( ".dragBox" ).on( "mousedown touchstart", handleMousedown );

        d3.selectAll( ".conformOverlay" ).on( "mousedown", function(){

            handler.activeConform = d3.select( this ).attr( "id" ).split( "_" )[0] === "conform1" ? handler.conform2 : handler.conform1;
            handler.inactiveConform = handler.activeConform === handler.conform1 ? handler.conform2 : handler.conform1;
            d3.selectAll( ".canvas3D" ).classed( "incorrect", false );
            toggleConform();

        })

        d3.select( document ).on( "3DMousein.hoverSub", handleMousein );
        d3.select( document ).on( "3DMouseout.hoverSub", handleMouseout );
        d3.select( document ).on( "mouseup.deleteSub touchend.deleteSub", handleMouseup );

    }

}

let Conformation = function( molFile, container, molecule ){

    this.molFile = molFile;
    this.molecule = molecule ? molecule :
        [{index: 0, equatorial: null, axial: null},
         {index: 1, equatorial: null, axial: null},
         {index: 2, equatorial: null, axial: null},
         {index: 3, equatorial: null, axial: null},
         {index: 4, equatorial: null, axial: null},
         {index: 5, equatorial: null, axial: null}];
    this.container = container;
    this.svg = null;
    if( molFile ){

        this.Mol3D = new MolViewer.Mol3D( new MolViewer.Molecule( this.molFile ), container.node(), {mouseoverDispatch: true, showfGroups: false} );
        this.Mol3D.frameFunctions.mouseoverDispatch.props.XRay = true;
        this.Mol3D.init();

    }

    this.draw = function(){

        this.Mol3D.scene.children.slice(1).forEach( child => this.Mol3D.scene.remove( child ) );
        this.Mol3D.draw();

        this.Mol3D.setView( new THREE.Box3().setFromObject( this.Mol3D.molGroup ).getBoundingSphere(), new THREE.Vector3( 0, 0, 6 ), new THREE.Vector3().copy( this.Mol3D.camActive.up ) );

        const normal = this.Mol3D.scene.getObjectByName( 0 ).position.clone().sub( this.Mol3D.scene.getObjectByName( 2 ).position ).cross( this.Mol3D.scene.getObjectByName( 0 ).position.clone().sub( this.Mol3D.scene.getObjectByName( 4 ).position ) ).normalize();

        const ringBondMAT = new THREE.MeshToonMaterial( {
                                color: new THREE.Color( 0.1, 1, 1 ),
                                reflectivity: 0.8,
                                shininess: 0.8,
                                specular: 0.8,
                            });
        const axialBondMAT = ringBondMAT.clone();
        axialBondMAT.color = new THREE.Color( 255, 0, 0 );
        const equatBondMAT = ringBondMAT.clone();
        equatBondMAT.color = new THREE.Color( 0, 0, 255 );

        this.Mol3D.Molecule.bonds.forEach( bond => {

            const vec = new THREE.Vector3( ...bond.end.pos ).sub( new THREE.Vector3( ...bond.start.pos ) );
            if( bond.index < 6 ){

                bond.HTML.material = ringBondMAT;
                bond.btype = "ring";

            }
            else{

                const dot = Math.abs( vec.dot( normal )/( normal.length() * vec.length() ) );

                if( dot > 0.95 ){

                    bond.HTML.material = axialBondMAT;
                    bond.btype = "axial";

                }
                else{

                    bond.HTML.material = equatBondMAT;
                    bond.btype = "equatorial";

                }

            }

        })

        this.molecule.forEach( ( atom, i ) => {

            [atom.axial, atom.equatorial].forEach( ( bondType, j ) => {
                if( bondType !== null ){

                    const sub = bondType;
                    const root = this.Mol3D.Molecule.atoms[i].bondedTo.filter( bond => bond.bond.btype === ( j === 0 ? "axial" : "equatorial" ) )[0].bond.end.HTML;

                    [group, quatOrig] = generateSubGroup( sub );

                    this.Mol3D.scene.add( group )
                    group.position.copy( root.position )
                    group.quaternion.copy( new THREE.Quaternion().setFromUnitVectors( new THREE.Vector3( 0, 1, 0 ).applyQuaternion( quatOrig ), root.position.clone().sub( root.userData.source.bondedTo[0].el.HTML.position ).normalize() ) )

                    group.getObjectByName( sub.replaceBond ).visible = false;
                    root.userData.source.bondedTo[0].bond.end.element = sub.smile;
                    root.userData.attached = group;

                }
            })

        })

        if( !handler.HVisible ) this.Mol3D.showHs = false;

        return this.Mol3D;

    }

    this.calculateEnergy = function(){

        let totalEnergy = 0;

        this.molecule.forEach( atom => {

            if( atom.axial ){ totalEnergy += atom.axial.a}

        })

        return totalEnergy;

    }

    this.sortMol = function(){

        const newC1 = this.molecule.map( atom => {
            const equatorial = atom.equatorial ? atom.equatorial.a : 0;
            const axial = atom.axial ? atom.axial.a : 0;
            return ( equatorial > axial ) ? equatorial : axial;
        } ).reduce( (iMax, x, i, arr ) => x > arr[iMax] ? i : iMax, 0);

        this.molecule = this.molecule.slice( newC1 ).concat( this.molecule.slice( 0, newC1 ) );
        if( [1,3,5].indexOf( newC1 ) !== -1 ){ this.molecule = this.molecule.map( invertRing ) };

        return this

    }

    this.drawSideOn = function(){

        const _chair1 = this.molFile === chair1;

        const svg = d3.select( document.createElementNS( "http://www.w3.org/2000/svg", "svg" ) );
        const front = svg.append( "g" ).attr( "transform", "translate(215,115)" );
        const back = svg.append( "g" ).attr( "transform", "translate(215,115)" ).attr( "mask", "url(#overlayLine" + _chair1 + ")" );

        const mask = svg.append( "defs" ).lower()
            .append( "mask" ).attr( "id", "overlayLine" + _chair1 )
            .append( "g" )

        mask.append( "rect" )
            .attr( "width", "100%" )
            .attr( "height", "100%" )
            .attr( "transform", "translate( -215, -115 )" )
            .style( "fill", "white" )

        const points = [[-80,-25],[-20,-5],[40,-20],[80,25],[20,5],[-40,20],[-80,-25]].map( point => [point[0], point[1] * ( _chair1 ? -1 : 1 )] );
        !_chair1 && points.reverse();

        front.append( "path" ).attr( "d", points.slice( 1, 3 ).map( ( el, i ) => ( i === 0 ? "M " : "L " ) + el.join(" ") ).join(" ") );
        mask.append( "path" ).attr( "d", points.slice( 1, 3 ).map( ( el, i ) => ( i === 0 ? "M " : "L " ) + el.join(" ") ).join(" ") ).attr( "class", "maskLine" );
        back.append( "path" ).attr( "d", points.map( ( el, i ) => ( i === 0 ? "M " : "L " ) + el.join(" ") ).join(" ") );

        const bondLength = 30;
        let lineTarget = [];

        this.molecule.forEach( ( atom, i ) => {

            const parent = ( _chair1 ? i === 1 : i === 2 ) ? front : back;

            if( atom.equatorial ){

                const line = [i < 5 ? points[i + 1] : points[ i - 5], i < 4 ? points[i + 2] : points[i - 4]]
                const angle = Math.atan2( line[1][1] - line[0][1], line[1][0] - line[0][0] ) + Math.PI
                const lineTarget = [points[i][0] + bondLength*Math.cos( angle ), points[i][1] + bondLength*Math.sin( angle )]

                drawLine( lineTarget[0] === points[i][0] ? parent : back, points[i], lineTarget, i );
                drawText( points[i], lineTarget, [-6, 4], atom.equatorial, front, lineTarget[0] < points[i][0] );

            }

            if( atom.axial ){

                const flipped = ( _chair1 ? [0,2,4] : [1,3,5] ).indexOf( i ) !== -1
                const lineTarget = [points[i][0], points[i][1] + ( flipped ? bondLength : -bondLength )]

                drawLine( lineTarget[0] === points[i][0] ? parent : back, points[i], lineTarget, i );
                drawText( points[i], lineTarget, flipped ? [-9, 2] : [-8, 3], atom.axial, front, false );

            }

        })

        function drawLine( parent, point, lineTarget, atomIndex ){

            const group = parent.append( "line" )
                            .attr( "x1", point[0] )
                            .attr( "x2", lineTarget[0] )
                            .attr( "y1", point[1] )
                            .attr( "y2", lineTarget[1] )
                            //.attr( "class", ( _chair1 ? atomIndex === 1 : atomIndex === 2 ) ? ( lineTarget[0] === point[0] ? "front" : null ) : null )
                            .attr( "id", atomIndex )

            if( parent === front ) mask.node().appendChild( d3.select( group.node().cloneNode( true ) ).attr( "class", "maskLine" ).node() );

        }

        function drawText( orig, target, textOffset, sub, parent, reverseText ){

            const formula = sub.shorthand.match( /\(|\)|[A-Z][a-z]?|[0-9]+/g );
            const pos = target.map( ( el, i ) => orig[i] + ( el - orig[i] ) * 1.4 )
            if( reverseText ){ formula.push( formula.shift() ) }

            const group = parent.append( "text" )
                            .attr( "x", pos[0] + ( reverseText ? -1 : 1 ) * textOffset[0] )
                            .attr( "y", pos[1] + textOffset[1]  )
                            .attr( "text-anchor", reverseText ? "end" : "start" )

            const tspan = group.append( "tspan" )

            formula.forEach( x => {

                tspan.append( "tspan" )
                    .html( x )
                    .attr( "baseline-shift", +x === +x ? "sub" : null )

            })

            mask.node().appendChild( d3.select( group.node().cloneNode( true ) ).attr( "class", "maskText" ).node() )

        }

        this.svg = svg;

        return svg.node()

    }

    this.draw2D = function(){

        const hexPoints = [[0, -100],[86.6, -50],[86.6, 50],[0, 100],[-86.6, 50],[-86.6, -50],[0, -100]].map( point => point.map( coord => coord * 0.7 ) );

        const length = 50;
        const width = 7;
        const wedgeBond = `<polygon id="" points="0,0 ` + length + `,` + width + ` ` + length + `,` + -width + `"></polygon>`;
        const hashBond = Array( 6 ).fill( 0 ).map( ( val, i, arr )  => { i = i + 1; return "<line class='bond' x1=" + i*length/arr.length + " x2=" + i*length/arr.length + " y1=" + i*width/arr.length + " y2=" + -i*width/arr.length + "></line>" } ).join("");

        let svg = d3.select( document.createElementNS( "http://www.w3.org/2000/svg", "svg" ) ).classed( "view2D maximise", true );
        const grp = svg.append( "g" );
        grp.append( "path" ).attr( "d", hexPoints.map( ( point, i ) => ( i === 0 ? "M " : "L " ) + point.join( " " ) ).join( " " ));


        this.molecule.forEach( ( atom, index ) => {

            let atomIndex = atom.index;

            const angle = Math.atan2( hexPoints[atomIndex + 1][1] - hexPoints[atomIndex][1], hexPoints[atomIndex + 1][0] - hexPoints[atomIndex][0] );

            if( handler.diff < 3 ){

                grp.append( "text" ).attr( "class", "atomIndex" ).text( index + 1 ).attr( "x", hexPoints[atomIndex][0] + 10*Math.cos( angle + Math.PI/3 ) ).attr( "y", hexPoints[atomIndex][1] + 10*Math.sin( angle + Math.PI/3 ) ).attr( "dy", "5px" );

            }

            const flipped = ( this.molFile === chair1 ? [ 0, 2, 4 ] : [ 1, 3, 5 ] ).indexOf( index ) !== -1;

            if( atom.axial && atom.equatorial ){

                drawBond( angle + Math.PI/6, atom.axial.shorthand, flipped ? wedgeBond : hashBond, hexPoints[atomIndex] );
                drawBond( angle - Math.PI/6, atom.equatorial.shorthand, flipped ? hashBond : wedgeBond, hexPoints[atomIndex] );

            } else if ( atom.axial ) {

                drawBond( angle, atom.axial.shorthand, flipped ? wedgeBond : hashBond, hexPoints[atomIndex] );

            } else if ( atom.equatorial ) {

                drawBond( angle, atom.equatorial.shorthand, flipped ? hashBond : wedgeBond, hexPoints[atomIndex] );

            }

        })

        function drawBond( AngleOffset, text, bondType, atomHexPoint ){

            grp.append( "g" ).html( bondType ).attr( "transform", "translate(" + atomHexPoint[0] + "," + atomHexPoint[1] + ")rotate(" + ( AngleOffset*180/Math.PI - 120 ) + ")" );

            const textPos = [ atomHexPoint[0] + length*Math.sin( AngleOffset - Math.PI/6 )*1.3, atomHexPoint[1] + 10 - length*Math.cos( AngleOffset - Math.PI/6 )*1.3 ];

            const txtGrp = grp.append( "text" ).attr( "class", "SubstituentText" )
                .append( "tspan" )
                .attr( "x", textPos[0] + ( textPos[0] < -1 ? 8 : -8 ) )
                .attr( "y", textPos[1] )
                .attr( "text-anchor", textPos[0] < -5 ? "end" : "start" )

            let txt = text.match( /\(|\)|[A-Z][a-z]?|[0-9]+/g );
            if( textPos[0] < -5 ){ txt.push( txt.shift() ) };

            txt.forEach( text => {

                txtGrp.append( "tspan" ).text( text )
                    .attr( "class", +text === +text ? "sub" : null )

            })

        }

        return svg.node()
    }

}

let Sprinkler = function( scene, pos, initialVel, count, spread ){

    this.root = pos;
    this.scene = scene;
    this.obj = null;
    this.points = [];
    this.geometry = null;
    this.colors = [];
    this.emitter = null;
    this.count = 1;
    this.maxCount = count;
    this.spread = spread instanceof THREE.Vector3 ? spread : new THREE.Vector3( spread, spread, spread );
    this.initialVel = initialVel;
    this.drag = 1E-3;

    this.material = new THREE.ShaderMaterial( {

        vertexShader: `
            attribute float alpha;
            attribute float size;
            attribute vec3 color;

            varying vec3 vColor;
            varying float vAlpha;

            void main() {

                vAlpha = alpha;
                vColor = color;

                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

                gl_PointSize = size;

                gl_Position = projectionMatrix * mvPosition;

            }
        `,

        fragmentShader:`
            varying vec3 vColor;
            varying float vAlpha;

            void main() {

                gl_FragColor = vec4( vColor, vAlpha );

            }
        `,

        transparent: true,

    })

    this.geometry = new THREE.BufferGeometry();
    this.geometry.addAttribute( "alpha", new THREE.Float32BufferAttribute( [], 1 ).setDynamic( true ) );
    this.geometry.addAttribute( "position", new THREE.Float32BufferAttribute( [], 3 ).setDynamic( true ) );
    this.geometry.attributes.position.count = this.maxCount;
    this.geometry.addAttribute( "color", new THREE.Float32BufferAttribute( [], 3 ).setDynamic( true ) );
    this.geometry.addAttribute( "size", new THREE.Float32BufferAttribute( [], 1 ).setDynamic( true ) );

    this.obj = new THREE.Points( this.geometry, this.material );

    this.addPoints( this.count );

}

Object.assign( Sprinkler.prototype, {

    addPoints: function( count ){

        for( let i = this.points.length; i < this.maxCount; i++ ){

            const color = new THREE.Color();
            color.setHSL( THREE.Math.randFloat( 0.1, 0.9 ), 1, 0.5 );

            const pos = new THREE.Vector3(
                this.root.x,
                this.root.y,
                this.root.z
            );
            const velocity = new THREE.Vector3(
                this.initialVel.x + THREE.Math.randFloat( -this.spread.x, this.spread.x ),
                this.initialVel.y + THREE.Math.randFloat( -this.spread.y, this.spread.y ),
                this.initialVel.z + THREE.Math.randFloat( -this.spread.z, this.spread.z )
            );

            if( this.count === this.maxCount ){

                this.points.push( { geo: pos, v: velocity , color: color, lifetime: THREE.Math.randInt( 30, 100 ), age: 1} )

            } else {

                this.points.push( { geo: pos , v: velocity , color: color, lifetime: THREE.Math.randInt( 30, 100 ), age: 1, hidden: true} )

            }

        }

        this.geometry.attributes.position.array = new Float32Array( this.points.map( el => Object.values( el.geo.add( el.v ) ).join( "," ) ).join( "," ).split( "," ) );
        this.geometry.attributes.position.count = this.count;
        this.geometry.attributes.color.array = new Float32Array( this.points.map( el => Object.values( el.color ).join( "," ) ).join( "," ).split( "," ) );
        this.geometry.attributes.alpha.array = new Float32Array( this.points.map( el => el.hidden ? 0 : 1-el.age/el.lifetime ) );
        this.geometry.attributes.size.array = new Float32Array( this.points.map( el => 4*(1-el.age/el.lifetime) ) );

        this.scene.add( this.obj );

    },

    draw: function(){

        window.requestAnimationFrame( () => this.draw() );

        this.addPoints( this.count );

        this.points = this.points.map( ( point, i ) => {

            if( point.age === point.lifetime ){

                return null

            }

            //Bit of drag
            point.v.multiplyScalar( Math.exp( -point.age*this.drag ) );
            //Drop of gravity
            point.v.y = point.v.y - 0.0001*point.age;

            point.age += 1;
            if( this.count < this.maxCount ) this.count++;

            return point

        }).filter( el => el !== null );

        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.alpha.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;

    }

})

const chair1 = `C6H12
    APtclcactv07251806263D 0   0.00000     0.00000

     18 18  0  0  0  0  0  0  0  0999 V2000
        0.0335   -1.4421    0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
       -1.2321   -0.7501   -0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
       -1.2657    0.6920    0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
       -0.0335    1.4421   -0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
        1.2321    0.7501    0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
        1.2657   -0.6920   -0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
        0.0335   -1.4421    1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
        0.0574   -2.4695   -0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
       -1.2321   -0.7501   -1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
       -2.1100   -1.2844    0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
       -2.1673    1.1851   -0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
       -1.2657    0.6920    1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
       -0.0335    1.4421   -1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
       -0.0574    2.4695    0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
        2.1100    1.2844   -0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
        1.2321    0.7501    1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
        2.1673   -1.1851    0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
        1.2657   -0.6920   -1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
      1  2  1  0  0  0  0
      2  3  1  0  0  0  0
      3  4  1  0  0  0  0
      4  5  1  0  0  0  0
      5  6  1  0  0  0  0
      1  6  1  0  0  0  0
      1  7  1  0  0  0  0
      1  8  1  0  0  0  0
      2  9  1  0  0  0  0
      2 10  1  0  0  0  0
      3 11  1  0  0  0  0
      3 12  1  0  0  0  0
      4 13  1  0  0  0  0
      4 14  1  0  0  0  0
      5 15  1  0  0  0  0
      5 16  1  0  0  0  0
      6 17  1  0  0  0  0
      6 18  1  0  0  0  0
    M  END
    $$$$`;

const chair2 = `C6H12
    APtclcactv07251806263D 0   0.00000     0.00000

     18 18  0  0  0  0  0  0  0  0999 V2000
        0.0335   -1.4421   -0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
       -1.2321   -0.7501    0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
       -1.2657    0.6920   -0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
       -0.0335    1.4421    0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
        1.2321    0.7501   -0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
        1.2657   -0.6920    0.2550 C   0  0  0  0  0  0  0  0  0  0  0  0
        0.0335   -1.4421   -1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
        0.0574   -2.4695    0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
       -1.2321   -0.7501    1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
       -2.1100   -1.2844   -0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
       -2.1673    1.1851    0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
       -1.2657    0.6920   -1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
       -0.0335    1.4421    1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
       -0.0574    2.4695   -0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
        2.1100    1.2844    0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
        1.2321    0.7501   -1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
        2.1673   -1.1851   -0.1083 H   0  0  0  0  0  0  0  0  0  0  0  0
        1.2657   -0.6920    1.3450 H   0  0  0  0  0  0  0  0  0  0  0  0
      1  2  1  0  0  0  0
      2  3  1  0  0  0  0
      3  4  1  0  0  0  0
      4  5  1  0  0  0  0
      5  6  1  0  0  0  0
      1  6  1  0  0  0  0
      1  7  1  0  0  0  0
      1  8  1  0  0  0  0
      2  9  1  0  0  0  0
      2 10  1  0  0  0  0
      3 11  1  0  0  0  0
      3 12  1  0  0  0  0
      4 13  1  0  0  0  0
      4 14  1  0  0  0  0
      5 15  1  0  0  0  0
      5 16  1  0  0  0  0
      6 17  1  0  0  0  0
      6 18  1  0  0  0  0
    M  END
    $$$$`

function displayHelpers(){

    d3.xml("img/HandIcons.svg").mimeType("image/svg+xml").get( (error, xml ) => {

        if( error ) throw error;

        const GrabHand = d3.select( xml.children[0].children[0] );
        const PointerHand = d3.select( xml.children[0].children[1] );
        const GrabbingHand = d3.select( xml.children[0].children[2] );

        const PointerHelper = d3.select( "#game" )
            .append( "svg" )
            .attr( "class", "HandIcon" );

        [1,2].forEach( el => {

            PointerHelper.append( "circle" )
                .attr( "id", "clickRipple" + el )
                .attr( "cx", 15 )
                .attr( "cy", 45 )
                .attr( "r", 0 )
                .style( "stroke", "rgba(0,0,0,1)" )
                .style( "stroke-width", 0 )
                .style( "fill", "none" )

        });

        (function PointerHelperAnim() {

            PointerHelper
                .style( "top", "70%" )
                .style( "left", "30%" )
                .transition()
                .duration( 1000 )
                .style( "top", "55%" )
                .style( "left", "25%" )
                .on( "end", () => {

                    d3.select( "#clickRipple1" )
                        .call( Ripple, 5 )

                    d3.select( "#clickRipple2" )
                        .call( Ripple, 3 )

                    setTimeout( PointerHelperAnim, 1000 );

                } )

        })()

        function Ripple( selection, rippleSize ){

            selection
                .style( "stroke-width", rippleSize )
                .style( "stroke", "rgba(0,0,0,1)")
                .attr( "r", 0 )
                .transition()
                .duration( 500 )
                .ease( d3.easePolyOut )
                .style( "stroke-width", 0 )
                .style( "stroke", "rgba(0,0,0,0)")
                .attr( "r", rippleSize*10 )

        }

        d3.select( "#game" ).on( "mousedown.helperAnims", function(){

                PointerHelper.remove();

                const GrabHelper = d3.select( "#game" ).append( "svg" ).attr( "class", "HandIcon" )

                GrabHelper.node().appendChild( GrabHand.node() );
                GrabHelper.node().appendChild( GrabbingHand.node() );

                (function GrabHelperAnim() {

                    d3.select( ".Grab" ).style( "display", null )
                    d3.select( ".Grabbing" ).style( "display", "none" )

                    GrabHelper
                        .style( "top", "75px" )
                        .style( "left", "300px" )
                        .transition()
                        .duration( 1000 )
                        .style( "top", "0px" )
                        .style( "left", "255px" )
                        .on( "end", function(){

                                d3.select( ".Grab" ).style( "display", "none" )
                                d3.select( ".Grabbing" ).style( "display", null )

                        } )
                        .transition()
                        .duration( 1000 )
                        .style( "top", "75px" )
                        .style( "left", "300px" )
                        .on( "end", function(){

                                d3.select( ".Grab" ).style( "display", null )
                                d3.select( ".Grabbing" ).style( "display", "none" )

                                setTimeout( GrabHelperAnim, 1000 );

                        } )


                })()

                d3.selectAll( ".dragBox" ).on( "mousedown.helperAnims touchstart.helperAnims", function(){

                    GrabHelper.remove();

                }, {once: true} )


            }, {once: true} )

        PointerHelper.node().appendChild( PointerHand.node() );

    })



}

function toggleConform(){

    [handler.activeConform, handler.inactiveConform] = [handler.inactiveConform, handler.activeConform];
    handler.activeConform.Mol3D.play();
    handler.inactiveConform.Mol3D.pause();

    d3.select( handler.activeConform.Mol3D.Container.parentNode )
        .classed( "active", true )
        .classed( "inactive", false )
        .transition()
        .duration( 1000 )
        //.style( "width", "80%" )
        //.style( "background", "rgba(128, 128, 128, 0)")
        .tween( null, () => function(){ handler.activeConform.Mol3D.onWindowResize() })


    d3.select( handler.inactiveConform.Mol3D.Container.parentNode )
        //.style( "background", "rgba(128, 128, 128, 0)")
        .classed( "active", false )
        .classed( "inactive", true )
        .transition()
        .duration( 1000 )
        //.style( "width", "20%" )
        //.style( "background", "rgba(128, 128, 128, 0.79)")
        .tween( null, () => function(){ handler.inactiveConform.Mol3D.onWindowResize() })

}

function MarkAttempts(){

    let a = handler.answerConform;

    handler.activeConform = null;
    handler.conform1.Mol3D.pause();
    handler.conform2.Mol3D.pause();
    handler.changeState( 3 );

    [handler.conform1, handler.conform2].forEach( conform => {

        let result = true;
        let answerMolecule = conform.molFile === a.molFile ? a.molecule : a.molecule.map( invertRing );

        conform.molecule.forEach( ( atom, i ) => {

            conform.Mol3D.molGroup.getObjectByName( i ).material = conform.Mol3D.atomCols["C"].material;

            ["axial", "equatorial"].forEach( bondType => {

                if( atom[bondType] !== answerMolecule[i][bondType] ){

                    result = false;
                    conform.Mol3D.molGroup.getObjectByName( i ).material = handler.incorrectMAT;

                }

            })

        })

        d3.select( conform.Mol3D.Container )
            .classed( result ? "correct" : "incorrect", true )
            .classed( result ? "incorrect" : "correct", false )


    })

    if( Array.from(document.querySelectorAll( ".canvas3D" )).filter( node => node.classList.contains("incorrect")).length === 0 ){

        //Conformations correct
        setTimeout( handler.correctConforms, 1000 );

    } else{

        //Wrong conformations

    }

}

function MarkEnergy( el, answer ){

    if( answer ? answer.molFile === handler.answerConform.molFile : false ){

        classFlash( el, "right" );
        setTimeout( () => handler.changeState( 5 ), 600 );

    }
    else{ classFlash( el, "wrong" ) };

    function classFlash( _el, className ){

        d3.select( _el )
            .classed( className, true )
            .transition()
            .duration( 500 )
            .on( "end", () => d3.select( _el ).classed( className, false ) )

    }

}

function animateResult(){

    d3.select( document ).on( "3DMousein.labels", null );
    d3.select( document ).on( "3DMousein.hoverSub", null );
    d3.select( document ).on( "3DMouseout.hoverSub", null );
    d3.select( document ).on( "mouseup.deleteSub", null );

    const answerConf = handler.answerConform;
    const scene = answerConf.Mol3D.scene;
    const controls = answerConf.Mol3D.controls;
    handler.activeConform = answerConf;
    answerConf.Mol3D.renderer.shadowMap.enabled = true;

    answerConf.draw();
    answerConf.Mol3D.frameFunctions.highlight.enabled = false;

    sprinkler1 = new Sprinkler( scene, new THREE.Vector3( -20, -5, -20 ), new THREE.Vector3( 0, 0.5, 0 ), 200, 0.05 );
    sprinkler2 = new Sprinkler( scene, new THREE.Vector3( 20, -5, -20 ), new THREE.Vector3( 0, 0.5, 0 ), 200, 0.05 );
    sprinkler1.draw();
    sprinkler2.draw();

    //Camera
    answerConf.Mol3D.setView( new THREE.Box3().setFromObject( answerConf.Mol3D.molGroup ).getBoundingSphere(), new THREE.Vector3( 0, 0, 10 ), new THREE.Vector3().copy( answerConf.Mol3D.camActive.up ) );
    controls.minZoom = 7;
    controls.minDistance = 7;
    controls.maxZoom = 15;
    controls.maxDistance = 15;
    controls.minAzimuthAngle = - Math.PI/2;
    controls.maxAzimuthAngle = Math.PI/2;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI/2;


    //Auto-rotate
    molGroup = new THREE.Group();
    answerConf.Mol3D.scene.children.slice( 1 ).forEach( obj => molGroup.add( obj ) );
    answerConf.Mol3D.scene.add( molGroup );
    molGroup.rotateOnWorldAxis( new THREE.Vector3( 1, 0, 0 ), Math.PI/2 );
    molGroup.traverse( obj => obj.castShadow = true );

    answerConf.Mol3D.frameFunctions.autoRotate.props.target = molGroup;
    answerConf.Mol3D.frameFunctions.autoRotate.props.axis
    answerConf.Mol3D.autoRotate = true;

    //Spotlight
    const spotLight = new THREE.SpotLight( 0xffffff,1, 20, Math.PI/6, 0.05);
    spotLight.position.set ( 0, 10, 0 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 30;
    spotLight.shadow.camera.fov = 30;

    scene.add( spotLight );

    //Ground plane
    let geometry = new THREE.PlaneBufferGeometry( 50, 50 );
    geometry.rotateX( Math.PI/2 );
    geometry.translate( 0, -5, 0 );
    let material = new THREE.MeshToonMaterial( {color: 0x303030, side: THREE.DoubleSide} );
    let plane = new THREE.Mesh( geometry, material );
    plane.receiveShadow = true;

    scene.add( plane );


}

function toggleHs(){

    handler.conform1.Mol3D.showHs = !handler.HVisible;
    handler.conform2.Mol3D.showHs = !handler.HVisible;
    handler.HVisible = !handler.HVisible;

}

function generateSubGroup( substituent ){

    let group = new MolViewer.Mol3D().genGroup( new MolViewer.Molecule( substituent.molfile ) );

    //////Modify snapping bond//////
    group.remove( group.getObjectByName( +substituent.replaceBond.split( "_" )[1] ) );

    const fadeBond = group.getObjectByName( substituent.replaceBond );
    fadeBond.material = fadeBond.material.clone();
    fadeBond.material.color = new THREE.Color( 255, 255, 0 );

    //////Snap central atom to mouse//////
    group.position.sub( group.children[0].position );
    group = new THREE.Group().add( group );
    group.userData = substituent;
    group.name = substituent.name;

    //////Rotate group//////
    const quatOrig = new THREE.Quaternion().setFromUnitVectors(
        group.up,
        fadeBond.userData.source.start.HTML.position.clone().sub( fadeBond.userData.source.end.HTML.position ).normalize()
    );
    group.setRotationFromQuaternion( quatOrig );

    return [group, quatOrig, fadeBond]

}

function showLabels( Conform ){

    [0,1,2,3,4,5].forEach( el => {
        Conform.labels.push(
            d3.select( Conform.Container )
                .append( "p" )
                .attr( "class", "label" )
                .attr( "id", "label" + el )
                .html( el + 1 )
                .datum( {object: Conform.scene.getObjectByName( +el )} )
            )
    })

}

function hideLabels( Conform ){

    Conform.labels.forEach( label => {

        label.transition()
            .delay( 300 )
            .duration( 1000 )
            .style( "background-color", "rgba(255, 255, 255, 0)")
            .style( "color", "rgba(0, 0, 0, 0)" )
            .on( "end", () => {
                label.remove()
                Conform.labels = Conform.labels.filter( el => el !== label )
            })

    })

}

function handleMousedown( substituent ){

    if( handler.activeConform === null ){ return };

    handler.activeConform.Mol3D.showHs = true;
    handler.dragging = true;

    handler.substituent = generateSubGroup( substituent );

    const mousePos = new THREE.Vector3( handler.activeConform.Mol3D.mouse.x, handler.activeConform.Mol3D.mouse.y, 0 );
    mousePos.unproject( handler.activeConform.Mol3D.camActive );
    handler.substituent[0].position.copy( handler.activeConform.Mol3D.camActive.position ).add( mousePos.clone().sub( handler.activeConform.Mol3D.camActive.position ).multiplyScalar( 4 ) );

    handler.activeConform.Mol3D.scene.add( handler.substituent[0] );

    handler.activeConform.container.style( "cursor", "grabbing" );

    //////Add labels//////
    showLabels( handler.activeConform.Mol3D );

    ////////MOUSEMOVE//////
    d3.select( ".page" ).on( "mousemove.dragGroup", () => handleMousemove( handler.substituent[0] ) );
    d3.select( ".page" ).on( "touchstart.dragGroup touchmove.dragGroup", () => handleMousemove( handler.substituent[0] ), {passive: false} );

}

function handleMousein(){

    let ev = d3.event.detail;

    if( ev.objects.filter( obj => obj.object.userData.tooltip === "H" ).length > 0 ){

        handler.snapTarget = ev.objects.filter( obj => obj.object.userData.tooltip === "H" )[0].object;

        if( handler.snapTarget.userData.attached && handler.fadeGroup === null ){


            handler.fadeGroup = handler.snapTarget.userData.attached.children[0];
            fadeSub( handler.fadeGroup, true );

            !handler.dragging && handler.activeConform.container.style( "cursor", "no-drop" );

        }

        if( handler.dragging ){

            let rootAtom = handler.snapTarget.userData.source.bondedTo[0];
            let [group, quatOrig, fadeBond] = handler.substituent;

            let quatFin = new THREE.Quaternion().setFromUnitVectors( new THREE.Vector3( 0, 1, 0 ).applyQuaternion( quatOrig ), new THREE.Vector3().copy( handler.snapTarget.position ).sub( rootAtom.el.HTML.position ).normalize() );
            let quatFrom = new THREE.Quaternion().copy( group.quaternion );

            //////Set position//////
            group.position.copy( handler.snapTarget.position );

            //////Fade bond//////
            d3.select( ".active" ).transition()
                .duration( 200 )
                .tween( null, () => function( t ){

                    fadeBond.material.transparent = true;
                    if( fadeBond.material.opacity > 0 ){ fadeBond.material.opacity = 1 - t };
                    THREE.Quaternion.slerp( quatFrom, quatFin, group.quaternion, t );

                })

            //////Flash Label//////
            d3.select( "#label" + rootAtom.el.index )
                .transition()
                .duration( 200 )
                .style( "opacity", 0.1 )
                .transition()
                .duration( 200 )
                .style( "opacity", 1 )

        }

    }

}

function handleMouseout(){

    if( handler.activeConform === null ){ return };

    !handler.dragging && handler.activeConform.container.style( "cursor", null );

    fadeSub( handler.fadeGroup, false );
    handler.fadeGroup = null;

    handler.snapTarget = null;

    if( handler.dragging ){

        let [group, quatOrig, fadeBond] = handler.substituent;

        let quatFrom = new THREE.Quaternion().copy( group.quaternion );

        d3.select( ".active" ).transition()
            .duration( 200 )
            .tween( null, () => function( t ){

                THREE.Quaternion.slerp( quatFrom, quatOrig, group.quaternion, t );
                if( fadeBond.material.opacity !== 1 ){ fadeBond.material.opacity = t };

            })

    } else{

        hideLabels( handler.activeConform.Mol3D );

    }

}

function handleMousemove( group ){

    if( handler.snapTarget === null ){

        d3.event.preventDefault();

        const mousePos = new THREE.Vector3( handler.activeConform.Mol3D.mouse.x, handler.activeConform.Mol3D.mouse.y, 0 );
        mousePos.unproject( handler.activeConform.Mol3D.camActive );
        group.position.copy( handler.activeConform.Mol3D.camActive.position ).add( new THREE.Vector3().copy( mousePos ).sub( handler.activeConform.Mol3D.camActive.position ).multiplyScalar( 4 ) );

    }

}

function handleMouseup(){

    if( handler.activeConform === null ){ return };

    if( handler.dragging ){

        let [group, quatOrig, fadeBond] = handler.substituent;

        handler.activeConform.container.style( "cursor", null );

        d3.select( ".page" ).on( "mousemove.dragGroup touchstart.dragGroup touchmove.dragGroup", null );

        hideLabels( handler.activeConform.Mol3D );

        if( handler.snapTarget === null ){

            handler.activeConform.Mol3D.scene.remove( group );

        } else {

            group.children[0].remove( fadeBond );
            replaceSub( handler.snapTarget, group );

        }

    } else if( handler.snapTarget ){

        replaceSub( handler.snapTarget, null );

    }

    if( !handler.HVisible ) handler.activeConform.Mol3D.showHs = false;

    handler.snapTarget = null;
    handler.dragging = false;
    handler.substituent = null;

}

function fadeSub( fadeGroup, fade ){

    if( fadeGroup ){

        const interpolator = d3.interpolateNumber( handler.fadeAt, fade ? 0.1 : 1 );

        d3.select( ".page" )
            .transition()
            .duration( 500 )
            .tween( null, () => function( t ){
                    fadeGroup.traverse( obj => {
                        if( obj.type === "Mesh" ){
                            obj.material.transparent = true;
                            handler.fadeAt = interpolator( t );
                            obj.material.opacity = handler.fadeAt;
                        }
                    } )

                }

            )

    }

}

function replaceSub( parentAtom, newSub ){

    let bondToRing = parentAtom.userData.source.bondedTo[0];

    handler.activeConform.Mol3D.scene.remove( parentAtom.userData.attached );

    bondToRing.bond.end.element = newSub ? newSub.userData.smile : "H";
    handler.activeConform.molecule[bondToRing.el.index][bondToRing.bond.btype] = newSub ? newSub.userData : null;
    handler.snapTarget.userData.attached = newSub;

}

function addSubstituents(){

    const subs = [
        {name: "Amine", smile: "N", shorthand: "NH2" , a: 1.6, replaceBond: "0_1", img: "img/NH2.png", molfile: `H3N
            APtclcactv06071806313D 0   0.00000     0.00000

              4  3  0  0  0  0  0  0  0  0999 V2000
               -0.0000   -0.0000    0.0550 N   0  0  0  0  0  0  0  0  0  0  0  0
               -0.0128   -0.9601   -0.2550 H   0  0  0  0  0  0  0  0  0  0  0  0
                0.8379    0.4690   -0.2550 H   0  0  0  0  0  0  0  0  0  0  0  0
               -0.8251    0.4911   -0.2550 H   0  0  0  0  0  0  0  0  0  0  0  0
              1  2  1  0  0  0  0
              1  3  1  0  0  0  0
              1  4  1  0  0  0  0
            M  END
            $$$$
        `}, {name: "Bromine", smile: "Br", shorthand: "Br" , a: 0.38, replaceBond: "0_1", img: "img/Br.png", molfile: `BrH
            APtclcactv06071809213D 0   0.00000     0.00000

              2  1  0  0  0  0  0  0  0  0999 V2000
               -0.0188    0.0000    0.0000 Br  0  0  0  0  0  0  0  0  0  0  0  0
                1.4912    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
              1  2  1  0  0  0  0
            M  END
            $$$$
        `}, {name: "Phenyl", smile: "C1:C:C:C:C:C1", shorthand: "Ph" , a: 3, replaceBond: "0_6", img: "img/Phenyl.png", molfile: `C6H6
            APtclcactv06061809523D 0   0.00000     0.00000

             7  7  0  0  0  0  0  0  0  0999 V2000
                0.1641   -1.3726   -0.0002 C   0  0  0  0  0  0  0  0  0  0  0  0
               -1.1066   -0.8284    0.0001 C   0  0  0  0  0  0  0  0  0  0  0  0
               -1.2707    0.5442   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
               -0.1641    1.3726    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
                1.1066    0.8284    0.0006 C   0  0  0  0  0  0  0  0  0  0  0  0
                1.2707   -0.5442   -0.0007 C   0  0  0  0  0  0  0  0  0  0  0  0
                0.2923   -2.4449    0.0044 H   0  0  0  0  0  0  0  0  0  0  0  0
              1  2  4  0  0  0  0
              2  3  4  0  0  0  0
              3  4  4  0  0  0  0
              4  5  4  0  0  0  0
              5  6  4  0  0  0  0
              6  1  4  0  0  0  0
              1  7  1  0  0  0  0
            M  END
            $$$$
        `}, {name: "Methyl", smile: "C", shorthand: "CH3" , a: 1.7, replaceBond: "0_1", img: "img/Methyl.png", molfile: `CH4
            APtclcactv06071810123D 0   0.00000     0.00000

              5  4  0  0  0  0  0  0  0  0999 V2000
                0.0000   -0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
                0.0000   -0.8900   -0.6293 H   0  0  0  0  0  0  0  0  0  0  0  0
                0.0000    0.8900   -0.6293 H   0  0  0  0  0  0  0  0  0  0  0  0
               -0.8900   -0.0000    0.6293 H   0  0  0  0  0  0  0  0  0  0  0  0
                0.8900   -0.0000    0.6293 H   0  0  0  0  0  0  0  0  0  0  0  0
              1  2  1  0  0  0  0
              1  3  1  0  0  0  0
              1  4  1  0  0  0  0
              1  5  1  0  0  0  0
            M  END
            $$$$
        `}, {name: "Hydroxyl", smile: "O", shorthand: "OH" , a: 0.87, replaceBond: "0_1", img: "img/Hydroxyl.png", molfile: `H2O
            APtclcactv06071810163D 0   0.00000     0.00000

              3  2  0  0  0  0  0  0  0  0999 V2000
               -0.0000   -0.0589   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
               -0.8110    0.4677    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
                0.8110    0.4677    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
              1  2  1  0  0  0  0
              1  3  1  0  0  0  0
            M  END
            $$$$
        `}, {name: "t-Butyl", smile: "C(C)(C)C", shorthand: "C(CH3)3" , a: 100, replaceBond: "0_1", img: "img/tButyl.png", molfile: `C4H10
            APtclcactv06071810193D 0   0.00000     0.00000

             5  4  0  0  0  0  0  0  0  0999 V2000
               -0.0000   -0.0000   -0.3958 C   0  0  0  0  0  0  0  0  0  0  0  0
               -0.0000   -0.0000   -1.4858 H   0  0  0  0  0  0  0  0  0  0  0  0
                0.0477    1.4417    0.1142 C   0  0  0  0  0  0  0  0  0  0  0  0
               -1.2724   -0.6795    0.1142 C   0  0  0  0  0  0  0  0  0  0  0  0
                1.2247   -0.7622    0.1142 C   0  0  0  0  0  0  0  0  0  0  0  0
              1  2  1  0  0  0  0
              1  3  1  0  0  0  0
              1  4  1  0  0  0  0
              1  5  1  0  0  0  0
            M  END
            $$$$
        `}
    ]

    subs.forEach( ( el, i ) => {
        let frame = d3.select( "#game" ).append( "div" ).attr( "class", "dragBox" ).attr( "id", "drag" + ( i + 1 ) ).datum( el );
        frame.append( "p" ).html( el.shorthand.split( /([0-9]+)/g ).map( str => str.match(/[0-9]+/g) ? "<sub>" + str + "</sub>" : str ).join("") );
        frame.append( "img" ).attr( "class", "substituentImage" ).attr( "src", el.img );

    } )

    return subs

}

function generateAnswerMol( len ){

    let AnswerMol = [{index: 0, equatorial: null, axial: null},
              {index: 1, equatorial: null, axial: null},
              {index: 2, equatorial: null, axial: null},
              {index: 3, equatorial: null, axial: null},
              {index: 4, equatorial: null, axial: null},
              {index: 5, equatorial: null, axial: null}];

    const subList = subs.filter( sub => sub.name !== "Reset" );

    for( let i = 0; i < len; i++ ){

        if( subList.length === 0 ){ break }

        let sub = subList.splice( Math.floor( Math.random() * subList.length ), 1 )[0];

        let randAtom = Math.floor( Math.random() * 6 );
        let randPosition = Math.random() > 0.5 ? "equatorial" : "axial";

        while ( AnswerMol[ randAtom ][ randPosition ] === null ? false : true ){

            randAtom = Math.floor( Math.random() * 6 );
            randPosition = Math.random() > 0.5 ? "equatorial" : "axial";

        }

        AnswerMol[ randAtom ][ randPosition ] = sub;

    }

    handler.lastState = 2;

    if( !d3.select( ".view2D" ).empty() ){ d3.select( ".view2D" ).remove() }

    let conf1 = new Conformation( chair1, d3.select( "#answerconform" ), AnswerMol).sortMol();
    let conf2 = new Conformation( chair2, d3.select( "#answerconform" ), AnswerMol.map( invertRing ) ).sortMol();

    if( conf1.calculateEnergy() > conf2.calculateEnergy() ){

        handler.answerConform = conf2;
        conf1.Mol3D.dispose();

    } else if( conf1.calculateEnergy() < conf2.calculateEnergy() ){

        handler.answerConform = conf1;
        conf2.Mol3D.dispose();

    } else{

        generateAnswerMol( len );
        return

    }

    document.querySelector( "#questionMolecule" ).appendChild( handler.answerConform.draw2D() );

}

function invertRing( atom ){

    return Object.assign( {}, atom, { equatorial: atom.axial, axial: atom.equatorial } )

}
