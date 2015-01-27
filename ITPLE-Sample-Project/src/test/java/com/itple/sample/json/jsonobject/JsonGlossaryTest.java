package com.itple.sample.json.jsonobject;

import static org.junit.Assert.assertEquals;

import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.junit.Test;

public class JsonGlossaryTest {

	private static final Logger logger = Logger.getLogger(JsonGlossaryTest.class.getName());

	@Test(timeout = 5000)
	public void stringToJson() throws Exception {

		String input = "{\"glossary\":"
				+ "{\"title\":\"example glossary\",\"GlossDiv\":{\"title\":\"S\",\"GlossList\":"
				+ "{\"GlossEntry\":"
				+ "{\"ID\":\"SGML\",\"SortAs\":\"SGML\",\"GlossTerm\":\"Standard Generalized Markup Language\",\"Acronym\":\"SGML\",\"Abbrev\":\"ISO 8879:1986\",\"GlossDef\":"
				+ "{\"para\":\"A meta-markup language, used to create markup languages such as DocBook.\",\"GlossSeeAlso\":[\"GML\",\"XML\"]},\"GlossSee\":\"markup\"}}}}}";

		JSONObject json = new JSONObject(input);
		logger.debug("string to json : " + json.toString());

		try {
			Thread.sleep(1000);
		} catch (InterruptedException ex) {
			Thread.currentThread().interrupt();
		}

		assertEquals(json.getJSONObject("glossary").get("title"), "example glossary");
		assertEquals(json.getJSONObject("glossary").getJSONObject("GlossDiv").get("title"), "S");
		assertEquals(json.getJSONObject("glossary").getJSONObject("GlossDiv").get("title"), "S");

		logger.debug("브랜치 테스트");
		logger.debug("브랜치 테스트1");
		logger.debug("브랜치 테스트1234");
		logger.debug("테스트23454644");
		logger.debug("ffffa");
		logger.debug("testsss");
		logger.debug("test barnch rebase test");
	}

	@Test
	public void jsonToString() throws Exception {

		JSONObject glossary = new JSONObject();
		JSONObject glossDiv = new JSONObject();
		JSONObject glossList = new JSONObject();
		JSONObject glossEntry = new JSONObject();
		JSONObject glossDef = new JSONObject();

		JSONObject json = new JSONObject();

		String[] glossSeeAlso = { "GML", "XML" };

		glossDef.put("para", "A meta-markup language, used to create markup languages such as DocBook.");
		glossDef.put("GlossSeeAlso", glossSeeAlso);

		glossEntry.put("GlossDef", glossDef);
		glossEntry.put("SortAs", "SGML");
		glossEntry.put("GlossSee", "markup");
		glossEntry.put("GlossTerm", "Standard Generalized Markup Language");
		glossEntry.put("ID", "SGML");
		glossEntry.put("Acronym", "SGML");
		glossEntry.put("Abbrev", "ISO 8879:1986");

		glossList.put("GlossEntry", glossEntry);
		glossDiv.put("GlossList", glossList);
		glossDiv.put("title", "S");

		glossary.put("GlossDiv", glossDiv);
		glossary.put("title", "example glossary");

		json.put("glossary", glossary);
		logger.debug("json to string : " + glossary.toString());

		assertEquals(json.getJSONObject("glossary").get("title"), "example glossary");
		assertEquals(json.getJSONObject("glossary").getJSONObject("GlossDiv").get("title"), "S");
	}

}
