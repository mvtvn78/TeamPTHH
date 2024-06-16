//image container
const arrImage = []
const arrSound=[]
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
    $(".maBH").prop("disabled",true)
    $(".tenBH").prop("disabled",true)
    $(".cbAlbum").prop("disabled",true)
    $(".cbTL").prop("disabled",true)
    $(".tinhTrang").prop("disabled",true)
    $(".noidung").prop("disabled",true)
    $(".file_anh").prop("disabled",true)
    $(".loibaihat").prop("disabled",true)
    $(".audio_file").prop("disabled",true)
    $(".luotxem").prop("disabled",true)
    comboBox()
    show()
});
function ClearAndShow()  {
    // xóa dữ liệu cũ
    $(".maBH").val(''),
    $(".tenBH").val(''),
    $(".noidung").val(''),
    $(".loibaihat").val(''),
    $(".file_anh").val('')
    $(".audio_file").val('')
    $(".luotxem").val('')
    $(".file_name").text('default.jpg')
    $(".audio_name").text('example.mp3')
    $(".avatar-view").attr("src", domain + 'default.jpg');
    $(".audio_preview").attr("src", '');
   // Hiển thị lại dữ liệu
    show()
}

// lấy dữ liệu combobox 
function comboBox()
{
    // load combobox cho  the loai
    queryDataGet("http://localhost:1594/api/v1/genre", "", function (res) {
        // lấy dữ liệu từ api
        const data = res.data;
        // lấy error code để check
        const code = res.ErrorCode;
        if (code != 0) {
          $(".cbQT").html("không có dữ liệu");
        } else {
            let htmls = '';
        // lặp các element có trong data
            for (const  element in data) {
            const item = data[element];
            htmls = htmls + '<option value="' + item.MATL + '">' + item.TenTL + "</option>";
            }
            $(".cbTL").html(htmls);
        }
      });
    // load combobox cho album
    queryDataGet("http://localhost:1594/api/v1/albums", "", function (res) {
        // lấy dữ liệu từ api
        const data = res.data;
        // lấy error code để check
        const code = res.ErrorCode;
        if (code != 0) {
          $(".cbMaLoai").html("không có dữ liệu");
        } else {
            let htmls = '';
        // lặp các element có trong data
            for (const  element in data) {
            const item = data[element];
            htmls = htmls + '<option value="' + item.MAALB + '">' + item.TenALB + "</option>";
            }
            $(".cbAlbum").html(htmls);
        }
      });
}
// lấy danh sách người dùng
function show()
{   
    queryDataGet("http://localhost:1594/api/v1/songs","",function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".baihat_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const item in data){
                const obj=data[item];
                        htmls=htmls+'<tr>'+
                                '<td>'+obj.MABH+'</td>'+
                                '<td>'+obj.MAALB+'</td>'+
                                '<td>'+obj.MATL+'</td>'+
                                '<td>'+obj.TenBH+'</td>'+
                                '<td>'+obj.TinhTrang+'</td>'+
                                '<td>'+obj.NoiDung+'</td>'+
                                '<td>'+obj.Anh+'</td>'+
                                '<td>'+new Intl.NumberFormat().format(obj.LuotXem)+'</td>'+
                                '<td>'+obj.LoiBatHat+'</td>'+
                                '<td>'+obj.filenhac+'</td>'+
                                '<td> <span class="badge badge-danger nut_xoa" data-ma ="'+obj.MABH+'"> '+
                                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                                '<span class="badge badge-danger nut_sua" data-ma ="'+
                                obj.MABH+
                                '" data-alb ="'+obj.MAALB+ 
                                '" data-tl ="'+obj.MATL+ 
                                '" data-tenBh ="'+obj.TenBH+
                                '" data-tt ="'+obj.TinhTrang+
                                '" data-noidung ="'+obj.NoiDung+
                                '" data-anh ="'+obj.Anh+
                                '" data-luotxem ="'+obj.LuotXem+
                                '" data-loibaihat ="'+obj.LoiBatHat+
                                '" data-filenhac ="'+obj.filenhac+
                                '"> '+
                                '<i class="fa fa-edit"></i>&nbsp;Sửa</span></td>'+
                              '</tr>';
              }
            // chèn vào
            $(".baihat_tb").html(htmls); 
        }
    })  
}
// Tìm kiếm tên người dùng
function showSearch ()
{
    const keyseacrh = $(".txtsearch").val()
    const datasend ={
        maBH : keyseacrh,
        tenBH : keyseacrh,
    }
    console.log(keyseacrh);
    queryDataGet("http://localhost:1594/api/v1/song_search",datasend,function(res){
        // lấy dữ liệu từ api
        const data = res.data
        // lấy error code để check
        const code = res.ErrorCode
        if(code != 0)
        {
            $(".baihat_tb").html("không có dữ liệu");
        }
        else 
        {
            let htmls ='';
            // vòng lặp lấy dữ liệu từ API
            for(const index in data){
                const obj=data[index];
                htmls=htmls+'<tr>'+
                '<td>'+obj.MABH+'</td>'+
                '<td>'+obj.MAALB+'</td>'+
                '<td>'+obj.MATL+'</td>'+
                '<td>'+obj.TenBH+'</td>'+
                '<td>'+obj.TinhTrang+'</td>'+
                '<td>'+obj.NoiDung+'</td>'+
                '<td>'+obj.Anh+'</td>'+
                '<td>'+new Intl.NumberFormat().format(obj.LuotXem)+'</td>'+
                '<td>'+obj.LoiBatHat+'</td>'+
                '<td>'+obj.filenhac+'</td>'+
                '<td> <span class="badge badge-danger nut_xoa" data-ma ="'+obj.MABH+'"> '+
                '<i class="fa fa-remove"></i>&nbsp;Xóa</span>' +
                '<span class="badge badge-danger nut_sua" data-ma ="'+
                obj.MABH+
                '" data-alb ="'+obj.MAALB+ 
                '" data-tl ="'+obj.MATL+ 
                '" data-tenBh ="'+obj.TenBH+
                '" data-tt ="'+obj.TinhTrang+
                '" data-noidung ="'+obj.NoiDung+
                '" data-anh ="'+obj.Anh+
                '" data-luotxem ="'+obj.LuotXem+
                '" data-loibaihat ="'+obj.LoiBatHat+
                '" data-filenhac ="'+obj.filenhac+
                '"> '+
                '<i class="fa fa-edit"></i>&nbsp;Sửa</span></td>'+
              '</tr>';
              }
            // chèn vào
            $(".baihat_tb").html(htmls);
        }
    })  
}
//Nhấn nút sửa
$(".baihat_tb").on('click','.nut_sua',function()
{
    // thay đổi mode 
    mode = 2;
     //sáng trừ mã người dùng
     $(".maBH").prop("disabled",true)
    $(".tenBH").prop("disabled",false)
    $(".cbAlbum").prop("disabled",false)
    $(".cbTL").prop("disabled",false)
    $(".tinhTrang").prop("disabled",false)
    $(".noidung").prop("disabled",false)
    $(".file_anh").prop("disabled",false)
    $(".loibaihat").prop("disabled",false)
    $(".audio_file").prop("disabled",false)
    $(".luotxem").prop("disabled",false)
    // mờ add , sáng save
    $(".btnadd").prop("disabled",true)
    $(".btnsave").prop("disabled",false)
    // lấy giá trị từ bản thân nó
    let MA = $(this).attr("data-ma")
    let alb = $(this).attr("data-alb")
    let tloai = $(this).attr("data-tl")
    let tenBH = $(this).attr("data-tenBh")
    let noidung = $(this).attr("data-noidung")
    let anh = $(this).attr("data-anh") 
    let loibaihat = $(this).attr("data-loibaihat")
    let luotxem = $(this).attr("data-luotxem")
    let filenhac = $(this).attr("data-filenhac") 
    let tinhtrang =  $(this).attr("data-tt") 
    // đưa dữ liệu lên
    $(".maBH").val(MA)
    $(".tenBH").val(tenBH),
    $(".noidung").val(noidung)
    $(".loibaihat").val(loibaihat)
    $(".luotxem").val(luotxem)
    //
    $(".tinhTrang").val(tinhtrang)
    $(".cbAlbum").val(alb)
    $(".cbTL").val(tloai)
    //
    $(".file_name").text(anh)
    $(".audio_name").text(filenhac)
    $(".avatar-view").attr("src", domain + anh);
    $(".audio_preview").attr("src", domain+filenhac);

    $(".tenBH").focus()
    
})
// Nhấn nút xóa
$(".baihat_tb").on('click','.nut_xoa',function()
{
  console.log("da click nut xoa")
  const ma = $(this).attr("data-ma")
  bootbox.confirm('Bạn có chắc xóa '+ma+' mã  này ?',function(result)
  {
    if (result==true)
    {
        queryDataDelete("http://localhost:1594/api/v1/song_remove",{maBH:ma},function(res)
        {
            console.log(res);
            if(res.ErrorCode ==0)
                bootbox.alert("Xóa thành công" + ma)
            else 
                bootbox.alert("Xóa không thành công")
                ClearAndShow()
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
    $(".maBH").prop("disabled",true)
    $(".tenBH").prop("disabled",false)
    $(".cbAlbum").prop("disabled",false)
    $(".cbTL").prop("disabled",false)
    $(".tinhTrang").prop("disabled",false)
    $(".noidung").prop("disabled",false)
    $(".file_anh").prop("disabled",false)
    $(".loibaihat").prop("disabled",false)
    $(".audio_file").prop("disabled",false)
    $(".tenBH").focus()
    //Xóa dữ liệu cũ
    // xóa dữ liệu cũ
    $(".maBH").val(''),
    $(".tenBH").val(''),
    $(".tinhTrang").val(''),
    $(".noidung").text(''),
    $(".loibaihat").text(''),
    $(".file_name").text('default.jpg')
    $(".avatar-view").attr("src", domain + 'default.jpg');
})
// Khi nhấn lưu
$(".btnsave").click(function()
{
    // mờ save , sáng add
    $(".btnadd").prop("disabled",false)
    $(".btnsave").prop("disabled",true)
    //Khi lưu xong
    $(".maBH").prop("disabled",true)
    $(".tenBH").prop("disabled",true)
    $(".cbAlbum").prop("disabled",true)
    $(".cbTL").prop("disabled",true)
    $(".tinhTrang").prop("disabled",true)
    $(".noidung").prop("disabled",true)
    $(".file_anh").prop("disabled",true)
    $(".loibaihat").prop("disabled",true)
    $(".audio_file").prop("disabled",true)
    $(".luotxem").prop("disabled",true)
    // thực hiện gọi API đăng ký
    if(mode ==1)
    {
         // tạo chế độ form data
         const formData = new FormData();
        
         // lấy tệp tin
         let fileAnh = $(".file_anh")[0].files[0]
         let fileNhac = $(".audio_file")[0].files[0]
         //Trường hợp không có cập nhật ảnh
         if(fileAnh && fileNhac)
         {

            // gọi API UPLOAD
            let fileName_anh = ''
            let fileName_nhac =''
            formData.append('file',fileAnh)
            $.ajax({
                url: "http://localhost:1594/upload",
                type: 'POST',
                data: formData,
                contentType : false,
                processData : false,
                success: function(res)
                {
                    if(res.ErrorCode === 0)
                    {
                        fileName_anh = res.data
                        // tạo chế độ form data
                         const form_data_nhac = new FormData();
                         form_data_nhac.append('file',fileNhac)
                         $.ajax({
                            url: "http://localhost:1594/upload",
                            type: 'POST',
                            data: form_data_nhac,
                            contentType : false,
                            processData : false,
                            success: function(res){
                                if(res.ErrorCode === 0)
                                {
                                    fileName_nhac = res.data
                                    // gọi API đăng ký
                                    const datasend = {
                                        maALB : $(".cbAlbum").val(),
                                        maTL : $(".cbTL").val(),
                                        tenBH : $(".tenBH").val(),
                                        tinhTrang : $(".tinhTrang").val(),
                                        noiDung :$(".noidung").val(),
                                        anh :fileName_anh,
                                        loibathat :$(".loibaihat").val(),
                                        filenhac :fileName_nhac,
                                    }
                                    console.log(datasend);
                                    queryDataPost("http://localhost:1594/api/v1/song_add",datasend,function(res)
                                    {
                                        if(res.ErrorCode ==0)
                                        {
                                            bootbox.alert("Lưu thành công");
                                        }
                                        else {
                                            bootbox.alert("Lưu thất bại");
                                        }
                                        ClearAndShow()
                                    })
                                }
                            }})
                        return;
                    }
                    else
                   { bootbox.alert("Upload ảnh hoặc file  thất bại");
                    ClearAndShow()}
                }})
            return
        }
        bootbox.alert('Vui lòng upload file ảnh và file nhạc')
        ClearAndShow()
    }
    // thực hiện gọi API sửa
    else
    {
        //
         // lấy tệp tin
         let fileAnh = $(".file_anh")[0].files[0]
         let fileNhac = $(".audio_file")[0].files[0]
        // trường hợp : có ảnh và có file nhạc
        if(fileAnh && fileNhac)
        {
            // tạo chế độ form data
             const formDataAnh = new FormData();
             formDataAnh.append('file',fileAnh)
             $.ajax({
                url: "http://localhost:1594/upload",
                type: 'POST',
                data: formDataAnh,
                contentType : false,
                processData : false,
                success: function(res)
                {
                    if(res.ErrorCode === 0)
                    {
                        fileName_anh = res.data
                        // tạo chế độ form data
                         const form_data_nhac = new FormData();
                         form_data_nhac.append('file',fileNhac)
                         $.ajax({
                            url: "http://localhost:1594/upload",
                            type: 'POST',
                            data: form_data_nhac,
                            contentType : false,
                            processData : false,
                            success: function(res){
                                if(res.ErrorCode === 0)
                                {
                                    fileName_nhac = res.data
                                    // gọi API đăng ký
                                    const datasend = {
                                        maBH:$(".maBH").val(),
                                        maALB : $(".cbAlbum").val(),
                                        maTL : $(".cbTL").val(),
                                        tenBH : $(".tenBH").val(),
                                        tinhTrang : $(".tinhTrang").val(),
                                        noiDung :$(".noidung").val(),
                                        anh :fileName_anh,
                                        luotxem:  $(".luotxem").val(),
                                        loibathat :$(".loibaihat").val(),
                                        filenhac :fileName_nhac,
                                    }
                                    console.log(datasend);
                                    queryDataPut("http://localhost:1594/api/v1/song_update",datasend,function(res)
                                    {
                                        if(res.ErrorCode ==0)
                                        {
                                            bootbox.alert("Lưu thành công");
                                        }
                                        else {
                                            bootbox.alert("Lưu thất bại");
                                        }
                                        ClearAndShow()
                                    })
                                }
                            }})
                        return;
                    }
                    else
                   { bootbox.alert("Upload ảnh hoặc file  thất bại");
                    ClearAndShow()}
                }})
        }
        // trường hợp có ảnh
        else if(fileAnh)
        {
            // tạo chế độ form data
            const formDataAnh = new FormData();
            formDataAnh.append('file',fileAnh)
            $.ajax({
               url: "http://localhost:1594/upload",
               type: 'POST',
               data: formDataAnh,
               contentType : false,
               processData : false,
               success: function(res)
               {
                if(res.ErrorCode === 0)
                {
                    const datasend = {
                        maBH:$(".maBH").val(),
                        maALB : $(".cbAlbum").val(),
                        maTL : $(".cbTL").val(),
                        tenBH : $(".tenBH").val(),
                        tinhTrang : $(".tinhTrang").val(),
                        noiDung :$(".noidung").val(),
                        anh :res.data,
                        luotxem:  $(".luotxem").val(),
                        loibathat :$(".loibaihat").val(),
                        filenhac :$(".audio_name").text(),
                    }
                    console.log(datasend);
                    queryDataPut("http://localhost:1594/api/v1/song_update",datasend,function(res)
                    {
                        if(res.ErrorCode ==0)
                        {
                            bootbox.alert("Lưu thành công");
                        }
                        else {
                            bootbox.alert("Lưu thất bại");
                        }
                        ClearAndShow()
                    })
                }
                else{
                    bootbox.alert("Upload ảnh   thất bại");
                    ClearAndShow()
                }
               }})
        }
        // trường hợp có file nhạc
        else if(fileNhac)
            {
                // tạo chế độ form data
                const formdata_nhac = new FormData();
                formdata_nhac.append('file',fileNhac)
                $.ajax({
                   url: "http://localhost:1594/upload",
                   type: 'POST',
                   data: formdata_nhac,
                   contentType : false,
                   processData : false,
                   success: function(res)
                   {
                    if(res.ErrorCode === 0)
                    {
                        const datasend = {
                            maBH:$(".maBH").val(),
                            maALB : $(".cbAlbum").val(),
                            maTL : $(".cbTL").val(),
                            tenBH : $(".tenBH").val(),
                            tinhTrang : $(".tinhTrang").val(),
                            noiDung :$(".noidung").val(),
                            anh :$(".file_name").text(),
                            luotxem:  $(".luotxem").val(),
                            loibathat :$(".loibaihat").val(),
                            filenhac :res.data,
                        }
                        console.log(datasend);
                        queryDataPut("http://localhost:1594/api/v1/song_update",datasend,function(res)
                        {
                            if(res.ErrorCode ==0)
                            {
                                bootbox.alert("Lưu thành công");
                            }
                            else {
                                bootbox.alert("Lưu thất bại");
                            }
                            ClearAndShow()
                        })
                    }
                    else{
                        bootbox.alert("Upload  file nhạc thất bại");
                        ClearAndShow()
                    }
                   }})
            }
            // trường hợp không thay đổi
        else {
            const datasend = {
                maBH:$(".maBH").val(),
                maALB : $(".cbAlbum").val(),
                maTL : $(".cbTL").val(),
                tenBH : $(".tenBH").val(),
                tinhTrang : $(".tinhTrang").val(),
                noiDung :$(".noidung").val(),
                anh :$(".file_name").text(),
                luotxem:  $(".luotxem").val(),
                loibathat :$(".loibaihat").val(),
                filenhac :$(".audio_name").text(),
            }
            console.log(datasend);
            queryDataPut("http://localhost:1594/api/v1/song_update",datasend,function(res)
            {
                if(res.ErrorCode ==0)
                {
                    bootbox.alert("Lưu thành công");
                }
                else {
                    bootbox.alert("Lưu thất bại");
                }
                ClearAndShow()
            })
        }
    }
})
// nhấn file ảnh upload 
$(".file_anh").change(function(){
    if(arrImage.length >0 )
    {
        for(let i = 0 ;i<arrImage.length ; ++i)
            URL.revokeObjectURL(arrImage[i])
    } 
    $(".file_name").text($(".file_anh")[0].files[0].name)
    const obj = URL.createObjectURL($(".file_anh")[0].files[0])
    arrImage.push(obj)
    // lấy ảnh đưa lên
    $(".avatar-view").attr("src", obj);
})

// nhấn file nhạc upload 
$(".audio_file").change(function(){
    if(arrSound.length >0 )
    {
        for(let i = 0 ;i<arrSound.length ; ++i)
            URL.revokeObjectURL(arrSound[i])
    } 
    $(".audio_name").text($(".audio_file")[0].files[0].name)
    const obj = URL.createObjectURL($(".audio_file")[0].files[0])
    arrSound.push(obj)
    // lấy ảnh đưa lên
    $(".audio_preview").attr("src", obj);
})