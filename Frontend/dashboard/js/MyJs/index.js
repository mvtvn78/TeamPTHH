$(document).ready(function(){
    // kiem tra cookie
    let token = getCookie("token");
    if(!token)
        token = 'NSTemp'
    queryDataGet(`http://localhost:1594/api/v1/users?token=${token}`,{},function(res)
        {
          if(res.ErrorCode !==0 || res.data[0].MaLoai != 'LOAI1')
                window.location = "/TeamPTHH/Frontend/dashboard/login.html"
          else
            {
                $(".profile_img").attr("src", domain + res.data[0].Anh);
                $(".profile_name").text(res.data[0].HoTen)
            }
        } )
    //
    queryDataGet(`http://localhost:1594/api/v1/users_total`,{},function(res){
        const total_user = res.data[0]?.Total
        $(".total_user").text(total_user)
        queryDataGet(`http://localhost:1594/api/v1/artists_total`,{},function(res){
            const total_artist = res.data[0]?.Total
            $(".total_artist").text(total_artist)
            queryDataGet(`http://localhost:1594/api/v1/songs_total`,{},function(res){
                const total_song = res.data[0]?.Total
                $(".total_song").text(total_song)
                queryDataGet(`http://localhost:1594/api/v1/songs_total_view`,{},function(res){
                    const total_view = res.data[0]?.Total
                    $(".total_view").text(total_view)
                })
            })
        })
    })
    // 
    queryDataGet(`http://localhost:1594/api/v1/nations_statis_artist`,{},function(res){
        let data = res.data
        //console.log(data);
        let htmls = ''
        let stt =1 
        for(const item in data){
            const obj=data[item];
                    htmls=htmls+'<tr>'+
                            '<td>'+(stt++)+'</td>'+
                            '<td>'+obj.MaQT+'</td>'+
                            '<td>'+obj.TenQT+'</td>'+
                            '<td>'+obj.Total+'</td>'+
                          '</tr>';
          }
           // chèn vào
          
           $(".artist_statist").html(htmls); 
    })
    queryDataGet(`http://localhost:1594/api/v1/nations_statis_user`,{},function(res){
        let data = res.data
        //console.log("user",data);
        let htmls = ''
        let stt =1 
        for(const item in data){
            const obj=data[item];
                    htmls=htmls+'<tr>'+
                            '<td>'+(stt++)+'</td>'+
                            '<td>'+obj.MaQT+'</td>'+
                            '<td>'+obj.TenQT+'</td>'+
                            '<td>'+obj.Total+'</td>'+
                          '</tr>';
          }
        $(".user_statist").html(htmls); 
    })
    // 
    queryDataGet(`http://localhost:1594/api/v1/songs_statis_top5`,{},function(res){
        //console.log("TOP5",res);
        let data = res.data
        let htmls = ''
        let stt =1 
        for(const item in data){
            const obj=data[item];
                    htmls=htmls+'<tr>'+
                            '<td>'+(stt++)+'</td>'+
                            '<td>'+obj.MABH+'</td>'+
                            '<td>'+obj.TenBH+'</td>'+
                            '<td>'+obj.LuotXem+'</td>'+
                          '</tr>';
          }
        $(".top5_song").html(htmls); 
    })
});
$(".logout").click(function(){
    deleteCookie('token', '/TeamPTHH/Frontend/dashboard', 'localhost');
    window.location = "/TeamPTHH/Frontend/dashboard/login.html"
});