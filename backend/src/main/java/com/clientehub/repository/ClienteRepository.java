package com.clientehub.repository;

import com.clientehub.entity.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    @Query("""
        SELECT c FROM Cliente c
        WHERE (:search IS NULL OR LOWER(c.nome) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:status IS NULL OR c.status = :status)
        """)
    Page<Cliente> findAllWithFilters(
        @Param("search") String search,
        @Param("status") Cliente.StatusCliente status,
        Pageable pageable
    );
}
