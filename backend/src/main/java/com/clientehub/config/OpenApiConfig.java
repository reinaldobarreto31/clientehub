package com.clientehub.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "ClienteHub API",
        version = "1.0.0",
        description = "API RESTful para gerenciamento de clientes. Autenticação via JWT Bearer token.",
        contact = @Contact(
            name = "Reinaldo Barreto",
            url = "https://github.com/reinaldobarreto31"
        ),
        license = @License(name = "MIT")
    )
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "Insira o token JWT obtido em POST /api/auth/login"
)
public class OpenApiConfig {}
