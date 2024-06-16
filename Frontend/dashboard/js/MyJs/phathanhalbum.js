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
    $(".cbMaNgheSi").prop("disabled",true)
    $(".cbALB").prop("disabled",true)
    comboBox()
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
function comboBox()
{
    // load combobox cho mã nghệ sĩ
    queryDataGet("http://localhost:1594/api/v1/artists", "", function (res) {
        // lấy dữ liệu từ api
        const data = res.data;
        // lấy error code để check
        const code = res.ErrorCode;
        if (code != 0) {
          $(".cbMaNgheSi").html("không có dữ liệu");
        } else {
            let htmls = '';
        // lặp các element có trong data
            for (const  element in data) {
            const item = data[element];
            htmls = htmls + '<option value="' + item.MANS + '">' + item.TenNS + "</option>";
            }
            $(".cbMaNgheSi").html(htmls);
        }
      });
    // load combobox cho mã album
    queryDataGet("http://localhost:1594/api/v1/albums", "", function (res) {
        // lấy dữ liệu từ api
        const data = res.data;
        // lấy error code để check
        const code = res.ErrorCode;
        if (code != 0) {
          $(".cbALB").html("không có dữ liệu");
        } else {
            let htmls = '';
        // lặp các element có trong data
            for (const  element in data) {
            const item = data[element];
            htmls = htmls + '<option value="' + item.MAALB + '">' + item.TenALB + "</option>";
            }
            $(".cbALB").html(htmls);
        }
      });
}
// lấy danh sách người dùng
function show()
{
    queryDataGet("http://localhost:1594/api/v1/release_album","",function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".phathanhalbum_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                const ngayphathanhalbum = new Date(obj.ThoiGian);
                const hienthingayphathanhalbum = DisplayDateTime(ngayphathanhalbum.toLocaleString())
                        htmls=htmls+'<tr>'+
                                '<td class="nghesi_details hover_td" data-ma = "'+obj.MANS+'">'+obj.MANS+'</td>'+
                                '<td class="album_deatils hover_td" data-ma = "'+obj.MAALB+'">'+obj.MAALB+'</td>'+
                                '<td>'+hienthingayphathanhalbum+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-maNS ="'+obj.MANS+'" data-maALB ="'+obj.MAALB+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span data-maNS ="'+
                                obj.MANS+
                                '" data-maALB ="'+obj.MAALB+ 
                                '" data-date ="'+ConvertDate(ngayphathanhalbum.toLocaleDateString(),false)+ 
                                '"> '+
                              '</tr>';
              }
            // chèn vào
            $(".phathanhalbum_tb").html(htmls);
        }
    })  
}
// Tìm kiếm tên người dùng
function showSearch ()
{
    const keyseacrh = $(".txtsearch").val()
    console.log(keyseacrh);
    queryDataGet(`http://localhost:1594/api/v1/release_album_search?maNS=${keyseacrh}&maALB=${keyseacrh}`,'',function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".phathanhalbum_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                const ngayphathanhalbum = new Date(obj.ThoiGian);
                const hienthingayphathanhalbum = DisplayDateTime(ngayphathanhalbum.toLocaleString())
                        htmls=htmls+'<tr>'+
                                '<td class="nghesi_details hover_td" data-ma = "'+obj.MANS+'">'+obj.MANS+'</td>'+
                                '<td class="album_deatils hover_td" data-ma = "'+obj.MAALB+'">'+obj.MAALB+'</td>'+
                                '<td>'+hienthingayphathanhalbum+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-maNS ="'+obj.MANS+'" data-maALB ="'+obj.MAALB+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span data-MANS ="'+
                                obj.MANS+
                                '" data-maALB ="'+obj.MAALB+ 
                                '" data-date ="'+ConvertDate(ngayphathanhalbum.toLocaleDateString(),false)+ 
                                '"> '+
                              '</tr>';
              }
            // chèn vào
            $(".phathanhalbum_tb").html(htmls);
        }
    })  
}
// Nhấn nút xóa
$(".phathanhalbum_tb").on('click','.nut_xoa',function()
{
  console.log("da click nut xoa")
  const MANS = $(this).attr("data-maNS")
  const MAALB = $(this).attr("data-maALB")
  console.log(MANS)
  bootbox.confirm('Bạn có chắc xóa ' +MANS+ ' và ' +MAALB+ ' mã  này ?',function(result)
  {
    if (result==true)
    {
        queryDataDelete("http://localhost:1594/api/v1/release_album_remove",{maNS:MANS,maALB:MAALB},function(res)
        {
            if(res.ErrorCode ==0)
                bootbox.alert("Xóa thành công " + MANS + " và " + MAALB)
            else 
                bootbox.alert("Xóa không thành công")
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
    $(".cbMaNgheSi").prop("disabled",false)
    $(".cbALB").prop("disabled",false)
    //Xóa dữ liệu cũ
    $(".cbMaNgheSi").val('')
    $(".cbALB").val('')
})
// Khi nhấn lưu
$(".btnsave").click(function()
{
    // mờ save , sáng add
    $(".btnadd").prop("disabled",false)
    $(".btnsave").prop("disabled",true)
    //Khi lưu xong
    $(".cbMaNgheSi").prop("disabled",true)
    $(".cbALB").prop("disabled",true)
    // thực hiện gọi API đăng ký
    if(mode ==1)
    {
        // gọi API đăng ký
        const datasend = {
            maNS : $(".cbMaNgheSi").val(),
            maALB : $(".cbALB").val(),
        }
        console.log(datasend);
        queryDataPost("http://localhost:1594/api/v1/release_album_add",datasend,function(res)
        {
            if(res.ErrorCode ==0)
            {
                bootbox.alert("Lưu thành công");
            }
            else {
                bootbox.alert("Lưu thất bại");
            }
            // thực hiện gọi API sửa
            show()
        })
    }
    
})
//Show modal album
$(".phathanhalbum_tb").on('click','.album_deatils',function(){
    var s=$(this).attr("data-ma");
   //console.log("KAIOKEn",s);
    $('.showALB').modal('show');
    queryDataGet("http://localhost:1594/api/v1/album_search",{'maALB':s,'tenALB':s},function(res){
        const info=res.data[0];
        let gt = (info.TinhTrang ===1 ? 'Public':'Private')
        $(".addma").html(info.MAALB)
        $(".addht").html(info.TenALB)
        $(".addgt").html(gt)
    })
})
//Show modal nghesi
$(".phathanhalbum_tb").on('click','.nghesi_details',function(){
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