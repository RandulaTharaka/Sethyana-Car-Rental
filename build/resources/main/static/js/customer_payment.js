window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    //Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    //EventListeners
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    txtSearchName.addEventListener("keyup", btnSearchMC);

    //Request Privileges
    privileges = httpRequest("../privilege?module=CUSTOMERPAYMENT", "GET");

    //Request Lists for Combo box
    customer_statuses = httpRequest("../customer_status/list", "GET");
    customer_types = httpRequest("../customer_type/list", "GET");
    employees = httpRequest("../employee/list", "GET");
    payment_statuses = httpRequest("../payment_status/list", "GET")

    //Colors
    active = "#72b3c0";
    update = "#f09456";
    select = "#b2b2b2";

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
    //loadTable method parameters - loadTable(page,size,search)
    loadTable(1, cmbPageSize.value, query);
}

//Load Table & Fill Data
function loadTable(page, size, query) {
    page = page - 1;

    customerPayments = new Array(); //customers list
    var data = httpRequest("/customer_payment/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) customerPayments = data.content; //json

    createPagination('pagination', data.totalPages, data.number + 1, paginate); //json

    //fillTable method parameters - fillTable(table_id, data_list, fill(), delete(), view())
    fillTable('tblCustomerPayment', customerPayments, fillForm, btnDeleteMC, viewitem); //fill the table with customer list
    clearSelection(tblCustomerPayment); //clear any selected row
    if (activerowno != "") selectRow(tblCustomerPayment, activerowno, active); //select row if any & color
}

function paginate(page) {
    var paginate;
    if (oldCustomerPayment == null) {
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
function viewitem(ctmPayment, rowno) {}

//Print Row
function btnPrintRowMC() {}


//Load Initial Form
function loadForm() {
    customerPayment = new Object();
    oldCustomerPayment = null; //for comparison on update

    disableButtons(false, false, true);
}

//Change Color of Attributes
function setStyle(style) {}

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
    for (index in customerPayment) {
        if (customerPayment[index].payment_status_id.name == "Deleted") {
            tblCustomerPayment.children[1].children[index].style.color = "#f03e3e"; //change row color
            tblCustomerPayment.children[1].children[index].style.cursor = "not-allowed";
            tblCustomerPayment.children[1].children[index].lastChild.children[2].disabled = true; //disable delete btn // Table Body->Row->Last Column->Delete Button
            tblCustomerPayment.children[1].children[index].lastChild.children[2].style.cursor = "not-allowed"; //cursor not allowed
        }
    }
}

//Get Errors of Required Fields
function getErrors() {}

//Button Add - Get confirmation on optional empty fields
function btnAddMC() {}

//Get Confirmation & Add
function savedata() {}

function btnClearMC() {}

//Fill Form - Get confirmation on second time update
function fillForm(ctmpay, rowno) {
    activerowno = rowno;

    if (oldCustomerPayment == null) { //check if previous attempt to update (value assign to oldCustomer only when fill_data() called.)
        filldata(ctmpay);
    }

    else {
        // swal({});
        filldata(ctmpay);
    }

}

//Fill Data on Update
function filldata(ctmpay) {
    clearSelection(tblCustomerPayment);
    selectRow(tblCustomerPayment, activerowno, select); //color row

    customerPayment = JSON.parse(JSON.stringify(ctmpay));// parse to prevent referring to same object & data is in table row format
    oldCustomerPayment = JSON.parse(JSON.stringify(ctmpay));

    // Set Common Details
    lblPaidTo.innerHTML = "Paid To";
    toggleDiv.innerHTML = "";
    divInvoiceNo.innerHTML = oldCustomerPayment.invoice_number;
    divReceivedDate.innerHTML = sqlDateTimeToLocalC(oldCustomerPayment.paid_date_time);
    divReservationType.innerHTML = oldCustomerPayment.reservation_type_id.name;
    divTotalPayable.innerHTML = 'Rs ' + parseFloat(oldCustomerPayment.total_payable).toFixed(2);
    divPaid.innerHTML = 'Rs ' + parseFloat(oldCustomerPayment.paid).toFixed(2);
    divDueBalance.innerHTML = 'Rs ' + parseFloat(oldCustomerPayment.due_balance).toFixed(2);

    // set toggle
    let toggleInput = '<input type="checkbox" id="chkPaymentReceived" required\n' +
        '                                                       data-toggle="toggle" data-on="Payment Received" data-off="Payment Not-Received"\n' +
        '                                                       data-onstyle="primary-active" data-offstyle="danger" data-width="90%" onchange="chkPaymentReceivedCH()">'

    // Set Chauffeur-Drive Details
    if(oldCustomerPayment.reservation_type_id.id ==1){
        divReservationNo.innerHTML = oldCustomerPayment.chauffeur_drive_reservation_id.cd_reservation_code;

        // set customer name
        if(oldCustomerPayment.chauffeur_drive_reservation_id.customer_id.customer_type_id.id === 1){ // Individual
            divPaidBy.innerHTML = oldCustomerPayment.chauffeur_drive_reservation_id.customer_id.first_name + " " + oldCustomerPayment.chauffeur_drive_reservation_id.customer_id.last_name;
        }else{ // Company
            divPaidBy.innerHTML = oldCustomerPayment.chauffeur_drive_reservation_id.customer_id.company_name;
        }

        // set paid by
        lblPaidTo.innerHTML += " (Driver)" ;
        divPaidTo.innerHTML = oldCustomerPayment.chauffeur_drive_reservation_id.driver_id.calling_name;

        toggleDiv.innerHTML = toggleInput;
        if(oldCustomerPayment.payment_status_id.id === 4){ // completed
            $('#chkPaymentReceived').bootstrapToggle('toggle');
            $('#chkPaymentReceived').bootstrapToggle('disable');
            toggleDiv.children[0].children[1].children[0].style.cursor = 'not-allowed';
            toggleDiv.children[0].children[1].children[2].style.cursor = 'not-allowed';

            btnUpdate.style.display = 'none';

        } else if(oldCustomerPayment.payment_status_id.id === 3){ // paid to driver
            $('#chkPaymentReceived').bootstrapToggle('off')

            btnUpdate.style.display = 'block';
        }

    // Set Self-Drive Details
    }else{
        divReservationNo.innerHTML = oldCustomerPayment.self_drive_reservation_id.sd_reservation_code;
        divPaidTo.innerHTML = oldCustomerPayment.employee_id.callingname;

        // set customer name
        if(oldCustomerPayment.self_drive_reservation_id.customer_id.customer_type_id.id === 1){ // Individual
            divPaidBy.innerHTML = oldCustomerPayment.self_drive_reservation_id.customer_id.first_name + " " + oldCustomerPayment.self_drive_reservation_id.customer_id.last_name;
        }else{ // Company
            divPaidBy.innerHTML = oldCustomerPayment.self_drive_reservation_id.customer_id.company_name;
        }

        toggleDiv.innerHTML = toggleInput;
        if(oldCustomerPayment.payment_status_id.id === 4 || oldCustomerPayment.payment_status_id.id === 2) { // completed & advance paid
            $('#chkPaymentReceived').bootstrapToggle('toggle');
            $('#chkPaymentReceived').bootstrapToggle('disable');
            toggleDiv.children[0].children[1].children[0].style.cursor = 'not-allowed';
            toggleDiv.children[0].children[1].children[2].style.cursor = 'not-allowed';
        }
        btnUpdate.style.display = 'none';
    }



    divChauffuerDriveRecord.style.display = "block";
    $('#addCustomerModal').modal('show');

}

function chkPaymentReceivedCH(){
    btnUpdate.removeAttribute("disabled");
    $('#btnUpdate').css('cursor', 'pointer');
}

//Check for Updated Values
function getUpdates() {

    var updates = "";

    return updates;

}

//Get confirmation & Update
function btnUpdateMC() {
    if(customerPayment.reservation_type_id.id ==1){
        if(chkPaymentReceived.checked !=true){
            swal({
                title: 'Make sure payment is received..', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        }else{
            customerPayment.payment_status_id = payment_statuses[3] ; //complete
            var response = httpRequest("/customer_payment", "PUT", customerPayment);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Done \n Updated Successfully..!',
                    text: '\n',
                    button: false,
                    timer: 1200
                });
                $('#addCustomerModal').modal('hide');
                loadSearchedTable();

            } else swal({
                title: 'Failed to update...', icon: "error",
                text: 'You have following error ' + response,
                button: true
            });
        }
    }
    // if (getErrors() == "") {}
}

function btnDeleteMC(ctm) {}

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
function btnPrintTableMC() {}

function sortTable(cind) {}