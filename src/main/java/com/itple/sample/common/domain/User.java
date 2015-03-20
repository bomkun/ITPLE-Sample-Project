package com.itple.sample.common.domain;

import org.simpleframework.xml.Element;
import org.simpleframework.xml.Root;

import com.itple.sample.common.transform.XMLBean;


@Root(name="user" )
public class User extends XMLBean{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Element(name="name")
	private String name;
	
	@Element(name="gender")
	private String gender;
	
	@Element(name="email")
	private String email;
	
	@Element(name="phone")
	private String phone;
	
	@Element(name="city")
	private String city;

	public User() {

	} 

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	@Override
	public String toString() {
		return "User [name=" + name + ", gender=" + gender + ", email=" + email + ", phone=" + phone + ", city=" + city + "]";
	}

	
}
