package com.itple.sample.common.interceptor;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class ContextPathInterceptor extends HandlerInterceptorAdapter {

	private final String CONTEXT_PATH = "contextPath";

	// Controller가 수행된 후 View 호출 전 상태
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

		HttpSession session = request.getSession();
		ServletContext context = session.getServletContext();

		Object object = session.getAttribute(CONTEXT_PATH);

		if (object == null) {
			session.setAttribute(CONTEXT_PATH, context.getContextPath());
		}

	}

}
