package com.itple.sample.json.jsonobject;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JsonSVGViewer {

	private static final Logger logger = LoggerFactory.getLogger(JsonSVGViewer.class);

	@Test
	public void StringToJson() throws Exception {

		String input = "{\"menu\": {\"header\": \"SVG Viewer\",\"items\": [{\"id\": \"Open\"},{\"id\": \"OpenNew\", \"label\": \"Open New\"},null,{\"id\": \"ZoomIn\", \"label\": \"Zoom In\"},{\"id\": \"ZoomOut\", \"label\": \"Zoom Out\"},{\"id\": \"OriginalView\", \"label\": \"Original View\"},null,{\"id\": \"Quality\"},{\"id\": \"Pause\"},{\"id\": \"Mute\"},null,{\"id\": \"Find\", \"label\": \"Find...\"},{\"id\": \"FindAgain\", \"label\": \"Find Again\"},{\"id\": \"Copy\"},{\"id\": \"CopyAgain\", \"label\": \"Copy Again\"},{\"id\": \"CopySVG\", \"label\": \"Copy SVG\"},{\"id\": \"ViewSVG\", \"label\": \"View SVG\"},{\"id\": \"ViewSource\", \"label\": \"View Source\"},{\"id\": \"SaveAs\", \"label\": \"Save As\"},null,{\"id\": \"Help\"},{\"id\": \"About\", \"label\": \"About Adobe CVG Viewer...\"}] } }";

		JSONObject json = new JSONObject(input);

		logger.debug("String to Json -----> " + json.toString());

		assertEquals(json.getJSONObject("menu").getString("header"), "SVG Viewer");
	}

	@Test
	public void JsonToString() throws Exception {

		JSONObject json = new JSONObject();
		JSONArray jsonArray = new JSONArray();
		JSONObject menu = new JSONObject();
		JSONObject items = new JSONObject();

		jsonArray.put(items);

		items.put("id", "Open");
		items.put("label", "Open New");
		
		menu.put("header", "SVG Viewer");

		json.put("menu", menu);
		json.put("items", jsonArray);

		logger.debug("Json to String -----> " + json.toString());
		
		assertEquals(json.getJSONObject("menu").getString("header"), "SVG Viewer");
		assertEquals(json.getJSONArray("items").getJSONObject(0).getString("id"),"Open");
		assertEquals(json.getJSONArray("items").getJSONObject(0).getString("label"),"Open New");

	}

}
