package com.itple.sample.json.xml.domain;

import java.util.List;

import org.simpleframework.xml.Element;
import org.simpleframework.xml.ElementList;
import org.simpleframework.xml.Root;


@Root(name="web-app")
public class WebAppXmlDto {

	public WebAppXmlDto() {
	}

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
	
		@ElementList(inline = true)
		private List<ServletList> servlet;

		
		@Root(name="servlet")
		public static class ServletList{
			
			public ServletList(){
				
			}
			
			@Element(name="servlet-name")
			private String servletName;
			
			@Element(name="servlet-class")
			private String servletClass;

			@ElementList(inline = true, required=false)
			private List<InitParamList> initParam;
			
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

			
			public List<InitParamList> getInitParam() {
				return initParam;
			}

			public void setInitParam(List<InitParamList> initParam) {
				this.initParam = initParam;
			}
			
			@Root(name="init-param")
			public static class InitParamList {

				public InitParamList(){
				
			}
				@Element(name="param-name")
				private String paramName;
				
				@Element(name="param-value", required=false)
				private String paramValue;
		
				
				public String getParamName() {
					return paramName;
				}

				public void setParamName(String paramName) {
					this.paramName = paramName;
				}

				public String getParamValue() {
					return paramValue;
				}

				public void setParamValue(String paramValue) {
					this.paramValue = paramValue;
				}
				@Override
				public String toString() {
					return "InitParamList [paramName=" + paramName + ", paramValue=" + paramValue + "]";
				}
			}
			
			@Override
			public String toString() {
				return "ServletList [servletName=" + servletName + ", servletClass=" + servletClass + ", initParam=" + initParam + "]";
			}
	}
	
		@ElementList(inline = true)
		private List<ServletMappingList> servletMapping;
	
		@Root(name="servlet-mapping")
		public static class ServletMappingList{
			public ServletMappingList(){
				
			}
			
			@Element(name="servlet-name")
			private String servletName;
			
			@Element(name="url-pattern")
			private String urlPattern;

			public String getServletName() {
				return servletName;
			}

			public void setServletName(String servletName) {
				this.servletName = servletName;
			}

			public String getUrlPattern() {
				return urlPattern;
			}

			public void setUrlPattern(String urlPattern) {
				this.urlPattern = urlPattern;
			}

			@Override
			public String toString() {
				return "ServletMappingList [servletName=" + servletName + ", urlPattern=" + urlPattern + "]";
			}
		}
	
		@Element(name="taglib")
		private Taglib taglib;
		
		
		public static class Taglib{
		
			public Taglib() {
			}
			
			@Element(name="taglib-uri")
			private String taglibUri;
			
			@Element(name="taglib-location")
			private String taglibLocation;

			
			public String getTaglibUri() {
				return taglibUri;
			}

			public void setTaglibUri(String taglibUri) {
				this.taglibUri = taglibUri;
			}

			public String getTaglibLocation() {
				return taglibLocation;
			}

			public void setTaglibLocation(String taglibLocation) {
				this.taglibLocation = taglibLocation;
			}

			@Override
			public String toString() {
				return "Taglib [taglibUri=" + taglibUri + ", taglibLocation=" + taglibLocation + "]";
			}
		}		

		@Override
		public String toString() {
			return "WebApp [servlet=" + servlet + ", servletMapping=" + servletMapping + ", taglib=" + taglib + "]";
		}
		
		public List<ServletList> getServlet() {
			return servlet;
		}

		public void setServlet(List<ServletList> servlet) {
			this.servlet = servlet;
		}

		public List<ServletMappingList> getServletMapping() {
			return servletMapping;
		}

		public void setServletMapping(List<ServletMappingList> servletMapping) {
			this.servletMapping = servletMapping;
		}

		public Taglib getTaglib() {
			return taglib;
		}

		public void setTaglib(Taglib taglib) {
			this.taglib = taglib;
		}
	}
	@Override
	public String toString() {
		return "WebAppXmlDto [webApp=" + webApp + "]";
	}
}


