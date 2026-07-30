package com.clientehub.config;

import com.clientehub.entity.Cliente;
import com.clientehub.entity.Usuario;
import com.clientehub.repository.ClienteRepository;
import com.clientehub.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (usuarioRepository.count() == 0) {
            var admin = Usuario.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .nome("Administrador")
                .roles(Set.of("ROLE_ADMIN", "ROLE_USER"))
                .build();
            usuarioRepository.save(admin);
            log.info("Usuário padrão criado: admin / admin123");
        }

        if (clienteRepository.count() == 0) {
            var clientes = List.of(
                Cliente.builder()
                    .nome("Ana Silva").email("ana.silva@email.com")
                    .telefone("(71) 99001-1234").status(Cliente.StatusCliente.ATIVO).build(),
                Cliente.builder()
                    .nome("Bruno Costa").email("bruno.costa@empresa.com.br")
                    .telefone("(11) 98765-4321").status(Cliente.StatusCliente.ATIVO).build(),
                Cliente.builder()
                    .nome("Carla Mendes").email("carla@startup.io")
                    .telefone("(21) 97654-3210").status(Cliente.StatusCliente.PROSPECTO).build(),
                Cliente.builder()
                    .nome("Daniel Ferreira").email("daniel.ferreira@negocio.com")
                    .telefone("(31) 96543-2109").status(Cliente.StatusCliente.INATIVO).build(),
                Cliente.builder()
                    .nome("Eduarda Lima").email("edu.lima@gmail.com")
                    .telefone("(85) 95432-1098").status(Cliente.StatusCliente.ATIVO).build()
            );
            clienteRepository.saveAll(clientes);
            log.info("5 clientes de exemplo criados.");
        }
    }
}
