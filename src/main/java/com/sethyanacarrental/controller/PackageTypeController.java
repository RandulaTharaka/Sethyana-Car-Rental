package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.PackageType;
import com.sethyanacarrental.repository.PackageTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/package_type")
public class PackageTypeController {

    @Autowired
    private PackageTypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PackageType> packageTypeList() {
        return dao.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }
}
