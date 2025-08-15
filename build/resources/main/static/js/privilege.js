window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    //Enable tooltips
    // $('[data-toggle="tooltip"]').tooltip();

    //Event Listener
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);
    cmbRole.addEventListener("change", cmbRoleCH);

    userprivileges = httpRequest("../privilege?module=PRIVILEGE", "GET");
    roles = httpRequest("../role/list", "GET");
    modules = httpRequest("../module/list", "GET");
    employeeswithuseraccount = httpRequest("../employee/list/withuseraccount", "GET");

    //Colors
    active = "#72b3c0";
    update = "#f29d63";

    // Refresh View & Form
    loadView();
    loadForm();
}

function loadView() {

    // Table Search Area
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    activerowno = "";
    activepage = 1;
    var query = "";
    //loadTable (page,size,search)
    loadTable(1, cmbPageSize.value, query);

}

//Load Table & Fill Data
function loadTable(page, size, query, color = null) {
    page = page - 1;

    privileges = new Array();
    var data = httpRequest("/privilege/findAll?page=" + page + "&size=" + size + query, "GET");

    privileges = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    //fillTable(table_id, data_list, fill(), delete(), view())
    fillTable('tblPrevilage', privileges, fillForm, btnDeleteMC, printRow);
    clearSelection(tblPrevilage);

    if (color != null) {
        if (activerowno != "") selectRow(tblPrevilage, activerowno, active, color); //select row if any & color
    } else {
        if (activerowno != "") selectRow(tblPrevilage, activerowno, active); //select row if any & color
    }
    window.location.href = "#ui";
}

function paginate(page) {
    var paginate;
    if (oldprivilege == null) {
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
        activerowno = ""
        loadSearchedTable();
        loadForm();
    }

}

function loadForm() {

    privilege = new Object();
    oldprivilege = null;

    fillCombo(cmbRole, "Select Role", roles, "role", "");
    fillCombo(cmbModule, "Select Role First", [], "name", "");
    cmbRole.disabled = "";
    cmbModule.disabled = "";

    chkSelect.checked = false;
    chkInsert.checked = false;
    chkUpdate.checked = false;
    chkDelete.checked = false;

    $('#chkDelete').bootstrapToggle('off')
    $('#chkUpdate').bootstrapToggle('off')
    $('#chkInsert').bootstrapToggle('off')
    $('#chkSelect').bootstrapToggle('off')

    privilege.sel = 0;
    privilege.ins = 0;
    privilege.upd = 0;
    privilege.del = 0;

    setStyle(initialF);
    disableButtons(false, true, true);

}

function setStyle(style) {
    style(cmbRole);
    style(cmbModule);

    style(chkSelect.parentNode);
    style(chkInsert.parentNode);
    style(chkUpdate.parentNode);
    style(chkDelete.parentNode);
}

function disableButtons(add, upd, del) {

    if (add || !userprivileges.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
    }

    if (upd || !userprivileges.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor', 'not-allowed');
    } else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor', 'pointer');
    }

    if (!userprivileges.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor', 'not-allowed');
    } else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor', 'pointer');
    }

    if (!userprivileges.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

}

function cmbRoleCH() {
    modulesunassigned = httpRequest("../module/list/unassignedtothisrole?roleid=" + JSON.parse(cmbRole.value).id, "GET");
    fillCombo(cmbModule, "Select a Module", modulesunassigned, "name", "");

}

//Form Operation Functions

function getErrors() {

    var errors = "";

    if (privilege.roleId == null)
        errors = errors + "\n" + "Roles Not Selected";

    if (privilege.moduleId == null)
        errors = errors + "\n" + "Module Not Selected";

    return errors;

}

function btnAddMC() {

    var errors = getErrors();

    if (errors == "") {

        var privi = privilege.sel == 1 ? "Select Granted  " : "Select Not-Granted ";
        privi = privi + (privilege.ins == 1 ? "Insert Granted  " : "Insert Not-Granted ");
        privi = privi + (privilege.upd == 1 ? "Update Granted  " : "Update Not-Granted ");
        privi = privi + (privilege.del == 1 ? "Delete Granted  " : "Delete Not-Granted ");

        swal({
            title: "Are you sure to add a Module with following privileges  ?",
            text: "\nRole : " + privilege.roleId.role +
                "\nModule : " + privilege.moduleId.name +
                "\nPrivilege : " + privi,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((save) => {
            if (save) {
                var response = httpRequest("/privilege", "POST", privilege);
                if (response == "0") {
                    swal({
                        position: 'center',
                        icon: 'success',
                        title: 'Save SuccessFully..!',
                        text: '\n',
                        button: false,
                        timer: 2000
                    })
                    loadForm();
                    activerowno = 1;
                    loadSearchedTable();
                    $('#addPrivilegeModal').modal('hide');
                } else swal({
                    title: 'Save not Success... , You have following errors', icon: "error",
                    text: '\n ' + response,
                    button: true
                });
            }
        })
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + errors,
            icon: "error",
            button: true,
        });
    }

}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();

    var clear;
    if (oldprivilege == null) {
        clear = true;
    } else {
        if (getErrors() == '' && getUpdates() == '') {
            clear = true;
        } else {
            clear = window.confirm("Form has Some Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if (clear) {
        loadForm();
        clearSelection(tblUser);
    }

}

//Fill Form - Get confirmation on second time update
function fillForm(pri, rowno) {
    activerowno = rowno;

    if (oldprivilege == null) {
        filldata(pri);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    filldata(pri);
                }

            });
    }


}

//Fill Data on Update
function filldata(pri) {

    clearSelection(tblPrevilage);

    privilege = JSON.parse(JSON.stringify(pri));
    oldprivilege = JSON.parse(JSON.stringify(pri));

    fillCombo(cmbRole, "", roles, "role", pri.roleId.role);
    fillCombo(cmbModule, "", modules, "name", pri.moduleId.name);
    cmbRole.disabled = "disabled";
    cmbModule.disabled = "disabled";


    if (privilege.sel == 1) {
        $('#chkSelect').bootstrapToggle('on');
        chkSelect.checked = true;
    } else {
        $('#chkSelect').bootstrapToggle('off');
        chkSelect.checked = false;
    }
    if (privilege.ins == 1) {
        $('#chkInsert').bootstrapToggle('on');
        chkInsert.checked = true;
    } else {
        $('#chkInsert').bootstrapToggle('off');
        chkInsert.checked = false;
    }
    if (privilege.upd == 1) {
        $('#chkUpdate').bootstrapToggle('on');
        chkUpdate.checked = true;
    } else {
        $('#chkUpdate').bootstrapToggle('off');
        chkUpdate.checked = false;
    }
    if (privilege.del == 1) {
        $('#chkDelete').bootstrapToggle('on');
        chkDelete.checked = true;
    } else {
        $('#chkDelete').bootstrapToggle('off');
        chkDelete.checked = false;
    }

    disableButtons(true, false, false);
    setStyle(validF);
    privilege.sel == 1 ? validF(chkSelect) : initialF(chkSelect);
    privilege.ins == 1 ? validF(chkInsert) : initialF(chkInsert);
    privilege.upd == 1 ? validF(chkUpdate) : initialF(chkUpdate);
    privilege.del == 1 ? validF(chkDelete) : initialF(chkDelete);

    $('#addPrivilegeModal').modal('show');

}

function getUpdates() {

    var updates = "";

    if (privilege != null && oldprivilege != null) {

        if (privilege.sel != oldprivilege.sel)
            updates = updates + "\nSelect is Changed";

        if (privilege.ins != oldprivilege.ins)
            updates = updates + "\nInsert is Changed";

        if (privilege.upd != oldprivilege.upd)
            updates = updates + "\nUpdate is Changed";

        if (privilege.del != oldprivilege.del)
            updates = updates + "\nDelete is Changed";
    }

    return updates;

}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == ""){
            swal({
                title: 'Nothing to update...', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        }else {
            swal({
                title: "Are you sure to update following privileges details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: ["Cancel", "Update"], dangerMode: true,
            }).then((yesupdate) => {
                if (yesupdate) {
                    var response = httpRequest("/privilege", "PUT", privilege);
                    if (response == "0") {
                        swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Update Successfully...!',
                            text: '\n',
                            button: false,
                            timer: 2000
                        });
                        loadSearchedTable(update);
                        $('#addPrivilegeModal').modal('hide');
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
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true
        });

}

function btnDeleteMC(priv) {
    privilege = JSON.parse(JSON.stringify(priv));
    privilege.sel = 0;
    privilege.ins = 0;
    privilege.upd = 0;
    privilege.del = 0;

    swal({
        title: "Are you sure to delete following patient...?",
        text: "\n Role : " + privilege.roleId.role + "\nModule : " + privilege.moduleId.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/privilege", "DELETE", privilege);
            if (response == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n All Permissions are reworked",
                    icon: "success", button: false, timer: 2000,
                });
                loadSearchedTable();
            } else {
                swal({
                    title: "You have following erros....!",
                    text: "\n\n" + response,
                    icon: "error", button: true,
                });
            }
        }
    });

}


function printRow(priv) {
    privilege = JSON.parse(JSON.stringify(priv));
}

//Set the Query & Pass to LoadTable
function loadSearchedTable(color = null) {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);

    if (color != null) {
        loadTable(activepage, cmbPageSize.value, query, color); //call loadTable passing the query

    } else {
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


function btnPrintTableMC() {

    var newwindow = window.open();
    formattab = tblPrevilage.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='/vendor/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px; '> <h1>Privilege Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    //Stop loading the document after time interval and auto open print
    setTimeout(function () {
        newwindow.print();
    }, 100);
}
