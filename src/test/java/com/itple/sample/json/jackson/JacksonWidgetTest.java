package com.itple.sample.json.jackson;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;

import com.itple.sample.json.jackson.domain.WidgetDto;
import com.itple.sample.json.jackson.domain.WidgetDto.Widget;
import com.itple.sample.json.jackson.domain.WidgetDto.Widget.Image;
import com.itple.sample.json.jackson.domain.WidgetDto.Widget.Text;
import com.itple.sample.json.jackson.domain.WidgetDto.Widget.Window;


public class JacksonWidgetTest {

	private static final Logger logger = Logger.getLogger(JacksonWidgetTest.class.getName());

	@Test
	public void stringToJson() throws Exception {

		ObjectMapper mapper = new ObjectMapper();

		String input = "{\"widget\": {\"debug\": \"on\",\"window\": {\"title\": \"Sample Konfabulator Widget\",\"name\": \"main_window\",\"width\": 500,\"height\": 500}"
				+ ",\"image\": { \"src\": \"Images/Sun.png\",\"name\": \"sun1\",\"hOffset\": 250,\"vOffset\": 250,\"alignment\": \"center\"},"
				+ "\"text\": {\"data\": \"Click Here\",\"size\": 36,\"style\": \"bold\",\"name\": \"text1\",\"hOffset\": 250,\"vOffset\": 100,\"alignment\": \"center\","
				+ "\"onMouseUp\": \"sun1.opacity = (sun1.opacity / 100) * 90;\"}}}";

		WidgetDto widgetDto = mapper.readValue(input, WidgetDto.class);

		String json = mapper.writeValueAsString(widgetDto);

		logger.debug("String To Json ----> " + json.toString());

		assertEquals(widgetDto.getWidget().getDebug(), "on");
		assertTrue(widgetDto.getWidget().getText().getSize() == 36);
		assertFalse(widgetDto.getWidget().getWindow().getWidth() == 400);
		assertFalse(widgetDto.getWidget().getImage().gethOffset() == 300);

	}

	@Test
	public void jsonToString() throws Exception {

		Text text = new Text();
		Image image = new Image();
		Window window = new Window();
		Widget widget = new Widget();
		WidgetDto widgetDto = new WidgetDto();

		text.setData("Click Here");
		text.setSize(36);
		text.setStyle("bold");
		text.setName("text1");
		text.sethOffset(250);
		text.setvOffset(100);
		text.setAlignment("center");
		text.setOnMouseUp("sun1.opacity = (sun1.opacity / 100) * 90;");

		image.setSrc("Images/Sun.png");
		image.setName("sun1");
		image.sethOffset(250);
		image.setvOffset(250);
		image.setAlignment("center");

		window.setTitle("Sample Konfabulator Widget");
		window.setName("main_window");
		window.setWidth(500);
		window.setHeight(500);

		widget.setDebug("on");
		widget.setText(text);
		widget.setImage(image);
		widget.setWindow(window);

		widgetDto.setWidget(widget);

		ObjectMapper mapper = new ObjectMapper();
		String json = mapper.writeValueAsString(widgetDto);

		logger.debug("Json To String ---->" + json.toString());

		assertEquals(widgetDto.getWidget().getDebug(), "on");
		assertEquals(widgetDto.getWidget().getImage().getName(), "sun1");
		assertTrue(widgetDto.getWidget().getText().getSize() == 36);
		assertFalse(widgetDto.getWidget().getWindow().getWidth() == 400);
		assertFalse(widgetDto.getWidget().getImage().gethOffset() == 300);

	}

}
