package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.PackageDuration;
import com.sethyanacarrental.repository.PackageDurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/package_duration")
public class PackageDurationController {

    @Autowired
    private PackageDurationRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PackageDuration> packageDurationList() {
        return dao.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    @GetMapping(value = "/cdr_list", produces = "application/json")
    public List<PackageDuration> cdrPackageDurationList() {
        return dao.getCdrPackageDurationList();
    }

    @GetMapping(value = "/list_sdr", produces = "application/json")
    public List<PackageDuration> sdrPackageDurationList() {
        return dao.getSdrPackageDurationList();
    }

    @GetMapping(value = "list_by_pkg_category", params = {"pkg_category_id"}, produces = "application/json")
    public List<PackageDuration> durationListByPkgCategory(@RequestParam("pkg_category_id") int pkg_category_id) {
        return dao.durationListByPkgCategory(pkg_category_id);
    }

    @GetMapping(value = "list_by_pkg_category_sdr", params = {"pkg_category_id"}, produces = "application/json")
    public List<PackageDuration> durationListByPkgCategorySdr(@RequestParam("pkg_category_id") int pkg_category_id) {
        return dao.durationListByPkgCategorySdr(pkg_category_id);
    }

    @GetMapping(value = "list_by_v_model", params = {"vehicle_model_id"}, produces = "application/json")
    public List<PackageDuration> durationListByVModel(@RequestParam("vehicle_model_id") int vehicle_model_id) {
        return dao.durationListByVModel(vehicle_model_id);
    }

    @GetMapping(value = "list_by_v_model_sdr", params = {"vehicle_model_id"}, produces = "application/json")
    public List<PackageDuration> durationListByVModelSdr(@RequestParam("vehicle_model_id") int vehicle_model_id) {
        return dao.durationListByVModelSdr(vehicle_model_id);
    }
}

