package com.itple.sample.common.domain;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name="user")
public class User {

	@XmlElement(name="name")
	private String name;
	
	@XmlElement(name="gender")
	private String gender;
	
	@XmlElement(name="email")
	private String email;
	
	@XmlElement(name="phone")
	private String phone;
	
	@XmlElement(name="city")
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
