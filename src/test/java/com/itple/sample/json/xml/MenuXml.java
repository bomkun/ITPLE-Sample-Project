package com.itple.sample.json.xml;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;
import org.simpleframework.xml.stream.Format;

import com.itple.sample.json.jackson.domain.MenuDto;
import com.itple.sample.json.jackson.domain.MenuDto.Menu;
import com.itple.sample.json.jackson.domain.MenuDto.Menu.Popup;
import com.itple.sample.json.jackson.domain.MenuDto.Menu.Popup.ItemList;

public class MenuXml {

	public static final String RESOURCE_PATH = "../ITPLE-Sample-Project/src/test/resources/xml";
	
	private static final Logger logger = Logger.getLogger(MenuXml.class.getName());

	@Test
	public void xmlToObject() throws Exception {

		Serializer serializer = new Persister();

		File source = new File(RESOURCE_PATH + "/Menu.xml");
		
		Menu menuDto = serializer.read(MenuDto.Menu.class, source);

		logger.debug("Xml to Object ----->" + menuDto.toString());

		assertEquals(menuDto.getPopup().getMenuitem().get(0).getValue(),"New");
		assertEquals(menuDto.getPopup().getMenuitem().get(2).getOnclick(),"CloseDoc()"	);
		assertFalse(menuDto.getPopup().getMenuitem().get(0).getValue().equals("aafaf"));
		assertTrue(menuDto.getPopup().getMenuitem().get(1).getValue().equals("Open"));;
		
	}
	
	@Test
	public void objectToXml() throws Exception {

		Menu menuDto = new Menu();
		Popup popup = new Popup();
		
		List<ItemList> menuitemList = new ArrayList<ItemList>();
		
		ItemList itemNew = new ItemList();
		ItemList itemOpen = new ItemList();
		ItemList itemClose = new ItemList();
		
		itemNew.setValue("New");
		itemNew.setOnclick("CreateNewDoc()");

		itemOpen.setValue("Open");
		itemOpen.setOnclick("OpenDoc()");
		
		itemClose.setValue("Close");
		itemClose.setOnclick("CloseDoc()");

		menuitemList.add(itemNew);
		menuitemList.add(itemOpen);
		menuitemList.add(itemClose);
		
		popup.setMenuitem(menuitemList);
		
		menuDto.setId("file");
		menuDto.setValue("File");
		
		menuDto.setPopup(popup);
	
		Serializer serializer = new Persister(new Format("<?xml version=\"1.0\" encoding= \"UTF-8\" ?>\n<!DOCTYPE menu SYSTEM \"../dtd/Menu.dtd\">"));
		Writer writer = new OutputStreamWriter(System.out);
		serializer.write(menuDto, writer);
		
		File result = new File(RESOURCE_PATH +"/Menu.xml");
		serializer.write(menuDto, result);		
		
		assertEquals(menuDto.getPopup().getMenuitem().get(0).getValue(),"New");
		assertEquals(menuDto.getPopup().getMenuitem().get(2).getOnclick(),"CloseDoc()"	);
		assertFalse(menuDto.getPopup().getMenuitem().get(0).getValue().equals("aafaf"));
		assertTrue(menuDto.getPopup().getMenuitem().get(1).getValue().equals("Open"));;
		
	}
}
