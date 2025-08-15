package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

// vehicle status: 1=Available,  2=Reserved, 3=On Rent
// reservation status: 1=Booking 2=Reserved, 7=On Rent

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    @Query("SELECT v FROM Vehicle v JOIN v.model_id m JOIN m.vehicle_type_id vt ORDER BY vt.id")
    Page<Vehicle> findAllOrderedByVehicleTypeId(Pageable pageable);

    @Query("SELECT v FROM Vehicle v")
    List<Vehicle> list();

    @Query("SELECT v FROM Vehicle v WHERE v.model_id.vehicle_type_id.id=:vehicleTypeId")
    List<Vehicle> listByVehicleType(@Param("vehicleTypeId") Integer vehicleTypeId);

    @Query("SELECT v FROM Vehicle v WHERE v.model_id.id=:vehicleModelId")
    List<Vehicle> listByVehicleModel(@Param("vehicleModelId") Integer vehicleModelId);

    @Query("SELECT v FROM Vehicle v WHERE v.vehicle_status_id = '1' OR " +
            "((v.vehicle_status_id = '2' OR v.vehicle_status_id = '3') AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='2' AND " +
            "cdr.expect_return_datetime >=:exp_pick_up_datetime AND " +
            "cdr.expect_pick_up_datetime <=:exp_return_datetime) AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='7' " +
            "AND cdr.expect_return_datetime >=:exp_pick_up_datetime AND " +
            "cdr.expect_pick_up_datetime <=:exp_return_datetime) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='2' AND " +
            "sdr.expect_return_datetime >=:exp_pick_up_datetime AND " +
            "sdr.pick_up_datetime <=:exp_return_datetime) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='7' " +
            "AND sdr.expect_return_datetime >=:exp_pick_up_datetime AND " +
            "sdr.pick_up_datetime <=:exp_return_datetime)) " +
            "ORDER BY v.id")
    List<Vehicle> availableList(@Param("exp_pick_up_datetime") LocalDateTime exp_pick_up_datetime,
                                @Param("exp_return_datetime") LocalDateTime exp_return_datetime);

    @Query("SELECT v FROM Vehicle v " +
            "WHERE v.model_id IN (SELECT phm.model_id FROM PackageHasModel phm " +
            "WHERE phm.package_id.id=:package_id) AND " +
            "(v.vehicle_status_id = '1' OR " +
            "((v.vehicle_status_id = '2' OR v.vehicle_status_id = '3') AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='2' AND " +
            "cdr.expect_return_datetime >=:cdr_expt_pick_date AND " +
            "cdr.expect_pick_up_datetime <=:cdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='7' AND " +
            "cdr.expect_return_datetime >=:cdr_expt_pick_date AND " +
            "cdr.expect_pick_up_datetime <=:cdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='2' AND " +
            "sdr.expect_return_datetime >=:cdr_expt_pick_date AND " +
            "sdr.pick_up_datetime <=:cdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='7' AND " +
            "sdr.expect_return_datetime >=:cdr_expt_pick_date AND " +
            "sdr.pick_up_datetime <=:cdr_expt_return_date))) " +
            "ORDER BY v.id")
    List<Vehicle> listByPackagePickDateReturnDate(@Param("package_id") Integer package_id,
                                                  @Param("cdr_expt_pick_date") LocalDateTime cdr_expt_pick_date,
                                                  @Param("cdr_expt_return_date") LocalDateTime cdr_expt_return_date);

    @Query("SELECT v FROM Vehicle v " +
            "WHERE v.model_id IN (SELECT phm.model_id FROM PackageHasModel phm " +
            "WHERE phm.package_id.id=:package_id) AND " +
            "(v.vehicle_status_id = '1' OR " +
            "((v.vehicle_status_id = '2' OR v.vehicle_status_id = '3') AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='2' AND " +
            "cdr.expect_return_datetime >=:sdr_expt_pick_date AND " +
            "cdr.expect_pick_up_datetime <=:sdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='7' AND " +
            "cdr.expect_return_datetime >=:sdr_expt_pick_date AND " +
            "cdr.expect_pick_up_datetime <=:sdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='2' AND " +
            "sdr.expect_return_datetime >=:sdr_expt_pick_date AND " +
            "sdr.pick_up_datetime <=:sdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='7' AND " +
            "sdr.expect_return_datetime >=:sdr_expt_pick_date AND " +
            "sdr.pick_up_datetime <=:sdr_expt_return_date))) " +
            "ORDER BY v.id")
    List<Vehicle> listByPackagePickDateReturnDateSdr(@Param("package_id") Integer package_id,
                                                     @Param("sdr_expt_pick_date") LocalDateTime sdr_expt_pick_date,
                                                     @Param("sdr_expt_return_date") LocalDateTime sdr_expt_return_date);

    @Query("SELECT v FROM Vehicle v " +
            "WHERE v.model_id IN (SELECT phm.model_id FROM PackageHasModel phm " +
            "WHERE phm.package_id.id=:package_id AND phm.model_id.id=:v_model_id) AND " +
            "(v.vehicle_status_id = '1' OR " +
            "((v.vehicle_status_id = '2' OR v.vehicle_status_id = '3') AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='2' AND " +
            "cdr.expect_return_datetime >=:cdr_expt_pick_date AND " +
            "cdr.expect_pick_up_datetime <=:cdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='7' AND " +
            "cdr.expect_return_datetime >=:cdr_expt_pick_date AND " +
            "cdr.expect_pick_up_datetime <=:cdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr WHERE " +
            "sdr.reservation_status_id='2' AND " +
            "sdr.expect_return_datetime >=:cdr_expt_pick_date AND " +
            "sdr.pick_up_datetime <=:cdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='7' AND " +
            "sdr.expect_return_datetime >=:cdr_expt_pick_date AND " +
            "sdr.pick_up_datetime <=:cdr_expt_return_date))) " +
            "ORDER BY v.id")
    List<Vehicle> listByPackagePickDateReturnDateVModel(@Param("package_id") Integer package_id,
                                                        @Param("cdr_expt_pick_date") LocalDateTime cdr_expt_pick_date,
                                                        @Param("cdr_expt_return_date") LocalDateTime cdr_expt_return_date,
                                                        @Param("v_model_id") Integer v_model_id);

    @Query("SELECT v FROM Vehicle v " +
            "WHERE v.model_id IN (SELECT phm.model_id FROM PackageHasModel phm " +
            "WHERE phm.package_id.id=:package_id AND phm.model_id.id=:v_model_id) AND " +
            "(v.vehicle_status_id = '1' OR " +
            "((v.vehicle_status_id = '2' OR v.vehicle_status_id = '3') AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='2' AND " +
            "cdr.expect_return_datetime >=:sdr_expt_pick_date AND " +
            "cdr.expect_pick_up_datetime <=:sdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT cdr.vehicle_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='7' AND " +
            "cdr.expect_return_datetime >=:sdr_expt_pick_date AND " +
            "cdr.expect_pick_up_datetime <=:sdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr " +
            "WHERE sdr.reservation_status_id='2' AND " +
            "sdr.expect_return_datetime >=:sdr_expt_pick_date AND " +
            "sdr.pick_up_datetime <=:sdr_expt_return_date) AND " +
            "v.id NOT IN (SELECT sdr.vehicle_id FROM SelfDriveReservation sdr WHERE " +
            "sdr.reservation_status_id='7' AND " +
            "sdr.expect_return_datetime >=:sdr_expt_pick_date AND " +
            "sdr.pick_up_datetime <=:sdr_expt_return_date))) " +
            "ORDER BY v.id")
    List<Vehicle> listByPackagePickDateReturnDateVModelSdr(@Param("package_id") Integer package_id,
                                                           @Param("sdr_expt_pick_date") LocalDateTime sdr_expt_pick_date,
                                                           @Param("sdr_expt_return_date") LocalDateTime sdr_expt_return_date,
                                                           @Param("v_model_id") Integer v_model_id);

    @Query("SELECT v FROM Vehicle v " +
            "WHERE (v.license_plate LIKE CONCAT('%', :searchtext, '%') OR " +
            "v.model_id.name LIKE CONCAT('%', :searchtext, '%') OR " +
            "v.model_id.brand_id.name LIKE CONCAT('%', :searchtext, '%') OR " +
            "CONCAT(v.model_id.brand_id.name, ' ', v.model_id.name) LIKE CONCAT('%', :searchtext, '%') OR " +
            "v.model_id.vehicle_type_id.name LIKE CONCAT('%', :searchtext, '%') OR " +
            "v.color_id.name LIKE CONCAT('%', :searchtext, '%'))")
    Page<Vehicle> findAll(@Param("searchtext") String searchtext, Pageable of);
}