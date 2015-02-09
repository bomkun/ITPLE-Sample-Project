package com.itple.sample.common.interceptor;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class ContextPathInterceptor extends HandlerInterceptorAdapter {

	private final String CONTEXT_PATH = "contextPath";

	/**
	 *  Controller가 수행된 후 View 호출 전 상태
	 *  preHandle   : Controller가 수행되기 전 실행. 이후 Controller를 수행할지 여부를 boolean으로 return
	 *  postHandle  : Controller가 수행된 후 View를 호출하기 전 상태
	 *  afterHandle : View 작업까지 완료된 후 호출. responseBody를 이용할 경우, UI에 이미 값을 전달 후 해당 부분이 호출됨
	 * ServletContext: 하나의 서블릿이 컨테이너와 통신하기 위해 사용되어지는 메소드들을 가지고 있는 클래스
	 * getServletContext : 웹 애플리케이션의 Context path를 가져온다
	 */
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
