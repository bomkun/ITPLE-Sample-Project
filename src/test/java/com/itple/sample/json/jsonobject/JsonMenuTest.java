package com.itple.sample.json.jsonobject;

import static org.junit.Assert.assertEquals;

import org.json.JSONObject;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JsonMenuTest {

	private static final Logger logger = LoggerFactory.getLogger(JsonMenuTest.class);

	@Test
	public void StringToJson() throws Exception {

		String input = "{\"menu\": {\"id\": \"file\",\"value\": \"File\",\"popup\": {\"menuitem\": [{\"value\": "
				+ "\"New\", \"onclick\": \"CreateNewDoc()\"},{\"value\": \"Open\", \"onclick\": "
				+ "\"OpenDoc()\"},{\"value\": \"Close\", \"onclick\": \"CloseDoc()\"}]}}}";

		JSONObject json = new JSONObject(input);

		logger.debug("String to Json ----->" + json.toString());

		assertEquals(json.getJSONObject("menu").getString("id"), "file");
		assertEquals(json.getJSONObject("menu").getString("value"),"File");
		
	}

	@Test
	public void JsonToString() throws Exception {

		JSONObject menu = new JSONObject();
		JSONObject popup = new JSONObject();
		JSONObject json = new JSONObject();

		String[] menuItem = { "value", "New", "onclick", "CreateNewDoc()", "value", "Open", "onclick", "OpenDoc()", "value", "Close", "onclick", "CloseDoc()" };

		menu.put("id", "file");
		menu.put("value", "File");
		menu.put("popup", popup);
		popup.put("menuitem", menuItem);
		json.put("menu", menu);

		logger.debug("Json to String ----->" + menu.toString());

		assertEquals(json.getJSONObject("menu").getString("id"), "file");
		assertEquals(json.getJSONObject("menu").get("value"), "File");
		

	}
}
