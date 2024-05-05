package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.CustomerType;
import com.sethyanacarrental.repository.CustomerTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/customer_type")
public class CustomerTypeController {

    @Autowired
    private CustomerTypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<CustomerType> customerTypeList() {
        return dao.findAll();
    }
}
