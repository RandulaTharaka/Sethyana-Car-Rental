package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.Module;
import com.sethyanacarrental.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/module")
public class ModuleController {

    @Autowired
    private ModuleRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Module> gender() {
        return dao.list();
    }

    @GetMapping(value = "/list/unassignedtothisrole", params = {"roleid"}, produces = "application/json")
    public List<Module> modulesnotassignedtotherole(Integer roleid) {
        return dao.listUnassignedToThisRole(roleid);
    }

    @GetMapping(value = "/listbyuser", params = {"userid"}, produces = "application/json")
    public List<Module> listbyuser(@RequestParam("userid") Integer userid) {
        return dao.listbyuser(userid);
    }
}
