function checkSp()
{
    const ten = document.getElementById("ten-sp").value;
    const slt = document.getElementById("sl-ton").value;
    const gia = document.getElementById("gia").value;
    const giam = document.getElementById("giam").value;
    var e = document.getElementById("error");
    if(ten.length <1) {
        e.textContent = "Vui lòng điền tên sản phẩm";
        return false;
    }
    if(slt.length <1 || (isNaN(slt) || slt < 0)) {
        e.textContent = "Vui lòng điền số lượng tồn thích hợp";
        return false;
    }
    if(gia.length <1 ||isNaN(gia) || gia < 0) {
        e.textContent = "Vui lòng điền giá sản phẩm thích hợp";
        return false;
    }
    if(giam.length <1 || (isNaN(giam) || giam < 0 || giam >100)) {
        e.textContent = "Vui lòng điền % giảm giá sản phẩm thích hợp";
        return false;
    }
    return true;
}


function checkLogin() {
    var pw = document.getElementById("pw").value;
    var email = document.getElementById("email").value;
    var e = document.getElementById("error");

    if(email=='')
    {
        e.textContent = "Không được để trống email";
        return false;
    }
    if(pw == '') {
        e.textContent = "Không được để trống mật khẩu";
        return false;
    }

    if(pw1.length < 6)
    {
        e.textContent = "Mật khẩu gồm ít nhất 6 kí tự";
        return false;
    }
    return true;
}
