package com.sethyanacarrental.controller;


import com.sethyanacarrental.model.Privilege;
import com.sethyanacarrental.model.User;
import com.sethyanacarrental.repository.ModuleRepository;
import com.sethyanacarrental.repository.PrivilegeRepository;
import com.sethyanacarrental.repository.RoleRepository;
import com.sethyanacarrental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RequestMapping(value = "/privilege")
@RestController
public class PrivilegeController {

    @Autowired
    private PrivilegeRepository dao;


    @Autowired
    private UserService userService;

    @Autowired
    private RoleRepository daoRole;

    @Autowired
    private ModuleRepository daoModule;


    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Privilege> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = getPrivileges(user, "PRIVILEGE");

        if (user != null && priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else return null;
    }


    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Privilege> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = getPrivileges(user, "PRIVILEGE");

        if (user != null && priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }
        return null;
    }


    @PostMapping
    public String add(@Validated @RequestBody Privilege privilege) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = getPrivileges(user, "PRIVILEGE");

        if (user != null && priv.get("add")) {
            Privilege prirolemodule = dao.findByRoleModule(privilege.getRoleId(), privilege.getModuleId());
            if (prirolemodule != null)
                return "Error-Validation : Privilege Exists";
            else {
                try {
                    dao.save(privilege);
                    return "0";
                } catch (Exception e) {
                    return "Error-Saving : " + e.getMessage();
                }
            }
        } else
            return "Error-Saving : You have no Permission";
    }


    @PutMapping
    public String update(@Validated @RequestBody Privilege privilege) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = getPrivileges(user, "PRIVILEGE");

        if (user != null && priv.get("update")) {
            Privilege prirolemodule = dao.findByRoleModule(privilege.getRoleId(), privilege.getModuleId());
            if (prirolemodule == null)
                return "Error-Validation : Privilege Does Not Exists";
            else {
                try {
                    dao.save(privilege);
                    return "0";
                } catch (Exception e) {
                    return "Error-Updating : " + e.getMessage();
                }
            }
        } else
            return "Error-Updating : You have no Permission";
    }


    @DeleteMapping
    public String delete(@RequestBody Privilege privilege) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = getPrivileges(user, "PRIVILEGE");

        if (user != null && priv.get("delete")) {
            try {
                // dao.delete(dao.getOne(privilege.getId()));
                privilege.setSel(0);
                privilege.setIns(0);
                privilege.setUpd(0);
                privilege.setDel(0);
                dao.save(privilege);
                return "0";
            } catch (Exception e) {
                return "Error-Deleting : " + e.getMessage();
            }
        } else
            return "Error-Deleting : You have no Permission";
    }


    @GetMapping(params = {"module"}, produces = "application/json")
    public HashMap<String, Boolean> getModulePrivilege(@RequestParam("module") String module) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());

        if (user != null) {
            System.out.println(getPrivileges(user, module));
            return getPrivileges(user, module);
        } else {
            return null;
        }
    }

    public HashMap<String, Boolean> getPrivileges(User user, String module) {
        if (user.getUserName().equals("Admin")) {
            HashMap<String, Boolean> adminprivileges = new HashMap();
            adminprivileges.put("add", true);
            adminprivileges.put("update", true);
            adminprivileges.put("delete", true);
            adminprivileges.put("select", true);
            return adminprivileges;
        } else {
            try {
                String rs2 = dao.findByUserModle(user.getUserName(), module);
                String[] priv = rs2.split(",");

                HashMap<String, Boolean> privileges = new HashMap();
                privileges.put("select", priv[0].equals("1"));
                privileges.put("add", priv[1].equals("1"));
                privileges.put("update", priv[2].equals("1"));
                privileges.put("delete", priv[3].equals("1"));
                return privileges;
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
                return null;
            }
        }
    }
}
