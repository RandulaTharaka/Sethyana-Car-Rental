package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.PackageDuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PackageDurationRepository extends JpaRepository<PackageDuration, Integer> {

    @Query("SELECT pd FROM PackageDuration pd  " +
            "WHERE pd.id IN (SELECT p.package_duration_id FROM Package p " +
            "WHERE p.package_type_id='2' AND p.package_status_id='1') ORDER BY pd.id")
    List<PackageDuration> getCdrPackageDurationList();

    @Query("SELECT pd FROM PackageDuration pd " +
            "WHERE pd.id IN (SELECT p.package_duration_id FROM Package p " +
            "WHERE p.package_type_id='1' AND p.package_status_id='1') ORDER BY pd.id")
    List<PackageDuration> getSdrPackageDurationList();

    @Query("SELECT pd FROM PackageDuration pd " +
            "WHERE pd.id IN (SELECT p.package_duration_id FROM Package p " +
            "WHERE p.package_type_id='2' AND p.package_status_id='1' AND " +
            "p.id IN (SELECT phm.package_id FROM PackageHasModel phm " +
            "WHERE phm.model_id.id=:vehicle_model_id)) ORDER BY pd.id")
    List<PackageDuration> durationListByVModel(@Param("vehicle_model_id") Integer vehicle_model_id);

    @Query("SELECT pd FROM PackageDuration pd " +
            "WHERE pd.id IN (SELECT p.package_duration_id FROM Package p " +
            "WHERE p.package_type_id='1' AND p.package_status_id='1' AND " +
            "p.id IN (SELECT phm.package_id FROM PackageHasModel phm " +
            "WHERE phm.model_id.id=:vehicle_model_id)) ORDER BY pd.id")
    List<PackageDuration> durationListByVModelSdr(@Param("vehicle_model_id") Integer vehicle_model_id);

    @Query("SELECT pd FROM PackageDuration pd " +
            "WHERE pd.id IN (SELECT p.package_duration_id FROM Package p " +
            "WHERE p.package_type_id='2' AND p.package_status_id='1' AND " +
            "p.package_category_id IN (SELECT pc.id FROM PackageCategory pc " +
            "WHERE pc.id=:pkg_category_id)) ORDER BY pd.id")
    List<PackageDuration> durationListByPkgCategory(Integer pkg_category_id);

    @Query("SELECT pd FROM PackageDuration pd " +
            "WHERE pd.id IN (SELECT p.package_duration_id FROM Package p " +
            "WHERE p.package_type_id='1' AND p.package_status_id='1' AND " +
            "p.package_category_id IN (SELECT pc.id FROM PackageCategory pc " +
            "WHERE pc.id=:pkg_category_id)) ORDER BY pd.id")
    List<PackageDuration> durationListByPkgCategorySdr(Integer pkg_category_id);
}
