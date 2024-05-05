package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.VehicleModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface VehicleModelRepository extends JpaRepository<VehicleModel, Integer> {
    @Query("SELECT vm FROM VehicleModel vm WHERE vm.vehicle_type_id.id =:vehicleType")
    List<VehicleModel> listByVehicleType(@Param("vehicleType") Integer vehicleType);

    @Query("SELECT vm FROM VehicleModel vm " +
            "WHERE vm.id IN (SELECT phm.model_id FROM PackageHasModel phm " +
            "WHERE phm.package_id IN (SELECT p.id FROM Package p " +
            "WHERE p.package_type_id='2' AND p.package_status_id='1' AND " +
            "p.package_category_id IN (SELECT pc FROM PackageCategory pc " +
            "WHERE pc.id=:pkg_category_id)))")
    List<VehicleModel> listByPkgCategory(@Param("pkg_category_id") Integer pkg_category_id);

    @Query("SELECT vm FROM VehicleModel vm " +
            "WHERE vm.id IN (SELECT phm.model_id FROM PackageHasModel phm " +
            "WHERE phm.package_id IN (SELECT p.id FROM Package p " +
            "WHERE p.package_type_id='1' AND p.package_status_id='1' AND " +
            "p.package_category_id IN (SELECT pc FROM PackageCategory pc " +
            "WHERE pc.id=:pkg_category_id)))")
    List<VehicleModel> listByPkgCategorySdr(@Param("pkg_category_id") Integer pkg_category_id);

    @Query("SELECT vm FROM VehicleModel vm " +
            "WHERE vm.id IN (SELECT phm.model_id FROM PackageHasModel phm " +
            "WHERE phm.package_id.id=:package_id) AND " +
            "vm.id IN (SELECT v.model_id FROM Vehicle v " +
            "WHERE v.vehicle_status_id='1' AND " +
            "v.id NOT IN(SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='1' AND " +
            "cdr.expect_pick_up_datetime <=:cdr_expt_return_date AND " +
            "cdr.expect_return_datetime >=:cdr_expt_pick_date) AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='7' AND " +
            "cdr.expect_pick_up_datetime <=:cdr_expt_return_date AND " +
            "cdr.expect_return_datetime >=:cdr_expt_pick_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='2' AND " +
            "sdr.pick_up_datetime <=:cdr_expt_return_date AND " +
            "sdr.expect_return_datetime >=:cdr_expt_pick_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='7' AND " +
            "sdr.pick_up_datetime <=:cdr_expt_return_date AND " +
            "sdr.expect_return_datetime >=:cdr_expt_pick_date)) " +
            "ORDER BY vm.id")
    List<VehicleModel> listByPackagePickDateReturnDate(@Param("package_id") Integer package_id,
                                                       @Param("cdr_expt_pick_date") LocalDateTime cdr_expt_pick_date,
                                                       @Param("cdr_expt_return_date") LocalDateTime cdr_expt_return_date);

    @Query("SELECT vm FROM VehicleModel vm " +
            "WHERE vm.id IN (SELECT phm.model_id FROM PackageHasModel phm " +
            "WHERE phm.package_id.id=:package_id) AND " +
            "vm.id IN (SELECT v.model_id FROM Vehicle v " +
            "WHERE v.vehicle_status_id='1' AND " +
            "v.id NOT IN(SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='1' AND " +
            "cdr.expect_pick_up_datetime <=:sdr_expt_return_date AND " +
            "cdr.expect_return_datetime >=:sdr_expt_pick_date) AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='7' AND " +
            "cdr.expect_pick_up_datetime <=:sdr_expt_return_date AND " +
            "cdr.expect_return_datetime >=:sdr_expt_pick_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='2'  AND " +
            "sdr.pick_up_datetime <=:sdr_expt_return_date AND " +
            "sdr.expect_return_datetime >=:sdr_expt_pick_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='7' AND " +
            "sdr.pick_up_datetime <=:sdr_expt_return_date AND " +
            "sdr.expect_return_datetime >=:sdr_expt_pick_date)) " +
            "ORDER BY vm.id")
    List<VehicleModel> listByPackagePickDateReturnDateSdr(@Param("package_id") Integer package_id,
                                                          @Param("sdr_expt_pick_date") LocalDateTime sdr_expt_pick_date,
                                                          @Param("sdr_expt_return_date") LocalDateTime sdr_expt_return_date);
}
