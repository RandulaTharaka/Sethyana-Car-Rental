package com.sethyanacarrental.repository;


import com.sethyanacarrental.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findByRole(String role);

    @Query(value = "SELECT NEW Role(r.id,r.role) FROM Role r WHERE r.role<> 'ADMIN'")
    List<Role> list();
}