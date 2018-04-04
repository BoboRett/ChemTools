function ButtonGen(root,id,x,y,rx,ry,w,h,text,onclick){ //Button template
	var tmp = root.append("g").attr("class","button").attr("id",id)
	var bg = tmp.append("rect")
		.attr("x",x)
		.attr("y",y)
		.attr("rx",rx)
		.attr("ry",ry)
		.attr("width",w)
		.attr("height",h)
		.attr("onclick",onclick)
	var txt = tmp.append("text")
		.attr("x",x+w/2)
		.attr("y",y+2.4+h/2)
		.text(text)
}
function LineGen(root,cls,id,x1,x2,y1,y2,attributes,styles){ //Line template
	var tmp = root.append("line")
		.attr("class",cls)
		.attr("id",id)
		.attr("x1",x1)
		.attr("x2",x2)
		.attr("y1",y1)
		.attr("y2",y2)
	for(attribute of attributes){
		tmp.attr(attribute[0],attribute[1])
	}
	for(style of styles){
		tmp.style(style[0],style[1])
	}
	return tmp
}
function TextGen(root,cls,id,x,y,text,attributes,styles){ //Text template
	var tmp = root.append("text")
		.attr("class",cls)
		.attr("id",id)
		.attr("x",x)
		.attr("y",y)
		.text(text)
	for(attribute of attributes){
		tmp.attr(attribute[0],attribute[1])
	}
	for(style of styles){
		tmp.style(style[0],style[1])
	}
	return tmp
}

var zoomFunc = d3.zoom().on( "zoom", function(){
	d3.select( this.childNodes[0] ).transition()
		.duration( 300 )
		.ease( d3.easeCircleOut )
		.attr( "transform", d3.event.transform )
})

function toggleZoom( checked ){
	if( checked ){
		zoomFunc.filter( function(){ return !d3.event.button } );
		d3.selectAll(".highlight").on("mousedown.arrow", null )
	} else{
		zoomFunc.filter( () => false );
		d3.selectAll(".highlight").on("mousedown.arrow", handleMouse )
	}
}

periodicTable = [["?",[0]],["H",[1]],
	["He",[0]],["Li",[1]],["Be",[2]],["B",[3]],["C",[4]],["N",[3]],["O",[2]],["F",[1]],["Ne",[0]],["Na",[1]],["Mg",[2]],["Al",[3]],["Si",[4]],["P",[3,5]],["S",[2,4,6]],["Cl",[1,3,5,7]],["Ar",[0]],["K",[1]],["Ca",[2]],["Sc",[0]],["Ti",[0]],["V",[0]],["Cr",[0]],["Mn",[0]],["Fe",[0]],["Co",[0]],["Ni",[0]],["Cu",[0]],["Zn",[0]],["Ga",[2,3]],["Ge",[2,4]],["As",[3,5]],["Se",[2,4,6]],["Br",[1,3,5,7]],["Kr",[0,2]],["Rb",[1,2,3,4]],["Sr",[2]],["Y",[0]],["Zr",[0]],["Nb",[0]],["Mo",[0]],["Tc",[0]],["Ru",[0]],["Rh",[0]],["Pd",[0]],["Ag",[0]],["Cd",[0]],["In",[1,2,3]],["Sn",[2,4]],["Sb",[3,5]],["Te",[2,4,6]],["I",[1,3,5,7]],["Xe",[0,2,4,6]],["Cs",[1]],["Ba",[2]],["La",[0]],["Ce",[0]],["Pr",[0]],["Nd",[0]],["Pm",[0]],["Sm",[0]],["Eu",[0]],["Gd",[0]],["Tb",[0]],["Dy",[0]],["Ho",[0]],["Er",[0]],["Tm",[0]],["Yb",[0]],["Lu",[0]],["Hf",[0]],["Ta",[0]],["W",[0]],["Re",[0]],["Os",[0]],["Ir",[0]],["Pt",[0]],["Au",[0]],["Hg",[0]],["Tl",[0]],["Pb",[0]],["Bi",[0]],["Po",[0]],["At",[0]],["Rn",[0]],["Fr",[0]],["Ra",[0]],["Ac",[0]],["Th",[0]],["Pa",[0]],["U",[0]],["Np",[0]],["Pu",[0]],["Am",[0]],["Cm",[0]],["Bk",[0]],["Cf",[0]],["Es",[0]],["Fm",[0]],["Md",[0]],["No",[0]],["Lr",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["R4",[0]],["R5",[0]],["R6",[0]],["R7",[0]],["R8",[0]],["R9",[0]],["R10",[0]],["R11",[0]],["R12",[0]],["R13",[0]],["R14",[0]],["R15",[0]],["R16",[0]],["R1",[0]],["R2",[0]],["R3",[0]],["A",[0]],["A1",[0]],["A2",[0]],["A3",[0]],["??",[0]],["??",[0]],["D",[0]],["T",[0]],["X",[0]],["R",[0]],["H2",[0]],["H+",[0]],["Nnn",[0]],["HYD",[0]],["Pol",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["Ala",[2]],["Arg",[2]],["Asn",[2]],["Asp",[2]],["Cys",[3]],["Gln",[2]],["Glu",[2]],["Gly",[2]],["His",[2]],["Ile",[2]],["Leu",[2]],["Lys",[2]],["Met",[2]],["Phe",[2]],["Pro",[2]],["Ser",[2]],["Thr",[2]],["Trp",[2]],["Tyr",[2]],["Val",[2]]]

var smile = "CC(=O)C.[C-]#N" //"CC(C)(O1)C[C@@H](O)[C@@]1(O2)[C@@H](C)[C@@H]3CC=C4[C@]3(C2)C(=O)C[C@H]5[C@H]4CC[C@@H](C6)[C@]5(C)Cc(n7)c6nc(C[C@@]89(C))c7C[C@@H]8CC[C@@H]%10[C@@H]9C[C@@H](O)[C@@]%11(C)C%10=C[C@H](O%12)[C@]%11(O)[C@H](C)[C@]%12(O%13)[C@H](O)C[C@@]%13(C)CO.[Br-]"//"N[C@H](C)C(=O)O"//"CCO[C+3](\C=C(/C)OC)C(=O)[Pb]CC=C=O"//"C[C@H](N)C(O)=O"//"CC1CCC/C(C)=C1/C=C/C(C)=C/C=C/C(C)=C/C=C/C=C(C)/C=C/C=C(C)/C=C/C2=C(C)/CCCC2(C)C"//"CC1=CN(C)=CC=C1"//


function genHead(arrow){
	var arrowLength = 6
	var arrowWidth = 3
	var root = arrow.node().getPointAtLength(arrow.node().getTotalLength()-arrowLength)
	var tips = arrow.node().getPointAtLength(arrow.node().getTotalLength()-arrowLength - 5)
	var tar = arrow.node().getPointAtLength(arrow.node().getTotalLength())
	var headangle = Math.atan2(tips.y-root.y,tips.x-root.x)
	d3.select(arrow.node().parentNode).append("path").attr("d",
							"M" + root.x + "," + root.y +
							"L" + (tips.x+arrowWidth*Math.cos(headangle+Math.PI/2)) + "," + (tips.y+arrowWidth*Math.sin(headangle+Math.PI/2)) +
							"L" + tar.x + "," + tar.y +
							"L" + (tips.x+arrowWidth*Math.cos(headangle-Math.PI/2)) + "," + (tips.y+arrowWidth*Math.sin(headangle-Math.PI/2)) +
							"L" + root.x + "," + root.y
							);
}

function handleMouse(){
	switch( d3.event.button ){
		case 0:
			var downEvt = d3.event;
			var down = d3.mouse( d3.select( "[id='" + activeLevel + "']" ).node() );
			var frm = d3.mouse( d3.select( "[id='" + activeLevel + "']" ).node() );
			var to = d3.mouse( d3.select( "[id='" + activeLevel + "']" ).node() );
			var root = arrows.append( "g" ).attr( "class", "arrow" ).attr( "id", num );
			var arrow = root.append( "path" ).attr( "d", "M"+ down[0] + "," + down[1] ).attr( "fill", "none" )
			num = num + 1
			d3.select( window )
				.on("mousemove", function(){
					to = d3.mouse( d3.select( "[id='" + activeLevel + "']" ).node() )
					if(Math.abs(down[0] - to[0]) > 1 || Math.abs(down[1] - to[1]) > 1){
						down = to
						arrow.attr("d",arrow.attr("d") + ",L" + to[0] + "," + to[1])
					}
				})
				.on("mouseup", function(){
					d3.select( window ).on("mousemove",null)
					d3.select( window ).on("mouseup",null)

					if(arrow.node().getTotalLength() < 20){
						var clicked = d3.event.target.parentNode.childNodes[0]
						console.log( clicked )
						if( clicked.tagName == "g" ){
							d3.select( clicked ).attr( "display", ( d3.select( clicked ).attr( "display" ) == "none" ? "all" : "none" ) )
						}
						num = num - 1
						root.remove()
					}
					else{
						var pathmid = arrow.node().getPointAtLength( arrow.node().getTotalLength() / 2 );  //control point
						var linemid = {x: frm[0] + ( to[0] - frm[0] ) / 2, y: frm[1] + ( to[1] - frm[1] ) / 2};
						var cf = Math.hypot( linemid.x - pathmid.x, linemid.y - pathmid.y ); //curve factor
						var normangle = Math.atan2( pathmid.y - linemid.y, pathmid.x - linemid.x )
						var arrowmid = {x: linemid.x + 2*cf*Math.cos( normangle ), y: linemid.y + 2*cf*Math.sin( normangle )};
						arrow.attr("d","M" + frm[0] + "," + frm[1] + "Q" + arrowmid.x + "," + arrowmid.y + "," + to[0] + "," + to[1]).datum( { cf:cf, start: d3.select( downEvt.target.parentNode ).datum(), end: d3.select( d3.event.target.parentNode ).datum() } );
						genHead(arrow);
						processStep( arrow );
					}

				})
			break;
	}
}

function processStep( arrow ){
	console.log( "from: ", arrow.datum().start, " to: ", arrow.datum().end )
	result = new OCL.Molecule.fromSmiles( smile )
	result.addImplicitHydrogens()

	if( arrow.datum().end.hasOwnProperty( "claimed" ) ){ //////TO BOND//////
		console.log( "Invalid Action" )
		return false
	}
	else if( arrow.datum().start.hasOwnProperty( "claimed" ) ){ //////BOND TO ATOM//////
		var string = arrow.datum().start.type.slice(0,1) + " BOND " + arrow.datum().start.start.element + "-" + arrow.datum().start.end.element + " breaks, donating electrons to " + arrow.datum().end.element + arrow.datum().end.index
		result.setBondType( arrow.datum().start.index, arrow.datum().start.type.split( "_" )[0] - 1 )
	} else{ //////ATOM TO ATOM//////
		var string = "ATOM " + arrow.datum().start.element + arrow.datum().start.index + " donates electrons to ATOM " + arrow.datum().end.element + arrow.datum().end.index

		var bond = findBond( arrow.datum().start, arrow.datum().end )
		console.log( bond )
		if( bond ){
			var type = +bond.type.split("_")[0] + 1;
			if( type > 3 ){
				console.log( "Invalid Action" )
				return false
			} else{
				type = type === 1 ? 1 : ( type === 2 ? 2 : 4 )
				result.setBondType( bond.index, type )
			}
		} else{
			result.addBond( arrow.datum().start.index, arrow.datum().end.index )
		}
	}
	for( var i = 0; i < result.a.d; i++ ){
		result.setAtomCharge( i, 0 )
		result.setAtomCharge( i, -result.getLowestFreeValence( i ) )
	}

	d3.select( "#steps" ).append( "p" ).html( string ).on( "mouseover", function(){hoverfn( this, true )} ).on ( "mouseout", function(){hoverfn( this, false )} ).attr( "level", activeLevel )

	function hoverfn( el, on ){
		//d3.select( arrow.datum().start.highlight ).attr( "class", ( on ? "highlight_hover" : "highlight" ) )
		//d3.select( arrow.datum().end.highlight ).attr( "class", ( on ? "highlight_hover" : "highlight" ) )

		d3.select( "#mol" + activeLevel ).attr( "display", ( on ? "none" : "all" ) )
		d3.select( "#mol" + d3.select( el ).attr( "level" )  ).attr( "display", ( on ? "all" : "none" ) )
		fitToScreen( root );
	}

	function findBond( start, end ){
		for( bond of d3.select( "#mol" + activeLevel ).datum().molecule.bonds ){
			if( ( bond.start === start && bond.end === end ) || ( bond.start === end && bond.end === start ) ){
				return bond
			}
		}
	}

	smile = result.toSmiles()
	d3.select( "#mol" + activeLevel ).attr( "display", "none" )
	activeLevel++

	drawMolecule( smile, activeLevel )
	//newMoleculeLayer( drawMolecule( smile, activeLevel ) )

}

function fitToScreen( svg ){

	const rootBox = svg.node().getBBox()
	const viewBox = d3.select( "#view2d" ).node().viewBox.baseVal
	const zoom = rootBox.width > rootBox.height ? viewBox.width/rootBox.width : viewBox.height/rootBox.height

	d3.select( svg.node().parentNode ).call(
		zoomFunc.transform,
		d3.zoomIdentity.translate( viewBox.width/2 + ( - rootBox.x - rootBox.width/2 )*zoom, viewBox.height/2 + ( - rootBox.y - rootBox.height/2 )*zoom ).scale( zoom )
	)

}

function drawMolecule( string, level ){

	molSVG = new Mol2D( d3.select( "body" ), [0, 0, 3, 4], {zoomable:false} );
	molSVG.getFromSMILE( string, true );
	var el = molSVG.draw().attr( "id", "mol" + level ).datum( molSVG );
	molSVG.showH( false );
	arrows = el.append( "g" ).attr( "id", "arrowgroup" ).raise()
	root.node().appendChild( el.node() );
	molSVG.svg.remove();

	fitToScreen( root );
	toggleZoom( false );

	num = 0

	return el

}

function newMoleculeLayer( newSVG ){

	var oldSVG = d3.select( "#mol" + ( activeLevel - 1 ) );
	console.log( oldSVG.datum(), newSVG.datum() )

	for( atom of newSVG.datum().molecule.atoms ){
		console.log( atom );
		d3.select( "#" + newSVG.attr( "id" ) + " > .atoms > [id='" + atom.index + "']" )
			.attr( "transform", "translate(" + ( atom.pos[0] - oldSVG.datum().molecule.atoms[atom.index].pos[0] ) + "," + ( atom.pos[1] - oldSVG.datum().molecule.atoms[atom.index].pos[1] ) + ")" )
			.transition()
			.duration( 1000 )
			.attr( "transform", "translate( 0, 0 )" )
	}

	for( bond of newSVG.datum().molecule.bonds ){
		console.log( bond )
		d3.selectAll( "#" + newSVG.attr( "id" ) + " > .bonds > :nth-child(" + bond.index + ") > line" )
			.attr( "x1", oldSVG.datum().molecule.bonds[bond.index].start.pos[0])
			.attr( "x2", oldSVG.datum().molecule.bonds[bond.index].end.pos[0])
			.attr( "y1", oldSVG.datum().molecule.bonds[bond.index].start.pos[1])
			.attr( "y2", oldSVG.datum().molecule.bonds[bond.index].end.pos[1])
			.transition()
			.duration( 1000 )
			.attr( "x1", newSVG.datum().molecule.bonds[bond.index].start.pos[0])
			.attr( "x2", newSVG.datum().molecule.bonds[bond.index].end.pos[0])
			.attr( "y1", newSVG.datum().molecule.bonds[bond.index].start.pos[1])
			.attr( "y2", newSVG.datum().molecule.bonds[bond.index].end.pos[1])


	}

}

var root = d3.select( "#container" ).append( "svg" ).attr( "viewBox", "0,0,3,4" ).attr( "id", "view2d" ).append( "g" ).attr( "id", "rootframe" ).attr( "transform", "translate(0,0)scale(1)" );
d3.select( "#view2d" ).call( zoomFunc )
var activeLevel = 0

drawMolecule( smile, activeLevel, [[0, 0], [0, 80]] );
