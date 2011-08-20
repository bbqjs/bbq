package org.bbqjs.spring.security.authentication.json;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class HeaderBasedAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
		response.addHeader("X-bbq-responseType", "1");
		response.addHeader("X-bbq-responseMessage", "Authenticated OK");
		
		HttpServletResponseWrapper responseWrapper = new HttpServletResponseWrapper(response);
		Writer out = responseWrapper.getWriter();
		
		out.write("{result: true}");
		out.close();
	}
}
