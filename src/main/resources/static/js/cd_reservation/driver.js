
function driverTabCH() {

    // Pick Date
    if (cdReservation.expect_pick_up_datetime != null) {
        if (oldCDReservation != null && oldCDReservation.expect_pick_up_datetime != cdReservation.expect_pick_up_datetime) {
            // updateF(datetimeExptPickUpDriver);
            validFF(datetimeExptPickUpDriver);
        } else {
            validFF(datetimeExptPickUpDriver);
        }
        datetimeExptPickUpDriver.value = cdReservation.expect_pick_up_datetime;
    }

    // Return Date
    if (cdReservation.package_id != null && cdReservation.expect_pick_up_datetime != null) {
        if (cdReservation.package_id.package_duration_id.package_duration_type_id.name = "Hour") {
            var pkgDurationInTime = new Date(cdReservation.package_id.package_duration_id.name * hour).getTime();
            var ReturnDateInTime = new Date(cdReservation.expect_pick_up_datetime).getTime() + pkgDurationInTime;

            datetimeExptReturnDriver.value = setFieldDate(ReturnDateInTime);
            validFF(datetimeExptReturnDriver);
        } else if (cdReservation.package_id.package_duration_id.package_duration_type_id.name = "Day") {
            var pkgDurationInTime = new Date(cdReservation.package_id.package_duration_id.name * day).getTime();
            var ReturnDateInTime = new Date(cdReservation.expect_pick_up_datetime).getTime() + pkgDurationInTime;

            datetimeExptReturnDriver.value = setFieldDate(ReturnDateInTime);
            validFF(datetimeExptReturnDriver);
        }
    }
}

function enableDisableDriverTabs() {
    cdReservation.driver_id = null;
    txtDriver.value = "";
    initialF(txtDriver);

    if (cdReservation.vehicle_id != null) {
        driverTab.classList.remove('tab-disabled');
        $(driverTab).parent().css('pointer-events', 'auto');

        drivers_by_pickdate_returndate = httpRequest("../driver/list_by_pickdate_returndate?cdr_expt_pick_date=" + cdReservation.expect_pick_up_datetime + "&cdr_expt_return_date=" + cdReservation.expect_return_datetime, "GET")
        drivers_by_pickdate_returndate_calling_name_license = httpRequest("../driver/list_by_pickdate_returndate_calling_name_license?cdr_expt_pick_date=" + cdReservation.expect_pick_up_datetime + "&cdr_expt_return_date=" + cdReservation.expect_return_datetime + "&calling_name=" + txtDriver.value + "&license=" + txtDriver.value, "GET");
        fillDrivers(divDrivers, drivers_by_pickdate_returndate_calling_name_license);
    } else {
        driverTab.classList.add('tab-disabled');
        $(driverTab).parent().css('pointer-events', 'none');
    }
}

function txtDriverCH() {
    drivers_by_pickdate_returndate_calling_name_license = httpRequest("../driver/list_by_pickdate_returndate_calling_name_license?cdr_expt_pick_date=" + cdReservation.expect_pick_up_datetime + "&cdr_expt_return_date=" + cdReservation.expect_return_datetime + "&calling_name=" + txtDriver.value + "&license=" + txtDriver.value, "GET");
    fillDrivers(divDrivers, drivers_by_pickdate_returndate_calling_name_license);

    if (txtDriver.value != "") {
        validFF(txtDriver);
    } else {
        initialF(txtDriver);
    }
}

function fillDrivers(divId, obs, onUpdate = false) {
    var divDrivers = divId;

    divDrivers.innerHTML = ""; //clear previous cards before generate new ones

    for (var i = 0; i < obs.length; i++) {
        var ob = obs[i];

        var column = createElement("div");
        column.classList.add("col-md-4");
        var card = createElement("div");
        card.classList.add('card', 'driverCard');
        var cardBody = createElement("div");
        card.classList.add('card-body', 'driverCardBody');
        var row = createElement("div");
        row.classList.add('row', 'justify-content-center');

        //Radio Div
        var colRadio = createElement("div");
        colRadio.classList.add('col-md-1');
        var radio = createElement("input");
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'driverRadioBtn');
        radio.setAttribute('value', JSON.stringify(ob));
        colRadio.appendChild(radio);

        //Image Div
        var colImage = createElement("div");
        colImage.classList.add("col-md-4", "text-center");
        var img = createElement("img");
        img.classList.add('driverImg');
        if (ob.employee_id.photo == null) {
            img.setAttribute('src', 'image/user.jpg');
        } else {
            img.src = atob(ob.employee_id.photo);
        }
        colImage.appendChild(img);

        //Text Box
        var colTextBox = createElement('div');
        colTextBox.classList.add('col-md-7');
        colTextBox.classList.add('driverTextBox');

        var divName = createElement('div');
        divName.innerHTML = "Name : <span class=\'fw-4\'>" + ob.employee_id.callingname + "</span> ";
        var divLicense = createElement('div');
        divLicense.innerHTML = "License No : <span class=\'fw-4\'>" + ob.driving_license + "</span> ";
        var divExpDate = createElement('div');
        divExpDate.innerHTML = "Expire Date : <span class=\'fw-4\'>" + ob.license_exp_date + "</span> ";

        //Age Div
        var divAge = createElement('div');
        var dob = new Date(ob.employee_id.dobirth);
        var currentDate = Date.now(); //result in #ms since 1970
        var difference = currentDate - dob.getTime(); //result in ms
        var ageDate = new Date(difference); //get the Date of difference
        var age = Math.abs(ageDate.getUTCFullYear() - 1970); // get the Year of difference minus 1970
        divAge.innerHTML = "Age : <span class=\'fw-4\'>" + age + "</span> ";

        //Star Div
        var divLevel = createElement('div');
        divLevel.classList.add('text-tertiary')
        for (var x = 1; x <= ob.level; x++) {
            var itag = createElement('i');
            itag.classList.add('fas', 'fa-star', 'mr-1');
            divLevel.appendChild(itag);
        }

        colTextBox.appendChild(divName);
        colTextBox.appendChild(divLicense);
        colTextBox.appendChild(divExpDate);
        colTextBox.appendChild(divAge);
        colTextBox.appendChild(divLevel);

        row.appendChild(colRadio);
        row.appendChild(colImage);
        row.appendChild(colTextBox);

        cardBody.appendChild(row);
        card.appendChild(cardBody);
        column.appendChild(card);
        divDrivers.appendChild(column);

        if (onUpdate) {
            //color default driver on update
            if (oldCDReservation != null && oldCDReservation.driver_id.id == obs[i].id) {
                radio.checked = true;
                $(radio).parent().parent().parent().parent().addClass("card-active");
            }
        }
    }
    selectDriver()
}

function selectDriver() {
    if (document.querySelectorAll("input[name='driverRadioBtn']")) {
        radioButtons = document.querySelectorAll("input[name='driverRadioBtn']");
        for (var r = 0; r < radioButtons.length; r++) { //loop through all Radios
            radioButtons[r].addEventListener("change", function () {
                var selectedRadioBtn = JSON.parse(this.value);
                cdReservation.driver_id = selectedRadioBtn;

                clearSelectedDriver();
                if (oldCDReservation == null || oldCDReservation.driver_id.id == cdReservation.driver_id.id) {
                    $(this).parent().parent().parent().parent().addClass("card-active"); //active color
                } else if (oldCDReservation != null && oldCDReservation.driver_id.id != cdReservation.driver_id.id) {
                    $(this).parent().parent().parent().parent().addClass("card-update"); //active color
                }
                // $(this).parent().parent().parent().parent().addClass("card-active"); //active color

            });
        }
    }
}

function clearSelectedDriver() {
    for (var r = 0; r < radioButtons.length; r++) {
        $(radioButtons[r]).parent().parent().parent().parent().removeClass("card-active");
        $(radioButtons[r]).parent().parent().parent().parent().removeClass("card-update");
    }
}

function updateDriverTab(){
    drivers_by_pickdate_returndate_calling_name_license = httpRequest("../driver/list_by_pickdate_returndate_calling_name_license?cdr_expt_pick_date=" + cdReservation.expect_pick_up_datetime + "&cdr_expt_return_date=" + cdReservation.expect_return_datetime + "&calling_name=" + txtDriver.value + "&license=" + txtDriver.value, "GET");
    fillDrivers(divDrivers, drivers_by_pickdate_returndate_calling_name_license, true);
}
