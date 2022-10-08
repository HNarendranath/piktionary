'use strict';
var theWord;
var words = ["Strawberry", "Eclipse", "Chandelier", "Ketchup", "Toothpaste", "Rainbow", "Bunkbed", "Boardgame", "Beehive", "Lemon", "Wreath", "Waffles", "Bubble", "Whistle", "Snowball", "Bouquet", "Headphones", "Fireworks", "Igloo", "Ferris wheel", "Banana peel", "Lawnmower", "Summer", "Whisk", "Cupcake", "Sleeping bag", "Bruise", "Fog", "Crust", "Battery", "Paris", "Beach", "Mountains", "Hawaii", "Mount Rushmore", "USA", "Hospital", "Attic", "Japan", "Library", "Desert", "Mars", "Washington DC", "Las Vegas", "Train station", "North Pole", "Farm", "Disney World", "Mexico", "Giraffe", "Koala", "Wasp", "Scorpion", "Lion", "Salamander", "Dolphin", "Frog", "Panda", "Platypus", "T-rex", "Meerkat", "Eagle", "Mailman", "Superman", "Justin Bieber", "Cowboy", "Alexander Hamilton", "Robin Hood", "Vampire", "Pirate", "Girl Scout", "Pikachu", "Spongebob", "Baby Yoda", "Pilgrim", "Cinderella", "Baker", "Abe Lincoln", "Thief", "Leprechaun", "Harry Potter", "Shrek", "Yoshi", "Queen Elizabeth", "Skip", "Burp", "Cook", "Scratch", "Sleep", "Plant", "Purchase", "Text", "Tie", "Snore", "Catch", "Study", "Olympics", "Sandcastle", "Recycle", "Blackhole", "Applause", "Blizzard", "Sunburn", "Time machine", "Lace", "Monday", "Atlantis", "Swamp", "Panama Canal", "Sunscreen", "Dictionary", "Vanilla", "Century"]
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
    //console.log(lineColor);
    //initialize();
}

function changeSize(id) {
    var idValue = id.value;
    width = idValue;
    ////console.log(lineColor);
}


function initialize() {

    
    // get references to the canvas element as well as the 2D drawing context
    var sigCanvas = document.getElementById("canvasSignature");
    //console.log(sigCanvas.width,sigCanvas.clientWidth);
    sigCanvas.height = sigCanvas.clientHeight;
    sigCanvas.width = sigCanvas.clientWidth;
    //console.log(sigCanvas.width, sigCanvas.clientWidth,"hdhf");
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
            ////console.log(position)
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
///         CANVAS STUFF FINISHED. YOU CAN EDIT THE CONTENT BELOW


/*function WriteFile(file) {
}*/

///         LOG MESSAGE TO PAGE


let players = [];

const username = prompt("Enter a username","Guest")

if (username != null) { 
    players.push(username);
    //console.log(username);
    //console.log(players);
}

function getWord() {
	/*var rndnumber = Math.floor(Math.random() * 113);
	var word = words[rndnumber];
	theWord = word;*/
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'c7eff6f615msh1f45f7fd62fb666p1890cejsn4ca8c6c211b4',
			'X-RapidAPI-Host': 'pictionary-charades-word-generator.p.rapidapi.com'
			}
		};

	fetch('https://pictionary-charades-word-generator.p.rapidapi.com/charades?difficulty=medium', options)
		.then(response => response.json())
		.then(response => theWord = response)
		.catch(err => console.error(err));
	document.getElementById("word").innerHTML = theWord;
	sendWord(word);
}


function logMessage() {
    if (document.getElementById("guess").value.trim() != "")  {
        const message = document.getElementById("guess").value;
        ////console.log("the word is: " + theWord);
        //upperW = theWord.toUpperCase();
        if (message.toUpperCase() == String(theWord).toUpperCase()) {
            ////console.log("guessed!!!!")
            //theWord="";
            //myturn = false;
            //document.getElementById("word").innerHTML = "...";
            //document.getElementById("guess").disabled = false;
            clearCanvas();
            sendGuessed();
        }
        //document.getElementById("chatText").innerHTML = (("You: "+message.value) + "<br/>") + document.getElementById("chatText").innerHTML;
        else {
            //console.log(message);
            sendmsg();
        }
    }
    document.getElementById("guess").value = "";
}


function clearCanvas() {
    var canvas = document.getElementById("canvasSignature");
    canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
    //sendLine();
}

///         P2P config etc


var peer = new Peer();
var conn;
var myturn = false;
var conns = [];

peer.on('open', function(id) {
	console.log(id);
    document.getElementById("idLbl").value=id;
});
		
function connect() {
    //console.log("connect function activated");
	var connId = document.getElementById("otherId").value;
	conn = peer.connect(connId);
	document.getElementById("otherId").disabled = true;
	document.getElementById("chatText").innerHTML = "";
	conn.on('open', () => {
		
		document.getElementById("guess").disabled = false;
    });

	conn.on('data', (data) => {
        if (data.status == "msg") {
	       document.getElementById("chatText").innerHTML = data.sender + ": " + data.message +"<br>"+ document.getElementById("chatText").innerHTML;
        }

        else if (data.status == "word") {
            theWord = data.secret;
            //console.log(data.secret);
            //console.log(theWord);
        }

        else if (data.status == "notguessed") {
            clearInterval(x);
            //theWord="";
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
            //theWord="";
            document.getElementById("chatText").innerHTML = data.sender + " guessed the word!" +"<br>"+ document.getElementById("chatText").innerHTML;
            if (myturn == false) {
                document.getElementById("chatText").innerHTML = "The word was " +theWord+"."+"<br>"+ document.getElementById("chatText").innerHTML;
            }
            myturn = false;
            //document.getElementById("chatText").innerHTML = data.sender + " guessed the word!" +"<br>"+ document.getElementById("chatText").innerHTML;
            document.getElementById("word").innerHTML = "...";
            //document.getElementById("otherId").disabled = true;
            document.getElementById("guess").disabled = false;
            clearCanvas();
            

        }

        else if (data.status == "timer"){
            clearInterval(x);
            setTimeout(timer(),5000)
        }

        else if (data.status == "turn") {
            ////console.log("line305")
            myturn = true;
            document.getElementById("guess").disabled = true;
            sendMyTurn();
            getWord();
            
        }


        else {
            var sigCanvas =document.getElementById("canvasSignature");
            ////console.log("linereceived")
            //sigCanvas.getContext("2d").drawImage(data,0,0)
            var image = new Image();
            image.onload = function() {
                sigCanvas.getContext("2d").drawImage(image, 0, 0);
            };
            image.src = data;
        }

	});

	conn.on('close', () => {
		alert("Host Ended Session");
		peer.destroy();
	});

}




let connected;

function copyID() {
	var copyText = document.getElementById("idLbl");
	copyText.select();
	document.execCommand("copy");
		}

peer.on('connection', (connection) => {
    ////console.log("connected")
	var conn1 = connection;
	conns.push(conn1);
    myturn = true;
	document.getElementById("otherId").disabled = true;
	document.getElementById("guess").disabled = true;
    
	connection.on("open",()=>{
		connected = true;
        sendMyTurn();
        getWord();
	});

	connection.on("data", (data) => {
		for (var i = 0; i<conns.length; i++) {
			conns[i].send(data);
		}

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
                ////console.log(conns);
                ////console.log(conns.length);
                ////console.log(countTurn);
                sendTurn();
                countTurn += 1;
            }

            else if (countTurn == conns.length) {
                //console.log(conns.length);
                //console.log(countTurn);
                myturn = true;
                sendMyTurn();
                getWord();
                document.getElementById("guess").disabled = true;
                countTurn = 0;
            }
            
        }


        else {
            var sigCanvas =document.getElementById("canvasSignature");
            //console.log("linereceived")
            //sigCanvas.getContext("2d").drawImage(data,0,0)
            var image = new Image();
            image.onload = function() {
                sigCanvas.getContext("2d").drawImage(image, 0, 0);
            };
            image.src = data;
        }
	});

	connection.on('close',()=>{
		////console.log("connection closed");
	})

});

function sendmsg() {
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



function timer() {
    const displayTimer = document.getElementById("timerH2");
    var timeLeft = 90;
    x = setInterval(()=>{
        //console.log(timeLeft);
        displayTimer.innerHTML = timeLeft;
        timeLeft -= 1;
        if (timeLeft == -1) {
            clearInterval(x);
            //document.getElementById("chatText").innerHTML = "The word was not guessed. It was " +theWord+"."+"<br>"+ document.getElementById("chatText").innerHTML;
            sendNotGuessed()
            clearCanvas()
        }

    },1000)

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
                //console.log("fhfhfhfhfhhf")
                myturn = false;
                document.getElementById("word").innerHTML = "...";
                sendTurn();
                countTurn +=1;
            }

            else if (countTurn == conns.length) {
                //console.log(conns.length);
                //console.log(countTurn);
                //console.log("elsif");
                myturn = true;
                sendMyTurn();
                getWord();
                document.getElementById("guess").disabled = true;
                countTurn = 0;
            }

        /*for (var i = 0; i<conns.length; i++) {
            conns[i].send(data);
        }*/
    
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
                //console.log("fhfhfhfhfhhf")
                sendTurn();
                countTurn +=1;
            }

            else if (countTurn == conns.length) {
                //console.log(conns.length);
                //console.log(countTurn);
                //console.log("elsif");
                myturn = true;
                sendMyTurn();
                getWord();
                document.getElementById("guess").disabled = true;
                countTurn = 0;
            }

        /*for (var i = 0; i<conns.length; i++) {
            conns[i].send(data);
        }*/
    document.getElementById("chatText").innerHTML = data.sender + " guessed the word!" +"<br>"+ document.getElementById("chatText").innerHTML;
    }
}

function sendTurn() {
    
    const data = {
        status: "turn",
    }
    //console.log(countTurn)
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

function sendLine() {
    var sigCanvas =document.getElementById("canvasSignature"); 
    const lineInfo = sigCanvas.toDataURL();

    if (conn) {
        conn.send(lineInfo);
    }

    else {              
        for (var i = 0; i<conns.length; i++) {
                        conns[i].send(lineInfo);
        }
    //document.getElementById("chatText").innerHTML = data.sender + " - " + data.message +"<br>"+ document.getElementById("chatText").innerHTML;
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

///         END OF CHAT FUNCTION*/
