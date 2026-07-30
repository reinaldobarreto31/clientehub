package com.clientehub.dto;

public record AuthResponse(
    String token,
    String username,
    String nome,
    long expiresIn
) {}
