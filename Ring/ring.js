document.addEventListener( "DOMContentLoaded", ev => {

    d3.select( "#loading" ).remove();
    d3.select( "#menu" ).style( "display", null );

});

let GameHandler = function(){

    this.grabbed = false;
    this.snapTarget = null;
    this.fadeGroup = null;
    this.substituent = null;
    this.state = 0; //0: start, 1: showAnswerMolecule, 2: playing, 3: markConforms, 4: markHighEnergy, 5: result
    this.lastState = 0;
    this.HVisible = false;
    this.camSave = null;
    this.answerConform = null;
    this.activeConform = null;
    this.inactiveConform = null;
    this.incorrectMAT = new THREE.MeshToonMaterial();
    this.incorrectMAT.color = new THREE.Color( 1, 0.5, 0.5 );

    this.changeState = function( newState ){

        switch( newState ){

            case 0:

                d3.select( "#intro" )           .classed( "active", true ).classed( "hidden", false )
                d3.select( "#questionMolecule" ).classed( "active", false )
                d3.select( "#game" )            .classed( "active", false )
                d3.select( "#result" )          .classed( "active", false )
                d3.select( "#markHighEnergy" )  .classed( "active", false )

                break;

            case 1:

                d3.select( "#intro" )           .classed( "active", false ).classed( "hidden", true )
                d3.select( "#questionMolecule" ).classed( "active", true ).classed( "maximise", true )

                break;

            case 2:

                d3.select( "#questionMolecule" ).classed( "active", true ).classed( "maximise", false )
                d3.select( "#game" )            .classed( "active", true )

                break;

            case 3:

                d3.select( "#questionMolecule" ).classed( "active", true ).classed( "maximise", false )
                d3.select( "#game" )            .classed( "active", true )
                    .selectAll( ".view3D" )
                        .classed( "active", false )
                        .classed( "inactive", false )
                        .transition()
                        .duration( 1000 )
                        .tween( null, () => function(){ handler.conform1.Mol3D.onWindowResize(); handler.conform2.Mol3D.onWindowResize() })

                break;

            case 4:

                d3.select( "#questionMolecule" ).classed( "active", false ).classed( "hidden", true )
                d3.select( "#game" )            .classed( "active", false )
                d3.select( "#markHighEnergy" )  .classed( "active", true ).classed( "hidden", false )

                break;

            case 5:

                d3.select( "#game" )            .classed( "active", false ).classed( "hidden", true )
                d3.select( "#markHighEnergy" )  .classed( "active", false ).classed( "hidden", true )
                d3.select( "#result" )          .classed( "active", true )

            break;


        }

        this.lastState = this.state;
        this.state = newState;

    }

    this.correctConforms = function(){

            document.getElementById( "HighEnergyConform1" ).appendChild( handler.conform1.drawSideOn() );
            document.getElementById( "HighEnergyConform2" ).appendChild( handler.conform2.drawSideOn() );
            handler.changeState( 4 )

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
    if( molFile ){

        this.Mol3D = new MolViewer.Mol3D( new MolViewer.Molecule( this.molFile ), container.node(), {mouseoverDispatch: true, showfGroups: false} );
        this.Mol3D.frameFunctions.mouseoverDispatch.props.XRay = true;
        this.Mol3D.init();

    }

    this.draw = function(){

        this.Mol3D.scene.children.slice(1).forEach( child => this.Mol3D.scene.remove( child ) );
        this.Mol3D.draw();

        this.Mol3D.setView( new THREE.Box3().setFromObject( this.Mol3D.molGroup ).getBoundingSphere(), new THREE.Vector3( 0, 0, 5 ), new THREE.Vector3().copy( this.Mol3D.camActive.up ) );

        const normal = this.Mol3D.scene.getObjectByName( 0 ).position.clone().sub( this.Mol3D.scene.getObjectByName( 2 ).position ).cross( this.Mol3D.scene.getObjectByName( 0 ).position.clone().sub( this.Mol3D.scene.getObjectByName( 4 ).position ) ).normalize();

        const ringBondMAT = new THREE.MeshToonMaterial( {
                                color: new THREE.Color( 0.3, 0.3, 0.3 ),
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

        const svg = d3.select( document.createElementNS( "http://www.w3.org/2000/svg", "svg" ) )
        const grp = svg.append( "g" ).attr( "transform", "translate(215,115)" );

        const points = [[-80,-25],[-20,-5],[40,-20],[80,25],[20,5],[-40,20],[-80,-25]].map( point => [point[0], point[1] * ( this.molFile === chair1 ? -1 : 1 )] );

        grp.append( "path" ).attr( "d", points.map( ( el, i ) => ( i === 0 ? "M " : "L " ) + el.join(" ") ).join(" ") );

        const bondLength = 30;
        let lineTarget = [];

        this.molecule.forEach( ( atom, i ) => {

            if( atom.equatorial ){

                const line = [i < 5 ? points[i + 1] : points[ i - 5], i < 4 ? points[i + 2] : points[i - 4]]
                const angle = Math.atan2( line[1][1] - line[0][1], line[1][0] - line[0][0] ) + Math.PI
                const lineTarget = [points[i][0] + bondLength*Math.cos( angle ), points[i][1] + bondLength*Math.sin( angle )]
                grp.append( "line" )
                    .attr( "x1", points[i][0] )
                    .attr( "x2", lineTarget[0] )
                    .attr( "y1", points[i][1] )
                    .attr( "y2", lineTarget[1] )

                drawText( points[i], lineTarget, [-6, 4], atom.equatorial, grp, lineTarget[0] < points[i][0] );

            }

            if( atom.axial ){

                const flipped = ( this.molFile === chair1 ? [0,2,4] : [1,3,5] ).indexOf( i ) !== -1
                const lineTarget = [points[i][0], points[i][1] + ( flipped ? bondLength : -bondLength )]
                grp.append( "line" )
                    .attr( "x1", points[i][0] )
                    .attr( "x2", lineTarget[0] )
                    .attr( "y1", points[i][1] )
                    .attr( "y2", lineTarget[1] )

                drawText( points[i], lineTarget, flipped ? [-9, 2] : [-8, 3], atom.axial, grp, false );

            }



        })

        function drawText( orig, target, textOffset, sub, parent, reverseText ){

            const formula = sub.shorthand.match( /\(|\)|[A-Z][a-z]?|[0-9]+/g );
            const pos = target.map( ( el, i ) => orig[i] + ( el - orig[i] ) * 1.4 )
            if( reverseText ){ formula.push( formula.shift() ) }

            const group = parent.append( "text" )
                            .attr( "x", pos[0] + ( reverseText ? -1 : 1 ) * textOffset[0] )
                            .attr( "y", pos[1] + textOffset[1]  )
                            .attr( "text-anchor", reverseText ? "end" : "start" )
                            .append( "tspan" )

            formula.forEach( x => {

                group.append( "tspan" )
                    .html( x )
                    .attr( "baseline-shift", +x === +x ? "sub" : null )

            })

        }

        return svg.node()

    }

    this.draw2D = function(){

        if( !d3.select( ".view2D" ).empty() ){ d3.select( ".view2D" ).remove() }

        const hexPoints = [[0, -100],[86.6, -50],[86.6, 50],[0, 100],[-86.6, 50],[-86.6, -50],[0, -100]].map( point => point.map( coord => coord * 0.7 ) );

        const length = 50;
        const width = 7;
        const wedgeBond = `<polygon id="" points="0,0 ` + length + `,` + width + ` ` + length + `,` + -width + `"></polygon>`;
        const hashBond = Array( 6 ).fill( 0 ).map( ( val, i, arr )  => { i = i + 1; return "<line class='bond' x1=" + i*length/arr.length + " x2=" + i*length/arr.length + " y1=" + i*width/arr.length + " y2=" + -i*width/arr.length + "></line>" } ).join("");

        let svg = d3.select( "#questionMolecule" ).append( "svg" ).classed( "view2D maximise", true );
        const grp = svg.append( "g" );
        grp.append( "path" ).attr( "d", hexPoints.map( ( point, i ) => ( i === 0 ? "M " : "L " ) + point.join( " " ) ).join( " " ));

        this.molecule.forEach( ( atom, i ) => {

            const angle = Math.atan2( hexPoints[i + 1][1] - hexPoints[i][1], hexPoints[i + 1][0] - hexPoints[i][0] )*180/Math.PI - 0;

            const flipped = [ 0, 2, 4 ].indexOf( i ) !== -1;

            if( atom.axial && atom.equatorial ){

                drawBond( angle + 30, atom.axial.shorthand, flipped ? wedgeBond : hashBond, hexPoints[i] );
                drawBond( angle - 30, atom.equatorial.shorthand, flipped ? hashBond : wedgeBond, hexPoints[i] );

            } else if ( atom.axial ) {

                drawBond( angle, atom.axial.shorthand, flipped ? wedgeBond : hashBond, hexPoints[i] );

            } else if ( atom.equatorial ) {

                drawBond( angle, atom.equatorial.shorthand, flipped ? hashBond : wedgeBond, hexPoints[i] );

            }

        })

        function drawBond( AngleOffset, text, bondType, atomHexPoint ){

            grp.append( "g" ).html( bondType ).attr( "transform", "translate(" + atomHexPoint[0] + "," + atomHexPoint[1] + ")rotate(" + ( AngleOffset - 120 ) + ")" );

            const textPos = [ atomHexPoint[0] + length*Math.sin( ( AngleOffset - 30 ) * Math.PI/180 )*1.3, atomHexPoint[1] + 10 - length*Math.cos( ( AngleOffset - 30 ) * Math.PI/180 )*1.3 ];

            const txtGrp = grp.append( "text" ).attr( "class", "SubstituentText" )
                .append( "tspan" )
                .attr( "x", textPos[0] + ( textPos[0] < -1 ? 8 : -8 ) )
                .attr( "y", textPos[1] )
                .attr( "text-anchor", textPos[0] < -5 ? "end" : "start" )

            let txt = text.match( /\(|\)|[A-Z][a-z]?|[0-9]+/g );
            if( textPos[0] < -5 ){ txt.push( txt.shift() ) };

            txt.forEach( text => {

                txtGrp.append( "tspan" ).text( text )
                    .attr( "baseline-shift", +text === +text ? "sub" : null )

            })

        }
    }

}

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

let handler = new GameHandler();
handler.conform1 = new Conformation( chair1, d3.select( "#conform1 > .canvas3D" ) );
handler.conform2 = new Conformation( chair2, d3.select( "#conform2 > .canvas3D" ) );

handler.conform1.draw();
handler.conform2.draw();

let subs = addSubstituents();

d3.selectAll( ".conformOverlay" ).on( "mousedown", function(){

    handler.activeConform = d3.select( this ).attr( "id" ).split( "_" )[0] === "conform1" ? handler.conform2 : handler.conform1;
    handler.inactiveConform = handler.activeConform === handler.conform1 ? handler.conform2 : handler.conform1;
    toggleConform();
    handler.changeState( 2 );

})

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
        setTimeout( handler.correctConforms, 2000 );

    } else{

        //Wrong conformations

    }

}

function MarkEnergy( el, answer ){

    if( !answer ){

        wrongFlash();

    } else{

        if( answer.molFile === handler.answerConform.molFile ){

            d3.select( el )
                .style( "background", "rgba( 255, 255, 255, 0.3 )" )
                .transition()
                .duration( 200 )
                .style( "background", "rgba( 130, 255, 130, 0.8 )" )
                .on( "end", () => setTimeout( () => handler.changeState( 5 ), 1000 ) )


        }
        else{ wrongFlash() };

    }

    function wrongFlash(){

        d3.select( el )
            .style( "background", "rgba( 255, 255, 255, 0.3 )" )
            .transition()
            .duration( 200 )
            .style( "background", "rgba( 255, 130, 130, 1 )" )
            .transition()
            .duration( 500 )
            .style( "background", "rgba( 255, 255, 255, 0.3 )" )

    }

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

    const mousePos = new THREE.Vector3( handler.activeConform.Mol3D.mouse.x, handler.activeConform.Mol3D.mouse.y, 0 );
    mousePos.unproject( handler.activeConform.Mol3D.camActive );
    group.position.copy( handler.activeConform.Mol3D.camActive.position ).add( mousePos.clone().sub( handler.activeConform.Mol3D.camActive.position ).multiplyScalar( 4 ) );

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

//////Show labels on hover//////
d3.select( document ).on( "3DMouseover.labels", function(){

    if( !handler.grabbed && handler.activeConform ){

        if( d3.event.detail.objects.length > 0 ){ showLabels( handler.activeConform.Mol3D ) }
        else{ hideLabels( handler.activeConform.Mol3D ) }

    }

})

//////MOUSEDOWN//////
d3.selectAll( ".dragBox" ).on( "mousedown", handleMousedown );

function handleMousedown( substituent ){

    if( handler.activeConform === null ){ return };

    handler.activeConform.Mol3D.showHs = true;
    handler.grabbed = true;

    [group, quatOrig, fadeBond] = generateSubGroup( substituent );

    handler.activeConform.Mol3D.scene.add( group );

    handler.activeConform.container.style( "cursor", "grabbing" )

    //////Add labels//////
    showLabels( handler.activeConform.Mol3D );

    handler.snapTarget = null;
    handler.fadeGroup = null;
    handler.fadeTransition = null;
    handler.substituent = substituent;

    //////MOUSEOVER//////
    d3.select( document ).on( "3DMouseover.snapSub", handleMouseover );

    //////MOUSEMOVE//////
    d3.select( ".page" ).on( "mousemove.dragGroup", handleMousemove );

    //////MOUSEUP//////
    d3.select( document ).on( "mouseup", handleMouseup );
}

function handleMouseover(){

    let ev = d3.event.detail;

    function fadeGroup( fadeGroup, unfade ){

        if( fadeGroup ){

            d3.select( ".page" )
                .transition()
                .duration( 500 )
                .tween( null, () => function( t ){
                        fadeGroup.traverse( obj => {
                            if( obj.type === "Mesh" ){
                                obj.material.transparent = true;
                                obj.material.opacity = unfade ? t*0.9 + 0.1 : 1 - t*0.9;
                            }
                        } )

                    }

                )

        }

    }

    //////Hovered a group//////
    if( ev.objects.length > 0 ? ev.objects[0].object.userData.tooltip === "H" : false ){

        handler.snapTarget = ev.objects[0].object;
        let rootAtom = handler.snapTarget.userData.source.bondedTo[0];

        let quatFin = new THREE.Quaternion().setFromUnitVectors( new THREE.Vector3( 0, 1, 0 ).applyQuaternion( quatOrig ), new THREE.Vector3().copy( handler.snapTarget.position ).sub( rootAtom.el.HTML.position ).normalize() )
        let quatFrom = new THREE.Quaternion().copy( group.quaternion )

        //////Set position//////
        group.position.copy( handler.snapTarget.position );

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

        //////Dim attached group//////
        if( handler.snapTarget.userData.attached && handler.fadeGroup === null ){

            handler.fadeGroup = handler.snapTarget.userData.attached.children[0];
            fadeGroup( handler.fadeGroup );

        }

    //////Left a group//////
    } else{

        handler.snapTarget = null;

        let quatFrom = new THREE.Quaternion().copy( group.quaternion );

        d3.select( ".active" ).transition()
            .duration( 200 )
            .tween( null, () => function( t ){

                THREE.Quaternion.slerp( quatFrom, quatOrig, group.quaternion, t );
                if( fadeBond.material.opacity !== 1 ){ fadeBond.material.opacity = t };

            })

        fadeGroup( handler.fadeGroup, true );
        handler.fadeGroup = null;

    }

}

function handleMousemove(){

    if( handler.snapTarget === null ){

        const mousePos = new THREE.Vector3( handler.activeConform.Mol3D.mouse.x, handler.activeConform.Mol3D.mouse.y, 0 );
        mousePos.unproject( handler.activeConform.Mol3D.camActive );
        group.position.copy( handler.activeConform.Mol3D.camActive.position ).add( new THREE.Vector3().copy( mousePos ).sub( handler.activeConform.Mol3D.camActive.position ).multiplyScalar( 4 ) );

    }

}

function handleMouseup(){

    handler.activeConform.container.style( "cursor", null )

    d3.select( ".page" ).on( "mousemove.dragGroup", null );
    d3.select( document )
        .on( "3DMouseover.snapSub", null )
        .on( "mouseup", null )

    hideLabels( handler.activeConform.Mol3D );

    if( handler.snapTarget === null ){
        handler.activeConform.Mol3D.scene.remove( group );
    } else {

        let rootAtom = handler.snapTarget.userData.source.bondedTo[0];

        group.children[0].remove( fadeBond );

        rootAtom.bond.end.element = handler.substituent.smile;

        if( handler.snapTarget.userData.attached ){

            handler.activeConform.Mol3D.scene.remove( handler.snapTarget.userData.attached );

        }

        handler.substituent.smile === "H" && handler.activeConform.Mol3D.scene.remove( group );

        handler.activeConform.molecule[rootAtom.el.index][rootAtom.bond.btype] = handler.substituent.smile === "H" ? null : handler.substituent;
        handler.snapTarget.userData.attached = handler.substituent.smile === "H" ? null : group;

    }

    if( !handler.HVisible ) handler.activeConform.Mol3D.showHs = false;
    handler.grabbed = false;

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
        `}, {name: "t-Butyl", smile: "C(C)(C)C", shorthand: "C(CH3)3" , a: 4.9, replaceBond: "0_1", img: "img/tButyl.png", molfile: `C4H10
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
        `}, {name: "Reset", smile: "H", shorthand: "H" , a: 0, replaceBond: "0_1", img: "img/H.png", molfile: `H2
            APtclcactv06121804423D 0   0.00000     0.00000

              2  1  0  0  0  0  0  0  0  0999 V2000
               -0.3800    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
                0.3800    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
              1  2  1  0  0  0  0
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

        const sub = subList.splice( Math.floor( Math.random() * subList.length ), 1 )[0];

        let randAtom = Math.floor( Math.random() * 6 );
        let randPosition = Math.random() > 0.5 ? "equatorial" : "axial";

        while ( AnswerMol[ randAtom ][ randPosition ] === null ? false : true ){

            randAtom = Math.floor( Math.random() * 6 );
            randPosition = Math.random() > 0.5 ? "equatorial" : "axial";

        }

        AnswerMol[ randAtom ][ randPosition ] = sub;

    }

    handler.lastState = 2;

    new Conformation( null, null, AnswerMol ).draw2D();
    let conf1 = new Conformation( chair1, d3.select( "#answerconform" ), AnswerMol).sortMol();
    let conf2 = new Conformation( chair2, d3.select( "#answerconform" ), AnswerMol.map( invertRing ) ).sortMol();

    if( conf1.calculateEnergy() > conf2.calculateEnergy() ){

        handler.answerConform = conf2;
        conf1.Mol3D.renderer.domElement.remove()

    } else if( conf1.calculateEnergy() < conf2.calculateEnergy() ){

        handler.answerConform = conf1;
        conf2.Mol3D.renderer.domElement.remove()

    } else{

        generateAnswerMol( len );
        return

    }

}

function invertRing( atom ){

    return Object.assign( {}, atom, { equatorial: atom.axial, axial: atom.equatorial } )

}
