var mol3d = new Mol3D( d3.select( ".view3D" ), {mouseoverDispatch: true, showfGroups: false} );
var grabbed = false;
mol3d.getFromSMILE( "C1CCCCC1" );
var mol = [[{index: 0, smile: "C1"},{index: null, smile: ""},{index: null, smile: ""}],
          [{index: 1, smile: "C"},{index: null, smile: ""},{index: null, smile: ""}],
          [{index: 2, smile: "C"},{index: null, smile: ""},{index: null, smile: ""}],
          [{index: 3, smile: "C"},{index: null, smile: ""},{index: null, smile: ""}],
          [{index: 4, smile: "C"},{index: null, smile: ""},{index: null, smile: ""}],
          [{index: 5, smile: "C1"},{index: null, smile: ""},{index: null, smile: ""}]];

d3.select( ".page" ).append( "p" ).attr( "id", "loading" ).html( "Loading Molecule" ).style( "position", "absolute" ).style( "top", "0px" );
addSubstituents();

var loadinterval = setInterval( function(){
    var loadtxt = d3.select( "#loading" )
    if( loadtxt.html().length < 20 ){
        loadtxt.html( loadtxt.html() + "." )
    } else{
        loadtxt.html( "Loading Molecule" )
    }

}, 1000 )

d3.select( document ).on( "ajaxComplete.highlightRing", () => {

    mol3d.draw();
    mol3d.showH( false );
    clearInterval( loadinterval );
    d3.select( "#loading" ).remove();

    ["0_1","1_2","2_3","3_4","4_5","0_5"].forEach( e =>{
        mol3d.scene.getObjectByName( e ).material.color = new THREE.Color( 255, 0, 170 )
    });
    ["5_17","1_8","3_12","4_15","2_11","0_6"].forEach( e =>{
        mol3d.scene.getObjectByName( e ).material.color = new THREE.Color( 255, 0, 0 )
    });
    ["3_13","0_7","5_16","2_10","4_14","1_9"].forEach( e =>{
        mol3d.scene.getObjectByName( e ).material.color = new THREE.Color( 0, 0, 255 )
    });

})

//////Show labels on hover//////
d3.select( document ).on( "3DMouseover.labels", function(){

    if( !grabbed ){

        if( d3.event.detail.objects.length > 0 ){
            [0,1,2,3,4,5].forEach( el => {
                mol3d.labels.push( d3.select( mol3d.container ).append( "p" ).attr( "class", "label" ).attr( "id", "label" + el ).html( el + 1 ).datum( {object: mol3d.scene.getObjectByName( +el )} ) )
            })
        } else{
            while( mol3d.labels.length > 0 ){
                mol3d.labels.pop().remove();
            }
        }

    }

})

//////MOUSEDOWN//////
d3.selectAll( ".dragBox" ).on( "mousedown", function(){

    mol3d.showH( true );
    grabbed = true;

    var substituent = d3.select( this ).datum();

    group = mol3d.genGroup( mol3d.parse( substituent.molfile ) );

    //////Modify snapping bond//////
    const bond = new THREE.Geometry();
    const vec = new THREE.Vector3().copy( group.getObjectByName( +substituent.replaceBond.split( "_" )[1] ).position ).sub( group.getObjectByName( +substituent.replaceBond.split( "_" )[0] ).position )
    bond.merge( new THREE.TubeGeometry(
        new THREE.LineCurve3(
            group.getObjectByName( +substituent.replaceBond.split( "_" )[0] ).position,
            new THREE.Vector3().copy( group.getObjectByName( +substituent.replaceBond.split( "_" )[0] ).position ).addScaledVector( vec, 0.4 ),
            ), 0, .05, 14, false )
    );
    bond.merge( new THREE.TubeGeometry(
        new THREE.LineCurve3(
            new THREE.Vector3().copy( group.getObjectByName( +substituent.replaceBond.split( "_" )[0] ).position ).addScaledVector( vec, 0.5 ),
            new THREE.Vector3().copy( group.getObjectByName( +substituent.replaceBond.split( "_" )[0] ).position ).addScaledVector( vec, 0.7 ),
            ), 0, .05, 14, false )
    );
    bond.merge( new THREE.TubeGeometry(
        new THREE.LineCurve3(
            new THREE.Vector3().copy( group.getObjectByName( +substituent.replaceBond.split( "_" )[0] ).position ).addScaledVector( vec, 0.8 ),
            new THREE.Vector3().copy( group.getObjectByName( +substituent.replaceBond.split( "_" )[0] ).position ).addScaledVector( vec, 0.9 ),
            ), 0, .05, 14, false )
    );

    const fadeBond = new THREE.Mesh( bond, new THREE.MeshToonMaterial( {color: 0xffff00} ) );
    fadeBond.name = "fadeBond";
    group.add( fadeBond );

    group.remove( group.getObjectByName( +substituent.replaceBond.split( "_" )[1] ) );


    //////Snap central atom to mouse//////
    group.position.sub( group.children[0].position );
    group = new THREE.Group().add( group );
    var quatOrig = new THREE.Quaternion().setFromUnitVectors(
        group.up,
        new THREE.Vector3().copy( group.getObjectByName( substituent.replaceBond ).userData.source.start.HTML.position ).sub( group.getObjectByName( substituent.replaceBond ).userData.source.end.HTML.position ).normalize()
    );
    group.setRotationFromQuaternion( quatOrig );

    var mousePos = new THREE.Vector3( mol3d.mouse.x, mol3d.mouse.y, 0 );
    mousePos.unproject( mol3d.camActive );
    group.position.copy( mol3d.camActive.position ).add( new THREE.Vector3().copy( mousePos ).sub( mol3d.camActive.position ).multiplyScalar( 4 ) );

    group.children[0].remove( group.getObjectByName( substituent.replaceBond ) );
    mol3d.scene.add( group );

    var widthHalf = mol3d.container.getBoundingClientRect().width/2;
    var heightHalf = mol3d.container.getBoundingClientRect().height/2;

    //////Add labels//////
    for( var i = 0; i < 6; i++ ){
        mol3d.labels.push( d3.select( ".view3D" ).append( "p" ).attr( "class", "label" ).attr( "id", "label" + i).html( i + 1 ).datum( {object: mol3d.scene.getObjectByName( i ) } ) );
    }

    var snapTarget = null;
    var fadeGroup = null;

    //////On atom mouseover//////
    d3.select( document ).on( "3DMouseover.snapSub", function(){

        let ev = d3.event.detail;


        //////Hovered a hydrogen//////
        if( ev.objects.length > 0 ? ev.objects[0].object.userData.tooltip === "H" : false ){

            snapTarget = ev.objects[0].object;

            //////Set position//////
            group.position.copy( snapTarget.position );

            //////Set rotation//////
            var quatFin = new THREE.Quaternion().setFromUnitVectors( new THREE.Vector3( 0, 1, 0 ).applyQuaternion( quatOrig ), new THREE.Vector3().copy( snapTarget.position ).sub( snapTarget.userData.source.bondedTo[0].el.HTML.position ).normalize() )
            var quatFrom = new THREE.Quaternion().copy( group.quaternion )
            d3.transition()
                .duration( 200 )
                .tween( null, () => function( t ){
                    if( t > 0.9 ){
                        //////Hide overlapping atoms//////
                        group.getObjectByName( "fadeBond" ).visible = false;
                    }
                    THREE.Quaternion.slerp( quatFrom, quatFin, group.quaternion, t );
                } )

            //////Flash Label//////
            var blinkLabel = function(){
                if( snapTarget ){
                    d3.select( "#label" + snapTarget.userData.source.bondedTo[0].el.index )
                        .transition()
                        .duration( 200 )
                        .style( "opacity", 0.1 )
                        .transition()
                        .duration( 200 )
                        .style( "opacity", 1 )
                        .on( "end", blinkLabel )
                }
            }
            //////Dim attached group//////
            if( snapTarget.userData.attached ){
                fadeGroup = snapTarget.userData.attached.children[0];
                d3.select( ".page" ).transition()
                    .duration( 500 )
                    .tween( null, () => function( t ){
                            fadeGroup.traverse( obj => {
                                if( obj.type === "Mesh" ){
                                    obj.material.transparent = true;
                                    obj.material.opacity = 1 - t*0.9;
                                }
                            } )
                        } )
            } else{
                if( fadeGroup ){
                    fadeGroup.traverse( obj => {
                        if( obj.type === "Mesh" ){
                            obj.material.opacity = 1;
                        }
                    } )
                }
                fadeGroup = null;
            }

            blinkLabel();

        //////Un-hovered//////
        } else{

            snapTarget = null;

            var quatFrom = new THREE.Quaternion().copy( group.quaternion );

            d3.transition()
                .duration( 200 )
                .tween( null, () => function( t ){
                    THREE.Quaternion.slerp( quatFrom, quatOrig, group.quaternion, t );

                    if( fadeGroup ){
                        fadeGroup.traverse( obj => {
                            if( obj.type === "Mesh" ){
                                obj.material.transparent = true;
                                obj.material.opacity = t*0.9 + 0.1;
                            }
                        } )
                    }
                } )
                .on( "end", () => { fadeGroup = null;} )

            //////Show overlapping atoms//////
            group.getObjectByName( "fadeBond" ).visible = true;
        }

    })

    //////MOUSEMOVE//////
    d3.select( ".page" ).on( "mousemove.dragGroup", function(){

        if( snapTarget === null ){
            var mousePos = new THREE.Vector3( mol3d.mouse.x, mol3d.mouse.y, 0 );
            mousePos.unproject( mol3d.camActive );
            group.position.copy( mol3d.camActive.position ).add( new THREE.Vector3().copy( mousePos ).sub( mol3d.camActive.position ).multiplyScalar( 4 ) );
        }

    })

    //////MOUSEUP//////
    d3.select( document ).on( "mouseup", () => {

        d3.select( ".page" ).on( "mousemove.dragGroup", null );
        d3.select( document )
            .on( "3DMouseover.snapSub", null )
            .on( "mouseup", null )
        d3.selectAll( ".label" ).remove();

        if( snapTarget === null ){
            mol3d.scene.remove( group );
        } else {

            snapTarget.userData.source.bondedTo[0].bond.end.element = substituent.smile;
            if( snapTarget.userData.attached ){
                mol3d.scene.remove( snapTarget.userData.attached );
            }

            substituent.smile === "H" && mol3d.scene.remove( group );
            mol[snapTarget.userData.source.bondedTo[0].el.index][1].index = substituent.smile === "H" ? null : snapTarget.userData.source.index;
            mol[snapTarget.userData.source.bondedTo[0].el.index][1].smile = substituent.smile;
            snapTarget.userData.attached = substituent.smile === "H" ? null : group;

        }

        mol3d.showH( false );
        grabbed = false;

    })
})

//////Generates
function addSubstituents(){

    var subs = [
        {name: "Amine", smile: "N",  replaceBond: "0_1", img: "img/NH2.png", molfile: `H3N
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
        `}, {name: "Bromine", smile: "Br", replaceBond: "0_1", img: "img/Br.png", molfile: `BrH
            APtclcactv06071809213D 0   0.00000     0.00000

              2  1  0  0  0  0  0  0  0  0999 V2000
               -0.0188    0.0000    0.0000 Br  0  0  0  0  0  0  0  0  0  0  0  0
                1.4912    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
              1  2  1  0  0  0  0
            M  END
            $$$$
        `}, {name: "Phenyl", smile: "c1ccccc1", replaceBond: "0_6", img: "img/Phenyl.png", molfile: `C6H6
            APtclcactv06061809523D 0   0.00000     0.00000

             7  7  0  0  0  0  0  0  0  0999 V2000
                0.1641   -1.3726   -0.0002 C   0  0  0  0  0  0  0  0  0  0  0  0
               -1.1066   -0.8284    0.0001 C   0  0  0  0  0  0  0  0  0  0  0  0
               -1.2707    0.5442   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
               -0.1641    1.3726    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
                1.1066    0.8284    0.0006 C   0  0  0  0  0  0  0  0  0  0  0  0
                1.2707   -0.5442   -0.0007 C   0  0  0  0  0  0  0  0  0  0  0  0
                0.2923   -2.4449    0.0044 H   0  0  0  0  0  0  0  0  0  0  0  0
              1  2  1  0  0  0  0
              2  3  2  0  0  0  0
              3  4  1  0  0  0  0
              4  5  2  0  0  0  0
              5  6  1  0  0  0  0
              1  6  2  0  0  0  0
              1  7  1  0  0  0  0
            M  END
            $$$$
        `}, {name: "Methyl", smile: "C", replaceBond: "0_1", img: "img/Methyl.png", molfile: `CH4
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
        `}, {name: "Hydroxyl", smile: "O", replaceBond: "0_1", img: "img/Hydroxyl.png", molfile: `H2O
            APtclcactv06071810163D 0   0.00000     0.00000

              3  2  0  0  0  0  0  0  0  0999 V2000
               -0.0000   -0.0589   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
               -0.8110    0.4677    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
                0.8110    0.4677    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
              1  2  1  0  0  0  0
              1  3  1  0  0  0  0
            M  END
            $$$$
        `}, {name: "t-Butyl", smile: "C(C)(C)C", replaceBond: "0_1", img: "img/tButyl.png", molfile: `C4H10
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
        `}, {name: "Reset", smile: "H", replaceBond: "0_1", img: "img/H.png", molfile: `H2
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
        let frame = d3.select( "#drag" + ( i + 1 ) ).datum( el );
        frame.append( "p" ).html( el.name );
        frame.append( "img" ).attr( "class", "substituentImage" ).attr( "src", el.img );

    } )

}

function genSmile(){
    result = new OCL.Molecule.fromSmiles( "C1CCCCC1" )
    result.addImplicitHydrogens()
    console.log( mol )
    for( var i = 0; i < mol.length; i++ ){
        for( var j = 1; j < mol[i].length; j++ ){
            if( mol[i][j].index !== null ){
                result.deleteAtom( mol[i][j].index );
                fragment = new OCL.Molecule.fromSmiles( mol[i][j].smile );
                fragment.setFragment( true );
                subIndices = result.addSubstituent( fragment, 0 );
                result.addBond( mol[i][0].index, subIndices[0], 1 );
            }
        }
    }

    console.log( result.toSmiles() )
    while( mol3d.scene.children.length > 1 ){
        mol3d.scene.children.pop();
    }

    mol3d.getFromSMILE( result.toSmiles() );

}

function draw2D(){

    if( !d3.select( ".view2D" ).empty() ){ d3.select( ".view2D" ).remove() }

    var hexPoints = [[0, 0],[86.6, 50],[86.6, 150],[0, 200],[-86.6, 150],[-86.6, 50],[0, 0]];
    var groups = Array( 6 ).fill( 0 )
    for( var i = 0; i < groups.length; i++ ){
        console.log( groups )
        var rnd = Math.floor( Math.random() * 6 );
        while( groups.filter( e => e === rnd ).length > 1 ){
            rnd = Math.floor( Math.random() * 6 );
        }
        groups[i] = rnd;

    }
    groups = groups.sort( ( a, b ) => a > b );
    var length = 50;
    var width = 10;
    var subs = ["Ph","NH2","Me","Br","OH","tB"];
    var wedgeBond = `<polygon id="" points="0,0 ` + length + `,` + width + ` ` + length + `,` + -width + `"></polygon>`;
    var hashBond = `<line class="bond" x1="` + 0*length/5 + `" x2="` + 0*length/5 + `" y1="` + 1*width/6 + `" y2="` + -1*width/6 + `"></line>
            <line class="bond" x1="` + 1*length/5 + `" x2="` + 1*length/5 + `" y1="` + 2*width/6 + `" y2="` + -2*width/6 + `"></line>
            <line class="bond" x1="` + 2*length/5 + `" x2="` + 2*length/5 + `" y1="` + 3*width/6 + `" y2="` + -3*width/6 + `"></line>
            <line class="bond" x1="` + 3*length/5 + `" x2="` + 3*length/5 + `" y1="` + 4*width/6 + `" y2="` + -4*width/6 + `"></line>
            <line class="bond" x1="` + 4*length/5 + `" x2="` + 4*length/5 + `" y1="` + 5*width/6 + `" y2="` + -5*width/6 + `"></line>
            <line class="bond" x1="` + 5*length/5 + `" x2="` + 5*length/5 + `" y1="` + 6*width/6 + `" y2="` + -6*width/6 + `"></line>
        `;

    svg = d3.select( ".page" ).append( "svg" ).attr( "class", "view2D" )
    var grp = svg.append( "g" ).attr( "transform", "translate( 300, 100 )scale( 1 )" )
    grp.append( "path" ).attr( "d", "M " + hexPoints[0].join( " " ) + " L " + hexPoints[1].join( " " ) + " L " + hexPoints[2].join( " " ) + " L " + hexPoints[3].join( " " ) + " L " + hexPoints[4].join( " " ) + " L " + hexPoints[5].join( " " ) + " L " + hexPoints[0].join( " " ) );

    for( var i = 0; i < groups.length; i++ ){

        var rnd = Math.random();
        var el = groups[i]
        var angle = Math.atan2( hexPoints[el + 1][1] - hexPoints[el][1], hexPoints[el + 1][0] - hexPoints[el][0] )*180/Math.PI;

        if( groups.filter( e => e === el ).length > 1 ){

            grp.append( "g" ).html( rnd > 0.5 ? hashBond : wedgeBond ).attr( "transform", "translate(" + hexPoints[el][0] + "," + hexPoints[el][1] + ")rotate(" + ( angle - 90 ) + ")" )
            grp.append( "text" ).text( "OH" ).attr( "x", hexPoints[el][0] + length*Math.cos( angle*Math.PI/180 - Math.PI/2 )*1.1 ).attr( "y", hexPoints[el][1] + Math.sin( angle*Math.PI/180 - Math.PI/2 )*1.1 )

            grp.append( "g" ).html( rnd > 0.5 ? wedgeBond : hashBond ).attr( "transform", "translate(" + hexPoints[el][0] + "," + hexPoints[el][1] + ")rotate(" + ( angle - 150 ) + ")" );
            i++;

        } else {

            grp.append( "g" ).html( rnd > 0.5 ? wedgeBond : hashBond ).attr( "transform", "translate(" + hexPoints[el][0] + "," + hexPoints[el][1] + ")rotate(" + ( angle - 120 ) + ")" );
        }

    }

    //mol2d = new Mol2D( d3.select( ".page" ), [250,250,0,0] );
    //mol2d.getFromSMILE( "C1C(C)CCC(C)C1" );
    //mol2d.draw();
}
