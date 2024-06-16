// phần chạy chính
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
    show()
});

// Chuyển đổi dữ liệu để hiển thị 
function ConvertDate(date,mode = true)
{
    // mode 1 : dd/mm/yyyy , mode 2 : yyyy/mm/dd
    const datearray = date.split("/");
    // 
    for(let indx in datearray)
        if(datearray[indx]<10)
            datearray[indx] = "0"+datearray[indx]
    if(mode)
        return datearray[1] + '-' + datearray[0] + '-' + datearray[2];
    return datearray[2] + '-' + datearray[0] + '-' + datearray[1];
}
// Chuyển đổi dữ liệu để hiển thị theo thời gian và ngày
function DisplayDateTime(datetime)
{
    const datetimearray = datetime.split(",");
    const date= datetimearray[0]
    const time = datetimearray[1]
    const newdate = ConvertDate(date) + time
    return newdate
}


// lấy danh sách bài hát đã nghe
function show()
{
    queryDataGet("http://localhost:1594/api/v1/listened_list","",function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".nghenhac_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                const thoigian = new Date(obj.ThoiGian);
                        htmls=htmls+'<tr>'+
                                '<td class="song_details hover_td" data-ma = "'+obj.MABH+'">'+obj.MABH+'</td>'+
                                '<td class="users_details hover_td" data-ma = "'+obj.MAND+'">'+obj.MAND+'</td>'+
                                '<td>'+DisplayDateTime(thoigian.toLocaleString())+'</td>'+
                                
                              '</tr>';
              }
            // chèn vào
            $(".nghenhac_tb").html(htmls);
        }
    })  
}
// Nhấn nút xóa thanh tìm kiếm
$(".rm_txtsearch").click(function(e){
    $(".txtsearch").val('')
    show()
})
// Khi tìm kiếm nhấn nút enter tìm kiếm dữ liệu
$(".txtsearch").keyup(function(e){
    if(e.keyCode == 13)
    {
        showSearch()
    }
});
// Tìm kiếm tên người dùng
function showSearch ()
{
    const keyseacrh = $(".txtsearch").val()
    console.log(keyseacrh);
   
    
    queryDataGet(`http://localhost:1594/api/v1/listened_list_search?maBH=${keyseacrh}&maND=${keyseacrh}`,"",function(res){
        console.log(res);
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".nghenhac_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const index in data){
                const obj=data[index];
                const thoigian = new Date(obj.ThoiGian);
                        htmls=htmls+'<tr>'+
                                '<td class="song_details hover_td" data-ma = "'+obj.MABH+'">'+obj.MABH+'</td>'+
                                '<td class="users_details hover_td" data-ma = "'+obj.MAND+'">'+obj.MAND+'</td>'+
                                '<td>'+DisplayDateTime(thoigian.toLocaleString())+'</td>'+
                              '</tr>';
              }
            // chèn vào
            $(".nghenhac_tb").html(htmls);
        }
    })  
} 


//Show modal baihat
$(".nghenhac_tb").on('click','.song_details',function(){
    var s=$(this).attr("data-ma");
   //console.log("KAIOKEn",s);
    $('.showBh').modal('show');
    queryDataGet("http://localhost:1594/api/v1/songs",{'id':s},function(res){
        const info=res.data[0];
        let gt = (info.TinhTrang ===1 ? 'Public':'Private')
        $(".addma").html(info.MABH)
        $(".addht").html(info.TenBH)
        $(".addgt").html(gt)
        $(".addQt").html(info.LuotXem)
    })
})
//Show modal nguoidung
$(".nghenhac_tb").on('click','.users_details',function(){
    var s=$(this).attr("data-ma");
   //console.log("KAIOKEn",s);
    $('.showND').modal('show');
    queryDataGet("http://localhost:1594/api/v1/user_search",{'maND':s,'tenND':s},function(res){
        const info=res.data[0];
        let gt = (info.GioiTinh ===1 ? 'Nam':'Nữ')
        $(".addma").html(info.MAND)
        $(".addht").html(info.HoTen)
        $(".addgt").html(gt)
        $(".addngaysinh").html(new Date(info.NgaySinh).toLocaleDateString())
        $(".addQt").html(info.MaQT)
    })
})