package com.itple.sample.json.jackson;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;

import com.itple.sample.json.jackson.domain.GlossaryDto;
import com.itple.sample.json.jackson.domain.GlossaryDto.Glossary;
import com.itple.sample.json.jackson.domain.GlossaryDto.Glossary.GlossDiv;
import com.itple.sample.json.jackson.domain.GlossaryDto.Glossary.GlossDiv.GlossList;
import com.itple.sample.json.jackson.domain.GlossaryDto.Glossary.GlossDiv.GlossList.GlossEntry;
import com.itple.sample.json.jackson.domain.GlossaryDto.Glossary.GlossDiv.GlossList.GlossEntry.GlossDef;


public class JacksonGlossaryTest {

	private static final Logger logger = Logger.getLogger(JacksonGlossaryTest.class.getName());

	@Test
	public void stringtoJson() throws Exception {

		ObjectMapper mapper = new ObjectMapper();

		String input = "{\"glossary\":"
				+ "{\"title\":\"example glossary\",\"GlossDiv\":{\"title\":\"S\",\"GlossList\":"
				+ "{\"GlossEntry\":"
				+ "{\"ID\":\"SGML\",\"SortAs\":\"SGML\",\"GlossTerm\":\"Standard Generalized Markup Language\",\"Acronym\":\"SGML\",\"Abbrev\":\"ISO 8879:1986\",\"GlossDef\":"
				+ "{\"para\":\"A meta-markup language, used to create markup languages such as DocBook.\",\"GlossSeeAlso\":[\"GML\",\"XML\"]},\"GlossSee\":\"markup\"}}}}}";

		GlossaryDto glossaryDto = mapper.readValue(input, GlossaryDto.class);

		String json = mapper.writeValueAsString(glossaryDto);

		logger.debug("String to Json ---->" + json);
		
		assertEquals(glossaryDto.getGlossary().getGlossDiv().getTitle(), "S");
		assertEquals(glossaryDto.getGlossary().getGlossDiv().getGlossList().getGlossEntry().getGlossTerm(), "Standard Generalized Markup Language");
		assertFalse(glossaryDto.getGlossary().getGlossDiv().getGlossList().getGlossEntry().getId().equals("SGMX"));
		assertTrue(glossaryDto.getGlossary().getTitle().equals("example glossary"));
		assertNotNull(glossaryDto.getGlossary().getGlossDiv().getGlossList().getGlossEntry().getAbbrev());

	}

	@Test
	public void jsonToString() throws Exception {

		Glossary glossary = new Glossary();
		GlossDiv glossDiv = new GlossDiv();
		GlossDef glossDef = new GlossDef();
		GlossEntry glossEntry = new GlossEntry();
		GlossList glossList = new GlossList();
		GlossaryDto glossaryDto = new GlossaryDto();

		String[] glossSeeAlso = { "GML", "XML" };

		glossDef.setPara("A meta-markup language, used to create markup languages such as DocBook.");
		glossDef.setGlossSeeAlso(glossSeeAlso);

		glossEntry.setId("SGML");
		glossEntry.setGlossTerm("Standard Generalized Markup Language");
		glossEntry.setAcronym("SGML");
		glossEntry.setAbbrev("ISO 8879:1986");
		glossEntry.setGlossSee("markup");
		glossEntry.setSortAs("SGML");
		glossEntry.setGlossDef(glossDef);

		glossList.setGlossEntry(glossEntry);

		glossDiv.setTitle("S");
		glossDiv.setGlossList(glossList);

		glossary.setTitle("example glossary");
		glossary.setGlossDiv(glossDiv);

		glossaryDto.setGlossary(glossary);

		ObjectMapper mapper = new ObjectMapper();
		String json = mapper.writeValueAsString(glossaryDto);
	

		logger.debug("Json To String ---->" + json.toString());

		assertEquals(glossary.getGlossDiv().getTitle(), "S");
		assertEquals(glossEntry.getId(), "SGML");
		assertEquals(glossary.getGlossDiv().getGlossList().getGlossEntry().getId(), "SGML");
		assertEquals(glossary.getGlossDiv().getGlossList().getGlossEntry().getGlossDef().getPara(),"A meta-markup language, used to create markup languages such as DocBook.");
		assertFalse(glossary.getGlossDiv().getTitle().equals("SSS"));
		assertNotNull(glossary.getGlossDiv().getTitle());

	}

}
