package com.itple.sample.json.xml;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
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

import com.itple.sample.json.xml.domain.GlossaryXmlDto;
import com.itple.sample.json.xml.domain.GlossaryXmlDto.GlossDiv;
import com.itple.sample.json.xml.domain.GlossaryXmlDto.GlossDiv.GlossList;
import com.itple.sample.json.xml.domain.GlossaryXmlDto.GlossDiv.GlossList.GlossEntry;
import com.itple.sample.json.xml.domain.GlossaryXmlDto.GlossDiv.GlossList.GlossEntry.GlossDef;
import com.itple.sample.json.xml.domain.GlossaryXmlDto.GlossDiv.GlossList.GlossEntry.GlossDef.GlossSeeAlso;
import com.itple.sample.json.xml.domain.GlossaryXmlDto.GlossDiv.GlossList.GlossEntry.GlossSee;


public class GlossaryXml {

	public static final String RESOURCE_PATH = "../ITPLE-Sample-Project/src/test/resources/xml";
	
	private static final Logger logger = Logger.getLogger(GlossaryXml.class.getName());
	
	@Ignore
	@Test
	public void xmlToObject() throws Exception {

		Serializer serializer = new Persister();
	
		/*
		String input ="<glossary><title>example glossary</title>"
				+ "<GlossDiv><title>S</title>" + "<GlossList>"
				+ "<GlossEntry ID=\"SGML\" SortAs=\"SGML\">" + "<GlossTerm>Standard Generalized Markup Language</GlossTerm>" + "<Acronym>SGML</Acronym>"
				+ "<Abbrev>ISO 8879:1986</Abbrev>" + "<GlossDef>" + "<para>A meta-markup language, used to create markup languages such as DocBook.</para>"
				+ "<GlossSeeAlso OtherTerm=\"GML\"/>"
				+ "<GlossSeeAlso OtherTerm=\"XML\"/>"
				+ "</GlossDef>"
				+ "<GlossSee OtherTerm=\"markup\"/>"
				+ "</GlossEntry>" 
				+ "</GlossList>" 
				+ "</GlossDiv>" 
				+ "</glossary>";
		 */
		
		File source = new File("Glossary.xml");
		
		GlossaryXmlDto glossaryDto = serializer.read(GlossaryXmlDto.class, source);
	
		logger.debug("Xml to Object------->" + glossaryDto.toString());
		
		assertEquals(glossaryDto.getGlossDiv().getTitle(), "S");
		assertEquals(glossaryDto.getGlossDiv().getGlossList().getGlossEntry().getGlossTerm(), "Standard Generalized Markup Language");
		assertFalse(glossaryDto.getGlossDiv().getGlossList().getGlossEntry().getId().equals("SGMX"));
		assertTrue(glossaryDto.getTitle().equals("example glossary"));
		assertNotNull(glossaryDto.getGlossDiv().getGlossList().getGlossEntry().getAbbrev());
	}
	
	
	@Test
	public void objectToXml() throws Exception {
		
		GlossDiv glossDiv = new GlossDiv();
		GlossDef glossDef = new GlossDef();
		GlossEntry glossEntry = new GlossEntry();
		GlossList glossList = new GlossList();
		GlossaryXmlDto glossaryDto = new GlossaryXmlDto();	

		List<GlossSeeAlso> glossSeeAlsoList = new ArrayList<GlossSeeAlso>();
		
		GlossSeeAlso OtherTermGML = new GlossSeeAlso();
		GlossSeeAlso OtherTermXML = new GlossSeeAlso();
	
		OtherTermGML.setOtherTerm("GML");
		OtherTermXML.setOtherTerm("XML");

		glossSeeAlsoList.add(OtherTermGML);
		glossSeeAlsoList.add(OtherTermXML);
		
		glossDef.setPara("A meta-markup language, used to create markup languages such as DocBook.");
		glossDef.setGlossSeeAlso(glossSeeAlsoList);
		
		List<GlossSee> glossSeeList = new ArrayList<GlossSee>();
		GlossSee OtherTerm = new GlossSee();
		
		OtherTerm.setOtherTerm("markup");
		
		glossSeeList.add(OtherTerm);
		
		glossEntry.setId("SGML");
		glossEntry.setSortAs("SGML");
		glossEntry.setGlossTerm("Standard Generalized Markup Language");
		glossEntry.setAcronym("SGML");
		glossEntry.setAbbrev("ISO 8879:1986");
		glossEntry.setGlossSee(glossSeeList);
		glossEntry.setGlossDef(glossDef);
		
		glossList.setGlossEntry(glossEntry);
	
		glossDiv.setTitle("S");
		glossDiv.setGlossList(glossList);
		
		glossaryDto.setTitle("example glossary");
		glossaryDto.setGlossDiv(glossDiv);
		
		Serializer serializer = new Persister(new Format("<?xml version=\"1.0\" encoding= \"UTF-8\" ?>\n<!DOCTYPE glossary SYSTEM \"../dtd/Glossary.dtd\">"));
		
		Writer writer = new OutputStreamWriter(System.out);
		serializer.write(glossaryDto, writer);
		
		File result = new File(RESOURCE_PATH +"/Glossary.xml");
		serializer.write(glossaryDto, result);		
		
		assertEquals(glossaryDto.getGlossDiv().getTitle(), "S");
		assertEquals(glossaryDto.getGlossDiv().getGlossList().getGlossEntry().getGlossTerm(), "Standard Generalized Markup Language");
		assertFalse(glossaryDto.getGlossDiv().getGlossList().getGlossEntry().getId().equals("SGMX"));
		assertTrue(glossaryDto.getTitle().equals("example glossary"));
		assertNotNull(glossaryDto.getGlossDiv().getGlossList().getGlossEntry().getAbbrev());
		
	}
	
}
