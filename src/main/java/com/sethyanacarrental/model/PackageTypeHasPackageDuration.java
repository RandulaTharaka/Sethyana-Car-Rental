package com.sethyanacarrental.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "package_type_has_package_duration")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PackageTypeHasPackageDuration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "package_type_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JsonIgnore //Ignore reading supplier_id (Entire Supplier Object)
    private PackageType package_type_id;

    @JoinColumn(name = "package_duration_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private PackageDuration package_duration_id;
}
