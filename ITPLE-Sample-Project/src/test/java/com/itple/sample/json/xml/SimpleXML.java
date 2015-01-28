package com.itple.sample.json.xml;

import java.io.OutputStreamWriter;
import java.io.Writer;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;
import org.simpleframework.xml.stream.Format;

import com.itple.sample.json.xml.domain.SimpleTest;
import com.itple.sample.json.xml.domain.SimpleTest.TestClass;
import com.itple.sample.json.xml.domain.SimpleTest.TestClass.Example;

public class SimpleXML {

	@Test
	public void simpleTest() throws Exception {
		
		Serializer serializer = new Persister();
		
		String input = "<example index=\"123\">"
				+ "<text>Example message</text>"
				+ "</example>";
		
		Example example = serializer.read(Example.class, input);
		
		System.out.println(example.toString());
		
		ObjectMapper mapper = new ObjectMapper();

		String json = mapper.writeValueAsString(example);

		System.out.println("xml to Json ---->" + json);

	}
	
	@Test
	public void XmlWrite() throws Exception {
	
		
		TestClass testClass = new TestClass();
		Example example = new Example();
		SimpleTest simple = new SimpleTest();
		
		example.setIndex(1234567);
		example.setText("exmflaleif aofeaofelfefoe");
	
		testClass.setExample(example);
		
		simple.setTestClass(testClass);
		
		Serializer serializer = new Persister(new Format("<?xml version=\"1.0\" encoding= \"UTF-8\" ?>\n"
				+ "<!DOCTYPE glossary SYSTEM \"glossary.dtd\">"));
		
		Writer writer = new OutputStreamWriter(System.out);
		serializer.write(simple, writer);
	}
	
}
