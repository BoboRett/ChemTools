function ButtonGen( root, id, x, y, rx, ry, w, h, text, onclick ){ //Button template
	var tmp = root.append( "g" ).attr( "class", "button" ).attr( "id", id )
	var bg = tmp.append( "rect" )
		.attr( "x", x )
		.attr( "y", y )
		.attr( "rx", rx )
		.attr( "ry", ry )
		.attr( "width", w )
		.attr( "height", h )
		.attr( "onclick", onclick )
	var txt = tmp.append( "text" )
		.attr( "x", x+w/2 )
		.attr( "y", y+2.4+h/2 )
		.text( text )
}
function LineGen( root, cls, id, x1, x2, y1, y2, attributes, styles ){ //Line template
	var tmp = root.append( "line" )
		.attr( "class", cls )
		.attr( "id", id )
		.attr( "x1", x1 )
		.attr( "x2", x2 )
		.attr( "y1", y1 )
		.attr( "y2", y2 )
	for( attribute of attributes ){
		tmp.attr( attribute[0], attribute[1] )
	}
	for( style of styles ){
		tmp.style( style[0], style[1] )
	}
	return tmp
}
function TextGen( root, cls, id, x, y, text, attributes, styles ){ //Text template
	var tmp = root.append( "text" )
		.attr( "class", cls )
		.attr( "id", id )
		.attr( "x", x )
		.attr( "y", y )
		.text( text )
	for( attribute of attributes ){
		tmp.attr( attribute[0], attribute[1] )
	}
	for( style of styles ){
		tmp.style( style[0], style[1] )
	}
	return tmp
}

function buildAxes(){ //Generates axes and ticklines/labels
	interval = 12
	var inc = 0.01 //ticklines
	var major = 0.1 //major labels
	var minor = 0.05 //minor labels
	d3.select( "#xTicks" ).remove()
	d3.select( "#labels" ).remove()
	var tickmarks = d3.select( "#rootframe" ).append( "g" ).attr( "class", "labels" ).attr( "id", "xTicks" ).lower()
	var ticks = d3.range( 150, 300, interval )
	graph_centre = typeof graph_centre=="undefined" ? 0:graph_centre
	var labelr = d3.range( graph_centre, graph_centre-0.2, -inc ).map( function( i ){ return ( Math.round( i*100 )) } )
	var labell = d3.range( graph_centre, graph_centre+0.2, inc ).map( function( i ){ return ( Math.round( i*100 )) } )
	for( var i=0; i<ticks.length; i++ ){
		LineGen( tickmarks, "line", i+"_r", ticks[i], ticks[i], 190, 191, [], [] )
		LineGen( tickmarks, "line", i+"_l", 2*ticks[0]-ticks[i], 2*ticks[0]-ticks[i], 190, 191, [], [] )
		LineGen( tickmarks, "minorline", i+"_r", ticks[i], ticks[i], 5, 190, [["opacity", 0.1]], [] )
		LineGen( tickmarks, "minorline", i+"_l", 2*ticks[0]-ticks[i], 2*ticks[0]-ticks[i], 5, 190, [["opacity", 0.1]], [] )

		if( labelr[i]/( 100*major )%1==0 ){
			d3.select( "#\\3"+String( i ).split( "" ).join( " " )+"_r.line" ).attr( "y2", 193 )
			d3.select( "#\\3"+String( i ).split( "" ).join( " " )+"_r.minorline" ).attr( "opacity", 0.4 )
			TextGen( tickmarks, "graphtext", i+"_r", ticks[i], 200, ( labelr[i]/100 ).toFixed( 2 ), [], [] )
		}
		else if( labelr[i]/( 100*minor )%1==0 ){
			d3.select( "#\\3"+String( i ).split( "" ).join( " " )+"_r.line" ).attr( "y2", 192 )
			d3.select( "#\\3"+String( i ).split( "" ).join( " " )+"_r.minorline" ).attr( "opacity", 0.3 )
			TextGen( tickmarks, "graphtext", i+"_r", ticks[i], 200, labelr[i]/100, [], [] )
		}

		if( labell[i]/( 100*major )%1==0 ){
			d3.select( "#\\3"+String( i ).split( "" ).join( " " )+"_l.line" ).attr( "y2", 193 )
			d3.select( "#\\3"+String( i ).split( "" ).join( " " )+"_l.minorline" ).attr( "opacity", 0.4 )
			TextGen( tickmarks, "graphtext", i+"_l", 2*ticks[0]-ticks[i], 200, ( labell[i]/100 ).toFixed( 2 ), [], [] )
		}
		else if( labell[i]/( 100*minor )%1==0 ){
			d3.select( "#\\3"+String( i ).split( "" ).join( " " )+"_l.line" ).attr( "y2", 192 )
			d3.select( "#\\3"+String( i ).split( "" ).join( " " )+"_l.minorline" ).attr( "opacity", 0.3 )
			TextGen( tickmarks, "graphtext", i+"_l", 2*ticks[0]-ticks[i], 200, ( labell[i]/100 ).toFixed( 2 ), [], [] )
		}
	}
}

function BuildLabels( target, centres ){ //Generates peak labels and lines
	var grp = d3.select( "#rootframe" ).append( "g" ).attr( "class", "labels" ).attr( "id", "tags" )
	var y = 30
	centres = centres.sort( function( a, b ){ return a-b } )
	for( i=0;i<centres.length;i++ ){
		var bool = centres.indexOf( centres[i] )==i
		for( val of centres ){
			if( centres[i]-val!=0 ){
				if( centres[i]-val<=1 && centres[i]-val>0 ){
					bool=false;
					if( centres[i-1]!=null ){
						centres[i-1]=( (centres[i]-centres[i-1] )/2 )+centres[i-1]
					}
				}
			}
		}
		if( bool ){ centres[i]=centres[i]}
		else{ centres[i]=null }
	}
	centres.filter( function( d ){ return d!=null } ).map( function( d, i, self ){
		if( y==30 ){
			if( Math.abs( d-self[i+1] )<4 || Math.abs( d-self[i-1] )<4 ){ y=45 };
		}
		else{ y=30 }
		TextGen( grp, "", "", 0, 0, ( (150-d )/( pph*100 )+graph_centre ).toFixed( 4 ), [["transform", "translate( "+( d+1.6 )+", "+y+" ) rotate( -90 )"]], [] )
		LineGen( grp, "", "", parseFloat( d.toFixed( 1 )), parseFloat( d.toFixed( 1 )), y+9, y+9, [], [] )
	} )

}

function LineBuild( target, centres ){ //Generates data-sets and scalefactor, creates target graph, and animates correct curve
	var graphs = d3.select( "#graphs" )
	d3.select( "#"+target ).remove()
	var xdata = d3.range( 0, 300, 0.1 )
	var ydata = []
	var data = []
	var correctY = []
	line = d3.line()
		.x( function( d ){ return d.x;} )
		.y( function( d ){ return d.y;} )
	for( var i=0; i<xdata.length; i++ ){
		ydata.push( parseFloat( Gaussian( xdata[i], centres, centres.length, 0.6 ).toFixed( 4 )) )
		data.push( {"x":xdata[i].toFixed( 2 ), "y":ydata[i]} )
	}
	if( target=="correct" ){ scalefactor = 120/d3.max( ydata ) }
	else{
		var arr_att=( d3.select( "#attempt" ).data()[0]||data ).map( function( d ){ return d.y } ) //Array of attempt's y-data
		var arr_cor=( d3.select( "#correct" ).data()[0]||[{ x:1, y:1 }] ).map( function( d ){ return d.y } ) //Array of answer's y-data
		scalefactor = ( d3.max( arr_att ) > d3.max( arr_cor ) ? 120/d3.max( arr_att ):120/d3.max( arr_cor ))
		d3.select( "#correct" ).transition().duration( 2300 ).ease( d3.easeCubic )
			.attr( "d", line( d3.select( "#correct" ).data()[0].map( function( d ){ return { x:d.x, y:scalefactor*d.y } } )) )
	}
	graphs.append( "path" )
		.data( [data] )
		.attr( "class", "graphline" )
		.attr( "id", target )
		.attr( "d", line( data.map( function( d ){ return { x:d.x, y:scalefactor*d.y } } )) )
		.attr( "transform", "translate( 300, 180 ) scale( -1 )" )

	if( target=="correct" ){ BuildLabels( target, centres ) }
	d3.select( "#"+target ).attr( "d", line( d3.select( "#"+target ).data()[0].map( function( d ){ return { x:d.x, y:0 } } )) )
	d3.select( "#"+target ).transition().duration( 2300 ).ease( d3.easeCubic )
		.attr( "d", line( d3.select( "#"+target ).data()[0].map( function( d ){ return { x:d.x, y:scalefactor*d.y } } )) )

	d3.selectAll( "#tags > line" ).each( function( d, i ){
		x_1 = d3.select( this ).attr( "x1" )
		d3.select( this ).transition().duration( 2300 ).ease( d3.easeCubic )
			.attr( "y2", 177-d3.select( "#correct" ).data()[0].filter( function( a ){ return a.x==parseFloat( x_1 ) } )[0].y*scalefactor )
	} )

}

function ErrorBuzz( target ){ //Flashes target field red
	var col = target.style( "background-color" )
	target.transition()
		.duration( 200 )
		.style( "background-color", "#4A142B" )
		.transition()
		.delay( 0 )
		.duration( 200 )
		.style( "background-color", "white" )
}

function Gaussian( x, x0, n, width ){	//( x-point, centre, no. of peaks )
	var value = 0
	for( var i=0; i<n; i++ ){
		value += 100*Math.exp( -( Math.pow( x-( x0[i] ), 2 )/( 2*Math.pow( width, 2 )) ))
	}
	return value
}

function getMult(){ //Get multiplicity input and check for errors
	var field = d3.select( "#multiplicity" )
	var input = field.node().value
	if( /( [^dtqnsx] )/.test( input )==true && input!="" ) {
		ErrorBuzz( field )
		field.node().value=input_mult
	}
	input_mult = field.node().value
	return input_mult
}
function getJ(){ //Get J input and check for errors
	var field = d3.select( "#J" )
	var input = field.node().value
	if( /[^0-9, .\s]/.test( input )==true && input!="" ) {
		field.node().value=input_J
		ErrorBuzz( field )
	}
	input_J = field.node().value
	return input_J.replace( /\s/g, "" )
}
function getDelta(){ //Get delta input and check for errors
	var field = d3.select( "#delta" )
	var input = field.node().value
	if( /[^0-9.]/.test( input )==true && input!="" ) {
		ErrorBuzz( field )
		field.node().value=input_delt
	}
	input_delt = field.node().value
	return input_delt
}
function UpdatePrintout(){ //Returns user's answer
	d3.select( "#printout" ).text( getDelta() + " " + getMult() + " " + getJ() )
}

function StringParse( string, isanswer ){ //Parses string into delta, multiplicity, and J, generating peak positions and graph dimensions
	if( !isanswer ){ string.unshift( "" ) }
	var delt = parseFloat( string[1] )
	var mults = string[2].match( /( d|t|qn|q|sx )/g )
	var J = string[3].split( ", " ).map( function( d ){ return parseFloat( parseFloat( d ).toFixed( 1 )) } )
	if( isanswer ){
		id = string[0]
		answer.push( delt )
		for( i in mults ){ answer.push( { mult:mults[i], J:J[i]} ) }
		answer.sort( function( a, b ){ return a.J-b.J } )
	}
	else{
		attempt=[]
		attempt.push( delt )
		for( i in mults ){ attempt.push( { mult:mults[i], J:J[i]} ) }
		attempt.sort( function( a, b ){ return a.J-b.J } )
		timeout = setTimeout( function(){ CheckAnswer( answer, attempt ) }, 2000 )
	}

	var shifts = []
	var centres = []
	if( isanswer ){ var ap = [150]; pph = 12; graph_centre = delt; graph_width = d3.sum( shifts )*pph } else{ var ap = [150+( delt-graph_centre )*100*pph]} //"access points" - lowest branch points that are to be drawn from

	if( !isanswer ){ if( delt-graph_centre>0.12 ){ d3.select( "#l.arrow" ).attr( "opacity", "100" ) }else if( delt-graph_centre<-0.12 ){ d3.select( "#r.arrow" ).attr( "opacity", "100" ) } }
	for( i=0;i<mults.length;i++ ){
		switch( mults[i] ){
			case "d": shifts.push( J[i] ); break;
			case "t": mults[i]="dd"; shifts.push( J[i], J[i] ); break;
			case "q": mults[i]="ddd"; shifts.push( J[i], J[i], J[i] ); break;
			case "qn": mults[i]="dddd"; shifts.push( J[i], J[i], J[i], J[i] ); break;
			case "sx": mults[i]="ddddd"; shifts.push( J[i], J[i], J[i], J[i], J[i] ); break;
		}
	}
	mults = mults.join( "" )
	for( i=0;i<mults.length;i++ ){
		var centre = []
		for( j=0;j<ap.length;j++ ){
			shift = parseFloat( shifts[i] )*pph*100;
			x0 = ap[j]
			centre = centre.concat( [x0+shift/( 2*field ), x0-shift/( 2*field )] )
		}
		ap.length=0;
		for( point of centre ){ ap.push( point ) };
	}
	for( point of centre ){ centres.push( parseFloat( point.toFixed( 1 )) ) };
return centres
}

function CheckAnswer( answer, attempt ){ //Verifies answer given and triggers validate animation
	var correct = false
	if( attempt.length==answer.length ){
		for( a=1; a<answer.length; a++ ){
			if( answer[0]==attempt[0] && answer[a]["J"]==attempt[a]["J"] && answer[a]["mult"]==attempt[a]["mult"] ){
				correct=true
			}
			else{ correct=false; break }
		}
	}
	if( correct ){
			errorcount = 0
			d3.select( "#tick" )
				.transition()
				.duration( 800 )
				.style( "stroke-dashoffset", 0 )
			ids = ids.filter( function( d ){ return d!=id } )
	}
	else{
		errorcount++
		d3.select( "#cross1" )
			.transition()
			.duration( 400 )
			.style( "stroke-dashoffset", 0 )
		d3.select( "#cross2" )
			.transition()
			.duration( 400 )
			.delay( 400 )
			.style( "stroke-dashoffset", 0 )
	}
	if( errorcount>2 && d3.select( ".struggle" ).empty() ){
		var struggling = d3.select( "#rootframe" ).append( "g" ).attr( "class", "struggle" ).attr( "id", "indicators" ).attr( "opacity", 0 )
		struggling.transition().delay( 1000 ).duration( 1000 ).attr( "opacity", 1 )
		struggling.append( "rect" ).attr( "x", "-30" ).attr( "y", "84" ).attr( "width", "150%" ).attr( "height", "50" ).attr( "fill", "#A7DBD8" ).attr( "opacity", "0.8" )
		ButtonGen( struggling, "RevealAns", 170, 108, 7, 7, 60, 20, "Show me", "d3.select( '#delta' ).node().value = inp_string[1];d3.select( '#multiplicity' ).node().value = inp_string[2];d3.select( '#J' ).node().value = inp_string[3];UpdatePrintout();Attempt();d3.select( '.struggle' ).remove()" )
		ButtonGen( struggling, "Dismiss", 240, 108, 7, 7, 60, 20, "Dismiss", "errorcount=1; d3.select( '.struggle' ).remove()" )
		TextGen( struggling, "", "", 235, 98, "Struggling?", [], [["fill", "black"]] )
	}
}

function ErrorPing( text ){ //Flashes error beneath submit button
	if( d3.select( ".error" ).empty() ){
		TextGen( d3.select( "#indicators" ), "error", "", 407, 168, text, [["fill", "#4A142B"]], [] )
		setTimeout( function(){ d3.select( ".error" ).remove() }, 3000 )
	}
}

function Attempt(){ //Verifies input format and triggers scale animations
	clearTimeout( timeout )
	d3.selectAll( ".validate" ).transition().style( "stroke-dashoffset", "51" )
	d3.selectAll( ".arrow" ).attr( "opacity", "0" )
	var error=false
	var input = d3.select( "#printout" ).html().split( " " )
	if( d3.select( "#correct" ).empty() ){ error=true; ErrorPing( "Hit Go first!" );}
	if( input[0]==""||input[0].match( /[0-9]{ 1, }[.]( [0-9]{ 2 }( ?![0-9] ))/ )==null ){ error=true; ErrorBuzz( d3.select( "#delta" )); }
	if( input[1]==""||input[1].replace( /( d|t|qn|q|sx )/g, "" ).length!=0 ){ error=true; ErrorBuzz( d3.select( "#multiplicity" ));}
	if( input[2]==""||input[2].replace( /( ,|[0-9]{ 1, }[.]( [0-9]{ 1 }( ?![0-9] )) )/g, "" ).length!=0||input[2].split( ", " ).indexOf( "" )!=-1 ){ error=true; ErrorBuzz( d3.select( "#J" )); }
	else if( error==false && ( input[1].match( /( d|t|qn|q|sx )/g )||[] ).length!=input[2].split( ", " ).length ){ error=true; ErrorBuzz( d3.selectAll( "#J, #multiplicity" ));ErrorPing( "Is there a J for every multiplet?" );}
	if( error ){ return }

	LineBuild( "attempt", StringParse( d3.select( "#printout" ).html().split( " " ), false ));
}

function Clear(){ //Clears attempt graph, resetting the scalefactor, and removes validation marks/arrow
	d3.select( "#attempt" ).remove()
	d3.selectAll( ".validate" ).transition().style( "stroke-dashoffset", "51" )
	d3.selectAll( ".arrow" ).attr( "opacity", "0" )

	attempt = []
	if( !d3.select( "#correct" ).empty() ){
		scalefactor=120/d3.max( d3.select( "#correct" ).data()[0].map( function( d ){ return d.y } ))
		d3.select( "#correct" ).transition().duration( 2300 ).ease( d3.easeCubic )
			.attr( "d", line( d3.select( "#correct" ).data()[0].map( function( d ){ return { x:d.x, y:scalefactor*d.y } } )) )
		d3.selectAll( "#tags > line" ).each( function( d, i ){
			x_1 = d3.select( this ).attr( "x1" )
			d3.select( this ).transition().duration( 2300 ).ease( d3.easeCubic )
				.attr( "y2", 177-d3.select( "#correct" ).data()[0].filter( function( a ){ return a.x==parseFloat( x_1 ) } )[0].y*scalefactor )
		} )
	}
}

function Regen(){ //Resets page, accesses csv for data
	Clear()
	d3.select( "#intro" ).remove()
	field = d3.select( "#field" ).text( "Field: "+( Math.floor( Math.random()*4 )*100+300 )+"MHz" ).text().match( /[0-9]+/g )[0]
	answer=[]
	errorcount = 0
	d3.select( "#tags" ).remove()
	d3.select( "#correct" ).remove()

	d3.csv( "Data.csv", function( d ){
		ids = typeof ids=="undefined" ? d3.range( 1, d.length+1, 1 ):ids
		data = d.filter( function( a ){ return a.level==d3.select( "#level" ).node().value && ids.indexOf( parseInt( a.id ))!=-1 } )
		if( data.length==0 ){ ErrorPing( "No more problems at this level!" ) }
		else{
			inp_string = Object.values( data[Math.floor( Math.random()*data.length )] ).slice( 1 )
			LineBuild( "correct", StringParse( inp_string, true ))
			buildAxes()
		}
	} )
}

var input_J = ""
var input_delt = ""
var input_mult = ""
var timeout

d3.select( "#graph" ).on( "keypress", function(){ if( d3.event.keyCode==13 ){ Attempt() } } ) //Detect enter in fields
repeat()
function repeat(){ d3.select( "#animarrow" ).transition().duration( 1000 ).ease( d3.easeBack ).attr( "transform", "translate( 310, 18 )scale( 3 )" ).transition().duration( 1000 ).ease( d3.easeLinear ).attr( "transform", "translate( 290, 18 )scale( 3 )" ).on( "end", repeat ) }

ButtonGen( d3.select( ".buttons" ), "Regen", 420, 10, 7, 7, 49, 17, "Go!", "Regen()" )
ButtonGen( d3.select( ".buttons" ), "Submit", 333, 133, 7, 7, 84, 21, "Submit", "Attempt()" )
ButtonGen( d3.select( ".buttons" ), "Clear", 430, 133, 7, 7, 42, 21, "Clear", "Clear()" )
LineGen( d3.select( ".outline" ), "", "", 0, 0, 5, 190, [], [] )
LineGen( d3.select( ".outline" ), "", "", 0, 300, 190, 190, [], [] )
buildAxes()
