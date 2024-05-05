
// On Change Customer Type
function cmbCustomerTypeNewCH() {
    cdReservation.customer_id = null;

    // Customer Enable & Cursor Allow
    cmbCustomer.disabled = false;
    $(cmbCustomer).siblings().children().children('.select2-selection--single').css('cursor', 'default');

    //set Customer Field Initial
    initialF(cmbCustomer);
    initialF($(cmbCustomer).siblings().children().children('.select2-selection--single'));
    validF(cmbCustomerTypeNew);

    //fillCombo
    if (JSON.parse(cmbCustomerTypeNew.value).name == "Individual") {
        fillCombo7(cmbCustomer, "Select Customer", individualCustomers, "first_name", "last_name", "nic", "");
    } else if (JSON.parse(cmbCustomerTypeNew.value).name == "Company") {
        fillCombo(cmbCustomer, "Select Customer", companyCustomers, "company_name", "");
    }

    //hide and clear Customer Info
    $(customerInfoDiv).collapse('hide');
    clearFieldsCtm();
}

//On Change Customer
function cmbCustomerCH(saveMesssage = false) {

    //set validF/ updateF
    if (oldCDReservation != null && oldCDReservation.customer_id.id != JSON.parse(cmbCustomer.value).id /*|| (oldCDReservation.customer_id.customer_type_id.name != cmbCustomerTypeNew.value)*/) {
        updateF(cmbCustomer);
        updateF($(cmbCustomer).siblings().children().children('.select2-selection--single'));

    } else {
        validF(cmbCustomer);
        validF($(cmbCustomer).siblings().children().children('.select2-selection--single'));
    }

    clearFieldsCtm();

    //create two object for comparison
    customer = JSON.parse(cmbCustomer.value);
    oldCustomer = JSON.parse(cmbCustomer.value);

    customerInfo.innerHTML = "<i class=\"fas fa-user mr-1\"></i>Customer Info";
    $(btnCtmSave).removeClass("btn-primary");
    $(btnCtmSave).addClass("btn-tertiary");


    //If Customer Individual Show Fields
    if (JSON.parse(cmbCustomer.value).customer_type_id.name == "Individual") {

        //Set values to fields

        fillCombo(cmbCustomerType, "Select Customer Type", customerTypes, "name", JSON.parse(cmbCustomer.value).customer_type_id.name);
        txtRegisterNo.value = JSON.parse(cmbCustomer.value).register_no;
        txtNIC.value = JSON.parse(cmbCustomer.value).nic;
        txtFirstName.value = JSON.parse(cmbCustomer.value).first_name;
        txtLastName.value = JSON.parse(cmbCustomer.value).last_name;
        txtPhone.value = JSON.parse(cmbCustomer.value).phone;
        txtEmail.value = JSON.parse(cmbCustomer.value).email;
        txtAddress.value = JSON.parse(cmbCustomer.value).address;

        //Set Border Color
        validF(txtRegisterNo);
        validF(txtNIC);
        validF(txtRegisterNo);
        validF(txtFirstName);
        validF(txtLastName);
        validF(txtPhone);
        validF(txtEmail);
        validF(txtAddress);

        //optional fields color
        if (customer.txtEmail == null) {
            initialF(txtEmail);
        }

        $(divNic).css("order", 10);

        //Show Individual Div
        showIndividual();
        divCustomerSave.style.display = "none";


        //If Customer Company Show Fields
    } else if ((JSON.parse(cmbCustomer.value).customer_type_id.name == "Company")) {

        //Set values to fields
        fillCombo(cmbCustomerType, "Select Customer Type", customerTypes, "name", JSON.parse(cmbCustomer.value).customer_type_id.name);
        txtRegisterNo.value = JSON.parse(cmbCustomer.value).register_no;
        txtCompanyName.value = JSON.parse(cmbCustomer.value).company_name;
        txtCompanyPhone.value = JSON.parse(cmbCustomer.value).company_phone;
        txtCompanyEmail.value = JSON.parse(cmbCustomer.value).company_email;
        txtContactPersonName.value = JSON.parse(cmbCustomer.value).contact_person_name;
        txtContactPersonPhone.value = JSON.parse(cmbCustomer.value).contact_person_phone;
        txtCompanyAddress.value = JSON.parse(cmbCustomer.value).company_address;

        //Set Border Color
        validF(txtRegisterNo);
        validF(txtCompanyName);
        validF(txtCompanyPhone);
        validF(txtCompanyEmail);
        validF(txtContactPersonName);
        validF(txtContactPersonPhone);
        validF(txtCompanyAddress);


        //optional fields color
        if (customer.company_email == null) {
            initialF(txtCompanyEmail);
        }

        if (customer.contact_person_name == null) {
            initialF(txtContactPersonName);
        }

        if (customer.contact_person_phone == null) {
            initialF(txtContactPersonPhone);
        }

        //Show Company Fields Div
        showCompany();
        divCustomerSave.style.display = "none";
    }

    //Save Message
    divSaveMessage.style.display = 'none';
    if (saveMesssage) {
        divSaveMessage.style.display = 'block';
    }

}

//On Change New Customer
function lnkNewCustomerCH() {
    cdReservation.customer_id = null;

    divSaveMessage.style.display = "none";

    //Clear Fields//
    cmbCustomerTypeNew.value = "";
    initialF(cmbCustomerTypeNew);

    fillCombo7(cmbCustomer, "Select Customer", individualCustomers, "first_name", "last_name", "nic", "");
    initialF(cmbCustomer);
    initialF($(cmbCustomer).siblings().children().children('.select2-selection--single'));
    cmbCustomer.disabled = true;
    $(cmbCustomer).siblings().children().children('.select2-selection--single').css('cursor', 'not-allowed');

    clearFieldsCtm();

    //Show Fields//
    fillCombo(cmbCustomerType, "Select Customer Type", customerTypes, "name", "");
    $(divNic).css("order", 10);

    //Bind next reg no
    var customerObj = httpRequest("../customer/customer_reg_no", "GET");
    txtRegisterNo.value = customerObj.register_no;
    customer.register_no = txtRegisterNo.value;
    txtRegisterNo.disabled = true;
    validF(txtRegisterNo);

    customerInfo.innerHTML = "<i class=\"fas fa-user-plus mr-1\"></i>New Customer";

    $(btnCtmSave).removeClass("btn-tertiary");
    $(btnCtmSave).addClass("btn-primary");

    showIndividual();
    divCustomerType.style.display = "block";
}

function cmbCustomerTypeCH() {
    clearFieldsCtm(false);

    //Binding Required Attributes
    customer.added_date = getCurrentDateTime('date');
    customer.customer_status_id = {id: 1, name: 'Available'}
    customer.employee_id = session.getObject('activeuser').employeeId

    if (JSON.parse(cmbCustomerType.value).name == "Individual") {
        // clearFieldsCtm(false);
        showIndividual();
        divCustomerType.style.display = "block";

        //Binding Required Attribute
        customer.customer_type_id = {id: 1, name: 'Individual'};


    } else if (JSON.parse(cmbCustomerType.value).name == "Company") {
        showCompany();
        divCustomerType.style.display = "block";

        //Binding Required Attribute
        customer.customer_type_id = {id: 2, name: "Company"};
    }
}

function showIndividual() {
    divCustomerType.style.display = "none";

    divCompanyName.style.display = "none";
    divCompanyPhone.style.display = "none";
    divCompanyEmail.style.display = "none";
    divCPName.style.display = "none";
    divCPPhone.style.display = "none";
    divCompanyAddress.style.display = "none";

    divNic.style.display = "block";
    divFirstName.style.display = "block";
    divLastName.style.display = "block";
    divPhone.style.display = "block";
    divEmail.style.display = "block";
    divIndividualAddress.style.display = "block";

    divCustomerSave.style.display = "block";

    $(customerInfoDiv).collapse('show');
}

function showCompany() {
    divCustomerType.style.display = "none";

    divNic.style.display = "none";
    divFirstName.style.display = "none";
    divLastName.style.display = "none";
    divPhone.style.display = "none";
    divEmail.style.display = "none";
    divIndividualAddress.style.display = "none";

    divCompanyName.style.display = "block";
    divCompanyPhone.style.display = "block";
    divCompanyEmail.style.display = "block";
    divCPName.style.display = "block";
    divCPPhone.style.display = "block";
    divCompanyAddress.style.display = "block";

    divCustomerSave.style.display = "block";
    $(customerInfoDiv).collapse('show');
}

function clearFieldsCtm(cleaCustomerType = true) {
    //Clear Values

    if (cleaCustomerType) {
        cmbCustomerType.value = "";
        initialF(cmbCustomerType);
    }
    txtFirstName.value = "";
    txtLastName.value = "";
    txtNIC.value = "";
    txtPhone.value = "";
    txtEmail.value = "";
    txtAddress.value = "";

    txtCompanyName.value = "";
    txtCompanyPhone.value = "";
    txtCompanyEmail.value = "";
    txtContactPersonName.value = "";
    txtContactPersonPhone.value = "";
    txtCompanyAddress.value = "";

    initialF(txtFirstName);
    initialF(txtLastName);
    initialF(txtNIC);
    initialF(txtPhone);
    initialF(txtEmail);
    initialF(txtAddress);
    initialF(txtCompanyName);
    initialF(txtCompanyPhone);
    initialF(txtCompanyEmail);
    initialF(txtContactPersonName);
    initialF(txtContactPersonPhone);
    initialF(txtCompanyAddress);

    //Unbind
    customer = new Object();
    oldCustomer = null; // so doesn't get updated
}


//Get Errors for Customer
function getErrorsCtm() {

    var errors = "";
    addvalue = ""; // if value = 1 ask for confirmation on Clear

    //check errors by bind item property value
    if (customer.register_no == null) {
        customer.register_no = txtRegisterNo.value; //when new customer create and while changing customer type object set to null, so need to set here
    }

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

    return errors;

}

//Save Customer
function btnCtmSaveCL() {
    if (getErrorsCtm() == "") {

        var response = httpRequest("/customer", "PUT", customer); //Put: update

        if (response == "0") { //message 0: means successful
            swal({
                position: 'center',
                icon: 'success',
                title: 'Customer Save Successfully',
                text: '\n',
                button: false,
                timer: 1700
            });

            //If Successfully Saved//

            divCustomerSave.style.display = "none"; //hide save button

            var listReg = 'register_no';
            var ctmReg = customer.register_no;

            //If Individual
            if (JSON.parse(cmbCustomerType.value).name == "Individual") {

                individualCustomers = httpRequest("../customer/list_individual", "GET");

                for (index in individualCustomers) { //loop through newly requested list AND match newly added customer AND Recall Customer Combo, Customer Type

                    if (individualCustomers[index][listReg] = ctmReg) {

                        fillCombo(cmbCustomerTypeNew, "Select Customer Type", customerTypes, "name", individualCustomers[index]['customer_type_id']['name']); // Customer Type Refil

                        cmbCustomer.disabled = false;
                        cmbCustomer.style.cursor = 'pointer';
                        fillCombo8(cmbCustomer, "Select Customer", individualCustomers, "first_name", "last_name", "nic", listReg, ctmReg); // Customer Field Refill
                        cmbCustomerCH(true);

                        break;
                    }
                }

                //If Company
            } else if (JSON.parse(cmbCustomerType.value).name == "Company") {

                companyCustomers = httpRequest("../customer/list_company", "GET");

                for (index in companyCustomers) { //loop through newly requested list AND match newly added customer AND Recall Customer Combo, Customer Type

                    if (companyCustomers[index][listReg] = ctmReg) {

                        fillCombo(cmbCustomerTypeNew, "Select Customer Type", customerTypes, "name", companyCustomers[index]['customer_type_id']['name']); // Customer Type Refil

                        cmbCustomer.disabled = false;
                        cmbCustomer.style.cursor = 'pointer';
                        fillCombo9(cmbCustomer, "Select Customer", companyCustomers, "company_name", listReg, ctmReg);
                        cmbCustomerCH(true);

                        break;
                    }
                }
            }

            //    If save not success
        } else swal({
            title: 'Save not Success... , You have following errors',
            icon: "error",
            text: '\n ' + response,
            button: true
        });


        //    If get errors has errors
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrorsCtm(),
            icon: "error",
            button: true,
        });

    }
}

function updateCustomerTab(){
    fillCombo(cmbCustomerTypeNew, "Select Customer Type", customerTypes, "name", oldCDReservation.customer_id.customer_type_id.name); // Customer Type Refil

    if (JSON.parse(cmbCustomerTypeNew.value).name == "Individual") {
        fillCombo7(cmbCustomer, "Select Customer", individualCustomers, "first_name", "last_name", "nic", oldCDReservation.customer_id.first_name);
    } else if (JSON.parse(cmbCustomerTypeNew.value).name == "Company") {
        fillCombo(cmbCustomer, "Select Customer", companyCustomers, "company_name", oldCDReservation.customer_id.company_name);
    }

    validF($(cmbCustomer).siblings().children().children('.select2-selection--single'));
    $(cmbCustomer).siblings().children().children('.select2-selection--single').css('cursor', 'default');
    cmbCustomer.disabled = false;
    cmbCustomerCH();
}
