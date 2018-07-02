var question, IsResponseGrid, data;


d3.csv( "data.csv", ( d ) => {

    data = d;
    init();

} )

function init(){

    d3.select( "#Image > div" ).remove();

    if( data.length > 0 ){
        question = data.splice(Math.floor( Math.random() * data.length ), 1)[0];
        QuestionSetup( 1 );
    } else{
        d3.select( "#framea" ).html( "No questions left" );
    }

}

function QuestionSetup( qNum ){

    const Questions = {
        1: "What type of reaction is shown below?",
        2: "Which method should one use to work out the stereochemistry of the product?",
        3: "Which of the following transition states is the correct one for this reaction?",
        4: "What is the correct stereochemistry of the product based on this transition state?"
    };

    AnswerArrangement( qNum > 2 );

    d3.select( "#Question" ).html( Questions[qNum] );

    if( [1, 4].indexOf( qNum ) !== -1 ){

        d3.select( "#Image > svg" ).remove();

        d3.xml("img/" + question.Num + "/" + qNum + ".svg").mimeType("image/svg+xml").get( function( err, xml ){
            if( err ) throw err;
            d3.select( xml.documentElement.querySelector( "clipPath" ) ).remove();
            d3.select( xml.documentElement.querySelector( "rect" ) ).remove();
            d3.select( "#Image" ).node().appendChild( xml.documentElement );
            qNum === 4 && d3.select( "#Image > svg" ).style( "width", "50%" );
        } )

    }

    if( qNum === 4 ){
        mol3d = new Mol3D( d3.select( "#Image" ).append( "div" ).style( "width", "50%" ).style( "height", "100%" ).style( "float", "right" ), { showfGroups: false, showHs: false } );
        mol3d.parse( question["Molfile"] );
        mol3d.draw();
        mol3d.toggleCam();
        d3.select( "#Image > div" ).append( "h1" ).html( "+" ).style( "position", "absolute" ).style( "top", "0px" ).style( "right", "0px" ).attr( "onclick", "zoom3D( this, true );" );
    }

    ResponseUpdate( qNum );
    AnswerInteractions( qNum );

};

function zoom3D( el, ZoomIn ){

    d3.select( el ).attr( "onclick", ZoomIn ? "zoom3D( this, false )": "zoom3D( this, true )" );

    if( ZoomIn ){
        d3.select( "#Image" ).style( "overflow", "visible" );
        d3.select( ".QuestionBox" ).style( "overflow", "visible" );
        d3.select( "#Image > svg" ).attr( "visibility", "hidden" );
        d3.select( el ).html( "-" );
        d3.select( el.parentNode ).style( "width", "100%" ).style( "height", "225%" ).style( "background", "#84A59D" ).style( "float", null );
    } else{
        d3.select( "#Image" ).style( "overflow", null );
        d3.select( ".QuestionBox" ).style( "overflow", null );
        d3.select( "#Image > svg" ).attr( "visibility", null );
        d3.select( el ).html( "+" );
        d3.select( el.parentNode ).style( "width", "50%" ).style( "height", "100%" ).style( "background", null ).style( "float", "right" );
    }

    mol3d.onWindowResize();

};

function ResponseUpdate( qNum ){

    //////Update Answers//////
    const responses = {
        1: ["Cycloaddition", "Sigmatropic Rearrangement", "Electrolytic Reaction", "None of the above"],
        2: ["Endo Transition State", "Chair Transition State", "Conrotatory/disrotatory point of view", "None of the above"]
    };

    d3.selectAll( ".AnswerFrame" ).each( function( d, i ){
        d3.select( this ).style( "background", null ).html( "" )
        if( question["Q" + qNum + "A" + ( i + 1 )] === "img" ){

            d3.select( this ).append( "h1" ).html( String.fromCharCode( 65 + i ) );
            d3.xml("img/" + question.Num + "/" + qNum + String.fromCharCode( 97 + i ) + ".svg").mimeType("image/svg+xml").get( ( err, xml ) => {
                if( err ){}
                else{
                    d3.select( xml.documentElement.querySelector( "clipPath" ) ).remove()
                    d3.select( xml.documentElement.querySelector( "rect" ) ).remove()
                    this.appendChild( xml.documentElement )
                }
            } )

        } else{

            if( qNum <= 2 ){
                d3.select( this ).append( "p" ).attr( "class", "answerText" ).html( String.fromCharCode( 65 + i )  + ") " + responses[qNum][i] );
            } else {
                d3.select( this ).append( "h1" ).html( String.fromCharCode( 65 + i ) )
                d3.select( this ).append( "p" ).attr( "class", "answerText" ).style( "top", "32%" ).html( question["Q" + qNum + "A" + ( i + 1 )] )

            }

        }

    } )

}

function AnswerArrangement( formatGrid ){

    IsResponseGrid = formatGrid;

    d3.select( ".feedbackBG" ).remove();
    d3.select( ".AnswerBox" ).html(`
		<div class="AnswerFrame" id="framea"></div>
		<div class="AnswerFrame" id="frameb"></div>
		<div class="AnswerFrame" id="framec"></div>
		<div class="AnswerFrame" id="framed"></div>
    `);

    const leftGrid = ["0%", "25%", "50%", "75%"];
    const topGrid = ["2%", "2%", "2%", "2%"];
    const leftStack = ["0%", "0%", "0%", "0%"];
    const topStack = ["0%", "25%", "50%", "75%"];

        d3.selectAll( ".AnswerFrame" ).each( function( d, i ) {

            if( formatGrid ){

                d3.select( this )
                    .transition()
                    .style( "left", leftGrid[i] )
                    .style( "top", topGrid[i] )
                    .style( "width", "235px" )
                    .style( "height", "250px" )

            } else{

                d3.select( this )
                    .transition()
                    .style( "left", leftStack[i] )
                    .style( "top", topStack[i] )
                    .style( "width", "60%" )
                    .style( "height", "16.5%" )

            }
        })

}

function showcaseAnswers( answerElements, qNum ){

    d3.select( ".AnswerBox" ).append( "div" )
        .attr( "class", "feedbackBG" )
        .style( "position", "absolute" )
        .style( "width", "100%" )
        .style( "height", "100%" )
        .style( "background", "rgba(0, 0, 0, 0)" )
        .transition()
        .style( "background", "rgba(0, 0, 0, 0.5)" )

    const tops = [[37.5], [25, 50], [12.5,37.5,62.5]]
    const lefts = [[14], [1, 27], [0,25,50]]

    //////Update question image if feedback version//////
    d3.xml("img/" + question.Num + "/" + qNum + "f.svg").mimeType("image/svg+xml").get( ( err, xml ) => {
        if( err ){}
        else{
            d3.select( "#Image > svg" ).remove()
            d3.select( xml.documentElement.querySelector( "clipPath" ) ).remove()
            d3.select( xml.documentElement.querySelector( "rect" ) ).remove()
            d3.select( "#Image" ).node().appendChild( xml.documentElement )
            qNum === 4 && d3.select( "#Image > svg" ).style( "width", "50%" );
        }
    } )

    //////Update answer image if feedback version//////
    answerElements.each( function(d, i){

        d3.xml("img/" + question.Num + "/" + qNum + this.getAttribute( "id" ).slice( -1 ) + "f.svg").mimeType("image/svg+xml").get( ( err, xml ) => {
            if( err ){}
            else{
                d3.select( "#" + this.getAttribute( "id" ) + " > svg" ).remove();
                d3.select( xml.documentElement.querySelector( "clipPath" ) ).remove();
                d3.select( xml.documentElement.querySelector( "rect" ) ).remove();
                this.appendChild( xml.documentElement );
            }
        } )

        d3.select( this )
            .style( "background", "rgb( 204, 247, 143 )" )
            .raise()
            .transition()
            .style( IsResponseGrid ? "left" : "top" , ( IsResponseGrid ? lefts[answerElements.size() - 1][i] : tops[answerElements.size() - 1][i] ) + "%" )

    } )

    d3.select( ".feedbackBG" )
        .append( "div" )
        .attr( "class", "feedbackText" )
        .raise()
        .html( "<h1 style='padding:10px;'>That's Right!</h1>" )
        .append ( "p" )
        .style( "padding", "10px" )
        .html( question["Q" + qNum + "Feedback"] )

    d3.select( ".feedbackBG > div" )
        .append( "div" )
        .attr( "class", "button" )
        .html( "Next Question" )
        .attr( "onclick", qNum < 4 ? "QuestionSetup(" + ( qNum + 1 ) + ");" : "init()" )

}

function AnswerInteractions( qNum ){

    d3.selectAll( ".AnswerFrame" ).on( "mouseover", function(){

        const colour = [146,175,215];
        d3.select( this )
            .style( "background", "rgb(" + colour.join( "," ) + ")" );

    }).on( "mouseout", function(){

        d3.select( this )
            .style( "background", null );

    }).on( "mousedown touchstart", function(){

        d3.select( this )
            .transition()
            .duration( 0 )
            .style( "background", "#C5D1EB" )

    }).on( "mouseup touchend", function(){

        d3.select( this )
            .style( "background", null )

    }).on( "click", function(){

        if( question["Q" + qNum + "A"].split( "," ).indexOf( this.getAttribute( "id" ).slice( -1 ) ) !== -1  ){

            d3.selectAll( ".AnswerFrame" ).on( "mousedown touchstart mouseup touchend mouseover mouseout click", null )

            d3.select( this )
                .transition()
                .duration( 150 )
                .style( "background", "rgb( 204, 247, 143 )" )
                .on( "end", () => {
                    d3.select( this )
                        .transition()
                        .duration( 150 )
                        .style( "background", "rgb( 153, 161, 166 )" )
                })

            showcaseAnswers( d3.selectAll( question["Q" + qNum + "A"].split( "," ).map( el => "#frame" + el ).join( "," ) ) , qNum );

        } else {
            d3.select( this )
                .transition()
                .duration( 150 )
                .style( "background", "rgb( 255, 0, 0 )" )
                .on( "end", () => {
                    d3.select( this )
                        .transition()
                        .duration( 150 )
                        .style( "background", "rgb( 153, 161, 166 )" )
                })

        }

    })

}
