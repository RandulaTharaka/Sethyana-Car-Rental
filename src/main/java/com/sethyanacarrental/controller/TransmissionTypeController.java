package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.TransmissionType;
import com.sethyanacarrental.repository.TransmissionTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/transmission_type")
public class TransmissionTypeController {

    @Autowired
    private TransmissionTypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<TransmissionType> transmissionTypeList() {
        return dao.findAll();
    }
}
