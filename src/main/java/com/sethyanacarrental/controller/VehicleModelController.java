package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.VehicleModel;
import com.sethyanacarrental.repository.VehicleModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/vehicle_model")
public class VehicleModelController {

    @Autowired
    private VehicleModelRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<VehicleModel> vehicleModelList() {
        return dao.findAll();
    }

    @GetMapping(value = "/list_by_v_types", params = {"vehicle_type_id"}, produces = "application/json")
    public List<VehicleModel> vehicleModelListByVType(@RequestParam("vehicle_type_id") int vehicleTypeId) {
        return dao.listByVehicleType(vehicleTypeId);
    }

    @GetMapping(value = "/list_by_pkg_category", params = {"pkg_category_id"}, produces = "application/json")
    public List<VehicleModel> vehicleModelListByPkgCategory(@RequestParam("pkg_category_id") int pkg_category_id) {
        return dao.listByPkgCategory(pkg_category_id);
    }

    @GetMapping(value = "/list_by_pkg_category_sdr", params = {"pkg_category_id"}, produces = "application/json")
    public List<VehicleModel> vehicleModelListByPkgCategorySdr(@RequestParam("pkg_category_id") int pkg_category_id) {
        return dao.listByPkgCategorySdr(pkg_category_id);
    }

    @GetMapping(value = "/list_by_package_pickdate_returndate",
            params = {"package_id", "cdr_expt_pick_date", "cdr_expt_return_date"}, produces = "application/json")
    public List<VehicleModel> vehicleModelListByPackagePickDateReturnDate(@RequestParam("package_id") int package_id,
                                                                          @RequestParam("cdr_expt_pick_date") String cdr_expt_pick_date,
                                                                          @RequestParam("cdr_expt_return_date") String cdr_expt_return_date) {
        return dao.listByPackagePickDateReturnDate(package_id, LocalDateTime.parse(cdr_expt_pick_date), LocalDateTime.parse(cdr_expt_return_date));
    }

    @GetMapping(value = "/list_by_package_pickdate_returndate_sdr",
            params = {"package_id", "sdr_expt_pick_date", "sdr_expt_return_date"}, produces = "application/json")
    public List<VehicleModel> vehicleModelListByPackagePickDateReturnDateSdr(@RequestParam("package_id") int package_id,
                                                                             @RequestParam("sdr_expt_pick_date") String sdr_expt_pick_date,
                                                                             @RequestParam("sdr_expt_return_date") String sdr_expt_return_date) {
        return dao.listByPackagePickDateReturnDateSdr(package_id, LocalDateTime.parse(sdr_expt_pick_date), LocalDateTime.parse(sdr_expt_return_date));
    }
}
