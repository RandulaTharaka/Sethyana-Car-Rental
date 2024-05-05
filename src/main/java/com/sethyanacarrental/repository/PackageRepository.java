package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PackageRepository extends JpaRepository<Package, Integer> {

    @Query(value = "SELECT CONCAT('PKG', lpad(substring(max(pkg.package_code), 4, 10) + 1, 7, 0)) " +
            "FROM sethyana_car_rental.package AS pkg;", nativeQuery = true)
    String getPackageNextNo();

    @Query("SELECT p FROM Package p")
    List<Package> packageList();

    @Query("SELECT p FROM Package p WHERE p.package_type_id='2' AND p.package_status_id='1' " +
            "ORDER BY p.package_category_id.id , p.package_km")
    List<Package> cdrList();

    @Query("SELECT p FROM Package p WHERE p.package_type_id='1' AND p.package_status_id='1' " +
            "ORDER BY p.package_category_id.id, p.package_km")
    List<Package> sdrList();

    @Query("SELECT NEW Package(p.id,p.package_code,p.package_km) FROM Package p " +
            "WHERE p.package_type_id='2' AND p.package_status_id='1' " +
            "group by p.id,p.package_code,p.package_km ORDER BY p.package_km")
    List<Package> kilometerList();

    @Query("SELECT NEW Package(p.id,p.package_code,p.package_km) FROM Package p " +
            "WHERE p.package_type_id='1' AND p.package_status_id='1' " +
            "group by p.id,p.package_code,p.package_km ORDER BY p.package_km")
    List<Package> kilometerListSdr();

    @Query("SELECT NEW Package(p.id,p.package_code,p.package_km) FROM Package p " +
            "WHERE p.package_type_id='2' AND p.package_status_id='1'  AND " +
            "p.package_category_id IN (SELECT pc.id FROM PackageCategory pc " +
            "WHERE pc.id=:pkg_category_id) " +
            "group by p.id,p.package_code,p.package_km ORDER BY p.package_km")
    List<Package> kilometerListByPkgCategory(@Param("pkg_category_id") Integer pkg_category_id);

    @Query("SELECT NEW Package(p.id,p.package_code,p.package_km) FROM Package p " +
            "WHERE p.package_type_id='1' AND p.package_status_id='1'  AND " +
            "p.package_category_id IN (SELECT pc.id FROM PackageCategory pc " +
            "WHERE pc.id=:pkg_category_id) " +
            "group by p.id,p.package_code,p.package_km ORDER BY p.package_km")
    List<Package> kilometerListByPkgCategorySdr(@Param("pkg_category_id") Integer pkg_category_id);

    @Query("SELECT NEW Package(p.id,p.package_code,p.package_km) FROM Package p " +
            "WHERE p.package_type_id='2' AND p.package_status_id='1' AND " +
            "p.id IN (SELECT phm.package_id FROM PackageHasModel AS phm WHERE phm.model_id.id=:vehicle_model_id) " +
            "group by p.id,p.package_code,p.package_km ORDER BY p.package_km")
    List<Package> kilometerListByVModel(@Param("vehicle_model_id") Integer vehicle_model_id);

    @Query("SELECT NEW Package(p.id,p.package_code,p.package_km) FROM Package p " +
            "WHERE p.package_type_id='1' AND p.package_status_id='1' AND " +
            "p.id IN (SELECT phm.package_id FROM PackageHasModel AS phm " +
            "WHERE phm.model_id.id=:vehicle_model_id) " +
            "group by p.id,p.package_code,p.package_km ORDER BY p.package_km")
    List<Package> kilometerListByVModelSdr(@Param("vehicle_model_id") Integer vehicle_model_id);

    //Packages: params(1)//
    @Query("SELECT p FROM Package p WHERE p.package_type_id='2' AND p.package_status_id='1'AND " +
            "p.package_category_id IN (SELECT pc.id FROM PackageCategory pc " +
            "WHERE pc.id=:pkg_category_id) ORDER BY p.package_km")
    List<Package> packagesByPkgCategory(@Param("pkg_category_id") Integer pkg_category_id);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='1' AND p.package_status_id='1' AND " +
            "p.package_category_id IN (SELECT pc.id FROM PackageCategory pc " +
            "WHERE pc.id=:pkg_category_id) ORDER BY p.package_km")
    List<Package> packagesByPkgCategorySdr(@Param("pkg_category_id") Integer pkg_category_id);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='2' AND p.package_status_id='1' AND " +
            "p.id IN (SELECT phm.package_id FROM PackageHasModel phm " +
            "WHERE phm.model_id.id=:vehicle_model_id) ORDER BY p.package_duration_id.id")
    List<Package> packagesByVModel(@Param("vehicle_model_id") Integer vehicle_model_id);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='1' AND p.package_status_id='1' AND " +
            "p.id IN (SELECT phm.package_id FROM PackageHasModel phm WHERE " +
            "phm.model_id.id=:vehicle_model_id) ORDER BY p.package_duration_id.id")
    List<Package> packagesByVModelSdr(@Param("vehicle_model_id") Integer vehicle_model_id);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='2' AND p.package_status_id='1' AND p.package_km=:pkg_km " +
            "ORDER BY p.package_category_id.id , p.package_km")
    List<Package> packagesByPkgKm(@Param("pkg_km") Integer pkg_km);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='1' AND p.package_status_id='1' AND p.package_km=:pkg_km " +
            "ORDER BY p.package_category_id.id , p.package_km")
    List<Package> packagesByPkgKmSdr(@Param("pkg_km") Integer pkg_km);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='2' AND p.package_status_id='1' AND " +
            "p.package_duration_id IN (SELECT pd.id FROM PackageDuration pd WHERE pd.id=:pkg_duration_id)")
    List<Package> packagesByPkgDuration(@Param("pkg_duration_id") Integer pkg_duration_id);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='1' AND p.package_status_id='1' AND " +
            "p.package_duration_id IN (SELECT pd.id FROM PackageDuration pd WHERE pd.id=:pkg_duration_id)")
    List<Package> packagesByPkgDurationSdr(@Param("pkg_duration_id") Integer pkg_duration_id);


    //Packages: params(2)//
    @Query("SELECT p FROM Package p WHERE p.package_type_id='2' AND p.package_status_id='1' AND p.package_km=:pkg_km AND " +
            "p.package_category_id IN (SELECT pc.id FROM PackageCategory pc WHERE pc.id=:pkg_category_id) " +
            "ORDER BY p.package_category_id.id, p.package_km")
    List<Package> packagesByPkgCategoryPkgKm(@Param("pkg_category_id") Integer pkg_category_id,
                                             @Param("pkg_km") Integer pkg_km);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='1' AND p.package_status_id='1' AND p.package_km=:pkg_km AND " +
            "p.package_category_id IN (SELECT pc.id FROM PackageCategory pc WHERE pc.id=:pkg_category_id) " +
            "ORDER BY p.package_category_id.id, p.package_km")
    List<Package> packagesByPkgCategoryPkgKmSdr(@Param("pkg_category_id") Integer pkg_category_id,
                                                @Param("pkg_km") Integer pkg_km);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='2' AND p.package_status_id='1' AND " +
            "p.package_duration_id IN (SELECT pd.id FROM PackageDuration pd WHERE pd.id=:pkg_duration_id) AND " +
            "p.package_category_id IN (SELECT pc.id FROM PackageCategory pc WHERE pc.id=:pkg_category_id) " +
            "ORDER BY p.package_category_id.id, p.package_duration_id.id")
    List<Package> packagesByPkgCategoryPkgDuration(@Param("pkg_category_id") Integer pkg_category_id,
                                                   @Param("pkg_duration_id") Integer pkg_duration_id);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='1' AND p.package_status_id='1' AND " +
            "p.package_duration_id IN (SELECT pd.id FROM PackageDuration pd WHERE pd.id=:pkg_duration_id) AND " +
            "p.package_category_id IN (SELECT pc.id FROM PackageCategory pc WHERE pc.id=:pkg_category_id) " +
            "ORDER BY p.package_category_id.id, p.package_duration_id.id")
    List<Package> packagesByPkgCategoryPkgDurationSdr(@Param("pkg_category_id") Integer pkg_category_id,
                                                      @Param("pkg_duration_id") Integer pkg_duration_id);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='2' AND p.package_status_id='1' AND p.package_km=:pkg_km AND " +
            "p.id IN (SELECT phm.package_id FROM PackageHasModel phm WHERE phm.model_id.id=:vehicle_model_id) " +
            "ORDER BY p.package_category_id.id, p.package_km")
    List<Package> packagesByVModelPkgKm(@Param("vehicle_model_id") Integer vehicle_model_id,
                                        @Param("pkg_km") Integer pkg_km);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='1' AND p.package_status_id='1' AND p.package_km=:pkg_km AND " +
            "p.id IN (SELECT phm.package_id FROM PackageHasModel phm WHERE phm.model_id.id=:vehicle_model_id) " +
            "ORDER BY p.package_category_id.id, p.package_km")
    List<Package> packagesByVModelPkgKmSdr(@Param("vehicle_model_id") Integer vehicle_model_id,
                                           @Param("pkg_km") Integer pkg_km);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='2' AND p.package_status_id='1' AND " +
            "p.package_duration_id IN (SELECT pd.id FROM PackageDuration pd WHERE pd.id=:pkg_duration_id) AND " +
            "p.id IN (SELECT phm.package_id FROM PackageHasModel phm WHERE phm.model_id.id=:vehicle_model_id) " +
            "ORDER BY p.package_category_id.id, p.package_duration_id.id")
    List<Package> packagesByVModelPkgDuration(@Param("vehicle_model_id") Integer vehicle_model_id,
                                              @Param("pkg_duration_id") Integer pkg_duration_id);

    @Query("SELECT p FROM Package p WHERE p.package_type_id='1' AND p.package_status_id='1' AND " +
            "p.package_duration_id IN (SELECT pd.id FROM PackageDuration pd WHERE pd.id=:pkg_duration_id) AND " +
            "p.id IN (SELECT phm.package_id FROM PackageHasModel phm WHERE phm.model_id.id=:vehicle_model_id) " +
            "ORDER BY p.package_category_id.id, p.package_duration_id.id")
    List<Package> packagesByVModelPkgDurationSdr(@Param("vehicle_model_id") Integer vehicle_model_id,
                                                 @Param("pkg_duration_id") Integer pkg_duration_id);
}