package com.itple.sample.json.jackson;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;

import com.itple.sample.json.jackson.domain.WebAppDto;
import com.itple.sample.json.jackson.domain.WebAppDto.WebApp;
import com.itple.sample.json.jackson.domain.WebAppDto.WebApp.ServletList;
import com.itple.sample.json.jackson.domain.WebAppDto.WebApp.ServletList.InitParam;
import com.itple.sample.json.jackson.domain.WebAppDto.WebApp.ServletMapping;
import com.itple.sample.json.jackson.domain.WebAppDto.WebApp.Taglib;



public class JacksonWebAppTest {

	private static final Logger logger = Logger.getLogger(JacksonWebAppTest.class.getName());

	@Test
	public void stringToJson() throws Exception {

		ObjectMapper mapper = new ObjectMapper();

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

		WebAppDto webAppDto = mapper.readValue(input, WebAppDto.class);

		String json = mapper.writeValueAsString(webAppDto);

		logger.debug("String To Json ----> " + json.toString());

		assertEquals(webAppDto.getWebApp().getServletMapping().getFileServlet(), "/static/*");
		assertEquals(webAppDto.getWebApp().getServlet().get(0).getServletName(), "cofaxCDS");
		assertFalse(webAppDto.getWebApp().getServlet().get(0).getServletClass().equals("org.cofax.cds.CDSServletF"));
		assertTrue(webAppDto.getWebApp().getServlet().get(0).getInitParam().getUseDataStore());
	}

	@Test
	public void jsonToString() throws Exception {

		ServletMapping servletMapping = new ServletMapping();
		Taglib taglib = new Taglib();
		WebApp webApp = new WebApp();
		WebAppDto webAppDto = new WebAppDto();

		InitParam initParam = new InitParam();

		List<ServletList> servlet = new ArrayList<ServletList>();
		ServletList servletList = new ServletList();
		ServletList servletCofaxEmail = new ServletList();
		ServletList servletCofaxAdmin = new ServletList();
		ServletList servletFileServlet = new ServletList();
		ServletList servletCofaxTool = new ServletList();

		InitParam initParamMail = new InitParam();
		InitParam initParamTool = new InitParam();

		taglib.setTagliburi("/WEB-INF/tlds/cofax.tld");
		taglib.setTaglibLocation("cofax.tld");

		servletMapping.setCofaxCDS("/");
		servletMapping.setCofaxEmail("/cofaxutil/aemail/*");
		servletMapping.setCofaxAdmin("/admin/*");
		servletMapping.setFileServlet("/static/*");
		servletMapping.setCofaxTools("/tools/*");

		servletCofaxTool.setServletName("cofaxTools");
		servletCofaxTool.setServletClass("org.cofax.cms.CofaxToolsServlet");

		initParamTool.setTemplatePath("toolstemplates/");
		initParamTool.setLog(1);
		initParamTool.setLogLocation("/usr/local/tomcat/logs/CofaxTools.log");
		initParamTool.setLogMaxSize("");
		initParamTool.setDataLog(1);
		initParamTool.setDataLogLocation("/usr/local/tomcat/logs/dataLog.log");
		initParamTool.setDataLogMaxSize("");
		initParamTool.setRemovePageCache("/content/admin/remove?cache=pages&id=");
		initParamTool.setRemoveTemplateCache("/content/admin/remove?cache=templates&id=");
		initParamTool.setFileTransferFolder("/usr/local/tomcat/webapps/content/fileTransferFolder");
		initParamTool.setLookInContext(1);
		initParamTool.setAdminGroupID(4);
		initParamTool.setBetaServer(true);

		servletCofaxTool.setInitParam(initParamTool);

		servletFileServlet.setServletName("fileServlet");
		servletFileServlet.setServletClass("org.cofax.cds.FileServlet");

		servletCofaxAdmin.setServletName("cofaxAdmin");
		servletCofaxAdmin.setServletClass("org.cofax.cds.AdminServlet");

		servletCofaxEmail.setServletName("cofaxEmail");
		servletCofaxEmail.setServletClass("org.cofax.cds.EmailServlet");

		initParamMail.setMailHost("mail1");
		initParamMail.setMailHostOverride("mail2");

		servletCofaxEmail.setInitParam(initParamMail);

		servletList.setServletName("cofaxCDS");
		servletList.setServletClass("org.cofax.cds.CDSServlet");

		initParam.setConfigGlossary("Philadelphia, PA");
		initParam.setConfigGlossaryAdminEmail("ksm@pobox.com");
		initParam.setConfigGlossaryPoweredBy("Cofax");
		initParam.setConfigGlossaryPoweredByIcon("/images/cofax.gif");
		initParam.setConfigGlossaryStaticPath("/content/static");
		initParam.setTemplateProcessorClass("org.cofax.WysiwygTemplate");
		initParam.setTemplateLoaderClass("org.cofax.FilesTemplateLoader");
		initParam.setTemplatePath("templates");
		initParam.setTemplateOverridePath("");
		initParam.setDefaultListTemplate("listTemplate.htm");
		initParam.setDefaultFileTemplate("articleTemplate.htm");
		initParam.setUseJSP(false);
		initParam.setJspListTemplate("listTemplate.jsp");
		initParam.setJspFileTemplate("articleTemplate.jsp");
		initParam.setCachePackageTagsTrack(200);
		initParam.setCachePackageTagsStore(200);
		initParam.setCachePackageTagsRefresh(60);
		initParam.setCacheTemplatesTrack(100);
		initParam.setCacheTemplatesStore(50);
		initParam.setCacheTemplatesRefresh(15);
		initParam.setCachePagesTrack(200);
		initParam.setCachePagesStore(100);
		initParam.setCachePagesRefresh(10);
		initParam.setCachePagesDirtyRead(10);
		initParam.setSearchEngineListTemplate("forSearchEnginesList.htm");
		initParam.setSearchEngineFileTemplate("forSearchEngines.htm");
		initParam.setSearchEngineRobotsDb("WEB-INF/robots.db");
		initParam.setUseDataStore(true);
		initParam.setDataStoreClass("org.cofax.SqlDataStore");
		initParam.setRedirectionClass("org.cofax.SqlRedirection");
		initParam.setDataStoreName("cofax");
		initParam.setDataStoreDriver("com.microsoft.jdbc.sqlserver.SQLServerDriver");
		initParam.setDataStoreUrl("jdbc:microsoft:sqlserver://LOCALHOST:1433;DatabaseName=goon");
		initParam.setDataStoreUser("sa");
		initParam.setDataStorePassword("dataStoreTestQuery");
		initParam.setDataStoreTestQuery("SET NOCOUNT ON;select test='test';");
		initParam.setDataStoreLogFile("/usr/local/tomcat/logs/datastore.log");
		initParam.setDataStoreInitConns(10);
		initParam.setDataStoreMaxConns(100);
		initParam.setDataStoreConnUsageLimit(100);
		initParam.setDataStoreLogLevel("debug");
		initParam.setMaxUrlLength(500);

		servletList.setInitParam(initParam);

		servlet.add(servletCofaxTool);
		servlet.add(servletFileServlet);
		servlet.add(servletCofaxAdmin);
		servlet.add(servletCofaxEmail);
		servlet.add(servletList);

		webApp.setTaglib(taglib);
		webApp.setServletMapping(servletMapping);
		webApp.setServlet(servlet);

		webAppDto.setWebApp(webApp);

		ObjectMapper mapper = new ObjectMapper();
		String json = mapper.writeValueAsString(webAppDto);

		logger.debug("Json To String ---->" + json.toString());

		assertEquals(webApp.getServletMapping().getFileServlet(), "/static/*");
		assertEquals(webApp.getServlet().get(0).getServletName(), "cofaxTools");
		assertFalse(webApp.getServlet().get(0).getServletClass().equals("org.cofax.cms.CofaxToolsServletF"));
		assertTrue(webApp.getServlet().get(0).getInitParam().getBetaServer());

	}

}
