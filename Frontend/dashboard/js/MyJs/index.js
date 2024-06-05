$(document).ready(function(){
    queryDataGet("http://localhost:1594/api/v1/nations","",function(res){
        console.log(res);
    })
});