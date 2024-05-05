
function packageTabCH() {
// Required Details Visibility
    if ((datetimeExptPickUp.value != "" && datetimeExptReturn.value != "") && (txtPickUpLocation.value != "" && txtDropOffLocation.value != "")) {
        divPkgRequired.style.display = "block";

        divRDistance.style.display = "inline";
        spnRDistance.innerHTML = " Km";

        $(divRDuration).addClass('ml-5');
        spnRDuration.innerHTML = getDuration();
        divRDuration.style.display = "inline";

    } else if (datetimeExptPickUp.value != "" && datetimeExptReturn.value != "") {
        divPkgRequired.style.display = "block";

        divRDistance.style.display = "none";

        $(divRDuration).removeClass('ml-5');
        spnRDuration.innerHTML = getDuration();
        divRDuration.style.display = "inline";

    } else if (txtPickUpLocation.value != "" && txtDropOffLocation.value != "") {
        divPkgRequired.style.display = "block";

        divRDistance.style.display = "inline";
        spnRDistance.innerHTML = "47 Km";

        $(divRDuration).removeClass('ml-5');
        divRDuration.style.display = "none";

    } else {
        divPkgRequired.style.display = "none";
        divRDistance.style.display = "none";

        $(divRDuration).removeClass('ml-5');
        divRDuration.style.display = "none";
    }

}

function pkgCategoryClear() { //when click x call this

    cdReservation.package_id = null;
    cdReservation.expect_return_datetime = null;
    cdReservation.vehicle_id = null;
    cdReservation.driver_id = null;

    //set to default combo
    fillCombo5(cmbPkgVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", "");
    fillCombo(cmbPkKm, "Nothing selected", packageKilometers, "package_km", "");
    fillCombo3(cmbPkDuration, "Nothing selected", packageDurations, "name", "package_duration_type_id.name", "");
    fillTable('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    initialF(cmbPkgVModel);
    initialF(cmbPkKm);
    initialF(cmbPkDuration);

    //hide x
    btnXPkgVModel.style.display = "none";
    btnXPkKm.style.display = "none";
    btnXPkDuration.style.display = "none";
}

function pkgVehicleModelClear() { //when click x call this

    cdReservation.package_id = null;
    cdReservation.expect_return_datetime = null;
    cdReservation.vehicle_id = null;
    cdReservation.driver_id = null;

    if (cmbPkCategory.value == "") {  //if package category empty

        //set to default combo
        fillCombo(cmbPkKm, "Nothing selected", packageKilometers, "package_km", "");
        fillCombo3(cmbPkDuration, "Nothing selected", packageDurations, "name", "package_duration_type_id.name", "");
        // fillCombo(cmbPkName, "Nothing selected", packages, "package_name", "");
        fillTable('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

        initialF(cmbPkKm);
        initialF(cmbPkDuration);

        //hide x
        btnXPkKm.style.display = "none";
        btnXPkDuration.style.display = "none";


    } else {  //if package category has value

        //set combos values filtered by package category
        vModelsByPkgCategory = httpRequest("../vehicle_model/list_by_pkg_category?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo5(cmbPkgVModel, "Nothing selected", vModelsByPkgCategory, "name", "brand_id.name", "");

        kilometersByPkgCategory = httpRequest("../package/kilometer_list_by_pkg_category?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo(cmbPkKm, "Nothing selected", kilometersByPkgCategory, "package_km", "");

        durationByPkgCategory = httpRequest("../package_duration/list_by_pkg_category?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo3(cmbPkDuration, "Nothing selected", durationByPkgCategory, "name", "package_duration_type_id.name", "");

        packagesByPkgCategory = httpRequest("../package/list_by_pkg_category?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        // fillCombo(cmbPkName, "Nothing selected", packagesByPkgCategory, "package_name", "");
        fillTable('tblAvPackage', packagesByPkgCategory, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

        initialF(cmbPkKm);
        initialF(cmbPkDuration);

        //hide x
        btnXPkKm.style.display = "none";
        btnXPkDuration.style.display = "none";

    }
}

function pkgKmClear() {

    cdReservation.package_id = null;
    cdReservation.expect_return_datetime = null;
    cdReservation.vehicle_id = null;
    cdReservation.driver_id = null;

    if (cmbPkCategory.value == "" && cmbPkgVModel.value == "") {
        fillTable('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkCategory.value != "" && cmbPkgVModel.value == "") {
        fillTable('tblAvPackage', packagesByPkgCategory, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkgVModel.value != "") {
        fillTable('tblAvPackage', packagesByVModel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    }
}

function pkgDurationClear() {
    cdReservation.package_id = null;
    cdReservation.expect_return_datetime = null;
    cdReservation.vehicle_id = null;
    cdReservation.driver_id = null;

    if (cmbPkCategory.value == "" && cmbPkgVModel.value == "") {
        fillTable('tblAvPackage', packages, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkCategory.value != "" && cmbPkgVModel.value == "") {
        fillTable('tblAvPackage', packagesByPkgCategory, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkgVModel.value != "") {
        fillTable('tblAvPackage', packagesByVModel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    }

}

function cmbPkCategoryCH() {

    cdReservation.package_id = null;
    cdReservation.expect_return_datetime = null;
    cdReservation.vehicle_id = null;
    cdReservation.driver_id = null;

    initialF(cmbPkgVModel);
    initialF(cmbPkKm);
    initialF(cmbPkDuration);
    btnXPkgVModel.style.display = "none";
    btnXPkKm.style.display = "none";
    btnXPkDuration.style.display = "none";

    validFF(cmbPkCategory);

    $(btnXPkCategory).css('margin-left', '-65px'); // x button margin left

    if (cmbPkCategory.value != "") { //if package category selected

        vModelsByPkgCategory = httpRequest("../vehicle_model/list_by_pkg_category?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo5(cmbPkgVModel, "Nothing selected", vModelsByPkgCategory, "name", "brand_id.name", "");

        kilometersByPkgCategory = httpRequest("../package/kilometer_list_by_pkg_category?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo(cmbPkKm, "Nothing selected", kilometersByPkgCategory, "package_km", "");

        durationByPkgCategory = httpRequest("../package_duration/list_by_pkg_category?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillCombo3(cmbPkDuration, "Nothing selected", durationByPkgCategory, "name", "package_duration_type_id.name", "");

        packagesByPkgCategory = httpRequest("../package/list_by_pkg_category?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id, "GET");
        fillTable('tblAvPackage', packagesByPkgCategory, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else { //if package category not selected
        fillCombo(cmbPkName, "Nothing selected", packages, "package_name", "");
    }
}

function cmbPkgVModelCH() {

    cdReservation.package_id = null;
    cdReservation.expect_return_datetime = null;
    cdReservation.vehicle_id = null;
    cdReservation.driver_id = null;

    initialF(cmbPkKm);
    initialF(cmbPkDuration);
    btnXPkKm.style.display = "none";
    btnXPkDuration.style.display = "none";

    validFF(cmbPkgVModel);
    $(btnXPkgVModel).css('margin-left', '-65px')

    if (cmbPkgVModel.value != "") { //if vehiclde model selected
        kilometersByVModel = httpRequest("../package/kilometer_list_by_v_model?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id, "GET");
        fillCombo(cmbPkKm, "Nothing selected", kilometersByVModel, "package_km", "");

        durationByVModel = httpRequest("../package_duration/list_by_v_model?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id, "GET");
        fillCombo3(cmbPkDuration, "Nothing selected", durationByVModel, "name", "package_duration_type_id.name", "");

        packagesByVModel = httpRequest("../package/list_by_v_model?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id, "GET");
        fillTable('tblAvPackage', packagesByVModel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    }
}

function cmbPkKmCH() {

    cdReservation.package_id = null;
    cdReservation.expect_return_datetime = null;
    cdReservation.vehicle_id = null;
    cdReservation.driver_id = null;

    initialF(cmbPkDuration);

    validFF(cmbPkKm);
    $(btnXPkKm).css('margin-left', '-65px')

    cmbPkDuration.value = "";
    btnXPkDuration.style.display = "none";
    // $(cmbPkDuration).val('').change(); //for select2

    if (cmbPkCategory.value == "" && cmbPkgVModel.value == "") { // if package category & vehicle model not selected
        packagesByPkgKm = httpRequest("../package/list_by_pkg_km?pkg_km=" + JSON.parse(cmbPkKm.value).package_km, "GET");
        fillTable('tblAvPackage', packagesByPkgKm, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkCategory.value != "" && cmbPkgVModel.value == "") { // if package category selected & vehicle model not selected
        packagesByPkgCategoryPkgKm = httpRequest("../package/list_by_pkg_category_and_Km?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id + "&pkg_km=" + JSON.parse(cmbPkKm.value).package_km, "GET");
        fillTable('tblAvPackage', packagesByPkgCategoryPkgKm, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkgVModel.value != "") { // if vehicle model selected
        packagesByVModelyPkgKm = httpRequest("../package/list_by_v_model_and_Km?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id + "&pkg_km=" + JSON.parse(cmbPkKm.value).package_km, "GET");
        fillTable('tblAvPackage', packagesByVModelyPkgKm, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    }
}

function cmbPkDurationCH() {

    cdReservation.package_id = null;
    cdReservation.expect_return_datetime = null;
    cdReservation.vehicle_id = null;
    cdReservation.driver_id = null;

    initialF(cmbPkKm);

    validFF(cmbPkDuration);
    $(btnXPkDuration).css('margin-left', '-65px')


    cmbPkKm.value = "";
    btnXPkKm.style.display = "none";

    if (cmbPkCategory.value == "" && cmbPkgVModel.value == "") { // if package category & vehicle model not selected
        ckagesByPkgDuration = httpRequest("../package/list_by_pkg_duration?pkg_duration_id=" + JSON.parse(cmbPkDuration.value).id, "GET");
        fillTable('tblAvPackage', ckagesByPkgDuration, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkCategory.value != "" && cmbPkgVModel.value == "") { // if package category selected & vehicle model not selected
        packagesByPkgCategoryPkgDuration = httpRequest("../package/list_by_pkg_category_and_pkg_duration?pkg_category_id=" + JSON.parse(cmbPkCategory.value).id + "&pkg_duration_id=" + JSON.parse(cmbPkDuration.value).id, "GET");
        fillTable('tblAvPackage', packagesByPkgCategoryPkgDuration, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    } else if (cmbPkgVModel.value != "") { // if vehicle model selected
        packagesByVModelyPkgDuration = httpRequest("../package/list_by_v_model_and_pkg_duration?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id + "&pkg_duration_id=" + JSON.parse(cmbPkDuration.value).id, "GET");
        fillTable('tblAvPackage', packagesByVModelyPkgDuration, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');
    }
}

//Radio Button Binding Package
function radioBindingFunctionPackage(ob, rowindex) {

    clearSelection(tblAvPackage);
    cdReservation.package_id = ob;

    if (oldCDReservation == null || cdReservation.package_id.id == oldCDReservation.package_id.id) {
        selectRow(tblAvPackage, rowindex, active);

    } else if (cdReservation.package_id.id != oldCDReservation.package_id.id) {
        selectRow(tblAvPackage, rowindex, update);
    }


    // Set Reservation Return Date with Selected Package Duration
    if (cdReservation.package_id != null && cdReservation.expect_pick_up_datetime != null) {

        if (cdReservation.package_id.package_duration_id.package_duration_type_id.name = "Hour") {
            var pkgDurationInTime = new Date(cdReservation.package_id.package_duration_id.name * hour).getTime();
            var ReturnDateInTime = new Date(cdReservation.expect_pick_up_datetime).getTime() + pkgDurationInTime;

        } else if (cdReservation.package_id.package_duration_id.package_duration_type_id.name = "Day") {
            var pkgDurationInTime = new Date(cdReservation.package_id.package_duration_id.name * day).getTime();
            var ReturnDateInTime = new Date(cdReservation.expect_pick_up_datetime).getTime() + pkgDurationInTime;
        }

        cdReservation.expect_return_datetime = setFieldDate(ReturnDateInTime);
    }
}

function updatePackageTab(){

    // package vmodel
    fillCombo5(cmbPkgVModel, "Nothing selected", vehicleModels, "name", "brand_id.name", cdReservation.vehicle_id.model_id.name);

    showX('cmbPkgVModel', 'btnXPkgVModel');


    //load table
    packagesByVModel = httpRequest("../package/list_by_v_model?vehicle_model_id=" + JSON.parse(cmbPkgVModel.value).id, "GET");
    fillTable('tblAvPackage', packagesByVModel, fillForm, btnDeleteMC, viewitem, radioBindingFunctionPackage, 'avPackage');

    //table
    packageTblRowNo = 0;
    for (index in packagesByVModel) {
        if (packagesByVModel[index].id == oldCDReservation.package_id.id) {
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