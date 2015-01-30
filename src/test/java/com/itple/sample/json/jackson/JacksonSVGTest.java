package com.itple.sample.json.jackson;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;

import com.itple.sample.json.jackson.domain.SvgDto;
import com.itple.sample.json.jackson.domain.SvgDto.Menu;
import com.itple.sample.json.jackson.domain.SvgDto.Menu.ItemList;

public class JacksonSVGTest {

	private static final Logger logger = Logger.getLogger(JacksonSVGTest.class.getName());

	@Test
	public void stringToJson() throws Exception {

		ObjectMapper mapper = new ObjectMapper();

		String input = "{\"menu\": {\"header\": \"SVG Viewer\",\"items\": [{\"id\": \"Open\"},{\"id\": \"OpenNew\", \"label\": \"Open New\"},null,{\"id\": \"ZoomIn\", \"label\": \"Zoom In\"},{\"id\": \"ZoomOut\", \"label\": \"Zoom Out\"},{\"id\": \"OriginalView\", \"label\": \"Original View\"},null,{\"id\": \"Quality\"},{\"id\": \"Pause\"},{\"id\": \"Mute\"},null,{\"id\": \"Find\", \"label\": \"Find...\"},{\"id\": \"FindAgain\", \"label\": \"Find Again\"},{\"id\": \"Copy\"},{\"id\": \"CopyAgain\", \"label\": \"Copy Again\"},{\"id\": \"CopySVG\", \"label\": \"Copy SVG\"},{\"id\": \"ViewSVG\", \"label\": \"View SVG\"},{\"id\": \"ViewSource\", \"label\": \"View Source\"},{\"id\": \"SaveAs\", \"label\": \"Save As\"},null,{\"id\": \"Help\"},{\"id\": \"About\", \"label\": \"About Adobe CVG Viewer...\"}] } }";

		SvgDto svgDto = mapper.readValue(input, SvgDto.class);

		String json = mapper.writeValueAsString(svgDto);

		logger.debug("String To Json ----> " + json.toString());
	
		assertEquals(svgDto.getMenu().getHeader(),"SVG Viewer");
		assertEquals(svgDto.getMenu().getItems().get(3).getId(), "ZoomIn");
		assertTrue(svgDto.getMenu().getItems().get(5).getId().equals("OriginalView"));
		assertFalse(svgDto.getMenu().getItems().get(11).getLabel().equals("Help"));
		assertNull(svgDto.getMenu().getItems().get(10));
	
	}
	
	
	@Test
	public void jsonToString() throws Exception {
		
		SvgDto svgDto = new SvgDto();
		Menu menu = new Menu();
		
		List<ItemList> list = new ArrayList<ItemList>();
		
		ItemList itemListOpen = new ItemList();
		ItemList itemListOpenNew = new ItemList();
		ItemList itemNull =null;
		ItemList itemListZoomIn = new ItemList();
		ItemList itemListZoomOut = new ItemList();
		ItemList itemListOriginalView = new ItemList();
		ItemList itemNullTwo = null;
		ItemList itemListQuality = new ItemList();
		ItemList itemListPasuse = new ItemList();
		ItemList itemListMute = new ItemList();
		ItemList itemNullThree = null;
		ItemList itemListFind = new ItemList();
		ItemList itemListFindAgain = new ItemList();
		ItemList itemListCopy = new ItemList();
		ItemList itemListCopyAgain = new ItemList();
		ItemList itemListCopySVG = new ItemList();
		ItemList itemListViewSVG = new ItemList();
		ItemList itemListViewSource = new ItemList();
		ItemList itemListSaveAs = new ItemList();
		ItemList itemNullFour = null;
		
		ItemList itemListHelp = new ItemList();
		ItemList itemListAbout = new ItemList();
		
		itemListOpen.setId("Open");
		
		itemListOpenNew.setId("OpenNew");
		itemListOpenNew.setLabel("Open New");
		
		itemListZoomIn.setId("ZoomIn");
		itemListZoomIn.setLabel("Zoom In");
		
		itemListZoomOut.setId("ZoomOut");
		itemListZoomOut.setLabel("Zoom Out");
		
		itemListOriginalView.setId("OriginalView");
		itemListOriginalView.setLabel("Original View");
		
		itemListQuality.setId("Quality");
		itemListPasuse.setId("Pause");
		itemListMute.setId("Mute");
		
		itemListFind.setId("Find");
		itemListFind.setLabel("Find...");
	
		itemListFindAgain.setId("FindAgain");
		itemListFindAgain.setLabel("Find Again");
		
		itemListCopy.setId("Copy");
		itemListCopyAgain.setId("CopyAgain");
		itemListCopyAgain.setLabel("Copy Again");
		
		itemListCopySVG.setId("CopySVG");
		itemListCopySVG.setLabel("Copy SVG");
		
		itemListViewSVG.setId("ViewSVG");
		itemListViewSVG.setLabel("View SVG");
		
		itemListViewSource.setId("ViewSource");
		itemListViewSource.setLabel("View Source");
		
		itemListSaveAs.setId("SaveAs");
		itemListSaveAs.setLabel("Save As");
		
		itemListHelp.setId("Help");
		
		itemListAbout.setId("About");
		itemListAbout.setLabel("About Adobe CVG Viewer...");
		
		list.add(itemListOpen);
		list.add(itemListOpenNew);
		list.add(itemNull);
		list.add(itemListZoomIn);
		list.add(itemListZoomOut);
		list.add(itemListOriginalView);
		list.add(itemNullTwo);
		list.add(itemListQuality);
		list.add(itemListPasuse);
		list.add(itemListMute);
		list.add(itemNullThree);
		list.add(itemListFind);
		list.add(itemListFindAgain);
		list.add(itemListCopy);
		list.add(itemListCopyAgain);
		list.add(itemListCopySVG);
		list.add(itemListViewSVG);
		list.add(itemListViewSource);
		list.add(itemListSaveAs);
		list.add(itemNullFour);
		list.add(itemListHelp);
		list.add(itemListAbout);
		
		menu.setHeader("SVG Viewer");
		menu.setItems(list);
		
		svgDto.setMenu(menu);
		
		
		ObjectMapper mapper = new ObjectMapper();
		String json = mapper.writeValueAsString(svgDto);
		
		logger.debug("Json To String ----> " + json.toString());
		
		
		assertEquals(svgDto.getMenu().getHeader(),"SVG Viewer");
		assertEquals(svgDto.getMenu().getItems().get(3).getId(), "ZoomIn");
		assertTrue(svgDto.getMenu().getItems().get(5).getId().equals("OriginalView"));
		assertFalse(svgDto.getMenu().getItems().get(11).getLabel().equals("Help"));
		assertNull(svgDto.getMenu().getItems().get(10));
		
	}
}
