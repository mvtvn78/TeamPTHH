// phần chạy chính
$(document).ready(function(){
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
    queryDataGet("http://localhost:8001/api/v1/listened_list","",function(res){
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
                                '<td>'+obj.MABH+'</td>'+
                                '<td>'+obj.MAND+'</td>'+
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
   
    
    queryDataGet(`http://localhost:8001/api/v1/listened_list_search?maBH=${keyseacrh}&maND=${keyseacrh}`,"",function(res){
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
                                '<td>'+obj.MABH+'</td>'+
                                '<td>'+obj.MAND+'</td>'+
                                '<td>'+DisplayDateTime(thoigian.toLocaleString())+'</td>'+
                              '</tr>';
              }
            // chèn vào
            $(".nghenhac_tb").html(htmls);
        }
    })  
} 


