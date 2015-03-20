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
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;
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
	 * Spring MVC 및 REST Template 에서 외부와 I/O 발생 시 오고가는 객체가 XMLBean 객체를 상속받았을 때 처리 
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
					logger.debug("read String" + readString);
				}
				readString = readString.replaceAll("\n", "");
				
				/*
				 * 데이터 포맷 , ResitryMatcher 
				 * DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				RegistryMatcher registryMatcher = new RegistryMatcher();
				registryMatcher.bind(Date.class, new DateFormatTransformer(dateFormat));
				Serializer serializer = new Persister(registryMatcher);
				return serializer.read(clazz, readString);*/
				
				return persister.read(clazz, readString);
				
			} else {
				if (inputMessage.getBody() != null) {
					readString = FileCopyUtils.copyToString(new InputStreamReader(inputMessage.getBody(), Charset.forName("UTF-8")));
					logger.debug("read String " + readString);
				}
				readString = readString.replaceAll("\n", "");
				
				/*
				 * 데이터 포맷 , ResitryMatcher 
				 * DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				RegistryMatcher registryMatcher = new RegistryMatcher();
				registryMatcher.bind(Date.class, new DateFormatTransformer(dateFormat));
				Serializer serializer = new Persister(registryMatcher);
				return serializer.read(clazz, readString);*/
			
				return persister.read(clazz, readString);
			}
			
		} catch (Exception e) { //변환 실패 시
			logger.error(e);
			/*
			 * 요청 데이터가 있으면 어떤 내용으로 에러났는지 출력 처리
			 * 
			 */
			
			if (inputMessage.getBody() != null && inputMessage.getBody().markSupported()) {
				inputMessage.getBody().reset();
				logger.error(FileCopyUtils.copyToString(new InputStreamReader(inputMessage.getBody(), "UTF-8")));
			} else {
				logger.error("input stream is nullor printed ..");
			}
			
			throw new HttpMessageNotReadableException(e.getMessage()); //규격에 의해 Exception을 던진다 
		}
	}
	
	/**
	 * 외부로 보낸 객체를 XML로 변환 처리 한다 
	 * 
	 */
	@Override
	protected void writeInternal(Object t, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
		
		try {
			
			StringWriter writer = new StringWriter();
			
			/*
			 *  데이터 포맷 , ResitryMatcher 
			 *  DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			RegistryMatcher registryMatcher = new RegistryMatcher();
			registryMatcher.bind(Date.class, new DateFormatTransformer(dateFormat));
			Format xmlHeader = new Format("<?xml version=\"1.0\" encoding= \"UTF-8\" ?>"); 	
			Serializer serializer = new Persister(registryMatcher, xmlHeader);
			serializer.write(t, writer);*/
			
			persister.write(t, writer);
			
			if(logger.isDebugEnabled()) {
				logger.debug("t : " + t);
			}

			logger.debug(writer.toString());
			
			//전송시 xml을 /n -> \r\n으로 변경 
			outputMessage.getBody().write(writer.toString().replaceAll("\n", "\r\n").getBytes("UTF-8"));
			
		} catch (Exception e) {
			logger.error(outputMessage.getBody());
			logger.error(e);
			throw new HttpMessageNotReadableException(e.getMessage()); //규격에 의해 Exception을 던진다 
		}
	}
	
	
}