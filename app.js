var EMPTY = "res/placeholder.png";
var BLACK = "res/black.png";
var GREY = "res/grey.png";
var YELLOW = "res/yellow.png";
var AUDIO_ON = "res/sound.png";
var AUDIO_MUTED = "res/sound.mute.png";
var URL_INFORMATION_ICON = "url(res/information.png)";
var URL_WARNING_ICON = "url(res/warning.png)";
var URL_TROPHY_ICON = "url(res/trophy.png)";
var START_AUDIO = "res/start.mp3";
var TROPHY_AUDIO = "res/trophy.mp3";
var PLACE_PIECE_AUDIO = "res/place.mp3";
var ERROR_AUDIO = "res/error.mp3";

var COUNT = 5;
var gameover = false;
var audio = true;

function init() {
	
	if(audio) {
		document.getElementById("audioplayer").src = START_AUDIO;
		document.getElementById("audioplayer").play();
	}
	
	var height = window.innerHeight - 100;
	height = Math.floor(height / 10);
	
	for(var i = 0;i < 10;i++) {
		document.getElementById("r" + i).style.height = height + "px";
	}
	
	for(var i = 0;i < 10;i++) {
		for(var j = 0;j < 10;j++) {
			document.getElementById(i + "" + j).src = EMPTY;
		}
	}
	
	document.getElementById("player").value = Math.floor(Math.random() * 2) + 1;
	document.getElementById("status").style.backgroundImage = URL_INFORMATION_ICON;
	document.getElementById("status").innerHTML = 
			" <img src='" + imageURL(document.getElementById("player").value) + "' class='piece' /> player, your turn.";
	
	gameover = false;
}

function imageURL(playerId) {
	return (playerId == 1) ? GREY : BLACK;
}

function toggleAudio(src) {
	if(src.indexOf("sound.png") > -1) {
		audio = false;
		document.getElementById("toggleAudioButton").src = AUDIO_MUTED;
	} else {
		audio = true;
		document.getElementById("toggleAudioButton").src = AUDIO_ON;
	}
}

function select(id) {
	if(!gameover) {
	 	if(document.getElementById(id).src.indexOf(EMPTY) > -1) {
			if(document.getElementById("player").value == 1) {
				document.getElementById(id).src = GREY;
				if(audio) {
					document.getElementById("audioplayer").src = PLACE_PIECE_AUDIO;
					document.getElementById("audioplayer").play();
				}
				if(!check(document.getElementById("player").value)) {
					document.getElementById("player").value = 2;
					document.getElementById("status").style.backgroundImage = URL_INFORMATION_ICON;
					document.getElementById("status").innerHTML = " <img src='" + imageURL(2) + "' class='piece' /> player, your turn.";
				} else {
					gameover = true;
				}
			} else {
				document.getElementById(id).src = BLACK;
				if(audio) {
					document.getElementById("audioplayer").src = PLACE_PIECE_AUDIO;
					document.getElementById("audioplayer").play();
				}
				if(!check(document.getElementById("player").value)) {
					document.getElementById("player").value = 1;
					document.getElementById("status").style.backgroundImage = URL_INFORMATION_ICON;
					document.getElementById("status").innerHTML = " <img src='" + imageURL(1) + "' class='piece' /> player, your turn.";
				} else {
					gameover = true;
				}
			}
		} else {
			//play audio
			document.getElementById("status").innerHTML = "The field is occupied.";
			document.getElementById("status").style.backgroundImage = URL_WARNING_ICON;
			if(audio) {
				document.getElementById("audioplayer").src = ERROR_AUDIO;
				document.getElementById("audioplayer").play();
			}
			var timeout = window.setTimeout(function() {
				document.getElementById("status").style.backgroundImage = URL_INFORMATION_ICON;
				document.getElementById("status").innerHTML = 
					" <img src='" + 
					imageURL(document.getElementById("player").value)
					+ "' class='piece' /> player, your turn.";
				window.clearTimeout(timeout);
			}, 2000);
		}
	}
}

function check(player) {
	
	var ids = Array();
	var candidate = "";
	var count = 0;
	var found = false;
	
	//Checking rows
	for(var i = 0;i < 10;i++) {
		if(count == COUNT) break;
		count = 0;
		ids = Array();
		for(var j = 0;j < 10;j++) {
			if(candidate == document.getElementById(i + "" + j).src) {
				count++;
				ids.push(i + "" + j);
				if(count == COUNT) {
					break;
				}
			} else {
				count = 0;
				ids = Array();
				if(document.getElementById(i + "" + j).src.indexOf(GREY) > -1 ||
				   document.getElementById(i + "" + j).src.indexOf(BLACK) > -1) {
					candidate = document.getElementById(i + "" + j).src;
					count++;
					ids.push(i + "" + j);
				} 
			}
		}
	}
	
	if(count != 4) {
	
		candidate = "";
		
		//Checking columns
		for(var i = 0;i < 10;i++) {
			if(count == COUNT) break;
			count = 0;
			ids = Array();
			for(var j = 0;j < 10;j++) {
				if(candidate == document.getElementById(j + "" + i).src) {
					count++;
					ids.push(j + "" + i);
					if(count == COUNT) {
						break;
					}
				} else {
					count = 0;
					ids = Array();
					if(document.getElementById(j + "" + i).src.indexOf(GREY) > -1 ||
					   document.getElementById(j + "" + i).src.indexOf(BLACK) > -1) {
						candidate = document.getElementById(j + "" + i).src;
						count++;
						ids.push(j + "" + i);
					} 
				}
			}
		}
	
	}
	
	if(count != 4) {
		
		candidate = "";
		
		//Checking diagonals from north-east to south-west in north-western half.
		
		for(var i = 3;i < 10;i++) {
			if(count == COUNT) break;
			count = 0;
			ids = Array();
			var j = i;
			var k = 0;
			while(j >= 0) {
				if(candidate == document.getElementById(k + "" + j).src) {
					count++;
					ids.push(k + "" + j);
					if(count == COUNT) {
						break;
					}
				} else {
					count = 0;
					ids = Array();
					if(document.getElementById(k + "" + j).src.indexOf(GREY) > -1 ||
					   document.getElementById(k + "" + j).src.indexOf(BLACK) > -1) {
						candidate = document.getElementById(k + "" + j).src;
						count++;
						ids.push(k + "" + j);
					} 
				}
				j--;
				k++;
			}
		}
	
	}
	
	if(count != 4) {
		
		candidate = "";
	
		//Checking diagonals from north-east to south-west in south-eastern half.
		
		for(var i = 1;i < 10;i++) {
			if(count == COUNT) break;
			count = 0;
			ids = Array();
			var k = i;
			j = 9;
			while(j >= i) {
				if(candidate == document.getElementById(k + "" + j).src) {
					count++;
					ids.push(k + "" + j);
					if(count == COUNT) {
						break;
					}
				} else {
					count = 0;
					ids = Array();
					if(document.getElementById(k + "" + j).src.indexOf(GREY) > -1 ||
					   document.getElementById(k + "" + j).src.indexOf(BLACK) > -1) {
						candidate = document.getElementById(k + "" + j).src;
						count++;
						ids.push(k + "" + j);
					} 
				}
				k++;
				j--;
			}
		}
		
	}
	
	if(count != 4) {
		
		candidate = "";
		
		//Checking diagonals from north-west to south-east in north-eastern half.
		
		for(var i = 0;i < 10;i++) {
			if(count == COUNT) break;
			count = 0;
			ids = Array();
			var j = i;
			var k = 0;
			while(j < 10) {
				if(candidate == document.getElementById(k + "" + j).src) {
					count++;
					ids.push(k + "" + j);
					if(count == COUNT) {
						break;
					}
				} else {
					count = 0;
					ids = Array();
					if(document.getElementById(k + "" + j).src.indexOf(GREY) > -1 ||
					   document.getElementById(k + "" + j).src.indexOf(BLACK) > -1) {
						candidate = document.getElementById(k + "" + j).src;
						count++;
						ids.push(k + "" + j);
					} 
				}
				j++;
				k++;
			}
		}
	
	}
	
	if(count != 4) {
		
		candidate = "";
	
		//Checking diagonals from north-west to south-east in south-western half.
		
		for(var i = 1;i < 10;i++) {
			if(count == COUNT) break;
			count = 0;
			ids = Array();
			var k = i;
			j = 0;
			while(j < 10 - i) {
				if(candidate == document.getElementById(k + "" + j).src) {
					count++;
					ids.push(k + "" + j);
					if(count == COUNT) {
						break;
					}
				} else {
					count = 0;
					ids = Array();
					if(document.getElementById(k + "" + j).src.indexOf(GREY) > -1 ||
					   document.getElementById(k + "" + j).src.indexOf(BLACK) > -1) {
						candidate = document.getElementById(k + "" + j).src;
						count++;
						ids.push(k + "" + j);
					} 
				}
				k++;
				j++;
			}
		}
		
	}
	
	if(count == COUNT) {
		for(var i = 0;i < ids.length;i++) {
			document.getElementById(ids[i]).src = YELLOW;
		}
		document.getElementById("status").style.backgroundImage = URL_TROPHY_ICON;
		document.getElementById("status").innerHTML = "<b> <img src='" + imageURL(player) + "' class='piece' /> player wins!</b> Game over!";
		if(audio) {
			document.getElementById("audioplayer").src = TROPHY_AUDIO;
			document.getElementById("audioplayer").play();
		}
		return true;
	} else {
		return false;
	}
}