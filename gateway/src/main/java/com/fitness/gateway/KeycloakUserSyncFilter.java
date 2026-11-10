package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Runs in the gateway route pipeline after Spring Security has authenticated the JWT.
 * The identity header is overwritten from the authenticated token, never trusted from clients.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class KeycloakUserSyncFilter implements GlobalFilter, Ordered {
    private final UserService userService;

    @Override public int getOrder() { return -10; }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return ReactiveSecurityContextHolder.getContext().hasElement().flatMap(hasContext -> {
            if (!hasContext) return chain.filter(exchange);
            return ReactiveSecurityContextHolder.getContext().map(SecurityContext::getAuthentication).flatMap(principal -> {
                if (!(principal instanceof JwtAuthenticationToken authentication)) return chain.filter(exchange);
                var jwt = authentication.getToken();
                String userId = jwt.getSubject();
                RegisterRequest request = new RegisterRequest();
                request.setEmail(jwt.getClaimAsString("email"));
                request.setKeycloakId(userId);
                request.setFirstName(jwt.getClaimAsString("given_name"));
                request.setLastName(jwt.getClaimAsString("family_name"));

                Mono<?> sync = request.getEmail() == null || request.getEmail().isBlank()
                        ? Mono.empty()
                        : userService.validateUser(userId).flatMap(exists ->
                            exists ? Mono.empty() : userService.registerUser(request));
                return sync.onErrorResume(error -> {
                    log.warn("User profile synchronization skipped: {}", error.getMessage());
                    return Mono.empty();
                }).then(Mono.defer(() -> {
                    ServerHttpRequest securedRequest = exchange.getRequest().mutate()
                            .headers(headers -> headers.set("X-User-ID", userId))
                            .build();
                    return chain.filter(exchange.mutate().request(securedRequest).build());
                }));
            });
        });
    }

}
