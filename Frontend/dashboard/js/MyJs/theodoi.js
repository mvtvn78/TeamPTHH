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
    $(".maNS").prop("disabled",true)

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
    queryDataGet("http://localhost:1594/api/v1/followers","",function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".theodoi_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                const ngaytheodoi = new Date(obj.ThoiGian);
                const hienthingaytheodoi = DisplayDateTime(ngaytheodoi.toLocaleString())
                        htmls=htmls+'<tr>'+
                                '<td class="users_details hover_td" data-ma = "'+obj.MAND+'">'+obj.MAND+'</td>'+
                                '<td class="nghesi_details hover_td" data-ma = "'+obj.MANS+'">'+obj.MANS+'</td>'+
                                '<td>'+hienthingaytheodoi+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-maND ="'+obj.MAND+'" data-maNS ="'+obj.MANS+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span data-maND ="'+
                                obj.MAND+
                                '" data-maNS ="'+obj.MANS+ 
                                '" data-date ="'+ConvertDate(ngaytheodoi.toLocaleDateString(),false)+ 
                                '"> '+
                              '</tr>';
              }
            // chèn vào
            $(".theodoi_tb").html(htmls);
        }
    })  
}
// Tìm kiếm tên người dùng
function showSearch ()
{
    const keyseacrh = $(".txtsearch").val()
  
    console.log(keyseacrh);
        queryDataGet(`http://localhost:1594/api/v1/followers_search?maND=${keyseacrh}&maNS=${keyseacrh}`,'',function(res){
            // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".theodoi_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                const ngaytheodoi = new Date(obj.ThoiGian);
                const hienthingaytheodoi = DisplayDateTime(ngaytheodoi.toLocaleString())
                        htmls=htmls+'<tr>'+
                                '<td class="users_details hover_td" data-ma = "'+obj.MAND+'">'+obj.MAND+'</td>'+
                                '<td class="nghesi_details hover_td" data-ma = "'+obj.MANS+'">'+obj.MANS+'</td>'+
                                '<td>'+hienthingaytheodoi+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-maND ="'+obj.MAND+'" data-maNS ="'+obj.MANS+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span data-maND ="'+
                                obj.MAND+
                                '" data-maNS ="'+obj.MANS+ 
                                '" data-date ="'+ConvertDate(ngaytheodoi.toLocaleDateString(),false)+ 
                                '"> '+
                              '</tr>';
              }
            // chèn vào
            $(".theodoi_tb").html(htmls);
        }
    })  
}
//Nhấn nút sửa
$(".theodoi_tb").on('click','.nut_sua',function()
{
    // thay đổi mode 
    mode = 2;
    //sáng trừ mã người dùng
    $(".maND").prop("disabled",true)
    $(".maNS").prop("disabled",true)
    $(".ngayTheoDoi").prop("disabled",true)
    // mờ add , sáng save
    $(".btnadd").prop("disabled",true)
    $(".btnsave").prop("disabled",false)
    // lấy giá trị từ bản thân nó
    let MAND = $(this).attr("data-maND")
    let MANS = $(this).attr("data-maNS")
    let NTD = $(this).attr("data-date")
    // đưa thông tin lên form
    $(".maND").val(MAND)
    $(".maNS").val(MANS)
    $(".ngayTheoDoi").val(NTD)    
})
// Nhấn nút xóa
$(".theodoi_tb").on('click','.nut_xoa',function()
{
  console.log("da click nut xoa")
  const maND = $(this).attr("data-maND")
  const maNS = $(this).attr("data-maNS")
  console.log(maND)
  bootbox.confirm('Bạn có chắc xóa ' +maND+ ' và ' +maNS+ ' mã  này ?',function(result)
  {
    if (result==true)
    {
        queryDataDelete("http://localhost:1594/api/v1/followers_remove",{maND:maND,maNS:maNS},function(res)
        {
            if(res.ErrorCode ==0)
                bootbox.alert("Xóa thành công " + maND + " và " + maNS)
            else 
                bootbox.alert("Xóa không thành công")
            show()
        })

    }
  } )
  // luôn cho mode :0
  mode = 0
  // Hiển thị lại dữ liệu
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
    $(".maNS").prop("disabled",false)
    $(".ngayTheoDoi").prop("disabled",false)
    //Xóa dữ liệu cũ
    $(".maND").val('')
    $(".maNS").val('')
    $(".ngayTheoDoi").val('')
})
// Khi nhấn lưu
$(".btnsave").click(function()
{
    // mờ save , sáng add
    $(".btnadd").prop("disabled",false)
    $(".btnsave").prop("disabled",true)
    //Khi lưu xong
    $(".maND").prop("disabled",true)
    $(".maNS").prop("disabled",true)
    $(".ngayTheoDoi").prop("disabled",true)
    // thực hiện gọi API đăng ký
    if(mode ==1)
    {
        // gọi API đăng ký
        const datasend = {
            maND : $(".maND").val(),
            maNS : $(".maNS").val(),
            ngayTheoDoi : $(".ngayTheoDoi").val(),
        }
        console.log(datasend);
        queryDataPost("http://localhost:1594/api/v1/followers_add",datasend,function(res)
        {
            if(res.ErrorCode ==0)
            {
                bootbox.alert("Lưu thành công");
            }
            else {
                bootbox.alert("Lưu thất bại");
            }
            show()
        })
    }
})
//Show modal nghesi
$(".theodoi_tb").on('click','.nghesi_details',function(){
    var s=$(this).attr("data-ma");
   //console.log("KAIOKEn",s);
    $('.showNS').modal('show');
    queryDataGet("http://localhost:1594/api/v1/artists",{'id':s},function(res){
        const info=res.data[0];
        let gt = (info.GioiTinh ===1 ? 'Nam':'Nữ')
        $(".addma").html(info.TenNS)
        $(".addht").html(info.MANS)
        $(".addgt").html(gt)
        $(".addngaysinh").html(new Date(info.NgaySinh).toLocaleDateString())
        $(".addQt").html(info.MaQT)
    })
})
//Show modal nguoidung
$(".theodoi_tb").on('click','.users_details',function(){
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