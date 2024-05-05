
function clearPackageVehicleTab() {
    sdReservation.package_id = null;
    sdReservation.package_price = undefined;
    sdReservation.additional_hour_price = undefined;
    sdReservation.additional_km_price = undefined;
    sdReservation.package_km = undefined;
    sdReservation.vehicle_id = null;

    //clear package
    fillCombo(cmbPkCategory, "Nothing selected", packageCategories, "name", "");
    fillCombo5(cmbPkgVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", "");
    fillCombo(cmbPkKm, "Nothing selected", packageKilometers, "package_km", "");
    fillCombo3(cmbPkDuration, "Nothing selected", packageDurations, "name", "package_duration_type_id.name", "");
    fillTable2('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    clearSelection(tblAvPackage);
    pkgCategoryClear();
    initialF(cmbPkCategory);
    btnXPkCategory.style.display = "none";

    //clear vehicle
    fillCombo5(cmbVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", "");
    initialF(cmbVModel);
    initialF($(cmbVModel).siblings().children().children('.select2-selection--single'));
    fillTable2('tblAvVehicle', vehicles, fillForm, btnDeleteMC, viewitem, radioBindingFunctionVehicle, 'avVehicle'); //fill the table with customer list

}
function pkgCategoryClear() { //when click x call this

    sdReservation.package_id = null;
    sdReservation.package_price = undefined;
    sdReservation.additional_hour_price = undefined;
    sdReservation.additional_km_price = undefined;
    sdReservation.package_km = undefined;
    // sdReservation.expect_return_datetime = null;
    sdReservation.vehicle_id = null;
    // sdReservation.driver_id = null;

    //set to default combo
    fillCombo5(cmbPkgVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", "");
    fillCombo(cmbPkKm, "Nothing selected", packageKilometers, "package_km", "");
    fillCombo3(cmbPkDuration, "Nothing selected", packageDurations, "name", "package_duration_type_id.name", "");
    fillTable2('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    initialF(cmbPkgVModel);
    initialF(cmbPkKm);
    initialF(cmbPkDuration);

    //hide x
    btnXPkgVModel.style.display = "none";
    btnXPkKm.style.display = "none";
    btnXPkDuration.style.display = "none";
}

function pkgVehicleModelClear() { //when click x call this

    sdReservation.package_id = null;
    sdReservation.package_price = undefined;
    sdReservation.additional_hour_price = undefined;
    sdReservation.additional_km_price = undefined;
    sdReservation.package_km = undefined;
    sdReservation.vehicle_id = null;

    if (cmbPkCategory.value == "") {  //if package category empty

        //set to default combo
        fillCombo(cmbPkKm, "Nothing selected", packageKilometers, "package_km", "");
        fillCombo3(cmbPkDuration, "Nothing selected", packageDurations, "name", "package_duration_type_id.name", "");
        // fillCombo(cmbPkName, "Nothing selected", packages, "package_name", "");
        fillTable2('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

        initialF(cmbPkKm);
        initialF(cmbPkDuration);

        //hide x
        btnXPkKm.style.display = "none";
        btnXPkDuration.style.display = "none";


    } else {  //if package category has value

        //set combos values filtered by package category
        vModelsByPkgCategory = httpRequest("../vehicle_model/list_by_pkg_category_sdr?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo5(cmbPkgVModel, "Nothing selected", vModelsByPkgCategory, "name", "brand_id.name", "");

        kilometersByPkgCategory = httpRequest("../package/kilometer_list_by_pkg_category_sdr?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo(cmbPkKm, "Nothing selected", kilometersByPkgCategory, "package_km", "");

        durationByPkgCategory = httpRequest("../package_duration/list_by_pkg_category_sdr?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo3(cmbPkDuration, "Nothing selected", durationByPkgCategory, "name", "package_duration_type_id.name", "");

        packagesByPkgCategory = httpRequest("../package/list_by_pkg_category_sdr?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        // fillCombo(cmbPkName, "Nothing selected", packagesByPkgCategory, "package_name", "");
        fillTable2('tblAvPackage', packagesByPkgCategory, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

        initialF(cmbPkKm);
        initialF(cmbPkDuration);

        //hide x
        btnXPkKm.style.display = "none";
        btnXPkDuration.style.display = "none";

    }
}

function pkgKmClear() {

    sdReservation.package_id = null;
    sdReservation.package_price = undefined;
    sdReservation.additional_hour_price = undefined;
    sdReservation.additional_km_price = undefined;
    sdReservation.package_km = undefined;
    sdReservation.vehicle_id = null;

    if (cmbPkCategory.value == "" && cmbPkgVModel.value == "") {
        fillTable2('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkCategory.value != "" && cmbPkgVModel.value == "") {
        fillTable2('tblAvPackage', packagesByPkgCategory, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkgVModel.value != "") {
        fillTable2('tblAvPackage', packagesByVModel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    }
}

function pkgDurationClear() {
    sdReservation.package_id = null;
    sdReservation.package_price = undefined;
    sdReservation.additional_hour_price = undefined;
    sdReservation.additional_km_price = undefined;
    sdReservation.package_km = undefined;
    sdReservation.vehicle_id = null;

    if (cmbPkCategory.value == "" && cmbPkgVModel.value == "") {
        fillTable2('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkCategory.value != "" && cmbPkgVModel.value == "") {
        fillTable2('tblAvPackage', packagesByPkgCategory, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkgVModel.value != "") {
        fillTable2('tblAvPackage', packagesByVModel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    }

}

function cmbPkCategoryCH() {

    sdReservation.package_id = null;
    sdReservation.package_price = undefined;
    sdReservation.additional_hour_price = undefined;
    sdReservation.additional_km_price = undefined;
    sdReservation.package_km = undefined;
    sdReservation.vehicle_id = null;

    initialF(cmbPkgVModel);
    initialF(cmbPkKm);
    initialF(cmbPkDuration);
    btnXPkgVModel.style.display = "none";
    btnXPkKm.style.display = "none";
    btnXPkDuration.style.display = "none";

    validFF(cmbPkCategory);

    $(btnXPkCategory).css('margin-left', '-65px'); // x button margin left

    if (cmbPkCategory.value != "") { //if package category selected

        vModelsByPkgCategory = httpRequest("../vehicle_model/list_by_pkg_category_sdr?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo5(cmbPkgVModel, "Nothing selected", vModelsByPkgCategory, "name", "brand_id.name", "");

        kilometersByPkgCategory = httpRequest("../package/kilometer_list_by_pkg_category_sdr?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo(cmbPkKm, "Nothing selected", kilometersByPkgCategory, "package_km", "");

        durationByPkgCategory = httpRequest("../package_duration/list_by_pkg_category_sdr?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo3(cmbPkDuration, "Nothing selected", durationByPkgCategory, "name", "package_duration_type_id.name", "");

        packagesByPkgCategory = httpRequest("../package/list_by_pkg_category_sdr?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillTable2('tblAvPackage', packagesByPkgCategory, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else { //if package category not selected
        fillCombo(cmbPkName, "Nothing selected", packages, "package_name", "");
    }
}

function cmbPkgVModelCH() {

    sdReservation.package_id = null;
    sdReservation.package_price = undefined;
    sdReservation.additional_hour_price = undefined;
    sdReservation.additional_km_price = undefined;
    sdReservation.package_km = undefined;
    sdReservation.vehicle_id = null;

    initialF(cmbPkKm);
    initialF(cmbPkDuration);
    btnXPkKm.style.display = "none";
    btnXPkDuration.style.display = "none";

    validFF(cmbPkgVModel);
    $(btnXPkgVModel).css('margin-left', '-65px')

    if (cmbPkgVModel.value != "") { //if vehiclde model selected
        kilometersByVModel = httpRequest("../package/kilometer_list_by_v_model_sdr?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id, "GET");
        fillCombo(cmbPkKm, "Nothing selected", kilometersByVModel, "package_km", "");

        durationByVModel = httpRequest("../package_duration/list_by_v_model_sdr?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id, "GET");
        fillCombo3(cmbPkDuration, "Nothing selected", durationByVModel, "name", "package_duration_type_id.name", "");

        packagesByVModel = httpRequest("../package/list_by_v_model_sdr?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id, "GET");
        fillTable2('tblAvPackage', packagesByVModel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    }
}

function cmbPkKmCH() {

    sdReservation.package_id = null;
    sdReservation.package_price = undefined;
    sdReservation.additional_hour_price = undefined;
    sdReservation.additional_km_price = undefined;
    sdReservation.package_km = undefined;
    sdReservation.vehicle_id = null;

    initialF(cmbPkDuration);

    validFF(cmbPkKm);
    $(btnXPkKm).css('margin-left', '-65px')

    cmbPkDuration.value = "";
    btnXPkDuration.style.display = "none";

    if (cmbPkCategory.value == "" && cmbPkgVModel.value == "") { // if package category & vehicle model not selected
        packagesByPkgKm = httpRequest("../package/list_by_pkg_km_sdr?pkg_km=" + JSON.parse(cmbPkKm.value).package_km, "GET");
        fillTable2('tblAvPackage', packagesByPkgKm, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkCategory.value != "" && cmbPkgVModel.value == "") { // if package category selected & vehicle model not selected
        packagesByPkgCategoryPkgKm = httpRequest("../package/list_by_pkg_category_and_Km_sdr?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id + "&pkg_km=" + JSON.parse(cmbPkKm.value).package_km, "GET");
        fillTable2('tblAvPackage', packagesByPkgCategoryPkgKm, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkgVModel.value != "") { // if vehicle model selected
        packagesByVModelPkgKm = httpRequest("../package/list_by_v_model_and_Km_sdr?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id + "&pkg_km=" + JSON.parse(cmbPkKm.value).package_km, "GET");
        fillTable2('tblAvPackage', packagesByVModelPkgKm, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    }

}

function cmbPkDurationCH() {

    sdReservation.package_id = null;
    sdReservation.package_price = undefined;
    sdReservation.additional_hour_price = undefined;
    sdReservation.additional_km_price = undefined;
    sdReservation.package_km = undefined;
    sdReservation.vehicle_id = null;

    initialF(cmbPkKm);

    validFF(cmbPkDuration);
    $(btnXPkDuration).css('margin-left', '-65px')


    cmbPkKm.value = "";
    btnXPkKm.style.display = "none";

    if (cmbPkCategory.value == "" && cmbPkgVModel.value == "") { // if package category & vehicle model not selected
        ckagesByPkgDuration = httpRequest("../package/list_by_pkg_duration_sdr?pkg_duration_id=" + JSON.parse(cmbPkDuration.value).id, "GET");
        fillTable2('tblAvPackage', ckagesByPkgDuration, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkCategory.value != "" && cmbPkgVModel.value == "") { // if package category selected & vehicle model not selected
        packagesByPkgCategoryPkgDuration = httpRequest("../package/list_by_pkg_category_and_pkg_duration_sdr?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id + "&pkg_duration_id=" + JSON.parse(cmbPkDuration.value).id, "GET");
        fillTable2('tblAvPackage', packagesByPkgCategoryPkgDuration, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkgVModel.value != "") { // if vehicle model selected
        packagesByVModelyPkgDuration = httpRequest("../package/list_by_v_model_and_pkg_duration_sdr?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id + "&pkg_duration_id=" + JSON.parse(cmbPkDuration.value).id, "GET");
        fillTable2('tblAvPackage', packagesByVModelyPkgDuration, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    }
}

//Radio Button Binding Package
function radioBindingFunctionPackage(ob, rowindex) {
    clearSelection(tblAvPackage);
    sdReservation.package_id = ob;
    sdReservation.package_price = ob.package_price;
    sdReservation.additional_hour_price = ob.additional_hour_price;
    sdReservation.additional_km_price = ob.additional_km_price;
    sdReservation.package_km = ob.package_km;

    if (oldSDReservation == null || sdReservation.package_id.id == oldSDReservation.package_id.id) {
        selectRow(tblAvPackage, rowindex, active);

    } else if (sdReservation.package_id.id != oldSDReservation.package_id.id) {
        selectRow(tblAvPackage, rowindex, update);
    }

}

function updatePackageTab(){

    // package vmodel
    fillCombo5(cmbPkgVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", sdReservation.vehicle_id.model_id.name);

    showX('cmbPkgVModel', 'btnXPkgVModel');


    //load table
    packagesByVModel = httpRequest("../package/list_by_v_model_sdr?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id, "GET");
    fillTable2('tblAvPackage', packagesByVModel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    //table
    packageTblRowNo = 0;
    for (index in packagesByVModel) {
        if (packagesByVModel[index].id == oldSDReservation.package_id.id) {
            packageTblRowNo = index;
            break;
        }
    }

    // vmodel
    selectedPackageVehicleModels = [];
    for (index in packagesByVModel[packageTblRowNo].packageHasModelList) {
        selectedPackageVehicleModels.push(packagesByVModel[packageTblRowNo].packageHasModelList[index].model_id);
    }

    //color previously selected row
    tblAvPackage.children[1].children[packageTblRowNo].style.background = active;
    tblAvPackage.children[1].children[packageTblRowNo].firstChild.firstChild.checked = true;

    //enable driver tab
    vehicleTab.classList.remove('tab-disabled');
    $(vehicleTab).parent().css('pointer-events', 'auto');

}