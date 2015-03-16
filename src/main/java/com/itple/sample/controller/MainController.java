package com.itple.sample.controller;

import java.io.StringWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
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

	@RequestMapping(value = "/create", method = RequestMethod.GET)
	public String create() throws Throwable {
		logger.debug("create");
		return "/create";
	}

	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@ResponseBody
	public String info(HttpServletRequest request, HttpServletResponse response, @ModelAttribute User user) throws Throwable {
	
		logger.debug(user.toString());

		Serializer serializer = new Persister();
		StringWriter out = new StringWriter();
		
		serializer.write(user, out);
		String resultXml = out.toString();
		
		return resultXml;
	}

	@RequestMapping(value = "/create2", method = RequestMethod.POST)
	@ResponseBody
	public String result(HttpServletRequest request, HttpServletResponse response, ModelMap model, @ModelAttribute User user) throws Throwable {

		logger.debug("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
		logger.debug(user.toString());
		
		Serializer serializer = new Persister();
		StringWriter out = new StringWriter();
		
		serializer.write(user, out);
		String resultXml = out.toString();
		
		return resultXml;
	}

}