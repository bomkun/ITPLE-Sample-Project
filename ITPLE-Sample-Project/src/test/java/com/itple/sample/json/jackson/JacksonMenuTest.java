package com.itple.sample.json.jackson;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;

import com.itple.sample.json.jackson.domain.MenuDto;
import com.itple.sample.json.jackson.domain.MenuDto.Menu;
import com.itple.sample.json.jackson.domain.MenuDto.Menu.Popup;
import com.itple.sample.json.jackson.domain.MenuDto.Menu.Popup.ItemList;

public class JacksonMenuTest {

	private static final Logger logger = Logger.getLogger(JacksonMenuTest.class.getName());

	@Test
	public void stringToJson() throws Exception {

		ObjectMapper mapper = new ObjectMapper();

		String input = "{\"menu\": {\"id\": \"file\",\"value\": \"File\",\"popup\": {\"menuitem\": [{\"value\": "
				+ "\"New\", \"onclick\": \"CreateNewDoc()\"},{\"value\": \"Open\", \"onclick\": "
				+ "\"OpenDoc()\"},{\"value\": \"Close\", \"onclick\": \"CloseDoc()\"}]}}}";

		MenuDto menuDto = mapper.readValue(input, MenuDto.class);

		String json = mapper.writeValueAsString(menuDto);

		logger.debug("String to Json ---->" + json.toString());

		assertEquals(menuDto.getMenu().getId(), "file");
		assertEquals(menuDto.getMenu().getValue(), "File");
		assertEquals(menuDto.getMenu().getPopup().getMenuitem().get(0).getValue(), "New");
		assertEquals(menuDto.getMenu().getPopup().getMenuitem().get(0).getOnclick(), "CreateNewDoc()");
	}

	@Test
	public void jsonToString() throws Exception {

		MenuDto menuDto = new MenuDto();
		Menu menu = new Menu();
		Popup popup = new Popup();

		List<ItemList> list = new ArrayList<ItemList>();

		ItemList itemListNew = new ItemList();
		ItemList itemListOpen = new ItemList();
		ItemList itemListClose = new ItemList();

		itemListNew.setValue("New");
		itemListNew.setOnclick("CreateNewDoc()");

		itemListOpen.setValue("Open");
		itemListOpen.setOnclick("OpenDoc()");

		itemListClose.setValue("Close");
		itemListClose.setOnclick("CloseDoc()");

		list.add(itemListNew);
		list.add(itemListOpen);
		list.add(itemListClose);

		popup.setMenuitem(list);

		menu.setId("file");
		menu.setValue("File");
		menu.setPopup(popup);

		menuDto.setMenu(menu);

		ObjectMapper mapper = new ObjectMapper();
		String json = mapper.writeValueAsString(menuDto);

		logger.debug("Json to String ---->" + json.toString());

		assertEquals(menuDto.getMenu().getId(), "file");
		assertEquals(menuDto.getMenu().getValue(), "File");
		assertEquals(menuDto.getMenu().getPopup().getMenuitem().get(0).getValue(), "New");
		assertEquals(menuDto.getMenu().getPopup().getMenuitem().get(0).getOnclick(), "CreateNewDoc()");

	}
}
