package com.fitness.activity_service.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Bean @LoadBalanced
    public WebClient.Builder webClientBuilder() { return WebClient.builder(); }

    @Bean
    public WebClient userServiceWebClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder.clone().baseUrl("http://USER-SERVICE").build();
    }

    @Bean
    public WebClient aiServiceWebClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder.clone().baseUrl("http://AI-SERVICE").build();
    }
}
