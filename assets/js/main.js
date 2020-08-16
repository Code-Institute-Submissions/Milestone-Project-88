$(".showcard").mouseover(function(){
  $(this).css({"background-color": "rgba(26,166,183,0.25)"});
});

$(".showcard").mouseleave(function(){
  $(this).css({"background-color": "#EBECF0"});
});

//Code Adapted from https://www.youtube.com/watch?v=uI18xGocVnw
$(".readmore-btn").on('click', function (){
    $(this).parent().toggleClass("showContent");
    //Shorthand if Statement
    var replaceText = $(this).parent().hasClass("showContent") ? "Read Less ▲" : "Read More ▼"
    $(this).text(replaceText);

})