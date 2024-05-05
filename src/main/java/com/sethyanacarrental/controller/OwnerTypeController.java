package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.OwnerType;
import com.sethyanacarrental.repository.OwnerTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/owner_type")
public class OwnerTypeController {

    @Autowired
    private OwnerTypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<OwnerType> ownerTypeList() {
        return dao.findAll();
    }
}




