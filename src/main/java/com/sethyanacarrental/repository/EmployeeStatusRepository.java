package com.sethyanacarrental.repository;


import com.sethyanacarrental.model.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface EmployeeStatusRepository extends JpaRepository<EmployeeStatus, Integer> {

    @Query(value = "SELECT NEW EmployeeStatus(e.id,e.name) FROM EmployeeStatus e")
    List<EmployeeStatus> list();


}