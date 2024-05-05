window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    //Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    //EventListeners
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    cmbCustomerType.addEventListener("change", cmbCustomerTypeCH);
    txtSearchName.addEventListener("keyup", btnSearchMC);

    //Request Privileges
    privileges = httpRequest("../privilege?module=CUSTOMER", "GET");

    //Request Lists for Combo box
    customer_statuses = httpRequest("../customer_status/list", "GET");
    customer_types = httpRequest("../customer_type/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    //Colors
    active = "#72b3c0";

    // Refresh View & Form
    loadView();
    loadForm();
}

//Set Attributes to Initial on Table Load
function loadView() {

    //Table Search Area
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    // loadTable method parameters -loadTable (page,size,search)
    loadTable(1, cmbPageSize.value, query); // loadTable (page,size,search)
}

//Load Table & Fill Data
function loadTable(page, size, query) {
    page = page - 1;

    customers = new Array(); //customers list
    var data = httpRequest("/customer/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) customers = data.content; //json

    createPagination('pagination', data.totalPages, data.number + 1, paginate); //json

    // FillTable method parameters - fillTable(table_id, data_list, fill(), delete(), view())
    fillTable('tblCustomer', customers, fillForm, btnDeleteMC, viewitem); //fill the table with customer list
    clearSelection(tblCustomer); //clear any selected row
    if (activerowno != "") selectRow(tblCustomer, activerowno, active); //select row if any & color
}

function paginate(page) {
    var paginate;
    if (oldCustomer == null) {
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
function viewitem(ctm, rowno) {

    customer = JSON.parse(JSON.stringify(ctm));

    //Assign attribute values to each row
    tdReg.innerHTML = customer.register_no;
    tdPoints.innerHTML = customer.points;
    tdNotes.innerHTML = customer.notes;
    tdStatus.innerHTML = customer.customer_status_id.name;
    tdAddedDate.innerHTML = customer.added_date;
    tdType.innerHTML = customer.customer_type_id.name;

    if (customer.customer_type_id.name == "Individual") {
        tdName.innerHTML = customer.first_name + " " + customer.last_name;
        tdEmail.innerHTML = customer.email;
        tdContacts.innerHTML = customer.phone;
    } else if (customer.customer_type_id.name == "Company") {
        tdName.innerHTML = customer.company_name;
        tdEmail.innerHTML = customer.company_email;

        if (customer.contact_person_phone != null) {
            tdContacts.innerHTML = customer.company_phone + "</br>" + customer.contact_person_phone + "(Contact Person)";
        } else {
            tdContacts.innerHTML = customer.company_phone;
        }
    }

    $('#dataViewModal').modal('show'); //jquery to view modal (bootstrap docs):
}

//Print Row
function btnPrintRowMC() {
    var format = printformtable.outerHTML; //outerHTML: Structure of printformtable

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
        "<link rel=\'stylesheet\' href=\'../vendor/bootstrap/css/bootstrap.min.css\'></head>" + // use '' in ""
        "<body><div style='margin-top: 50px'><h1>Customer Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        // newwindow.close();
    }, 100);
}

function cmbCustomerTypeCH() {
    if (customer.customer_type_id.name == "Individual") {
        divIndividual.style.display = "block";
        divCompany.style.display = "none";

    } else {
        divCompany.style.display = "block";
        divIndividual.style.display = "none";

    }
    //clear selections
    if(oldCustomer == null){
    txtNotes.value = "";
    initialF(txtNotes);
    }
}

//Load Initial Form
function loadForm() {
    customer = new Object();
    oldCustomer = null; //for comparison on update

    //Bind next reg no
    var customerObj = httpRequest("../customer/customer_reg_no", "GET");
    txtRegisterNo.value = customerObj.register_no;
    txtRegisterNo.disabled = true;
    validF(txtRegisterNo);

    // Fill data into combo box
    // fillCombo method parameters - fillCombo (field id, message, data list, display property, selected value)
    fillCombo(cmbCustomerType, "Select Customer Type", customer_types, "name", "");

    // combo Auto Selected
    fillCombo(cmbCustomerStatus, "", customer_statuses, "name", "Available");
    fillCombo(cmbAddedBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    // Bind manually
    customer.register_no = txtRegisterNo.value;
    customer.customer_status_id = JSON.parse(cmbCustomerStatus.value); // JSON.parse: Convert Json to javascript because when value fill in to combo box it fill as a json string //"item_status_id"copied from Item Model
    cmbCustomerStatus.disabled = true; //make system user unable to select

    customer.employee_id = JSON.parse(cmbAddedBy.value);
    cmbAddedBy.disabled = true;

    dteAddedDate.value = getCurrentDateTime('date'); //calling date&time function
    customer.added_date = dteAddedDate.value;
    dteAddedDate.disabled = true;
    txtFirstName.value = "";
    txtLastName.value = "";
    txtNIC.value = "";
    txtAddress.value = "";
    txtPhone.value = "";
    txtEmail.value = "";
    txtNotes.value = "";
    txtCompanyName.value = "";
    txtCompanyAddress.value = "";
    txtCompanyEmail.value = "";
    txtCompanyPhone.value = "";
    txtContactPersonName.value = "";
    txtContactPersonPhone.value = "";

    setStyle(initialF);
    validF(cmbCustomerStatus);
    validF(dteAddedDate);
    validF(cmbAddedBy);
    disableButtons(false, true, true);
}

//Change Color of Attributes
function setStyle(style) {
    style(txtFirstName);
    style(txtLastName);
    style(txtNIC);
    style(txtAddress);
    style(txtPhone);
    style(txtEmail);
    style(txtNotes);
    style(cmbCustomerType);
    style(txtCompanyName);
    style(txtCompanyAddress);
    style(txtCompanyEmail);
    style(txtCompanyPhone);
    style(txtContactPersonName);
    style(txtContactPersonPhone);
    style(cmbCustomerStatus);
    style(cmbAddedBy);
    style(dteAddedDate);
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
    for (index in customers) {
        if (customers[index].customer_status_id.name == "Deleted") {
            tblCustomer.children[1].children[index].style.color = "#f03e3e"; //change row color
            tblCustomer.children[1].children[index].style.cursor = "not-allowed";
            tblCustomer.children[1].children[index].lastChild.children[2].disabled = true; //disable delete btn // Table Body->Row->Last Column->Delete Button
            tblCustomer.children[1].children[index].lastChild.children[2].style.cursor = "not-allowed"; //cursor not allowed

        }
    }

}

//Get Errors of Required Fields
function getErrors() {

    var errors = "";
    addvalue = ""; // if value = 1 ask for confirmation on Clear

    //check errors by bind item property value
    if (customer.register_no == null) {
        invalidF(txtRegisterNo);
        errors = errors + "\n" + "Customer ID Not Entered.";
    } else addvalue = 1;

    if (customer.customer_type_id == null) {
        invalidF(cmbCustomerType);
        errors = errors + "\n" + "Customer Type Not Selected.";
    } else {
        addvalue = 1;

        //Individual
        if (customer.customer_type_id.name == "Individual") {
            if (customer.first_name == null) {
                invalidF(txtFirstName);
                txtFirstName.focus();
                errors = errors + "\n" + "First Name Not Entered.";
            } else addvalue = 1;

            if (customer.last_name == null) {
                invalidF(txtLastName);
                txtLastName.focus();
                errors = errors + "\n" + "Last Name Not Entered.";
            } else addvalue = 1;

            if (customer.phone == null) {
                invalidF(txtPhone);
                txtPhone.focus();
                errors = errors + "\n" + "Phone Number Not Entered.";
            } else addvalue = 1;

            if (customer.address == null) {
                invalidF(txtAddress);
                txtAddress.focus();
                errors = errors + "\n" + "Address Not Entered.";
            } else addvalue = 1;

        } else if (customer.customer_type_id.name == "Company") {

            //Company
            if (customer.company_name == null) {
                invalidF(txtCompanyName);
                txtCompanyName.focus();
                errors = errors + "\n" + "Company Name Not Entered.";
            } else addvalue = 1;

            if (customer.company_phone == null) {
                invalidF(txtCompanyPhone);
                txtCompanyPhone.focus();
                errors = errors + "\n" + "Company Phone Not Entered.";
            } else addvalue = 1;

            if (customer.company_address == null) {
                invalidF(txtCompanyAddress);
                txtCompanyAddress.focus();
                errors = errors + "\n" + "Company Address Not Entered.";
            } else addvalue = 1;

        }
    }

    if (customer.added_date == null) {
        invalidF(dteAddedDate);
        errors = errors + "\n" + "Added Date Not Entered.";
    } /*else addvalue = 1;*/

    if (customer.customer_status_id == null) {
        invalidF(cmbCustomerStatus);
        errors = errors + "\n" + "Customer Status Not Selected.";
    } /*else addvalue = 1;*/

    return errors;
}

//Button Add - Get confirmation on optional empty fields
function btnAddMC() {
    if (getErrors() == "") {
        if (customer.customer_type_id.name == "Individual" && (txtEmail.value == "" || txtNIC.value == "") || customer.customer_type_id.name == "Company" && (txtCompanyEmail.value == "" || txtContactPersonName.value == "" || txtContactPersonPhone.value == "")) {
            swal({
                title: "Are you sure to continue...?",
                text: "Form has some empty fields.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
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

    if (customer.customer_type_id.name == "Individual") {
        swal({
            title: "Are you sure to add following customer...?",
            text: "\nCustomer ID : " + customer.register_no +
                "\nFirst Name : " + customer.first_name +
                "\nLast Name : " + customer.last_name +
                "\nAddress : " + customer.address +
                "\nPhone : " + customer.phone +
                "\nEmail : " + customer.email +
                "\nNIC : " + customer.nic +
                "\ncustomer Status : " + customer.customer_status_id.name +
                "\nAdded Date : " + customer.added_date,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((save) => { //then: if user click 'Yes' then
            if (save) {
                var response = httpRequest("/customer", "POST", customer);//Post: because it's a Add
                if (response == "0") { //message 0: means successful
                    swal({
                        position: 'center',
                        icon: 'success',
                        title: 'Your work has been Done \n Save SuccessFully..!',
                        text: '\n',
                        button: false,
                        timer: 3200
                    });
                    activepage = 1;
                    activerowno = 1; //1: highlight added row which is 1 row
                    loadSearchedTable();
                    $('#addCustomerModal').modal('hide');
                    loadForm();
                } else swal({
                    title: 'Save not Success... , You have following errors', icon: "error",
                    text: '\n ' + response,
                    button: true
                });
            }
        });
    } else if (customer.customer_type_id.name == "Company") {
        swal({
            title: "Are you sure to add following customer...?",
            text: "\nCustomer ID : " + customer.register_no +
                "\nCompany Name : " + customer.company_name +
                "\nCompany Phone : " + customer.company_phone +
                "\nCompany Email : " + customer.company_email +
                "\nContact Person Name : " + customer.contact_person_name +
                "\nContact Person Phone : " + customer.contact_person_phone +
                "\nCompany Address : " + customer.company_address +
                "\ncustomer Status : " + customer.customer_status_id.name +
                "\nAdded Date : " + customer.added_date,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((save) => {
            if (save) {
                var response = httpRequest("/customer", "POST", customer);
                if (response == "0") { //0: successful
                    swal({
                        position: 'center',
                        icon: 'success',
                        title: 'Your work has been Done \n Save SuccessFully..!',
                        text: '\n',
                        button: false,
                        timer: 1200
                    });
                    activepage = 1;
                    activerowno = 1; //highlight row 1 (added row)
                    loadSearchedTable();
                    $('#addCustomerModal').modal('hide');
                    loadForm();
                } else swal({
                    title: 'Save not Success... , You have following errors', icon: "error",
                    text: '\n ' + response,
                    button: true
                });
            }
        });
    }
}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldCustomer == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
            }
        });
    }
}

//Fill Form - Get confirmation on second time update
function fillForm(ctm, rowno) {
    activerowno = rowno;

    if (oldCustomer == null) { //check if previous attempt to update (value assign to oldCustomer only when fill_data() called.)
        filldata(ctm);
    } else {
        swal({
            title: "Previous attempt to update the form has not submitted... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: ["Cancel", "Discard"], dangerMode: true,
        }).then((yesUpdate) => {
            if (yesUpdate) {
                filldata(ctm);
            }

        });
    }
}

//Fill Data on Update
function filldata(ctm) {
    clearSelection(tblCustomer);
    // selectRow(tblCustomer, activerowno, active); //color row

    customer = JSON.parse(JSON.stringify(ctm));// parse to prevent referring to same object & data is in table row format
    oldCustomer = JSON.parse(JSON.stringify(ctm));

   //Bind object's value to fields
    txtRegisterNo.value = customer.register_no;
    txtFirstName.value = customer.first_name;
    txtLastName.value = customer.last_name;
    txtNIC.value = customer.nic;
    txtAddress.value = customer.address;
    txtPhone.value = customer.phone;
    txtEmail.value = customer.email;
    txtCompanyName.value = customer.company_name;
    txtCompanyAddress.value = customer.company_address;
    txtCompanyEmail.value = customer.company_email;
    txtCompanyPhone.value = customer.company_phone;
    txtContactPersonName.value = customer.contact_person_name;
    txtContactPersonPhone.value = customer.contact_person_phone;
    txtNotes.value = customer.notes;
    dteAddedDate.value = customer.added_date;

    // Fill data into combo box from object
    // fillCombo method parameters -  fillCombo(field id, message, data list, display property, selected value)
    fillCombo(cmbCustomerType, "Select Customer Type", customer_types, "name", customer.customer_type_id.name);
    cmbCustomerType.disabled = true;
    fillCombo(cmbCustomerStatus, "", customer_statuses, "name", customer.customer_status_id.name);
    cmbCustomerStatus.disabled = false;

    divCustomerStatus.style.display = "block";

    disableButtons(true, false, false);
    setStyle(validF);
    $('#addCustomerModal').modal('show');
    cmbCustomerTypeCH();

    //Set optional field border color to initial if null
    if (customer.email == null)
    initialF(txtEmail);

    if (customer.nic == null)
    initialF(txtNIC);

    if (customer.notes == null)
    initialF(txtNotes);

    if (customer.company_email == null)
    initialF(txtCompanyEmail);

    if (customer.contact_person_name == null)
    initialF(txtContactPersonName);

    if (customer.contact_person_phone == null)
    initialF(txtContactPersonPhone);
}

//Check for Updated Values
function getUpdates() {

    var updates = "";

    if (customer != null && oldCustomer != null) {

        if (customer.register_no != oldCustomer.register_no)
            updates = updates + "\nCustomer ID is Changed: " + oldCustomer.register_no + " --> " + customer.register_no;

        if (customer.first_name != oldCustomer.first_name)
            updates = updates + "\nFirst Name is Changed: " + oldCustomer.first_name + " --> " + customer.first_name;

        if (customer.last_name != oldCustomer.last_name)
            updates = updates + "\nLast Name is Changed: " + oldCustomer.last_name + " --> " + customer.last_name;

        if (customer.phone != oldCustomer.phone)
            updates = updates + "\nPhone Number is Changed: " + oldCustomer.phone + " --> " + customer.phone;

        if (customer.email != oldCustomer.email)
            updates = updates + "\nEmail is Changed: " + oldCustomer.email + " --> " + customer.email;

        if (customer.nic != oldCustomer.nic)
            updates = updates + "\nNIC is Changed: " + oldCustomer.nic + " --> " + customer.nic;

        if (customer.address != oldCustomer.address)
            updates = updates + "\nAddress is Changed: " + oldCustomer.address + " --> " + customer.address;

        if (customer.company_name != oldCustomer.company_name)
            updates = updates + "\nCompany Name is Changed: " + oldCustomer.company_name + " --> " + customer.company_name;

        if (customer.company_phone != oldCustomer.company_phone)
            updates = updates + "\nCompany Phone is Changed: " + oldCustomer.company_phone + " --> " + customer.company_phone;

        if (customer.contact_person_name != oldCustomer.contact_person_name)
            updates = updates + "\nContact Person Name is Changed: " + oldCustomer.contact_person_name + " --> " + customer.contact_person_name;

        if (customer.contact_person_phone != oldCustomer.contact_person_phone)
            updates = updates + "\nContact Person Phone is Changed: " + oldCustomer.contact_person_phone + " --> " + customer.contact_person_phone;

        if (customer.company_address != oldCustomer.company_address)
            updates = updates + "\nCompany Address is Changed: " + oldCustomer.company_address + " --> " + customer.company_address;

        if (customer.notes != oldCustomer.notes)
            updates = updates + "\nNotes is Changed: " + oldCustomer.notes + " --> " + customer.notes;

        if (customer.added_date != oldCustomer.added_date)
            updates = updates + "\nAdded Date is Changed: " + oldCustomer.added_date + " --> " + customer.added_date;

        if (customer.customer_status_id.name != oldCustomer.customer_status_id.name)
            updates = updates + "\nCustomer Status is Changed: " + oldCustomer.customer_status_id.name + " --> " + customer.customer_status_id.name;

        if (customer.employee_id.callingname != oldCustomer.employee_id.callingname)
            updates = updates + "\nAdded By is Changed: " + oldCustomer.employee_id.callingname + " --> " + customer.employee_id.callingname;
    }

    return updates;

}

//Get confirmation & Update
function btnUpdateMC() {
    if (getErrors() == "") {
        if (getUpdates() == "") {
            swal({
                title: 'Nothing to update..', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        } else {
            swal({
                title: "Are you sure to update following customer details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: ["Cancel", "Update"], dangerMode: true,
            })
                .then((yesUpdate) => {
                    if (yesUpdate) {
                        var response = httpRequest("/customer", "PUT", customer);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Updated Successfully..!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            loadSearchedTable();
                            $('#addCustomerModal').modal('hide');
                            loadForm();
                        } else swal({
                            title: 'Failed to update...', icon: "error",
                            text: 'You have following error ' + response,
                            button: true
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

function btnDeleteMC(ctm) {
    customer = JSON.parse(JSON.stringify(ctm));

    if (customer.customer_type_id.name == "Individual") {
        swal({
            title: "Are you sure to delete following customer...?",
            text: "\n Customer ID : " + customer.register_no +
                "\n Customer Name : " + customer.first_name + " " + customer.last_name,
            icon: "warning", buttons: ["Cancel", "Delete"], closeOnClickOutside: false, dangerMode: true,

        }).then((willDelete) => {
            if (willDelete) {
                var responce = httpRequest("/customer", "DELETE", customer);
                if (responce == 0) {
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
    } else if (customer.customer_type_id.name == "Company") {
        swal({
            title: "Are you sure to delete following customer...?",
            text: "\n Customer ID : " + customer.register_no +
                "\n Customer Name : " + customer.company_name,
            icon: "warning", buttons: ["Cancel", "Delete"], closeOnClickOutside: false, dangerMode: true,

        }).then((willDelete) => {
            if (willDelete) {
                var responce = httpRequest("/customer", "DELETE", customer);
                if (responce == 0) {
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


}
//Set the Query & Pass to LoadTable
function loadSearchedTable() {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    loadTable(activepage, cmbPageSize.value, query); //call loadTable passing the query
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

//Print Table
function btnPrintTableMC() {

    var newwindow = window.open(); //open new window
    formattab = tblCustomer.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='/vendor/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 50px; '> <h1>Customer Details : </h1></div>" +
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
    fillTable('tblCustomer', customers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblCustomer);
    loadForm();

    if (activerowno != "") selectRow(tblCustomer, activerowno, active);


}