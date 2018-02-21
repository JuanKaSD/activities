var music = ["music1.mp3", "music2.mp3", "music3.mp3"];
var currentPos = 0;
$(document).ready(function (){
    methods.draw(0);
    $("#player").attr("src","resources/"+music[currentPos]);
    $("#play").on("click", function (){
        methods.play(music[currentPos]);
    });
    $("#backward").on("click", function (){
        methods.before();        
        methods.play(music[currentPos]);
        
    });
    $("#fordward").on("click", function (){
        methods.next();
        methods.play(music[currentPos]);
    });    
    
    $("#player").on("ended", function() {
        methods.next();
        methods.play(music[currentPos]);
    });
});
var methods = {
    play: function(path){
        path = "resources/"+path;
        document.getElementById("player").play();
    },
    draw: function(pos){
        $("#current").html("Actual song: "+(pos+1));
    },
    next: function(){
        if(currentPos < music.length -1)
            currentPos++;
        else
            currentPos = 0;
        methods.change(currentPos);
        methods.draw(currentPos);
    },
    before: function(){
        if(currentPos <= 0)
            currentPos = music.length -1;
        else
            currentPos--;
        methods.change(currentPos);
        methods.draw(currentPos);
    },
    change: function(currentPos){
        $("#player").attr("src","resources/"+music[currentPos]);
    }
}