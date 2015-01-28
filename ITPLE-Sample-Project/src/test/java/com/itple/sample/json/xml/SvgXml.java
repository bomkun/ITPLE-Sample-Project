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
import org.junit.Ignore;
import org.junit.Test;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;
import org.simpleframework.xml.stream.Format;

import com.itple.sample.json.jackson.domain.SvgDto.Menu;
import com.itple.sample.json.jackson.domain.SvgDto.Menu.ItemList;


public class SvgXml {

	public static final String RESOURCE_PATH = "../ITPLE-Sample-Project/src/test/resources/xml";
	
	private static final Logger logger = Logger.getLogger(SvgXml.class.getName());
	
	@Test
	public void xmlToObject() throws Exception {
		
		Serializer serializer = new Persister();
		
		/*
		String input = "<menu><header>Adobe SVG Viewer</header>"
				+ "<item action=\"Open\" id=\"Open\">Open</item>"
				+"<item action=\"OpenNew\" id=\"OpenNew\">Open New</item>"
			
				+"<item action=\"ZoomIn\" id=\"ZoomIn\">Zoom In</item>"
				+"<item action=\"ZoomOut\" id=\"ZoomOut\">Zoom Out</item>"
			    +"<item action=\"OriginalView\" id=\"OriginalView\">Original View</item>"
			
				+"<item action=\"Quality\" id=\"Quality\">Quality</item>"
				+"<item action=\"Pause\" id=\"Pause\">Pause</item>"
				+"<item action=\"Mute\" id=\"Mute\">Mute</item>"
			
				+"<item action=\"Find\" id=\"Find\">Find...</item>"
				+"<item action=\"FindAgain\" id=\"FindAgain\">Find Again</item>"
				+"<item action=\"Copy\" id=\"Copy\">Copy</item>"
				+"<item action=\"CopyAgain\" id=\"CopyAgain\">Copy Again</item>"
				+"<item action=\"CopySVG\" id=\"CopySVG\">Copy SVG</item>"
				+"<item action=\"ViewSVG\" id=\"ViewSVG\">View SVG</item>"
				+"<item action=\"ViewSource\" id=\"ViewSource\">View Source</item>"
				+"<item action=\"SaveAs\" id=\"SaveAs\">Save As</item>"
				
				+"<item action=\"Help\" id=\"Help\">Help</item>"
				+"<item action=\"About\" id=\"About\">About Adobe CVG Viewer...</item>"
				+"</menu>";
		*/
		
		File source = new File("Svg.xml");
		
		Menu svgDto =  serializer.read(Menu.class, source);
		
		logger.debug("Xml to Object ---->" + svgDto.toString());
		
		assertEquals(svgDto.getHeader(),"Adobe SVG Viewer");
		assertEquals(svgDto.getItems().get(0).getId(), "Open");
		assertEquals(svgDto.getItems().get(7).getLabel(), "Mute");
		assertEquals(svgDto.getItems().get(3).getId(), "ZoomOut");
		assertTrue(svgDto.getItems().get(5).getId().equals("Quality"));
		assertFalse(svgDto.getItems().get(11).getLabel().equals("Help"));
	}
	
	@Test
	public void ObjectToXml() throws Exception {
		
		Menu svgDto = new Menu();
		
		List<ItemList> itemList = new ArrayList<ItemList>();
		
		ItemList itemListOpen = new ItemList();
		ItemList itemListOpenNew = new ItemList();
		ItemList itemListZoomIn = new ItemList();
		ItemList itemListZoomOut = new ItemList();
		ItemList itemListOriginalView = new ItemList();
		ItemList itemListQuality = new ItemList();
		ItemList itemListPause = new ItemList();
		ItemList itemListMute = new ItemList();
		ItemList itemListFind = new ItemList();
		ItemList itemListFindAgain = new ItemList();
		ItemList itemListCopy = new ItemList();
		ItemList itemListCopyAgain = new ItemList();
		ItemList itemListCopySVG = new ItemList();
		ItemList itemListViewSVG = new ItemList();
		ItemList itemListViewSource = new ItemList();
		ItemList itemListSaveAs = new ItemList();
		ItemList itemListHelp = new ItemList();
		ItemList itemListAbout = new ItemList();
		
		itemListOpen.setLabel("Open");
		itemListOpen.setId("Open");
		itemListOpen.setlabelText("Open");
		
		itemListOpenNew.setId("OpenNew");
		itemListOpenNew.setLabel("OpenNew");
		itemListOpenNew.setlabelText("Open New");
		
		itemListZoomIn.setId("ZoomIn");
		itemListZoomIn.setLabel("ZoomIn");
		itemListZoomIn.setlabelText("Zoom In");
		
		itemListZoomOut.setId("ZoomOut");
		itemListZoomOut.setLabel("ZoomOut");
		itemListZoomOut.setlabelText("Zoom Out");
		
		itemListOriginalView.setId("OriginalView");
		itemListOriginalView.setLabel("OriginalView");
		itemListOriginalView.setlabelText("Original View");
		
		itemListQuality.setId("Quality");
		itemListQuality.setLabel("Quality");
		itemListQuality.setlabelText("Quality");
		
		itemListPause.setId("Pause");
		itemListPause.setLabel("Pause");
		itemListPause.setlabelText("Pause");
		
		itemListMute.setId("Mute");
		itemListMute.setLabel("Mute");
		itemListMute.setlabelText("Mute");
		
		itemListFind.setId("Find");
		itemListFind.setLabel("Find");
		itemListFind.setlabelText("Find...");
		
		itemListFindAgain.setId("FindAgain");
		itemListFindAgain.setLabel("FindAgain");
		itemListFindAgain.setlabelText("Find Again");
		
		itemListCopy.setId("Copy");
		itemListCopy.setLabel("Copy");
		itemListCopy.setlabelText("Copy");
		
		itemListCopyAgain.setId("CopyAgain");
		itemListCopyAgain.setLabel("CopyAgain");
		itemListCopyAgain.setlabelText("Copy Again");
		
		itemListCopySVG.setId("CopySVG");
		itemListCopySVG.setLabel("CopySVG");
		itemListCopySVG.setlabelText("Copy SVG");
		
		itemListViewSVG.setId("ViewSVG");
		itemListViewSVG.setLabel("ViewSVG");
		itemListViewSVG.setlabelText("View SVG");
		
		itemListViewSource.setId("ViewSource");
		itemListViewSource.setLabel("ViewSource");
		itemListViewSource.setlabelText("View Source");
		
		itemListSaveAs.setId("SaveAs");
		itemListSaveAs.setLabel("SaveAs");
		itemListSaveAs.setlabelText("Save As");
		
		itemListHelp.setId("Help");
		itemListHelp.setLabel("Help");
		itemListHelp.setlabelText("Help");
		
		itemListAbout.setId("About");
		itemListAbout.setLabel("About");
		itemListAbout.setlabelText("About Adobe CVG Viewer...");
		
		itemList.add(itemListOpen);
		itemList.add(itemListOpenNew);
		itemList.add(itemListZoomIn);
		itemList.add(itemListZoomOut);
		itemList.add(itemListOriginalView);
		itemList.add(itemListQuality);
		itemList.add(itemListPause);
		itemList.add(itemListMute);
		itemList.add(itemListFind);
		itemList.add(itemListFindAgain);
		itemList.add(itemListCopy);
		itemList.add(itemListCopyAgain);
		itemList.add(itemListCopySVG);
		itemList.add(itemListViewSVG);
		itemList.add(itemListViewSource);
		itemList.add(itemListSaveAs);
		itemList.add(itemListHelp);
		itemList.add(itemListAbout);
		
		svgDto.setItems(itemList);
		
		svgDto.setHeader("Adobe SVG Viewer");
		
		Serializer serializer = new Persister(new Format("<?xml version=\"1.0\" encoding= \"UTF-8\" ?>\n<!DOCTYPE menu SYSTEM \"../dtd/Svg.dtd\">"));
		
		Writer writer = new OutputStreamWriter(System.out);
		serializer.write(svgDto, writer);
		
		File result = new File(RESOURCE_PATH +"/Svg.xml");
		serializer.write(svgDto, result);	
		
		assertEquals(svgDto.getHeader(),"Adobe SVG Viewer");
		assertEquals(svgDto.getItems().get(0).getId(), "Open");
		assertEquals(svgDto.getItems().get(7).getLabel(), "Mute");
		assertEquals(svgDto.getItems().get(3).getId(), "ZoomOut");
		assertTrue(svgDto.getItems().get(5).getId().equals("Quality"));
		assertFalse(svgDto.getItems().get(11).getLabel().equals("Help"));
	}
}
