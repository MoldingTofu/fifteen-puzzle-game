$(function() {
    FastClick.attach(document.body);
});

var positions = [];
var tiles = [];
var time = 0;
var moves = 0;
var counter = null;
var paused = true;
var optionsOpened = false;
var won = false;
var challenge = false;

$(document).ready(function() {
    $("#grid").swipe( {
        //Generic swipe handler for all directions
        swipe:function(event, direction, distance, duration, fingerCount) {
        	if(!paused){
        		console.log("You swiped " + direction );  
        		moveSwipedTile(direction);
        	}        
        },
        threshold:20
      });
});

$(document).on('click', '.tile', function(){
	if(!paused){
		var num = $(this).attr('num');
		var tile = getTile(num);
		tile.move();
		win();
	}
});

$(document).on('click', '#start-button', function(){
	if(!$(this).hasClass('disabled')){
		if(paused){
			startGame();
		} else {		
			pauseGame();
		}	
	} else {
		showBtnErrorMessage();
	}
});

$(document).on('click', '#reset-button', function(){
	if(!$(this).hasClass('disabled')){
		resetGame();
	} else {
		showBtnErrorMessage();
	}
});

$(document).on('click', '#overlay-play', function(){
	if(!$('#start-button').hasClass('disabled')){
		startGame();
	} else {
		showBtnErrorMessage();
	}
});

$(document).on('click', '#overlay-paused', function(){
	startGame();
});

$(document).on('click', '#overlay-buttons #submit-button', function(){
	if($(this).hasClass('enabled')){
		$('#name-input-field').val('');
		$('#overlay-layer').fadeIn('fast');
		$('#name-input-box').fadeIn('fast');
	}
});

$(document).on('click', '#name-submit-button', function(){
	if($('#name-input-field').val() != ''){
		insertScore($('#name-input-field').val());
		$('#overlay-layer').fadeOut('fast');
		$(this).parent().fadeOut('fast');
		$('#overlay-buttons #submit-button').removeClass('enabled');
		$('#overlay-buttons #submit-button').css('opacity', '0.5');
	}
});

$(document).on('click', '#name-cancel-button', function(){
	$('#overlay-layer').fadeOut('fast');
	$(this).parent().fadeOut('fast');
});

$(document).on('click', '#menu img', function(){
	if(!optionsOpened){
		pauseGame();
		$('#overlay-play').hide();
		$('#overlay-paused').hide();
		$('#overlay-options').show();
		$(this).css('opacity', '0.8');
		optionsOpened = true;
	}
});

$(document).on('click', '#overlay-buttons #share-button', function(){
	window.open('https://www.facebook.com/sharer/sharer.php?u='
			+ encodeURIComponent(location.href),
			'facebook-share-dialog', 'width=626,height=436');
	return false;
});

function startGame(){
	paused = false;
	$('#start-button').html('PAUSE');
	$('#overlay').fadeOut('fast');
	$('#overlay-play').hide();
	$('#overlay-message').hide();
	$('#overlay-submessage').hide();
	$(this).css('opacity', '1');
	if(tiles.length == 0){
		resetContents();
	}
	counter = setInterval(function(){
		time++;
		displayCurrentTime();
	}, 1000);
}

function pauseGame(){
	paused = true;
	$('#start-button').html('START');
	$('#overlay-paused').show();
	$('#overlay').fadeIn('fast');
	clearInterval(counter);
}

function resetGame(){
	pauseGame();
	resetContents();
	$('#overlay-paused').hide();
	$('#overlay-play').show();
	$('#overlay-message').hide();
	$('#overlay-submessage').hide();
	$('#overlay-buttons').hide();
}

function resetContents(){
	tiles = [];
	positions = loadPositions();
	generateTiles(positions);
	time = 0;
	moves = 0;
	$('#score-point .num').html('0');
	$('#timepoint .num').html('00:00');
	won = false;
}

function generateTiles(positions){
	console.log('Generating tiles');
	var position = null;
	var tile = null;
	for(var i = 1; i < 16; i ++){
		position = getRandomFreePosition(positions);
		tile = new Tile(position.x, position.y, i);
		tiles.push(tile);
		tile.insertTile();
		position.free = false;
		position = null;
		tile = null;
	}
}

function addMove(){
	moves++;
	$('#score-point .num').html(moves);
}

function displayCurrentTime(){
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	
	$('#timepoint .num').html(convert(minutes) + ':' + convert(seconds));
}

function convert(n){
    return n > 9 ? "" + n: "0" + n;
}

function win(){
	pauseGame();
	$('#overlay-paused').hide();
	$('#overlay-inner').show();
	$('#overlay-inner #overlay-message').html('YOU WIN!').show();
	var finalTime = $('#timepoint .num').html();
	var finalMoves = $('#score-point .num').html();
	$('#overlay-buttons').show();
	$('#overlay-inner #overlay-submessage').html('<b>Time</b>: ' + finalTime +'&nbsp&nbsp&nbsp<b>Moves</b>: ' + finalMoves).show();
	$('#overlay-buttons #submit-button').addClass('enabled');
	$('#overlay-buttons #submit-button').css(
			'opacity', '1'
		  );
	tiles = [];
	won = true;
    if(localStorage.getItem("challenge_code")!= null){
    	$('#start-button').addClass('disabled');
    	$('#submit-button').click();
    }
}

$(document).keydown(function(e) {
	var tile = null;
	var position = getFreePosition();
	if(!paused){
		e.preventDefault(); 
    	switch(e.which) {
       		case 37: // left
				console.log('left');
					if(position.y < 4){
						tile = getTileInPosition(position.x, position.y + 1);
						tile.move();
					}
        	break;
        	case 38: // up
				console.log('up');
				if(position.x < 4){
					tile = getTileInPosition(position.x + 1, position.y);
					tile.move();
				}
        	break;
        	case 39: // right
				console.log('right');
				if(position.y > 1){
					tile = getTileInPosition(position.x, position.y - 1);
					tile.move();
				}
        	break;
        	case 40: // down
				console.log('down');
				if(position.x > 1){
					tile = getTileInPosition(position.x - 1, position.y);
					tile.move();
				}
        	break;	
			case 27: // esc
				console.log('esc');
				pauseGame();
        	break;
        	default: return;
    	}
	} else {
		switch(e.which) {
		 case 27: 	// esc
			console.log(won);
			if($('#options-inner').is(":visible")){
				$("#options-inner" ).slideUp("slow");
			}
			if($('#new-challenge-box').is(":visible") || $("#challenge-details" ).is(":visible")){
				$("#challenge-button" ).click();
			}
			if($('#challenge-code-input').is(":visible")){
//				$('#challenge-code-input').hide();
//				$('#challenge-button').fadeIn('fast');
			}
			if(paused && $('#timepoint .num').html() != '00:00' && !won){
				startGame();
			}
        break;
		case 13: 	// enter
			console.log('enter');
			if(paused  && !won && !$('#start-button').hasClass('disabled')){
				startGame();
			}
			if(won && !$('#overlay-play').is(":visible")){
				//resetGame();
			}
        break;

        default: return;
    	}
	}
});

$(document).on('keypress', '#name-input-field', function(e){
	if(e.keyCode == 13){
		e.preventDefault();
		if($('#name-input-field').val() != ''){
			insertScore($('#name-input-field').val());
			$('#overlay-layer').fadeOut('fast');
			$(this).parent().fadeOut('fast');
			$('#overlay-buttons #submit-button').removeClass('enabled');
			$('#overlay-buttons #submit-button').css('opacity', '0.5');
		}
	}
});

function moveSwipedTile(direction){
	var pos = getFreePosition();
	var tile = null;
	switch(direction){
		case 'left':
			if(pos.y < 4){
				tile = getTileInPosition(pos.x, pos.y + 1);
				tile.move();
			}
			break;
		case 'right':
			if(pos.y > 1){
				tile = getTileInPosition(pos.x, pos.y - 1);
				tile.move();
			}
			break;
		case 'up':
			if(pos.x < 4){
				tile = getTileInPosition(pos.x + 1, pos.y);
				tile.move();
			}
			break;
		case 'down':
			if(pos.x > 1){
				tile = getTileInPosition(pos.x - 1, pos.y);	
				tile.move();
			}
			break;
		default:
			break;
	}
	
}

function resizeWindowMobile(){
	$('#timepoint').insertAfter('#play-box');
	$('#score-point').insertAfter('#play-box');
}

function resizeWindowDesktop(){
	$('#info-box').prepend($('#timepoint'));
	$('#info-box').prepend($('#score-point'));
}

$( window ).resize(function() {
	setTimeout(function(){
		if($(window).width() < 630){
			resizeWindowMobile();
		} else {
			resizeWindowDesktop();
		}
	}, 500);
});
