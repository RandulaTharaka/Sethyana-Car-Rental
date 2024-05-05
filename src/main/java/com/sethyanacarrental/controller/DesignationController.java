package com.sethyanacarrental.controller;


import com.sethyanacarrental.model.Designation;
import com.sethyanacarrental.repository.DesignationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping(value = "/designation")
@RestController
public class DesignationController {

    @Autowired
    private DesignationRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Designation> designations() {
        return dao.list();
    }
}
