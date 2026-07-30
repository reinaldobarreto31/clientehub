package com.clientehub.dto;

import com.clientehub.entity.Cliente;
import com.clientehub.entity.Cliente.StatusCliente;

import java.time.LocalDateTime;

public record ClienteResponse(
    Long id,
    String nome,
    String email,
    String telefone,
    StatusCliente status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static ClienteResponse from(Cliente c) {
        return new ClienteResponse(
            c.getId(),
            c.getNome(),
            c.getEmail(),
            c.getTelefone(),
            c.getStatus(),
            c.getCreatedAt(),
            c.getUpdatedAt()
        );
    }
}
