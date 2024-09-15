package com.quirely.backend.service;

import com.quirely.backend.controller.EmailVerificationJwtPayload;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import static com.quirely.backend.utils.JwtUtils.createJwt;
import static com.quirely.backend.utils.JwtUtils.parseJwt;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Value("${client_base_url}")
    private String clientBaseUrl;
    @Value("${jwt.email.secret}")
    private String jwtEmailSecret;

    public void sendRegistrationEmail(String recipient, long userId) {
        String confirmationToken = createJwt(new EmailVerificationJwtPayload(userId), jwtEmailSecret, 86_400_000);

        Context context = new Context();
        context.setVariable("confirmationToken", confirmationToken);
        context.setVariable("clientBaseUrl", clientBaseUrl);

        String htmlContent = templateEngine.process("verify-email", context);
        sendMail(recipient, "Quirely - Verify email", htmlContent);
    }

    public Long getUserIdFromVerificationToken(String verificationToken) {
        EmailVerificationJwtPayload emailVerificationJwtPayload = parseJwt(verificationToken, jwtEmailSecret, EmailVerificationJwtPayload.class);
        if (emailVerificationJwtPayload == null) {
            return null;
        }
        return emailVerificationJwtPayload.getId();
    }

    private void sendMail(String to, String subject, String text) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);
            helper.setFrom("no_reply@quirely.io"); // TODO: to change

            javaMailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send email", e);
        }
    }
}