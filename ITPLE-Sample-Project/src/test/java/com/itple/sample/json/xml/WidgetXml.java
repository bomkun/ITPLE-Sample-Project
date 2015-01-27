package com.itple.sample.json.xml;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.OutputStreamWriter;
import java.io.Writer;

import org.apache.log4j.Logger;
import org.junit.Ignore;
import org.junit.Test;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;
import org.simpleframework.xml.stream.Format;

import com.itple.sample.json.jackson.domain.WidgetDto.Widget;
import com.itple.sample.json.jackson.domain.WidgetDto.Widget.Image;
import com.itple.sample.json.jackson.domain.WidgetDto.Widget.Text;
import com.itple.sample.json.jackson.domain.WidgetDto.Widget.Window;

public class WidgetXml {
	
	public static final String RESOURCE_PATH = "../ITPLE-Sample-Project/src/test/resources/xml";

	private static final Logger logger = Logger.getLogger(WidgetXml.class.getName());
	
	@Ignore
	@Test
	public void xmlToObject() throws Exception {
		
		Serializer serializer = new Persister();
		
		/*
		String input = "<widget><debug>on</debug>"
				+ "<window title=\"Sample Konfabulator Widget\">"
                +"<name>main_window</name>"
				+"<width>500</width>"
                +"<height>500</height>"
                +"</window>"
                +"<image src=\"Images/Sun.png\" name=\"sun1\">"
                +"<hOffset>250</hOffset>"
                +"<vOffset>250</vOffset>"
                +"<alignment>center</alignment>"
                +"</image>"
                +"<text data=\"Click Here\" size=\"36\" style=\"bold\">"
                +"<name>text1</name>"
                +"<hOffset>250</hOffset>"
                +"<vOffset>100</vOffset>"
                +"<alignment>center</alignment>"
                +"<onMouseUp>sun1.opacity = (sun1.opacity / 100) * 90;</onMouseUp>"
                +"</text>"
                +"</widget>";
		*/
		
		File source = new File("Widget.xml");
		
		Widget widgetDto =  serializer.read(Widget.class, source);
		
		logger.debug("Xml to Object ---->" + widgetDto.toString());
		
		assertEquals(widgetDto.getDebug(),"on");
		assertEquals(widgetDto.getWindow().getWidth(), 500);
		assertTrue(widgetDto.getText().getSize() == 36);
		assertFalse(widgetDto.getWindow().getWidth() == 400);
		assertFalse(widgetDto.getImage().gethOffset() == 300);
	}

	@Test
	public void objectToXml() throws Exception {
		
		Widget widgetDto = new Widget();
		Text text = new Text();
		Image image = new Image();
		Window window = new Window();
		
		widgetDto.setDebug("on");
		
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
		
		widgetDto.setText(text);
		widgetDto.setImage(image);
		widgetDto.setWindow(window);
		
		Serializer serializer = new Persister(new Format("<?xml version=\"1.0\" encoding= \"UTF-8\" ?>\n<!DOCTYPE widget SYSTEM \"../dtd/Widget.dtd\">"));
		
		Writer writer = new OutputStreamWriter(System.out);
		serializer.write(widgetDto, writer);

		File result = new File(RESOURCE_PATH +"/Widget.xml");
		serializer.write(widgetDto, result);		
		
		assertEquals(widgetDto.getDebug(),"on");
		assertEquals(widgetDto.getWindow().getWidth(), 500);
		assertTrue(widgetDto.getText().getSize() == 36);
		assertFalse(widgetDto.getWindow().getWidth() == 400);
		assertFalse(widgetDto.getImage().gethOffset() == 300);
	}

}
