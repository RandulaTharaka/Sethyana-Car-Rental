package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.PackageHasModel;
import com.sethyanacarrental.repository.PackageHasModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/package_has_model")
public class PackageHasModelController {

    @Autowired
    private PackageHasModelRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PackageHasModel> packageHasModelList() {
        return dao.findAll();
    }
}
