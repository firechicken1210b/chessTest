//map info
var r = 35,between = 6;
var row = 16,column = 13;
//info
var player;
var roundis = 1,roundCount = 0;
var readyButton,ready = false;
var pointMe;
var cnv;
// window size things--------------------
function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas();
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  if(loginRoundown==0){
	input.position(x+width/2-input.width/2, y+height/2);
	submitButton.position(input.x + input.width, y+height/2);
  }else if(loginRoundown==1){
	createRoom.position(x+(width-createRoom.width)/2, y+height/2);
	join.position(x+(width-join.width)/2, y+height/2+createRoom.height*2);
	roomCode.position(x+(width-roomCode.width)/2, join.y+join.height);
  }else if(loginRoundown ==2){
  	var readyButtonX = (player== 1)? x+50:x+width-30-readyButton.width;
	readyButton.position(readyButtonX,y+height/2);
  }
}
var bg,bg_floor;
var character_people00r,character_people01r,character_people02r,character_people03r;
var character_people00l,character_people01l,character_people02l,character_people03l;
function preload(){
	bg = loadImage('data/bg.jpg');
	bg_floor = loadImage('data/floor.png');
	character_people00l = loadImage('data/people0.png');
	character_people01l = loadImage('data/people1.png');
	character_people02l = loadImage('data/people2.png');
	character_people03l = loadImage('data/people3.png');
	character_people00r = loadImage('data/people00.png');
	character_people01r = loadImage('data/people11.png');
	character_people02r = loadImage('data/people22.png');
	character_people03r = loadImage('data/people33.png');
}
// window size things--------------------

// main processing things--------------------
function setup() {
	cnv = createCanvas(900,900).parent('processing');
	centerCanvas();
	firebaseSetup();
	submit();

	ghostBoardSteup()
	mapSetup();
}
function draw() {
  	//background(200); 
  	image(bg,0,0,width,height);
  	if(login){
	  	roundown();
	  	drawSprites();

	  	noStroke();
		fill(0);
	  	textAlign(CENTER);
	  	textStyle(BOLD);
	  	text('Round: '+roundis, width/2, 30);
	  	text(upData.Lplayer, 60, 30);
	  	text(upData.Rplayer, width-60, 30);
	  	textStyle(ITALIC);
		text('lost angels with dirty tears', width/2+10, height-20);

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
// main processing things--------------------
function roundown(){
	if(roundCount % 4 ==0){
		//step 01: move and update2cloud
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
		//step 02: download the enemy data from cloud
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
		//step 03: attack
		attack();
		ghostcleaner();
		roundCount += 1;
	}else if(roundCount % 4 ==3){
		//step 04: mega envolve and ability
		mega();
		ability();
		roundCount += 1;

		readyButton = createButton('ready');
		var x = (windowWidth - width) / 2;
  		var y = (windowHeight - height) / 2;
  		var readyButtonX = (player== 1)? x+50:x+width-30-readyButton.width;
		readyButton.position(readyButtonX,y+height/2);
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
		ghostcleaner();
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
				//fill(255);
				//rect(0,0,r,r);
				imageMode(CENTER);
				image(bg_floor,0,0);
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
						//fill(255);
						//rect(0,0,r,r);
						imageMode(CENTER);
						image(bg_floor,0,0);
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
					noFill();
					rectMode(CENTER);
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
					imageMode(CENTER);
					image(bg_floor,0,0);
					rect(0,0,r,r);
				}
				pointMe=this;
			};
			emptyGhost.onMouseOut = function() {
				this.draw = function(){
					//fill(255);
					//noStroke();
					//rect(0,0,r,r);
					imageMode(CENTER);
					image(bg_floor,0,0);
				}
				pointMe =0;
			};
		}
	}
}

function farmer(team,data) {
	readyButton = createButton('ready');
	var readyButtonX = (player== 1)? 50:width-30-readyButton.width;
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	readyButton.position(x+readyButtonX,y+height/2);
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
		if(player == 1){
			var bornX = floor(random(0,row/2));
			var bornY = floor(random(0,column-1));
			console.log(bornX,bornY);
			var farmer = createSprite(mapData[bornX+bornY*row].x,mapData[bornX+bornY*row].y,r-3,r-3);
			//ghostDrawer(mapData[i*2]);   <-----farmar is not data	
			farmer.draw = function(){
				fill(100,0,0);
				noStroke();
				//rectMode(CENTER);
				//rect(0,0,r-7,r-7);
				imageMode(CENTER);
				image(character_people00l,0,0);
				textAlign(CENTER);
				stroke(0);
				strokeWeight(3);
				fill(0);
				text(data,11,13);
				noStroke();
				fill(255);
				text(data,11,13);
			}

			mapData[bornX+bornY*row].user = 1;
			mapData[bornX+bornY*row].ghost = farmer;
			mapData[bornX+bornY*row].ghostName = 'farmer';
			mapData[bornX+bornY*row].amount = data;
			mapData[bornX+bornY*row].step = 1;
			mapData[bornX+bornY*row].attack = 1;
			mapData[bornX+bornY*row].attackRange = 1;
			mapData[bornX+bornY*row].ability = 1;
		}
		if(player == 2){
			var bornX = floor(random(0,row/2));
			var bornY = floor(random(0,column-1));
			console.log(bornX,bornY);
			var farmer = createSprite(mapData[mapData.length-1-(bornX+bornY*row)].x,mapData[mapData.length-1-(bornX+bornY*row)].y,r-3,r-3);
			//ghostDrawer(mapData[mapData.length-1-i*2]);   <-----farmar is not data
			farmer.draw = function(){
				fill(100);
				noStroke();
				//rectMode(CENTER);
				//rect(0,0,r-7,r-7);
				imageMode(CENTER);
				image(character_people00r,0,0);
				textAlign(CENTER);
				stroke(0);
				strokeWeight(3);
				fill(0);
				text(data,11,13);
				noStroke();
				fill(255);
				text(data,11,13);
			}

			mapData[mapData.length-1-(bornX+bornY*row)].user = 2;
			mapData[mapData.length-1-(bornX+bornY*row)].ghost = farmer;
			mapData[mapData.length-1-(bornX+bornY*row)].ghostName = 'farmer';
			mapData[mapData.length-1-(bornX+bornY*row)].amount = data;
			mapData[mapData.length-1-(bornX+bornY*row)].step = 1;
			mapData[mapData.length-1-(bornX+bornY*row)].attack = 1;
			mapData[mapData.length-1-(bornX+bornY*row)].attackRange = 1;
			mapData[mapData.length-1-(bornX+bornY*row)].ability = 1;
		}
	}
}
//move system (mouse press)-----------------------------------------------------------------
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
					NewData.amount += OldData.amount;
					OldData.amount = 0;
						ghostDrawer(OldData);
						ghostDrawer(NewData);
						ghostcleaner();
				chessMoving = 0;
			}else{
				chessMoving = 0;
			}
		}
	}
}
//move system (mouse press)-----------------------------------------------------------------

//move system (just click)-----------------------------------------------------------------
function dataInherit(OldData,NewData){
	var enemy = (player ==1)? 2:1;
	if(OldData.user != enemy && NewData.user != enemy){
		OldData.chessMovable = true;
		NewData.chessMovable = false;
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
}
//move system -----------------------------------------------------------------

//little tools -----------------------------------------------------------------
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
				imageMode(CENTER);
				image(character_people00l,0,0);
			}else if(data.user==2){
				imageMode(CENTER);
				image(character_people00r,0,0);
			}
			textAlign(CENTER);
			stroke(0);
			strokeWeight(3);
			fill(0);
			text(data.amount,11,13);
			noStroke();
			fill(255);
			text(data.amount,11,13);

		}else if(data.ghostName == 'knight'){
			if(data.user==1){
				imageMode(CENTER);
				image(character_people01l,0,0);
			}else if(data.user==2){
				imageMode(CENTER);
				image(character_people01r,0,0);
			}
			textAlign(CENTER);
			stroke(0);
			strokeWeight(3);
			fill(0);
			text(data.amount,11,13);
			noStroke();
			fill(255);
			text(data.amount,11,13);

		}else if(data.ghostName == 'shooter'){
			if(data.user==1){
				imageMode(CENTER);
				image(character_people02l,0,0);
			}else if(data.user==2){
				imageMode(CENTER);
				image(character_people02r,0,0);
			}
			textAlign(CENTER);
			stroke(0);
			strokeWeight(3);
			fill(0);
			text(data.amount,11,13);
			noStroke();
			fill(255);
			text(data.amount,11,13);

		}else if(data.ghostName == 'angel'){
			if(data.user==1){
				imageMode(CENTER);
				image(character_people03l,0,0);
			}else if(data.user==2){
				imageMode(CENTER);
				image(character_people03r,0,0);
			}
			textAlign(CENTER);
			stroke(0);
			strokeWeight(3);
			fill(0);
			text(data.amount,11,13);
			noStroke();
			fill(255);
			text(data.amount,11,13);
		}
	}
}
function ghostcleaner(){
	for(var i=0;i<mapData.length;i++){
  		if(mapData[i].amount <= 0 && mapData[i].user !=0){
  			if(mapData[i].ghostName == "angel"){
  				var lostangel = mapData[i].user;
  				for(var j=0;j<mapData.length;j++){
  					if(mapData[j].ghostName == "farmer" && mapData[i].user==lostangel){
  						mapData[j].amount = 0;
  					}
  				}
  			}
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
  			mapData[i].getHurt = 0;
  		}
  	} 
}
//little tools -----------------------------------------------------------------

//mega systems -----------------------------------------------------------------
function mega(){
	for(var i=row-1;i>-1;i--){
	for(var j=0;j<column;j++){
	if(mapData[i*column+j].user >0){
		var primary = mapData[i*column+j];
		if(i-1>=0){
			var secondary = mapData[(i-1)*column+j];
			if(secondary.ghostName == primary.ghostName && secondary.user == primary.user && primary.ghostName!=megaListBoard[megaListBoard.length-1].ghostName){
				if(primary.amount <= secondary.amount){
					console.log('['+primary.user+']',primary.row,primary.column, primary.ghostName+':'+primary.amount,'with' , '['+secondary.user+']',secondary.row,secondary.column ,secondary.ghostName+':'+secondary.amount," envolve: ",primary.ghostName,primary.amount);
					secondary.amount -= primary.amount;
					megaList(primary);
					ghostDrawer(primary);
					ghostDrawer(secondary);
				}else if(primary.amount > secondary.amount){
					console.log('['+secondary.user+']',secondary.row,secondary.column, secondary.ghostName+':'+secondary.amount,'with' , '['+primary.user+']',primary.row,primary.column ,primary.ghostName+':'+primary.amount," envolve: ",secondary.ghostName,secondary.amount);
					primary.amount -= secondary.amount;
					megaList(secondary);
					ghostDrawer(primary);
					ghostDrawer(secondary);
				}
			}
		}
		if(j+1<=column-1){
			var thirdary = mapData[i*column+j+1];
			if(thirdary.ghostName == primary.ghostName && thirdary.user == primary.user && primary.ghostName!=megaListBoard[megaListBoard.length-1].ghostName){
				if(primary.amount <= thirdary.amount){
					console.log('['+primary.user+']',primary.row,primary.column, primary.ghostName+':'+primary.amount,'with' , '['+thirdary.user+']',thirdary.row,thirdary.column ,thirdary.ghostName+':'+thirdary.amount," envolve: ",primary.ghostName,primary.amount);
					thirdary.amount -= primary.amount;
					megaList(primary);
					ghostDrawer(primary);
					ghostDrawer(thirdary);
				}else if(primary.amount > thirdary.amount){
					console.log('['+thirdary.user+']',thirdary.row,thirdary.column, thirdary.ghostName+':'+thirdary.amount,'with' , '['+primary.user+']',primary.row,primary.column ,primary.ghostName+':'+primary.amount," envolve: ",thirdary.ghostName,thirdary.amount);
					primary.amount -= thirdary.amount;
					megaList(thirdary);
					ghostDrawer(primary);
					ghostDrawer(thirdary);
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
		step : 1,
		attack : 1,
		attackRange : 1,
		ability : 1
	}
	megaListBoard.push(data);

	var data ={
		ghostName : 'knight',
		step : 4,
		attack : 1,
		attackRange : 3,
		ability : 0
	}
	megaListBoard.push(data);

	var data ={
		ghostName : 'shooter',
		step : 2,
		attack : 3,
		attackRange : 5,
		ability : 0
	}
	megaListBoard.push(data);

	var data ={
		ghostName : 'angel',
		step : 1,
		attack : 2,
		attackRange : 1,
		ability : 2
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
//mega systems -----------------------------------------------------------------

//firebase systems -----------------------------------------------------------------
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
			farmer(1,5);
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
//firebase systems -----------------------------------------------------------------

//login systems -----------------------------------------------------------------
var login = false,roomCode_key,loginRoundown=0;
var input, roomCode;
var submitButton,createRoom,join;
function submit(){
	input = createInput('who am i');
	submitButton = createButton('submit');
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	input.position(x+width/2-input.width/2, y+height/2);
	submitButton.position(input.x + input.width, y+height/2);

	submitButton.mousePressed( function(){
		if(input.value().length <= 16){
			loginRoundown = 1;
			input.remove();
			submitButton.remove();
			var x = (windowWidth - width) / 2;
			var y = (windowHeight - height) / 2;
			createRoom = createButton('createRoom');
			createRoom.position(x+(width-createRoom.width)/2, y+height/2);
			join = createButton('join');
			join.position(x+(width-join.width)/2, y+height/2+createRoom.height*2);
			roomCode = createInput('- the room code is -');
			roomCode.position(x+(width-roomCode.width)/2, join.y+join.height);
			createRoom.mousePressed( function(){
				loginRoundown = 2;
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
				var chessRef = database.ref('chess/');
				chessRef.once('value')
				.then(function(data) {
					var roomkeys = data.val();
					var keys = Object.keys(roomkeys);
					for(var i=0;i<keys.length;i++){
						if(roomCode_key == keys[i]){
							loginRoundown = 2;
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
						}else{
							console.log('not you');
						}
					}
				});
			});
		}
	});
}
//login systems -----------------------------------------------------------------

//attack systems -----------------------------------------------------------------
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
				var disTarget = distMin_row*column+distMin_column;
				mapData[disTarget].getHurt += mapData[i].attack*mapData[i].amount;
				attackation(mapData[i],mapData[disTarget]);
				console.log('['+mapData[i].user+']',mapData[i].row,mapData[i].column,mapData[i].ghostName+':'+mapData[i].amount,'hit the','['+mapData[disTarget].user+']',mapData[disTarget].row,mapData[disTarget].column,mapData[disTarget].ghostName+':'+mapData[disTarget].amount,'damage: ',mapData[i].attack*mapData[i].amount,'last:',mapData[disTarget].amount - mapData[disTarget].getHurt);
			}
		}
	}

	for (var i = mapData.length - 1; i >= 0; i--) {
		mapData[i].amount -= mapData[i].getHurt;
		ghostDrawer(mapData[i]);
		mapData[i].getHurt = 0;
	}
} 
//attack systems -----------------------------------------------------------------

function ability(){
	var farmerAmount1=0,angelAmount1=0;
	var farmerAmount2=0,angelAmount2=0;

	for (var i = mapData.length - 1; i >= 0; i--) {
		if(mapData[i].user == 1){
			if(mapData[i].ability >0) {
				if(mapData[i].ability == 1){
					mapData[i].amount += 1;
					farmerAmount1+= mapData[i].amount;
				}
				if(mapData[i].ability == 2){
					angelAmount1+=1;
				}
			}
		}else if(mapData[i].user == 2){
			if(mapData[i].ability >0) {
				if(mapData[i].ability == 1){
					mapData[i].amount += 1;
					farmerAmount2+= mapData[i].amount;
				}
				if(mapData[i].ability == 2){
					angelAmount2+=1;
				}
			}
		}
	}
	for (var i = mapData.length - 1; i >= 0; i--) {
		if(mapData[i].user == 1){
			if(mapData[i].ability >0) {
				if(mapData[i].ability == 2){
					mapData[i].amount = floor(farmerAmount1/angelAmount1);
				}
			}
		}else if(mapData[i].user == 2){
			if(mapData[i].ability >0) {
				if(mapData[i].ability == 2){
					mapData[i].amount = floor(farmerAmount2/angelAmount2);
				}
			}
		}
	}

}

function attackation(from,to){

	this.x = from.x;
	this.y = from.y;
	this.targetX = to.x;
	this.targetY = to.y;

	this.display = function(){
		stroke(255);
		noFill();
		ellipse(this.x,this.y,24,24);
	}

	this.move = function(){
		this.x += random(1,-1);
		this.y += random(1,-1);
		this.time--;
	}
}

