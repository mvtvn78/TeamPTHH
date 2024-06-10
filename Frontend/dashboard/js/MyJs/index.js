$(document).ready(function(){
    queryDataGet("http://localhost:6969/api/v1/nations","",function(res){
        console.log(res);
    })
});