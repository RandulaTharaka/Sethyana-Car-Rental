
function vehicleTabCH() {

    // Pick Date
    if (cdReservation.expect_pick_up_datetime != null) {

        datetimeExptPickUpVehicle.value = cdReservation.expect_pick_up_datetime;

        if (oldCDReservation != null && oldCDReservation.expect_pick_up_datetime != cdReservation.expect_pick_up_datetime) {
            // updateF(datetimeExptPickUpVehicle);
            validFF(datetimeExptPickUpVehicle);
        } else {
            validFF(datetimeExptPickUpVehicle);
        }

    }

    // Return Date
    if (cdReservation.package_id != null && cdReservation.expect_pick_up_datetime != null) {

        if (cdReservation.package_id.package_duration_id.package_duration_type_id.name = "Hour") {
            var pkgDurationInTime = new Date(cdReservation.package_id.package_duration_id.name * hour).getTime();
            var ReturnDateInTime = new Date(cdReservation.expect_pick_up_datetime).getTime() + pkgDurationInTime;

        } else if (cdReservation.package_id.package_duration_id.package_duration_type_id.name = "Day") {
            var pkgDurationInTime = new Date(cdReservation.package_id.package_duration_id.name * day).getTime();
            var ReturnDateInTime = new Date(cdReservation.expect_pick_up_datetime).getTime() + pkgDurationInTime;

        }

        datetimeExptReturnVehicle.value = setFieldDate(ReturnDateInTime);

        if (oldCDReservation != null && oldCDReservation.expect_return_datetime != cdReservation.expect_return_datetime) {
            // updateF(datetimeExptReturnVehicle);
            validFF(datetimeExptReturnVehicle);
        } else {
            validFF(datetimeExptReturnVehicle);
        }
    }

}

function cmbVModelCH() {
    cdReservation.vehicle_id = null;
    cdReservation.driver_id = null;

    //Set validity
    if (cmbVModel.value != "") {
        validFF(cmbVModel);
        validFF($(cmbVModel).siblings().children().children('.select2-selection--single'));
    }

    //Fill Vehicle Table according to selected V Model
    if (cdReservation.package_id != null && cdReservation.expect_pick_up_datetime != null && cdReservation.expect_return_datetime != null) {
        vehicles_by_package_pick_return_vmodel = httpRequest("../vehicle/list_by_package_pickdate_returndate_vmodel?package_id=" + cdReservation.package_id.id + "&cdr_expt_pick_date=" + cdReservation.expect_pick_up_datetime + "&cdr_expt_return_date=" + cdReservation.expect_return_datetime + "&v_model_id=" + JSON.parse(cmbVModel.value).id, "GET");

        fillTable('tblAvVehicle', vehicles_by_package_pick_return_vmodel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with customer list
    }

    //~~Change cmbPkgVModel~~//
    if (oldCDReservation == null) {
        var packageTblRowNo = 0;
        for (index in packages) {
            if (packages[index].id == cdReservation.package_id.id) {
                packageTblRowNo = index;
                break;
            }
        }
        //vmodel
        selectedPackageVehicleModels = [];
        for (index in packages[packageTblRowNo].packageHasModelList) {
            selectedPackageVehicleModels.push(packages[packageTblRowNo].packageHasModelList[index].model_id);
        }
    }

    if (cmbVModel.value != "") {
        fillCombo5(cmbPkgVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", JSON.parse(cmbVModel.value).name);
    }
}

function enableDisableVehicleTab() {
    //clear vehicle
    cdReservation.vehicle_id = null;
    initialF(cmbVModel);
    initialF($(cmbVModel).siblings().children().children('.select2-selection--single'));

    //clear driver
    cdReservation.driver_id = null;
    txtDriver.value = "";
    initialF(txtDriver);

    if (cdReservation.expect_pick_up_datetime != null) {
        vehicleTab.classList.remove('tab-disabled'); //enable vehicle tab
        $(vehicleTab).parent().css('pointer-events', '');

        // Vehicle Table
        if (cdReservation.package_id != null && cdReservation.expect_pick_up_datetime != null && cdReservation.expect_return_datetime != null) {
            vehicle_models_by_package_pick_return = httpRequest("../vehicle_model/list_by_package_pickdate_returndate?package_id=" + cdReservation.package_id.id + "&cdr_expt_pick_date=" + cdReservation.expect_pick_up_datetime + "&cdr_expt_return_date=" + cdReservation.expect_return_datetime, "GET");
            vehicles_by_package_pick_return = httpRequest("../vehicle/list_by_package_pickdate_returndate?package_id=" + cdReservation.package_id.id + "&cdr_expt_pick_date=" + cdReservation.expect_pick_up_datetime + "&cdr_expt_return_date=" + cdReservation.expect_return_datetime, "GET");

            if (cmbPkgVModel.value != "") { //if Package VModel Selected
                fillCombo5(cmbVModel, "Nothing selected", vehicle_models_by_package_pick_return, "name", "brand_id.name", JSON.parse(cmbPkgVModel.value).name);

                if (cmbVModel.value != "") {
                    vehicles_by_package_pick_return_vmodel = httpRequest("../vehicle/list_by_package_pickdate_returndate_vmodel?package_id=" + cdReservation.package_id.id + "&cdr_expt_pick_date=" + cdReservation.expect_pick_up_datetime + "&cdr_expt_return_date=" + cdReservation.expect_return_datetime + "&v_model_id=" + JSON.parse(cmbVModel.value).id, "GET");
                    fillTable('tblAvVehicle', vehicles_by_package_pick_return_vmodel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with customer list
                } else {
                    fillTable('tblAvVehicle', vehicles_by_package_pick_return, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle');
                }


            } else {
                fillCombo5(cmbVModel, "Nothing selected", vehicle_models_by_package_pick_return, "name", "brand_id.name", "");
                initialF(cmbVModel);
                initialF($(cmbVModel).siblings().children().children('.select2-selection--single'));

                fillTable('tblAvVehicle', vehicles_by_package_pick_return, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with customer list
            }

        }

    } else {
        vehicleTab.classList.add('tab-disabled');
        $(vehicleTab).parent().css('pointer-events', 'none');
    }
}

//Radio Button Binding Vehicle
function radioBindingFunctionVehicle(ob, rowindex) {
    clearSelection(tblAvVehicle);
    cdReservation.vehicle_id = ob;

    if (oldCDReservation == null || cdReservation.vehicle_id.id == oldCDReservation.vehicle_id.id) {
        selectRow(tblAvVehicle, rowindex, active);

    } else if (cdReservation.vehicle_id.id != oldCDReservation.vehicle_id.id) {
        selectRow(tblAvVehicle, rowindex, update);
    }
}

function updateVehicleTab(){
    fillCombo5(cmbVModel, "Nothing selected", selectedPackageVehicleModels, "name", "brand_id.name", cdReservation.vehicle_id.model_id.name)

    vehicles_by_package_pick_return_vmodel = httpRequest("../vehicle/list_by_package_pickdate_returndate_vmodel?package_id=" + cdReservation.package_id.id + "&cdr_expt_pick_date=" + cdReservation.expect_pick_up_datetime + "&cdr_expt_return_date=" + cdReservation.expect_return_datetime + "&v_model_id=" + JSON.parse(cmbVModel.value).id, "GET");

    fillTable('tblAvVehicle', vehicles_by_package_pick_return_vmodel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with customer list

    var vehicleTblRowNo = 0;

    //table
    if(vehicles_by_package_pick_return_vmodel.length !== 0){
        loopRetrievedVehicleList();
    }else if(vehicleTblRowNo === 0){
        vehicles_by_package_pick_return_vmodel.push(cdReservation.vehicle_id);
        loopRetrievedVehicleList();
        fillTable2('tblAvVehicle', vehicles_by_package_pick_return_vmodel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with vehicle list
    }

    //color previously selected row
    tblAvVehicle.children[1].children[vehicleTblRowNo].style.background = active;
    tblAvVehicle.children[1].children[vehicleTblRowNo].firstChild.firstChild.checked = true;

    //enable driver tab
    driverTab.classList.remove('tab-disabled');
    $(driverTab).parent().css('pointer-events', 'auto');
}