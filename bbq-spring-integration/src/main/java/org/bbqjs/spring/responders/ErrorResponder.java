package org.bbqjs.spring.responders;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

/**
 * Maps exceptions to error codes.
 * 
 * Set the errorCodes map to do custom error mapping.
 * 
 * @author alex
 */
public class ErrorResponder implements HandlerExceptionResolver, InitializingBean {
	private final static Logger LOG = LoggerFactory.getLogger(ErrorResponder.class);
	
	/**
	 * Default error code.
	 */
	private static final int EPIC_FAIL_CODE = -100;
	
	/**
	 * If the error header (e.g. stack trace) is too long, web containers tend to get unhappy so
	 * we truncate it to this length.
	 */
	private static final int MAX_HEADER_LENGTH = 3072;

	private Map<Class<?>, Integer>errorCodes;

	@Override
	public void afterPropertiesSet() throws Exception {
		if(errorCodes == null) {
			errorCodes = new HashMap<Class<?>, Integer>();
			errorCodes.put(AccessDeniedException.class, new Integer(-99));
		}
	}

	public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception) {
		try {
			ModelAndView modelAndView = getModelAndView();
			
			LOG.error("Exception encountered", exception);
			String message = getErrorMessage(exception);
			int code = getErrorCode(exception);

			// -100 triggers epic fail message in front end
			response.addIntHeader("X-bbq-responseType", code);
			response.addHeader("X-bbq-responseMessage", message);

			response.setStatus(HttpServletResponse.SC_OK);

			modelAndView.addObject("error", message);

			return modelAndView;
		} catch (Exception e) {
			LOG.error("Exception encountered while resolving exception.  That's a bit annoying.", e);
		}

		return null;
	}

	protected String getErrorMessage(Exception exception) throws UnsupportedEncodingException {
		String message = exception.getMessage() + "\r\n\r\n";

		for (StackTraceElement trace : exception.getStackTrace()) {
			String line = trace.toString();

			message += line + "\r\n";
		}

		message = URLEncoder.encode(message, "UTF-8");

		if (message.length() > (MAX_HEADER_LENGTH + 3)) {
			message = message.substring(0, MAX_HEADER_LENGTH) + "...";
		}

		return message;
	}

	protected int getErrorCode(Exception exception) {
		Integer code = errorCodes.get(exception.getClass());
		
		if(code != null) {
			return code;
		}

		return EPIC_FAIL_CODE;
	}
	
	protected ModelAndView getModelAndView() {
		return new ModelAndView("error");
	}
	
	public void setErrorCodes(Map<Class<?>, Integer> errorCodes) {
		this.errorCodes = errorCodes;
	}
}