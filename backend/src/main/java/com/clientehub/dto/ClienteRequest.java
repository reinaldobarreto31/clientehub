package com.clientehub.dto;

import com.clientehub.entity.Cliente.StatusCliente;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClienteRequest(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 150, message = "Nome deve ter entre 2 e 150 caracteres")
    String nome,

    @Email(message = "E-mail inválido")
    @NotBlank(message = "E-mail é obrigatório")
    String email,

    @Size(max = 20, message = "Telefone deve ter no máximo 20 caracteres")
    String telefone,

    StatusCliente status
) {}
