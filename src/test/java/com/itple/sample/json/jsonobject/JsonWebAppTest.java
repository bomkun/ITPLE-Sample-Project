package com.itple.sample.json.jsonobject;

import static org.junit.Assert.assertEquals;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JsonWebAppTest {

	private static final Logger logger = LoggerFactory.getLogger(JsonWebAppTest.class);

	@Test
	public void StringToJson() throws Exception {

		String input = "{\"web-app\": {\"servlet\": [{\"servlet-name\": \"cofaxCDS\",\"servlet-class\": \"org.cofax.cds.CDSServlet\",\"init-param\": {\"configGlossary:installationAt\": \"Philadelphia, PA\","
				+ " \"configGlossary:adminEmail\": \"ksm@pobox.com\",\"configGlossary:poweredBy\": \"Cofax\",\"configGlossary:poweredByIcon\": \"/images/cofax.gif\",\"configGlossary:staticPath\": \"/content/static\","
				+ "\"templateProcessorClass\": \"org.cofax.WysiwygTemplate\",\"templateLoaderClass\": \"org.cofax.FilesTemplateLoader\",\"templatePath\": \"templates\",\"templateOverridePath\": \"\","
				+ "\"defaultListTemplate\": \"listTemplate.htm\",\"defaultFileTemplate\": \"articleTemplate.htm\",\"useJSP\": false,\"jspListTemplate\": \"listTemplate.jsp\",\"jspFileTemplate\": \"articleTemplate.jsp\","
				+ "\"cachePackageTagsTrack\": 200,\"cachePackageTagsStore\": 200,\"cachePackageTagsRefresh\": 60,\"cacheTemplatesTrack\": 100,\"cacheTemplatesStore\": 50,\"cacheTemplatesRefresh\": 15,"
				+ "\"cachePagesTrack\": 200,\"cachePagesStore\": 100,\"cachePagesRefresh\": 10,\"cachePagesDirtyRead\": 10,\"searchEngineListTemplate\": \"forSearchEnginesList.htm\",\"searchEngineFileTemplate\": \"forSearchEngines.htm\","
				+ "\"searchEngineRobotsDb\": \"WEB-INF/robots.db\",\"useDataStore\": true,\"dataStoreClass\": \"org.cofax.SqlDataStore\",\"redirectionClass\": \"org.cofax.SqlRedirection\",\"dataStoreName\": \"cofax\",\"dataStoreDriver\": \"com.microsoft.jdbc.sqlserver.SQLServerDriver\","
				+ "\"dataStoreUrl\": \"jdbc:microsoft:sqlserver://LOCALHOST:1433;DatabaseName=goon\",\"dataStoreUser\": \"sa\",\"dataStorePassword\": \"dataStoreTestQuery\",\"dataStoreTestQuery\": \"SET NOCOUNT ON;select test='test';\",\"dataStoreLogFile\": \"/usr/local/tomcat/logs/datastore.log\",\"dataStoreInitConns\": 10,"
				+ "\"dataStoreMaxConns\": 100,\"dataStoreConnUsageLimit\": 100,\"dataStoreLogLevel\": \"debug\",\"maxUrlLength\": 500}},"
				+ "{\"servlet-name\": \"cofaxEmail\",\"servlet-class\": \"org.cofax.cds.EmailServlet\",\"init-param\": {\"mailHost\": \"mail1\",\"mailHostOverride\": \"mail2\"}},{\"servlet-name\": \"cofaxAdmin\",\"servlet-class\": \"org.cofax.cds.AdminServlet\"},{\"servlet-name\": \"fileServlet\",\"servlet-class\": \"org.cofax.cds.FileServlet\"},"
				+ "{\"servlet-name\": \"cofaxTools\",\"servlet-class\": \"org.cofax.cms.CofaxToolsServlet\",\"init-param\": {\"templatePath\": \"toolstemplates/\",\"log\": 1,\"logLocation\": \"/usr/local/tomcat/logs/CofaxTools.log\",\"logMaxSize\": \"\",\"dataLog\": 1,\"dataLogLocation\": \"/usr/local/tomcat/logs/dataLog.log\","
				+ "\"dataLogMaxSize\": \"\",\"removePageCache\": \"/content/admin/remove?cache=pages&id=\",\"removeTemplateCache\": \"/content/admin/remove?cache=templates&id=\",\"fileTransferFolder\": \"/usr/local/tomcat/webapps/content/fileTransferFolder\",\"lookInContext\": 1,\"adminGroupID\": 4,\"betaServer\": true}}],"
				+ "\"servlet-mapping\": {\"cofaxCDS\": \"/\",\"cofaxEmail\": \"/cofaxutil/aemail/*\",\"cofaxAdmin\": \"/admin/*\",\"fileServlet\": \"/static/*\",\"cofaxTools\": \"/tools/*\"},\"taglib\": {\"taglib-uri\": \"cofax.tld\",\"taglib-location\": \"/WEB-INF/tlds/cofax.tld\"}}}";

		JSONObject json = new JSONObject(input);

		logger.debug("String to Json -----> " + json.toString());

		assertEquals(json.getJSONObject("web-app").getJSONObject("taglib").get("taglib-uri"), "cofax.tld");
		assertEquals(json.getJSONObject("web-app").getJSONObject("servlet-mapping").get("cofaxAdmin"), "/admin/*");
	}

	@Test
	public void JsonToString() throws Exception {

		JSONObject json = new JSONObject();
		JSONArray jsonArray = new JSONArray();
		JSONObject webapp = new JSONObject();
		JSONObject taglib = new JSONObject();
		JSONObject servletMapping = new JSONObject();
		JSONObject servlet = new JSONObject();
		JSONObject initParam = new JSONObject();
		JSONObject servletTwo = new JSONObject();
		JSONObject initParamTwo = new JSONObject();
		JSONObject servletThree = new JSONObject();
		JSONObject servletfour = new JSONObject();
		JSONObject initParamThree = new JSONObject();

		taglib.put("taglib-uri", "cofax.tld");
		taglib.put("taglib-location", "/WEB-INF/tlds/cofax.tld");

		servletMapping.put("cofaxCDS", "/");
		servletMapping.put("cofaxEmail", "/cofaxutil/aemail/*");
		servletMapping.put("cofaxAdmin", "/admin/*");
		servletMapping.put("fileServlet", "/static/*");
		servletMapping.put("cofaxTools", "/tools/*");

		servlet.put("servlet-name", "cofaxCDS");
		servlet.put("servlet-class", "org.cofax.cds.CDSServlet");

		servletTwo.put("servlet-name", "cofaxEmail");
		servletTwo.put("servlet-class", "org.cofax.cds.EmailServlet");

		servlet.put("servlet-name", "cofaxAdmin");
		servlet.put("servlet-class", "org.cofax.cds.AdminServlet");

		servletThree.put("servlet-name", "fileServlet");
		servletThree.put("servlet-class", "org.cofax.cds.FileServlet");

		servletfour.put("servlet-name", "cofaxTools");
		servletfour.put("servlet-class", "org.cofax.cms.CofaxToolsServlet");

		initParam.put("configGlossary:installationAt", "Philadelphia, PA");
		initParam.put("configGlossary:adminEmail", "ksm@pobox.com");
		initParam.put("configGlossary:poweredBy", "Cofax");
		initParam.put("configGlossary:poweredByIcon", "/images/cofax.gif");
		initParam.put("configGlossary:staticPath", "/content/static");
		initParam.put("templateProcessorClass", "org.cofax.WysiwygTemplate");
		initParam.put("templateLoaderClass", "org.cofax.FilesTemplateLoader");
		initParam.put("templatePath", "templates");
		initParam.put("templateOverridePath", "");
		initParam.put("defaultListTemplate", "listTemplate.htm");
		initParam.put("defaultFileTemplate", "articleTemplate.htm");
		initParam.put("useJSP", false);
		initParam.put("jspListTemplate", "listTemplate.jsp");
		initParam.put("jspFileTemplate", "articleTemplate.jsp");
		initParam.put("cachePackageTagsTrack", 200);
		initParam.put("cachePackageTagsStore", 200);
		initParam.put("cachePackageTagsRefresh", 60);
		initParam.put("cacheTemplatesTrack", 100);
		initParam.put("cacheTemplatesStore", 50);
		initParam.put("cacheTemplatesRefresh", 15);
		initParam.put("cachePagesTrack", 200);
		initParam.put("cachePagesStore", 100);
		initParam.put("cachePagesRefresh", 10);
		initParam.put("cachePagesDirtyRead", 10);
		initParam.put("searchEngineListTemplate", "forSearchEnginesList.htm");
		initParam.put("searchEngineFileTemplate", "forSearchEngines.htm");
		initParam.put("searchEngineRobotsDb", "WEB-INF/robots.db");
		initParam.put("useDataStore", true);
		initParam.put("dataStoreClass", "org.cofax.SqlDataStore");
		initParam.put("redirectionClass", "org.cofax.SqlRedirection");
		initParam.put("dataStoreName", "cofax");
		initParam.put("dataStoreDriver", "com.microsoft.jdbc.sqlserver.SQLServerDriver");
		initParam.put("dataStoreUrl", "jdbc:microsoft:sqlserver://LOCALHOST:1433;DatabaseName=goon");
		initParam.put("dataStoreUser", "sa");
		initParam.put("dataStorePassword", "dataStoreTestQuery");
		initParam.put("dataStoreTestQuery", "SET NOCOUNT ON;select test='test';");
		initParam.put("dataStoreLogFile", "/usr/local/tomcat/logs/datastore.log");
		initParam.put("dataStoreInitConns", 10);
		initParam.put("dataStoreMaxConns", 100);
		initParam.put("dataStoreConnUsageLimit", 100);
		initParam.put("dataStoreLogLevel", "debug");
		initParam.put("maxUrlLength", 500);

		initParamTwo.put("mailHost", "mail1");
		initParamTwo.put("mailHostOverride", "mail2");

		initParamThree.put("templatePath", "toolstemplates/");
		initParamThree.put("log", 1);
		initParamThree.put("logLocation", "/usr/local/tomcat/logs/CofaxTools.log");
		initParamThree.put("logMaxSize", "");
		initParamThree.put("dataLog", 1);
		initParamThree.put("dataLogLocation", "/usr/local/tomcat/logs/dataLog.log");
		initParamThree.put("dataLogMaxSize", "");
		initParamThree.put("removePageCache", "/content/admin/remove?cache=pages&id=");
		initParamThree.put("removeTemplateCache", "/content/admin/remove?cache=templates&id=");
		initParamThree.put("fileTransferFolder", "/usr/local/tomcat/webapps/content/fileTransferFolder");
		initParamThree.put("lookInContext", 1);
		initParamThree.put("adminGroupID", 4);
		initParamThree.put("betaServer", true);

		jsonArray.put(servlet);

		json.put("webapp", webapp);
		webapp.put("taglib", taglib);
		webapp.put("servlet-mapping", servletMapping);

		webapp.put("servlet", jsonArray);

		servlet.put("init-param", initParam);

		servlet.put("servletTwo", servletTwo);
		servlet.put("servletThree", servletThree);
		servlet.put("servletfour", servletfour);

		servletTwo.put("init-param", initParamTwo);
		servletfour.put("init-param", initParamThree);

		logger.debug("Json to String ----> " + webapp.toString());

		assertEquals(json.getJSONObject("webapp").getJSONObject("taglib").get("taglib-uri"), "cofax.tld");
		assertEquals(json.getJSONObject("webapp").getJSONObject("servlet-mapping").get("cofaxAdmin"), "/admin/*");

	}
}
