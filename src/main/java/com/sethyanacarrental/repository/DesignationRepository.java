package com.sethyanacarrental.repository;


import com.sethyanacarrental.model.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface DesignationRepository extends JpaRepository<Designation, Integer> {
    @Query(value = "SELECT NEW Designation(d.id,d.name) FROM Designation d")
    List<Designation> list();

    @Query("SELECT d FROM Designation d WHERE d.name= :name")
    Designation findByName(@Param("name") String name);
}