package com.clientehub.service;

import com.clientehub.dto.ClienteRequest;
import com.clientehub.dto.ClienteResponse;
import com.clientehub.dto.PageResponse;
import com.clientehub.entity.Cliente;
import com.clientehub.entity.Cliente.StatusCliente;
import com.clientehub.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public PageResponse<ClienteResponse> listar(String search, String status, int page, int size) {
        StatusCliente statusEnum = null;
        if (status != null && !status.isBlank()) {
            try { statusEnum = StatusCliente.valueOf(status.toUpperCase()); }
            catch (IllegalArgumentException ignored) {}
        }
        var pageable = PageRequest.of(page, size, Sort.by("nome").ascending());
        var result = clienteRepository.findAllWithFilters(
            (search != null && search.isBlank()) ? null : search,
            statusEnum,
            pageable
        );
        return PageResponse.from(result.map(ClienteResponse::from));
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(Long id) {
        return ClienteResponse.from(findOrThrow(id));
    }

    public ClienteResponse criar(ClienteRequest request) {
        if (clienteRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }
        var cliente = Cliente.builder()
            .nome(request.nome())
            .email(request.email())
            .telefone(request.telefone())
            .status(request.status() != null ? request.status() : StatusCliente.ATIVO)
            .build();
        return ClienteResponse.from(clienteRepository.save(cliente));
    }

    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        var cliente = findOrThrow(id);
        if (clienteRepository.existsByEmailAndIdNot(request.email(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já está em uso por outro cliente");
        }
        cliente.setNome(request.nome());
        cliente.setEmail(request.email());
        cliente.setTelefone(request.telefone());
        if (request.status() != null) cliente.setStatus(request.status());
        return ClienteResponse.from(clienteRepository.save(cliente));
    }

    public void deletar(Long id) {
        findOrThrow(id);
        clienteRepository.deleteById(id);
    }

    private Cliente findOrThrow(Long id) {
        return clienteRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
    }
}
