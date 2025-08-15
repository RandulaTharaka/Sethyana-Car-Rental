package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.*;
import com.sethyanacarrental.repository.*;
import com.sethyanacarrental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.HashMap;

@RestController
@RequestMapping(value = "/customer_payment")
public class CustomerPaymentController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrivilegeController previlageController;

    @Autowired
    private CustomerPaymentRepository dao;

    @Autowired
    private PaymentStatusRepository daoStatus;

    @Autowired
    private ChauffeurDriveReservationRepository daoCDR;

    @Autowired
    private SelfDriveReservationRepository daoSDR;

    @Autowired
    private VehicleRepository daoVehicle;

    @Autowired
    private DriverRepository daoDriver;


    @GetMapping(value = "/next_pay_invoice_no", produces = "application/json")
    public CustomerPayment nextPayInvoiceNo() {
        String nextPayInvoiceNo = dao.getNextInvoiceNo();
        CustomerPayment nextPayInvoiceCode = new CustomerPayment(nextPayInvoiceNo);
        return nextPayInvoiceCode;
    }

    @GetMapping(value = "/advance_payment", params = {"reservation_id"}, produces = "application/json")
    public CustomerPayment advance_payment(@RequestParam("reservation_id") int reservation_id) {
        return dao.getAdvancePayment(reservation_id);
    }

    @GetMapping(value = "/completed_payment", params = {"reservation_id"}, produces = "application/json")
    public CustomerPayment completed_payment(@RequestParam("reservation_id") int reservation_id) {
        return dao.getCompletedPayment(reservation_id);
    }

    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<CustomerPayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CUSTOMERPAYMENT");

        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<CustomerPayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size,
                                         @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CUSTOMERPAYMENT");

        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


    @Transactional
    @PostMapping
    public String insert(@RequestBody CustomerPayment customerPayment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CUSTOMERPAYMENT");

        if (user != null && priv != null && priv.get("add")) {
            try {
                if (customerPayment.getReservation_type_id().getId() == 1) { //if chauffeur-drive
                    ChauffeurDriveReservation chaufferDriveResv = daoCDR.getById(customerPayment.getChauffeur_drive_reservation_id().getId());
                    chaufferDriveResv.setReservation_status_id(customerPayment.getChauffeur_drive_reservation_id().getReservation_status_id()); //set reservation status - complete
                    chaufferDriveResv.setRental_amount(customerPayment.getChauffeur_drive_reservation_id().getRental_amount()); //set rental amount
                    chaufferDriveResv.setPaid_amount(customerPayment.getChauffeur_drive_reservation_id().getPaid_amount()); //set paid amount
                    chaufferDriveResv.setDue_balance(customerPayment.getChauffeur_drive_reservation_id().getDue_balance()); //set due balance
                    chaufferDriveResv.setPayment_status_id(customerPayment.getChauffeur_drive_reservation_id().getPayment_status_id()); //set payment status
                    daoCDR.save(chaufferDriveResv);

                    Vehicle vehicle = daoVehicle.getById(customerPayment.getChauffeur_drive_reservation_id().getVehicle_id().getId());
                    vehicle.setCurrent_odometer(customerPayment.getChauffeur_drive_reservation_id().getVehicle_id().getCurrent_odometer()); //set vehicle odometer  // incoming customer object has the values // cdObj only retrieve whats in database (db vehicle status has not updated yet)
                    vehicle.setVehicle_status_id(customerPayment.getChauffeur_drive_reservation_id().getVehicle_id().getVehicle_status_id()); //set vehicle status - available // set object to object
                    daoVehicle.save(vehicle);

                    Driver driver = daoDriver.getById(customerPayment.getChauffeur_drive_reservation_id().getDriver_id().getId());
                    driver.setDrove_trip_km(customerPayment.getChauffeur_drive_reservation_id().getDriver_id().getDrove_trip_km());  //set driver drove trip km
                    driver.setLevel(customerPayment.getChauffeur_drive_reservation_id().getDriver_id().getLevel()); // set driver level
                    driver.setDriver_status_id(customerPayment.getChauffeur_drive_reservation_id().getDriver_id().getDriver_status_id()); //set driver status-available
                    daoDriver.save(driver);

                } else if (customerPayment.getReservation_type_id().getId() == 2) { //if self-drive
                    // Update self-drive reservation
                    SelfDriveReservation selfDriveResv = daoSDR.getById(customerPayment.getSelf_drive_reservation_id().getId());
                    if (customerPayment.getPayment_status_id().getId() == 2) { //if check-out payment
                        selfDriveResv.setPick_up_odometer(customerPayment.getSelf_drive_reservation_id().getPick_up_odometer());
                    } else if (customerPayment.getPayment_status_id().getId() == 4) { // If check-in payment
                        selfDriveResv.setReturn_odometer(customerPayment.getSelf_drive_reservation_id().getReturn_odometer());
                        selfDriveResv.setReturn_datetime(customerPayment.getSelf_drive_reservation_id().getReturn_datetime());
                        selfDriveResv.setFinal_rental_days(customerPayment.getSelf_drive_reservation_id().getFinal_rental_days());
                        selfDriveResv.setFinal_additional_hours(customerPayment.getSelf_drive_reservation_id().getFinal_additional_hours());
                        selfDriveResv.setGranted_km(customerPayment.getSelf_drive_reservation_id().getGranted_km());
                        selfDriveResv.setTravelled_km(customerPayment.getSelf_drive_reservation_id().getTravelled_km());
                        selfDriveResv.setAdditional_km(customerPayment.getSelf_drive_reservation_id().getAdditional_km());
                    }
                    selfDriveResv.setReservation_status_id(customerPayment.getSelf_drive_reservation_id().getReservation_status_id()); //set reservation status - on-rent
                    selfDriveResv.setRental_amount(customerPayment.getSelf_drive_reservation_id().getRental_amount()); //set rental amount
                    selfDriveResv.setPaid_amount(customerPayment.getSelf_drive_reservation_id().getPaid_amount()); //set paid amount
                    selfDriveResv.setDue_balance(customerPayment.getSelf_drive_reservation_id().getDue_balance()); //set due balance
                    selfDriveResv.setPayment_status_id(customerPayment.getSelf_drive_reservation_id().getPayment_status_id()); //set payment status
                    daoSDR.save(selfDriveResv);

                    // Update vehicle
                    Vehicle vehicle = daoVehicle.getById(customerPayment.getSelf_drive_reservation_id().getVehicle_id().getId());
                    vehicle.setCurrent_odometer(customerPayment.getSelf_drive_reservation_id().getVehicle_id().getCurrent_odometer()); //set vehicle odometer  // incoming customer object has the values // cdObj only retrieve whats in database (db vehicle status has not updated yet)
                    vehicle.setVehicle_status_id(customerPayment.getSelf_drive_reservation_id().getVehicle_id().getVehicle_status_id()); //set vehicle status - available // set object to object
                    daoVehicle.save(vehicle);
                }
                dao.save(customerPayment);
                return "0"; //if successful, return 0
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }   else {
            return "Error in Saving: You have no Privilege!";
        }

    }

    @PutMapping
    public String update(@RequestBody CustomerPayment customerPayment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CUSTOMERPAYMENT");

        if (user != null && priv != null && priv.get("update")) {
            try {
                dao.save(customerPayment);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Updating: You have no privilege!";
        }

    }

    @DeleteMapping
    public String delete(@RequestBody CustomerPayment customerPayment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CUSTOMERPAYMENT");

        if (user != null && priv != null && priv.get("delete")) {
            try {
                customerPayment.setPayment_status_id(daoStatus.getById(5));
                dao.save(customerPayment);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Complete...." + ex.getMessage();
            }
        } else {
            return "Error in Deleting: You have no privilege!";
        }
    }
}
