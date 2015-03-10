package com.itple.sample.controller;


import java.io.OutputStreamWriter;
import java.io.Writer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.itple.sample.common.domain.User;

@Controller
public class MainController {
	
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@RequestMapping("")
	public String index() throws Throwable {
		logger.debug("index!");
		return "/index";
	}
	
	@RequestMapping(value = "/create" , method = RequestMethod.GET)
	public String create() throws Throwable {
		logger.debug("create");
		return "/create";
	}
	
	@RequestMapping(value = "/result", method = RequestMethod.POST)
	public ModelAndView info(HttpServletRequest request, HttpServletResponse response, User user) throws Throwable {
	
		
		
		String name = request.getParameter("name");
		String email = request.getParameter("email");
		String gender = request.getParameter("gender");
		String phone = request.getParameter("phone");
		String city =  request.getParameter("city");
		
	
		user.setName(name);
		user.setEmail(email);
		user.setGender(gender);
		user.setPhone(phone);
		user.setCity(city);
		
		
		logger.debug("data {} : " + user.toString());
		
		
		return new ModelAndView("/result", "user", user) ;
	}
	
	@RequestMapping(value = "/result" , method = RequestMethod.GET)
	public String result(HttpServletRequest request, HttpServletResponse response, ModelMap model) throws Throwable {
		
		
		
		User user = new User();
		
		model.put("user", user);
		
		logger.debug("result");
		
		
		return "/result";
	}
	
	
}