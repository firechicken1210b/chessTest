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
// window size things--------------------

// pics things--------------------
var bg,bg_floor,megaAnimation,state_guard,state_miss;
var character_peopleR = [],character_peopleL = [],character_sad = [];
var attackAnimations = [],useAnimations = [],pathAnimations = [],abilityAnimations = [];
function preload(){
	for(var i =-1;i<2;i+=2){
		attackAnimations[i] = [];
		useAnimations[i] = [];
		pathAnimations[i] = [];
		abilityAnimations[i] = [];
	}

	bg = loadImage('data/bg.jpg');
	bg_floor = loadImage('data/floor0.png');
	bg_floor_ = loadImage('data/floor.png');
	megaAnimation = loadImage('animations/mega02.png');
	state_guard = loadImage('data/g.png');
	state_miss = loadImage('data/m.png');
	//-------------------------------------------<<<<<<<<<<<<<<<<<<<<<<<<<<<
	character_peopleR.push(loadImage('data/people00.png'));
	character_peopleL.push(loadImage('data/people0.png'));
	animationAdd(1,loadImage('animations/people_00use.png'),6,'useAnimations');
	animationAdd(1,loadImage('animations/people_00attack.png'),6,'attackAnimations');
	animationAdd(1,0,0,'pathAnimations');
	animationAdd(1,loadImage('animations/people_00ability.png'),30,'abilityAnimations');

	character_peopleR.push(loadImage('data/people11.png'));
	character_peopleL.push(loadImage('data/people1.png'));
	animationAdd(1,loadImage('animations/people_00use.png'),6,'useAnimations');
	animationAdd(1,loadImage('animations/people_01attack.png'),18,'attackAnimations');
	animationAdd(1,loadImage('animations/people_01path.png'),16,'pathAnimations');
	animationAdd(1,0,0,'abilityAnimations');

	character_peopleR.push(loadImage('data/people22.png'));
	character_peopleL.push(loadImage('data/people2.png'));
	animationAdd(1,loadImage('animations/people_02use.png'),6,'useAnimations');
	animationAdd(1,loadImage('animations/people_02attack.png'),18,'attackAnimations');
	animationAdd(1,loadImage('animations/people_02path.png'),16,'pathAnimations');
	animationAdd(1,0,0,'abilityAnimations');

	character_peopleR.push(loadImage('data/people33.png'));
	character_peopleL.push(loadImage('data/people3.png'));
	animationAdd(1,loadImage('animations/people_00use.png'),6,'useAnimations');
	animationAdd(1,loadImage('animations/people_03attack.png'),31,'attackAnimations');
	animationAdd(1,loadImage('animations/people_03path.png'),25,'pathAnimations');
	animationAdd(1,loadImage('animations/people_03ability.png'),15,'abilityAnimations');
	//-------------------------------------------<<<<<<<<<<<<<<<<<<<<<<<<<<<

	character_sad.push(loadImage('data/sad0.png'));
	animationAdd(-1,loadImage('animations/people_00use.png'),6,'useAnimations');
	animationAdd(-1,loadImage('animations/sad_00attack.png'),10,'attackAnimations');
	animationAdd(-1,loadImage('animations/people_03path.png'),25,'pathAnimations');
	animationAdd(-1,loadImage('animations/sad_00ability.png'),25,'abilityAnimations');

	character_sad.push(loadImage('data/sad1.png'));
	animationAdd(-1,loadImage('animations/people_00use.png'),6,'useAnimations');
	animationAdd(-1,loadImage('animations/sad_01attack.png'),7,'attackAnimations');
	animationAdd(-1,loadImage('animations/people_03path.png'),25,'pathAnimations');
	animationAdd(-1,loadImage('animations/sad_01ability.png'),14,'abilityAnimations');

	character_sad.push(loadImage('data/sad3b.png'));
	animationAdd(-1,0,0,'useAnimations');
	animationAdd(-1,0,0,'attackAnimations');
	animationAdd(-1,loadImage('animations/sad_01ability.png'),14,'pathAnimations');
	animationAdd(-1,loadImage('animations/sad_03use.png'),12,'abilityAnimations');

	character_sad.push(loadImage('data/sad2.png'));
	animationAdd(-1,loadImage('animations/people_00use.png'),6,'useAnimations');
	animationAdd(-1,loadImage('animations/sad_02attack.png'),28,'attackAnimations');
	animationAdd(-1,loadImage('animations/people_03path.png'),25,'pathAnimations');
	animationAdd(-1,loadImage('animations/sad_02ability.png'),26,'abilityAnimations');
}

function animationAdd(dataUnit,data,frame,whichone){
	var picinfo = {
		pic :  data,
		frame : frame
	}
	if(whichone == 'useAnimations'){
		useAnimations[dataUnit].push(picinfo);
	}else if(whichone == 'attackAnimations'){
		attackAnimations[dataUnit].push(picinfo);
	}else if(whichone == 'pathAnimations'){
		pathAnimations[dataUnit].push(picinfo);
	}else if(whichone == 'abilityAnimations'){
		abilityAnimations[dataUnit].push(picinfo);
	}
}
// pics things--------------------

//map info
var r = 35,between = 6;
var row = 16,column = 13;
//info
var player,unit=1;
var roundis = 1,roundCount = 0;
var readyButton,ready = false;
var pointMe;
var cnv;
// main processing things--------------------
function setup() {
	cnv = createCanvas(900,900).parent('processing');
	frameRate(32);
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
	  	drawSprites();
	  	roundown();
	  	showtheState();

	  	//stupid UI
	  	noStroke();
		fill(0);
	  	textAlign(CENTER);
	  	textStyle(BOLD);
	  	textSize(13);
	  	text('Round: '+roundis, width/2, 30);
	  	text(upData.Lplayer, 60, 30);
	  	text(upData.Rplayer, width-60, 30);
	  	textStyle(ITALIC);
		text('lost angels with dirty tears', width/2+10, height-20);

		if(pointMe!=0){
			var i = mapdataFounder(pointMe.position.x,pointMe.position.y).rowis*column+mapdataFounder(pointMe.position.x,pointMe.position.y).columnis;
			if(mapData[i].user >0){
				//showAttackRandge
				stroke(255,0,0,200);
				strokeWeight(1);
				noFill();
				rectMode(CENTER);
				var showAttackRandge = (r+between)*(mapData[i].attackRange*2+1);
				rect(mapData[i].x,mapData[i].y,showAttackRandge,showAttackRandge);
				//showGhostInfo
				stroke(0);
				strokeWeight(1);
				fill(255,200);
				rectMode(CORNER);
				var rectX = (textWidth(mapData[i].ghostName) > 42) ? 100+textWidth(mapData[i].ghostName)-42:100;
				rect(mouseX,mouseY,rectX,105);
				noStroke();
				fill(0);
				textAlign(LEFT);
				textStyle(NORMAL);
				text('Player: '+mapData[i].user,mouseX+10,mouseY+13*2);
				text('Name: '+mapData[i].ghostName,mouseX+10,mouseY+13*3);
				text('Step: '+mapData[i].step,mouseX+10,mouseY+13*4);
				text('Attack: '+mapData[i].attack,mouseX+10,mouseY+13*5);
				text('AttackRange: '+mapData[i].attackRange,mouseX+10,mouseY+13*6);
				text('Movable: '+mapData[i].chessMovable,mouseX+10,mouseY+13*7);
				tellMeAbility(mapData[i]);
			}
			if(chessMoving !=0 && distanceMovable(chessMoving,mapData[i]) && mapData[i].user ==0){
				//showAttackRandge
				stroke(0,0,255);
				strokeWeight(1);
				noFill();
				rectMode(CENTER);
				var showAttackRandge = (r+between)*(chessMoving.attackRange*2+1);
				rect(mapData[i].x,mapData[i].y,showAttackRandge,showAttackRandge);
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
						unit : mapData[i].unit,
						ghostName: mapData[i].ghostName,
						ghostLevel: mapData[i].ghostLevel,
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
		console.log('roundis: '+roundis);
		if(upData.Rroundis == upData.Lroundis){
			for(var i=0;i<mapData.length;i++){
				mapData[i].amount = 0;
				ghostcleaning(mapData[i]);
			}	

			for(var i=0;i<upData.Lmapdata.length;i++){
				var updata_who = upData.Lmapdata[i].row*column+upData.Lmapdata[i].column;
				var newGhost = createSprite(upData.Lmapdata[i].x,upData.Lmapdata[i].y,r-1,r-1);
				mapData[updata_who].user = upData.Lmapdata[i].user;
				mapData[updata_who].unit = upData.Lmapdata[i].unit;
				mapData[updata_who].ghost = newGhost;
				mapData[updata_who].ghostName = upData.Lmapdata[i].ghostName;
				mapData[updata_who].ghostLevel = upData.Lmapdata[i].ghostLevel;
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

				if(mapData[updata_who].amount*mapData[updata_who].attack == upData.Rmapdata[i].amount*upData.Rmapdata[i].attack && mapData[updata_who].user !=0){
					mapData[updata_who].amount = 0;
					ghostcleaning(mapData[updata_who]);
					stateShows.push(new stateShow(upData.Rmapdata[i],1));
					console.log('Both Miss! ',mapData[updata_who].row,mapData[updata_who].column,'both die');
					//both die
				}else if(mapData[updata_who].amount*mapData[updata_who].attack > upData.Rmapdata[i].amount*upData.Rmapdata[i].attack){
					//playerL win
					if(player == 1){
						stateShows.push(new stateShow(upData.Rmapdata[i],2));
						console.log('Guard! ',mapData[updata_who].row,mapData[updata_who].column,'enemy die');
					}else if(player == 2){
						stateShows.push(new stateShow(upData.Rmapdata[i],1));
						console.log('Miss! ',mapData[updata_who].row,mapData[updata_who].column,'enemy win');
					}
				}else{
					if(mapData[updata_who].user==0){
						var newGhost = createSprite(upData.Rmapdata[i].x,upData.Rmapdata[i].y,r-1,r-1);
						mapData[updata_who].ghost = newGhost;
					}else{
						//playerR win
						if(player == 1){
							stateShows.push(new stateShow(upData.Rmapdata[i],1));
							console.log('Miss! ',mapData[updata_who].row,mapData[updata_who].column,'enemy win');
						}else if(player == 2){
							stateShows.push(new stateShow(upData.Rmapdata[i],2));
							console.log('Guard! ',mapData[updata_who].row,mapData[updata_who].column,'enemy die');
						}
					}
					mapData[updata_who].user = upData.Rmapdata[i].user;
					mapData[updata_who].unit = upData.Rmapdata[i].unit;
					mapData[updata_who].ghostName = upData.Rmapdata[i].ghostName;
					mapData[updata_who].ghostLevel = upData.Rmapdata[i].ghostLevel;
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
				unit : 0,
				ghost : 0,
				ghostLevel : 0,
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
				var k = mapdataFounder(this.position.x,this.position.y).rowis*column+mapdataFounder(this.position.x,this.position.y).columnis;
				if(chessMoving == 0){
					if(mapData[k].user > 0 && mapData[k].chessMovable){
						image(bg_floor_,0,0);
					}else{
						image(bg_floor,0,0);
					}
				}else{
					if(distanceMovable(chessMoving,mapData[k]) && (mapData[k].user==player || mapData[k].user==0)){
						image(bg_floor_,0,0);
					}else{
						image(bg_floor,0,0);
					}
				}
				if(mapData[k].user > 0 && mapData[k].user != player){
					noFill();
					stroke(255,0,0,200);
					strokeWeight(1);
					rectMode(CENTER);
					rect(0,0,r,r);
				}
			}
			emptyGhost.onMousePressed = function() {
				var k = mapdataFounder(this.position.x,this.position.y).rowis*column+mapdataFounder(this.position.x,this.position.y).columnis;
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
							if(mapData[k].user == player || mapData[k].user == 0){
								dataInherit(chessMoving,mapData[k]);
								move = 0;
							}
						}else{
							move = 0;
							chessMoving = 0;
						}
					}
				}
			};
			
			emptyGhost.onMouseReleased = function() {
				var k = mapdataFounder(this.position.x,this.position.y).rowis*column+mapdataFounder(this.position.x,this.position.y).columnis;
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
			};
			emptyGhost.onMouseOver = function() {
				pointMe=this;
				this.draw = function(){
					imageMode(CENTER);
					var k = mapdataFounder(this.position.x,this.position.y).rowis*column+mapdataFounder(this.position.x,this.position.y).columnis;
					if(chessMoving ==0){
						image(bg_floor_,0,0);
					}else{
						if(distanceMovable(chessMoving,mapData[k])){
							image(bg_floor_,0,0);
						}else{
							stroke(255,0,0);
							image(bg_floor,0,0);
						}
					}
					noFill();
					strokeWeight(1);
					rectMode(CENTER);
					rect(0,0,r,r);
				}
			};
			emptyGhost.onMouseOut = function() {
				pointMe =0;
				this.draw = function(){
					var k = mapdataFounder(this.position.x,this.position.y).rowis*column+mapdataFounder(this.position.x,this.position.y).columnis;
					imageMode(CENTER);
					if(chessMoving == 0){
						if(mapData[k].user > 0 && mapData[k].chessMovable){
							image(bg_floor_,0,0);
						}else{
							image(bg_floor,0,0);
						}
					}else{
						if(mapData[k] == chessMoving || distanceMovable(chessMoving,mapData[k])){
							image(bg_floor_,0,0);
						}else{
							image(bg_floor,0,0);
						}
					}
					if(mapData[k].user > 0 && mapData[k].user != player){
						noFill();
						stroke(255,0,0,200);
						strokeWeight(1);
						rectMode(CENTER);
						rect(0,0,r,r);
					}
				}
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

	if(player == 1){
		var bornX = floor(random(0,row/2));
		var bornY = floor(random(0,column-1));
		console.log('born at:',bornX,bornY);
		//unit = -1;
		if(unit == 1){
			ghostMaker(1,unit,1,9,bornX,bornY);
		}else if(unit == -1){
			ghostMaker(1,unit,1,1,bornX,bornY);
		}

	}
	if(player == 2){
		var bornX = floor(random(row/2,row));
		var bornY = floor(random(0,column-1));
		console.log('born at:',bornX,bornY);
		//ghostMaker(2,unit,1,data,bornX,bornY);
		if(unit == 1){
			ghostMaker(2,unit,1,9,bornX,bornY);
		}else if(unit == -1){
			ghostMaker(2,unit,1,1,bornX,bornY);
		}

	}
	
}
//move system (mouse press)-----------------------------------------------------------------
function deliver(OldData,NewData){
	if(NewData.user == 0){
		console.log('[181]: ' ,OldData.row,OldData.column ,' deliver ',ceil(OldData.amount/2), ' to ' , NewData.row,NewData.column);
		OldData.chessMovable = false;
			var ghost = createSprite(NewData.x,NewData.y,r-1,r-1);
			NewData.user = OldData.user;
			NewData.unit = OldData.unit;
			NewData.ghost = ghost ;
			NewData.ghostName =OldData.ghostName ;
			NewData.ghostLevel =OldData.ghostLevel ;
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
//move system (mouse press)-----------------------------------------------------------------

//move system (just click)-----------------------------------------------------------------
function dataInherit(OldData,NewData){
	//var enemy = (player ==1)? 2:1;
	//if(OldData.user != enemy && NewData.user != enemy){
		var changeuser = NewData.user;
		var changeunit = NewData.unit;
		var changeghost = NewData.ghost;
		var changeghostName = NewData.ghostName;
		var changeghostLevel = NewData.ghostLevel;
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
			NewData.unit = OldData.unit;
			NewData.ghost =OldData.ghost ;
			NewData.ghostName =OldData.ghostName ;
			NewData.ghostLevel =OldData.ghostLevel ;
			NewData.amount = OldData.amount;
			NewData.step = OldData.step;
			NewData.attack = OldData.attack;
			NewData.attackMode = OldData.attackMode;
			NewData.attackRange = OldData.attackRange;
			NewData.ability = OldData.ability;
			NewData.chessMovable = false;
				OldData.user = changeuser;
				OldData.unit = changeunit;
				OldData.ghost = changeghost;
				OldData.ghostName = changeghostName;
				OldData.ghostLevel = changeghostLevel;
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
	//}
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

function mapdataFounder(map_x,map_y){
	var rowis = (map_x - (width-((row-1)*(r+between)))/2 )/(r+between);
	var columnis = (map_y - (height-(column-1)*(r+between))/2)/(r+between);
	var data = {
		rowis: rowis,
		columnis : columnis
	}
	return data;
}

function ghostMaker(whosghost,ghostUnit,ghostLevel,amount,bornX,bornY){
	var newGhost = createSprite(mapData[bornX*column+bornY].x,mapData[bornX*column+bornY].y,r-1,r-1);

	mapData[bornX*column+bornY].user = whosghost;
	mapData[bornX*column+bornY].unit = ghostUnit;
	mapData[bornX*column+bornY].ghost = newGhost;
	mapData[bornX*column+bornY].ghostName = megaListBoard[ghostUnit][ghostLevel-1].ghostName;
	mapData[bornX*column+bornY].ghostLevel = ghostLevel;
	mapData[bornX*column+bornY].amount = amount;
	mapData[bornX*column+bornY].step = megaListBoard[ghostUnit][ghostLevel-1].step;
	mapData[bornX*column+bornY].attack = megaListBoard[ghostUnit][ghostLevel-1].attack;
	mapData[bornX*column+bornY].attackMode = megaListBoard[ghostUnit][ghostLevel-1].attackMode;
	mapData[bornX*column+bornY].attackRange = megaListBoard[ghostUnit][ghostLevel-1].attackRange;
	mapData[bornX*column+bornY].ability = megaListBoard[ghostUnit][ghostLevel-1].ability;
	ghostDrawer(mapData[bornX*column+bornY]);
}

function ghostDrawerText(data,text_x,text_y){
	textAlign(CENTER);
	stroke(0);
	strokeWeight(3);
	fill(0);
	text(data,text_x,text_y);
	noStroke();
	fill(255);
	text(data,text_x,text_y);
}

function gethurtDrawerText(data,text_x,text_y){
	if(data != 0 && roundCount % 5 ==2 && !attackfinished){
		textAlign(CENTER);
		stroke(0);
		strokeWeight(3);
		fill(0);
		text(data,text_x,text_y);
		noStroke();
		if(data > 0){
			fill(255,0,0);
		}else{
			fill(0,255,0);
		}	
		text(data,text_x,text_y);
	}
}

function ghostDrawer(data){
	if(data.amount <= 0){
		ghostcleaning(data);
	}else{
		if(data.unit == 1){
			if(data.ghostName == 'Farmer'){
				data.ghost.draw = function(){
					if(data.user==1){
						imageMode(CENTER);
						image(character_peopleL[0],0,0);
					}else if(data.user==2){
						imageMode(CENTER);
						image(character_peopleR[0],0,0);
					}
					gethurtDrawerText(data.getHurt,11,0);
					ghostDrawerText(data.amount,11,13);
				}

			}else if(data.ghostName == 'Knight'){
				data.ghost.draw = function(){
					if(data.user==1){
						imageMode(CENTER);
						image(character_peopleL[1],0,0);
					}else if(data.user==2){
						imageMode(CENTER);
						image(character_peopleR[1],0,0);
					}
					gethurtDrawerText(data.getHurt,11,0);
					ghostDrawerText(data.amount,11,13);
				}

			}else if(data.ghostName == 'Shooter'){
				data.ghost.draw = function(){
					if(data.user==1){
						imageMode(CENTER);
						image(character_peopleL[2],0,0);
					}else if(data.user==2){
						imageMode(CENTER);
						image(character_peopleR[2],0,0);
					}
					gethurtDrawerText(data.getHurt,11,0);
					ghostDrawerText(data.amount,11,13);
				}
			}else if(data.ghostName == 'Angel'){
				data.ghost.draw = function(){
					if(data.user==1){
						imageMode(CENTER);
						image(character_peopleL[3],0,0);
					}else if(data.user==2){
						imageMode(CENTER);
						image(character_peopleR[3],0,0);
					}
					gethurtDrawerText(data.getHurt,11,0);
					ghostDrawerText(data.amount,11,13);
				}
			}
		}else if(data.unit == -1){
			if(data.ghostName == 'DeathKing'){
				data.ghost.draw = function(){
					imageMode(CENTER);
					image(character_sad[0],0,0);
					gethurtDrawerText(data.getHurt,11,0);
					ghostDrawerText(data.amount,11,13);
				}

			}else if(data.ghostName == 'Illegal'){
				data.ghost.draw = function(){
					imageMode(CENTER);
					image(character_sad[1],0,0);
					gethurtDrawerText(data.getHurt,11,0);
					ghostDrawerText(data.amount,11,13);
				}

			}else if(data.ghostName == 'GateofSighs'){
				data.ghost.draw = function(){
					imageMode(CENTER);
					image(character_sad[2],0,0);
					gethurtDrawerText(data.getHurt,11,0);
					ghostDrawerText(data.amount,11,13);
				}
			}else if(data.ghostName == 'Michiko'){
				data.ghost.draw = function(){
					imageMode(CENTER);
					image(character_sad[3],0,0);
					gethurtDrawerText(data.getHurt,11,0);
					ghostDrawerText(data.amount,11,13);
				}
			}
		}
	}
}

function ghostcleaning(data){
	if(data.amount <= 0 && data.user !=0){
		data.user = 0;
		data.unit = 0;
		if(data.ghost!=0){data.ghost.remove();}
		data.ghost = 0;
		data.ghostName = 0;
		data.ghostLevel = 0;
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
  			mapData[i].user = 0;
  			mapData[i].unit = 0;
  			if(mapData[i].ghost!=0){mapData[i].ghost.remove();}
  			mapData[i].ghost = 0;
  			mapData[i].ghostName = 0;
  			mapData[i].ghostLevel = 0;
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
	for(var i = -1;i<3;i++){
		megaListBoard[i] = [];
	}
//-----------------------------------<<<<<<<<<<<<<<<<<<
	var data ={
		ghostName : 'Farmer',
		unit : 1,
		ghostLevel : 1,
		step : 1,
		attack : 1,
		attackMode : 1,
		attackRange : 1,
		ability : 1
	}
	megaListBoard[1].push(data);

	var data ={
		unit : 1,
		ghostLevel : 2,
		ghostName : 'Knight',
		step : 4,
		attack : 2,
		attackMode : 2,
		attackRange : 3,
		ability : 0
	}
	megaListBoard[1].push(data);

	var data ={
		unit : 1,
		ghostLevel : 3,
		ghostName : 'Shooter',
		step : 2,
		attack : 3,
		attackMode : 3,
		attackRange : 5,
		ability : 0
	}
	megaListBoard[1].push(data);

	var data ={
		unit : 1,
		ghostLevel : 4,
		ghostName : 'Angel',
		step : 1,
		attack : 2,
		attackMode : 1,
		attackRange : 1,
		ability : 4
	}
	megaListBoard[1].push(data);
//-----------------------------------<<<<<<<<<<<<<<<<<<
	var data ={
		unit : -1,
		ghostLevel : 1,
		ghostName : 'DeathKing',
		step : 0,
		attack : 1,
		attackMode : 1,
		attackRange : 1,
		ability : 1
	}
	megaListBoard[-1].push(data);

	var data ={
		unit : -1,
		ghostLevel : 2,
		ghostName : 'Illegal',
		step : 3,
		attack : 2,
		attackMode : 1,
		attackRange : 1,
		ability : 2
	}
	megaListBoard[-1].push(data);

	var data ={
		unit : -1,
		ghostLevel : 3,
		ghostName : 'GateofSighs',
		step : 0,
		attack : 0,
		attackMode : 0,
		attackRange : 0,
		ability : 3
	}
	megaListBoard[-1].push(data);

	var data ={
		unit : -1,
		ghostLevel : 4,
		ghostName : 'Michiko',
		step : 16,
		attack : 3,
		attackMode : 3,
		attackRange : 3,
		ability : 4
	}
	megaListBoard[-1].push(data);
//-----------------------------------<<<<<<<<<<<<<<<<<<
}

var megafinished,megaRound = 0;
function megaRoundown(){
	if(megaRound == 0){
		mega();
		megaRound += 1;
	}else if(megaRound == 1){
		if(megaAnimateList.length>0){
			megaAnimateList[0].display();
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
			if(secondary.ghostName == primary.ghostName && secondary.user == primary.user && primary.ghostName!=megaListBoard[unit][megaListBoard[unit].length-1].ghostName){
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
			if(thirdary.ghostName == primary.ghostName && thirdary.user == primary.user && primary.ghostName!=megaListBoard[unit][megaListBoard[unit].length-1].ghostName){
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
	if(data.ghostLevel<megaListBoard[data.unit].length){
		data.ghostName = megaListBoard[data.unit][data.ghostLevel].ghostName;
		data.step = megaListBoard[data.unit][data.ghostLevel].step;
		data.attack = megaListBoard[data.unit][data.ghostLevel].attack;
		data.attackMode = megaListBoard[data.unit][data.ghostLevel].attackMode;
		data.attackRange = megaListBoard[data.unit][data.ghostLevel].attackRange;
		data.ability = megaListBoard[data.unit][data.ghostLevel].ability;
		data.ghostLevel=data.ghostLevel+1;
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
			int(this.fx-(this.picSize+this.mframe)/2), int(this.fy-(this.picSize+this.mframe)/2),
			this.picSize+this.mframe,this.picSize+this.mframe);	
		copy(this.img,
			(this.mframe*192)%960,floor((this.mframe*192)/960)*192,192,192,
			int(this.tx-(this.picSize+this.mframe)/2), int(this.ty-(this.picSize+this.mframe)/2),
			this.picSize+this.mframe,this.picSize+this.mframe);	
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
			ghostSetup(1,9);
			for(var i=0;i<mapData.length;i++){
		  		if(mapData[i].user >0){
		  			mapData[i].chessMovable = true;
		  		}
		  	}
		}
	}else if(login){		
		if(upData.Rconnection == 0){
			console.log('right side lost connect');
		}else if(upData.Lconnection == 0){
			console.log('left side lost connect');
		}

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
				roomRef.onDisconnect().update({ "Lconnection": 0 });

				if(input.value().indexOf("sad")==0){unit = -1;console.log("cccccc"+input.value().indexOf("sad"));}
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
		
							roomRef.on('value',gotData,errData);
							roomRef.onDisconnect().update({ "Rconnection": 0 });

							if(input.value().indexOf("sad")==0){unit = -1;console.log("cccccc"+input.value().indexOf("sad"));}
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
	var i =0;
	if(attackRound == 0){

		attack();
		attackRound+=1;
	}else if(attackRound==1){
		if(ghostLV3.length >0){
			ghostLV3[0].move();
			ghostLV3[0].display();
			if(ghostLV3[i].time <0){
				//damageTexts.push(new damageText(ghostLV3[0].hurt,ghostLV3[0].t));
				ghostLV3.splice(0,1);
			}
		}else if(ghostLV2.length >0){
			ghostLV2[0].move();
			ghostLV2[0].display();
			if(ghostLV2[i].time <0){
				//damageTexts.push(new damageText(ghostLV2[0].hurt,ghostLV2[0].t));
				ghostLV2.splice(0,1);
			}
		}else if(ghostLV1.length >0){
			ghostLV1[0].move();
			ghostLV1[0].display();
			if(ghostLV1[i].time <0){
				//damageTexts.push(new damageText(ghostLV1[0].hurt,ghostLV1[0].t));
				ghostLV1.splice(0,1);
			}
		}else if(ghostLV4.length >0){
			ghostLV4[0].move();
			ghostLV4[0].display();
			if(ghostLV4[i].time <0){
				//damageTexts.push(new damageText(ghostLV4[0].hurt,ghostLV4[0].t));
				ghostLV4.splice(0,1);
			}
		}else if(damageTexts.length ==0){
			console.log("attackfinished");
			displayAaaFinished = true;
			attackRound = 0;
			attackfinished = true;
		}

		for(var i=0;i<damageTexts.length;i++){
			damageTexts[i].move();
			damageTexts[i].display();
			if(damageTexts[i].life <0){
				damageTexts.splice(i,1);
			}
		}
	}
}

/*
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
		//displayAaA();
		displayAaaFinished = true;
		if(damageTexts.length==0 && displayAaaFinished){
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
*/
function attack(){
	for (var i = mapData.length - 1; i >= 0; i--) {
		if(mapData[i].user > 0) {
			var enemy = (mapData[i].user ==1)? 2:1;
			var distList = [];
			var attackwho;
			var attack_row,attack_column;

			if(mapData[i].attackMode <3) {
				for(var j =mapData[i].row+mapData[i].attackRange*-1;j<=mapData[i].row+mapData[i].attackRange;j++){
				for(var k=mapData[i].column+mapData[i].attackRange*-1;k<=mapData[i].column+mapData[i].attackRange;k++){
						//check the enemy in the attackRange with in the map
						if(j<row && j>=0 && k<column && k>=0 && mapData[j*column+k].user == enemy){
							var distdist = dist(mapData[i].x,mapData[i].y,mapData[j*column+k].x,mapData[j*column+k].y);
							if(distdist > 0) distList.push(distdist);
							distList = sort(distList,distList.length);
							//if attackrange >= 5 hit the most far enemy or hit the closest enemy
							//attackwho = (mapData[i].attackRange >= 5)? distList[distList.length-1]:distList[0];
							attackwho = distList[0];
							if(distdist == attackwho){
								attack_row = j;
								attack_column = k;
							}
						}
				}
				}

				if(distList[0] >0){
					var attackTarget = attack_row*column+attack_column;
					mapData[attackTarget].getHurt += mapData[i].attack*mapData[i].amount;
					attackation(mapData[i].attack*mapData[i].amount,mapData[i],mapData[attackTarget]);
					console.log('['+mapData[i].user+']',mapData[i].row,mapData[i].column,mapData[i].ghostName+':'+mapData[i].amount,'hit the','['+mapData[attackTarget].user+']',mapData[attackTarget].row,mapData[attackTarget].column,mapData[attackTarget].ghostName+':'+mapData[attackTarget].amount,'damage: ',mapData[i].attack*mapData[i].amount,'last:',mapData[attackTarget].amount - mapData[attackTarget].getHurt);
				}
			}else if(mapData[i].attackMode == 3) {
				for(var j =mapData[i].row+mapData[i].attackRange*-1;j<=mapData[i].row+mapData[i].attackRange;j++){
				for(var k=mapData[i].column+mapData[i].attackRange*-1;k<=mapData[i].column+mapData[i].attackRange;k++){
						//check the enemy in the attackRange with in the map
						if(j<row && j>=0 && k<column && k>=0 && mapData[j*column+k].user == enemy){
							var distdist = dist(mapData[i].x,mapData[i].y,mapData[j*column+k].x,mapData[j*column+k].y);
							if(distdist > 0) distList.push(distdist);
							distList = sort(distList,distList.length);
							//if attackrange >= 5 hit the most far enemy or hit the closest enemy
							attackwho = distList[distList.length-1];
							if(distdist == attackwho){
								attack_row = j;
								attack_column = k;
							}
						}
				}
				}

				if(distList[0] >0){
					var attackTarget = attack_row*column+attack_column;
					mapData[attackTarget].getHurt += mapData[i].attack*mapData[i].amount;
					attackation(mapData[i].attack*mapData[i].amount,mapData[i],mapData[attackTarget]);
					console.log('['+mapData[i].user+']',mapData[i].row,mapData[i].column,mapData[i].ghostName+':'+mapData[i].amount,'hit the','['+mapData[attackTarget].user+']',mapData[attackTarget].row,mapData[attackTarget].column,mapData[attackTarget].ghostName+':'+mapData[attackTarget].amount,'damage: ',mapData[i].attack*mapData[i].amount,'last:',mapData[attackTarget].amount - mapData[attackTarget].getHurt);
				}

			}
		}
	}
} 

var ghostLV1 = [];
var ghostLV2 = [];
var ghostLV3 = [];
var ghostLV4 = [];

function attackation(damageCount,from,to){
	if(from.ghostLevel == 1){
		ghostLV1.push(new attackAnimate(damageCount,from,to));
	}else if(from.ghostLevel == 2){
		ghostLV2.push(new attackAnimate(damageCount,from,to));
	}else if(from.ghostLevel == 3){
		ghostLV3.push(new attackAnimate(damageCount,from,to));
	}else if(from.ghostLevel == 4){
		ghostLV4.push(new attackAnimate(damageCount,from,to));
	}
}

function attackAnimate(damageCount,from,to){

	this.f = from;
	this.t = to;
	this.fx = from.x;
	this.fy = from.y;
	this.fFrame = 0;
	this.fimg = useAnimations[from.unit][from.ghostLevel-1];
	this.tx = to.x;
	this.ty = to.y;
	this.tFrame = 0;
	this.timg = attackAnimations[from.unit][from.ghostLevel-1];
	this.pathx = from.x;
	this.pathy = from.y;
	this.pathFrame = 0;
	this.pathimg = pathAnimations[from.unit][from.ghostLevel-1];

	this.hurt = damageCount;
	this.picSize = 96;
	this.time = 40;

	this.display = function(){
		if(this.time>20){
			
			if(this.f.attackMode ==3){

				this.pathFrame += (this.pathimg.frame > this.pathFrame) ? 1:0;
				//this.pathx = lerp(this.pathx,this.tx,0.31);
				//this.pathy = lerp(this.pathy,this.ty,0.31)
				this.pathx = lerp(this.tx,this.pathx,(this.time-20)/20);
				this.pathy = lerp(this.ty,this.pathy,(this.time-20)/20);
				copy(this.pathimg.pic,
					(this.pathFrame*192)%960, floor((this.pathFrame*192)/960)*192, 192, 192,
					int(this.pathx-(this.picSize)/2), int(this.pathy-(this.picSize)/2),
					this.picSize, this.picSize);
			}

			if(this.f.attackMode < 3){
				this.f.ghost.position.x = lerp(this.tx,this.f.ghost.position.x,this.time/40);
				this.f.ghost.position.y = lerp(this.ty,this.f.ghost.position.y,this.time/40);
			}

		}else{
			if(this.time == this.time/4){
				damageTexts.push(new damageText(this.hurt,this.t));
			}

			this.tFrame += (this.timg.frame > this.tFrame) ? 1:0;
			copy(this.timg.pic,
				(this.tFrame*192)%960, floor((this.tFrame*192)/960)*192, 192, 192,
				int(this.tx-(this.picSize+this.tFrame)/2), int(this.ty-(this.picSize+this.tFrame)/2),
				this.picSize+this.tFrame, this.picSize+this.tFrame);
			if(this.time == 0){
				this.time = 0;
				this.f.ghost.position.x = this.fx;
				this.f.ghost.position.y = this.fy;
				this.t.ghost.position.x = this.tx;
				this.t.ghost.position.y = this.ty;
				console.log(this.t.ghost.position.x , this.tx,this.t.ghost.position.y , this.ty);
			}else if(this.time >0){
				this.t.ghost.position.x += random(2,-2);
				this.t.ghost.position.y += random(2,-2);
			}
		}
	}

	this.move = function(){
		this.time --;
	}
}

function Ability_after_Attack(){
	for(var i =0;i<mapData.length;i++){
		if(mapData[i].ability < 0){
			if(mapData[i].ghostLevel == 1){
				ghostLV1.push(abilityAnimate(abilityType,from,dataA,dataB));
			}else if(mapData[i].ghostLevel == 2){
				ghostLV2.push(abilityAnimate(abilityType,from,dataA,dataB));
			}else if(mapData[i].ghostLevel == 3){
				ghostLV3.push(abilityAnimate(abilityType,from,dataA,dataB));
			}else if(mapData[i].ghostLevel == 4){
				ghostLV4.push(abilityAnimate(abilityType,from,dataA,dataB));
			}
		}
	}
}
var displayAaaRound=0,displayAaaFinished = false;
function displayAaA(){
	if(displayAaaRound == 0){
		Ability_after_Attack();
		displayAaaRound += 1;
	}else if(displayAaaRound == 1){
		for(var i=0;i<ghostLV3.length;i++){
			ghostLV3[i].move();
			ghostLV3[i].display();
			if(ghostLV3[i].time <0){
				damageTexts.push(new damageText(ghostLV3[i].hurt,ghostLV3[i].t));
				ghostLV3.splice(i,1);
			}
		}
			if(ghostLV3.length==0){
				displayAaaRound += 1;
			}
	}else if(displayAaaRound == 2){
		for(var i=0;i<ghostLV2.length;i++){
			ghostLV2[i].move();
			ghostLV2[i].display();
			if(ghostLV2[i].time <0){
				damageTexts.push(new damageText(ghostLV2[i].hurt,ghostLV2[i].t));
				ghostLV2.splice(i,1);
			}
		}
			if(ghostLV2.length==0){
				displayAaaRound += 1;
			}
	}else if(displayAaaRound == 3){
		for(var i=0;i<ghostLV1.length;i++){
			ghostLV1[i].move();
			ghostLV1[i].display();
			if(ghostLV1[i].time <0){
				damageTexts.push(new damageText(ghostLV1[i].hurt,ghostLV1[i].t));
				ghostLV1.splice(i,1);
			}
		}
			if(ghostLV1.length==0){
				displayAaaRound += 1;
			}
	}else if(displayAaaRound == 4){
		for(var i=0;i<ghostLV4.length;i++){
			ghostLV4[i].move();
			ghostLV4[i].display();
			if(ghostLV4[i].time <0){
				damageTexts.push(new damageText(ghostLV4[i].hurt,ghostLV4[i].t));
				ghostLV4.splice(i,1);
			}
		}
			if(ghostLV4.length==0){
				console.log("displayAaaFinished");
				displayAaaRound = 0;
				displayAaaFinished = true;
			}
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

var ghosterAbilityToDoList = [],dataAbilityList = [];
function ability(){
	var farmerWho = [],deathKingWho = [],illegalWho = [];
	var angelAmountL=0,angelAmountR=0,
		deathKingAmountL=0,deathKingAmountR=0,
		illegalAmountL=0,illegalAmountR=0;

	dataAbilityList.splice(0,dataAbilityList.length);
	//mpdata check for the needed data and who has abilities
	for (var i = mapData.length - 1; i >= 0; i--) {

		if(mapData[i].ghostLevel == 1){
			if(mapData[i].unit == 1){
				farmerWho.push(mapData[i]);
			}else if(mapData[i].unit == -1){
				if(mapData[i].user == 1){
					deathKingAmountL += mapData[i].amount;
				}else if(mapData[i].user == 2){
					deathKingAmountR += mapData[i].amount;
				}
			}

		}

		if(mapData[i].ghostLevel == 2){
			if(mapData[i].unit == -1){
				if(mapData[i].user == 1){
					illegalAmountL += 1;
				}else if(mapData[i].user == 2){
					illegalAmountR += 1;
				}
			}

		}

		if(mapData[i].ghostName == 'Angel'){
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
	dataAbilityList.push(farmerWho);
	dataAbilityList.push(angelAmountL);
	dataAbilityList.push(angelAmountR);
	dataAbilityList.push(deathKingAmountL);
	dataAbilityList.push(deathKingAmountR);

	dataAbilityList.push(illegalAmountL);
	dataAbilityList.push(illegalAmountR);
	//ability push
	for (var i = ghosterAbilityToDoList.length - 1; i >= 0; i--) {
		 var j =ghosterAbilityToDoList[i];
		 	
			if(mapData[j].ability == 1){
				ghostLV1.push(new abilityAnimate(mapData[j].ability-1, mapData[j], 0, 0));
			}else if(mapData[j].ability == 2){
				ghostLV1.push(new abilityAnimate(mapData[j].ability-1, mapData[j], deathKingWho, 0));
			}else if(mapData[j].ability == 3){
				ghostLV1.push(new abilityAnimate(mapData[j].ability-1, mapData[j], 0, 0));
			}else if(mapData[j].ability == 4){
				if(mapData[j].user == 1){
					ghostLV4.push(new abilityAnimate(mapData[j].ability-1, mapData[j], farmerWho, angelAmountL));
				}else if(mapData[j].user == 2){
					ghostLV4.push(new abilityAnimate(mapData[j].ability-1, mapData[j], farmerWho, angelAmountR));
				}
			}

	}
	//clean the ghosterAbilityToDoList
	ghosterAbilityToDoList.splice(0,ghosterAbilityToDoList.length);
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
	this.aimg = abilityAnimations[from.unit][abilityType];
	this.pathFrame = 0;
	this.pathimg = pathAnimations[from.unit][abilityType];

	this.amountCount=0;
	this.hurt = 0;
	this.picSize = 96;
	this.time = 30;

	this.display = function(){
		if(this.f.unit == 1){
			if(this.abilityType+1 == 1){ //-----------------------------------------------------------------------<<<<<<<<<<<<  angel
				this.aFrame += (this.aimg.frame > this.aFrame) ? 1:0;
				copy(this.aimg.pic,
					(this.aFrame*192)%960,floor((this.aFrame*192)/960)*192,192,192,
					int(this.fx-(this.picSize+this.aFrame)/2),int(this.fy-(this.picSize+this.aFrame)/2),
					this.picSize+this.aFrame,this.picSize+this.aFrame);
				if(this.time == 1){
					this.hurt = (this.f.amount+floor(this.f.amount/2)<=99) ? -1*floor(this.f.amount/2) : this.f.amount-99;
					this.f.amount += (this.f.amount+floor(this.f.amount/2)<=99) ? floor(this.f.amount/2) : 99-this.f.amount;
				}

			}else if(this.abilityType+1 == 4){
				this.aFrame += (this.aimg.frame > this.aFrame) ? 1:0;
				copy(this.aimg.pic,
					(this.aFrame*192)%960,floor((this.aFrame*192)/960)*192,192,192,
					int(this.fx-(this.picSize+this.aFrame)/2),int(this.fy-(this.picSize+this.aFrame)/2),
					this.picSize+this.aFrame,this.picSize+this.aFrame);

				this.pathFrame += (this.pathimg.frame > this.pathFrame) ? 1:0;
				for(var i=0;i<dataAbilityList[0].length;i++){	
					if(this.time ==30){this.amountCount += dataAbilityList[0][i].amount;}
					this.tx = dataAbilityList[0][i].x;
					this.ty = dataAbilityList[0][i].y;
					this.pathx = lerp(this.fx,this.tx,this.time/30);
					this.pathy = lerp(this.fy,this.ty,this.time/30);

					copy(this.pathimg.pic,
						(this.pathFrame*192)%960,floor((this.pathFrame*192)/960)*192,192,192,
						int(this.pathx-(this.picSize)/2),int(this.pathy-(this.picSize)/2),
						this.picSize,this.picSize);
				}

				if(this.time == 1){
					if(this.amountCount == 0){
						this.hurt = this.f.amount; 
						this.f.amount = 0;
					}else{
						this.dII = (this.f.user == 1) ? dataAbilityList[1]:dataAbilityList[2];
						this.hurt = -1*(floor(this.amountCount/this.dII) - this.f.amount);
						this.f.amount += floor(this.amountCount/this.dII) - this.f.amount;
					}
				}
			}
		}else if(this.f.unit == -1){  //-----------------------------------------------------------------------<<<<<<<<<<<<  sad
			if(this.abilityType+1 == 1){
				this.aFrame += (this.aimg.frame > this.aFrame) ? 1:0;


				copy(this.aimg.pic,
					(this.aFrame*192)%960,floor((this.aFrame*192)/960)*192,192,192,
					int(this.fx-(this.picSize+this.aFrame)/2),int(this.fy-(this.picSize+this.aFrame)/2),
					this.picSize+this.aFrame,this.picSize+this.aFrame);
				if(this.time == 1){
					for(var i=0;i<4;i++){
						var knockX = round(this.f.row+cos(radians(i*90)));
						var knockY = round(this.f.column+sin(radians(i*90)));
						if(knockX < row && knockX >=0 && knockY < column && knockY >=0){
							if(mapData[knockX*column+knockY].user == 0){
								this.d = mapData[knockX*column+knockY];
								ghostMaker(this.f.user,this.f.unit,2,1,this.d.row,this.d.column);
								break;
							}
						}
					}
					this.hurt = (roundis-this.f.amount)*-1;
					this.f.amount = roundis;
				}

			}else if(this.abilityType+1 == 2){
				if(this.time == 30){
					this.d = (this.f.user == 1) ? dataAbilityList[3]:dataAbilityList[4];
					this.dII = (this.f.user == 1) ? dataAbilityList[5]:dataAbilityList[6];
					this.amountCount = 1+floor(this.d/this.dII);
				}
				this.aFrame += (this.aimg.frame > this.aFrame) ? 1:0;
				copy(this.aimg.pic,
					(this.aFrame*192)%960,floor((this.aFrame*192)/960)*192,192,192,
					int(this.fx-(this.picSize+this.aFrame)/2),int(this.fy-(this.picSize+this.aFrame)/2),
					this.picSize+this.aFrame,this.picSize+this.aFrame);
				if(this.time == 1){
					this.hurt = -1*(this.amountCount - this.f.amount);
					this.f.amount = this.amountCount;
				}

			}else if(this.abilityType+1 == 3){
				this.aFrame += (this.aimg.frame > this.aFrame) ? 1:0;

				copy(this.aimg.pic,
					(this.aFrame*192)%960,floor((this.aFrame*192)/960)*192,192,192,
					int(this.fx-(this.picSize+this.aFrame)/2),int(this.fy-(this.picSize+this.aFrame)/2),
					this.picSize+this.aFrame,this.picSize+this.aFrame);
				if(this.time == 1){
					for(var i=0;i<4;i++){
						var knockX = round(this.f.row+cos(radians(i*90)));
						var knockY = round(this.f.column+sin(radians(i*90)));
						if(knockX < row && knockX >=0 && knockY < column && knockY >=0){
							if(mapData[knockX*column+knockY].user == 0){
								this.d = mapData[knockX*column+knockY];
								ghostMaker(this.f.user,this.f.unit,2,1,this.d.row,this.d.column);
							}
						}
					}

					//ghostMaker(this.f.user,this.f.unit,2,1,this.d.row,this.d.column);
					this.hurt = 1;
					this.f.amount -= 1;
				}

			}else if(this.abilityType+1 == 4){
				//var changeWho = mapData.length-(this.f.row*column+this.f.column);
				var changeWho = ((row-1)-this.f.row)*column + ((column-1)-this.f.column);
				this.aFrame += (this.aimg.frame > this.aFrame) ? 1:0;
				copy(this.aimg.pic,
					(this.aFrame*192)%960,floor((this.aFrame*192)/960)*192,192,192,
					int(this.fx-(this.picSize+this.aFrame)/2),int(this.fy-(this.picSize+this.aFrame)/2),
					this.picSize+this.aFrame,this.picSize+this.aFrame);
				copy(this.aimg.pic,
					(this.aFrame*192)%960,floor((this.aFrame*192)/960)*192,192,192,
					int(mapData[changeWho].x-(this.picSize+this.aFrame)/2),int(mapData[changeWho].y-(this.picSize+this.aFrame)/2),
					this.picSize+this.aFrame,this.picSize+this.aFrame);
				if(this.time == 1){
					dataInherit(this.f,mapData[changeWho]);
				}
			}
		}
		this.time --;
	}
}


function tellMeAbility(data){
	var tellMe = {};
	if(data.unit == 1){
		if(data.ghostLevel == 1){
			tellMe = {
				abilityName : "[育兒]",
				detail : "該單位中每兩位的 農民(Farmer) 每回合會為該單位增加一位農民(上限99)",
				shit : "還有人沒來, 這不只是我的經歷"
			}
		}else if(data.ghostLevel == 2){
			tellMe = {
				abilityName : "[無]",
				detail : "none",
				shit : "我好像昨天的堅持, 也看過一個像你一樣向前的人, 也許我的過去都是夢裡剩下的記憶"
			}
		}else if(data.ghostLevel == 3){
			tellMe = {
				abilityName : "[無]",
				detail : "none",
				shit : "遙遠的跨距也有過像你一樣的呼應"
			}
		}else if(data.ghostLevel == 4){
			tellMe = {
				abilityName : "[信仰]",
				detail : "該單位的數量由場上 農民(Farmer) 數量的信仰轉化至本身",
				shit : "誰都能將我帶來, 誰又將我帶走"
			}
		}

	}else if(data.unit == -1){
		if(data.ghostLevel == 1){
			tellMe = {
				abilityName : "[巫妖]",
				detail : "該單位數量與回合數同時增加, 並召喚單位數量:1 的 伊利加爾(Illegal)",
				shit : "比起死亡, 我更靠近哀傷"
			}
		}else if(data.ghostLevel == 2){
			tellMe = {
				abilityName : "[遺失記憶的情緒]",
				detail : "該單位的數量由場上 死之者王(DeathKing) 數量的負能轉化至本身",
				shit : "在能感受到疼痛的地方, 一定會有出口"
			}
		}else if(data.ghostLevel == 3){
			tellMe = {
				abilityName : "[哀傷嘆息之門]",
				detail : "該單位每回合開啟一次召喚 單位:4 數量:1 的 伊利加爾(Illegal)",
				shit : "也許是那些無法傳達的情感，遺留在過去的空間裡"
			}
		}else if(data.ghostLevel == 4){
			tellMe = {
				abilityName : "[思念的人]",
				detail : "該單位每回合皆會甦醒於對角的位置",
				shit : "呼喚成功的小孩將被帶往 『那邊』"
			}
		}
	}
	stroke(0);
	strokeWeight(1);
	fill(255,200);
	rectMode(CENTER);
	var abilityTextSize = 13; 
	var abilityTextLeading = 5; 
	var rectX = (textWidth(tellMe.detail) > textWidth(tellMe.shit)) ? textWidth(tellMe.detail)+20:textWidth(tellMe.shit)+20;
	rect(width/2,750+((abilityTextLeading+abilityTextSize)*4/2),rectX,(abilityTextLeading+abilityTextSize)*4);
	noStroke();
	fill(0);
	textAlign(CENTER);
	textStyle(NORMAL);
	textSize(abilityTextSize);
	text("Ability",width/2,750+abilityTextSize);
	text(tellMe.abilityName,width/2,750+abilityTextSize+(abilityTextSize+abilityTextLeading)*1);
	text(tellMe.detail,width/2,750+abilityTextSize+(abilityTextSize+abilityTextLeading)*2);
	textStyle(ITALIC);
	textSize(abilityTextSize-2);
	text('- '+tellMe.shit+' -',width/2,750+abilityTextSize+(abilityTextSize+abilityTextLeading)*3);

}
//ability systems -----------------------------------------------------------------

//------------------------------------------------------------------
