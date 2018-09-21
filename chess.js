var r = 35,between = 6;
var row = 16,column = 9;

var player = 2;
var roundis = 1,roundCount = 0;
var ready = false;

function setup() {
	canvas = createCanvas(900,450).parent('processing');
	firebaseSetup();
	submit();

	ghostBoardSteup()
	mapSetup();
}
function draw() {
  	background(200); 

  	if(login){
	  	ghostcleaner();
	  	roundown();
	  	drawSprites();

	  	textAlign(CENTER);
	  	textStyle(BOLD);
	  	text('Round: '+roundis, width/2, 30);
	  	text(upData.Lplayer, 60, 30);
	  	text(upData.Rplayer, width-60, 30);
	  	textStyle(ITALIC);
		text('lost angels with dirty tears', width/2, height-20);

		if(pointMe!=0){
			for(var i =0;i<mapData.length;i++){
				if(mapData[i].mapGhost == pointMe && mapData[i].user >0){
					stroke(0);
					fill(255,200);
					rectMode(CORNER);
					rect(mouseX,mouseY,100,120);
					noStroke();
					fill(0);
					textAlign(LEFT);
					textStyle(NORMAL);
					text('Player: '+mapData[i].user,mouseX+10,mouseY+13*2);
					text('Name: '+mapData[i].ghostName,mouseX+10,mouseY+13*3);
					text('Step: '+mapData[i].step,mouseX+10,mouseY+13*4);
					text('Attack: '+mapData[i].attack,mouseX+10,mouseY+13*5);
					text('AttackRange: '+mapData[i].attackRange,mouseX+10,mouseY+13*6);
					text('Ability: '+mapData[i].ability,mouseX+10,mouseY+13*7);
					text('Movable: '+mapData[i].chessMovable,mouseX+10,mouseY+13*8);
				}
			}
		}
				
	}
}
function roundown(){
	if(roundCount % 4 ==0){
		//move
		//console.log('i am ready');
		if(ready){
			roundis += 1;
			roundCount += 1;
			var userRef = database.ref("chess/"+roomCode_key);
			var mapfire = [];
			for(var i=0;i<mapData.length;i++){
				if(mapData[i].user == player){
					var data = {
						user : mapData[i].user,
						ghostName: mapData[i].ghostName,
						amount : mapData[i].amount,
						step : mapData[i].step,
						attack : mapData[i].attack,
						attackRange : mapData[i].attackRange,
						ability : mapData[i].ability,
						row :　mapData[i].row,
						column : mapData[i].column,
						x : mapData[i].x,
						y : mapData[i].y,
						chessMovable : mapData[i].chessMovable,
					}
					mapfire.push(data);
				}
			}
			if(player == 1){
				userRef.update ({
					"Lmapdata" : mapfire,
					"Lroundis" : roundis
				});
			}else if(player ==2){
				userRef.update ({
					"Rmapdata" : mapfire,
					"Rroundis" : roundis
				});
			}
		}
	}else if(roundCount % 4 ==1){
		//data update
		console.log(roundCount);
		if(upData.Rroundis == upData.Lroundis){
			var enemy = (player == 1)? 2:1;
			for(var i=0;i<mapData.length;i++){
				if(mapData[i].user == enemy){
					mapData[i].amount = 0;
					mapData[i].ghost.remove();
				}
			}
			ghostcleaner();
			if(player ==1){
				for(var i=0;i<upData.Rmapdata.length;i++){
					var r1ud_who = upData.Rmapdata[i].row*column+upData.Rmapdata[i].column;
					if(mapData[r1ud_who].user==0){
						var farmer = createSprite(upData.Rmapdata[i].x,upData.Rmapdata[i].y,r-3,r-3);
						mapData[r1ud_who].user = enemy;
						mapData[r1ud_who].ghost = farmer;
						mapData[r1ud_who].ghostName = upData.Rmapdata[i].ghostName;
						mapData[r1ud_who].amount = upData.Rmapdata[i].amount;
						mapData[r1ud_who].step = upData.Rmapdata[i].step;
						mapData[r1ud_who].attack = upData.Rmapdata[i].attack;
						mapData[r1ud_who].attackRange = upData.Rmapdata[i].attackRange;
						mapData[r1ud_who].ability = upData.Rmapdata[i].ability;
					}else if(mapData[r1ud_who].user > 0){
						if(mapData[r1ud_who].amount * mapData[r1ud_who].attack > upData.Rmapdata[i].amount * upData.Rmapdata[i].attack){
							mapData[r1ud_who].amount -=	upData.Rmapdata[i].amount * upData.Rmapdata[i].attack;
							console.log('move & kill');
						}else if(mapData[r1ud_who].amount * mapData[r1ud_who].attack < upData.Rmapdata[i].amount * upData.Rmapdata[i].attack){
							upData.Lmapdata[i].amount -= mapData[r1ud_who].amount * mapData[r1ud_who].attack;
							var farmer = createSprite(upData.Rmapdata[i].x,upData.Rmapdata[i].y,r-3,r-3);
							mapData[r1ud_who].user = enemy;
							mapData[r1ud_who].ghost = farmer;
							mapData[r1ud_who].ghostName = upData.Rmapdata[i].ghostName;
							mapData[r1ud_who].amount = upData.Rmapdata[i].amount;
							mapData[r1ud_who].step = upData.Rmapdata[i].step;
							mapData[r1ud_who].attack = upData.Rmapdata[i].attack;
							mapData[r1ud_who].attackRange = upData.Rmapdata[i].attackRange;
							mapData[r1ud_who].ability = upData.Rmapdata[i].ability;
							console.log('move & bekill');
						}
					}
					ghostDrawer(mapData[r1ud_who]);
				}
			}else if(player == 2){
				for(var i=0;i<upData.Lmapdata.length;i++){
					var r1ud_who = upData.Lmapdata[i].row*column+upData.Lmapdata[i].column;
						if(mapData[r1ud_who].user==0){
							var farmer = createSprite(upData.Lmapdata[i].x,upData.Lmapdata[i].y,r-3,r-3);
							mapData[r1ud_who].user = enemy;
							mapData[r1ud_who].ghost = farmer;
							mapData[r1ud_who].ghostName = upData.Lmapdata[i].ghostName;
							mapData[r1ud_who].amount = upData.Lmapdata[i].amount;
							mapData[r1ud_who].step = upData.Lmapdata[i].step;
							mapData[r1ud_who].attack = upData.Lmapdata[i].attack;
							mapData[r1ud_who].attackRange = upData.Lmapdata[i].attackRange;
							mapData[r1ud_who].ability = upData.Lmapdata[i].ability;
						}else if(mapData[r1ud_who].user > 0){
							if(mapData[r1ud_who].amount * mapData[r1ud_who].attack > upData.Lmapdata[i].amount * upData.Lmapdata[i].attack){
								mapData[r1ud_who].amount -=	upData.Lmapdata[i].amount * upData.Lmapdata[i].attack;
								console.log('move & kill');
							}else if(mapData[r1ud_who].amount * mapData[r1ud_who].attack < upData.Lmapdata[i].amount * upData.Lmapdata[i].attack){
								upData.Lmapdata[i].amount -= mapData[r1ud_who].amount * mapData[r1ud_who].attack;
								var farmer = createSprite(upData.Lmapdata[i].x,upData.Lmapdata[i].y,r-3,r-3);
								mapData[r1ud_who].user = enemy;
								mapData[r1ud_who].ghost = farmer;
								mapData[r1ud_who].ghostName = upData.Lmapdata[i].ghostName;
								mapData[r1ud_who].amount = upData.Lmapdata[i].amount;
								mapData[r1ud_who].step = upData.Lmapdata[i].step;
								mapData[r1ud_who].attack = upData.Lmapdata[i].attack;
								mapData[r1ud_who].attackRange = upData.Lmapdata[i].attackRange;
								mapData[r1ud_who].ability = upData.Lmapdata[i].ability;
								console.log('move & bekill');
							}
						}
					ghostDrawer(mapData[r1ud_who]);
				}
			}
			roundCount += 1;
		}
	}else if(roundCount % 4 ==2){
		//attack and ability
		//console.log('attack and ability');
		attack();
		roundCount += 1;
	}else if(roundCount % 4 ==3){
		//mega envolve
		//console.log('mega envolve');
		mega();
		roundCount += 1;

		var readyButton = createButton('ready');
		var readyButtonX = (player== 1)? 50:width-30-readyButton.width;
		readyButton.position(readyButtonX,height/2);
		readyButton.mousePressed( function(){
			if(roundCount %4 == 0){
				ready = !ready;
				for(var i=0;i<mapData.length;i++){
			  		mapData[i].chessMovable = false;
			  	} 
				console.log('ready');
				readyButton.remove();
			}
		});
		ready = !ready;
		for(var i=0;i<mapData.length;i++){
	  		if(mapData[i].user >0){
	  			mapData[i].chessMovable = true;
	  		}
	  	} 
	}
}


var mapData = [];
var chessMoving = 0;
var targetLock;
var move;
function mapSetup(){
	for(var i = 0; i<row; i++) {
		for(var j = 0; j<column; j++){
			var map_x = i*(r+between) + (width-((row-1)*(r+between)))/2;
			var map_y = j*(r+between) + (height-(column-1)*(r+between))/2;
			var emptyGhost = createSprite(map_x,map_y,r,r);
			var data = {
				user : 0,
				ghost : 0,
				ghostName: 0,
				amount : 0,
				step : 0,
				attack : 0,
				attackRange : 0,
				ability : 0,
				mapGhost: emptyGhost,
				row :　i,
				column : j,
				x : emptyGhost.position.x,
				y : emptyGhost.position.y,
				getHurt : 0,
				chessMovable : false,
			}
			mapData.push(data);
			
			emptyGhost.draw = function(){
				fill(255);
				rect(0,0,r,r);
			}
			emptyGhost.onMousePressed = function() {
				for(var k =0;k<mapData.length;k++){
					if(mapData[k].mapGhost == this){
						console.log(mapData[k]);
						if(chessMoving == 0){
							if(mapData[k].user==player){
								if(mapData[k].chessMovable){
									chessMoving = mapData[k];
								}
							}
						}else if(chessMoving !=0 && move == 1){
							if(mapData[k]!= chessMoving && distanceMovable(chessMoving,mapData[k])){
								dataInherit(chessMoving,mapData[k]);
								move = 0;
							}else{
								move = 0;
								chessMoving = 0;
							}
						}
					}	
				}
			};
			
			emptyGhost.onMouseReleased = function() {
				for(var k =0;k<mapData.length;k++){
					mapData[k].mapGhost.draw = function(){
						fill(255);
						rect(0,0,r,r);
					}
					if(mapData[k].mapGhost == this){
						if(chessMoving != 0){
							if(chessMoving == mapData[k]){
								chessMoving = chessMoving;
								move = 1;
							}else{
								if(mapData[k].user == player || mapData[k].user == 0){
									if(mapData[k]!= chessMoving && distanceMovable(chessMoving,mapData[k])){
										deliver(chessMoving,mapData[k]);
									}else{
										chessMoving = 0;
									}
								}
							}
						}
					}
				}
			};
			emptyGhost.onMouseOver = function() {
				this.draw = function(){
					fill(255);
					if(chessMoving==0){
						stroke(255,0,0);
					}else{
						//for()
						if(distanceMovable(chessMoving,mapDataFounder(this))){
							stroke(0,0,255);
						}else{
							stroke(255,0,0);
						}
					}
					rect(0,0,r,r);
				}
				pointMe=this;
			};
			emptyGhost.onMouseOut = function() {
				this.draw = function(){
					fill(255);
					noStroke();
					rect(0,0,r,r);
				}
				pointMe =0;
			};
		}
	}
}
var pointMe;
function farmer(team,data) {
	var readyButton = createButton('ready');
	var readyButtonX = (player== 1)? 50:width-30-readyButton.width;
	readyButton.position(readyButtonX,height/2);

	readyButton.mousePressed( function(){
		if(roundCount %4 == 0){
			ready = !ready;
			for(var i=0;i<mapData.length;i++){
		  		mapData[i].chessMovable = false;
		  	} 
			console.log('ready');
			readyButton.remove();
		}
	});

	for(var i=0;i<team;i++){
		var farmer = createSprite(mapData[i*2].x,mapData[i*2].y,r-3,r-3);
		//ghostDrawer(mapData[i*2]);   <-----farmar is not data	
		farmer.draw = function(){
			fill(100,0,0);
			noStroke();
			rectMode(CENTER);
			rect(0,0,r-3,r-3);
			fill(255);
			textAlign(CENTER);
			text(data,0,5);
		}

		mapData[i*2].user = 1;
		mapData[i*2].ghost = farmer;
		mapData[i*2].ghostName = 'farmer';
		mapData[i*2].amount = data;
		mapData[i*2].step = 2;
		mapData[i*2].attack = 1;
		mapData[i*2].attackRange = 1;
		mapData[i*2].ability = 0;

		farmer = createSprite(mapData[mapData.length-1-i*2].x,mapData[mapData.length-1-i*2].y,r-3,r-3);
		//ghostDrawer(mapData[mapData.length-1-i*2]);   <-----farmar is not data
		farmer.draw = function(){
			fill(100);
			noStroke();
			rectMode(CENTER);
			rect(0,0,r-3,r-3);
			fill(255);
			textAlign(CENTER);
			text(data,0,5);
		}
		mapData[mapData.length-1-i*2].user = 2;
		mapData[mapData.length-1-i*2].ghost = farmer;
		mapData[mapData.length-1-i*2].ghostName = 'farmer';
		mapData[mapData.length-1-i*2].amount = data;
		mapData[mapData.length-1-i*2].step = 2;
		mapData[mapData.length-1-i*2].attack = 1;
		mapData[mapData.length-1-i*2].attackRange = 1;
		mapData[mapData.length-1-i*2].ability = 0;
	}
}
function deliver(OldData,NewData){
	if(OldData.amount ==1){
		dataInherit(OldData,NewData);
	}else{
		if(NewData.user == 0){
			console.log('[181]: ' ,OldData.row,OldData.column ,' deliver ',ceil(OldData.amount/2), ' to ' , NewData.row,NewData.column);
			OldData.chessMovable = false;
				var ghost = createSprite(NewData.x,NewData.y,r-3,r-3);
				NewData.user = OldData.user;
				NewData.ghost = ghost ;
				NewData.ghostName =OldData.ghostName ;
				NewData.amount += ceil(OldData.amount/2);
				NewData.step = OldData.step;
				NewData.attack = OldData.attack;
				NewData.attackRange = OldData.attackRange;
				NewData.ability = OldData.ability;
					OldData.amount -= ceil(OldData.amount/2);
					ghostDrawer(NewData);		
					ghostDrawer(OldData);
			chessMoving = 0;
		}else if(NewData.user == player){
			if(NewData.ghostName == OldData.ghostName){
				console.log('[203]: ' ,OldData.row,OldData.column ,' deliver-plus ',ceil(OldData.amount/2), ' to ' , NewData.row,NewData.column);
				OldData.chessMovable = false;
					NewData.amount += ceil(OldData.amount/2);
					OldData.amount -= ceil(OldData.amount/2);
						ghostDrawer(OldData);
						ghostDrawer(NewData);
				chessMoving = 0;
			}else{
				chessMoving = 0;
			}
		}
	}
}
//move
function dataInherit(OldData,NewData){
	OldData.chessMovable = false;
		var changeuser = NewData.user;
		var changeghost = NewData.ghost;
		var changeghostName = NewData.ghostName;
		var changeAmount = NewData.amount;
		var changeStep = NewData.step;
		var changeAttack = NewData.attack;
		var changeAttackRange = NewData.attackRange;
		var changeAbility = NewData.ability;
		var changeX = NewData.x;
		var changeY = NewData.y;
			NewData.user = OldData.user;
			NewData.ghost =OldData.ghost ;
			NewData.ghostName =OldData.ghostName ;
			NewData.amount = OldData.amount;
			NewData.step = OldData.step;
			NewData.attack = OldData.attack;
			NewData.attackRange = OldData.attackRange;
			NewData.ability = OldData.ability;
				OldData.user = changeuser;
				OldData.ghost = changeghost;
				OldData.ghostName = changeghostName;
				OldData.amount = changeAmount;
				OldData.step = changeStep;
				OldData.attack = changeAttack;
				OldData.attackRange = changeAttackRange;
				OldData.ability = changeAbility;

				NewData.ghost.position.x = NewData.x;
				NewData.ghost.position.y = NewData.y;
				ghostDrawer(NewData);
				if(OldData.ghost !=0){
					console.log('[241]: ' ,OldData.row , OldData.column ,' change position with ', NewData.row , NewData.column);
					OldData.ghost.position.x = OldData.x;
					OldData.ghost.position.y = OldData.y;
					ghostDrawer(OldData);
				}else{
					console.log('[246]: ' ,OldData.row , OldData.column ,' move to ', NewData.row , NewData.column);
				}
	chessMoving = 0;
}

function distanceMovable(me,there){
	if(abs(there.row - me.row)<= me.step && abs(there.column - me.column)<=me.step){
		return true;
	}else{
		false;
	}
}

function mapDataFounder(data){
	for(var i =0;i<mapData.length;i++){
		if(mapData[i].mapGhost == data){
			var ghost = mapData[i];
			return ghost;
		}
	}
}
function ghostDrawer(data){
	data.ghost.draw = function(){
		if(data.ghostName == 'farmer'){
			if(data.user==1){
				fill(100,0,0);
			}else if(data.user==2){
				fill(100);
			}
			noStroke();
			rectMode(CENTER);
			rect(0,0,r-3,r-3);
			fill(255);
			textAlign(CENTER);
			text(data.amount,0,5);
		}else if(data.ghostName == 'shooter'){
			if(data.user==1){
				fill(200,0,0);
			}else if(data.user==2){
				fill(0);
			}
			noStroke
			rectMode(CENTER);
			rect(0,0,r-3,r-3);
			fill(255);
			textAlign(CENTER);
			text(data.amount,0,5);
		}else if(data.ghostName == 'king'){
			if(data.user==1){
				stroke(255,0,0);
				fill(255);
			}else if(data.user==2){
				stroke(0);
				fill(255);
			}
			rectMode(CENTER);
			rect(0,0,r-3,r-3);
			noStroke();
			fill(0);
			textAlign(CENTER);
			text(data.amount,0,5);
		}
	}
}
function ghostcleaner(){
	for(var i=0;i<mapData.length;i++){
  		if(mapData[i].amount <= 0 && mapData[i].user !=0){
  			mapData[i].user = 0;
  			if(mapData[i].ghost!=0){mapData[i].ghost.remove();}
  			mapData[i].ghost = 0;
  			mapData[i].ghostName = 0;
  			mapData[i].amount = 0;
  			mapData[i].step = 0;
  			mapData[i].attack = 0;
			mapData[i].attackRange = 0;
			mapData[i].ability = 0;
  			mapData[i].chessMovable = false;
  		}
  	} 
}

function mega(){
	for(var i=row-1;i>-1;i--){
	for(var j=0;j<column;j++){
	if(mapData[i*column+j].user >0){
		var primary = mapData[i*column+j];
		if(i-1>=0){
			var secondary = mapData[(i-1)*column+j];
			if(secondary.ghostName == primary.ghostName && secondary.user == primary.user && primary.ghostName!='king'){
				if(primary.amount <= secondary.amount){
					secondary.amount -= primary.amount;
					megaList(primary);
					ghostDrawer(primary);
					ghostDrawer(secondary);
					if(primary.amount > 0)console.log(primary.row,primary.column, 'with' , secondary.row,secondary.column ," envolve 'shooter' : ",primary.amount);
				}else if(primary.amount > secondary.amount){
					primary.amount -= secondary.amount;
					megaList(secondary);
					ghostDrawer(primary);
					ghostDrawer(secondary);
					if(secondary.amount > 0)console.log(secondary.row,secondary.column, 'with' , primary.row,primary.column ," envolve 'shooter' : ",secondary.amount);
				}
			}
		}
		if(j+1<=column-1){
			var thirdary = mapData[i*column+j+1];
			if(thirdary.ghostName == primary.ghostName && thirdary.user == primary.user && primary.ghostName!='king'){
				if(primary.amount <= thirdary.amount){
					thirdary.amount -= primary.amount;
					megaList(primary);
					ghostDrawer(primary);
					ghostDrawer(thirdary);
					if(primary.amount > 0)console.log(primary.row,primary.column, 'with' , thirdary.row,thirdary.column ," envolve 'shooter' : ",primary.amount);
				}else if(primary.amount > thirdary.amount){
					primary.amount -= thirdary.amount;
					megaList(thirdary);
					ghostDrawer(primary);
					ghostDrawer(thirdary);
					if(thirdary.amount > 0)console.log(thirdary.row,thirdary.column , 'with' , primary.row,primary.column ," envolve 'shooter' : ",thirdary.amount);
				}
			}
		}
	}
	}
	}
}
var megaListBoard = [];
function ghostBoardSteup(){
	var data ={
		ghostName : 'farmer',
		step : 2,
		attack : 1,
		attackRange : 1,
		ability : 0
	}
	megaListBoard.push(data);

	var data ={
		ghostName : 'shooter',
		step : 3,
		attack : 1,
		attackRange : 3,
		ability : 0
	}
	megaListBoard.push(data);

	var data ={
		ghostName : 'king',
		step : 1,
		attack : 2,
		attackRange : 1,
		ability : 1
	}
	megaListBoard.push(data);
}

function megaList(data){
	var ghostype;
	for(var i =0;i<megaListBoard.length;i++){
		if(megaListBoard[i].ghostName==data.ghostName){
			ghostype = i;
		}
	}
	if(ghostype<megaListBoard.length-1){
		ghostype=ghostype+1;
		data.ghostName = megaListBoard[ghostype].ghostName;
		data.step = megaListBoard[ghostype].step;
		data.attack = megaListBoard[ghostype].attack;
		data.attackRange = megaListBoard[ghostype].attackRange;
		data.ability = megaListBoard[ghostype].ability;
	}
}

var database;
function firebaseSetup(){
	var config = {
		apiKey: "AIzaSyBbqRzVCEAtKcSsuzY5e7uiAKuooz9Kj0g",
		authDomain: "hello-web-1210b.firebaseapp.com",
		databaseURL: "https://hello-web-1210b.firebaseio.com",
		projectId: "hello-web-1210b",
		storageBucket: "",
		messagingSenderId: "597759191616"
	};
	firebase.initializeApp(config);

	database = firebase.database();
	var ref = database.ref('chess/');
}
var upData;
function gotData(data){
	upData = data.val();
	if(login == false){
		if(upData.Rconnection == 1 && upData.Lconnection ==1){
			login= true;
			farmer(14,100);
			for(var i=0;i<mapData.length;i++){
		  		if(mapData[i].user >0){
		  			mapData[i].chessMovable = true;
		  		}
		  	}
		}
	}else if(login){
		if(upData.Rroundis == upData.Lroundis){
			if(player == 1){

			}else if(player == 2){

			}
		}
	}
}
function errData(data){
	console.log('Error!');
	console.log(data);
}

var login = false,roomCode_key;
var input, roomCode;
var submitButton,createRoom,join;
function submit(){
	input = createInput('who am i');
	input.position(width/2-input.width/2, height/2);
	submitButton = createButton('submit');
	submitButton.position(input.x + input.width, height/2);

	submitButton.mousePressed( function(){
		if(input.value().length <= 16){
			input.remove();
			submitButton.remove();
			createRoom = createButton('createRoom');
			createRoom.position((width-createRoom.width)/2, height/2);
			join = createButton('join');
			join.position((width-join.width)/2, height/2+createRoom.height*2);
			roomCode = createInput('- the room code is -');
			roomCode.position((width-roomCode.width)/2, join.y+join.height);
			createRoom.mousePressed( function(){
				var ref = database.ref("chess/");
				var whereami = nf(ceil(random(9999)),4);
				var data = {
					Lplayer : input.value(),
					Rplayer : '0',
					time : year()+ ' ' +nf(month(),2)+ '/' +nf(day(),2)+ ' ' +nf(hour(),2)+ ':' +nf(minute(),2),
					Lmapdata : '0',
					Rmapdata : '0',
					Lconnection :'1',
					Rconnection :'0',
					Lroundis : roundis,
					Rroundis : roundis,
					whereami : whereami
				};
				ref.push(data);
				ref.orderByChild("whereami").once("child_added", function(data) {
					var who = data.val().whereami;
					if(who.indexOf(whereami)>=0){
						roomCode_key = data.key;
						console.log(roomCode_key);
					}
				});
				var roomRef = database.ref('chess/'+roomCode_key);
				roomRef.on('value',gotData,errData);

				player = 1;
				
			  	createRoom.remove();
			  	join.remove();
			  	roomCode.remove(); 
			  	var li = createElement('li', 'roomCode: '+roomCode_key).parent('playersList'); ;
			});
			join.mousePressed( function(){
				roomCode_key = roomCode.value();
				var roomRef = database.ref('chess/'+roomCode_key);
				roomRef.update ({
			    	"Rplayer" : input.value(),
			    	"Rconnection" :'1',
				});
				var roomRef = database.ref('chess/'+roomCode_key);
				roomRef.on('value',gotData,errData);

				player = 2;

			  	createRoom.remove();
			  	join.remove(); 
			  	roomCode.remove();
			});
		}
	});
}

function attack(){
	for (var i = mapData.length - 1; i >= 0; i--) {
		if(mapData[i].user > 0) {
			var enemy = (mapData[i].user ==1)? 2:1;
			var distList = [];
			var distMin_row,distMin_column;
			for(var j =mapData[i].row+mapData[i].attackRange*-1;j<=mapData[i].row+mapData[i].attackRange;j++){
				for(var k=mapData[i].column+mapData[i].attackRange*-1;k<=mapData[i].column+mapData[i].attackRange;k++){
					if(j<row && j>=0 && k<column && k>=0 && mapData[j*column+k].user == enemy){
						var distdist = dist(mapData[i].x,mapData[i].y,mapData[j*column+k].x,mapData[j*column+k].y);
						if(distdist > 0) distList.push(distdist);
						distList = sort(distList,distList.length);
						if(distdist == distList[0]){
							distMin_row = j;
							distMin_column = k;
						}
					}
				}
			}
			if(distList[0] >0){
				mapData[distMin_row*column+distMin_column].getHurt = mapData[i].attack*mapData[i].amount;
				console.log(mapData[i].row,mapData[i].column,'kill the',mapData[distMin_row*column+distMin_column].row,mapData[distMin_row*column+distMin_column].column,'damage: ',mapData[distMin_row*column+distMin_column].getHurt);
			}
		}
	}

	for (var i = mapData.length - 1; i >= 0; i--) {
		mapData[i].amount -= mapData[i].getHurt;
		ghostDrawer(mapData[i]);
		mapData[i].getHurt = 0;
	}
} 