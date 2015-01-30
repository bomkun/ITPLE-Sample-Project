package com.itple.sample.json.jackson.domain;

import java.util.List;

import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonSerialize;

public class WebAppDto {

	public WebAppDto() {
	}

	@JsonProperty("web-app")
	private WebApp webApp;

	public WebApp getWebApp() {
		return webApp;
	}

	public void setWebApp(WebApp webApp) {
		this.webApp = webApp;
	}

	public static class WebApp {
		public WebApp() {

		}

		private List<ServletList> servlet;

		public List<ServletList> getServlet() {
			return servlet;
		}

		public void setServlet(List<ServletList> servlet) {
			this.servlet = servlet;
		}

		@JsonSerialize(include = JsonSerialize.Inclusion.NON_DEFAULT)
		public static class ServletList {
			public ServletList() {
			}

			@JsonProperty("servlet-name")
			private String servletName;

			@JsonProperty("servlet-class")
			private String servletClass;

			public String getServletName() {
				return servletName;
			}

			public void setServletName(String servletName) {
				this.servletName = servletName;
			}

			public String getServletClass() {
				return servletClass;
			}

			public void setServletClass(String servletClass) {
				this.servletClass = servletClass;
			}

			@JsonProperty("init-param")
			private InitParam initParam;

			public InitParam getInitParam() {
				return initParam;
			}

			public void setInitParam(InitParam initParam) {
				this.initParam = initParam;
			}

			@JsonSerialize(include = JsonSerialize.Inclusion.NON_DEFAULT)
			public static class InitParam {

				public InitParam() {

				}

				@JsonProperty("configGlossary:installationAt")
				private String configGlossary;

				@JsonProperty("configGlossary:adminEmail")
				private String configGlossaryAdminEmail;

				@JsonProperty("configGlossary:poweredBy")
				private String configGlossaryPoweredBy;

				@JsonProperty("configGlossary:poweredByIcon")
				private String configGlossaryPoweredByIcon;

				@JsonProperty("configGlossary:staticPath")
				private String configGlossaryStaticPath;

				private String templateProcessorClass;
				private String templateLoaderClass;
				private String templatePath;
				private String templateOverridePath;
				private String defaultListTemplate;
				private String defaultFileTemplate;
				private boolean useJSP;
				private String jspListTemplate;
				private String jspFileTemplate;
				private int cachePackageTagsTrack;
				private int cachePackageTagsStore;
				private int cachePackageTagsRefresh;
				private int cacheTemplatesTrack;
				private int cacheTemplatesStore;
				private int cacheTemplatesRefresh;
				private int cachePagesTrack;
				private int cachePagesStore;
				private int cachePagesRefresh;
				private int cachePagesDirtyRead;
				private String searchEngineListTemplate;
				private String searchEngineFileTemplate;
				private String searchEngineRobotsDb;
				private boolean useDataStore;
				private String dataStoreClass;
				private String redirectionClass;
				private String dataStoreName;
				private String dataStoreDriver;
				private String dataStoreUrl;
				private String dataStoreUser;
				private String dataStorePassword;
				private String dataStoreTestQuery;
				private String dataStoreLogFile;
				private int dataStoreInitConns;
				private int dataStoreMaxConns;
				private int dataStoreConnUsageLimit;
				private String dataStoreLogLevel;
				private int maxUrlLength;
				private String mailHost;
				private String mailHostOverride;
				private int log;
				private String logLocation;
				private String logMaxSize;
				private int dataLog;
				private String dataLogLocation;
				private String dataLogMaxSize;
				private String removePageCache;
				private String removeTemplateCache;
				private String fileTransferFolder;
				private int lookInContext;
				private int adminGroupID;
				private boolean betaServer;

				public String getConfigGlossary() {
					return configGlossary;
				}

				public void setConfigGlossary(String configGlossary) {
					this.configGlossary = configGlossary;
				}

				public String getConfigGlossaryAdminEmail() {
					return configGlossaryAdminEmail;
				}

				public void setConfigGlossaryAdminEmail(String configGlossaryAdminEmail) {
					this.configGlossaryAdminEmail = configGlossaryAdminEmail;
				}

				public String getConfigGlossaryPoweredBy() {
					return configGlossaryPoweredBy;
				}

				public void setConfigGlossaryPoweredBy(String configGlossaryPoweredBy) {
					this.configGlossaryPoweredBy = configGlossaryPoweredBy;
				}

				public String getConfigGlossaryPoweredByIcon() {
					return configGlossaryPoweredByIcon;
				}

				public void setConfigGlossaryPoweredByIcon(String configGlossaryPoweredByIcon) {
					this.configGlossaryPoweredByIcon = configGlossaryPoweredByIcon;
				}

				public String getConfigGlossaryStaticPath() {
					return configGlossaryStaticPath;
				}

				public void setConfigGlossaryStaticPath(String configGlossaryStaticPath) {
					this.configGlossaryStaticPath = configGlossaryStaticPath;
				}

				public String getTemplateProcessorClass() {
					return templateProcessorClass;
				}

				public void setTemplateProcessorClass(String templateProcessorClass) {
					this.templateProcessorClass = templateProcessorClass;
				}

				public String getTemplateLoaderClass() {
					return templateLoaderClass;
				}

				public void setTemplateLoaderClass(String templateLoaderClass) {
					this.templateLoaderClass = templateLoaderClass;
				}

				public String getTemplatePath() {
					return templatePath;
				}

				public void setTemplatePath(String templatePath) {
					this.templatePath = templatePath;
				}

				public String getTemplateOverridePath() {
					return templateOverridePath;
				}

				public void setTemplateOverridePath(String templateOverridePath) {
					this.templateOverridePath = templateOverridePath;
				}

				public String getDefaultListTemplate() {
					return defaultListTemplate;
				}

				public void setDefaultListTemplate(String defaultListTemplate) {
					this.defaultListTemplate = defaultListTemplate;
				}

				public String getDefaultFileTemplate() {
					return defaultFileTemplate;
				}

				public void setDefaultFileTemplate(String defaultFileTemplate) {
					this.defaultFileTemplate = defaultFileTemplate;
				}

				public boolean getUseJSP() {
					return useJSP;
				}

				public void setUseJSP(boolean useJSP) {
					this.useJSP = useJSP;
				}

				public String getJspListTemplate() {
					return jspListTemplate;
				}

				public void setJspListTemplate(String jspListTemplate) {
					this.jspListTemplate = jspListTemplate;
				}

				public String getJspFileTemplate() {
					return jspFileTemplate;
				}

				public void setJspFileTemplate(String jspFileTemplate) {
					this.jspFileTemplate = jspFileTemplate;
				}

				public int getCachePackageTagsTrack() {
					return cachePackageTagsTrack;
				}

				public void setCachePackageTagsTrack(int cachePackageTagsTrack) {
					this.cachePackageTagsTrack = cachePackageTagsTrack;
				}

				public int getCachePackageTagsStore() {
					return cachePackageTagsStore;
				}

				public void setCachePackageTagsStore(int cachePackageTagsStore) {
					this.cachePackageTagsStore = cachePackageTagsStore;
				}

				public int getCachePackageTagsRefresh() {
					return cachePackageTagsRefresh;
				}

				public void setCachePackageTagsRefresh(int cachePackageTagsRefresh) {
					this.cachePackageTagsRefresh = cachePackageTagsRefresh;
				}

				public int getCacheTemplatesTrack() {
					return cacheTemplatesTrack;
				}

				public void setCacheTemplatesTrack(int cacheTemplatesTrack) {
					this.cacheTemplatesTrack = cacheTemplatesTrack;
				}

				public int getCacheTemplatesStore() {
					return cacheTemplatesStore;
				}

				public void setCacheTemplatesStore(int cacheTemplatesStore) {
					this.cacheTemplatesStore = cacheTemplatesStore;
				}

				public int getCacheTemplatesRefresh() {
					return cacheTemplatesRefresh;
				}

				public void setCacheTemplatesRefresh(int cacheTemplatesRefresh) {
					this.cacheTemplatesRefresh = cacheTemplatesRefresh;
				}

				public int getCachePagesTrack() {
					return cachePagesTrack;
				}

				public void setCachePagesTrack(int cachePagesTrack) {
					this.cachePagesTrack = cachePagesTrack;
				}

				public int getCachePagesStore() {
					return cachePagesStore;
				}

				public void setCachePagesStore(int cachePagesStore) {
					this.cachePagesStore = cachePagesStore;
				}

				public int getCachePagesRefresh() {
					return cachePagesRefresh;
				}

				public void setCachePagesRefresh(int cachePagesRefresh) {
					this.cachePagesRefresh = cachePagesRefresh;
				}

				public int getCachePagesDirtyRead() {
					return cachePagesDirtyRead;
				}

				public void setCachePagesDirtyRead(int cachePagesDirtyRead) {
					this.cachePagesDirtyRead = cachePagesDirtyRead;
				}

				public String getSearchEngineListTemplate() {
					return searchEngineListTemplate;
				}

				public void setSearchEngineListTemplate(String searchEngineListTemplate) {
					this.searchEngineListTemplate = searchEngineListTemplate;
				}

				public String getSearchEngineFileTemplate() {
					return searchEngineFileTemplate;
				}

				public void setSearchEngineFileTemplate(String searchEngineFileTemplate) {
					this.searchEngineFileTemplate = searchEngineFileTemplate;
				}

				public String getSearchEngineRobotsDb() {
					return searchEngineRobotsDb;
				}

				public void setSearchEngineRobotsDb(String searchEngineRobotsDb) {
					this.searchEngineRobotsDb = searchEngineRobotsDb;
				}

				public boolean getUseDataStore() {
					return useDataStore;
				}

				public void setUseDataStore(boolean useDataStore) {
					this.useDataStore = useDataStore;
				}

				public String getRedirectionClass() {
					return redirectionClass;
				}

				public void setRedirectionClass(String redirectionClass) {
					this.redirectionClass = redirectionClass;
				}

				public String getDataStoreClass() {
					return dataStoreClass;
				}

				public void setDataStoreClass(String dataStoreClass) {
					this.dataStoreClass = dataStoreClass;
				}

				public String getDataStoreName() {
					return dataStoreName;
				}

				public void setDataStoreName(String dataStoreName) {
					this.dataStoreName = dataStoreName;
				}

				public String getDataStoreDriver() {
					return dataStoreDriver;
				}

				public void setDataStoreDriver(String dataStoreDriver) {
					this.dataStoreDriver = dataStoreDriver;
				}

				public String getDataStoreUrl() {
					return dataStoreUrl;
				}

				public void setDataStoreUrl(String dataStoreUrl) {
					this.dataStoreUrl = dataStoreUrl;
				}

				public String getDataStoreUser() {
					return dataStoreUser;
				}

				public void setDataStoreUser(String dataStoreUser) {
					this.dataStoreUser = dataStoreUser;
				}

				public String getDataStorePassword() {
					return dataStorePassword;
				}

				public void setDataStorePassword(String dataStorePassword) {
					this.dataStorePassword = dataStorePassword;
				}

				public String getDataStoreTestQuery() {
					return dataStoreTestQuery;
				}

				public void setDataStoreTestQuery(String dataStoreTestQuery) {
					this.dataStoreTestQuery = dataStoreTestQuery;
				}

				public String getDataStoreLogFile() {
					return dataStoreLogFile;
				}

				public void setDataStoreLogFile(String dataStoreLogFile) {
					this.dataStoreLogFile = dataStoreLogFile;
				}

				public int getDataStoreInitConns() {
					return dataStoreInitConns;
				}

				public void setDataStoreInitConns(int dataStoreInitConns) {
					this.dataStoreInitConns = dataStoreInitConns;
				}

				public int getDataStoreMaxConns() {
					return dataStoreMaxConns;
				}

				public void setDataStoreMaxConns(int dataStoreMaxConns) {
					this.dataStoreMaxConns = dataStoreMaxConns;
				}

				public int getDataStoreConnUsageLimit() {
					return dataStoreConnUsageLimit;
				}

				public void setDataStoreConnUsageLimit(int dataStoreConnUsageLimit) {
					this.dataStoreConnUsageLimit = dataStoreConnUsageLimit;
				}

				public String getDataStoreLogLevel() {
					return dataStoreLogLevel;
				}

				public void setDataStoreLogLevel(String dataStoreLogLevel) {
					this.dataStoreLogLevel = dataStoreLogLevel;
				}

				public int getMaxUrlLength() {
					return maxUrlLength;
				}

				public void setMaxUrlLength(int maxUrlLength) {
					this.maxUrlLength = maxUrlLength;
				}

				public String getMailHost() {
					return mailHost;
				}

				public void setMailHost(String mailHost) {
					this.mailHost = mailHost;
				}

				public String getMailHostOverride() {
					return mailHostOverride;
				}

				public void setMailHostOverride(String mailHostOverride) {
					this.mailHostOverride = mailHostOverride;
				}

				public int getLog() {
					return log;
				}

				public void setLog(int log) {
					this.log = log;
				}

				public String getLogLocation() {
					return logLocation;
				}

				public void setLogLocation(String logLocation) {
					this.logLocation = logLocation;
				}

				public String getLogMaxSize() {
					return logMaxSize;
				}

				public void setLogMaxSize(String logMaxSize) {
					this.logMaxSize = logMaxSize;
				}

				public int getDataLog() {
					return dataLog;
				}

				public void setDataLog(int dataLog) {
					this.dataLog = dataLog;
				}

				public String getDataLogLocation() {
					return dataLogLocation;
				}

				public void setDataLogLocation(String dataLogLocation) {
					this.dataLogLocation = dataLogLocation;
				}

				public String getDataLogMaxSize() {
					return dataLogMaxSize;
				}

				public void setDataLogMaxSize(String dataLogMaxSize) {
					this.dataLogMaxSize = dataLogMaxSize;
				}

				public String getRemovePageCache() {
					return removePageCache;
				}

				public void setRemovePageCache(String removePageCache) {
					this.removePageCache = removePageCache;
				}

				public String getRemoveTemplateCache() {
					return removeTemplateCache;
				}

				public void setRemoveTemplateCache(String removeTemplateCache) {
					this.removeTemplateCache = removeTemplateCache;
				}

				public String getFileTransferFolder() {
					return fileTransferFolder;
				}

				public void setFileTransferFolder(String fileTransferFolder) {
					this.fileTransferFolder = fileTransferFolder;
				}

				public int getLookInContext() {
					return lookInContext;
				}

				public void setLookInContext(int lookInContext) {
					this.lookInContext = lookInContext;
				}

				public int getAdminGroupID() {
					return adminGroupID;
				}

				public void setAdminGroupID(int adminGroupID) {
					this.adminGroupID = adminGroupID;
				}

				public boolean getBetaServer() {
					return betaServer;
				}

				public void setBetaServer(boolean betaServer) {
					this.betaServer = betaServer;
				}

				@Override
				public String toString() {
					return "InitParam [configGlossary=" + configGlossary + ", configGlossaryAdminEmail=" + configGlossaryAdminEmail
							+ ", configGlossaryPoweredBy=" + configGlossaryPoweredBy + ", configGlossaryPoweredByIcon=" + configGlossaryPoweredByIcon
							+ ", configGlossaryStaticPath=" + configGlossaryStaticPath + ", templateProcessorClass=" + templateProcessorClass
							+ ", templateLoaderClass=" + templateLoaderClass + ", templatePath=" + templatePath + ", templateOverridePath="
							+ templateOverridePath + ", defaultListTemplate=" + defaultListTemplate + ", defaultFileTemplate=" + defaultFileTemplate
							+ ", useJSP=" + useJSP + ", jspListTemplate=" + jspListTemplate + ", jspFileTemplate=" + jspFileTemplate
							+ ", cachePackageTagsTrack=" + cachePackageTagsTrack + ", cachePackageTagsStore=" + cachePackageTagsStore
							+ ", cachePackageTagsRefresh=" + cachePackageTagsRefresh + ", cacheTemplatesTrack=" + cacheTemplatesTrack
							+ ", cacheTemplatesStore=" + cacheTemplatesStore + ", cacheTemplatesRefresh=" + cacheTemplatesRefresh + ", cachePagesTrack="
							+ cachePagesTrack + ", cachePagesStore=" + cachePagesStore + ", cachePagesRefresh=" + cachePagesRefresh + ", cachePagesDirtyRead="
							+ cachePagesDirtyRead + ", searchEngineListTemplate=" + searchEngineListTemplate + ", searchEngineFileTemplate="
							+ searchEngineFileTemplate + ", searchEngineRobotsDb=" + searchEngineRobotsDb + ", useDataStore=" + useDataStore
							+ ", dataStoreClass=" + dataStoreClass + ", redirectionClass=" + redirectionClass + ", dataStoreName=" + dataStoreName
							+ ", dataStoreDriver=" + dataStoreDriver + ", dataStoreUrl=" + dataStoreUrl + ", dataStoreUser=" + dataStoreUser
							+ ", dataStorePassword=" + dataStorePassword + ", dataStoreTestQuery=" + dataStoreTestQuery + ", dataStoreLogFile="
							+ dataStoreLogFile + ", dataStoreInitConns=" + dataStoreInitConns + ", dataStoreMaxConns=" + dataStoreMaxConns
							+ ", dataStoreConnUsageLimit=" + dataStoreConnUsageLimit + ", dataStoreLogLevel=" + dataStoreLogLevel + ", maxUrlLength="
							+ maxUrlLength + ", mailHost=" + mailHost + ", mailHostOverride=" + mailHostOverride + ", log=" + log + ", logLocation="
							+ logLocation + ", logMaxSize=" + logMaxSize + ", dataLog=" + dataLog + ", dataLogLocation=" + dataLogLocation
							+ ", dataLogMaxSize=" + dataLogMaxSize + ", removePageCache=" + removePageCache + ", removeTemplateCache=" + removeTemplateCache
							+ ", fileTransferFolder=" + fileTransferFolder + ", lookInContext=" + lookInContext + ", adminGroupID=" + adminGroupID
							+ ", betaServer=" + betaServer + "]";
				}

			}
		}

		@JsonProperty("servlet-mapping")
		private ServletMapping servletMapping;

		public ServletMapping getServletMapping() {
			return servletMapping;
		}

		public void setServletMapping(ServletMapping servletMapping) {
			this.servletMapping = servletMapping;
		}

		public static class ServletMapping {
			public ServletMapping() {

			}

			private String cofaxCDS;
			private String cofaxEmail;
			private String cofaxAdmin;
			private String fileServlet;
			private String cofaxTools;

			public String getCofaxCDS() {
				return cofaxCDS;
			}

			public void setCofaxCDS(String cofaxCDS) {
				this.cofaxCDS = cofaxCDS;
			}

			public String getCofaxEmail() {
				return cofaxEmail;
			}

			public void setCofaxEmail(String cofaxEmail) {
				this.cofaxEmail = cofaxEmail;
			}

			public String getCofaxAdmin() {
				return cofaxAdmin;
			}

			public void setCofaxAdmin(String cofaxAdmin) {
				this.cofaxAdmin = cofaxAdmin;
			}

			public String getFileServlet() {
				return fileServlet;
			}

			public void setFileServlet(String fileServlet) {
				this.fileServlet = fileServlet;
			}

			public String getCofaxTools() {
				return cofaxTools;
			}

			public void setCofaxTools(String cofaxTools) {
				this.cofaxTools = cofaxTools;
			}

			@Override
			public String toString() {
				return "ServletMapping [cofaxCDS=" + cofaxCDS + ", cofaxEmail=" + cofaxEmail + ", cofaxAdmin=" + cofaxAdmin + ", fileServlet=" + fileServlet
						+ ", cofaxTools=" + cofaxTools + "]";
			}

		}

		private Taglib taglib;

		public Taglib getTaglib() {
			return taglib;
		}

		public void setTaglib(Taglib taglib) {
			this.taglib = taglib;
		}

		public static class Taglib {
			public Taglib() {

			}

			@JsonProperty("taglib-uri")
			private String tagliburi;

			@JsonProperty("taglib-location")
			private String taglibLocation;

			public String getTagliburi() {
				return tagliburi;
			}

			public void setTagliburi(String tagliburi) {
				this.tagliburi = tagliburi;
			}

			public String getTaglibLocation() {
				return taglibLocation;
			}

			public void setTaglibLocation(String taglibLocation) {
				this.taglibLocation = taglibLocation;
			}

			@Override
			public String toString() {
				return "Taglib [tagliburi=" + tagliburi + ", taglibLocation=" + taglibLocation + "]";
			}

		}

		@Override
		public String toString() {
			return "WebApp [servlet=" + servlet + ", servletMapping=" + servletMapping + ", taglib=" + taglib + "]";
		}

	}

	@Override
	public String toString() {
		return "WebAppDto [webApp=" + webApp + "]";
	}
}
