$(document).ready(function(){
    queryDataGet("http://localhost:8001/api/v1/nations","",function(res){
        console.log(res);
    })
});