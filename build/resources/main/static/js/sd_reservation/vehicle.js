
function vehicleTabCH() {

    // Pick Date
    if (sdReservation.pick_up_datetime != null) {

        datetimePickUpVehicle.value = sdReservation.pick_up_datetime;

        if (oldSDReservation != null && oldSDReservation.pick_up_datetime != sdReservation.pick_up_datetime) {
            validFF(datetimePickUpVehicle);
        } else {
            validFF(datetimePickUpVehicle);
        }

    }

    // Return Date
    if (sdReservation.package_id != null && sdReservation.pick_up_datetime != null) {
        datetimeExptReturnVehicle.value = sdReservation.expect_return_datetime;

        if (oldSDReservation != null && oldSDReservation.expect_return_datetime != sdReservation.expect_return_datetime) {
            validFF(datetimeExptReturnVehicle);
        } else {
            validFF(datetimeExptReturnVehicle);
        }
    }

}

function cmbVModelCH() {

    sdReservation.vehicle_id = null;

    //Set validity
    if (cmbVModel.value != "") {
        validFF(cmbVModel);
        validFF($(cmbVModel).siblings().children().children('.select2-selection--single'));
    }

    //Fill Vehicle Table according to selected V Model
    if (sdReservation.package_id != null && sdReservation.pick_up_datetime != null && sdReservation.expect_return_datetime != null) {
        vehicles_by_package_pick_return_vmodel = httpRequest("../vehicle/list_by_package_pickdate_returndate_vmodel_sdr?package_id=" + sdReservation.package_id.id + "&sdr_expt_pick_date=" + sdReservation.pick_up_datetime + "&sdr_expt_return_date=" + sdReservation.expect_return_datetime + "&v_model_id=" + JSON.parse(cmbVModel.value).id, "GET");

        fillTable2('tblAvVehicle', vehicles_by_package_pick_return_vmodel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with customer list
    }

    //~~Change cmbPkgVModel~~//
    if (oldSDReservation == null) {
        var packageTblRowNo = 0;
        for (index in packages) {
            if (packages[index].id == sdReservation.package_id.id) {
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
    sdReservation.vehicle_id = null;
    initialF(cmbVModel);
    initialF($(cmbVModel).siblings().children().children('.select2-selection--single'));

    if (sdReservation.pick_up_datetime != null) {
        vehicleTab.classList.remove('tab-disabled'); //enable vehicle tab
        $(vehicleTab).parent().css('pointer-events', '');

        // Vehicle Table
        if (sdReservation.package_id != null && sdReservation.pick_up_datetime != null && sdReservation.expect_return_datetime != null) {
            vehicle_models_by_package_pick_return = httpRequest("../vehicle_model/list_by_package_pickdate_returndate_sdr?package_id=" + sdReservation.package_id.id + "&sdr_expt_pick_date=" + sdReservation.pick_up_datetime + "&sdr_expt_return_date=" + sdReservation.expect_return_datetime, "GET");
            vehicles_by_package_pick_return = httpRequest("../vehicle/list_by_package_pickdate_returndate_sdr?package_id=" + sdReservation.package_id.id + "&sdr_expt_pick_date=" + sdReservation.pick_up_datetime + "&sdr_expt_return_date=" + sdReservation.expect_return_datetime, "GET");

            if (cmbPkgVModel.value != "") { //if Package VModel Selected
                fillCombo5(cmbVModel, "Nothing selected", vehicle_models_by_package_pick_return, "name", "brand_id.name", JSON.parse(cmbPkgVModel.value).name);

                if (cmbVModel.value != "") {
                    vehicles_by_package_pick_return_vmodel = httpRequest("../vehicle/list_by_package_pickdate_returndate_vmodel_sdr?package_id=" + sdReservation.package_id.id + "&sdr_expt_pick_date=" + sdReservation.pick_up_datetime + "&sdr_expt_return_date=" + sdReservation.expect_return_datetime + "&v_model_id=" + JSON.parse(cmbVModel.value).id, "GET");
                    fillTable2('tblAvVehicle', vehicles_by_package_pick_return_vmodel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with customer list
                } else {
                    fillTable2('tblAvVehicle', vehicles_by_package_pick_return, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle');
                }


            } else {
                fillCombo5(cmbVModel, "Nothing selected", vehicle_models_by_package_pick_return, "name", "brand_id.name", "");
                initialF(cmbVModel);
                initialF($(cmbVModel).siblings().children().children('.select2-selection--single'));

                fillTable2('tblAvVehicle', vehicles_by_package_pick_return, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with customer list
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
    sdReservation.vehicle_id = ob;

    if (oldSDReservation == null || sdReservation.vehicle_id.id == oldSDReservation.vehicle_id.id) {
        selectRow(tblAvVehicle, rowindex, active);

    } else if (sdReservation.vehicle_id.id != oldSDReservation.vehicle_id.id) {
        selectRow(tblAvVehicle, rowindex, update);
    }
}

function updateVehicleTab(){
    fillCombo5(cmbVModel, "Nothing selected", selectedPackageVehicleModels, "name", "brand_id.name", sdReservation.vehicle_id.model_id.name)

    vehicles_by_package_pick_return_vmodel = httpRequest("../vehicle/list_by_package_pickdate_returndate_vmodel_sdr?package_id=" + sdReservation.package_id.id + "&sdr_expt_pick_date=" + sdReservation.pick_up_datetime + "&sdr_expt_return_date=" + sdReservation.expect_return_datetime + "&v_model_id=" + JSON.parse(cmbVModel.value).id, "GET");
    fillTable2('tblAvVehicle', vehicles_by_package_pick_return_vmodel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with vehicle list

    var vehicleTblRowNo = 0;
    //table
    if(vehicles_by_package_pick_return_vmodel.length !== 0){
        loopRetrievedVehicleList();
    }else if(vehicleTblRowNo === 0){
        vehicles_by_package_pick_return_vmodel.push(sdReservation.vehicle_id);
        loopRetrievedVehicleList();
        fillTable2('tblAvVehicle', vehicles_by_package_pick_return_vmodel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with vehicle list
    }

    //color previously selected row
    tblAvVehicle.children[1].children[vehicleTblRowNo].style.background = active;
    tblAvVehicle.children[1].children[vehicleTblRowNo].firstChild.firstChild.checked = true;
}

function loopRetrievedVehicleList(){
    for (index in vehicles_by_package_pick_return_vmodel) {
        if (vehicles_by_package_pick_return_vmodel[index].id == oldSDReservation.vehicle_id.id) {
            vehicleTblRowNo = index;
            break;
        }
    }
}

