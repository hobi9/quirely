package com.quirely.backend.config.security.authentication;

import com.quirely.backend.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.LinkedList;

import static com.quirely.backend.enums.Roles.VERIFIED;

@Getter
@Setter
@RequiredArgsConstructor
public class SessionAuthentication implements Authentication {
    private User user;
    private final long userId;
    private boolean authenticated;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        var authorities = new LinkedList<GrantedAuthority>();
        if (user.isVerified()) {
            authorities.add(new SimpleGrantedAuthority(VERIFIED.getValue()));
        }
        return authorities;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getDetails() {
        return null;
    }

    @Override
    public User getPrincipal() {
        return user;
    }

    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }

    @Override
    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        authenticated = isAuthenticated;
    }

    @Override
    public String getName() {
        return null;
    }
}
