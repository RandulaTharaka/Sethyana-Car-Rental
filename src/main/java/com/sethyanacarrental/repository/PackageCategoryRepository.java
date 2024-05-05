package com.sethyanacarrental.repository;

import com.sethyanacarrental.model.PackageCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackageCategoryRepository extends JpaRepository<PackageCategory, Integer> {
}
