package com.fitness.community.config;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
@Configuration
public class ActivityClientConfig {
 @Bean @LoadBalanced WebClient.Builder communityWebClientBuilder(){ return WebClient.builder(); }
 @Bean WebClient activityClient(WebClient.Builder communityWebClientBuilder){ return communityWebClientBuilder.baseUrl("http://ACTIVITY-SERVICE").build(); }
}
