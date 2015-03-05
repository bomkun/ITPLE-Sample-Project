package com.itple.sample.controller;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.itple.sample.common.domain.User;

@Controller
public class MainController {
	
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@RequestMapping("")
	public String index() throws Throwable {
		logger.debug("index!");
		return "/index";
	}
	
	@RequestMapping("/create")
	public String create() throws Throwable {
		logger.debug("create");
		return "/create";
	}
	
	@RequestMapping(value = "/info", method = RequestMethod.POST)
	@ResponseBody
	public User info(HttpServletRequest request, HttpServletResponse response) throws Throwable {
	
		User user = new User();
		
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
		
		return user ;
	}
	
}