window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    //Enable tooltips
    $('[data-toggle="tooltip"]').tooltip();

    //EventListeners
    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);
    cmbOwnerType.addEventListener("change", cmbOwnerTypeCH);
    txtSearchName.addEventListener("keyup", btnSearchMC);

    //Request Privileges
    privileges = httpRequest("../privilege?module=VEHICLE", "GET");

    //Request Lists for Combo box
    vehicleTypes = httpRequest("../vehicle_type/list", "GET");
    vehicleBrands = httpRequest("../vehicle_brand/list", "GET");
    vehicleModels = httpRequest("../vehicle_model/list", "GET");
    transmissionTypes = httpRequest("../transmission_type/list", "GET");
    airConditions = httpRequest("../air_condition/list", "GET");
    fuelTypes = httpRequest("../fuel_type/list", "GET");
    ownerTypes = httpRequest("../owner_type/list", "GET");
    modelColors = httpRequest("../model_color/list", "GET");
    colors = httpRequest("../color/list", "GET");
    vehicleStatuses = httpRequest("../vehicle_status/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    //Select options for bags
    luggage = [];
    for (let i = 1; i <= 10; i++) {
        luggage.push(i);
    }

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
function loadTable(page, size, query) {
    page = page - 1;

    vehicles = new Array(); //vehicles list
    var data = httpRequest("/vehicle/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) vehicles = data.content; //json

    createPagination('pagination', data.totalPages, data.number + 1, paginate); //json

    //fillTable(table_id, data_list, fill(), delete(), view())
    fillTable('tblVehicle', vehicles, fillForm, btnDeleteMC, viewitem); //fill the table with vehicle list
    clearSelection(tblVehicle); //clear any selected row
    if (activerowno != "") selectRow(tblVehicle, activerowno, update); //select row if any & color
}

function paginate(page) {
    var paginate;
    if (oldVehicle == null) {
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

//View Row Details (Print)

/*// Viva code modification
function viewitem(vehi, rowno) {
    vehicle = JSON.parse(JSON.stringify(vehi));
    vehicleHistory = httpRequest("/cd_reservation/list_by_vehicle?vehicle_id=" + vehicle.id, "GET");
    fillTable('tblVehicleHistory', vehicleHistory, null, null, null);
    $('#dataViewModal').modal('show');
}*/

function viewitem(vehi, rowno) {
    // Viva Assignment
    /*vehicle = JSON.parse(JSON.stringify(vehi));
    vehicleHistory = httpRequest("/cd_reservation/list_by_vehicle?vehicle_id=" + vehicle.id, "GET");
    fillTable('tblVehicleHistory', vehicleHistory, null, null, null);*/

    removeImage('displayPhotoVD');

    setImage('displayPhotoVD', vehi.display_photo);
    vehicleBrandAndModelVD.innerHTML = `${vehi.model_id.brand_id.name} ${vehi.model_id.name}`;
    licensePlateVD.innerHTML = `${vehi.license_plate}`;

    // Setting up vehicle status
    let bgColorOfVehicleStatus;
    switch (vehi.vehicle_status_id.id){
        case 1:
            bgColorOfVehicleStatus = "#4995a4";
            vehicleStatusOutlineColorVD.style.border = '1px solid #4995a4';
            break;
        case 2:
            bgColorOfVehicleStatus = "#F5C91C";
            vehicleStatusOutlineColorVD.style.border = '1px solid #F5C91C';
            break;
        case 3:
            bgColorOfVehicleStatus = "#f03e3e";
            vehicleStatusOutlineColorVD.style.border = '1px solid #f03e3e';
            break;
        default:
            bgColorOfVehicleStatus = "#6c757d";
            vehicleStatusOutlineColorVD.style.border = '1px solid #6c757d';

    }
    vehicleStatusColorVD.style.backgroundColor = bgColorOfVehicleStatus;
    vehicleStatusVD.innerHTML = `${vehi.vehicle_status_id.name}`;

    // Setting up Odometer
    const stringValueOfOdometer = Math.abs(vehi.current_odometer).toString();
    const digitsArrayOfOdometer = stringValueOfOdometer.split('');

    // Retrieve child nodes and convert them to an array
    const childNodesArrayOfOdometer = Array.from(odometerVDCol.childNodes);
    // Filter out only element nodes (ignore text nodes, comments, etc.)
    const childElementsArrayOfOdometer = childNodesArrayOfOdometer.filter(node => node.nodeType === 1);

    // Loop through and pop the last index value (from the first array) and write it to the paragraph element (child node of the div)
    for(i=6; i>-1; i--){
        if(digitsArrayOfOdometer.length !== 0){
            let lastIndexValueOfArrayOfOdometer = digitsArrayOfOdometer.pop();
            childElementsArrayOfOdometer[i].childNodes[0].innerHTML = lastIndexValueOfArrayOfOdometer;
        }
    }

    vehicleTypeVD.innerHTML = `${vehi.model_id.vehicle_type_id.name}`;

    transmissionVD.innerHTML = `${vehi.transmission_type_id.name}`;

    fuelVD.innerHTML = `${vehi.fuel_type_id.name}`;

    vehicleColorVD.style.backgroundColor = '#' + vehi.color_id.color_code;

    seatsVD.innerHTML = `${vehi.num_of_seats}`;

    if(vehi.num_of_luggage){
        luggageVD.innerHTML = `${vehi.num_of_luggage}`;
    }

    if(vehi.max_weight){
        maxWeightVD.innerHTML = `${vehi.max_weight}`;
    }

    if(vehi.km_per_liter){
        KmPerLiterVD.innerHTML = `${vehi.km_per_liter} Km per L`;
    }


    if(vehi.air_condition_type_id.id === 1 || vehi.air_condition_type_id.id === 3){
        airConditionVD.src = 'image/green_tick.png';
    }else{
        airConditionVD.src = 'image/red_cross.png';
    }

    if(vehi.usb_charging){
        usbChargingVD.src = 'image/green_tick.png';
    }else{
        usbChargingVD.src = 'image/red_cross.png';
    }

    if(vehi.rearview_camera){
        rearviewCamVD.src = 'image/green_tick.png';
    }else{
        rearviewCamVD.src = 'image/red_cross.png';
    }

    if(vehi.music_player){
        musicPlayerVD.src = 'image/green_tick.png';
    }else{
        musicPlayerVD.src = 'image/red_cross.png';
    }


    if(vehi.next_service_odometer){
        nextServiceOdometerVD.innerHTML = `${vehi.next_service_odometer} Km`;
    }

    if(vehi.next_service_date){
        nextServiceDateVD.innerHTML = sqlDateTimeToLocalC(vehi.next_service_date);
    }

    if(vehi.revenue_license_exp_date){
        revenueLicenseExpirationVD.innerHTML = sqlDateTimeToLocalC(vehi.revenue_license_exp_date);
    }

    if(vehi.insurance_exp_date){
        insuranceExpirationVD.innerHTML = sqlDateTimeToLocalC(vehi.insurance_exp_date);
    }

    ownerTypeVD.innerHTML = vehi.owner_type_id.name;

    if(vehi.owner_type_id.id === 1){ // 1=company
        rowOfOwnerNameVD.style.display = 'none';
        rowOfOwnerPhoneVD.style.display = 'none';
        rowOfOwnerAddressVD.style.display = 'none';

    }else if(vehi.owner_type_id.id === 2){ // 2=outside
        ownerNameVD.innerHTML = vehi.owner_name;
        ownerPhoneVD.innerHTML = vehi.owner_phone;
        ownerAddressVD.innerHTML = vehi.owner_address;
    }

    if(vehi.notes){
        vehicleNotesVD.innerHTML = `${vehi.notes}`;
    }

    $('#dataViewModal').modal('show');
}


//Print Row
function btnPrintRowMC() {
    var format = printformtable.outerHTML; //outerHTML: Structure of printformtable

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><base href='http://localhost:8080/'>" +
        "<style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
        "<link rel=\'stylesheet\'  href=\'../vendor/bootstrap/css/bootstrap.min.css\'>" + // use '' in ""
        "<link rel=\'stylesheet\'  href=\'../vendor/fontawesome/css/all.min.css\'>" +
        "<link rel=\'stylesheet\'  href=\'../css/vehicle_details_print.css\'>" +
        " <script defer src=\'../vendor/fontawesome/js/solid.js\'></script>" +
        "<script defer src=\'../vendor/fontawesome/js/fontawesome.js\'></script></head>" +
        "<body><div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        // newwindow.close();
    }, 100);
}

function cmbVehicleTypeCH(){
    if (oldVehicle != null && JSON.parse(cmbVType.value).name != oldVehicle.model_id.vehicle_type_id.name) { //check if value is changed other than previous value
        updateF(cmbVType);
    } else {
        validF(cmbVType);
    }
}

function cmbVehicleBrandCH(){
    if (oldVehicle != null && JSON.parse(cmbVBrand.value).name != oldVehicle.model_id.brand_id.name) { //check if value is changed other than previous value
        updateF(cmbVBrand);
    } else {
        validF(cmbVBrand);
    }
}

function cmbOwnerTypeCH() {
    if (vehicle.owner_type_id != null && vehicle.owner_type_id.name == "Outside") {
        divOwnerName.style.display = "block";
        divOwnerPhone.style.display = "block";
        divOwnerAddress.style.display = "block";

        //on update: affect when change company to outside

    } else if (vehicle.owner_type_id != null && vehicle.owner_type_id.name == "Company") {
        divOwnerName.style.display = "none";
        divOwnerPhone.style.display = "none";
        divOwnerAddress.style.display = "none";


        if(oldVehicle == null) { //on add: clear sections
            txtOwnerName.value = "";
            txtOwnerPhone.value = "";
            txtOwnerAddress.value = "";

            initialF(txtOwnerName);
            initialF(txtOwnerPhone);
            initialF(txtOwnerAddress);
        }
    }
}


//Load Initial Form
function loadForm() {
    vehicle = new Object();
    oldVehicle = null; //for comparison on update


    fillCombo(cmbVType, "Select Vehicle Type", vehicleTypes, "name", "");
    fillCombo(cmbVBrand, "Select Brand", vehicleBrands, "name", "");
    fillCombo(cmbVModel, "Select Model", vehicleModels, "name", "");
    fillCombo(cmbTransmission, "Select Transmission Type", transmissionTypes, "name", "");
    fillCombo(cmbAirCondition, "Select A/C Type", airConditions, "name", "");
    fillCombo(cmbFuel, "Select Fuel Type", fuelTypes, "name", "");
    fillCombo(cmbOwnerType, "Select Owner Type", ownerTypes, "name", "");
    fillCombo(cmbVehicleColor, "Select Vehicle Color", colors, "name", "");
    fillCombo4(cmbLuggage, "Select No. of Luggage", luggage, 'num_of_luggage', '');

    // combo Auto Selected
    fillCombo(cmbVehicleStatus, "", vehicleStatuses, "name", "Available");
    fillCombo(cmbAddedBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    // Auto Bind
    vehicle.vehicle_status_id = JSON.parse(cmbVehicleStatus.value); // JSON.parse: Convert Json to javascript because when value fill in to combo box it fill as a json string //"item_status_id"copied from Item Model
    cmbVehicleStatus.disabled = true; //make system user unable to select
    cmbVehicleStatus.style.cursor = 'not-allowed';

    vehicle.employee_id = JSON.parse(cmbAddedBy.value);
    cmbAddedBy.disabled = true;
    cmbAddedBy.style.cursor = 'not-allowed';

    dteAdded.value = getCurrentDateTime('date'); //calling date&time function
    vehicle.added_date = dteAdded.value;
    dteAdded.disabled = true;
    dteAdded.style.cursor = 'not-allowed';

    removeFile('flePhoto');
    setStyle(initialF);

    validF(cmbVehicleStatus);
    validF(cmbAddedBy);
    validF(dteAdded);

    disableButtons(false, true, true);
}

//Change Color of Attributes
function setStyle(style) {

    style(txtVLicenseNo);
    style(txtSeats);
    style(txtMaxWeight);
    style(txtEntryOdometer);
    style(txtKmPerLiter);
    style(txtOwnerName);
    style(txtOwnerPhone);
    style(txtOwnerAddress);
    style(txtNextServiceOdometer);
    style(txtVehicleNotes);
    style(cmbVType);
    style(cmbVBrand);
    style(cmbVModel);
    style(cmbTransmission);
    style(cmbAirCondition);
    style(cmbFuel);
    style(cmbVehicleColor);
    style(cmbLuggage);
    style(cmbOwnerType);
    style(cmbVehicleStatus);
    style(cmbAddedBy);
    style(chkMusicPlayer);
    style(chkUSBCharging);
    style(chkRearviewCamera);
    style(dteRevenueLExp);
    style(dteInsuranceExp);
    style(dteNextService);
    style(dteDamageUpdate);
    style(dteAdded);
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
    for (index in vehicles) {
        if (vehicles[index].vehicle_status_id.name == "Deleted") {
            tblVehicle.children[1].children[index].style.color = "#f03e3e"; //change row color
            tblVehicle.children[1].children[index].style.cursor = "not-allowed";
            tblVehicle.children[1].children[index].lastChild.children[2].disabled = true; //disable delete btn // Table Body->Row->Last Column->Delete Button
            tblVehicle.children[1].children[index].lastChild.children[2].style.cursor = "not-allowed"; //cursor not allowed
        }
    }

}

//Get Errors of Required Fields
function getErrors() {

    var errors = "";
    addvalue = ""; // if value = 1 ask for confirmation on Clear

    //check errors by bind item property value
    if (vehicle.license_plate == null) {
        invalidF(txtVLicenseNo);
        errors = errors + "\n" + "Vehicle License No. Not Entered.";
    } else addvalue = 1;

    if (cmbVType.value == "") {
        invalidF(cmbVType);
        errors = errors + "\n" + "Vehicle Type Not Selected.";
    } else addvalue = 1;

    if (cmbVBrand.value == "") {
        invalidF(cmbVBrand);
        errors = errors + "\n" + "Brand Not Selected.";
    } else addvalue = 1;

    if (vehicle.model_id == null) {
        invalidF(cmbVModel);
        errors = errors + "\n" + "Model Not Selected.";
    } else addvalue = 1;

    if (vehicle.transmission_type_id == null) {
        invalidF(cmbTransmission);
        errors = errors + "\n" + "Transmission Type Not Selected.";
    } else addvalue = 1;

    if (vehicle.air_condition_type_id == null) {
        invalidF(cmbAirCondition);
        errors = errors + "\n" + "Air Condition Not Selected.";
    } else addvalue = 1;

    if (vehicle.fuel_type_id == null) {
        invalidF(cmbFuel);
        errors = errors + "\n" + "Fuel Type Not Selected.";
    } else addvalue = 1;

    if (vehicle.num_of_seats == null) {
        invalidF(txtSeats);
        errors = errors + "\n" + "No. of Seats Not Entered.";
    } else addvalue = 1;

    if (vehicle.entry_odometer == null) {
        invalidF(txtEntryOdometer);
        errors = errors + "\n" + "Entry Odometer Not Entered.";
    } else addvalue = 1;

    if (vehicle.owner_type_id == null) {
        invalidF(cmbOwnerType);
        errors = errors + "\n" + "Owner Type Not Selected.";

    } else {
        addvalue = 1;

        if (vehicle.owner_type_id.name == "Outside") {

            if (vehicle.owner_name == null) {
                invalidF(txtOwnerName);
                errors = errors + "\n" + "Owner Name Not Entered.";
            } else addvalue = 1;

            if (vehicle.owner_phone == null) {
                invalidF(txtOwnerPhone);
                errors = errors + "\n" + "Owner Phone Not Entered.";
            } else addvalue = 1;

            if (vehicle.owner_address == null) {
                invalidF(txtOwnerAddress);
                errors = errors + "\n" + "Owner Address Not Entered.";
            } else addvalue = 1;
        }

    }

    if (vehicle.vehicle_status_id == null) {
        invalidF(cmbVehicleStatus);
        errors = errors + "\n" + "Vehicle Status Not Selected.";
    } else addvalue = 1;

    if (vehicle.employee_id == null) {
        invalidF(cmbAddedBy);
        errors = errors + "\n" + "Added By Not Selected.";
    } else addvalue = 1;

    if (vehicle.added_date == null) {
        invalidF(dteAdded);
        errors = errors + "\n" + "Added Date Not Entered.";
    } else addvalue = 1;

    return errors;

}

//Button Add - Get confirmation on optional empty fields
function btnAddMC() {
    if (getErrors() == "") {
        if (cmbLuggage.value == "" || txtMaxWeight.value == "" || txtKmPerLiter.value == "" || txtNextServiceOdometer.value == "" || dteNextService.value == "") {
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

    if(vehicle.current_odometer == null)
        vehicle.current_odometer = vehicle.entry_odometer;

    vehicle.passenger_seats = parseInt(vehicle.num_of_seats - 1);

    swal({
        title: "Are you sure to add following vehicle...?",
        text: "\nLicense Plate: " + vehicle.license_plate +
            "\nVehicle Type : " + vehicle.model_id.vehicle_type_id.name +
            "\nBrand : " + vehicle.model_id.brand_id.name +
            "\nModel : " + vehicle.model_id.name +
            "\nTransmission Type : " + vehicle.transmission_type_id.name +
            "\nAir Condition : " + vehicle.air_condition_type_id.name +
            "\nFuel Type : " + vehicle.fuel_type_id.name +
            "\nColor : " + vehicle.color_id.name +
            "\nNo. of Seats : " + vehicle.num_of_seats +
            getOptionalFieldsDetails() +
            getOwnerDetails(),
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((save) => { //then: if user click 'Yes' then
        if (save) {
            var response = httpRequest("/vehicle", "POST", vehicle);//Post: because it's a Add
            if (response == "0") { //message 0: means successful
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Save Successfully..!',
                    text: '\n',
                    button: false,
                    timer: 2000
                });
                // activepage = 1;
                // activerowno = 1; //1: highlight added row which is 1 row
                loadSearchedTable();
                $('#addVehicleModal').modal('hide');
                loadForm();
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}

function getOptionalFieldsDetails(){
    let optionalFieldsDetails = "";

    if(vehicle.num_of_luggage !== undefined){
        optionalFieldsDetails += "\nLuggage : " + vehicle.num_of_luggage;
    }

    if(vehicle.max_weight !== undefined){
        optionalFieldsDetails += "\nMax Weight : " + vehicle.max_weight + " Kg";
    }

    if(vehicle.km_per_liter !== undefined){
        optionalFieldsDetails += "\nKillometre per Liter : " + vehicle.km_per_liter;
    }

    if(vehicle.entry_odometer !== undefined){ // Required field, placed here to display in order
        optionalFieldsDetails += "\nOdometer at Entry : " + vehicle.entry_odometer + " Km";
    }

    if(vehicle.usb_charging !== undefined && vehicle.usb_charging !== 0 ){
        optionalFieldsDetails += "\nUSB Charging : Yes";
    }

    if(vehicle.rearview_camera !== undefined && vehicle.rearview_camera !== 0){
        optionalFieldsDetails += "\nRearview Camera : Yes";
    }

    if(vehicle.revenue_license_exp_date !== undefined){ // Required field, placed here to display in order
        optionalFieldsDetails += "\nRevenue License Expire Date : " + vehicle.revenue_license_exp_date;
    }

    if(vehicle.insurance_exp_date !== undefined){ // Required field, placed here to display in order
        optionalFieldsDetails += "\nInsurance Expire Date : " + vehicle.insurance_exp_date;
    }

    if(vehicle.next_service_odometer !== undefined){
        optionalFieldsDetails += "\nNext Service Odometer : " + vehicle.next_service_odometer + " Km";
    }

    if(vehicle.next_service_date !== undefined){
        optionalFieldsDetails += "\nNext Service Date : " + vehicle.next_service_date;
    }

    if(vehicle.damage_update_date !== undefined){
        optionalFieldsDetails += "\nDamage Update Date : " + vehicle.damage_update_date;
    }

    if(vehicle.notes !== undefined){
        optionalFieldsDetails += "\nNotes : " + vehicle.notes;
    }

    return optionalFieldsDetails;
}

function getOwnerDetails(){
    let ownerDetails = "\nOwner Type : " + vehicle.owner_type_id.name;
    if(vehicle.owner_type_id.id == 2){ // 2=Outside
        ownerDetails += "\nOwner Name : " + vehicle.owner_name;
        ownerDetails += "\nOwner Phone : " + vehicle.owner_phone;
        ownerDetails += "\nOwner Address : " + vehicle.owner_address;
    }
    return ownerDetails;
}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldVehicle == null && addvalue == "") {
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
function fillForm(vehi, rowno) {
    activerowno = rowno;

    if (oldVehicle == null) { //check if previous attempt to update (value assign to oldCustomer only when fill_data() called.)
        filldata(vehi);
    } else {
        swal({
            title: "Previous attempt to update the form has not submitted... Are you sure to discard the form ?",
            text    : "\n",
            icon: "warning", buttons: ["Cancel", "Discard"], dangerMode: true,
        }).then((yesUpdate) => {
            if (yesUpdate) {
                filldata(vehi);
            }

        });
    }

}

//Fill Data on Update
function filldata(vehi) {
    clearSelection(tblVehicle);
    selectRow(tblVehicle, activerowno, select); //color row

    vehicle = JSON.parse(JSON.stringify(vehi));// parse to prevent referring to same object & data is in table row format
    oldVehicle = JSON.parse(JSON.stringify(vehi));

    //Bind object's value to fields
    txtVLicenseNo.value = vehicle.license_plate;
    txtSeats.value = vehicle.num_of_seats;
    txtMaxWeight.value = vehicle.max_weight;
    txtEntryOdometer.value = vehicle.entry_odometer;
    txtKmPerLiter.value = vehicle.km_per_liter;
    txtOwnerName.value = vehicle.owner_name;
    txtOwnerPhone.value = vehicle.owner_phone;
    txtOwnerAddress.value = vehicle.owner_address;
    txtNextServiceOdometer.value = vehicle.next_service_odometer;
    txtVehicleNotes.value = vehicle.notes;

    chkMusicPlayer.value = vehicle.music_player;
    chkUSBCharging.value = vehicle.usb_charging;
    chkRearviewCamera.value = vehicle.rearview_camera;

    dteRevenueLExp.value = vehicle.revenue_license_exp_date;
    dteInsuranceExp.value = vehicle.insurance_exp_date;
    dteNextService.value = vehicle.next_service_date;
    dteDamageUpdate.value = vehicle.damage_update_date;
    dteAdded.value = vehicle.added_date;


    fillCombo(cmbVType, "Select Vehicle Type", vehicleTypes, "name", vehicle.model_id.vehicle_type_id.name);
    fillCombo(cmbVBrand, "Select Brand", vehicleBrands, "name", vehicle.model_id.brand_id.name);
    fillCombo(cmbVModel, "Select Model", vehicleModels, "name", vehicle.model_id.name);
    fillCombo(cmbTransmission, "Select Transmission Type", transmissionTypes, "name", vehicle.transmission_type_id.name);
    fillCombo(cmbAirCondition, "Select A/C Type", airConditions, "name", vehicle.air_condition_type_id.name);
    fillCombo(cmbFuel, "Select Fuel Type", fuelTypes, "name", vehicle.fuel_type_id.name);
    fillCombo(cmbOwnerType, "Select Owner Type", ownerTypes, "name", vehicle.owner_type_id.name);
    fillCombo(cmbVehicleColor, "Select Model Color", colors, "name", vehicle.color_id.name);

    fillCombo4(cmbLuggage, "Select No. of Luggage", luggage, 'num_of_luggage' ,vehicle.num_of_luggage);

    fillCombo(cmbVehicleStatus, "", vehicleStatuses, "name", vehicle.vehicle_status_id.name);
    cmbVehicleStatus.disabled = false;
    cmbVehicleStatus.style.cursor = 'pointer';

    divVehicleStatus.style.display = "block";

    setDefaultFile('flePhoto', vehicle.display_photo);

    disableButtons(true, false, false);
    setStyle(validF);
    cmbOwnerTypeCH();
    $('#addVehicleModal').modal('show');

    //Set optional field border color to initial if null
    if (vehicle.num_of_luggage == null)
        initialF(cmbLuggage);

    if (vehicle.max_weight == null)
        initialF(txtMaxWeight);

    if (vehicle.km_per_liter == null)
        initialF(txtKmPerLiter);

    if (vehicle.next_service_odometer == null)
        initialF(txtNextServiceOdometer);

    if (vehicle.damage_update_date == null)
        initialF(dteDamageUpdate);

    if (vehicle.notes == null)
        initialF(txtVehicleNotes);

    if(vehicle.owner_name == null)initialF(txtOwnerName);
    if(vehicle.owner_phone == null)initialF(txtOwnerPhone);
    if(vehicle.owner_address == null)initialF(txtOwnerAddress);

}

//Check for Updated Values
function getUpdates() {

    var updates = "";

    if (vehicle != null && oldVehicle != null) {

        if (vehicle.license_plate != oldVehicle.license_plate)
            updates = updates + "\nLicense Plate is Changed: " + oldVehicle.license_plate + " --> " + vehicle.license_plate;

        if (vehicle.model_id.vehicle_type_id.name != oldVehicle.model_id.vehicle_type_id.name)
            updates = updates + "\nVehicle Type is Changed: " + oldVehicle.model_id.vehicle_type_id.name + " --> " + vehicle.model_id.vehicle_type_id.name;


        if (vehicle.model_id.brand_id.name != oldVehicle.model_id.brand_id.name)
            updates = updates + "\nBrand is Changed: " + oldVehicle.model_id.brand_id.name + " --> " + vehicle.model_id.brand_id.name;

        if (vehicle.model_id.name != oldVehicle.model_id.name)
            updates = updates + "\nModel is Changed: " + oldVehicle.model_id.name + " --> " + vehicle.model_id.name;


        if (vehicle.transmission_type_id.name != oldVehicle.transmission_type_id.name)
            updates = updates + "\nTransmission Type is Changed: " + oldVehicle.transmission_type_id.name + " --> " + vehicle.transmission_type_id.name;

        if (vehicle.air_condition_type_id.name != oldVehicle.air_condition_type_id.name)
            updates = updates + "\nAir Condition Type is Changed: " + oldVehicle.air_condition_type_id.name + " --> " + vehicle.air_condition_type_id.name;

        if (vehicle.fuel_type_id.name != oldVehicle.fuel_type_id.name)
            updates = updates + "\nFuel Type is Changed: " + oldVehicle.fuel_type_id.name + " --> " + vehicle.fuel_type_id.name;

        if (vehicle.color_id.id != oldVehicle.color_id.id)
            updates = updates + "\nColor is Changed: " + oldVehicle.color_id.name + " --> " + vehicle.color_id.name;

        if (vehicle.num_of_seats != oldVehicle.num_of_seats)
            updates = updates + "\nNo. of Seats is Changed: " + oldVehicle.num_of_seats + " --> " + vehicle.num_of_seats;

        if (vehicle.num_of_luggage != oldVehicle.num_of_luggage)
            updates = updates + "\nNo. of Luggage is Changed: " + oldVehicle.num_of_luggage + " --> " + vehicle.num_of_luggage;

        if (vehicle.max_weight != oldVehicle.max_weight)
            updates = updates + "\nMax Weight is Changed: " + oldVehicle.max_weight + " --> " + vehicle.max_weight;


        if (vehicle.entry_odometer != oldVehicle.entry_odometer){
            updates = updates + "\nOdometer at Entry is Changed: " + oldVehicle.entry_odometer + " --> " + vehicle.entry_odometer;
            if(vehicle.current_odometer == oldVehicle.entry_odometer ){
                vehicle.current_odometer = vehicle.entry_odometer;
            }
        }

        if (vehicle.km_per_liter != oldVehicle.km_per_liter)
            updates = updates + "\nKilometre per Liter is Changed: " + oldVehicle.km_per_liter + " --> " + vehicle.km_per_liter;

        if (vehicle.music_player != oldVehicle.music_player)
            updates = updates + "\nMusic Player is Changed: " + oldVehicle.music_player + " --> " + vehicle.music_player;

        if (vehicle.usb_charging != oldVehicle.usb_charging)
            updates = updates + "\nUSB Charging is Changed: " + oldVehicle.usb_charging + " --> " + vehicle.usb_charging;

        if (vehicle.rearview_camera != oldVehicle.rearview_camera)
            updates = updates + "\nRearview Camera is Changed: " + oldVehicle.rearview_camera + " --> " + vehicle.rearview_camera;


        if (vehicle.owner_type_id.name != oldVehicle.owner_type_id.name)
            updates = updates + "\nOwner Type is Changed: " + oldVehicle.owner_type_id.name + " --> " + vehicle.owner_type_id.name;

        if (vehicle.owner_name != oldVehicle.owner_name)
            updates = updates + "\nOwner Name is Changed: " + oldVehicle.owner_name + " --> " + vehicle.owner_name;

        if (vehicle.owner_phone != oldVehicle.owner_phone)
            updates = updates + "\nOwner Phone is Changed: " + oldVehicle.owner_phone + " --> " + vehicle.owner_phone;

        if (vehicle.owner_address != oldVehicle.owner_address)
            updates = updates + "\nAddress is Changed: " + oldVehicle.owner_address + " --> " + vehicle.owner_address;

        if (vehicle.revenue_license_exp_date != oldVehicle.revenue_license_exp_date)
            updates = updates + "\nRevenue License Expire Date is Changed: " + oldVehicle.revenue_license_exp_date + " --> " + vehicle.revenue_license_exp_date;

        if (vehicle.insurance_exp_date != oldVehicle.insurance_exp_date)
            updates = updates + "\nInsurance Expire Date is Changed: " + oldVehicle.insurance_exp_date + " --> " + vehicle.insurance_exp_date;

        if (vehicle.next_service_odometer != oldVehicle.next_service_odometer)
            updates = updates + "\nNext Service Odometer is Changed: " + oldVehicle.next_service_odometer + " --> " + vehicle.next_service_odometer;

        if (vehicle.next_service_date != oldVehicle.next_service_date)
            updates = updates + "\nNext Service Date is Changed: " + oldVehicle.next_service_date + " --> " + vehicle.next_service_date;

        if (vehicle.damage_update_date != oldVehicle.damage_update_date)
            updates = updates + "\nDamage Update Date is Changed: " + oldVehicle.damage_update_date + " --> " + vehiNcle.damage_update_date;


        if (vehicle.notes != oldVehicle.notes)
            updates = updates + "\nNotes is Changed: " + oldVehicle.notes + " --> " + vehicle.notes;

        if (vehicle.vehicle_status_id.name != oldVehicle.vehicle_status_id.name)
            updates = updates + "\nVehicle Status is Changed: " + oldVehicle.vehicle_status_id.name + " --> " + vehicle.vehicle_status_id.name;

        if (vehicle.display_photo != oldVehicle.display_photo)
            updates = updates + "\nPhoto is Changed";

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
                        var response = httpRequest("/vehicle", "PUT", vehicle);
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
                            $('#addVehicleModal').modal('hide');
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

function btnDeleteMC(vehi) {
    vehicle = JSON.parse(JSON.stringify(vehi));

        swal({
            title: "Are you sure to delete following vehicle ?",
            text:"\n" + vehicle.model_id.brand_id.name + " " + vehicle.model_id.name + " | " + vehicle.license_plate,
            icon: "warning", buttons: ["Cancel", "Delete"], closeOnClickOutside: false, dangerMode: true,

        }).then((willDelete) => {
            if (willDelete) {
                var responce = httpRequest("/vehicle", "DELETE", vehicle);
                if (responce == 0) {
                    swal({
                        title: "Deleted Successfully....!",
                        text: "\nStatus change to delete",
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

function btnPrintTableMC() {}

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

    if (activerowno != "") selectRow(tblCustomer, activerowno, update);
}

function setImage(id,file,type='image',name='',size='',static=false){
    var field = document.getElementById(id);
    var image = createElement('img');
    image.style.width = "210px";
    image.style.height = "105px";
    image.style.borderRadius = "50px";
    if(type=='image'){
        if(file==null){
            image.src = 'image/no_image.png';
        }else{
            image.src = atob(file);
        }
    }else{
        var icon = new Icon();
        if(type=='.pdf'){
            image.src = icon.pdf;
        }else if(type=='.zip'){
            image.src = icon.zip;
        }else if(type=='.psd'){
            image.src = icon.ps;
        }else if(type=='.doc' || type=='.docx'){
            image.src = icon.doc;
        }else if(type=='.xls' || type=='.xlsx'){
            image.src = icon.xls;
        }else{
            image.src = icon.file;
        }
    }
    field.appendChild(image);
}

function removeImage(id){
    let field = document.getElementById(id);
    let firstChild = field.firstElementChild;
    if(firstChild){
        field.removeChild(firstChild);
    }
}
