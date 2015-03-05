package com.itple.sample.controller;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

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
	
}