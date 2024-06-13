// phần chạy chính
$(document).ready(function(){
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
    // load combobox cho mã quốc tịch
    queryDataGet("http://localhost:6969/api/v1/release_album", "", function (res) {
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
            htmls = htmls + '<option value="' + item.MANS + '">' + item.MANS + "</option>";
            }
            $(".cbMaNgheSi").html(htmls);
        }
      });
    // load combobox cho mã loại
    queryDataGet("http://localhost:6969/api/v1/release_album", "", function (res) {
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
            htmls = htmls + '<option value="' + item.MAALB + '">' + item.MAALB + "</option>";
            }
            $(".cbALB").html(htmls);
        }
      });
}
// lấy danh sách người dùng
function show()
{
    queryDataGet("http://localhost:6969/api/v1/release_album","",function(res){
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
                const hienthingayphathanhalbum = ConvertDate(ngayphathanhalbum.toLocaleDateString())
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MANS+'</td>'+
                                '<td>'+obj.MAALB+'</td>'+
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
    queryDataGet(`http://localhost:6969/api/v1/release_album_search?maNS=${keyseacrh}&maALB=${keyseacrh}`,'',function(res){
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
                const hienthingayphathanhalbum = ConvertDate(ngayphathanhalbum.toLocaleDateString())
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MANS+'</td>'+
                                '<td>'+obj.MAALB+'</td>'+
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
        queryDataDelete("http://localhost:6969/api/v1/release_album_remove",{maNS:MANS,maALB:MAALB},function(res)
        {
            if(res.ErrorCode ==0)
                bootbox.alert("Xóa thành công " + MANS + " và " + MAALB)
            else 
                bootbox.alert("Xóa không thành công")
        })

    }
  } )
  // luôn cho mode :0
  mode = 0
  // Hiển thị lại dữ liệu
  show()
})
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
        queryDataPost("http://localhost:6969/api/v1/release_album_add",datasend,function(res)
        {
            if(res.ErrorCode ==0)
            {
                bootbox.alert("Lưu thành công");
            }
            else {
                bootbox.alert("Lưu thất bại");
            }
        })
    }
    // thực hiện gọi API sửa
    show()
})
