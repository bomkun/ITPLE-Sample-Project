package com.itple.sample.json.xml.domain;

import org.simpleframework.xml.Attribute;
import org.simpleframework.xml.Element;
import org.simpleframework.xml.Root;

@Root(name = "SimpleTest")
public class SimpleTest {

	public SimpleTest() {

	}

	@Element(name = "example")
	private TestClass testClass;

	public TestClass getTestClass() {
		return testClass;
	}

	public void setTestClass(TestClass testClass) {
		this.testClass = testClass;
	}

	public static class TestClass {
		public TestClass() {

		}

		@Element(name = "example")
		private Example example;

		public Example getExample() {
			return example;
		}

		public void setExample(Example example) {
			this.example = example;
		}

		public static class Example {
			public Example() {

			}

			@Element(name = "text")
			private String text;

			@Attribute(name = "index")
			private int index;

			public Example(String text, int index) {
				this.text = text;
				this.index = index;
			}

			public void setText(String text) {
				this.text = text;
			}

			public void setIndex(int index) {
				this.index = index;
			}

			public String getText() {
				return text;
			}

			public int getIndex() {
				return index;
			}

			@Override
			public String toString() {
				return "Example [text=" + text + ", index=" + index + "]";
			}

		}
	}
	
	@Override
	public String toString() {
		return "SimpleTest [testClass=" + testClass + "]";
	}

}
