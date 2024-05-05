package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Integer> {
    @Query("SELECT d FROM Driver d")
    List<Driver> list();

    @Query("SELECT d FROM Driver d WHERE d.driver_status_id = '1' OR " +
            "(d.driver_status_id = '2' AND " +
            "d.id NOT IN (SELECT cdr.driver_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='2' AND cdr.expect_pick_up_datetime <=:cdr_expt_return_date AND " +
            "cdr.expect_return_datetime >=:cdr_expt_pick_date) AND " +
            "d.id NOT IN " +
            "(SELECT cdr.driver_id FROM ChauffeurDriveReservation cdr " +
            "WHERE cdr.reservation_status_id='7' AND cdr.expect_return_datetime >=:cdr_expt_pick_date AND " +
            "cdr.expect_pick_up_datetime <=:cdr_expt_return_date)) ORDER BY d.id")
    List<Driver> listByPickReturn(@Param("cdr_expt_pick_date") LocalDateTime cdr_expt_pick_date,
                                  @Param("cdr_expt_return_date") LocalDateTime cdr_expt_return_date);

    @Query("SELECT d FROM Driver d WHERE d.calling_name LIKE CONCAT('%',:calling_name,'%') OR " +
            "d.driving_license LIKE CONCAT('%',:license,'%') AND d.driver_status_id = '1' OR " +
            "(d.driver_status_id = '2' AND " +
            "d.id NOT IN " +
            "(SELECT cdr.driver_id FROM ChauffeurDriveReservation cdr WHERE cdr.reservation_status_id='2' AND " +
            "cdr.expect_pick_up_datetime <=:cdr_expt_return_date AND cdr.expect_return_datetime >=:cdr_expt_pick_date) AND " +
            "d.id NOT IN " +
            "(SELECT cdr.driver_id FROM ChauffeurDriveReservation cdr WHERE cdr.reservation_status_id='7' AND " +
            "cdr.expect_return_datetime >=:cdr_expt_pick_date AND cdr.expect_pick_up_datetime <=:cdr_expt_return_date)) ORDER BY d.id")
    List<Driver> listByPickReturnCallingNameLicense(@Param("cdr_expt_pick_date") LocalDateTime cdr_expt_pick_date,
                                                    @Param("cdr_expt_return_date") LocalDateTime cdr_expt_return_date,
                                                    @Param("calling_name") String calling_name,
                                                    @Param("license") String license);
}