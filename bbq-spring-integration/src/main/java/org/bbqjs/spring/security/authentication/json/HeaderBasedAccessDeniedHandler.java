package org.bbqjs.spring.security.authentication.json;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.bbqjs.spring.mvc.ErrorController;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

public class HeaderBasedAccessDeniedHandler implements AccessDeniedHandler {
	private String loginFormUrl;

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
		response.addIntHeader(ErrorController.X_BBQ_RESPONSE_TYPE, 0);
		response.addHeader(ErrorController.X_BBQ_RESPONSE_MESSAGE, "Not authenticated");

		if(loginFormUrl != null) {
			// redirect user to log in form
			response.setStatus(307);
			response.addHeader("location", loginFormUrl);
		}

		HttpServletResponseWrapper responseWrapper = new HttpServletResponseWrapper(response);
		Writer out = responseWrapper.getWriter();

		out.write("Not authenticated");
		out.close();
	}

	public void setLoginFormUrl(String loginFormUrl) {
		this.loginFormUrl = loginFormUrl;
	}
}
