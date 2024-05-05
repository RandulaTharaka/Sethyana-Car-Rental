package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.Driver;
import com.sethyanacarrental.model.User;
import com.sethyanacarrental.repository.DriverRepository;
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
@RequestMapping(value = "/driver")
public class DriverController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrivilegeController previlageController;

    @Autowired
    private DriverRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Driver> driverList() {
        return dao.list();
    }

    @GetMapping(value = "/list_by_pickdate_returndate", params = {"cdr_expt_pick_date", "cdr_expt_return_date"}, produces = "application/json")
    public List<Driver> driverListByPickReturn(@RequestParam("cdr_expt_pick_date") String cdr_expt_pick_date,
                                               @RequestParam("cdr_expt_return_date") String cdr_expt_return_date) {
        return dao.listByPickReturn(LocalDateTime.parse(cdr_expt_pick_date), LocalDateTime.parse(cdr_expt_return_date));
    }

    @GetMapping(value = "/list_by_pickdate_returndate_calling_name_license",
            params = {"cdr_expt_pick_date", "cdr_expt_return_date", "calling_name", "license"}, produces = "application/json")
    public List<Driver> driverListByPickReturnCallingNameLicense(@RequestParam("cdr_expt_pick_date") String cdr_expt_pick_date,
                                                                 @RequestParam("cdr_expt_return_date") String cdr_expt_return_date,
                                                                 @RequestParam("calling_name") String calling_name,
                                                                 @RequestParam("license") String license) {
        return dao.listByPickReturnCallingNameLicense(LocalDateTime.parse(cdr_expt_pick_date),
                LocalDateTime.parse(cdr_expt_return_date), calling_name, license);
    }

    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Driver> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "DRIVER");

        if (user != null && priv != null && priv.get("select")) {

            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @PostMapping
    public String insert(@RequestBody Driver driver) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "DRIVER");

        if (user != null && priv != null && priv.get("add")) {
            try {
                dao.save(driver);
                return "0"; //if successful, return 0
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Saving: You have no Privilege!";
        }
    }

    @PutMapping
    public String update(@RequestBody Driver driver) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "DRIVER");

        if (user != null && priv != null && priv.get("update")) {
            try {
                dao.save(driver);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Updating: You have no privilege!";
        }
    }
}
