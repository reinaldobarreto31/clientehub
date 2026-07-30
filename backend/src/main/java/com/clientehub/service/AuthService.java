package com.clientehub.service;

import com.clientehub.dto.AuthRequest;
import com.clientehub.dto.AuthResponse;
import com.clientehub.repository.UsuarioRepository;
import com.clientehub.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
        String token = jwtService.generateToken(userDetails);

        var usuario = usuarioRepository.findByUsername(request.username())
            .orElseThrow();

        return new AuthResponse(
            token,
            usuario.getUsername(),
            usuario.getNome(),
            jwtService.getExpirationMs()
        );
    }
}
