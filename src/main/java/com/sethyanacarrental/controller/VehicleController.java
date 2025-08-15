package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.User;
import com.sethyanacarrental.model.Vehicle;
import com.sethyanacarrental.repository.VehicleRepository;
import com.sethyanacarrental.repository.VehicleStatusRepository;
import com.sethyanacarrental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/vehicle")
public class VehicleController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrivilegeController previlageController;

    @Autowired
    private VehicleRepository dao;

    @Autowired
    private VehicleStatusRepository daoVehicleStatus;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Vehicle> vehicleList() {
        return dao.list();
    }

    @GetMapping(value = "/list_by_v_types", params = {"vehicle_type_id"}, produces = "application/json")
    public List<Vehicle> vehiclListByVType(@RequestParam("vehicle_type_id") int vehicleTypeId) {
        return dao.listByVehicleType(vehicleTypeId);
    }

    @GetMapping(value = "/list_by_v_model", params = {"vehicle_model_id"}, produces = "application/json")
    public List<Vehicle> vehicleListByVehicleModel(@RequestParam("vehicle_model_id") int vehicleModelId) {
        return dao.listByVehicleModel(vehicleModelId);
    }

    @GetMapping(value = "/available_list", params = {"exp_pick_up_datetime", "exp_return_datetime"}, produces = "application/json")
    public List<Vehicle> vehicleAvailableList(@RequestParam("exp_pick_up_datetime") String exp_pick_up_datetime,
                                              @RequestParam("exp_return_datetime") String exp_return_datetime) {
        return dao.availableList(LocalDateTime.parse(exp_pick_up_datetime), LocalDateTime.parse(exp_return_datetime));
    }

    @GetMapping(value = "/list_by_package_pickdate_returndate",
            params = {"package_id", "cdr_expt_pick_date", "cdr_expt_return_date"}, produces = "application/json")
    public List<Vehicle> vehicleListByPackagePickDateReturnDate(@RequestParam("package_id") int package_id,
                                                                @RequestParam("cdr_expt_pick_date") String cdr_expt_pick_date,
                                                                @RequestParam("cdr_expt_return_date") String cdr_expt_return_date) {
        return dao.listByPackagePickDateReturnDate(package_id, LocalDateTime.parse(cdr_expt_pick_date), LocalDateTime.parse(cdr_expt_return_date));
    }

    @GetMapping(value = "/list_by_package_pickdate_returndate_sdr",
            params = {"package_id", "sdr_expt_pick_date", "sdr_expt_return_date"}, produces = "application/json")
    public List<Vehicle> vehicleListByPackagePickDateReturnDateSdr(@RequestParam("package_id") int package_id,
                                                                   @RequestParam("sdr_expt_pick_date") String sdr_expt_pick_date,
                                                                   @RequestParam("sdr_expt_return_date") String sdr_expt_return_date) {
        return dao.listByPackagePickDateReturnDateSdr(package_id, LocalDateTime.parse(sdr_expt_pick_date), LocalDateTime.parse(sdr_expt_return_date));
    }

    @GetMapping(value = "/list_by_package_pickdate_returndate_vmodel",
            params = {"package_id", "cdr_expt_pick_date", "cdr_expt_return_date", "v_model_id"}, produces = "application/json")
    public List<Vehicle> vehicleListByPackagePickDateReturnDateVModel(@RequestParam("package_id") int package_id,
                                                                      @RequestParam("cdr_expt_pick_date") String cdr_expt_pick_date,
                                                                      @RequestParam("cdr_expt_return_date") String cdr_expt_return_date,
                                                                      @RequestParam("v_model_id") int v_model_id) {
        return dao.listByPackagePickDateReturnDateVModel(package_id, LocalDateTime.parse(cdr_expt_pick_date),
                LocalDateTime.parse(cdr_expt_return_date), v_model_id);
    }

    @GetMapping(value = "/list_by_package_pickdate_returndate_vmodel_sdr",
            params = {"package_id", "sdr_expt_pick_date", "sdr_expt_return_date", "v_model_id"}, produces = "application/json")
    public List<Vehicle> vehicleListByPackagePickDateReturnDateVModelSdr(@RequestParam("package_id") int package_id,
                                                                         @RequestParam("sdr_expt_pick_date") String sdr_expt_pick_date,
                                                                         @RequestParam("sdr_expt_return_date") String sdr_expt_return_date,
                                                                         @RequestParam("v_model_id") int v_model_id) {
        return dao.listByPackagePickDateReturnDateVModelSdr(package_id, LocalDateTime.parse(sdr_expt_pick_date),
                LocalDateTime.parse(sdr_expt_return_date), v_model_id);
    }

    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Vehicle> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "VEHICLE");

        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.ASC, "id"));
        } else {
            return null;
        }
    }

    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Vehicle> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "VEHICLE");

        if (user != null && priv != null && priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.ASC, "id"));
        } else {
            return null;
        }
    }


    @PostMapping
    public String insert(@RequestBody Vehicle vehicle) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "VEHICLE");

        if (user != null && priv != null && priv.get("add")) {
            try {
                dao.save(vehicle);
                return "0"; //if successful, return 0
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Saving: You have no Privilege!";
        }
    }

    @PutMapping
    public String update(@RequestBody Vehicle vehicle) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "VEHICLE");

        if (user != null && priv != null && priv.get("update")) {
            try {
                dao.save(vehicle);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Updating: You have no privilege!";
        }
    }

    @DeleteMapping
    public String delete(@RequestBody Vehicle vehicle) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "VEHICLE");

        if (user != null && priv != null && priv.get("delete")) {
            try {
                vehicle.setVehicle_status_id(daoVehicleStatus.getById(9));
                dao.save(vehicle);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Complete...." + ex.getMessage();
            }
        } else {
            return "Error in Deleting: You have no privilege!";
        }
    }
}
