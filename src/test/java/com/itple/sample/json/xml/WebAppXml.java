package com.itple.sample.json.xml;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import java.io.File;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.junit.Test;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.core.Persister;
import org.simpleframework.xml.stream.Format;

import com.itple.sample.json.xml.domain.WebAppXmlDto.WebApp;
import com.itple.sample.json.xml.domain.WebAppXmlDto.WebApp.ServletList;
import com.itple.sample.json.xml.domain.WebAppXmlDto.WebApp.ServletList.InitParamList;
import com.itple.sample.json.xml.domain.WebAppXmlDto.WebApp.ServletMappingList;
import com.itple.sample.json.xml.domain.WebAppXmlDto.WebApp.Taglib;


public class WebAppXml {
	
	public static final String RESOURCE_PATH = "../ITPLE-Sample-Project/src/test/resources/xml";

	private static final Logger logger = Logger.getLogger(WebAppXml.class.getName());

	@Test
	public void xmlToObject() throws Exception {
	
		File source = new File(RESOURCE_PATH + "/WebApp.xml");
		
		Serializer serializer = new Persister();

		WebApp webAppDto = serializer.read(WebApp.class, source);

		logger.debug("Xml To Object ---->" + webAppDto.toString());
	
		assertEquals(webAppDto.getServlet().get(0).getServletName(),"cofaxCDS");
		assertEquals(webAppDto.getServletMapping().get(0).getUrlPattern(), "/");
		assertFalse(webAppDto.getTaglib().getTaglibLocation().equals("dfdfdfdf"));
	}
	
	@Test
	public void objectToXml() throws Exception {
		
		WebApp webApp = new WebApp();
		Taglib taglib = new Taglib();
	
		List<ServletList> servletList = new ArrayList<ServletList>();
		List<ServletMappingList> servletMappingList = new ArrayList<ServletMappingList>();
	
		List<InitParamList> initParamList = new ArrayList<InitParamList>();
		List<InitParamList> initParamListEmail = new ArrayList<InitParamList>();
		List<InitParamList> initParamListCofax = new ArrayList<InitParamList>();
		
		ServletList servletAdmin = new ServletList();
		ServletList servletFileServlet = new ServletList();
		ServletList servletCofax = new ServletList();
		ServletList servletCofaxEmail = new ServletList();
		ServletList servletCofaxCDS = new ServletList();
		
		InitParamList configInstall = new InitParamList();
		InitParamList configEmail = new InitParamList();
		InitParamList configPoweredBy = new InitParamList();
		InitParamList configPoweredIcon = new InitParamList();
		InitParamList configStatic = new InitParamList();
		InitParamList processor = new InitParamList();
		InitParamList loader = new InitParamList();
		InitParamList path = new InitParamList();
		InitParamList overridPath = new InitParamList();
		InitParamList defaultList = new InitParamList();
		InitParamList defaultFile = new InitParamList();
		InitParamList useJsp = new InitParamList();
		InitParamList jspList = new InitParamList();
		InitParamList jspFile = new InitParamList();
		InitParamList cachePackageTagsTrack = new InitParamList();
		InitParamList cachePackageTagsStore = new InitParamList();
		InitParamList cachePackageTagsRefresh = new InitParamList();
		InitParamList cacheTemplatesTrack = new InitParamList();
		InitParamList cacheTemplatesStore = new InitParamList();
		InitParamList cacheTemplatesRefresh = new InitParamList();
		InitParamList cachePagesTrack = new InitParamList();
		InitParamList cachePagesStore = new InitParamList();
		InitParamList cachePagesRefresh = new InitParamList();
		InitParamList cachePagesDirtyRead = new InitParamList();
		InitParamList searchEngineListTemplate = new InitParamList();
		InitParamList searchEngineFileTemplate = new InitParamList();
		InitParamList searchEngineRobotsDb = new InitParamList();
		InitParamList useDataStore = new InitParamList();
		InitParamList dataStoreClass = new InitParamList();
		InitParamList redirectionClass = new InitParamList();
		InitParamList dataStoreName = new InitParamList();
		InitParamList dataStoreDriver = new InitParamList();
		InitParamList dataStoreUrl = new InitParamList();
		InitParamList dataStoreUser = new InitParamList();
		InitParamList dataStorePassword = new InitParamList();
		InitParamList dataStoreTestQuery = new InitParamList();
		InitParamList dataStoreLogFile = new InitParamList();
		InitParamList dataStoreInitConns = new InitParamList();
		InitParamList dataStoreMaxConns = new InitParamList();
		InitParamList dataStoreConnUsageLimit = new InitParamList();
		InitParamList dataStoreLogLevel = new InitParamList();
		InitParamList maxUrlLength = new InitParamList();
		
		InitParamList MailHost = new InitParamList();
		InitParamList HostOverride = new InitParamList();
		
		InitParamList cofax = new InitParamList();
		InitParamList log = new InitParamList();
		InitParamList logLocation = new InitParamList();
		InitParamList logMaxSize = new InitParamList();
		InitParamList dataLog = new InitParamList();
		InitParamList dataLogLocation = new InitParamList();
		InitParamList dataLogMaxSize = new InitParamList();
		InitParamList removePageCache = new InitParamList();
		InitParamList removeTemplateCache = new InitParamList();
		InitParamList fileTransfer = new InitParamList();
		InitParamList context = new InitParamList();
		InitParamList groupId = new InitParamList();
		InitParamList betaServer = new InitParamList();
		
		servletCofaxCDS.setServletName("cofaxCDS");
		servletCofaxCDS.setServletClass("org.cofax.cds.CDSServlet");
		
		configInstall.setParamName("configGlossary:installationAt");
		configInstall.setParamValue("Philadelphia, PA");
		
		configEmail.setParamName("configGlossary:adminEmail");
		configEmail.setParamValue("ksm@pobox.com");
		
		configPoweredBy.setParamName("configGlossary:poweredBy");
		configPoweredBy.setParamValue("Cofax");
		
		configPoweredIcon.setParamName("configGlossary:poweredByIcon");
		configPoweredIcon.setParamValue("/images/cofax.gif");
		
		configStatic.setParamName("configGlossary:staticPath");
		configStatic.setParamValue("/content/static");
		
		processor.setParamName("templateProcessorClass");
		processor.setParamValue("org.cofax.WysiwygTemplate");
	
		loader.setParamName("templateLoaderClass");
		loader.setParamValue("org.cofax.FilesTemplateLoader");
		
		path.setParamName("templatePath");
		path.setParamValue("templates");
		
		overridPath.setParamName("templateOverridePath");
		overridPath.setParamValue("");
		
		defaultList.setParamName("defaultListTemplate");
		defaultList.setParamValue("listTemplate.htm");
		
		defaultFile.setParamName("defaultFileTemplate");
		defaultFile.setParamValue("articleTemplate.htm");
		
		useJsp.setParamName("useJSP");
		useJsp.setParamValue("false");
		
		jspList.setParamName("jspListTemplate");
		jspList.setParamValue("listTemplate.jsp");
		
		jspFile.setParamName("jspFileTemplate");
		jspFile.setParamValue("articleTemplate.jsp");
		
		cachePackageTagsTrack.setParamName("cachePackageTagsTrack");
		cachePackageTagsTrack.setParamValue("200");
		
		cachePackageTagsStore.setParamName("cachePackageTagsStore");
		cachePackageTagsStore.setParamValue("200");
		
		cachePackageTagsRefresh.setParamName("cachePackageTagsRefresh");
		cachePackageTagsRefresh.setParamValue("60");
		
		cacheTemplatesTrack.setParamName("cacheTemplatesTrack");
		cacheTemplatesTrack.setParamValue("100");
		
		cacheTemplatesStore.setParamName("cacheTemplatesStore");
		cacheTemplatesStore.setParamValue("50");
		
		cacheTemplatesRefresh.setParamName("cacheTemplatesRefresh");
		cacheTemplatesRefresh.setParamValue("15");
		
		cachePagesTrack.setParamName("cachePagesTrack");
		cachePagesTrack.setParamValue("200");

		cachePagesStore.setParamName("cachePagesStore");
		cachePagesStore.setParamValue("100");
		
		cachePagesRefresh.setParamName("cachePagesRefresh");
		cachePagesRefresh.setParamValue("10");
		
		cachePagesDirtyRead.setParamName("cachePagesDirtyRead");
		cachePagesDirtyRead.setParamValue("10");
		
		searchEngineListTemplate.setParamName("searchEngineListTemplate");
		searchEngineListTemplate.setParamValue("forSearchEnginesList.htm");
		
		searchEngineFileTemplate.setParamName("searchEngineFileTemplate");
		searchEngineFileTemplate.setParamValue("forSearchEngines.htm");
		
		searchEngineRobotsDb.setParamName("searchEngineRobotsDb");
		searchEngineRobotsDb.setParamValue("WEB-INF/robots.db");
		
		useDataStore.setParamName("useDataStore");
		useDataStore.setParamValue("true");
		
		dataStoreClass.setParamName("dataStoreClass");
		dataStoreClass.setParamValue("org.cofax.SqlDataStore");
		
		redirectionClass.setParamName("redirectionClass");
		redirectionClass.setParamValue("org.cofax.SqlRedirection");
		
		dataStoreName.setParamName("dataStoreName");
		dataStoreName.setParamValue("cofax");
		
		dataStoreDriver.setParamName("dataStoreDriver");
		dataStoreDriver.setParamValue("com.microsoft.jdbc.sqlserver.SQLServerDriver");
		
		dataStoreUrl.setParamName("dataStoreUrl");
		dataStoreUrl.setParamValue("jdbc:microsoft:sqlserver://LOCALHOST:1433;DatabaseName=goon");
		
		dataStoreUser.setParamName("dataStoreUser");
		dataStoreUser.setParamValue("sa");
		
		dataStorePassword.setParamName("dataStorePassword");
		dataStorePassword.setParamValue("");
		
		dataStoreTestQuery.setParamName("dataStoreTestQuery");
		dataStoreTestQuery.setParamValue("SET NOCOUNT ON;select test='test';");
		
		dataStoreLogFile.setParamName("dataStoreLogFile");
		dataStoreLogFile.setParamValue("/usr/local/tomcat/logs/datastore.log");
		
		dataStoreInitConns.setParamName("dataStoreInitConns");
		dataStoreInitConns.setParamValue("10");
		
		dataStoreMaxConns.setParamName("dataStoreMaxConns");
		dataStoreMaxConns.setParamValue("100");
		
		dataStoreConnUsageLimit.setParamName("dataStoreConnUsageLimit");
		dataStoreConnUsageLimit.setParamValue("100");
		
		dataStoreLogLevel.setParamName("dataStoreLogLevel");
		dataStoreLogLevel.setParamValue("debug");
		
		maxUrlLength.setParamName("maxUrlLength");
		maxUrlLength.setParamValue("500");
		
		initParamListCofax.add(configInstall);
		initParamListCofax.add(configEmail);
		initParamListCofax.add(configPoweredBy);
		initParamListCofax.add(configPoweredIcon);
		initParamListCofax.add(processor);
		initParamListCofax.add(loader);
		initParamListCofax.add(path);
		initParamListCofax.add(overridPath);
		initParamListCofax.add(defaultList);
		initParamListCofax.add(defaultFile);
		initParamListCofax.add(useJsp);
		initParamListCofax.add(jspList);
		initParamListCofax.add(jspFile);
		initParamListCofax.add(cachePackageTagsTrack);
		initParamListCofax.add(cachePackageTagsStore);
		initParamListCofax.add(cachePackageTagsRefresh);
		initParamListCofax.add(cacheTemplatesTrack);
		initParamListCofax.add(cacheTemplatesStore);
		initParamListCofax.add(cachePagesTrack);
		initParamListCofax.add(cachePagesStore);
		initParamListCofax.add(cachePagesRefresh);
		initParamListCofax.add(cachePagesDirtyRead);
		initParamListCofax.add(searchEngineListTemplate);
		initParamListCofax.add(searchEngineFileTemplate);
		initParamListCofax.add(searchEngineRobotsDb);
		initParamListCofax.add(useDataStore);
		initParamListCofax.add(dataStoreClass);
		initParamListCofax.add(redirectionClass);
		initParamListCofax.add(dataStoreName);
		initParamListCofax.add(dataStoreDriver);
		initParamListCofax.add(dataStoreUrl);
		initParamListCofax.add(dataStoreUser);
		initParamListCofax.add(dataStoreTestQuery);
		initParamListCofax.add(dataStoreLogFile);
		initParamListCofax.add(dataStoreInitConns);
		initParamListCofax.add(dataStoreMaxConns);
		initParamListCofax.add(dataStoreConnUsageLimit);
		initParamListCofax.add(dataStoreLogLevel);
		initParamListCofax.add(maxUrlLength);
		
		servletCofaxCDS.setInitParam(initParamListCofax);
		
		servletCofaxEmail.setServletName("cofaxEmail");
		servletCofaxEmail.setServletClass("org.cofax.cds.EmailServlet");
		
		MailHost.setParamName("mailHost");
		MailHost.setParamValue("mail1");
		
		HostOverride.setParamName("mailHostOverride");
		HostOverride.setParamValue("mail2");
		
		initParamListEmail.add(MailHost);
		initParamListEmail.add(HostOverride);
		servletCofaxEmail.setInitParam(initParamListEmail);
		
		servletAdmin.setServletName("cofaxAdmin");
		servletAdmin.setServletClass("org.cofax.cds.AdminServlet");
		
		servletFileServlet.setServletName("fileServlet");
		servletFileServlet.setServletClass("org.cofax.cds.FileServlet");
		
		cofax.setParamName("templatePath");
		cofax.setParamValue("toolstemplates");
		
		log.setParamName("log");
		log.setParamValue("1");
		
		logLocation.setParamName("logLocation");
		logLocation.setParamValue("/usr/local/tomcat/logs/CofaxTools.log");
		
		logMaxSize.setParamName("logMaxSize");
		logMaxSize.setParamValue("");
		
		dataLog.setParamName("dataLog");
		dataLog.setParamValue("1");
		
		dataLogLocation.setParamName("dataLogLocation");
		dataLogLocation.setParamValue("/usr/local/tomcat/logs/dataLog.log");
		
		dataLogMaxSize.setParamName("dataLogMaxSize");
		dataLogMaxSize.setParamValue("");
		
		removePageCache.setParamName("removePageCache");
		removePageCache.setParamValue("/content/admin/remove?cache=pages;id=");
		
		removeTemplateCache.setParamName("removeTemplateCache");
		removeTemplateCache.setParamValue("/content/admin/remove?cache=templates;id=");
		
		fileTransfer.setParamName("fileTransferFolder");
		fileTransfer.setParamValue("/usr/local/tomcat/webapps/content/fileTransferFolder");
		
		context.setParamName("lookInContext");
		context.setParamValue("1");
		
		groupId.setParamName("adminGroupID");
		groupId.setParamValue("4");
		
		betaServer.setParamName("betaServer");
		betaServer.setParamValue("true");
		
		initParamList.add(cofax);
		initParamList.add(log);
		initParamList.add(logLocation);
		initParamList.add(logMaxSize);
		initParamList.add(dataLog);
		initParamList.add(dataLogLocation);
		initParamList.add(dataLogMaxSize);
		initParamList.add(removePageCache);
		initParamList.add(removeTemplateCache);
		initParamList.add(fileTransfer);
		initParamList.add(context);
		initParamList.add(groupId);
		initParamList.add(betaServer);
		
		servletCofax.setServletName("cofaxTools");
		servletCofax.setServletClass("org.cofax.cms.CofaxToolsServlet");
		servletCofax.setInitParam(initParamList);
		
		servletList.add(servletCofaxCDS);
		servletList.add(servletCofaxEmail);
		servletList.add(servletAdmin);
		servletList.add(servletFileServlet);
		servletList.add(servletCofax);
		
		ServletMappingList servletMappingTools = new ServletMappingList();
		ServletMappingList servletMappingFile = new ServletMappingList();
		ServletMappingList servletMappingAdmin = new ServletMappingList();
		ServletMappingList serveltMappingEmail = new ServletMappingList();
		ServletMappingList servletMappingCofax = new ServletMappingList();
	
		servletMappingCofax.setServletName("cofaxCDS");
		servletMappingCofax.setUrlPattern("/");
		
		serveltMappingEmail.setServletName("cofaxEmail");
		serveltMappingEmail.setUrlPattern("/cofaxutil/aemail/*");
		
		servletMappingAdmin.setServletName("cofaxAdmin");
		servletMappingAdmin.setUrlPattern("/admin/*");
		
		servletMappingFile.setServletName("fileServlet");
		servletMappingFile.setUrlPattern("/static/*");
		
		servletMappingTools.setServletName("cofaxTools");
		servletMappingTools.setUrlPattern("/tools/*");
		
		servletMappingList.add(servletMappingCofax);
		servletMappingList.add(serveltMappingEmail);
		servletMappingList.add(servletMappingAdmin);
		servletMappingList.add(servletMappingFile);
		servletMappingList.add(servletMappingTools);
		
		taglib.setTaglibUri("cofax.tld");
		taglib.setTaglibLocation("/WEB-INF/tlds/cofax.tld");
		
		webApp.setTaglib(taglib);
		webApp.setServlet(servletList);
		webApp.setServletMapping(servletMappingList);
		
		Serializer serializer = new Persister(new Format("<?xml version=\"1.0\" encoding= \"ISO-8859-1\"?>\n<!DOCTYPE web-app SYSTEM \"../dtd/WebApp.dtd\">"));
		Writer writer = new OutputStreamWriter(System.out);
		serializer.write(webApp, writer);
		
		File result = new File(RESOURCE_PATH +"/WebApp.xml");
		serializer.write(webApp, result);		
		
		assertEquals(webApp.getServlet().get(0).getServletName(),"cofaxCDS");
		assertEquals(webApp.getServletMapping().get(0).getUrlPattern(), "/");
		assertFalse(webApp.getTaglib().getTaglibLocation().equals("dfdfdfdf"));
		
	}
	
}
