package com.itple.sample.json.jackson.domain;

import org.simpleframework.xml.Attribute;
import org.simpleframework.xml.Element;
import org.simpleframework.xml.Root;

public class WidgetDto {

	public WidgetDto() {
	}

	public Widget getWidget() {
		return widget;
	}

	public void setWidget(Widget widget) {
		this.widget = widget;
	}


	private Widget widget;
	
	@Root(name="widget")
	public static class Widget {
		public Widget() {

		}

		@Element(name="debug")
		private String debug;
		
		@Element(name="window")
		private Window window;
		
		@Element(name="image")
		private Image image;
		
		@Element(name="text")
		private Text text;

		public String getDebug() {
			return debug;
		}

		public void setDebug(String debug) {
			this.debug = debug;
		}

		public Window getWindow() {
			return window;
		}

		public void setWindow(Window window) {
			this.window = window;
		}

		public Image getImage() {
			return image;
		}

		public void setImage(Image image) {
			this.image = image;
		}

		public Text getText() {
			return text;
		}

		public void setText(Text text) {
			this.text = text;
		}

		
		public static class Window {
			public Window() {

			}

			@Attribute(name="title")
			private String title;
			
			@Element(name="name")
			private String name;
			
			@Element(name="width")
			private int width;
			
			@Element(name="height")
			private int height;

			public String getTitle() {
				return title;
			}

			public void setTitle(String title) {
				this.title = title;
			}

			public String getName() {
				return name;
			}

			public void setName(String name) {
				this.name = name;
			}

			public int getWidth() {
				return width;
			}

			public void setWidth(int width) {
				this.width = width;
			}

			public int getHeight() {
				return height;
			}

			public void setHeight(int height) {
				this.height = height;
			}

			@Override
			public String toString() {
				return "Window [title=" + title + ", name=" + name + ", width=" + width + ", height=" + height + "]";
			}
		}

		public static class Image {
			public Image() {

			}

			@Attribute(name="src")
			private String src;

			@Attribute(name="name")
			private String name;
			
			@Element(name="hOffset")
			private int hOffset;
			
			@Element(name="vOffset")
			private int vOffset;
			
			@Element(name="alignment")
			private String alignment;

			public String getSrc() {
				return src;
			}

			public void setSrc(String src) {
				this.src = src;
			}

			public String getName() {
				return name;
			}

			public void setName(String name) {
				this.name = name;
			}

			public int gethOffset() {
				return hOffset;
			}

			public void sethOffset(int hOffset) {
				this.hOffset = hOffset;
			}

			public int getvOffset() {
				return vOffset;
			}

			public void setvOffset(int vOffset) {
				this.vOffset = vOffset;
			}

			public String getAlignment() {
				return alignment;
			}

			public void setAlignment(String alignment) {
				this.alignment = alignment;
			}

			@Override
			public String toString() {
				return "Image [src=" + src + ", name=" + name + ", hOffset=" + hOffset + ", vOffset=" + vOffset + ", alignment=" + alignment + "]";
			}

		}

		public static class Text {
			public Text() {
			}

			@Attribute(name="data")
			private String data;
			
			@Attribute(name="size")
			private int size;
			
			@Attribute(name="style")
			private String style;
			
			@Element(name="name")
			private String name;
			
			@Element(name="hOffset")
			private int hOffset;
			
			@Element(name="vOffset")
			private int vOffset;
			
			@Element(name="alignment")
			private String alignment;
			
			@Element(name="onMouseUp")
			private String onMouseUp;

			public String getData() {
				return data;
			}

			public void setData(String data) {
				this.data = data;
			}

			public int getSize() {
				return size;
			}

			public void setSize(int size) {
				this.size = size;
			}

			public String getStyle() {
				return style;
			}

			public void setStyle(String style) {
				this.style = style;
			}

			public String getName() {
				return name;
			}

			public void setName(String name) {
				this.name = name;
			}

			public int gethOffset() {
				return hOffset;
			}

			public void sethOffset(int hOffset) {
				this.hOffset = hOffset;
			}

			public int getvOffset() {
				return vOffset;
			}

			public void setvOffset(int vOffset) {
				this.vOffset = vOffset;
			}

			public String getAlignment() {
				return alignment;
			}

			public void setAlignment(String alignment) {
				this.alignment = alignment;
			}

			public String getOnMouseUp() {
				return onMouseUp;
			}

			public void setOnMouseUp(String onMouseUp) {
				this.onMouseUp = onMouseUp;
			}

			@Override
			public String toString() {
				return "Text [data=" + data + ", size=" + size + ", style=" + style + ", name=" + name + ", hOffset=" + hOffset + ", vOffset=" + vOffset
						+ ", alignment=" + alignment + ", onMouseUp=" + onMouseUp + "]";
			}

		}

		@Override
		public String toString() {
			return "Widget [debug=" + debug + ", window=" + window + ", image=" + image + ", text=" + text + "]";
		}

		
	}

	@Override
	public String toString() {
		return "WidgetDto [widget=" + widget + "]";
	}

}
