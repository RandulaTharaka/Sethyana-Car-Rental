package com.sethyanacarrental.controller;


import com.sethyanacarrental.model.EmployeeStatus;
import com.sethyanacarrental.repository.EmployeeStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/employeestatus")
@RestController()
public class EmployeeStatusController {

    @Autowired
    private EmployeeStatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<EmployeeStatus> employeestatuses() {
        return dao.list();
    }
}
