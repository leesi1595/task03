var chess = document.getElementById('chess'),
	context = chess.getContext('2d'),
	result = document.getElementsByClassName('result'),
	flag = true,
	over = false,
	chessBoard = [];	//棋盘数组
var wins = [],	//赢法数组
	count = 0,	//赢法种类
	myWin = [],	//玩家赢法统计数组
	aiWin = [];	//电脑赢法统计数组

for(var i = 0; i < 15; i++) {	//棋盘数组初始化
	chessBoard[i] = [];
	for(var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}
for(var i = 0; i < 15; i++) {	//赢法数组初始化
	wins[i] = [];
	for(var j=0; j<15; j++) {
		wins[i][j] = [];
	}
}

for(var i = 0; i < 15; i++) {	//竖线赢法
	for(var j = 0; j < 11; j++){
		for(var k=0; k<5;k++) {
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
for(var i = 0; i < 15; i++) {	//横线赢法
	for(var j = 0; j < 11; j++){
		for(var k = 0; k < 5;k++) {
			wins[j+k][i][count] = true;
		}
		count++;
	}
}
for(var i = 0; i < 11; i++) {	//斜线赢法
	for(var j = 0; j < 11; j++){
		for(var k = 0; k < 5;k++) {
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
for(var i = 0; i < 11; i++) {	//反斜线赢法
	for(var j = 14; j > 3; j--){
		for(var k = 0; k < 5; k++) {
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}
for(var i = 0; i < count; i++) {
	myWin[i] = 0;
	aiWin[i] = 0;
}

context.strokeStyle = "#bfbfbf";


window.onload = function() {
	drawChessBoard();
}

var drawChessBoard = function() {	//绘制棋盘
	for(var i = 0; i < 15; i++) {
	context.moveTo(15 + i * 30, 15);
	context.lineTo(15 + i * 30, 435);
	context.stroke();
	context.moveTo(15, 15 + i * 30);
	context.lineTo(435, 15 + i * 30);
	context.stroke();
	}
}
var oneStep = function(i, j, flag) {	//绘制棋子
	context.beginPath();
	context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	context.closePath();
	var grd=context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
	if(flag) {
		grd.addColorStop(0,"#0a0a0a");
		grd.addColorStop(1,"#636766");
	} else {
		grd.addColorStop(0,"#d1d1d1");
		grd.addColorStop(1,"#f9f9f9");
	}
	context.fillStyle = grd;
	context.fill();
}

chess.onclick = function(e) {	//落子
	if(over || !flag) {
		return;
	}
	var x = e.offsetX,
		y = e.offsetY,
		i = Math.floor(x / 30);
		j = Math.floor(y / 30);
	if(chessBoard[i][j] == 0) {
		oneStep(i, j, flag);
			chessBoard[i][j] = 1;
		for(var k = 0; k < count; k++) {
			if(wins[i][j][k]) {
				myWin[k]++;
				aiWin[k] = 6;
				if(myWin[k] == 5) {
					window.alert('你赢了！');
					//result.innerHTML = '你赢了！';
					over = true;
				}
			}
		}
		if(!over) {
			flag = !flag;
			computerAI();
		}
	}
}

var computerAI = function() {
	var myScore = [],
		aiScore = [],
		max = 0,
		u = 0,
		v = 0;
	for(var i = 0; i < 15; i++) {
		myScore[i] = [];
		aiScore[i] = [];
		for(var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			aiScore[i][j] = 0;
		}
	}
	for(var i = 0; i < 15; i++) {	//得分判断
		for(var j = 0; j < 15; j++) {
			if(chessBoard[i][j] == 0) {
				for(var k = 0; k < count; k++) {
					if(wins[i][j][k]) {
						if(myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if(myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if(myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if(myWin[k] == 4) {
							myScore[i][j] += 10000;
						}
						if(aiWin[k] == 1) {
							aiScore[i][j] += 220;
						} else if(aiWin[k] == 2) {
							aiScore[i][j] += 440;
						} else if(aiWin[k] == 3) {
							aiScore[i][j] += 2400;
						} else if(aiWin[k] == 4) {
							aiScore[i][j] += 20000;
						}
					}
				}
				if(myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if(myScore[i][j] = max) {
					if(aiScore[i][j] > aiScore[u][v]) {
						u = i;
						v = j;
					}
				}
				if(aiScore[i][j] > max) {
					max = aiScore[i][j];
					u = i;
					v = j;
				} else if(aiScore[i][j] = max) {
					if(myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u,v,false);
	chessBoard[u][v] = 2;
	for(var k = 0; k < count; k++) {
			if(wins[u][v][k]) {
				aiWin[k]++;
				myWin[k] = 6;
				if(aiWin[k] == 5) {
					window.alert('你输了！');
					//result.innerText = '你输了！';
					over = true;
				}
			}
		}
		if(!over) {
			flag = !flag;
		}
}
