/**
 * xml 메시지 컨버터 
 */
/**
 * @author bomkun
 *
 */
package com.itple.sample.common.transform;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import org.apache.xmlbeans.impl.tool.XMLBean;
import org.simpleframework.xml.core.Persister;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.util.FileCopyUtils;

public class SimpleXmlMessageConverter extends AbstractHttpMessageConverter<Object> {

	private Persister persister = null;

	/*
	 * 생성자
	 * Content-Type에 따라 Converter가 처리할지 정의 
	 */
	
	public SimpleXmlMessageConverter() {
		super(MediaType.APPLICATION_XML, MediaType.TEXT_XML, new MediaType("application","*+xml"), MediaType.ALL);
	}

	// set persister 
	
	public void setPersister(Persister persister) {
		this.persister = persister;
	}

	
	/**
	 * 변환기가 지원되는지 여부를 나타냄
	 * Spring MVC 및 REST Template 에서 외부와 I/O 발생 시 오고나는 객체가 XMLBean 객체를 상속받았을 때 처리 
	 */
	@Override
	protected boolean supports(Class<?> clazz) {
		return XMLBean.class.isAssignableFrom(clazz);
	}


	/**
	 * 외부에서 들어오는 request 요청을 XMLBean 객체로 변환한다 
	 */
	@Override
	protected Object readInternal(Class<? extends Object> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {

		try {
			/*
			 * 요청에 의해 외부로부터 들어오는 요청을 String으로 변환하여 출력한다 
			 * log level = debug
			 */
			
			String readString = null;
			if (logger.isDebugEnabled()) {
				
				Iterator<Entry<String, List<String>>> headIterator  = inputMessage.getHeaders().entrySet().iterator();
				while (headIterator.hasNext()) {
					Entry<java.lang.String , List<java.lang.String>> entry = (Entry<java.lang.String , List<java.lang.String>>) headIterator.next(); 
					
					logger.debug(entry.getKey() + ":" + entry.getValue());
				}
				
				if(inputMessage.getBody() != null) {
					readString = FileCopyUtils.copyToString(new InputStreamReader(inputMessage.getBody(), Charset.forName("UTF-8")));
				}
				
				
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		
		return null;
		
	}

	@Override
	protected void writeInternal(Object t, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
		// TODO Auto-generated method stub
		
	}
	
	
}