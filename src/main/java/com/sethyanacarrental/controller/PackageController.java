package com.sethyanacarrental.controller;

import com.sethyanacarrental.model.Package;
import com.sethyanacarrental.model.PackageHasModel;
import com.sethyanacarrental.model.User;
import com.sethyanacarrental.repository.PackageRepository;
import com.sethyanacarrental.repository.PackageStatusRepository;
import com.sethyanacarrental.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/package")
public class PackageController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrivilegeController previlageController;

    @Autowired
    private PackageRepository dao;

    @Autowired
    private PackageStatusRepository daoStatus;

    @GetMapping(value = "/next_package_no", produces = "application/json")
    public Package packageNextNo() {
        String packageNextNo = dao.getPackageNextNo();
        Package packageNextCode = new Package(packageNextNo);
        return packageNextCode;
    }

    @GetMapping(value = "/kilometer_list", produces = "application/json")
    public List<Package> kilometerList() {
        return dao.kilometerList();
    }

    @GetMapping(value = "/kilometer_list_sdr", produces = "application/json")
    public List<Package> kilometerListSdr() {
        return dao.kilometerListSdr();
    }

    @GetMapping(value = "/kilometer_list_by_v_model", params = {"vehicle_model_id"}, produces = "application/json")
    public List<Package> kilometerListByVModel(@RequestParam("vehicle_model_id") int vehicle_model_id) {
        return dao.kilometerListByVModel(vehicle_model_id);
    }

    @GetMapping(value = "/kilometer_list_by_v_model_sdr", params = {"vehicle_model_id"}, produces = "application/json")
    public List<Package> kilometerListByVModelSdr(@RequestParam("vehicle_model_id") int vehicle_model_id) {
        return dao.kilometerListByVModelSdr(vehicle_model_id);
    }

    @GetMapping(value = "/kilometer_list_by_pkg_category", params = {"pkg_category_id"}, produces = "application/json")
    public List<Package> kilometerListByPkgCategory(@RequestParam("pkg_category_id") int pkg_category_id) {
        return dao.kilometerListByPkgCategory(pkg_category_id);
    }

    @GetMapping(value = "/kilometer_list_by_pkg_category_sdr", params = {"pkg_category_id"}, produces = "application/json")
    public List<Package> kilometerListByPkgCategorySdr(@RequestParam("pkg_category_id") int pkg_category_id) {
        return dao.kilometerListByPkgCategorySdr(pkg_category_id);
    }

    @GetMapping(value = "/list_by_pkg_category", params = {"pkg_category_id"}, produces = "application/json")
    public List<Package> packagesByPkgCategory(@RequestParam("pkg_category_id") int pkg_category_id) {
        return dao.packagesByPkgCategory(pkg_category_id);
    }

    @GetMapping(value = "/list_by_pkg_category_sdr", params = {"pkg_category_id"}, produces = "application/json")
    public List<Package> packagesByPkgCategorySdr(@RequestParam("pkg_category_id") int pkg_category_id) {
        return dao.packagesByPkgCategorySdr(pkg_category_id);
    }

    @GetMapping(value = "/list_by_v_model", params = {"vehicle_model_id"}, produces = "application/json")
    public List<Package> packagesByVModel(@RequestParam("vehicle_model_id") int vehicle_model_id) {
        return dao.packagesByVModel(vehicle_model_id);
    }

    @GetMapping(value = "/list_by_v_model_sdr", params = {"vehicle_model_id"}, produces = "application/json")
    public List<Package> packagesByVModelSdr(@RequestParam("vehicle_model_id") int vehicle_model_id) {
        return dao.packagesByVModelSdr(vehicle_model_id);
    }

    @GetMapping(value = "/list_by_pkg_km", params = {"pkg_km"}, produces = "application/json")
    public List<Package> packagesByPkgKm(@RequestParam("pkg_km") int pkg_km) {
        return dao.packagesByPkgKm(pkg_km);
    }

    @GetMapping(value = "/list_by_pkg_km_sdr", params = {"pkg_km"}, produces = "application/json")
    public List<Package> packagesByPkgKmSdr(@RequestParam("pkg_km") int pkg_km) {
        return dao.packagesByPkgKmSdr(pkg_km);
    }

    @GetMapping(value = "/list_by_pkg_duration", params = {"pkg_duration_id"}, produces = "application/json")
    public List<Package> packagesByPkDuration(@RequestParam("pkg_duration_id") int pkg_duration_id) {
        return dao.packagesByPkgDuration(pkg_duration_id);
    }

    @GetMapping(value = "/list_by_pkg_duration_sdr", params = {"pkg_duration_id"}, produces = "application/json")
    public List<Package> packagesByPkDurationSdr(@RequestParam("pkg_duration_id") int pkg_duration_id) {
        return dao.packagesByPkgDurationSdr(pkg_duration_id);
    }

    @GetMapping(value = "/list_by_pkg_category_and_Km", params = {"pkg_category_id", "pkg_km"}, produces = "application/json")
    public List<Package> packagesByPkgCategoryPkgKm(@RequestParam("pkg_category_id") int pkg_category_id, @RequestParam("pkg_km") int pkg_km) {
        return dao.packagesByPkgCategoryPkgKm(pkg_category_id, pkg_km);
    }

    @GetMapping(value = "/list_by_pkg_category_and_Km_sdr", params = {"pkg_category_id", "pkg_km"}, produces = "application/json")
    public List<Package> packagesByPkgCategoryPkgKmSdr(@RequestParam("pkg_category_id") int pkg_category_id, @RequestParam("pkg_km") int pkg_km) {
        return dao.packagesByPkgCategoryPkgKmSdr(pkg_category_id, pkg_km);
    }

    @GetMapping(value = "/list_by_v_model_and_Km", params = {"vehicle_model_id", "pkg_km"}, produces = "application/json")
    public List<Package> packagesByVModelPkgKm(@RequestParam("vehicle_model_id") int vehicle_model_id, @RequestParam("pkg_km") int pkg_km) {
        return dao.packagesByVModelPkgKm(vehicle_model_id, pkg_km);
    }

    @GetMapping(value = "/list_by_v_model_and_Km_sdr", params = {"vehicle_model_id", "pkg_km"}, produces = "application/json")
    public List<Package> packagesByVModelPkgKmSdr(@RequestParam("vehicle_model_id") int vehicle_model_id, @RequestParam("pkg_km") int pkg_km) {
        return dao.packagesByVModelPkgKmSdr(vehicle_model_id, pkg_km);
    }

    @GetMapping(value = "/list_by_pkg_category_and_pkg_duration", params = {"pkg_category_id", "pkg_duration_id"}, produces = "application/json")
    public List<Package> packagesByPkgCategoryPkgDuration(@RequestParam("pkg_category_id") int pkg_category_id,
                                                          @RequestParam("pkg_duration_id") int pkg_duration_id) {
        return dao.packagesByPkgCategoryPkgDuration(pkg_category_id, pkg_duration_id);
    }

    @GetMapping(value = "/list_by_pkg_category_and_pkg_duration_sdr", params = {"pkg_category_id", "pkg_duration_id"}, produces = "application/json")
    public List<Package> packagesByPkgCategoryPkgDurationSdr(@RequestParam("pkg_category_id") int pkg_category_id,
                                                             @RequestParam("pkg_duration_id") int pkg_duration_id) {
        return dao.packagesByPkgCategoryPkgDurationSdr(pkg_category_id, pkg_duration_id);
    }

    @GetMapping(value = "/list_by_v_model_and_pkg_duration", params = {"vehicle_model_id", "pkg_duration_id"}, produces = "application/json")
    public List<Package> packagesByVModelPkgDuration(@RequestParam("vehicle_model_id") int vehicle_model_id,
                                                     @RequestParam("pkg_duration_id") int pkg_duration_id) {
        return dao.packagesByVModelPkgDuration(vehicle_model_id, pkg_duration_id);
    }

    @GetMapping(value = "/list_by_v_model_and_pkg_duration_sdr", params = {"vehicle_model_id", "pkg_duration_id"}, produces = "application/json")
    public List<Package> packagesByVModelPkgDurationSdr(@RequestParam("vehicle_model_id") int vehicle_model_id,
                                                        @RequestParam("pkg_duration_id") int pkg_duration_id) {
        return dao.packagesByVModelPkgDurationSdr(vehicle_model_id, pkg_duration_id);
    }

    @GetMapping(value = "/cdr_list", produces = "application/json")
    public List<Package> packagesCdrList() {
        return dao.cdrList();
    }

    @GetMapping(value = "/sdr_list", produces = "application/json")
    public List<Package> packageSdrList() {
        return dao.sdrList();
    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<Package> packageList() {
        return dao.packageList();
    }

    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Package> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "PACKAGE");

        if (user != null && priv != null && priv.get("select")) {

            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    @PostMapping
    public String insert(@RequestBody Package packages) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "PACKAGE");

        if (user != null && priv != null && priv.get("add")) {
            try {
                for (PackageHasModel phm : packages.getPackageHasModelList())
                    phm.setPackage_id(packages);
                dao.save(packages);
                return "0"; //if successful, return 0
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Saving: You have no Privilege!";
        }
    }

    @PutMapping
    public String update(@RequestBody Package packages) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "PACKAGE");

        if (user != null && priv != null && priv.get("update")) {
            try {
                for (PackageHasModel phm : packages.getPackageHasModelList())
                    phm.setPackage_id(packages);
                dao.save(packages);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        } else {
            return "Error in Updating: You have no privilege!";
        }

    }

    @DeleteMapping
    public String delete(@RequestBody Package packages) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String, Boolean> priv = previlageController.getPrivileges(user, "PACKAGE");

        if (user != null && priv != null && priv.get("delete")) {
            try {
                packages.setPackage_status_id(daoStatus.getById(3));
                for (PackageHasModel phm : packages.getPackageHasModelList())
                    phm.setPackage_id(packages);
                dao.save(packages);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Complete...." + ex.getMessage();
            }
        } else {
            return "Error in Deleting: You have no privilege!";
        }
    }
}
