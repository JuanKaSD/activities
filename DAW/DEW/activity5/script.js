var music = ["music1.wav", "music2.wav", "music3.wavº"];
var currentPos = 0;
$(document).ready(function (){
    methods.draw(0);
    $("#play").on("click", function (){
        methods.play(music[currentPos]);
    });
    $("#backward").on("click", function (){
        methods.before();        
        methods.draw(currentPos);
    });
    $("#fordward").on("click", function (){
        methods.next();
        methods.draw(currentPos);
    });    
    /*snd.on("ended", function() {
        next();
        play(music[currentPos]);
    });*/
});
var methods = {
    play: function(path){
        path = "resources/"+path;
        document.getElementById("player").play();
        //$("#player").play();
    },
    draw: function(pos){
        $("#current").html("Posición actual: "+(pos+1));
    },
    next: function(){
        if(currentPos < music.length -1)
            currentPos++;
        else
            currentPos = 0;
    },
    before: function(){
        if(currentPos <= 0)
            currentPos = music.length -1;
        else
            currentPos--;
    }
}