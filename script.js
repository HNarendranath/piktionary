'use strict';
var theWord;
var countTurn = 0;
var lineColor = "black";
var width = 5;
var x;


///         THIS IS ALL PART OF THE CANVAS, DO NOT TOUCH
// works out the X, Y position of the click inside the canvas from the X, Y position on the page
$(document).ready(function () {

    initialize();
});

// works out the X, Y position of the click inside the canvas from the X, Y position on the page
function getPosition(mouseEvent, sigCanvas) {
    if (myturn == true){
        var x, y;
        if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
            x = mouseEvent.pageX;
            y = mouseEvent.pageY;
        } else {
            x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        return { X: x - sigCanvas.offsetLeft, Y: y - sigCanvas.offsetTop };
    }
    else {}
}

function changeColor(id) {
    var idValue = id.value.toLowerCase();
    lineColor = /*getComputedStyle(id).backgroundColor*/idValue.toString();
    
}

function changeSize(id) {
    var idValue = id.value;
    width = idValue;
    
}


function initialize() {

    
    // get references to the canvas element as well as the 2D drawing context
    var sigCanvas = document.getElementById("canvasSignature");
    sigCanvas.height = sigCanvas.clientHeight;
    sigCanvas.width = sigCanvas.clientWidth;
    var context = sigCanvas.getContext("2d");
    var canvasDiv = document.getElementById("canvasDiv");
    context.strokeStyle = 'black';
    context.lineWidth = width;
    
    // This will be defined on a TOUCH device such as iPad or Android, etc.
    var is_touch_device = 'ontouchstart' in document.documentElement;

    if (is_touch_device) {
        console.log("touch");
        // create a drawer which tracks touch movements
        var drawer = {
            isDrawing: false,
            touchstart: function (coors) {
                context.beginPath();
                context.moveTo(coors.x, coors.y);
                this.isDrawing = true;
            },
            touchmove: function (coors) {
                if (this.isDrawing) {
                    context.lineTo(coors.x, coors.y);
                    context.stroke();
                }
            },
            touchend: function (coors) {
                if (this.isDrawing) {
                    this.touchmove(coors);
                    this.isDrawing = false;
                }
            }
        };

        // create a function to pass touch events and coordinates to drawer
        function draw(event) {

            // get the touch coordinates.  Using the first touch in case of multi-touch
            var coors = {
                x: event.targetTouches[0].pageX,
                y: event.targetTouches[0].pageY
            };

            // Now we need to get the offset of the canvas location
            var obj = sigCanvas;

            if (obj.offsetParent) {
                // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
                do {
                    coors.x -= obj.offsetLeft;
                    coors.y -= obj.offsetTop;
                }
                // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
                // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
                while ((obj = obj.offsetParent) != null);
            }

            // pass the coordinates to the appropriate handler
            drawer[event.type](coors);
        }


        // attach the touchstart, touchmove, touchend event listeners.
        sigCanvas.addEventListener('touchstart', draw, false);
        sigCanvas.addEventListener('touchmove', draw, false);
        sigCanvas.addEventListener('touchend', draw, false);

        // prevent elastic scrolling
        sigCanvas.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false);
    }
    else {

        // start drawing when the mousedown event fires, and attach handlers to
        // draw a line to wherever the mouse moves to
        $("#canvasSignature").mousedown(function (mouseEvent) {
            var position = getPosition(mouseEvent, sigCanvas);
            context.moveTo(position.X-sigCanvas.offsetLeft, position.Y-sigCanvas.offsetTop);
            context.beginPath();

            // attach event handlers
            $(this).mousemove(function (mouseEvent) {
                drawLine(mouseEvent, sigCanvas, context);
            }).mouseup(function (mouseEvent) {
                finishDrawing(mouseEvent, sigCanvas, context);
            }).mouseout(function (mouseEvent) {
                finishDrawing(mouseEvent, sigCanvas, context);
            });
        });

    }


}
// draws a line to the x and y coordinates of the mouse event inside
// the specified element using the specified context
function drawLine(mouseEvent, sigCanvas, context) {

    var position = getPosition(mouseEvent, sigCanvas);

    context.strokeStyle = lineColor;
    context.lineWidth = width;
    context.lineTo(position.X, position.Y);
    context.stroke();
    //sendLine(mouseEvent, sigCanvas, context);
}

// draws a line from the last coordiantes in the path to the finishing
// coordinates and unbind any event handlers which need to be preceded
// by the mouse down event
function finishDrawing(mouseEvent, sigCanvas, context) {
    // draw the line to the finishing coordinates
    sendLine(sigCanvas.getContext("2d"));
    drawLine(mouseEvent, sigCanvas, context);

    context.closePath();

    // unbind any events which could draw
    $(sigCanvas).unbind("mousemove")
        .unbind("mouseup")
        .unbind("mouseout");
}
///         END OF CANVAS / DRAWING STUFF







let players = [];

const username = prompt("Enter a username","Guest")

if (username != null) { 
    players.push(username);
    
}

function getWord() {
	//use ajax to make request to API for randow word
	$.ajax({
	    method: 'GET',
	    url: 'https://api.api-ninjas.com/v1/randomword',
	    headers: { 'X-Api-Key': 'J+UX7ifSxylbRI6bRsHKIA==njxACxEQNHZIYhyq'},
	    contentType: 'application/json',
	    success: function(result) {
		// if successful save the word in variable "theWord" and change html element with id "word" text to theWord
		theWord = result["word"];
		document.getElementById("word").innerHTML = theWord;
		// use sendWord() function to send word to other users
		sendWord(theWord);
		
	    },
	    error: function ajaxError(jqXHR) {
		// log error to console
		console.error('Error: ', jqXHR.responseText);
	    }
	});
	
}

// log recieved message to screen
function logMessage() {
    if (document.getElementById("guess").value.trim() != "")  {
        const message = document.getElementById("guess").value;
	//check if message is theWord ie someone guessed correctly
        if (message.toUpperCase() == String(theWord).toUpperCase()) {
            
            clearCanvas();
            sendGuessed();
        }
        
        else {
            //console.log(message);
            sendmsg();
        }
    }
    document.getElementById("guess").value = "";
}

// clear canvas
function clearCanvas() {
    var canvas = document.getElementById("canvasSignature");
    canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
   
}

///         PeerJS config

// using peerJS framework to provide an id and connect players together
var peer = new Peer();
var conn;
var myturn = false;
var conns = [];
var started = false;

peer.on('open', function(id) {
	console.log(id);
    document.getElementById("idLbl").value=id;
});

// function to request connect with given id. activated when id is entered into input box on webpage
function connect() {
    	// get the id that has been entered from the html element
	var connId = document.getElementById("otherId").value;
	
	conn = peer.connect(connId);
	//disable id input area and clear chat
	document.getElementById("otherId").disabled = true;
	document.getElementById("chatText").innerHTML = "";
	conn.on('open', () => {
		//now that connection was successful, allow guesses / chat messages to be sent
		document.getElementById("guess").disabled = false;
    });
	
	//    HANDLE RECEIVING OF MESSAGES AND WHAT TO DO WITH THEM - LOTS OF IF STATEMENTS
	
	// data is dictionary. data.status describes nature of data. 
	conn.on('data', (data) => {
        if (data.status == "msg") {
		// data is dictionary. data.status describes nature of data. in this case a message (hence "msg") so the html is updated
	       document.getElementById("chatText").innerHTML = data.sender + ": " + data.message +"<br>"+ document.getElementById("chatText").innerHTML;
        }

        else if (data.status == "word") {
            theWord = data.secret;
            
        }

        else if (data.status == "notguessed") {
            clearInterval(x);
           
            document.getElementById("chatText").innerHTML = 'The word, "' +theWord+'" was not guessed.'+"<br>"+ document.getElementById("chatText").innerHTML;
            myturn = false;
            //document.getElementById("chatText").innerHTML = data.sender + " guessed the word!" +"<br>"+ document.getElementById("chatText").innerHTML;
            document.getElementById("word").innerHTML = "...";
            //document.getElementById("otherId").disabled = true;
            document.getElementById("guess").disabled = false;
            clearCanvas();
            

        }

        else if (data.status == "guessed") {
            clearInterval(x);
            
            document.getElementById("chatText").innerHTML = data.sender + " guessed the word!" +"<br>"+ document.getElementById("chatText").innerHTML;
            if (myturn == false) {
                document.getElementById("chatText").innerHTML = "The word was " +theWord+"."+"<br>"+ document.getElementById("chatText").innerHTML;
            }
            myturn = false;
            document.getElementById("word").innerHTML = "...";
            document.getElementById("guess").disabled = false;
            clearCanvas();
            

        }

        else if (data.status == "timer"){
            clearInterval(x);
            setTimeout(timer(),5000)
        }

        else if (data.status == "turn") {
            //configure game for your turn - enable drawing (by setting myturn to True) and disable chat
            myturn = true;
            document.getElementById("guess").disabled = true;
            sendMyTurn();
            getWord();
            
        }


        else {
            var sigCanvas =document.getElementById("canvasSignature");
            
            var image = new Image();
            image.onload = function() {
		//load the image onto the canvas and resize it to canvas dimensions
                sigCanvas.getContext("2d").drawImage(image, 0, 0,sigCanvas.width,sigCanvas.height);
            };
            image.src = data;
        }

	});

	conn.on('close', () => {
		//alert user that session has been ended
		alert("Host Ended Session");
		peer.destroy();
	});

}




let connected;

function copyID() {
	// use select() to copy id text in html element idLbl and copy it to clipboard
	var copyText = document.getElementById("idLbl");
	copyText.select();
	document.execCommand("copy");
		}



peer.on('connection', (connection) => {
	
	// THIS IS IF YOU ARE HOST - HANDLES WHAT TO DO WHEN NEW CONNECTION IS RECEIVED, AS SUPPOSED TO CONNECTION REQUEST IS SUCCESSFUL
	
	var conn1 = connection;
	// append new connection to conns array
	conns.push(conn1);
	if (started == false) {
		//if game has already started
		myturn = true;
		document.getElementById("otherId").disabled = true;
		document.getElementById("guess").disabled = true;

		connection.on("open",()=>{
			connected = true;
			sendMyTurn();
			getWord();
		});
	started = true;
	}
			
	else {
		//if game has not started
		connection.on("open",()=>{
			connected = true;
			sendWord(theWord);
		});
	};

	connection.on("data", (data) => {
		for (var i = 0; i<conns.length; i++) {
			conns[i].send(data);
		}

	// HANDLING WHAT TO DO WITH MESSAGES - USE DATA.STATUS (DATA IS DICTIONARY) TO IDENTIFY NATURE OF DATA (EG. CHAT MESSAGE)
		
        if (data.status == "msg"){
		  document.getElementById("chatText").innerHTML = data.sender + ": " + data.message +"<br>"+ document.getElementById("chatText").innerHTML;
        }

        else if (data.status == "word") {
            theWord = data.secret;
        }

        else if (data.status == "timer"){
            clearInterval(x)
            setTimeout(timer(),5000)
        }

        else if (data.status == "notguessed") {
            clearInterval(x);
            document.getElementById("chatText").innerHTML = 'The word, "' + theWord + '" was not guessed.'+"<br>"+ document.getElementById("chatText").innerHTML;
           
            document.getElementById("word").innerHTML = "...";
            
            document.getElementById("guess").disabled = false;
            myturn = false;
            clearCanvas()

            if (countTurn < conns.length) {
                sendTurn();
                countTurn += 1;
            }

            else if (countTurn == conns.length) {
                myturn = true;
                sendMyTurn();
                getWord();
                document.getElementById("guess").disabled = true;
                countTurn = 0;
            }
            
        }

        else if (data.status == "guessed") {
            clearInterval(x);
            document.getElementById("chatText").innerHTML = data.sender + " guessed the word!" +"<br>"+ document.getElementById("chatText").innerHTML;
            if (myturn == false) {
                document.getElementById("chatText").innerHTML = "The word was " +theWord+"."+"<br>"+ document.getElementById("chatText").innerHTML;
            }
            //theWord="";
            document.getElementById("word").innerHTML = "...";
            //document.getElementById("otherId").disabled = true;
            document.getElementById("guess").disabled = false;
            myturn = false;
            clearCanvas()

            if (countTurn < conns.length) {
                
                sendTurn();
                countTurn += 1;
            }

            else if (countTurn == conns.length) {
                
                myturn = true;
                sendMyTurn();
                getWord();
                document.getElementById("guess").disabled = true;
                countTurn = 0;
            }
            
        }


        else {
            var sigCanvas =document.getElementById("canvasSignature");
            var image = new Image();
		// load image onto canvas
            image.onload = function() {
		// resize image to canvas size
		sigCanvas.getContext("2d").drawImage(image, 0, 0,sigCanvas.width,sigCanvas.height);
                
            };
		//specify image source
            image.src = data;
		
        }
	});

	connection.on('close',()=>{
		pass
	})

});

function timer() {
    const displayTimer = document.getElementById("timerH2");
    var timeLeft = 90;
    x = setInterval(()=>{
        displayTimer.innerHTML = timeLeft;
        timeLeft -= 1;
	// if timer runs out
        if (timeLeft == -1) {
            clearInterval(x);
            sendNotGuessed()
            clearCanvas()
        }

    },1000)

}

// FUNCTIONS FOR SENDING DATA

function sendmsg() {
	// use dictionary for data - has status "msg" so receiving client know that it is a chat message.
	const data = {
        	status: "msg",
		message: document.getElementById("guess").value,
		sender: username,
	}

    document.getElementById("guess").value = "";	
    if (conn) {
    	conn.send(data);
    }

    else {				
    	for (var i = 0; i<conns.length; i++) {
    		conns[i].send(data);
    	}
    // update chatText element on your own screen.
    document.getElementById("chatText").innerHTML = data.sender + ": " + data.message +"<br>"+ document.getElementById("chatText").innerHTML;
	}
}

function sendTimer() {
    const data = {
        status: "timer",
    }

    if (conn) {
        conn.send(data);
    }

    else {              
        for (var i = 0; i<conns.length; i++) {
            conns[i].send(data);
        }
    }
    clearInterval(x);
    setTimeout(timer(),5000)
}



function sendNotGuessed() {
    const data = {
        status: "notguessed",
    }

    document.getElementById("guess").value = "";    
    if (conn) {
        conn.send(data);
    }

    else {  
        document.getElementById("chatText").innerHTML = 'The word, "'+theWord+'" was not guessed.'+"<br>"+ document.getElementById("chatText").innerHTML;
        for (var i = 0; i<conns.length; i++) {
            conns[i].send(data);
        }
        if (countTurn < conns.length) {
                
                myturn = false;
                document.getElementById("word").innerHTML = "...";
                sendTurn();
                countTurn +=1;
            }

            else if (countTurn == conns.length) {
                myturn = true;
                sendMyTurn();
                getWord();
                document.getElementById("guess").disabled = true;
                countTurn = 0;
            }
    }
}


function sendGuessed() {
    const data = {
        status: "guessed",
        sender: username,
    }

    document.getElementById("guess").value = "";    
    if (conn) {
        conn.send(data);
    }

    else {  
        for (var i = 0; i<conns.length; i++) {
            conns[i].send(data);
        }
        if (countTurn < conns.length) {
              
                sendTurn();
                countTurn +=1;
            }

            else if (countTurn == conns.length) {
                myturn = true;
                sendMyTurn();
                getWord();
                document.getElementById("guess").disabled = true;
                countTurn = 0;
            }
    document.getElementById("chatText").innerHTML = data.sender + " guessed the word!" +"<br>"+ document.getElementById("chatText").innerHTML;
    }
}

function sendTurn() {
    
    const data = {
        status: "turn",
    }
    conns[countTurn].send(data);

}

function sendMyTurn() {
    const data = {
        status: "msg",
        message: "I am drawing now!",
        sender: username,
    }

    document.getElementById("guess").value = "";    
    if (conn) {
        conn.send(data);
    }

    else {              
        for (var i = 0; i<conns.length; i++) {
            conns[i].send(data);
        }
    document.getElementById("chatText").innerHTML = data.sender + ": " + data.message +"<br>"+ document.getElementById("chatText").innerHTML;
    }   
    sendTimer();
}


// sendLine is used to send image of canvas to other users
function sendLine() {
    var sigCanvas =document.getElementById("canvasSignature"); 
    // convert canvas element to sendable data
    const lineInfo = sigCanvas.toDataURL();

	
    // check to see if host or not
    if (conn) {
	// if not host just need to send to host
        conn.send(lineInfo);
    }

    else {  
	// if host need to send to all connections in conns array
        for (var i = 0; i<conns.length; i++) {
                        conns[i].send(lineInfo);
        }
    }
}


function sendWord(word) {
    var wordpkg = {
        status: "word",
        secret: word,
    }

     if (conn) {
        conn.send(wordpkg);
    }

    else {              
        for (var i = 0; i<conns.length; i++) {
                        conns[i].send(wordpkg);
        }
    }
}


