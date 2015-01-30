package com.itple.sample.json.jackson.domain;

import java.util.List;

import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.simpleframework.xml.Attribute;
import org.simpleframework.xml.Element;
import org.simpleframework.xml.ElementList;
import org.simpleframework.xml.Root;
import org.simpleframework.xml.Text;

public class SvgDto {

	private Menu menu;
	
	public Menu getMenu() {
		return menu;
	}

	public void setMenu(Menu menu) {
		this.menu = menu;
	}

	@Root(name="menu")
	public static class Menu {
		public Menu() {

		}

		@Element(name="header")
		private String header;

		@ElementList(inline=true)
		private List<ItemList> items;

		public String getHeader() {
			return header;
		}

		public void setHeader(String header) {
			this.header = header;
		}

		public List<ItemList> getItems() {
			return items;
		}

		public void setItems(List<ItemList> items) {
			this.items = items;
		}

		@JsonSerialize(include = JsonSerialize.Inclusion.NON_DEFAULT)
		@Root(name="item")
		public static class ItemList {

			@Attribute(name="id")
			private String id;
			
			@Attribute(name="action")
			private String label;
		
			@Text
			private String labelText;
			
			public String getId() {
				return id;
			}

			public void setId(String id) {
				this.id = id;
			}

			public String getLabel() {
				return label;
			}

			public void setLabel(String label) {
				this.label = label;
		
			}

			public String getlabelText() {
				return labelText;
			}

			public void setlabelText(String labelText) {
				this.labelText = labelText;
			}


	@Override
			public String toString() {
				return "ItemList [id=" + id + ", label=" + label + "]";
			}
		}

		@Override
		public String toString() {
			return "Menu [header=" + header + ", items=" + items + "]";
		}

	}

}
