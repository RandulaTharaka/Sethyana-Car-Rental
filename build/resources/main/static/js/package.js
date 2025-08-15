window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    // Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    // Enable Select2
    $('.js-example-basic-single').select2();


    // EventListeners
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);
    cmbPkType.addEventListener("change", cmbPkTypeCH);

    // Request Privileges
    privileges = httpRequest("../privilege?module=PACKAGE", "GET");

    // Request Lists for Combo box
    packageTypes = httpRequest("../package_type/list", "GET");
    packageCategories = httpRequest("../package_category/list", "GET");
    airConditions = httpRequest("../air_condition/list", "GET");
    packageDurations = httpRequest("../package_duration/list", "GET");
    packageStatuses = httpRequest("../package_status/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    // Data List for Inner Combo Box
    vehicletypes  = httpRequest("../vehicle_type/list", "GET");
    vehiclemodels  = httpRequest("../vehicle_model/list", "GET");

    // Colors
    active = "#72b3c0";
    update = "#f09456";
    select = "#b2b2b2";

    // Refresh View & Form
    loadView();
    loadForm();
}

// Set Attributes to Initial on Table Load
function loadView() {

    // Table Search Area
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

    packages = new Array(); //package list
    var data = httpRequest("/package/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) packages = data.content; //json

    createPagination('pagination', data.totalPages, data.number + 1, paginate); //json

    //fillTable(table_id, data_list, fill(), delete(), view())
    fillTable('tblPackage', packages, fillForm, btnDeleteMC, viewitem); //fill the table with package list
    clearSelection(tblPackage); //clear any selected row
    if (activerowno != ""){
        selectRow(tblPackage, activerowno, active); //select row if any & color
    }
}

function paginate(page) {
    var paginate;
    if (oldPackage == null) {
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

//View Row Details
function viewitem(pkg, rowno) {}

//Print Row
function btnPrintRowMC() {}

function cmbPkTypeCH(){

    if(JSON.parse(cmbPkType.value).name == "Self-Drive"){
        divPkPriceAddHour.style.display = "none";
        divPkRefundable.style.display = "block";

        packagePrice.style.display = "none";
        pricePerDay.style.display = "inline-block";


    }else if(JSON.parse(cmbPkType.value).name == "Chauffeur-Drive"){
        divPkRefundable.style.display = "none";
        divPkPriceAddHour.style.display = "block";

        pricePerDay.style.display = "none";
        packagePrice.style.display = "inline-block";

    }

    //clear fields
    if(oldPackage == null){
        txtPkKm.value = "";
        cmbPkDuration.value = "";
        txtPkPrice.value = "";
        txtPkRefundable.value = "";
        txtPkName.value = "";
        txtPkPriceAddKm.value = "";
        txtPkPriceAddHour.value = "";
        txtPkDescription.value = "";

        initialF(txtPkKm);
        initialF(cmbPkDuration);
        initialF(txtPkPrice);
        initialF(txtPkRefundable);
        initialF(txtPkName);
        initialF(txtPkPriceAddKm);
        initialF(txtPkPriceAddHour);
        initialF(txtPkDescription);
    }
}

function cmbVehicleTypeCH(){
    vehicleModelsByVehicleType = httpRequest("../vehicle_model/list_by_v_types?vehicle_type_id=" + JSON.parse(cmbVehicleType.value).id, "GET");
    fillCombo(cmbVehicleModel, "Select Vehicle Model", vehicleModelsByVehicleType, "name", "");
}

function cmbPkCategoryCH(){
    // generate the package name
    if(txtPkKm.value != "" && cmbPkDuration.value != ""){
        txtPkName.value = JSON.parse(cmbPkCategory.value).name + " " + JSON.parse(cmbPkDuration.value).name + JSON.parse(cmbPkDuration.value).package_duration_type_id.name + " " + txtPkKm.value + "Km";
    }else if(txtPkKm.value != "" && cmbPkDuration.value == ""){
        txtPkName.value = JSON.parse(cmbPkCategory.value).name + " " + txtPkKm.value + "Km";
    }else if(txtPkKm.value == "" && cmbPkDuration.value != ""){
        txtPkName.value = JSON.parse(cmbPkCategory.value).name + " " + JSON.parse(cmbPkDuration.value).name + JSON.parse(cmbPkDuration.value).package_duration_type_id.name;
    }else{
        txtPkName.value = JSON.parse(cmbPkCategory.value).name
    }

    // update the package name
    if(oldPackage !=null && (oldPackage.package_category_id.id != package.package_category_id.id || oldPackage.package_duration_id.id != package.package_duration_id.id || oldPackage.package_km != package.package_km)){
        updateF(txtPkName);
    }else{
        validF(txtPkName);
    }

    // bind the field value
    textFieldBinder(txtPkName, '', 'package','package_name','oldPackage');
}

function cmbPkDurationCH(){
    // generate the package name
    if(cmbPkCategory.value != "" && txtPkKm.value != ""){
        txtPkName.value = JSON.parse(cmbPkCategory.value).name + " " + JSON.parse(cmbPkDuration.value).name + JSON.parse(cmbPkDuration.value).package_duration_type_id.name + " " + txtPkKm.value + "Km";
    }else if(cmbPkCategory.value != "" && txtPkKm.value == "") {
        txtPkName.value = JSON.parse(cmbPkCategory.value).name + " " + JSON.parse(cmbPkDuration.value).name + JSON.parse(cmbPkDuration.value).package_duration_type_id.name;
    }else if(cmbPkCategory.value == "" && txtPkKm.value != ""){
        txtPkName.value = JSON.parse(cmbPkDuration.value).name + JSON.parse(cmbPkDuration.value).package_duration_type_id.name + " " + txtPkKm.value + "Km";
    }else{
        txtPkName.value = JSON.parse(cmbPkDuration.value).name + JSON.parse(cmbPkDuration.value).package_duration_type_id.name;
    }

    // update the package name
    if(oldPackage !=null && (oldPackage.package_category_id.id != package.package_category_id.id || oldPackage.package_duration_id.id != package.package_duration_id.id || oldPackage.package_km != package.package_km)){
        updateF(txtPkName);
    }else{
        validF(txtPkName);
    }

    // bind the field value
    textFieldBinder(txtPkName, '', 'package','package_name','oldPackage');

}
function txtPkKmCH(){
    // generate the package name
    if(cmbPkCategory.value != "" && cmbPkDuration.value != ""){
        txtPkName.value = JSON.parse(cmbPkCategory.value).name + " " + JSON.parse(cmbPkDuration.value).name + JSON.parse(cmbPkDuration.value).package_duration_type_id.name + " " + txtPkKm.value + "Km";
    }else if(cmbPkCategory.value != "" && cmbPkDuration.value == ""){
        txtPkName.value = JSON.parse(cmbPkCategory.value).name + " "  + txtPkKm.value + "Km";
    }else if(cmbPkCategory.value == "" && cmbPkDuration.value != ""){
        txtPkName.value = JSON.parse(cmbPkDuration.value).name + JSON.parse(cmbPkDuration.value).package_duration_type_id.name + " " + txtPkKm.value + "Km";
    }else{
        txtPkName.value = txtPkKm.value + "Km";
    }

    // update the package name
    if(oldPackage !=null && (oldPackage.package_category_id.id != package.package_category_id.id || oldPackage.package_duration_id.id != package.package_duration_id.id || oldPackage.package_km != package.package_km)){
        updateF(txtPkName);
    }else{
        validF(txtPkName);
    }
    // bind the field value
    textFieldBinder(txtPkName, '', 'package','package_name','oldPackage');

}


//Load Initial Form
function loadForm() {
    package = new Object();
    oldPackage = null; //for comparison on update

    //Create array list
    package.packageHasModelList = new Array();

    //Bind Package next no
    var packageNextNo = httpRequest("../package/next_package_no", "GET");
    txtPkNo.value = packageNextNo.package_code;
    package.package_code = txtPkNo.value;
    validF(txtPkNo);
    txtPkNo.disabled = true;


    fillCombo(cmbPkType, "Select Package Type", packageTypes, "name", "");
    fillCombo(cmbPkCategory, "Select Package Category", packageCategories, "name", "");
    fillCombo(cmbPkACType, "Select A/C Type", airConditions, "name", "");

    fillCombo3(cmbPkDuration, "Select Package Duration", packageDurations, "name", "package_duration_type_id.name", "");
    fillCombo(cmbVehicleType, "Select Vehicle Type", vehicletypes, "name", "");
    fillCombo(cmbVehicleModel, "Select Vehicle Model", vehiclemodels, "name", "");

    // combo Auto Selected
    fillCombo(cmbPkStatus, "", packageStatuses, "name", "Available");
    fillCombo(cmbPkAddedBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    // Auto Bind
    package.package_status_id = JSON.parse(cmbPkStatus.value); // JSON.parse: Convert Json to javascript because when value fill in to combo box it fill as a json string //"item_status_id"copied from Item Model
    cmbPkStatus.disabled = true; //make system user unable to select
    cmbPkStatus.style.cursor = 'not-allowed';

    package.employee_id = JSON.parse(cmbPkAddedBy.value);
    cmbPkAddedBy.disabled = true;
    cmbPkAddedBy.style.cursor = 'not-allowed';

    dtePkAdded.value = getCurrentDateTime('date'); //calling date&time function
    package.added_date = dtePkAdded.value;
    dtePkAdded.disabled = true;
    dtePkAdded.style.cursor = 'not-allowed';

    setStyle(initialF);
    validF(cmbPkStatus);
    validF(cmbPkAddedBy);
    validF(dtePkAdded);

    disableButtons(false, true, true);
    refreshInnerForm();
}

function refreshInnerForm(){
    //Create
    packageHasModel = new Object();
    oldPackageHasModel = null; //need two object for comparison on an update

    //---Inner Form---

    // Fill data into combo box
    fillCombo(cmbVehicleType, "Select Vehicle Type", vehicletypes, "name", "");
    fillCombo5(cmbVehicleModel, "Select Model", vehiclemodels, "name", "brand_id.name");

    //Empty text fields when refresh form

    // set auto load field to valid color on load
    initialF(cmbVehicleType);
    initialF(cmbVehicleModel);
    initialF($(cmbVehicleModel).siblings().children().children('.select2-selection--single'));

    //---Inner Table---
    fillInnerTable('tblInnerVModel', package.packageHasModelList, innerModify, innerDelete, innerView); //can add edit button also if need

    //remove edit button
    if(package.packageHasModelList.length != 0){
        for(var index in package.packageHasModelList){
            tblInnerVModel.children[1].children[index].lastChild.children[0].style.display = "none"; //select edit button and remove it

        }
    }
}

function btnInnerAddMC() {

    var modelExist = false;
    for (var index in package.packageHasModelList) { //loop through packageHasModelList
        if (package.packageHasModelList[index].model_id.name == packageHasModel.model_id.name) { //if item exist
            modelExist = true; //if item exist : true
            break; //if item exist : break the loop
        }
    }

    if (modelExist) { //if item exist : display message
        swal({
            title: 'Vehicle Model already exist!', icon: "warning",
            text: '\n',
            button: false,
            timer: 1200
        });
    } else { //if item not exist : Add
        //add item to supplierItem List
        package.packageHasModelList.push(packageHasModel); //push because adding to a list
        refreshInnerForm();
    }
}

function innerModify(){

}

function innerDelete(innerobject, innerrow){
    swal({
        title: "Are you sure to remove following Vehicle Model?",
        text: "\n" + "Vehicle Model : " + innerobject.model_id.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            package.packageHasModelList.splice(innerrow, 1) //remove the item
            refreshInnerForm();
        }

    });

}
function innerView(){

}

//Change Color of Attributes
function setStyle(style) {
    style(txtPkNo);
    style(cmbPkType);
    style(cmbPkCategory);
    style(cmbPkACType);
    style(txtPkPassengerSeats);
    style(cmbVehicleType);
    style(cmbVehicleModel);
    style(txtPkKm);
    style(cmbPkDuration);
    style(txtPkPrice);
    style(txtPkRefundable);
    style(txtPkPriceAddKm);
    style(txtPkPriceAddHour);
    style(txtPkName);
    style(cmbPkStatus);
    style(txtPkDescription);
    style(dtePkAdded);
    style(cmbPkAddedBy);
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
    for (index in packages) {
        if (packages[index].package_status_id.name == "Deleted") {
            tblPackage.children[1].children[index].style.color = "#f03e3e"; //change row color
            tblPackage.children[1].children[index].style.cursor = "not-allowed";
            tblPackage.children[1].children[index].lastChild.children[2].disabled = true; //disable delete btn // Table Body->Row->Last Column->Delete Button
            tblPackage.children[1].children[index].lastChild.children[2].style.cursor = "not-allowed"; //cursor not allowed
        }
    }

}

//Get Errors of Required Fields
function getErrors() {

    var errors = "";
    addvalue = ""; // if value = 1 ask for confirmation on Clear

    //check errors by bind item property value
    if (txtPkNo.value == "") {
        invalidF(txtPkNo);
        errors = errors + "\n" + "Package No. Not Entered.";
    } else addvalue = 1;

    if (cmbPkType.value == "") {
        invalidF(cmbPkType);
        errors = errors + "\n" + "Package Type Not Selected.";
    } else {
        addvalue = 1;

        if(JSON.parse(cmbPkType.value).name == "Self-Drive"){
            if (txtPkRefundable.value == "") {
                invalidF(txtPkRefundable);
                errors = errors + "\n" + "Refundable Deposit Not Entered.";
            } else addvalue = 1;
        } else {
            if (txtPkPriceAddHour.value == "") {
                invalidF(txtPkPriceAddHour);
                errors = errors + "\n" + "Additonal Hour Price Not Entered.";
            } else addvalue = 1;
        }
    }

    if (cmbPkCategory.value == "") {
        invalidF(cmbPkCategory);
        errors = errors + "\n" + "Package Category Not Selected.";
    } else addvalue = 1;

    if (cmbPkACType.value == "") {
        invalidF(cmbPkACType);
        errors = errors + "\n" + "Package AC Type Not Selected.";
    } else addvalue = 1;

    if (txtPkPassengerSeats.value == "") {
        invalidF(txtPkPassengerSeats);
        errors = errors + "\n" + "Passenger Seats Not Entered.";
    } else addvalue = 1;

    if (package.packageHasModelList.length == 0) {
        invalidF(cmbVehicleModel);
        errors = errors + "\n" + "Vehicle Model Not Selected.";
    } else addvalue = 1;

    if (txtPkKm.value == "") {
        invalidF(txtPkKm);
        errors = errors + "\n" + "Package Kilometers Not Entered.";
    } else addvalue = 1;

    if (cmbPkDuration.value == "") {
        invalidF(cmbPkDuration);
        errors = errors + "\n" + "Package Duration Not Selected.";
    } else addvalue = 1;

    if (txtPkPrice.value == "") {
        invalidF(txtPkPrice);
        errors = errors + "\n" + "Package Price Not Entered.";
    } else addvalue = 1;

    if (txtPkPriceAddKm.value == "") {
        invalidF(txtPkPriceAddKm);
        errors = errors + "\n" + "Additional KM Price Not Entered.";
    } else addvalue = 1;

    if (txtPkName.value == "") {
        invalidF(txtPkName);
        errors = errors + "\n" + "Package Name Not Entered.";
    } else addvalue = 1;

    if (cmbPkStatus.value == "") {
        invalidF(cmbPkStatus);
        errors = errors + "\n" + "Package Status Not Selected.";
    } else addvalue = 1;

    if (dtePkAdded.value == "") {
        invalidF(dtePkAdded);
        errors = errors + "\n" + "Added Date Not Entered.";
    } else addvalue = 1;

    if (cmbPkAddedBy.value == "") {
        invalidF(cmbPkAddedBy);
        errors = errors + "\n" + "Added By Not Selected.";
    } else addvalue = 1;

    return errors;

}

//Button Add - Get confirmation on optional empty fields
function btnAddMC() {
    if (getErrors() == "") {
        savedata();
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

    if (package.package_type_id.name== "Self-Drive") {
        swal({
            title: "Are you sure to add following package...?",
            text: "\nPackage Code: " + package.package_code +
                "\nPackage Type : " + package.package_type_id.name +
                "\nPackage Category : " + package.package_category_id.name +
                "\nPassenger Seats : " + package.passenger_seats_count +
                "\nAir Condition Type : " + package.air_condition_type_id.name +
                "\nPackage Kilometers : " + package.package_km + " Km" +
                "\nPackage Duration : " + package.package_duration_id.name + " Hour" +
                "\nPackage Price : Rs " + package.package_price +
                "\nRefundable Deposit: Rs " + package.refundable_deposit +
                "\nPrice per Additional Km : Rs " + package.price_per_additional_km +
                "\nPackage Name : " + package.package_name,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((save) => { //then: if user click 'Yes' then
            if (save) {
                var response = httpRequest("/package", "POST", package);//Post: because it's a Add
                if (response == "0") { //message 0: means successful
                    swal({
                        position: 'center',
                        icon: 'success',
                        title: 'Save SuccessFully..!',
                        text: '\n',
                        button: false,
                        timer: 2000
                    });
                    activepage = 1;
                    activerowno = 1; //1: highlight added row which is 1 row
                    loadSearchedTable();
                    loadForm();
                    $('#addPackageModal').modal('hide');
                } else swal({
                    title: 'Save not Success... , You have following errors', icon: "error",
                    text: '\n ' + response,
                    button: true
                });
            }
        });
    } else if (package.package_type_id.name== "Chauffeur-Drive") {
        swal({
            title: "Are you sure to add following package...?",
            text: "\nPackage Code: " + package.package_code +
                "\nPackage Type : " + package.package_type_id.name +
                "\nPackage Category : " + package.package_category_id.name +
                "\nPassenger Seats : " + package.passenger_seats_count +
                "\nAir Condition Type : " + package.air_condition_type_id.name +
                "\nPackage Kilometers : " + package.package_km + " Km" +
                "\nPackage Duration : " + package.package_duration_id.name + " Hour" +
                "\nPackage Price : Rs " + package.package_price +
                "\nPrice per Additional Km : Rs " + package.price_per_additional_km +
                "\nPrice per Additional Hour : Rs " + package.price_per_additional_hour +
                "\nPackage Name : " + package.package_name,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((save) => {
            if (save) {
                var response = httpRequest("/package", "POST", package);
                if (response == "0") { //0: successful
                    swal({
                        position: 'center',
                        icon: 'success',
                        title: 'Save SuccessFully..!',
                        text: '\n',
                        button: false,
                        timer: 2000
                    });
                    activepage = 1;
                    activerowno = 1; //highlight row 1 (added row)
                    loadSearchedTable();
                    loadForm();
                    $('#addPackageModal').modal('hide');
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

    if (oldPackage == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
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
function fillForm(pkg, rowno) {
    activerowno = rowno;

    if (oldPackage == null) { //check if previous attempt to update (value assign to oldCustomer only when fill_data() called.)
        filldata(pkg);
    } else {
        swal({
            title: "Previous attempt to update the form has not submitted... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: ["Cancel", "Discard"], dangerMode: true,
        }).then((yesUpdate) => {
            if (yesUpdate) {
                filldata(pkg);
            }

        });
    }

}

//Fill Data on Update
function filldata(pkg) {
    clearSelection(tblPackage);
    selectRow(tblPackage, activerowno, active); //color row

    package = JSON.parse(JSON.stringify(pkg));// parse to prevent referring to same object & data is in table row format
    oldPackage = JSON.parse(JSON.stringify(pkg));

    //Bind object's value to fields
    txtPkNo.value = package.package_code;
    txtPkPassengerSeats.value = package.passenger_seats_count;
    txtPkKm.value = package.package_km;
    txtPkPrice.value = package.package_price;
    txtPkRefundable.value = package.refundable_deposit;
    txtPkPriceAddKm.value = package.price_per_additional_km;
    txtPkPriceAddHour.value = package.price_per_additional_hour;
    txtPkName.value = package.package_name;
    // cmbPkDuration.value = package.package_duration;
    txtPkDescription.value = package.description;
    dtePkAdded.value = package.added_date;

    fillCombo(cmbPkType, "Select Package Type", packageTypes, "name", package.package_type_id.name);
    cmbPkType.disabled = true; //make system user unable to select
    cmbPkType.style.cursor = 'not-allowed';

    fillCombo(cmbPkCategory, "Select Package Category", packageCategories, "name", package.package_category_id.name);
    fillCombo(cmbPkACType, "Select A/C Type", airConditions, "name", package.air_condition_type_id.name);

    fillCombo10(cmbPkDuration, "Select Duration", packageDurations ,"name", "package_duration_type_id.name", package.package_duration_id);

    fillCombo(cmbVehicleType, "Select Vehicle Type", vehicletypes, "name", "");
    fillCombo(cmbVehicleModel, "Select Vehicle Model", vehiclemodels, "name", "");
    fillCombo(cmbPkAddedBy, "", employees, "callingname", package.employee_id.callingname);
    fillCombo(cmbPkStatus, "", packageStatuses, "name", package.package_status_id.name);
    cmbPkStatus.disabled = false;
    cmbPkStatus.style.cursor = 'pointer';

    divPkStatus.style.display = "block";

    disableButtons(true, false, false);
    setStyle(validF);
    cmbPkTypeCH();
    refreshInnerForm();
    $('#addPackageModal').modal('show');

    //Set optional field border color to initial if null
    if (package.description == null)
        initialF(txtPkDescription);

    if (package.refundable_deposit == null)
        initialF(txtPkRefundable);

    if (package.price_per_additional_hour == null)
        initialF(txtPkPriceAddHour);
}

//Check for Updated Values
function getUpdates() {

    var updates = "";

    if (package != null && oldPackage != null) {

        if (package.package_code != oldPackage.package_code)
            updates = updates + "\nPackage Code is Changed: " + oldPackage.package_code + " --> " + package.license_plate;

        if (package.package_type_id.name != oldPackage.package_type_id.name)
            updates = updates + "\nPackage Type is Changed: " + oldPackage.package_type_id.name + " --> " + package.package_type_id.name;

        if (package.passenger_seats_count != oldPackage.passenger_seats_count)
            updates = updates + "\nNo. of Passenger Seats are Changed: " + oldPackage.passenger_seats_count + " --> " + package.passenger_seats_count;

        if (package.air_condition_type_id.name != oldPackage.air_condition_type_id.name)
            updates = updates + "\nA/C Type is Changed: " + oldPackage.air_condition_type_id.name + " --> " + package.air_condition_type_id.name;

        if (package.package_km != oldPackage.package_km)
            updates = updates + "\nPackage Kilometers are changed: " + oldPackage.package_km + " --> " + package.package_km;

        if (package.package_duration_id.name != oldPackage.package_duration_id.name)
            updates = updates + "\nPackage Duration is Changed: " + oldPackage.package_duration_id.name + " --> " + package.package_duration_id.name;

        if (package.package_price != oldPackage.package_price)
            updates = updates + "\nPackage Price is Changed: " + oldPackage.package_price + " --> " + package.package_price;

        if (package.refundable_deposit != oldPackage.refundable_deposit)
            updates = updates + "\nRefundable Deposit is Changed: " + oldPackage.refundable_deposit + " --> " + package.refundable_deposit;

        if (package.price_per_additional_km != oldPackage.price_per_additional_km)
            updates = updates + "\nPrice per Additional KM is Changed: " + oldPackage.price_per_additional_km + " --> " + package.price_per_additional_km;

        if (package.price_per_additional_hour != oldPackage.price_per_additional_hour)
            updates = updates + "\nPrice per Additional Hour is Changed: " + oldPackage.price_per_additional_hour + " --> " + package.price_per_additional_hour;

        if (package.package_name != oldPackage.package_name)
            updates = updates + "\nPackage Name is Changed: " + oldPackage.package_name + " --> " + package.package_name;

        if (package.package_status_id.name != oldPackage.package_status_id.name)
            updates = updates + "\nPackage Status is Changed: " + oldPackage.package_status_id.name + " --> " + package.package_status_id.name;

        if (package.description != oldPackage.description)
            updates = updates + "\nDescription is Changed: " + oldPackage.description + " --> " + package.description;

        if (isEqual(package.packageHasModelList, oldPackage.packageHasModelList, 'model_id')) //List, List, Attribute
            updates = updates + "\nVehicle Models are Changed: ";
        return updates;
    }
}

//Get confirmation & Update
function btnUpdateMC() {
    if (getErrors() == "") {
        if (getUpdates() == "") {
            swal({
                title: 'Nothing to update...', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        } else {
            swal({
                title: "Are you sure to update following package details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: ["Cancel", "Update"], dangerMode: true,
            })
                .then((yesUpdate) => {
                    if (yesUpdate) {
                        var response = httpRequest("/package", "PUT", package);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Updated Successfully..!',
                                text: '\n',
                                button: false,
                                timer: 2000
                            });
                            loadSearchedTable();
                            $('#addPackageModal').modal('hide');
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

function btnDeleteMC(pkg) {
    package = JSON.parse(JSON.stringify(pkg));

        swal({
            title: "Are you sure to delete following package...?",
            text: "\nPackage Number : " + package.package_code +
                "\nPackage Type : " + package.package_type_id.name +
                "\nPackage Name : " + package.package_name ,
            icon: "warning", buttons: ["Cancel", "Delete"], closeOnClickOutside: false, dangerMode: true,

        }).then((willDelete) => {
            if (willDelete) {
                var responce = httpRequest("/package", "DELETE", package);
                if (responce == 0) {
                    swal({
                        title: "Deleted Successfully....!",
                        text: "\n\n  Status change to delete",
                        icon: "success", button: false, timer: 2000,
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
function loadSearchedTable() {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    loadTable(activepage, cmbPageSize.value, query); //call loadTable passing the query

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC() {}

function sortTable(cind) {}