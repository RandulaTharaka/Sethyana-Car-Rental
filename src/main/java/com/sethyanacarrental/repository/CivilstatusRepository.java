package com.sethyanacarrental.repository;


import com.sethyanacarrental.model.Civilstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CivilstatusRepository extends JpaRepository<Civilstatus, Integer> {

    @Query(value = "SELECT NEW Civilstatus(c.id,c.name) FROM Civilstatus c")
    List<Civilstatus> list();
}