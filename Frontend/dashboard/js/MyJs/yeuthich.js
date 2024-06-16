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
    // mode : 0 , chế độ ban đầu , 1 : chế dộ thêm , 2 : chế độ sửa
    let mode = 0;
    //trạng thái ban đầu
    $(".btnsave").prop("disabled",true)
    //làm mờ form
    $(".maND").prop("disabled",true)
    $(".maBH").prop("disabled",true)
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

// lấy dữ liệu combobox 

// lấy danh sách người dùng
function show()
{
    queryDataGet("http://localhost:1594/api/v1/favorites_list","",function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".yeuthich_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                const ngayyeuthich = new Date(obj.ThoiGian);
                const hienthingayyeuthich = DisplayDateTime(ngayyeuthich.toLocaleString())
                        htmls=htmls+'<tr>'+
                                '<td class="users_details hover_td" data-ma = "'+obj.MAND+'">'+obj.MAND+'</td>'+
                                '<td class="song_details hover_td" data-ma = "'+obj.MABH+'">'+obj.MABH+'</td>'+
                                '<td>'+hienthingayyeuthich+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-maND ="'+obj.MAND+'" data-maBH ="'+obj.MABH+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span data-maND ="'+
                                obj.MAND+
                                '" data-maBH ="'+obj.MABH+ 
                                '" data-date ="'+ConvertDate(ngayyeuthich.toLocaleDateString(),false)+ 
                                '"> '+
                              '</tr>';
              }
            // chèn vào
            $(".yeuthich_tb").html(htmls);
        }
    })  
}
// Tìm kiếm tên người dùng
function showSearch ()
{
    const keyseacrh = $(".txtsearch").val()
    const datasend ={
        maND : keyseacrh
    }
    console.log(keyseacrh);
    queryDataGet("http://localhost:1594/api/v1/favorites_search",datasend,function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".yeuthich_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                const ngayyeuthich = new Date(obj.ThoiGian);
                const hienthingayyeuthich = ConvertDate(ngayyeuthich.toLocaleDateString())
                        htmls=htmls+'<tr>'+
                                '<td class="users_details hover_td" data-ma = "'+obj.MAND+'">'+obj.MAND+'</td>'+
                                '<td class="song_details hover_td" data-ma = "'+obj.MABH+'">'+obj.MABH+'</td>'+
                                '<td>'+hienthingayyeuthich+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-maND ="'+obj.MAND+'" data-maBH ="'+obj.MABH+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span data-maND ="'+
                                obj.MAND+
                                '" data-maBH ="'+obj.MABH+ 
                                '" data-date ="'+ConvertDate(ngayyeuthich.toLocaleDateString(),false)+ 
                                '"> '+
                              '</tr>';
              }
            // chèn vào
            $(".yeuthich_tb").html(htmls);
        }
    })  
}
// Nhấn nút xóa
$(".yeuthich_tb").on('click','.nut_xoa',function()
{
  console.log("da click nut xoa")
  const maND = $(this).attr("data-maND")
  const maBH = $(this).attr("data-maBH")
  console.log(maND)
  bootbox.confirm('Bạn có chắc xóa ' +maND+ ' và ' +maBH+ ' mã  này ?',function(result)
  {
    if (result==true)
    {
        queryDataDelete("http://localhost:1594/api/v1/favorites_list_remove",{maND:maND,maBH:maBH},function(res)
        {
            if(res.ErrorCode ==0)
                bootbox.alert("Xóa thành công " + maND + " và " + maBH)
            else 
                bootbox.alert("Xóa không thành công")
              // render 
              show()
        })

    }
  } )
  // luôn cho mode :0
  mode = 0
})
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
// Khi nhấn thêm
$(".btnadd").click(function()
{
    //thay đổi mode sang add
    mode =1
    // mờ add , sáng save
    $(".btnadd").prop("disabled",true)
    $(".btnsave").prop("disabled",false)
    // thực hiện công việc
    //làm mờ form
    $(".maND").prop("disabled",false)
    $(".maBH").prop("disabled",false)
    $(".ngayyeuthich").prop("disabled",false)
    //Xóa dữ liệu cũ
    $(".maND").val('')
    $(".maBH").val('')
    $(".ngayyeuthich").val('')
})
// Khi nhấn lưu
$(".btnsave").click(function()
{
    // mờ save , sáng add
    $(".btnadd").prop("disabled",false)
    $(".btnsave").prop("disabled",true)
    //Khi lưu xong
    $(".maND").prop("disabled",true)
    $(".maBH").prop("disabled",true)
    $(".ngayyeuthich").prop("disabled",true)
    // thực hiện gọi API đăng ký
    if(mode ==1)
    {
        // gọi API đăng ký
        const datasend = {
            maND : $(".maND").val(),
            maBH : $(".maBH").val(),
            ngayyeuthich : $(".ngayyeuthich").val(),
        }
        console.log(datasend);
        queryDataPost("http://localhost:1594/api/v1/favorites_list_add",datasend,function(res)
        {
            if(res.ErrorCode ==0)
            {
                bootbox.alert("Lưu thành công");
            }
            else {
                bootbox.alert("Lưu thất bại");
            }
              // render 
            show()
        })
    }
  
})
//Show modal baihat
$(".yeuthich_tb").on('click','.song_details',function(){
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
$(".yeuthich_tb").on('click','.users_details',function(){
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