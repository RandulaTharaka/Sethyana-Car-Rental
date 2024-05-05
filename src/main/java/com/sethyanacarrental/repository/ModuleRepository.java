package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Integer> {

    @Query(value = "SELECT NEW Module(m.id,m.name) FROM Module m " +
            "WHERE m NOT IN (SELECT p.moduleId FROM Privilege p WHERE p.roleId.id= :roleid)")
    List<Module> listUnassignedToThisRole(@Param("roleid") Integer roleid);

    @Query(value = "SELECT NEW Module(m.id,m.name) FROM Module m")
    List<Module> list();

    @Query(value = "SELECT NEW Module(m.id,m.name) FROM Module m " +
            "WHERE m IN(SELECT p.moduleId FROM Privilege p WHERE p.sel=1 AND " +
            "p.roleId IN(SELECT ur.roleId FROM UserRole ur WHERE ur.userId.id=:userid))")
    List<Module> listbyuser(@Param("userid") Integer userid);
}
