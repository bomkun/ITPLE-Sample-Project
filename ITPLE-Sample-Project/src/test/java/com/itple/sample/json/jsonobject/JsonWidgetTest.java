package com.itple.sample.json.jsonobject;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.json.JSONObject;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JsonWidgetTest {

	private static final Logger logger = LoggerFactory.getLogger(JsonWidgetTest.class);

	@Test
	public void StringToJson() throws Exception {

		String input = "{\"widget\": {\"debug\": \"on\",\"window\": {\"title\": \"Sample Konfabulator Widget\",\"name\": \"main_window\",\"width\": 500,\"height\": 500}"
				+ ",\"image\": { \"src\": \"Images/Sun.png\",\"name\": \"sun1\",\"hOffset\": 250,\"vOffset\": 250,\"alignment\": \"center\"},"
				+ "\"text\": {\"data\": \"Click Here\",\"size\": 36,\"style\": \"bold\",\"name\": \"text1\",\"hOffset\": 250,\"vOffset\": 100,\"alignment\": \"center\","
				+ "\"onMouseUp\": \"sun1.opacity = (sun1.opacity / 100) * 90;\"}}}";

		JSONObject json = new JSONObject(input);

		logger.debug("String to Json ----->" + json.toString());
		assertEquals(json.getJSONObject("widget").getString("debug"), "on");
		assertEquals(json.getJSONObject("widget").getJSONObject("window").get("height"), 500);
		// assertEquals(json.getJSONObject("widget").getJSONObject("image").get("hOffset"),260);

	}

	@Test
	public void JsonToString() throws Exception {

		JSONObject json = new JSONObject();
		JSONObject widget = new JSONObject();
		JSONObject text = new JSONObject();
		JSONObject image = new JSONObject();
		JSONObject window = new JSONObject();

		json.put("widget", widget);

		text.put("alignment", "center");
		text.put("onMouseUp", "sun1.opacity = (sun1.opacity / 100) * 90;");
		text.put("hOffset", "250");
		text.put("style", "bold");
		text.put("name", "text1");
		text.put("data", "Click Here");
		text.put("vOffset", "100");
		text.put("size", 36);

		image.put("alignment", "center");
		image.put("hOffset", "250");
		image.put("name", "sun1");
		image.put("src", "Images/Sun.png");
		image.put("vOffset", "250");

		window.put("title", "Sample Konfabulator Widget");
		window.put("height", "500");
		window.put("width", "500");
		window.put("name", "main_window");

		widget.put("debug", "on");
		widget.put("text", text);
		widget.put("image", image);
		widget.put("window", window);

		logger.debug("Json to String ----->" + widget.toString());

		assertEquals(json.getJSONObject("widget").getString("debug"), "on");
		assertEquals(json.getJSONObject("widget").getJSONObject("window").get("height"), "500");
		// assertEquals(json.getJSONObject("widget").getJSONObject("image").get("hOffset"),
		// 260);

		assertFalse(json.getJSONObject("widget").getJSONObject("image").get("hOffset").equals("260"));
		
		assertTrue(json.getJSONObject("widget").getJSONObject("window").get("height").equals("501"));
		
		
		assertFalse(Integer.parseInt((String) json.getJSONObject("widget").getJSONObject("image").get("hOffset")) == 260);
	}

}
