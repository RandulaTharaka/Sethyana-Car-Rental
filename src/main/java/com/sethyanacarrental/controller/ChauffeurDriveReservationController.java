package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.ChauffeurDriveReservation;
import com.sethyanacarrental.model.Driver;
import com.sethyanacarrental.model.User;
import com.sethyanacarrental.model.Vehicle;
import com.sethyanacarrental.repository.ChauffeurDriveReservationRepository;
import com.sethyanacarrental.repository.DriverRepository;
import com.sethyanacarrental.repository.ReservationStatusRepository;
import com.sethyanacarrental.repository.VehicleRepository;
import com.sethyanacarrental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/cd_reservation")
public class ChauffeurDriveReservationController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrivilegeController previlageController;

    @Autowired
    private ChauffeurDriveReservationRepository dao;

    @Autowired
    private ReservationStatusRepository daoStatus;

    @Autowired
    private VehicleRepository daoVehicle;

    @Autowired
    private DriverRepository daoDriver;

    @GetMapping(value = "/next_cdreservation_code", produces = "application/json")
    public ChauffeurDriveReservation listNextCDReservationCode() {
        String nextCDRCode = dao.getNextCDRCode();
        ChauffeurDriveReservation nextCDReservationCode = new ChauffeurDriveReservation(nextCDRCode);
        return nextCDReservationCode;
    }

    @GetMapping(value = "/list_by_vehicle", params = {"vehicle_id"}, produces = "application/json")
    public List<ChauffeurDriveReservation> cdrListByVehicle(@RequestParam("vehicle_id") int vehicle_id) {
        return dao.listByVehicle(vehicle_id);
    }

    @GetMapping(value = "/on_going_list_by_vehicle", params = {"vehicle_id"}, produces = "application/json")
    public List<ChauffeurDriveReservation> chauffeurDriveReservationListByVehicleID(@RequestParam("vehicle_id") int vehicle_id) {
        return dao.listByVehicleID(vehicle_id);
    }

    @GetMapping(value = "/coming_up_reserved_list_by_vehicle_and_returned_time",
            params = {"vehicle_id", "returned_datetime"}, produces = "application/json")
    public List<ChauffeurDriveReservation> chauffeurDriveReservationReservedListByVehicleIDAndReturnedDateTime(
            @RequestParam("vehicle_id") int vehicle_id, @RequestParam("returned_datetime") String returned_datetime) {
        return dao.reservedListByVehicleIDAndReturnedDateTime(vehicle_id, LocalDateTime.parse(returned_datetime));
    }


    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<ChauffeurDriveReservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @GetMapping(value = "/findAllByDriver", params = {"page", "size", "searchtext", "userid"}, produces = "application/json")
    public Page<ChauffeurDriveReservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size,
                                                   @RequestParam("searchtext") String searchtext, @RequestParam("userid") int userid) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext, userid, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<ChauffeurDriveReservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size,
                                                   @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "VEHICLE");

        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @PostMapping
    public String insert(@RequestBody ChauffeurDriveReservation cd_reservation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        if (user != null && priv != null && priv.get("add")) {
            try {
                dao.save(cd_reservation);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Saving: You have no Privilege!";
        }
    }

    @Transactional
    @PutMapping
    public String update(@RequestBody ChauffeurDriveReservation cd_reservation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        if (user != null && priv != null && priv.get("update")) {
            try {
                //@ start of the trip
                if (cd_reservation.getPick_up_odometer() != null && cd_reservation.getDrop_off_odometer() == null) {
                    Vehicle vehicle = daoVehicle.getById(cd_reservation.getVehicle_id().getId());
                    vehicle.setCurrent_odometer(cd_reservation.getPick_up_odometer()); // set vehicle current odometer
                    vehicle.setVehicle_status_id(cd_reservation.getVehicle_id().getVehicle_status_id()); //set vehicle status-ongoing
                    daoVehicle.save(vehicle);

                    Driver driver = daoDriver.getById(cd_reservation.getDriver_id().getId());
                    driver.setDriver_status_id(cd_reservation.getDriver_id().getDriver_status_id()); //set driver status-occupied
                }
                //@ end of the trip
                else if (cd_reservation.getPick_up_odometer() != null && cd_reservation.getDrop_off_odometer() != null) {
                    Vehicle vehicle = daoVehicle.getById(cd_reservation.getVehicle_id().getId());
                    vehicle.setCurrent_odometer(cd_reservation.getDrop_off_odometer()); // set vehicle current odometer
                    daoVehicle.save(vehicle);
                }
                dao.save(cd_reservation);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Updating: You have no privilege!";
        }
    }

    @DeleteMapping
    public String delete(@RequestBody ChauffeurDriveReservation cd_reservation) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "CDRESERVATION");

        if (user != null && priv != null && priv.get("delete")) {
            try {
                cd_reservation.setReservation_status_id(daoStatus.getById(6));
                dao.save(cd_reservation);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Complete...." + ex.getMessage();
            }
        } else {
            return "Error in Deleting: You have no privilege!";
        }
    }
}
