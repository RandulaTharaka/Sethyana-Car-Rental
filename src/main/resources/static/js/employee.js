window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    //Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Enable Select2
    // $('.js-example-basic-single').select2();

    //EventListeners
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    dteDOBirth.onchange = dteDOBirthCH;
    txtSearchName.addEventListener("keyup", btnSearchMC);

    //Request Privileges
    privileges = httpRequest("../privilege?module=EMPLOYEE", "GET");

    genders = httpRequest("../gender/list", "GET");
    designations = httpRequest("../designation/list", "GET");
    civilstatuses = httpRequest("../civilstatus/list", "GET");
    employeestatuses = httpRequest("../employeestatus/list", "GET");

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
    txtSearchName.style.background = "";

    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    //loadTable (page,size,search)
    loadTable(1, cmbPageSize.value, query);
}

//Load Table & Fill Data
function loadTable(page, size, query, color = null) {
    page = page - 1;

    employees = new Array();
    var data = httpRequest("/employee/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) employees = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblEmployee', employees, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblEmployee);

    if (color != null) {
        if (activerowno != "") selectRow(tblEmployee, activerowno, color); //select row if any & color
    } else {
        if (activerowno != "") selectRow(tblEmployee, activerowno, active); //select row if any & color
    }

}

function paginate(page) {
    var paginate;
    if (oldemployee == null) {
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
        loadForm();
        loadSearchedTable();
    }

}

//View Row Details (Print)
function viewitem(emp, rowno) {

    employee = JSON.parse(JSON.stringify(emp));

    //Assign attribute values to each row

    tdnum.setAttribute('value', employee.number);
    tdfname.innerHTML = employee.fullname;
    tdcname.innerHTML = employee.callingname;
    tddob.innerHTML = employee.dobirth;
    tdnic.innerHTML = employee.nic;
    tdaddress.innerHTML = employee.address;
    tdmobile.innerHTML = employee.mobile;
    tdland.innerHTML = employee.land;
    tdasdate.innerHTML = employee.doassignment;
    tddesc.innerHTML = employee.description;
    if (employee.photo == null)
        tdphoto.src = 'resourse/image/no_image.png';
    else
        tdphoto.src = atob(employee.photo);
    tddesg.innerHTML = employee.designationId.name;
    tdcvstatus.innerHTML = employee.civilstatusId.name;
    tdgender.innerHTML = employee.genderId.name;
    tdestatus.innerHTML = employee.employeestatusId.name;

    $('#dataViewModal').modal('show');
}

//Print Row
function btnPrintRowMC() {
    var format = printformtable.outerHTML; //outerHTML: Structure of printformtable

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
        "<link rel=\'stylesheet\' href=\'../vendor/bootstrap/css/bootstrap2.min.css\'></head>" + // use '' in ""
        "<body><div style='margin-top: 40px'><h2 class='mb-4 text-center text-secondary'>Employee Details</h2></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        // newwindow.close();
    }, 100);
}


//Load Initial Form
function loadForm() {

    employee = new Object();
    oldemployee = null;

    fillCombo(cmbGender, "Select Gender", genders, "name", "");
    fillCombo(cmbDesignation, "Select Designation", designations, "name", "");
    fillCombo(cmbCivilstatus, "Select Civil Status", civilstatuses, "name", "");

    fillCombo(cmbEmployeestatus, "", employeestatuses, "name", "Working");
    employee.employeestatusId = JSON.parse(cmbEmployeestatus.value);
    cmbEmployeestatus.disabled = true;


    var today = new Date();
    var month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var date = today.getDate();
    if (date < 10) date = "0" + date;

    dteDOAssignment.value = today.getFullYear() + "-" + month + "-" + date;
    employee.doassignment = dteDOAssignment.value;
    dteDOAssignment.disabled = true;

    // Get Next Number Form Data Base
    var nextNumber = httpRequest("/employee/nextNumber", "GET");
    txtNumber.value = nextNumber.number;
    employee.number = txtNumber.value;
    txtNumber.disabled = "disabled";

    txtFullname.value = "";
    txtCallingname.value = "";
    dteDOBirth.value = "";
    txtNIC.value = "";
    txtAddress.value = "";
    txtMobile.value = "";
    txtLand.value = "";

    txtDescription.value = "";
    removeFile('flePhoto');

    setStyle(initialF);

    validF(cmbEmployeestatus);
    validF(dteDOAssignment);
    validF(txtNumber);

    disableButtons(false, true, true);

}


//Change Color of Attributes
function setStyle(style) {
    style(txtNumber);
    style(txtFullname);
    style(txtCallingname);
    style(cmbGender);
    style(cmbCivilstatus);
    style(txtNIC);
    style(dteDOBirth);
    style(txtAddress);
    style(txtMobile);
    style(txtLand);
    style(cmbDesignation);
    style(dteDOAssignment);
    style(txtDescription);
    style(cmbEmployeestatus);
}

//Disable Buttons by privilege and status
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

    // select deleted data row
    for (index in employees) {
        if (employees[index].employeestatusId.name == "Deleted") {
            tblEmployee.children[1].children[index].style.color = "#f00";
            tblEmployee.children[1].children[index].style.cursor = "not-allowed";
            tblEmployee.children[1].children[index].lastChild.children[2].disabled = true;
            tblEmployee.children[1].children[index].lastChild.children[2].style.cursor = "not-allowed";

        }
    }
}

function nicTestFieldBinder(field, pattern, ob, prop, oldob) {
    var regpattern = new RegExp(pattern);

    var val = field.value.trim();
    if (regpattern.test(val)) {
        var dobyear, gendername, noOfDays = "";
        if (val.length === 10) {
            dobyear = "19" + val.substring(0, 2);
            noOfDays = val.substring(2, 5);
        } else {
            dobyear = val.substring(0, 4);
            noOfDays = val.substring(4, 7);
        }
        birthdate = new Date(dobyear + "-" + "01-01");
        if (noOfDays >= 1 && noOfDays <= 366) {
            gendername = "Male";
        } else if (noOfDays >= 501 && noOfDays <= 866) {
            noOfDays = noOfDays - 500;
            gendername = "Female";
        }
        if (gendername === "Female" || gendername === "Male") {
            fillCombo(cmbGender, "Select Gender", genders, "name", gendername);
            birthdate.setDate(birthdate.getDate() + parseInt(noOfDays) - 1)
            dteDOBirth.value = birthdate.getFullYear() + "-" + getmonthdate(birthdate);

            employee.genderId = JSON.parse(cmbGender.value);
            employee.dobirth = dteDOBirth.value;
            employee.nic = field.value;
            if (oldemployee != null && oldemployee.nic != employee.nic) {
                updateF(field);
            } else {
                validF(field);

            }
            if (oldemployee != null && oldemployee.dobirth != employee.dobirth) {
                updateF(dteDOBirth);
            } else {
                validF(dteDOBirth);

            }
            if (oldemployee != null && oldemployee.genderId.name != employee.genderId.name) {
                updateF(cmbGender);
            } else {
                validF(cmbGender);
            }
            dteDOBirthCH();
        } else {
            invalidF(field);
            initialF(cmbGender);
            initialF(dteDOBirth);
            fillCombo(cmbGender, "Select Gender", genders, "name", "");
            dteDOBirth.value = "";
            employee.nic = null;
        }
    } else {
        invalidF(field);
        employee.nic = null;
    }

}

function nicFieldBinder(field,pattern,ob,prop,oldob) {
    var regpattern = new RegExp(pattern);

    var val = field.value.trim();
    if (regpattern.test(val)) {
        employee.nic = val;
        if (oldemployee != null && oldemployee.nic != employee.nic){
            updateF(field);
            gender = generate(val,field,cmbGender,dteDOBirth);
            fillCombo(cmbGender,"Select Gender",genders,"name",gender);
            updateF(cmbGender);
            updateF(dteDOBirth);

            employee.genderId = JSON.parse(cmbGender.value);
            employee.dobirth = dteDOBirth.value;
        }else{
            validF(field);
            gender =  generate(val,field,cmbGender,dteDOBirth);
            fillCombo(cmbGender,"Select Gender",genders,"name",gender);
            validF(cmbGender);
            validF(dteDOBirth);
            employee.genderId = JSON.parse(cmbGender.value);
            employee.dobirth = dteDOBirth.value;
        }
    }
    else {
        invalidF(field);
        employee.nic = null;
    }
}

function dteDOBirthCH() {
    var today = new Date();
    var birthday = new Date(dteDOBirth.value);
    if((today.getTime()-birthday.getTime())>(18*365*24*3600*1000)) {
        employee.dobirth = dteDOBirth.value;
        validF(dteDOBirth);
    }
    else{
        employee.dobirth = null;
        invalidF(dteDOBirth);
    }
}


//Get Errors of Required Fields
function getErrors() {

    var errors = "";
    addvalue = ""; // if value = 1 ask for confirmation on Clear

    // check errors by the bound item property value
    if (employee.fullname == null)
        errors = errors + "\n" + "Employee Full Name Not Enter";
    else  addvalue = 1;

    if (employee.nic == null)
        errors = errors + "\n" + "Employee nic Enter";
    else  addvalue = 1;

    if (employee.callingname == null)
        errors = errors + "\n" + "Employee Calling Name Enter";
    else  addvalue = 1;

    if (employee.genderId == null)
        errors = errors + "\n" + "Gender Not Selected";
    else  addvalue = 1;

    if (employee.civilstatusId == null)
        errors = errors + "\n" + "Civilstatus Not Selected";
    else  addvalue = 1;

    if (employee.dobirth == null)
        errors = errors + "\n" + "Birth Date Invalid";
    else  addvalue = 1;

    if (employee.address == null)
        errors = errors + "\n" + "Employee Address Not Enter";
    else  addvalue = 1;

    if (employee.mobile == null)
        errors = errors + "\n" + "Employee Mobile number Not Enter";
    else  addvalue = 1;

    if (employee.designationId == null)
        errors = errors + "\n" + "Designation Not Selected";
    else  addvalue = 1;

    return errors;

}


//Button Add - Get confirmation on optional empty fields
function btnAddMC() {

    if (getErrors() == "") {
        if (txtLand.value=="" || txtDescription.value =="") {
            swal({
                title: "Are you sure to continue...?",
                text: "Form has some empty fields.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((ok) => {
                if (ok) {
                    savedata();
                }
            });

        } else {
            savedata();
        }
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

//Get Confirmation & Add
function savedata() {

    swal({
        title: "Are you sure to add following empolyee...?" ,
        text :  "\nNumber : " + employee.number +
            "\nFull Name : " + employee.fullname +
            "\nCalling Name : " + employee.callingname +
            "\nNIC : " + employee.nic +
            "\nBirth Date : " + employee.dobirth +
            "\nPhoto : " + employee.photoname +
            "\nAddress : " + employee.address +
            "\nMobile : " + employee.mobile +
            "\nLand : " + employee.land +
            "\nAssignment Date : " + employee.doassignment +
            "\nDescription : " + employee.description +
            "\nEmployee Status : " + employee.employeestatusId.name,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((save) => {
        if (save) {
            var response = httpRequest("/employee", "POST", employee);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Save SuccessFully..!',
                    text: '\n',
                    button: false,
                    timer: 2000
                });
                activepage = 1;
                activerowno = 1;
                loadSearchedTable();
                loadForm();
                $('#addEmployeeModal').modal('hide');
            }
            else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if(oldemployee == null && addvalue == ""){
        loadForm();
    }else{
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n" ,
            icon: "warning", buttons: true, dangerMode: true,
        }).then((discard) => {
            if (discard) {
                loadForm();
            }

        });
    }

}

//Fill Form - Get confirmation on second time update
function fillForm(emp, rowno) {
    activerowno = rowno;

    if (oldemployee == null) { //check if previous attempt to update (value assign to oldCustomer only when fill_data() called.)
        filldata(emp);
    } else {
        swal({
            title: "Previous attempt to update the form has not submitted... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: ["Cancel", "Discard"], dangerMode: true,
        }).then((yesUpdate) => {
            if (yesUpdate) {
                filldata(emp);
            }

        });
    }
}


//Fill Data on Update
function filldata(emp) {
    clearSelection(tblEmployee);
    selectRow(tblEmployee,activepage,active);

    employee = JSON.parse(JSON.stringify(emp));
    oldemployee = JSON.parse(JSON.stringify(emp));

    txtNumber.value = employee.number;
    txtNumber.disabled="disabled";
    txtFullname.value = employee.fullname;
    txtCallingname.value = employee.callingname;
    dteDOBirth.value = employee.dobirth;
    txtNIC.value = employee.nic;
    txtAddress.value = employee.address;
    txtMobile.value = employee.mobile;
    dteDOAssignment.value = employee.doassignment;

    if(employee.description !== undefined){
        txtDescription.value = employee.description;
    }

    if(employee.land !== undefined){
        txtLand.value = employee.land;
    }

    fillCombo(cmbGender, "Select Gender", genders, "name", employee.genderId.name);
    fillCombo(cmbDesignation, "Select Designation", designations, "name", employee.designationId.name);
    fillCombo(cmbCivilstatus, "Select Civil Status", civilstatuses, "name", employee.civilstatusId.name);
    fillCombo(cmbEmployeestatus, "", employeestatuses, "name", employee.employeestatusId.name);
    divEmployeestatus.style.display = "block";

    setDefaultFile('flePhoto', employee.photo);

    disableButtons(true, false, false);
    setStyle(validF);
    $('#addEmployeeModal').modal('show');
}

//Check for Updated Values
function getUpdates() {

    var updates = "";

    if(employee!=null && oldemployee!=null) {

        if (employee.number != oldemployee.number)
            updates = updates + "\nNumber is Changed";

        if (employee.fullname != oldemployee.fullname)
            updates = updates + "\nFullname is Changed";

        if (employee.nic != oldemployee.nic)
            updates = updates + "\nNIC is Changed";

        if (employee.callingname != oldemployee.callingname)
            updates = updates + "\nCallingname is Changed";

        if (employee.genderId.name != oldemployee.genderId.name)
            updates = updates + "\nGender is Changed";

        if (employee.civilstatusId.name != oldemployee.civilstatusId.name)
            updates = updates + "\nCivilstatus is Changed";

        if (employee.dobirth != oldemployee.dobirth)
            updates = updates + "\nDate of Birth is Changed";

        if (employee.photo != oldemployee.photo)
            updates = updates + "\nPhoto is Changed";

        if (employee.address != oldemployee.address)
            updates = updates + "\nAddress is Changed";

        if (employee.mobile != oldemployee.mobile)
            updates = updates + "\nMobile Number is Changed";

        if (employee.land != oldemployee.land)
            updates = updates + "\nLand Number is Changed";

        if (employee.designationId.name != oldemployee.designationId.name)
            updates = updates + "\nDesignation is Changed";

        if (employee.doassignment != oldemployee.doassignment)
            updates = updates + "\nDate of Assignment is Changed";


        if (employee.description != oldemployee.description)
            updates = updates + "\nDescription is Changed";

        if (employee.employeestatusId.name != oldemployee.employeestatusId.name)
            updates = updates + "\nEmployeestatus is Changed";
    }

    return updates;

}

//Get confirmation & Update
function btnUpdateMC() {

    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "")
            swal({
                title: 'Nothing Updated..!',icon: "warning",
                text: '\n',
                button: false,
                timer: 1200});
        else {
            swal({
                title: "Are you sure to update following employee details...?",
                text: "\n"+ getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/employee", "PUT", employee);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Update SuccessFully..!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            loadSearchedTable(update);
                            $('#addEmployeeModal').modal('hide');
                            loadForm();

                        }else swal({
                            title: 'Failed to update...', icon: "error",
                            text: 'You have following error ' + response,
                            button: true
                        });
                    }
                });
        }
    }
    else
        swal({
            title: 'You have following errors in your form',icon: "error",
            text: '\n '+getErrors(),
            button: true});

}

function btnDeleteMC(emp) {
    employee = JSON.parse(JSON.stringify(emp));

    swal({
        title: "Are you sure to delete following employee...?",
        text: "\n Employee Number : " + employee.number +
            "\n Employee Fullname : " + employee.fullname,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete)=> {
        if (willDelete) {
            var responce = httpRequest("/employee","DELETE",employee);
            if (responce==0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status change to delete",
                    icon: "success", button: false, timer: 1200,
                });
                loadSearchedTable();
                loadForm();
            } else {
                swal({
                    title: "You have following erros....!",
                    text: "\n\n" + responce,
                    icon: "error", button: true,
                });
            }
        }
    });

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
    //disable delete button
    disableButtons(false, true, true);

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(employee) {

    var newwindow = window.open(); //open new window
    formattab = tblEmployee.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='/vendor/bootstrap/css/bootstrap2.min.css'/></head>" +
        "<body><div style='margin-top: 40px; '> <h2 class='mb-4 text-center text-secondary'>Employees Details</h2></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    //Stop loading the document after time interval and auto open print
    setTimeout(function () {
        newwindow.print();
    }, 100);
}

function sortTable(cind) {
    cindex = cind;

    var cprop = tblEmployee.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        employees.sort(
            function (a, b) {
                if (a[cprop] < b[cprop]) {
                    return -1;
                } else if (a[cprop] > b[cprop]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    } else {
        employees.sort(
            function (a, b) {
                if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] < b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return -1;
                } else if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] > b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    }
    fillTable('tblEmployee', employees, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblEmployee);
    loadForm();

    if (activerowno != "") selectRow(tblEmployee, activerowno, active);
}


