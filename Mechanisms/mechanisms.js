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
				var svg = d3.select( "#view2D > #rootframe" );
				var screenScale = svg.node().getBoundingClientRect().width / d3.select( "#view2D" ).node().viewBox.baseVal.width;

				var d = svg.datum();

				svg.transition()
					.duration( 300 )
					.ease( d3.easeCircleOut )
					.attr( "transform", d3.event.transform )
})

periodicTable = [["?",[0]],["H",[1]],
	["He",[0]],["Li",[1]],["Be",[2]],["B",[3]],["C",[4]],["N",[3]],["O",[2]],["F",[1]],["Ne",[0]],["Na",[1]],["Mg",[2]],["Al",[3]],["Si",[4]],["P",[3,5]],["S",[2,4,6]],["Cl",[1,3,5,7]],["Ar",[0]],["K",[1]],["Ca",[2]],["Sc",[0]],["Ti",[0]],["V",[0]],["Cr",[0]],["Mn",[0]],["Fe",[0]],["Co",[0]],["Ni",[0]],["Cu",[0]],["Zn",[0]],["Ga",[2,3]],["Ge",[2,4]],["As",[3,5]],["Se",[2,4,6]],["Br",[1,3,5,7]],["Kr",[0,2]],["Rb",[1,2,3,4]],["Sr",[2]],["Y",[0]],["Zr",[0]],["Nb",[0]],["Mo",[0]],["Tc",[0]],["Ru",[0]],["Rh",[0]],["Pd",[0]],["Ag",[0]],["Cd",[0]],["In",[1,2,3]],["Sn",[2,4]],["Sb",[3,5]],["Te",[2,4,6]],["I",[1,3,5,7]],["Xe",[0,2,4,6]],["Cs",[1]],["Ba",[2]],["La",[0]],["Ce",[0]],["Pr",[0]],["Nd",[0]],["Pm",[0]],["Sm",[0]],["Eu",[0]],["Gd",[0]],["Tb",[0]],["Dy",[0]],["Ho",[0]],["Er",[0]],["Tm",[0]],["Yb",[0]],["Lu",[0]],["Hf",[0]],["Ta",[0]],["W",[0]],["Re",[0]],["Os",[0]],["Ir",[0]],["Pt",[0]],["Au",[0]],["Hg",[0]],["Tl",[0]],["Pb",[0]],["Bi",[0]],["Po",[0]],["At",[0]],["Rn",[0]],["Fr",[0]],["Ra",[0]],["Ac",[0]],["Th",[0]],["Pa",[0]],["U",[0]],["Np",[0]],["Pu",[0]],["Am",[0]],["Cm",[0]],["Bk",[0]],["Cf",[0]],["Es",[0]],["Fm",[0]],["Md",[0]],["No",[0]],["Lr",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["R4",[0]],["R5",[0]],["R6",[0]],["R7",[0]],["R8",[0]],["R9",[0]],["R10",[0]],["R11",[0]],["R12",[0]],["R13",[0]],["R14",[0]],["R15",[0]],["R16",[0]],["R1",[0]],["R2",[0]],["R3",[0]],["A",[0]],["A1",[0]],["A2",[0]],["A3",[0]],["??",[0]],["??",[0]],["D",[0]],["T",[0]],["X",[0]],["R",[0]],["H2",[0]],["H+",[0]],["Nnn",[0]],["HYD",[0]],["Pol",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["??",[0]],["Ala",[2]],["Arg",[2]],["Asn",[2]],["Asp",[2]],["Cys",[3]],["Gln",[2]],["Glu",[2]],["Gly",[2]],["His",[2]],["Ile",[2]],["Leu",[2]],["Lys",[2]],["Met",[2]],["Phe",[2]],["Pro",[2]],["Ser",[2]],["Thr",[2]],["Trp",[2]],["Tyr",[2]],["Val",[2]]]

var string = "CC(=O)C.[C-]#N" //"CC(C)(O1)C[C@@H](O)[C@@]1(O2)[C@@H](C)[C@@H]3CC=C4[C@]3(C2)C(=O)C[C@H]5[C@H]4CC[C@@H](C6)[C@]5(C)Cc(n7)c6nc(C[C@@]89(C))c7C[C@@H]8CC[C@@H]%10[C@@H]9C[C@@H](O)[C@@]%11(C)C%10=C[C@H](O%12)[C@]%11(O)[C@H](C)[C@]%12(O%13)[C@H](O)C[C@@]%13(C)CO.[Br-]"//"N[C@H](C)C(=O)O"//"CCO[C+3](\C=C(/C)OC)C(=O)[Pb]CC=C=O"//"C[C@H](N)C(O)=O"//"CC1CCC/C(C)=C1/C=C/C(C)=C/C=C/C(C)=C/C=C/C=C(C)/C=C/C=C(C)/C=C/C2=C(C)/CCCC2(C)C"//"CC1=CN(C)=CC=C1"//
string = string.split( "." )

d3.select( "svg" ).append( "rect" ).attr( "x", 0 ).attr( "y", 0 ).attr( "width", 500 ).attr( "height", 400 ).attr( "fill-opacity", 0 ).attr( "class", "mouseCapture" ).lower()

var tmp = document.createElement("div")

function genHead(arrow){
	var arrowLength = 6
	var arrowWidth = 3
	var root = arrow.node().getPointAtLength(arrow.node().getTotalLength()-arrowLength)
	var tips = arrow.node().getPointAtLength(arrow.node().getTotalLength()-arrowLength - 5)
	var tar = arrow.node().getPointAtLength(arrow.node().getTotalLength())
	var headangle = Math.atan2(tar.y-root.y,tar.x-root.x)
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
			var down = d3.mouse( d3.select( "#rootframe" ).node() );
			var frm = d3.mouse( d3.select( "#rootframe" ).node() );
			var to = d3.mouse( d3.select( "#rootframe" ).node() );
			var root = arrows.append( "g" ).attr( "class", "arrow" ).attr( "id", num );
			var arrow = root.append( "path" ).attr( "d", "M"+ down[0] + "," + down[1] ).attr( "fill", "none" )
			num = num + 1
			d3.select( window )
				.on("mousemove", function(){
					to = d3.mouse(d3.select("#rootframe").node())
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
						arrow.attr("d","M" + frm[0] + "," + frm[1] + "Q" + arrowmid.x + "," + arrowmid.y + "," + to[0] + "," + to[1]).datum( { cf:cf, start: d3.select( downEvt.target.parentNode ).datum(), end: d3.select( d3.event.target.parentNode ).datum () } );
						genHead(arrow);
						processStep( arrow );
					}

				})
			break;
	}
}

function processStep( arrow ){
	console.log( arrow );
	console.log( "from: " + arrow.datum().start.el + " to: " + arrow.datum().end.el )
}


electrophile = new Mol2D( d3.select( "#container"), [0,0,3,4], {zoomable: false} );
electrophile.getFromSMILE( string[0], true );
electrophile.draw();
electrophilegroup = d3.select( electrophile.svg.node().childNodes[0] ).append( "g" ).attr( "id", "electrophile" ).attr( "transform", "translate( 0, 0 )" ).datum( electrophile ).node();
electrophilegroup.appendChild( electrophile.svg.node().childNodes[0].childNodes[0] );
electrophilegroup.appendChild( electrophile.svg.node().childNodes[0].childNodes[0] );

nucleophile = new Mol2D( electrophile.svg , [0,0,250,225] );
nucleophile.getFromSMILE( string[1], true );
nucleophileEl = nucleophile.draw();
nucleophile.svg.remove();

nucleophilegroup = d3.select( electrophile.svg.node().childNodes[0] ).append( "g" ).attr( "id", "nucleophile" ).attr( "transform", "translate( 0, 80 )" ).datum( nucleophile ).node();
nucleophilegroup.appendChild( nucleophileEl.node().childNodes[0] )
nucleophilegroup.appendChild( nucleophileEl.node().childNodes[0] )

var arrows = d3.select( "#rootframe" ).append( "g" ).attr( "id", "arrowgroup" ).raise()

electrophile.fitToScreen()

var num = 0

d3.selectAll(".highlight")
	.on("mousedown", handleMouse, true)
