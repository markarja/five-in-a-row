	var EMPTY = "res/placeholder.png";
	var BLACK = "res/black.png";
	var GREY = "res/grey.png";
	var YELLOW = "res/yellow.png";
	var AUDIO_ON = "res/sound.png";
	var AUDIO_MUTED = "res/sound.mute.png";
	var URL_INFORMATION_ICON = "url(res/information.png)";
	var URL_WARNING_ICON = "url(res/warning.png)";
	var URL_TROPHY_ICON = "url(res/trophy.png)";
	var URL_USER_ICON = "url(res/user.small.png)";
	var START_AUDIO = "res/start.mp3";
	var TROPHY_AUDIO = "res/trophy.mp3";
	var PLACE_PIECE_AUDIO = "res/place.mp3";
	var ERROR_AUDIO = "res/error.mp3";
	var TIMER_AUDIO = "res/timer.mp3";
	var TIMER_RESTART_AUDIO = "res/timer.restart.mp3";
	
	var COUNT = 5;
	var gameover = false;
	var audio = true;
	var interval;
	
	function init(start) {
		
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

		document.getElementById("status").innerHTML = "Welcome to Five in a row! " +
		"<p>A two-player puzzle game. The goal is to assemble 5 pieces in a straight line either horizontally, " +
		"vertically or diagonally. You have 5 seconds time to place your piece, otherwise the turn is passed to " + 
		"the other player. The first player to place 5 pieces in a straight line wins! " + 
		"<p>If you like this game, please write a review to help develop it further. Have fun!</p>";
		
		if(start) {
			
			playAudio(START_AUDIO, audio);
			
			document.getElementById("player").value = Math.floor(Math.random() * 2) + 1;
			document.getElementById("status").style.backgroundImage = URL_INFORMATION_ICON;
			document.getElementById("status").innerHTML = 
					" <img src='" + imageURL(document.getElementById("player").value) + "' class='piece' /> " 
					+ document.getElementById("p" + document.getElementById("player").value).value + ", your turn.";
			
			gameover = false;

			startTimer();
		}
		
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
	
	function stopTimer() {
		window.clearInterval(interval);
	}
	
	function startTimer() {
		window.clearInterval(interval);
		var imageIndex = 4;
		interval = window.setInterval(function() {
			if(imageIndex > 0) {
				playAudio(TIMER_AUDIO, audio);
				document.getElementById("timerimage").src = "res/timer." + imageIndex + ".png";
				document.getElementById("status").style.backgroundColor = "rgb(30,30,30)";
				imageIndex--;
			} else {
				playAudio(TIMER_RESTART_AUDIO, audio);
				document.getElementById("timerimage").src = "res/timer.alert.png";
				document.getElementById("status").style.backgroundColor = "rgb(255,0,0)";
				window.clearInterval(interval);
				var timeout = window.setTimeout(function () {
					document.getElementById("player").value = (document.getElementById("player").value == 1) ? 2 : 1;
					document.getElementById("status").style.backgroundImage = URL_INFORMATION_ICON;
					document.getElementById("status").innerHTML = 
						" <img src='" + imageURL(document.getElementById("player").value) + "' class='piece' /> " + 
						document.getElementById("p" + document.getElementById("player").value).value + ", your turn.";
					document.getElementById("timerimage").src = "res/timer.5.png";
					window.clearTimeout(timeout);
					startTimer();
				}, 1000);
			}
		}, 1000);
	}
	
	function select(id) {
		if(!gameover) {
			startTimer();
		 	if(document.getElementById(id).src.indexOf(EMPTY) > -1) {
				if(document.getElementById("player").value == 1) {
					document.getElementById(id).src = GREY;
					playAudio(PLACE_PIECE_AUDIO, audio);
					if(!check(document.getElementById("player").value)) {
						document.getElementById("player").value = 2;
						document.getElementById("status").style.backgroundImage = URL_INFORMATION_ICON;
						document.getElementById("status").innerHTML = 
							" <img src='" + imageURL(2) + "' class='piece' /> " + document.getElementById("p" + 2).value + ", your turn.";
					} else {
						gameover = true;
					}
				} else {
					document.getElementById(id).src = BLACK;
					playAudio(PLACE_PIECE_AUDIO, audio);
					if(!check(document.getElementById("player").value)) {
						document.getElementById("player").value = 1;
						document.getElementById("status").style.backgroundImage = URL_INFORMATION_ICON;
						document.getElementById("status").innerHTML = 
							" <img src='" + imageURL(1) + "' class='piece' /> " + document.getElementById("p" + 1).value + ", your turn.";
					} else {
						gameover = true;
					}
				}
			} else {
				//play audio
				document.getElementById("status").innerHTML = "The field is occupied.";
				document.getElementById("status").style.backgroundImage = URL_WARNING_ICON;
				playAudio(ERROR_AUDIO, audio);
				var timeout = window.setTimeout(function() {
					document.getElementById("status").style.backgroundImage = URL_INFORMATION_ICON;
					document.getElementById("status").innerHTML = 
						" <img src='" + imageURL(document.getElementById("player").value) + "' class='piece' /> " 
						+ document.getElementById("p" + document.getElementById("player").value).value + ", your turn.";
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
			stopTimer();
			document.getElementById("status").style.backgroundImage = URL_TROPHY_ICON;
			document.getElementById("status").innerHTML = "<b> <img src='" + imageURL(player) + "' class='piece' /> " + document.getElementById("p" + player).value + " wins!</b> Game over!";
			playAudio(TROPHY_AUDIO, audio);
			return true;
		} else {
			return false;
		}
	}
	
	function onAudioError() {
		alert("code: " + error.code + "\n" + 
	          "message: " + error.message + "\n");
	}
	
	function playAudio(audioSource, audio) {
		if(audio) {
			document.getElementById("audioplayer").src = audioSource;
			var audio = document.getElementById("audioplayer");
			/*if(device.platform == "Android") {
				audio = new Media("/android_asset/www/" + audioSource, 
						function() { audio.release(); }
						, onAudioError);
				audio.play();	
			} else {*/
				audio.play();
			//}
			
		}
	}
	
	function dialog(show) {
		if(!show) {
			if(document.getElementById("p1").value.trim() == "" || document.getElementById("p1").value.trim() == "") {
				document.getElementById("dialogtitle").innerHTML = "Enter a name for both players!";
				document.getElementById("dialog").style.backgroundImage = URL_WARNING_ICON;
				playAudio(ERROR_AUDIO, audio);
				var timeout = window.setTimeout(function() {
					document.getElementById("dialog").style.backgroundImage = URL_USER_ICON;
					document.getElementById("dialogtitle").innerHTML = "Name your players";
				}, 2000);
				return;
			}
			document.getElementById("dialog").style.visibility = "hidden";
			document.getElementById("dialog").style.top = "120px";
			document.getElementById("overlay").style.visibility = "hidden";
			document.getElementById("status").style.visibility = "visible";
			document.getElementById("timer").style.visibility = "visible";
			document.getElementById("playingfield").style.visibility = "visible";
			document.getElementById("buttons").style.visibility = "visible";
			
			init(true);
		} else {
			document.getElementById("dialog").style.visibility = "visible";
			document.getElementById("overlay").style.visibility = "visible";		
			stopTimer();
		}
	}