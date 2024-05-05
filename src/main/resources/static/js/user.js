window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    //Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Enable Select2
    // $('.js-example-basic-multiple').select2();
    btnAdd.addEventListener("click", btnAddMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtPassword.addEventListener("keyup", txtPasswordKU);
    txtRetypePassword.addEventListener("keyup", txtRetypePasswordKU);
    txtSearchName.addEventListener("keyup", btnSearchMC);

    //Request Privileges
    privileges = httpRequest("../privilege?module=USER", "GET");

    //Request Lists for Combo box
    employeeswithoutusers = httpRequest("../employee/list/withoutusers", "GET");
    employees = httpRequest("../employee/list", "GET");

    roleslist = httpRequest("../role/list", "GET");

    //apply selecr2 into your select box
    $(".js-example-basic-multiple").select2({
        placeholder: " Select Roles",
        allowClear: true
    });

    //Colors
    active = "#72b3c0";
    update = "#f29d63";

    // Refresh View & Form
    loadView();
    loadForm();
}

//Set Attributes to Initial on Table Load
function loadView() {

    // Table Search Area
    txtSearchName.value = "";
    txtSearchName.style.border = "";

    activerowno = "";
    activepage = 1;
    var query = "";
    loadTable(1, cmbPageSize.value, query);

}

//Load Table & Fill Data
function loadTable(page, size, query, color=null) {
    page = page - 1;

    users = new Array(); //user list
    var data = httpRequest("/user/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) users = data.content;

    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    fillTable('tblUser', users, fillForm, btnDeleteMC, printrow, null, null, null);
    clearSelection(tblUser);


    if(color !=null){
        if (activerowno != "") selectRow(tblUser, activerowno, color); //select row if any & color
    }else{
        if (activerowno != "") selectRow(tblUser, activerowno, active); //select row if any & color
    }

    window.location.href = "#ui";
}

function paginate(page) {
    var paginate;
    if (olduser == null) {
        paginate = true;
    } else {
        if (getErrors() == '' && getUpdates() == '') {
            paginate = true;
        } else {
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if (paginate) {
        activepage = page;
        activerowno = "";
        loadForm();
        loadSearchedTable();
    }
}

function loadForm() {

    user = new Object();
    olduser = null;

    fillCombo(cmbEmployee, "Select Employee", employeeswithoutusers, "callingname", "");
    fillCombo(cmbEmployeeCreated, "Loged Employee", employees, "callingname", session.getObject("activeuser").employeeId.callingname);
    fillCombo(cmbUserRoles, "", roleslist, "role", "");

    $(cmbUserRoles).siblings().children().children().children().children('.select2-search__field').width('97%');

    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = today.getDate();
    if (date < 10) date = "0" + date;

    dteDOCreated.value = today.getFullYear() + "-" + month + "-" + date;

    user.docreation = dteDOCreated.value;
    user.employeeCreatedId = JSON.parse(cmbEmployeeCreated.value);

    chkStatus.checked = true;
    user.active = true;
    $('#chkStatus').bootstrapToggle('on')

    txtUsername.value = "";
    txtPassword.value = "";
    txtRetypePassword.value = "";
    txtDescription.value = "";

    setStyle(initialF);
    validF(dteDOCreated);
    validF(cmbEmployeeCreated);

    disableButtons(false, true, true);
    cmbEmployeeCreated.disabled = "disabled";
}

function setStyle(style) {
    style(txtUsername);
    style(txtPassword);
    style(txtRetypePassword);
    style(txtEmail);
    style(cmbEmployee);
    style(dteDOCreated);
    style(txtDescription);
    style(cmbEmployeeCreated);
    style(cmbUserRoles);
}

function disableButtons(add, upd, del) {

    if (add || !privileges.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
    }

    if (upd || !privileges.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor', 'not-allowed');
    } else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor', 'pointer');
    }

    if (!privileges.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor', 'not-allowed');
    } else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor', 'pointer');
    }

    if (!privileges.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }
}

function txtPasswordKU() {
    txtRetypePassword.value = "";
    invalidF(txtRetypePassword);

}

function txtRetypePasswordKU() {
    var pattern = new RegExp('^[A-Za-z0-9]{5,10}$');
    var password = txtPassword.value;
    var retypepassword = txtRetypePassword.value;
    if (pattern.test(password) && password == retypepassword) {
        user.password = password;
        validF(txtRetypePassword);
        validF(txtPassword);
    } else {
        user.password = null;
        invalidF(txtRetypePassword);
    }
}

//Form Operation Functions
function getErrors() {

    var errors = "";
    addvalue = "";

    if (user.employeeId == null){
        invalidF(cmbEmployee);
        errors = errors + "\n" + "Employee Not Selected";
    }else addvalue = 1;

    if (user.userName == null){
        invalidF(txtUsername);
        errors = errors + "\n" + "User Name Not Entered";
    } else addvalue = 1;

    if (user.password == null){
        invalidF(txtPassword);
        errors = errors + "\n" + "Password Not Inserted or Mismatch";
    } else addvalue = 1;

    if (user.email == null){
        invalidF(txtEmail);
        errors = errors + "\n" + "Email Not Entered";
    } else addvalue = 1;

    if (user.roles.length == 0){
        invalidF(cmbUserRoles);
        errors = errors + "\n" + "Roles Not Selected";
    } else addvalue = 1;

    return errors;

}

function btnAddMC() {
    var errors = getErrors();

    if (errors == "") {

        swal({
            title: "Are you sure to add following User ?",
            text: "\nEmployee : " + user.employeeId.callingname +
                "\nUsername : " + user.userName +
                "\nUser email : " + user.email +
                "\nCreated By : " + user.employeeCreatedId.callingname,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((save) => {
            if (save) {
                var response = httpRequest("/user", "POST", user);
                if (response == "0") {
                    swal({
                        title: "Saved Successfully....!",
                        text: "\n\n",
                        icon: "success", button: false, timer: 1200,
                    });
                    employeeswithoutusers = httpRequest("../employee/withoutusers", "GET");
                    activerowno = 1;
                    loadSearchedTable();
                    loadForm();
                    $('#addUserModal').modal('hide');
                } else
                    swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
            }

        });
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();


    if (olduser == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values, Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((clear) => {
            if (clear) {
                loadForm();
                loadView()
            }

        });
    }
}

//Fill Form - Get confirmation on second time update
function fillForm(usr, rowno) {
    activerowno = rowno;

    if (olduser == null) {
        filldata(usr);
    } else {
        swal({
            title: "Previous attempt to update the form has not submitted... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: ["Cancel", "Discard"], dangerMode: true,
        }).then((discard) => {
            if (discard) {
                filldata(usr);
            }

        });
    }

}

//Fill Data on Update
function filldata(usr) {
    clearSelection(tblUser);
    disableButtons(true, false, false);
    selectRow(tblUser, activepage, active);


    user = JSON.parse(JSON.stringify(usr));
    olduser = JSON.parse(JSON.stringify(usr));

    // fill combo 2
    fillCombo2(cmbUserRoles, "", roleslist, "role", user.roles);

    // $('.select2-selection').css('border', '2px solid green');
    validF($(cmbUserRoles).siblings().children().children('.select2-selection--multiple'));
    $(cmbUserRoles).siblings().children().children().children().children('.select2-search__field').width('97%');


    txtUsername.value = user.userName;
    dteDOCreated.value = user.docreation;
    txtDescription.value = user.description;
    txtEmail.value = user.email;
    txtUsername.disabled = "disabled";
    txtPassword.disabled = "disabled";
    txtRetypePassword.disabled = "disabled";
    dteDOCreated.disabled = "disabled";

    if (!user.active) {
        chkStatus.checked = false;
        $('#chkStatus').bootstrapToggle('off')
    } else {
        chkStatus.checked = true;
        $('#chkStatus').bootstrapToggle('on')
    }
    fillCombo(cmbEmployee, "", employees, "callingname", user.employeeId.callingname);

    fillCombo(cmbEmployeeCreated, "", employees, "callingname", user.employeeCreatedId.callingname);
    cmbEmployee.disabled = "disabled";
    cmbEmployeeCreated.disabled = "disabled";

    divDteDOCreated.style.display = "none";
    setStyle(validF);

    $('#addUserModal').modal('show');


}

//Check for Updated Values
function getUpdates() {

    var updates = "";

    if (user != null && olduser != null) {

        if (isEqualtolist(user.roles, olduser.roles, "role"))
            updates = updates + "\nRoles are Changed";

        if (user.description != olduser.description)
            updates = updates + "\nDescription is Changed";

        if (user.active != olduser.active)
            updates = updates + "\nUserstatus is Changed";
    }
    return updates;
}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "") swal({
            title: 'Nothing Updated..!', icon: "warning",
            text: '\n',
            button: false,
            timer: 1200
        });
        else {

            swal({
                title: "Are you sure to update following User details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: ["Cancel", "Update"], dangerMode: true,
            }).then((update) => {
                if (update) {
                    var response = httpRequest("/user", "PUT", user);
                    if (response == "0") {
                        swal({
                            title: "Updated Successfully....!",
                            text: "\n\n",
                            icon: "success", button: false, timer: 1200,
                        });
                        loadSearchedTable();
                        $('#addUserModal').modal('hide');
                        loadForm();


                    } else swal({
                        position: 'center',
                        icon: 'error',
                        title: 'Failed to Update...',
                        text: 'You have following error ' + response,
                        button: true,
                    });
                }
            });
        }
    } else
        swal({
            position: 'center',
            icon: 'warning',
            title: 'You have following errors in your form',
            text: '\n' + getErrors(),
            button: true,
        });

}

function btnDeleteMC(uer) {
    user = JSON.parse(JSON.stringify(uer));

    swal({
        title: "Are your sure to delete following ! \n\n",
        text: "Number : " + user.userName + "\nEmployee name : " + user.employeeId.callingname,
        icon: "warning", buttons: ["Cancel", "Delete"], closeOnClickOutside: false, dangerMode: true,
    }).then((willDelete) => {
        var response = httpRequest("/user", "DELETE", user);
        if (response == "0") {
            swal({
                title: "Deleted Successfully....!",
                text: "\n\n  Status change to delete",
                icon: "success", button: false, timer: 1200,
            });
            employeeswithoutusers = httpRequest("../employee/list/withoutusers", "GET");
            loadForm();
            loadSearchedTable();

        } else swal({
            title: "You have following erros....!",
            text: "\n\n" + response,
            icon: "error", button: true,
        });
    });

}

//Search Functions
function loadSearchedTable(color=null) {


    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);

    if(color !=null){
        loadTable(activepage, cmbPageSize.value, query, color); //call loadTable passing the query

    }else{
        loadTable(activepage, cmbPageSize.value, query); //call loadTable passing the query
    }

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

//Custom combo binder
function cusComboBoxBinder(field) {

    rlist = $('.js-example-basic-multiple').val();
    user.roles = new Array();

    rlist.forEach(function (item) {
        eval('var obj=' + item);
        user.roles.push(obj);
    })

    if (user.roles.length != 0) {

        if (olduser != null && isEqualtolist(user.roles, olduser.roles, "role")) {
            // $('.select2-selection').css('border', '2px solid #dc6413');
            updateF($(field).siblings().children().children('.select2-selection--multiple'));
        } else {
            // $('.select2-selection').css('border', '2px solid #3F808D');
            validF($(field).siblings().children().children('.select2-selection--multiple'));
        }
    } else{
        // $('.select2-selection').css('border', '2px solid #f03e3e');
        invalidF($(field).siblings().children().children('.select2-selection--multiple'));
    }
}


function printrow(usr) {
    user = JSON.parse(JSON.stringify(usr));
}

function btnPrintTableMC() {

    var newwindow = window.open();
    formattab = tblUser.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='/vendor/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px; '> <h1>User Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    //Stop loading the document after time interval and auto open print
    setTimeout(function () {
        newwindow.print();
    }, 100);
}
