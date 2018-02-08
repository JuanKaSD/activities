var interval = null;
var platformInterval = null;
var minY = 0;
var stage = [];
var lengthStage = 0;
$(document).ready(function(){
    chargeStage(5);
    set();
    moveBall("up",1, true); 
    $("#set").fadeTo("superfast" , 0.5);
    play("start.wav");
});
$(document).on("keydown", function( event ) {
    if(event.which == 32){
        clearInterval(interval);
        platformInterval = null;
        chargeStage(5);
        set();
        moveBall("up",1, false); 
        $("#set").css({"opacity":"1"});
        $(".insert").show().hide("slow");  
        play("start.wav");
    }
    var direction = "";
    if(event.which  == 37){
        direction = "left";
    }
    if(event.which  == 39){
        direction = "right";
    }
    if(platformInterval == null){
        platformInterval = setInterval(function() {
            moveStick(direction);
        }, 30);
    }
});
$(document).on("keyup", function( event ) {
    if(event.which  == 37 || event.which  == 39){
        clearInterval(platformInterval);
        platformInterval = null;
    }
});
function chargeStage(which){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            stage = [];
            lengthStage = 0;
            var array1 = this.responseText.split("#");
            for (let i = 0; i < array1.length; i++) {
                stage[i] = array1[i].split("/");
                for (let j = 0; j < array1[i].split("/").length; j++) {
                    lengthStage++;      
                }
            }
        }
    };
    xhr.open("POST","selectStage.php",false); //ruta POST definida en web.php
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var parametros = "which="+which;
    xhr.send(parametros);
}
function autoMoveStick(){
    var ballPosition = $("#ball").position().left+($("#ball").width()/2);
    $("#stick").css({"left":ballPosition-+($("#stick").width()/2)});  
}
function moveStick(where){
    var stickPositionLeft = $("#stick").position().left;
    var stickPositionRight = $("#stick").position().left + $("#stick").width();
    switch (where) {
        case "left":
            if(stickPositionLeft > 0){
                $("#stick").css({"left":"-=30"});  
            }else{
                clearInterval(platformInterval);
            }
            break;
        case "right":
            if(stickPositionRight <= screen.width){
                $("#stick").css({"left":"+=30"});  
            }else{
                clearInterval(platformInterval);
            }
            break;
    }
}
function check(ball, where, speed){
    var ballPositionTop = ball.position().top;
    var ballPositionLeft = ball.position().left;
    var ballPositionRight = ball.position().left + ball.width();
    var ballPositionBottom = ball.position().top + ball.height();
    var stickPositionTop = $("#stick").position().top;
    var stickPositionLeft = $("#stick").position().left;
    var stickPositionRight = $("#stick").position().left + $("#stick").width();
    for (let i = 0; i < lengthStage; i++) {
        var element = $("#"+i);
        var elementTop = element.position().top;
        var elementBot = element.position().top + element.height();
        var elementLeft = element.position().left;
        var elementRight = element.position().left + element.width();
        if(ballPositionTop <= elementBot && ballPositionLeft >= elementLeft && ballPositionRight <= elementRight){
            breakBrick(element);
            console.log("up");
            if(where == "upright"){
                return "downright/"+speed;
            }else if(where == "upleft"){
                return "downleft/"+speed;
            }if(where == "up"){
                return "down/"+speed;
            }
        }else if(ballPositionBottom >= elementTop && ballPositionLeft >= elementLeft && ballPositionRight <= elementRight && ballPositionTop <= elementTop) {
            breakBrick(element);
            console.log("down");
            if(where == "downright"){
                return "upright/"+speed;
            }else if(where == "downleft"){
                return "upleft/"+speed;
            }
        }else if(ballPositionLeft == elementRight && ballPositionTop >= elementTop && ballPositionBottom <= elementBot){
            breakBrick(element);
            console.log("left");
            if(where == "downleft"){
                return "downright/"+speed;
            }else if(where == "upleft"){
                return "upright/"+speed;
            }
        }else if(ballPositionRight >= elementLeft && ballPositionTop >= elementTop && ballPositionBottom <= elementBot && elementRight > ballPositionRight){
            breakBrick(element);
            console.log("right");
            if(where == "downright"){
                return "downleft/"+speed;
            }else if(where == "upright"){
            }
        }
    }
    if(ballPositionLeft <= 0){
        if(where == "upleft"){
            return "upright/"+speed;
        }
        if(where == "downleft"){
            return "downright/"+speed;
        }
    }
    if(ballPositionRight > window.innerWidth){
        if(where == "upright"){
            return "upleft/"+speed;
        }
        if(where == "downright"){
            return "downleft/"+speed;
        }
    }
    if(ballPositionTop <= 0){
        if(where == "upleft"){
            return "downleft/"+speed;
        }else{
            return "downright/"+speed;
        }
    }
    if(ballPositionBottom >= stickPositionTop && ballPositionRight >= stickPositionLeft && ballPositionLeft <= stickPositionRight){
        play("hit.wav");
        if($("#ball").position().left + ($("#ball").width()/2) < stickPositionLeft + ($("#stick").width()/2)){
            if($("#ball").position().left + ($("#ball").width()/2) < stickPositionLeft + ($("#stick").width()/4)){
                return "upleft/6";
            }else{
                return "upleft/4";
            }
        }else{
            if($("#ball").position().left + ($("#ball").width()/2) > stickPositionLeft + (3/4*($("#stick").width()))){
                return "upright/6";
            }else{
                return "upright/4";
            }
        }
    }
    if(ballPositionBottom >= window.innerHeight){
        return "finish";
    }
    return where+"/"+speed;
}
function moveBall(where, speed, auto){
    
    interval = setInterval(function(){
        switch (where) {
            case "up":
                $("#ball").css({"top":"-="+speed});  
                break;
            case "left":
                $("#ball").css({"left":"-="+speed});    
                break;
            case "down":
                $("#ball").css({"top":"+="+speed});  
                break;
            case "right":
                $("#ball").css({"left":"+="+speed});    
                break;
            case "upleft":
                $("#ball").css({"top":"-="+speed});  
                $("#ball").css({"left":"-="+speed});    
                break;
            case "upright":
                $("#ball").css({"top":"-="+speed});  
                $("#ball").css({"left":"+="+speed});    
                break;
            case "downleft":
                $("#ball").css({"top":"+="+speed});  
                $("#ball").css({"left":"-="+speed});    
                break;
            case "downright":
                $("#ball").css({"top":"+="+speed});  
                $("#ball").css({"left":"+="+speed});    
                break;
            case "finish":
                finish();
                break;
        }
        var dummy = check($("#ball"), where, speed).split("/");
        where = dummy[0];
        speed = dummy[1];
        if(auto){
            autoMoveStick();
        }
    }, 20);
}
function finish(){
    window.location="index.html";
}
function set(){
    $("#set").html("");
    var set = [];
    var contador = 0;
    $("#set").append("<table>");
    for (let i = 0; i < stage.length; i++) {
        $("#set table").append("<tr>");
        for (let j = 0; j < stage[i].length; j++, contador++) {
            if(stage[i][j] == 1){
                $("#set table").append("<td><div id='"+contador+"' class='OneLifes' style='color:white'>1</div>");
            }
            if(stage[i][j] == 2){
                $("#set table").append("<td><div id='"+contador+"' class='TwoLifes' style='color:white'>2</div>");
            }
            if(stage[i][j] == 3){
                $("#set table").append("<td><div id='"+contador+"' class='ThreeLifes' style='color:white'>3</div>");
            }
        }
    }   
    $("#set").append("<div class='ball' id='ball'></div>");
    $("#set").append("<div class='stick' id='stick'><img src='stick.png'></div>");
    $("body").append("<div class='insert'></div>");
    $("body").hide().fadeIn();
}
function play(path){
    var snd = new Audio(path);
    snd.play();
}
function breakBrick(element){
    if(element.html() == "3"){
        element.html("2");
        element.css({"background-image":"url('brick2Lv.png')"});
        play("hitbrik.wav");
    }else if(element.html() == "2"){
        element.html("1");
        element.css({"background-image":"url('brick1Lv.png')"});
        play("hitbrik.wav");
    }else if(element.html() == "1"){
        play("destroyed.wav");
        element.show().hide("slow");    
        element.css({"display":"none"});
        element.css({"top":"-1000"});
    }
}
/*
    if(
            up
            ballPositionTop <= elementBot && ballPositionRight >= elementLeft && ballPositionLeft <= elementRight && ballPositionTop >= elementBot
                ||
                left
            ballPositionRight >= elementLeft && ballPositionBottom >= elementTop && ballPositionTop <= elementBot && ballPositionRight <= elementRight
                ||
                down
            ballPositionBottom >= elementTop && ballPositionRight >= elementLeft && ballPositionLeft <= elementRight && ballPositionBottom <= elementBot
                ||
                right
            ballPositionLeft <= elementRight && ballPositionBottom >= elementTop && ballPositionTop <= elementBot && ballPositionLeft >= elementLeft
        ){
            breakBrick(element);
            
            if(where == "upright"){
                return "downright/"+speed;
            }else if(where == "upleft"){
                return "downleft/"+speed;
            }
            
        }
        if(ballPositionTop <= elementBot && ballPositionRight <= elementRight && ballPositionLeft >= elementLeft && ballPositionTop >= elementTop){
            breakBrick(element);
            clearInterval(interval);
            alert("up");
            if(where == "upright"){
                return "downright/"+speed;
            }else if(where == "upleft"){
                return "downleft/"+speed;
            }
        }else if(ballPositionRight >= elementLeft && ballPositionBottom <= elementBot && ballPositionTop >= elementTop && ballPositionLeft < elementRight){
            breakBrick(element);
            clearInterval(interval);
            alert("right");
            if(where == "upright"){
                return "upleft/"+speed;
            }else if(where == "downright"){
                return "downleft/"+speed;
            }
        }else if(ballPositionBottom >= elementTop && ballPositionRight <= elementRight && ballPositionLeft >= elementLeft && ballPositionTop <= elementBot){
            breakBrick(element);
            clearInterval(interval);
            alert("down");
            if(where == "downright"){
                return "upright/"+speed;
            }else if(where == "downleft"){
                return "upleft/"+speed;
            }
        }else if(ballPositionLeft <= elementRight && ballPositionBottom <= elementBot && ballPositionTop >= elementTop && ballPositionLeft >= elementLeft){
            //left
            breakBrick(element);
            clearInterval(interval);
            alert("left");
            if(where == "upleft"){
                return "upright/"+speed;
            }else if(where == "downleft"){
                return "downright/"+speed;
            }
        }
*/ 