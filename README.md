# ITPLE-Sample-Project

String 혹은 파일로 데이터를 입력받아 그 데이터를 라이브러리를 이용하여 JSON 또는 XML로 Parsing한 결과값을 출력, 객체를 JSON , XML로 생성하여 결과값을 출력하는 프로그램. 총 3가지 방식으로 구현되며 그 방식은 다음과 같다

# Table of Contents (Link)

- [JSONObject](#JSONobject)

- [Jackson](#Jackson)

- [XML](#XML)


## JSONobject

org.json 라이브러리를 이용하여 String 입력값을 JSON으로 Parsing,
Object를 생성하여 json으로 Parsing한 결과값을 출력한다

### Maven

	<dependency>
		<groupId>org.json</groupId>
		<artifactId>json</artifactId>
		<version>20140107</version>
	</dependency>

### Non-Maven


	
 > 라이브러리를 직접 다운 받음
 
 > Download URL : [org.json](http://mvnrepository.com/artifact/org.json/json/20140107)

 > Version : 20140107
	

###Usage

String 변수를 입력 받아 json으로 parsing, Object를 생성하여 json으로 Parsing


#### 1. String to Json (JsonGlossaryTest.java)
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
	}


JSONobject json을 input값을 입력값으로 넣어 parsing

`JSONObject json = new JSONObject(input);`

parsing한 값을 출력

`logger.debug("string to json : " + json.toString());`


#### 2. Json to String (JsonGlossaryTest.java)

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


JSONObject를 생성

		JSONObject glossary = new JSONObject();
		JSONObject glossDiv = new JSONObject();
		JSONObject glossList = new JSONObject();
		JSONObject glossEntry = new JSONObject();
		JSONObject glossDef = new JSONObject();
		JSONObject json = new JSONObject();

glossary 키 , 밸류 설정 

		glossList.put("GlossEntry", glossEntry);
		glossDiv.put("GlossList", glossList);
		glossDiv.put("title", "S");

결과값을 출력

		json.put("glossary", glossary);
		logger.debug("json to string : " + glossary.toString());

#### Result

	{"glossary":{"title":"example glossary","GlossDiv":{"GlossList":{"GlossEntry":{"SortAs":"SGML","GlossDef":{"GlossSeeAlso":["GML","XML"],"para":"A meta-markup language, used to create markup languages such as DocBook."},"GlossSee":"markup","GlossTerm":"Standard Generalized Markup Language","ID":"SGML","Acronym":"SGML","Abbrev":"ISO 8879:1986"}},"title":"S"}}} 


## Jackson

Jackson Library를 이용하여 String을 json으로 parsing, 객체를 생성하여 그 객체를 json으로 parsing하여 결과값을 출력한다.

### Maven

	<jackson.version>1.9.13</jackson.version>
	</properties>

	<dependency>
		<groupId>org.codehaus.jackson</groupId>
		<artifactId>jackson-core-asl</artifactId>
		<version>${jackson.version}</version>
		</dependency>
	<dependency>
		<groupId>org.codehaus.jackson</groupId>
		<artifactId>jackson-mapper-asl</artifactId>
		<version>${jackson.version}</version>
	</dependency>


### Non-Maven


 > 라이브러리를 직접 다운 받음
 
 > jackson-core   : [jackson-core](http://mvnrepository.com/artifact/org.codehaus.jackson/jackson-core-asl/1.9.13)
  
 > jackson-mapper : [jackson-mapper](http://mvnrepository.com/artifact/org.codehaus.jackson/jackson-mapper-asl/1.9.13) 

 > Version : 1.9.13


###Usage

readValue, writeValueAsString 메소드를 이용하여 String 입력값을 JSON으로 Parsing, 객체를 생성하여 그 객체를 JSON 형식으로 바꿔 결과값을 출력한다


#### Domain (GlossaryDto.java)

	public class GlossaryDto {

		public GlossaryDto() {

		}

		private Glossary glossary;

		public Glossary getGlossary() {
			return glossary;
		}

		public void setGlossary(Glossary glossary) {
			this.glossary = glossary;
		}

		public static class Glossary {
			public Glossary() {

			}

 		....
	
	}
	

**JsonProperty Annotation**


JsonProperty Name 설정 (JSON Key Name)

	@JsonProperty("GlossDiv")

원하지 않는 Json Ignore (제외)

	@JsonIgnoreProperties("GlossDiv")


#### 1. String to Json (JacksonGlossaryTest.java)

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


mapper를 생성한다

	ObjectMapper mapper = new ObjectMapper();


String 변수 input을 GlossaryDto 객체로 변환한 값을 이용하여 glossaryDto 객체를 생성한다 

	GlossaryDto glossaryDto = mapper.readValue(input, GlossaryDto.class);


glossaryDto 객체를 JSON 형식의 문자열로 만들고 그 값을 출력한다

		String json = mapper.writeValueAsString(glossaryDto);

		logger.debug("String to Json ---->" + json);
	


#### 2. Json to String (JacksonGlossaryTest.java)


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


객체를 생성한다

`GlossDef glossDef = new GlossDef();`

객체에 값을 set 

		glossDef.setPara("A meta-markup language, used to create markup languages such as DocBook.");
		glossDef.setGlossSeeAlso(glossSeeAlso);


ObjectMapper 생성

		ObjectMapper mapper = new ObjectMapper();

glossaryDto 객체를 JSON 형식으로 만들고 결과값을 출력한다

		String json = mapper.writeValueAsString(glossaryDto);
		logger.debug("Json To String ---->" + json.toString());

#### Result

	{
    	"glossary": {
        	"title": "example glossary",
        	"GlossDiv": {
            	"title": "S",
            	"GlossList": {
                	"GlossEntry": {
                    	"GlossDef": {
                        	"para": "A meta-markup language, used to create markup languages such as DocBook.",
                        	"GlossSeeAlso": [
                            	"GML",
                            	"XML"
                        	]
                   	 	},
                    	"ID": "SGML",
                    	"SortAs": "SGML",
                    	"GlossTerm": "Standard Generalized Markup Language",
                    	"Acronym": "SGML",
                    	"Abbrev": "ISO 8879:1986",
                    	"GlossSee": "markup"
              	  }
          	  }
    	    }
    	}
	}


## XML

Simpleframework 라이브러리를 이용하여 XML 파일로 읽어들인 값을 Object화하여 출력하고 , 
Object를 생성하여 XML 형태로 변환하여 결과값을 파일로 생성한다


### Maven

		<dependency>
			<groupId>org.simpleframework</groupId>
			<artifactId>simple-xml</artifactId>
			<version>2.7.1</version>
		</dependency>

### Non-Maven

 > 라이브러리를 직접 다운 받음
 
 > Download URL : [simpleframework](http://mvnrepository.com/artifact/org.simpleframework/simple-xml/2.7.1)

 > Version : 2.7.1
 

###Usage

Serializer를 만들때 Persister를 생성하고 Seriailizer read, Serializer write 메소드를 이용하여 XML 파일로 읽어들인 값을 Object화하여 출력하고, Object를 생성하고 XML 형태로 변환하여 결과값을 파일로 생성한다


#### Domain (GlossaryXmlDto.java)

	@Root(name = "glossary")
	public class GlossaryXmlDto {

		public GlossaryXmlDto() {

		}

		@Element
		private String title;

		@Element(name = "GlossDiv")
		private GlossDiv glossDiv;

		public static class GlossDiv {
			public GlossDiv() {
			}	

			@Element
			private String title;

			@Element(name = "GlossList")
			private GlossList glossList;

			public static class GlossList {

				public GlossList() {

				}

				@Element(name = "GlossEntry")
				private GlossEntry glossEntry;

				public static class GlossEntry {

					public GlossEntry() {

					}

					@Attribute(name = "ID")
					private String id;

					@Attribute(name = "SortAs")
					private String sortAs;

					@Element(name = "GlossTerm")
					private String glossTerm;

					@Element(name = "Acronym")
					private String acronym;

					@Element(name = "Abbrev")
					private String abbrev;
	
					....
		
				}
			}
		}


**SimpleFramework Annotation**

XML Root Name 

	@Root(name = "glossary")

XML Element Name 

	@Element(name = "GlossDiv")

XML Attribute Name
	
	@Attribute(name = "ID")

XML ElementList 설정

	@ElementList(inline = true)

XML 값 출력 제외 

	@ElementList(required=false)


#### 1. Xml to Object (GlossaryXml.java)

		@Test
		public void xmlToObject() throws Exception {

			Serializer serializer = new Persister();
		
			File source = new File(RESOURCE_PATH + "/Glossary.xml");
		
			GlossaryXmlDto glossaryDto = serializer.read(GlossaryXmlDto.class, source);
	
			logger.debug("Xml to Object------->" + glossaryDto.toString());
		
			assertEquals(glossaryDto.getGlossDiv().getTitle(), "S");
			assertEquals(glossaryDto.getGlossDiv().getGlossList().getGlossEntry().getGlossTerm(), "Standard Generalized Markup Language");
			assertFalse(glossaryDto.getGlossDiv().getGlossList().getGlossEntry().getId().equals("SGMX"));
			assertTrue(glossaryDto.getTitle().equals("example glossary"));
			assertNotNull(glossaryDto.getGlossDiv().getGlossList().getGlossEntry().getAbbrev());
	}


Persister 객체 생성. Persister 객체는 serializer의 구현을 제공하기 위해 사용

	`Serializer serializer = new Persister();`


XML 파일 값을 읽어들여 glossaryDto 객체를 생성

	File source = new File(RESOURCE_PATH + "/Glossary.xml");
		
	GlossaryXmlDto glossaryDto = serializer.read(GlossaryXmlDto.class, source);

객체를 String으로 변환하여 결과값을 출력

	logger.debug("Xml to Object------->" + glossaryDto.toString());


#### Result

	GlossaryDto [title=example glossary, glossDiv=GlossDiv [title=S, glossList=GlossList [glossEntry=GlossEntry [id=SGML, sortAs=SGML, glossTerm=Standard Generalized Markup Language, acronym=SGML, abbrev=ISO 8879:1986 glossSee=[GlossSee [otherTerm=markup]], glossDef=GlossDef [para=A meta-markup language, used to create markup languages such as DocBook., glossSeeAlso=[GlossSeeAlso [otherTerm=GML], GlossSeeAlso [otherTerm=XML]]]]]]] 


#### 2. Object to Xml (GlossaryXml.java)

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


glossDef 객체 생성

`GlossDef glossDef = new GlossDef();`

glossDef 값 set

		glossDef.setPara("A meta-markup language, used to create markup languages such as DocBook.");
		glossDef.setGlossSeeAlso(glossSeeAlsoList);

xml 생성 시 xml 선언과 dtd를 참조를 같이 출력하기 위하여 Persister를 생성할 때 Fomat도 생성한다

	Serializer serializer = new Persister(new Format("<?xml version=\"1.0\" encoding= \"UTF-8\" ?>\n<!DOCTYPE glossary SYSTEM \"../dtd/Glossary.dtd\">"));

결과값을 log로 찍지 않고 file로 생성하기 위해 File 객체를 생성하고 결과값을 파일로 출력한다

		File result = new File(RESOURCE_PATH +"/Glossary.xml");
		serializer.write(glossaryDto, result);		

#### Result
	src/test/resouces/xml 밑에 Glossary.xml 생성