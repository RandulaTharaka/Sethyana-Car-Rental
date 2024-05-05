package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.CustomerStatus;
import com.sethyanacarrental.repository.CustomerStatusRepository;
import com.sethyanacarrental.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/customer_status")
public class CustomerStatusController {

    @Autowired
    private CustomerStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<CustomerStatus> customerStatusList() {
        return dao.findAll();
    }
}
