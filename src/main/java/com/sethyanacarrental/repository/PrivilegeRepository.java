package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.Module;
import com.sethyanacarrental.model.Privilege;
import com.sethyanacarrental.model.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PrivilegeRepository extends JpaRepository<Privilege, Integer> {
    // Query for get privilege for given Module AND User
    @Query(value = "SELECT bit_or(sel) sel, bit_or(ins) ins, bit_or(upd) upd, bit_or(del) del FROM sethyana_car_rental.privilege " +
            "WHERE roles_role_id IN (SELECT role_id FROM sethyana_car_rental.user_role " +
            "WHERE user_id=(SELECT user_id FROM sethyana_car_rental.users " +
            "WHERE user_name = ?1)) AND " +
            "module_id=(SELECT id FROM sethyana_car_rental.module " +
            "WHERE name= ?2);", nativeQuery = true)
    String findByUserModle(@Param("username") String username, @Param("modulename") String modulename);

    @Query("SELECT p FROM Privilege p WHERE p.roleId= :role AND p.moduleId= :module")
    Privilege findByRoleModule(@Param("role") Role role, @Param("module") Module module);

    @Query("SELECT p FROM Privilege p WHERE (p.roleId.role LIKE CONCAT('%',:searchtext,'%') OR " +
            "p.moduleId.name LIKE CONCAT('%',:searchtext,'%') ) AND p.roleId.role<>'Admin' ")
    Page<Privilege> findAll(@Param("searchtext") String searchtext, Pageable of);
}
