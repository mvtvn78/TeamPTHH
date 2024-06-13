// phần chạy chính
$(document).ready(function(){
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
    queryDataGet("http://localhost:6969/api/v1/favorites_list","",function(res){
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
                                '<td>'+obj.MAND+'</td>'+
                                '<td>'+obj.MABH+'</td>'+
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
    queryDataGet("http://localhost:6969/api/v1/favorites_search",datasend,function(res){
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
                                '<td>'+obj.MAND+'</td>'+
                                '<td>'+obj.MABH+'</td>'+
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
        queryDataDelete("http://localhost:6969/api/v1/favorites_list_remove",{maND:maND,maBH:maBH},function(res)
        {
            if(res.ErrorCode ==0)
                bootbox.alert("Xóa thành công " + maND + " và " + maBH)
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
        queryDataPost("http://localhost:6969/api/v1/favorites_list_add",datasend,function(res)
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
