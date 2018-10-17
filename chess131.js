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
var bg,bg_floor,megaAnimation,state_guard,state_miss;
var character_peopleR = [];
var character_peopleL = [];
var attackAnimations = [];
var useAnimations = [];
var pathAnimations = [];
var abilityAnimations = [];
function preload(){
	bg = loadImage('data/bg.jpg');
	bg_floor = loadImage('data/floor.png');
	megaAnimation = loadImage('animations/Special10.png');
	state_guard = loadImage('data/g.png');
	state_miss = loadImage('data/m.png');

	character_peopleR.push(loadImage('data/people00.png'));
	character_peopleL.push(loadImage('data/people0.png'));
	useAnimations.push(loadImage('animations/Blow3.png'));
	attackAnimations.push(loadImage('animations/Blow1.png'));
	intoList(0,0,3);
	intoList(loadImage('animations/ability0.png'),30,4);
	//abilityAnimations.push(loadImage('animations/ability0.png'));

	character_peopleR.push(loadImage('data/people11.png'));
	character_peopleL.push(loadImage('data/people1.png'));
	useAnimations.push(loadImage('animations/Blow3.png'));
	attackAnimations.push(loadImage('animations/Sword2.png'));
	pathAnimations.push(loadImage('animations/path1.png'));
	intoList(0,0,4);

	character_peopleR.push(loadImage('data/people22.png'));
	character_peopleL.push(loadImage('data/people2.png'));
	useAnimations.push(loadImage('animations/use0.png'));
	attackAnimations.push(loadImage('animations/Sword3.png'));
	pathAnimations.push(loadImage('animations/path2.png'));
	intoList(0,0,4);

	character_peopleR.push(loadImage('data/people33.png'));
	character_peopleL.push(loadImage('data/people3.png'));
	useAnimations.push(loadImage('animations/Blow3.png'));
	attackAnimations.push(loadImage('animations/attack3.png'));
	pathAnimations.push(loadImage('animations/path3.png'));
	intoList(loadImage('animations/ability3.png'),15,4);
	//abilityAnimations.push(loadImage('animations/ability3.png'));
}

function intoList(data,frame,whichone){
	console.log(whichone,frame);
	var picinfo = {
		animateArray : whichone,
		pic :  data,
		frame : frame
	}
	picinfoList.push(picinfo);
}
var picinfoList = [];
function picSetup(){
	for(var i=0;i<picinfoList.length;i++){
		picLister(picinfoList[i].pic, picinfoList[i].frame, picinfoList[i].animateArray);
	}
}

function picLister(data,frame,whichone){
	if(data == 0){
		// empty files
		if(whichone == 1){
			useAnimations.push(0);
		}else if(whichone == 2){
			attackAnimations.push(0);
		}else if(whichone == 3){
			pathAnimations.push(0);
		}else if(whichone == 4){
			abilityAnimations.push(0);
		}
	}else{
		var picSize = 192;
		var aniList = [];
		for(var i=0;i<frame;i++){
			var pg = createGraphics(picSize, picSize);
			pg.copy(data, (i*picSize)%(picSize*5) , floor((i*picSize)/(picSize*5))*picSize,picSize,picSize,0,0,picSize,picSize);
			aniList.push(pg);
			pg.remove();
		}
		
		var animateInfo = {
			frame : frame,
			pics : aniList
		}

		if(whichone == 1){
			useAnimations.push(animateInfo);
		}else if(whichone == 2){
			//put info and piclists into abilityAnimations
			attackAnimations.push(animateInfo);
		}else if(whichone == 3){
			//put info and piclists into abilityAnimations
			pathAnimations.push(animateInfo);
		}else if(whichone == 4){
			//put info and piclists into abilityAnimations
			abilityAnimations.push(animateInfo);
		}
	}
}
// window size things--------------------

// main processing things--------------------
function setup() {
	cnv = createCanvas(900,900).parent('processing');
	centerCanvas();
	firebaseSetup();
	picSetup();
	console.log(abilityAnimations)
	submit();

	ghostBoardSteup()
	mapSetup();
}
function draw() {
  	//background(200); 
  	image(bg,0,0,width,height);
  	if(login){
	  	drawSprites();
	  	roundown();
	  	showtheState();

	  	noStroke();
		fill(0);
	  	textAlign(CENTER);
	  	textStyle(BOLD);
	  	textSize(12);
	  	text('Round: '+roundis, width/2, 30);
	  	text(upData.Lplayer, 60, 30);
	  	text(upData.Rplayer, width-60, 30);
	  	textStyle(ITALIC);
		text('lost angels with dirty tears', width/2+10, height-20);

		if(pointMe!=0){
			for(var i =0;i<mapData.length;i++){
				if(mapData[i].mapGhost == pointMe && mapData[i].user >0){
					stroke(0);
					strokeWeight(1);
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
	if(roundCount % 5 ==0){
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
						attackMode : mapData[i].attackMode,
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
	}else if(roundCount % 5 ==1){
		//step 02: download the ghosts data from cloud
		console.log(roundis);
		if(upData.Rroundis == upData.Lroundis){
			for(var i=0;i<mapData.length;i++){
				mapData[i].amount = 0;
				ghostcleaning(mapData[i]);
			}	

			for(var i=0;i<upData.Lmapdata.length;i++){
				var updata_who = upData.Lmapdata[i].row*column+upData.Lmapdata[i].column;
				var newGhost = createSprite(upData.Lmapdata[i].x,upData.Lmapdata[i].y,r-1,r-1);
				mapData[updata_who].user = upData.Lmapdata[i].user;
				mapData[updata_who].ghost = newGhost;
				mapData[updata_who].ghostName = upData.Lmapdata[i].ghostName;
				mapData[updata_who].amount = upData.Lmapdata[i].amount;
				mapData[updata_who].step = upData.Lmapdata[i].step;
				mapData[updata_who].attack = upData.Lmapdata[i].attack;
				mapData[updata_who].attackMode = upData.Lmapdata[i].attackMode;
				mapData[updata_who].attackRange = upData.Lmapdata[i].attackRange;
				mapData[updata_who].ability = upData.Lmapdata[i].ability;
				ghostDrawer(mapData[updata_who]);
			}

			for(var i=0;i<upData.Rmapdata.length;i++){
				var updata_who = upData.Rmapdata[i].row*column+upData.Rmapdata[i].column;
				if(mapData[updata_who].amount*mapData[updata_who].attack == upData.Rmapdata[i].amount*upData.Rmapdata[i].attack){
					mapData[updata_who].amount = 0;
					ghostcleaning(mapData[updata_who]);
					stateShows.push(new stateShow(upData.Rmapdata[i],1));
					console.log(stateShows.length);
					//both die
				}else if(mapData[updata_who].amount*mapData[updata_who].attack > upData.Rmapdata[i].amount*upData.Rmapdata[i].attack){
					//playerL win
					if(player == 1){
						stateShows.push(new stateShow(upData.Rmapdata[i],2));
						console.log(stateShows.length);
					}else if(player == 2){
						stateShows.push(new stateShow(upData.Rmapdata[i],1));
						console.log(stateShows.length);
					}
				}else{
					if(mapData[updata_who].user==0){
						var newGhost = createSprite(upData.Rmapdata[i].x,upData.Rmapdata[i].y,r-1,r-1);
						mapData[updata_who].ghost = newGhost;
					}else{
						//playerR win
						if(player == 1){
							stateShows.push(new stateShow(upData.Rmapdata[i],1));
							console.log(stateShows.length);
						}else if(player == 2){
							stateShows.push(new stateShow(upData.Rmapdata[i],2));
							console.log(stateShows.length);
						}
					}
					mapData[updata_who].user = upData.Rmapdata[i].user;
					mapData[updata_who].ghostName = upData.Rmapdata[i].ghostName;
					mapData[updata_who].amount = upData.Rmapdata[i].amount;
					mapData[updata_who].step = upData.Rmapdata[i].step;
					mapData[updata_who].attack = upData.Rmapdata[i].attack;
					mapData[updata_who].attackMode = upData.Rmapdata[i].attackMode;
					mapData[updata_who].attackRange = upData.Rmapdata[i].attackRange;
					mapData[updata_who].ability = upData.Rmapdata[i].ability;
					ghostDrawer(mapData[updata_who]);
				}
			}
			roundCount += 1;
		}
	}else if(roundCount % 5 ==2){
		//step 03: attack
		attackfinished = false;
		attackRoundown();
		if(attackfinished){
			//count the hurt and clean the .getHurt
			for (var i = mapData.length - 1; i >= 0; i--) {
				//after all hit to count hurt can give the lower ghosts chance to get more hurt from others and make damage to others 
				mapData[i].amount -= mapData[i].getHurt;
				ghostDrawer(mapData[i]);
				mapData[i].getHurt = 0;
			}
			ghostcleaner();
			roundCount += 1;
		}
	}else if(roundCount % 5 ==3){
		//step 04: mega envolve
		megafinished = false;
		megaRoundown();
		if(megafinished){
			roundCount +=1;
		}
	}else if(roundCount % 5 ==4){
		//step 05: ability
		abilityfinished = false;
		abilityRoundown();
		if(abilityfinished){
			roundCount += 1;
			ghostcleaner();
			ready = !ready;
			for(var i=0;i<mapData.length;i++){
		  		if(mapData[i].user >0){
		  			mapData[i].chessMovable = true;
		  		}
		  	}
		  	readyButton = createButton('ready');
			var x = (windowWidth - width) / 2;
	  		var y = (windowHeight - height) / 2;
	  		var readyButtonX = (player== 1)? x+50:x+width-30-readyButton.width;
			readyButton.position(readyButtonX,y+height/2);
			readyButton.mousePressed( function(){
				if(roundCount %5 == 0){
					ready = !ready;
					for(var i=0;i<mapData.length;i++){
				  		mapData[i].chessMovable = false;
				  	} 
				  	move = 0;
					chessMoving = 0;
					console.log('ready');
					readyButton.remove();
				}
			});
		} 
	}
}


var mapData = [];
var chessMoving = 0;
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
				attackMode : 0,
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
					imageMode(CENTER);
					image(bg_floor,0,0);
				}
				pointMe =0;
			};
		}
	}
}

function ghostSetup(team,data) {
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
			var farmer = createSprite(mapData[bornX*column+bornY].x,mapData[bornX*column+bornY].y,r-1,r-1);
			farmer.draw = function(){
				imageMode(CENTER);
				image(character_peopleL[0],0,0);
				textAlign(CENTER);
				stroke(0);
				strokeWeight(3);
				fill(0);
				text(data,11,13);
				noStroke();
				fill(255);
				text(data,11,13);
			}
			console.log(bornX,bornY);
			mapData[bornX*column+bornY].user = 1;
			mapData[bornX*column+bornY].ghost = farmer;
			mapData[bornX*column+bornY].ghostName = 'farmer';
			mapData[bornX*column+bornY].amount = data;
			mapData[bornX*column+bornY].step = 1;
			mapData[bornX*column+bornY].attack = 1;
			mapData[bornX*column+bornY].attackMode = 1;
			mapData[bornX*column+bornY].attackRange = 1;
			mapData[bornX*column+bornY].ability = 1;
		}
		if(player == 2){
			var bornX = floor(random(row/2,row));
			var bornY = floor(random(0,column-1));
			console.log(bornX,bornY);
			var farmer = createSprite(mapData[bornX*column+bornY].x,mapData[bornX*column+bornY].y,r-1,r-1);
			//ghostDrawer(mapData[mapData.length-1-i*2]);   <-----farmar is not data
			farmer.draw = function(){
				imageMode(CENTER);
				image(character_peopleR[0],0,0);
				textAlign(CENTER);
				stroke(0);
				strokeWeight(3);
				fill(0);
				text(data,11,13);
				noStroke();
				fill(255);
				text(data,11,13);
			}

			mapData[bornX*column+bornY].user = 2;
			mapData[bornX*column+bornY].ghost = farmer;
			mapData[bornX*column+bornY].ghostName = 'farmer';
			mapData[bornX*column+bornY].amount = data;
			mapData[bornX*column+bornY].step = 1;
			mapData[bornX*column+bornY].attack = 1;
			mapData[bornX*column+bornY].attackMode = 1;
			mapData[bornX*column+bornY].attackRange = 1;
			mapData[bornX*column+bornY].ability = 1;
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
				var ghost = createSprite(NewData.x,NewData.y,r-1,r-1);
				NewData.user = OldData.user;
				NewData.ghost = ghost ;
				NewData.ghostName =OldData.ghostName ;
				NewData.amount += ceil(OldData.amount/2);
				NewData.step = OldData.step;
				NewData.attack = OldData.attack;
				NewData.attackMode = OldData.attackMode;
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
		var changeuser = NewData.user;
		var changeghost = NewData.ghost;
		var changeghostName = NewData.ghostName;
		var changeAmount = NewData.amount;
		var changeStep = NewData.step;
		var changeAttack = NewData.attack;
		var changeAttackMode = NewData.attackMode;
		var changeAttackRange = NewData.attackRange;
		var changeAbility = NewData.ability;
		var changeX = NewData.x;
		var changeY = NewData.y;
		var changeMovable = NewData.chessMovable;
			NewData.user = OldData.user;
			NewData.ghost =OldData.ghost ;
			NewData.ghostName =OldData.ghostName ;
			NewData.amount = OldData.amount;
			NewData.step = OldData.step;
			NewData.attack = OldData.attack;
			NewData.attackMode = OldData.attackMode;
			NewData.attackRange = OldData.attackRange;
			NewData.ability = OldData.ability;
			NewData.chessMovable = false;
				OldData.user = changeuser;
				OldData.ghost = changeghost;
				OldData.ghostName = changeghostName;
				OldData.amount = changeAmount;
				OldData.step = changeStep;
				OldData.attack = changeAttack;
				OldData.attackMode = changeAttackMode;
				OldData.attackRange = changeAttackRange;
				OldData.ability = changeAbility;
				OldData.chessMovable = changeMovable;

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
	if(data.amount <= 0){
		ghostcleaning(data);
	}else{
		if(data.ghostName == 'farmer'){
			data.ghost.draw = function(){
				if(data.user==1){
					imageMode(CENTER);
					image(character_peopleL[0],0,0);
				}else if(data.user==2){
					imageMode(CENTER);
					image(character_peopleR[0],0,0);
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

		}else if(data.ghostName == 'knight'){
			data.ghost.draw = function(){
				if(data.user==1){
					imageMode(CENTER);
					image(character_peopleL[1],0,0);
				}else if(data.user==2){
					imageMode(CENTER);
					image(character_peopleR[1],0,0);
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

		}else if(data.ghostName == 'shooter'){
			data.ghost.draw = function(){
				if(data.user==1){
					imageMode(CENTER);
					image(character_peopleL[2],0,0);
				}else if(data.user==2){
					imageMode(CENTER);
					image(character_peopleR[2],0,0);
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
		}else if(data.ghostName == 'angel'){
			data.ghost.draw = function(){
				if(data.user==1){
					imageMode(CENTER);
					image(character_peopleL[3],0,0);
				}else if(data.user==2){
					imageMode(CENTER);
					image(character_peopleR[3],0,0);
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
}

function ghostcleaning(data){
	if(data.amount <= 0 && data.user !=0){
		data.user = 0;
		if(data.ghost!=0){data.ghost.remove();}
		data.ghost = 0;
		data.ghostName = 0;
		data.amount = 0;
		data.step = 0;
		data.attack = 0;
		data.attackMode = 0;
		data.attackRange = 0;
		data.ability = 0;
		data.chessMovable = false;
		data.getHurt = 0;
	}
}

function ghostcleaner(){
	for(var i=0;i<mapData.length;i++){
  		if(mapData[i].amount <= 0 && mapData[i].user !=0){
  			if(mapData[i].ghostName == "angel"){
  				var lostangel = mapData[i].user;
  				for(var j=0;j<mapData.length;j++){
  					if(mapData[j].ghostName == "farmer" && mapData[j].user==lostangel){
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
  			mapData[i].attackMode = 0;
			mapData[i].attackRange = 0;
			mapData[i].ability = 0;
  			mapData[i].chessMovable = false;
  			mapData[i].getHurt = 0;
  		}
  	} 
}

var stateShows = [];
function stateShow(data,state_type){

	this.x = data.x;
	this.y = data.y;
	this.state_type = state_type;
	this.life = 40;

	this.display = function(){

		imageMode(CENTER);
		if(this.state_type == 1){
			image(state_miss,this.x,this.y,31,13);
		}else if(this.state_type == 2){
			image(state_guard,this.x,this.y,31,13);
		}
		this.life--;
	}
}


function showtheState(){
	for(var i=0;i<stateShows.length;i++){
		stateShows[i].display();
		if(stateShows[i].life < 0){
			stateShows.splice(i,1);
		}
	}
}

var damageTexts = [];
function damageText(damageCount,to){

	this.x = to.x;
	this.y = to.y;
	this.hurt = abs(damageCount);
	this.h = damageCount;
	this.step = 10;
	this.life = 31;
	this.c = (this.h > 0) ? color(255,0,0):color(0,255,0);

	this.display = function(){

		textSize(31);
		textAlign(CENTER);
		textStyle(ITALIC);
		stroke(0);
		strokeWeight(5);
		fill(0);
		text(this.hurt, this.x, this.y);
			stroke(255);
			strokeWeight(3);
			fill(255);
			text(this.hurt, this.x, this.y);
				noStroke();
				fill(this.c);
				text(this.hurt, this.x, this.y);
	}

	this.move = function(){
		if(this.h >  0){this.x += random(2);}
		this.y -= this.step;
		this.step -= 10/15;
		this.life--;
	}
}

//little tools -----------------------------------------------------------------

//mega systems -----------------------------------------------------------------
var megaListBoard = [];
function ghostBoardSteup(){
	var data ={
		ghostName : 'farmer',
		step : 1,
		attack : 1,
		attackMode : 1,
		attackRange : 1,
		ability : 1
	}
	megaListBoard.push(data);

	var data ={
		ghostName : 'knight',
		step : 4,
		attack : 1,
		attackMode : 2,
		attackRange : 3,
		ability : 0
	}
	megaListBoard.push(data);

	var data ={
		ghostName : 'shooter',
		step : 2,
		attack : 3,
		attackMode : 3,
		attackRange : 5,
		ability : 0
	}
	megaListBoard.push(data);

	var data ={
		ghostName : 'angel',
		step : 1,
		attack : 2,
		attackMode : 4,
		attackRange : 1,
		ability : 4
	}
	megaListBoard.push(data);
}

var megafinished,megaRound = 0;
function megaRoundown(){
	if(megaRound == 0){
		mega();
		megaRound += 1;
	}else if(megaRound == 1){
		if(megaAnimateList.length>0){
			megaAnimateList[0].display();
			megaAnimateList[0].move();
			if (megaAnimateList[0].mframe > 16) {
				//megaAnimateList[0].t.amount -= megaAnimateList[0].f.amount;
				//megaList(megaAnimateList[0].f);
				ghostDrawer(megaAnimateList[0].f);
				ghostDrawer(megaAnimateList[0].t);
				megaAnimateList.splice(0,1);
			}
		}else{
			console.log("megafinished");
			megaRound = 0;
			megafinished = true;
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
			if(secondary.ghostName == primary.ghostName && secondary.user == primary.user && primary.ghostName!=megaListBoard[megaListBoard.length-1].ghostName){
				if(primary.amount <= secondary.amount && primary.amount >0){
					console.log('['+primary.user+']',primary.row,primary.column, primary.ghostName+':'+primary.amount,'with' , '['+secondary.user+']',secondary.row,secondary.column ,secondary.ghostName+':'+secondary.amount," envolve: ",primary.ghostName,primary.amount);
					megaAnimateList.push(new megaAnimate(primary,secondary));
					secondary.amount -= primary.amount;
					megaList(primary);
				}else if(primary.amount > secondary.amount && secondary.amount>0){
					console.log('['+secondary.user+']',secondary.row,secondary.column, secondary.ghostName+':'+secondary.amount,'with' , '['+primary.user+']',primary.row,primary.column ,primary.ghostName+':'+primary.amount," envolve: ",secondary.ghostName,secondary.amount);
					megaAnimateList.push(new megaAnimate(secondary,primary));
					primary.amount -= secondary.amount;
					megaList(secondary);
				}
			}
		}
		if(j+1<=column-1){
			var thirdary = mapData[i*column+j+1];
			if(thirdary.ghostName == primary.ghostName && thirdary.user == primary.user && primary.ghostName!=megaListBoard[megaListBoard.length-1].ghostName){
				if(primary.amount <= thirdary.amount && primary.amount >0){
					console.log('['+primary.user+']',primary.row,primary.column, primary.ghostName+':'+primary.amount,'with' , '['+thirdary.user+']',thirdary.row,thirdary.column ,thirdary.ghostName+':'+thirdary.amount," envolve: ",primary.ghostName,primary.amount);
					megaAnimateList.push(new megaAnimate(primary,thirdary));
					thirdary.amount -= primary.amount;
					megaList(primary);
				}else if(primary.amount > thirdary.amount && thirdary.amount >0){
					console.log('['+thirdary.user+']',thirdary.row,thirdary.column, thirdary.ghostName+':'+thirdary.amount,'with' , '['+primary.user+']',primary.row,primary.column ,primary.ghostName+':'+primary.amount," envolve: ",thirdary.ghostName,thirdary.amount);
					megaAnimateList.push(new megaAnimate(thirdary,primary));
					primary.amount -= thirdary.amount;
					megaList(thirdary);
				}
			}
		}
	}
	}
	}
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
		data.attackMode = megaListBoard[ghostype].attackMode;
		data.attackRange = megaListBoard[ghostype].attackRange;
		data.ability = megaListBoard[ghostype].ability;
	}
}

var megaAnimateList = [];
function megaAnimate(from,to){

	this.f = from;
	this.t = to;
	this.fx = from.x;
	this.fy = from.y;
	this.tx = to.x;
	this.ty = to.y;
	this.mframe = 0;
	this.img = megaAnimation;

	this.picSize = 96;

	this.display = function(){

		this.mframe += ((this.img.width/192)*(this.img.height/192) > this.mframe) ? 1:0;
		copy(this.img,
			(this.mframe*192)%960,floor((this.mframe*192)/960)*192,192,192,
			this.fx-(this.picSize+this.mframe)/2,this.fy-(this.picSize+this.mframe)/2,
			this.picSize+this.mframe,this.picSize+this.mframe);	
		copy(this.img,
			(this.mframe*192)%960,floor((this.mframe*192)/960)*192,192,192,
			this.tx-(this.picSize+this.mframe)/2,this.ty-(this.picSize+this.mframe)/2,
			this.picSize+this.mframe,this.picSize+this.mframe);	
	}

	this.move = function(){
		this.tx += random(2,-2);
		this.ty += random(2,-2);
		this.fx += random(2,-2);
		this.fy += random(2,-2);
		this.time --;
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
			ghostSetup(1,5);
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
var attackfinished,attackRound = 0;

function attackRoundown(){
	if(attackRound == 0){

		attack();
		attackRound+=1;
	}else if(attackRound==1){

		for(var i=0;i<ghostLV3.length;i++){
			ghostLV3[i].move();
			ghostLV3[i].display();
			if(ghostLV3[i].time <0){
				damageTexts.push(new damageText(ghostLV3[i].hurt,ghostLV3[i].t));
				ghostLV3.splice(i,1);
			}
		}
			if(ghostLV3.length==0){
				attackRound += 1;
			}
	}else if(attackRound==2){

		for(var i=0;i<ghostLV2.length;i++){
			ghostLV2[i].move();
			ghostLV2[i].display();
			if(ghostLV2[i].time <0){
				damageTexts.push(new damageText(ghostLV2[i].hurt,ghostLV2[i].t));
				ghostLV2.splice(i,1);
			}
		}
			if(ghostLV2.length==0){
				attackRound += 1;
			}
	}else if(attackRound==3){

		for(var i=0;i<ghostLV1.length;i++){
			ghostLV1[i].move();
			ghostLV1[i].display();
			if(ghostLV1[i].time <0){
				damageTexts.push(new damageText(ghostLV1[i].hurt,ghostLV1[i].t));
				ghostLV1.splice(i,1);
			}
		}
			if(ghostLV1.length==0){
				attackRound += 1;
			}
	}else if(attackRound==4){

		for(var i=0;i<ghostLV4.length;i++){
			ghostLV4[i].move();
			ghostLV4[i].display();
			if(ghostLV4[i].time <0){
				damageTexts.push(new damageText(ghostLV4[i].hurt,ghostLV4[i].t));
				ghostLV4.splice(i,1);
			}
		}
			if(ghostLV4.length==0){
				attackRound += 1;
			}
	}else if(attackRound==5){

		if(damageTexts.length==0){
			console.log("attackfinished");
			attackRound = 0;
			attackfinished = true;
		}
	}

	for(var i=0;i<damageTexts.length;i++){
		damageTexts[i].move();
		damageTexts[i].display();
		if(damageTexts[i].life <0){
			damageTexts.splice(i,1);
		}
	}
}

function attack(){
	for (var i = mapData.length - 1; i >= 0; i--) {
		if(mapData[i].user > 0) {
			var enemy = (mapData[i].user ==1)? 2:1;
			var distList = [];
			var attackwho;
			var attack_row,attack_column;
			for(var j =mapData[i].row+mapData[i].attackRange*-1;j<=mapData[i].row+mapData[i].attackRange;j++){
				for(var k=mapData[i].column+mapData[i].attackRange*-1;k<=mapData[i].column+mapData[i].attackRange;k++){
					//check the enemy in the attackRange with in the map
					if(j<row && j>=0 && k<column && k>=0 && mapData[j*column+k].user == enemy){
						var distdist = dist(mapData[i].x,mapData[i].y,mapData[j*column+k].x,mapData[j*column+k].y);
						if(distdist > 0) distList.push(distdist);
						distList = sort(distList,distList.length);
						//if attackrange >= 5 hit the most far enemy or hit the closest enemy
						attackwho = (mapData[i].attackRange >= 5)? distList[distList.length-1]:distList[0];
						if(distdist == attackwho){
							attack_row = j;
							attack_column = k;
						}
					}
				}
			}
			//add damage*amount on the attackTarget.getHurt and maybe add the animation  here? 
			if(distList[0] >0){
				var attackTarget = attack_row*column+attack_column;
				mapData[attackTarget].getHurt += mapData[i].attack*mapData[i].amount;
				attackation(mapData[i].attack*mapData[i].amount,mapData[i],mapData[attackTarget]);
				console.log('['+mapData[i].user+']',mapData[i].row,mapData[i].column,mapData[i].ghostName+':'+mapData[i].amount,'hit the','['+mapData[attackTarget].user+']',mapData[attackTarget].row,mapData[attackTarget].column,mapData[attackTarget].ghostName+':'+mapData[attackTarget].amount,'damage: ',mapData[i].attack*mapData[i].amount,'last:',mapData[attackTarget].amount - mapData[attackTarget].getHurt);
			}
		}
	}
} 

var ghostLV1 = [];
var ghostLV2 = [];
var ghostLV3 = [];
var ghostLV4 = [];

function attackation(damageCount,from,to){
	var ghostype;
	for(var i =0;i<megaListBoard.length;i++){
		if(megaListBoard[i].ghostName==from.ghostName){
			ghostype = i;
		}
	}
	if(ghostype == 0){
		ghostLV1.push(new attackAnimate(damageCount,ghostype,from,to));
	}else if(ghostype == 1){
		ghostLV2.push(new attackAnimate(damageCount,ghostype,from,to));
	}else if(ghostype == 2){
		ghostLV3.push(new attackAnimate(damageCount,ghostype,from,to));
	}else if(ghostype == 3){
		ghostLV4.push(new attackAnimate(damageCount,ghostype,from,to));
	}
}

function attackAnimate(damageCount,ghostype,from,to){

	this.f = from;
	this.t = to;
	this.fx = from.x;
	this.fy = from.y;
	this.fFrame = 0;
	this.fimg = useAnimations[ghostype];
	this.tx = to.x;
	this.ty = to.y;
	this.tFrame = 0;
	this.timg = attackAnimations[ghostype];
	this.pathx = from.x;
	this.pathy = from.y;
	this.pathFrame = 0;
	this.pathimg = pathAnimations[ghostype];

	this.ghostype = ghostype;
	this.hurt = damageCount;
	this.picSize = 96;
	this.time = 40;

	this.display = function(){
		if(this.time>20){
			this.fFrame += ((this.fimg.width/192)*(this.fimg.height/192) > this.fFrame) ? 1:0;
			copy(this.fimg,
				(this.fFrame*192)%960,floor((this.fFrame*192)/960)*192,192,192,
				this.fx-(this.picSize+this.fFrame)/2,this.fy-(this.picSize+this.fFrame)/2,
				this.picSize+this.fFrame,this.picSize+this.fFrame);
			
			if(this.f.attackRange > 1){

				this.pathFrame += ((this.pathimg.width/192)*(this.pathimg.height/192) > this.pathFrame) ? 1:0;
				this.pathx = lerp(this.pathx,this.tx,0.31);
				this.pathy = lerp(this.pathy,this.ty,0.31)
				copy(this.pathimg,
					(this.pathFrame*192)%960,floor((this.pathFrame*192)/960)*192,192,192,
					this.pathx-(this.picSize)/2,this.pathy-(this.picSize)/2,
					this.picSize,this.picSize);
			}

		}else{
			this.tFrame += ((this.timg.width/192)*(this.timg.height/192) > this.tFrame) ? 1:0;
			copy(this.timg,
				(this.tFrame*192)%960,floor((this.tFrame*192)/960)*192,192,192,
				this.tx-(this.picSize+this.tFrame)/2,this.ty-(this.picSize+this.tFrame)/2,
				this.picSize+this.tFrame,this.picSize+this.tFrame);
		}
	}

	this.move = function(){
		this.tx += random(2,-2);
		this.ty += random(2,-2);
		this.time --;
	}
}
//attack systems -----------------------------------------------------------------

//ability systems -----------------------------------------------------------------
var abilityfinished,abilityRound = 0;
function abilityRoundown(){
	if(abilityRound == 0){
		ability();
		abilityRound += 1;
	}else if(abilityRound == 1){
		for(var i=0;i<ghostLV3.length;i++){
			ghostLV3[i].display();
			if(ghostLV3[i].time <0){
				damageTexts.push(new damageText(ghostLV3[i].hurt,ghostLV3[i].f));
				ghostLV3[i].hurt = 0;
				ghostLV3.splice(i,1);
			}
		}
			if(ghostLV3.length==0){
				abilityRound += 1;
			}
	}else if(abilityRound == 2){

		for(var i=0;i<ghostLV2.length;i++){
			ghostLV2[i].display();
			if(ghostLV2[i].time <0){
				damageTexts.push(new damageText(ghostLV2[i].hurt,ghostLV2[i].f));
				ghostLV2[i].hurt = 0;
				ghostLV2.splice(i,1);
			}
		}
			if(ghostLV2.length==0){
				abilityRound += 1;
			}
	}else if(abilityRound == 3){

		for(var i=0;i<ghostLV1.length;i++){
			ghostLV1[i].display();
			if(ghostLV1[i].time <0){
				damageTexts.push(new damageText(ghostLV1[i].hurt,ghostLV1[i].f));
				ghostLV1[i].hurt = 0;
				ghostLV1.splice(i,1);
			}
		}
			if(ghostLV1.length==0){
				abilityRound += 1;
			}
	}else if(abilityRound == 4){

		for(var i=0;i<ghostLV4.length;i++){
			ghostLV4[i].display();
			if(ghostLV4[i].time <0){
				damageTexts.push(new damageText(ghostLV4[i].hurt,ghostLV4[i].f));
				console.log(ghostLV4[i].hurt);
				ghostLV4[i].hurt = 0;
				ghostLV4.splice(i,1);
			}
		}
			if(ghostLV4.length==0 && damageTexts.length==0){
				console.log("abilityfinished");
				abilityfinished = true;
				abilityRound = 0;
			}
	}

	for(var i=0;i<damageTexts.length;i++){
		damageTexts[i].move();
		damageTexts[i].display();
		if(damageTexts[i].life <0){
			damageTexts.splice(i,1);
		}
	}
}

var ghosterAbilityToDoList = []
function ability(){
	var farmerAmountL=0,farmerAmountR=0,farmerWhoL = [],farmerWhoR = [];
	var angelAmountL=0,angelAmountR=0;
	//mpdata check for the needed data and who has abilities
	for (var i = mapData.length - 1; i >= 0; i--) {
		if(mapData[i].ghostName == 'farmer'){
			if(mapData[i].user == 1){
				farmerAmountL +=1;
				farmerWhoL.push(mapData[i]);
			}else if(mapData[i].user == 2){
				farmerAmountR +=1;
				farmerWhoR.push(mapData[i]);
			}
		}

		if(mapData[i].ghostName == 'angel'){
			if(mapData[i].user == 1){
				angelAmountL +=1;
			}else if(mapData[i].user == 2){
				angelAmountR +=1;
			}
		}

		if(mapData[i].ability > 0){
			ghosterAbilityToDoList.push(i);
		}
	}
	//ability push
	for (var i = ghosterAbilityToDoList.length - 1; i >= 0; i--) {
		 var j =ghosterAbilityToDoList[i];
		if(mapData[j].ability == 1){
			ghostLV1.push(new abilityAnimate(mapData[j].ability-1, mapData[j], 0, 0));
		}else if(mapData[j].ability == 4){
			if(mapData[j].user == 1){
				console.log(angelAmountL);
				ghostLV4.push(new abilityAnimate(mapData[j].ability-1, mapData[j], farmerWhoL, angelAmountL));
			}else if(mapData[j].user == 2){
				console.log(angelAmountR);
				ghostLV4.push(new abilityAnimate(mapData[j].ability-1, mapData[j], farmerWhoR, angelAmountR));
			}
		}
	}
	//clean the ghosterAbilityToDoList
	ghosterAbilityToDoList.splice(0,ghosterAbilityToDoList.length);
	/*
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
	}*/
}

function abilityAnimate(abilityType,from,dataA,dataB){
//abilityAnimations
	this.abilityType = abilityType;
	this.f = from;
	this.d = dataA;
	this.dII = dataB;
	this.fx = from.x;
	this.fy = from.y;
	this.tx = 0;
	this.ty = 0;
	this.pathx = from.x;
	this.pathy = from.y;

	this.aFrame = 0;
	this.aimg = abilityAnimations[abilityType];
	this.pathFrame = 0;
	this.pathimg = pathAnimations[abilityType];

	this.amountCount=0;
	this.hurt = 0;
	this.picSize = 96;
	this.time = 30;

	this.display = function(){
		if(this.abilityType+1 == 1){
			/*
			this.aFrame += ((this.aimg.width/192)*(this.aimg.height/192) > this.aFrame) ? 1:0;
			copy(this.aimg,
				(this.aFrame*192)%960,floor((this.aFrame*192)/960)*192,192,192,
				this.fx-(this.picSize+this.aFrame)/2,this.fy-(this.picSize+this.aFrame)/2,
				this.picSize+this.aFrame,this.picSize+this.aFrame);*/

			this.aFrame += (this.aFrame < this.aimg.frame-1) ? 1:0;
			imageMode(CENTER);
			console.log(this.aimg);
			image(this.aimg.pics[this.aFrame],this.fx,this.fy,this.picSize,this.picSize);

			if(this.time == 1){
				this.f.amount += 1;
				this.hurt = -1;
			}

		}else if(this.abilityType+1 == 4){
			this.aFrame += ((this.aimg.width/192)*(this.aimg.height/192) > this.aFrame) ? 1:0;
			copy(this.aimg,
				(this.aFrame*192)%960,floor((this.aFrame*192)/960)*192,192,192,
				this.fx-(this.picSize+this.aFrame)/2,this.fy-(this.picSize+this.aFrame)/2,
				this.picSize+this.aFrame,this.picSize+this.aFrame);
			this.pathFrame += ((this.pathimg.width/192)*(this.pathimg.height/192) > this.pathFrame) ? 1:0;
			for(var i=0;i<this.d.length;i++){
				
				if(this.time ==20){this.amountCount += this.d[i].amount;}
				this.tx = this.d[i].x;
				this.ty = this.d[i].y;
				this.pathx = lerp(this.fx,this.tx,this.time/20);
				this.pathy = lerp(this.fy,this.ty,this.time/20);

				copy(this.pathimg,
					(this.pathFrame*192)%960,floor((this.pathFrame*192)/960)*192,192,192,
					this.pathx-(this.picSize)/2,this.pathy-(this.picSize)/2,
					this.picSize,this.picSize);
			}

			if(this.time == 1){
				if(this.amountCount == 0){
					this.hurt = this.f.amount; 
					this.f.amount = 0;
				}else{
					console.log('['+this.f.user+']',floor(this.amountCount/this.dII),this.amountCount,this.dII);
					this.hurt = -1*(floor(this.amountCount/this.dII) - this.f.amount);
					this.f.amount += floor(this.amountCount/this.dII) - this.f.amount;
				}
			}
		}
		this.time --;
		/*
		if(this.time>20){
			this.fFrame += ((this.fimg.width/192)*(this.fimg.height/192) > this.fFrame) ? 1:0;
			copy(this.fimg,
				(this.fFrame*192)%960,floor((this.fFrame*192)/960)*192,192,192,
				this.fx-(this.picSize+this.fFrame)/2,this.fy-(this.picSize+this.fFrame)/2,
				this.picSize+this.fFrame,this.picSize+this.fFrame);
			
			if(this.f.attackRange > 1){

				this.pathFrame += ((this.pathimg.width/192)*(this.pathimg.height/192) > this.pathFrame) ? 1:0;
				this.pathx = lerp(this.pathx,this.tx,0.31);
				this.pathy = lerp(this.pathy,this.ty,0.31)
				copy(this.pathimg,
					(this.pathFrame*192)%960,floor((this.pathFrame*192)/960)*192,192,192,
					this.pathx-(this.picSize)/2,this.pathy-(this.picSize)/2,
					this.picSize,this.picSize);
			}

		}else{
			this.tFrame += ((this.timg.width/192)*(this.timg.height/192) > this.tFrame) ? 1:0;
			copy(this.timg,
				(this.tFrame*192)%960,floor((this.tFrame*192)/960)*192,192,192,
				this.tx-(this.picSize+this.tFrame)/2,this.ty-(this.picSize+this.tFrame)/2,
				this.picSize+this.tFrame,this.picSize+this.tFrame);
		}*/
	}
}

//ability systems -----------------------------------------------------------------

//------------------------------------------------------------------
