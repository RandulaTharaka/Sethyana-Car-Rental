package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.PackageTypeHasPackageDuration;
import com.sethyanacarrental.repository.PackageTypeHasPackageDurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/package_type_has_package_duration")
public class PackageTypeHasPackageDurationController {

    @Autowired
    private PackageTypeHasPackageDurationRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PackageTypeHasPackageDuration> packageTypeHasPackageDurationList() {
        return dao.findAll();
    }
}
