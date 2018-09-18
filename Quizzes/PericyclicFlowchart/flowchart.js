var question, IsResponseGrid, data, currentLevel;

d3.csv( "data.csv", ( d ) => {

    data = d.filter( el => el.Num !== "" );
    init();

} )

function init(){

    d3.select( "#Image > div" ).remove();

    if( data.length > 0 ){

        question = data.splice( Math.floor( Math.random() * data.length ), 1 )[0];

        while( question["Num"] === "" ){

            question = data.splice( Math.floor( Math.random() * data.length ), 1 )[0];

        }

        currentLevel = d3.select( "#L1" );
        currentLevel.selectAll( ".FlowBox" ).transition().style( "background", null );
        currentLevel.selectAll( ".Arrow" ).transition().style( "fill", null );
        currentLevel.select( ".FlowBox" ).transition().style( "background", "#c6d0cd" );

        QuestionSetup( 1 );

    } else{

        d3.selectAll( "#Image, .AnswerBox, #Question" ).remove()
        if( d3.select( "#noQuestions" ).empty() ){

            d3.select( ".QuestionBox" ).append( "h1" ).attr( "id", "noQuestions" ).html( "No questions left!<br/>Refresh to try them again" );

        }

    }

}

function UpdateFlowchart( qNum ){

    const currentQuestion = "#c6d0cd";
    const path = "#ccf78f";
    const ahead = "grey";

    currentLevel.select( ".FlowBox" ).style( "background", path );

    if( currentLevel.select( "#L" + ( qNum + 1 ) + question[ "Q" + qNum + "A"] ).empty() ){

        currentLevel = currentLevel.select( ".flowchartLevel" );

    } else{

        currentLevel = currentLevel.select( "#L" + ( qNum + 1 ) + question[ "Q" + qNum + "A"] );

    }

    if( currentLevel.attr( "terminal" ) !== null ){

        postAnim = function(){

            currentLevel.selectAll( ".FlowBox" )
                .transition()
                .duration( 1000 )
                .style( "background", path )
                .style( "fill", path )
            currentLevel.selectAll( ".Arrow" )
                .transition()
                .duration( 1000 )
                .style( "fill", path )

        }

    } else{

        postAnim = function(){

            currentLevel.selectAll( ".FlowBox" )
                .transition()
                .duration( 1000 )
                .style( "background", ahead )
            currentLevel.select( ".FlowBox" )
                .transition()
                .duration( 1000 )
                .style( "background", currentQuestion )

        }

    }

    currentLevel.select( ".Arrow" ).transition()
        .duration( 1000 )
        .style( "fill", path )
        .on( "end", postAnim )

}

function QuestionSetup( qNum ){

    d3.select( "#Question" ).html( question[ "Q" + qNum + "Q" ] );

    if( qNum === 1 ){

        d3.select( "#Image > svg" ).remove();

        d3.xml("img/" + question.Num + "/" + qNum + ".svg").mimeType("image/svg+xml").get( function( err, xml ){
            if( err ) throw err;
            d3.select( xml.documentElement.querySelector( "clipPath" ) ).remove();
            d3.select( xml.documentElement.querySelector( "rect" ) ).remove();
            d3.select( "#Image" ).node().appendChild( xml.documentElement );
        } )

    }

    UpdateResponses( qNum );
    AnswerInteractions( qNum );

};

function UpdateResponses( qNum ){

    const numResponses = Object.keys( question ).filter( el => el.indexOf( "Q" + qNum + "A" ) !== -1 && question[ el ] !== "" ).length - 1;
    var AnswerFrames = [];
    IsResponseGrid = question[ "Q" + qNum + "grid" ] ? true : false;

    d3.select( ".feedbackBG" ).remove();

    for( var i = 0; i < numResponses; i++ ){

        AnswerFrames.push( "<div class='AnswerFrame' id='frame" + String.fromCharCode( 97 + i ) + "'></div>" );

    }
    d3.select( ".AnswerBox" ).html( AnswerFrames.join("") );

    const leftGrid = ["0%", "25%", "50%", "75%"];
    const topGrid = ["2%", "2%", "2%", "2%"];
    const leftStack = ["1%", "1%", "1%", "1%"];
    const topStack = ["0%", "25%", "50%", "75%"];

    d3.selectAll( ".AnswerFrame" ).each( function( d, i ) {

        if( IsResponseGrid ){

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

    //////Update Answers//////
    d3.selectAll( ".AnswerFrame" ).each( function( d, i ){
        d3.select( this ).style( "background", null ).html( "" )

        d3.select( this ).append( "p" ).attr( "class", "answerText" ).style( "top", "32%" ).html( question["Q" + qNum + "A" + ( i + 1 )] )

    } )

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

    answerElements.each( function(d, i){

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
        .attr( "onclick", qNum < 2 ? "QuestionSetup(" + ( qNum + 1 ) + ");" : "init()" )

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
            UpdateFlowchart( qNum );

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
