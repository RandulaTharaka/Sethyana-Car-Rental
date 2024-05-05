package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.PackageStatus;
import com.sethyanacarrental.repository.PackageStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/package_status")
public class PackageStatusController {

    @Autowired
    private PackageStatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PackageStatus> packageStatusList() {
        return dao.findAll();
    }
}
