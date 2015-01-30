package com.itple.sample.json.jackson.domain;

import java.util.List;

import org.simpleframework.xml.Attribute;
import org.simpleframework.xml.Element;
import org.simpleframework.xml.ElementList;
import org.simpleframework.xml.Root;


public class MenuDto {

	public MenuDto() {
	}

	private Menu menu;

	public Menu getMenu() {
		return menu;
	}

	public void setMenu(Menu menu) {
		this.menu = menu;
	}
	
	@Root(name = "menu")
	public static class Menu {
		public Menu() {

		}

		@Attribute(name="id")
		private String id;
		
		@Attribute(name="value")
		private String value;
		
		@Element(name ="popup")
		private Popup popup;

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getValue() {
			return value;
		}

		public void setValue(String value) {
			this.value = value;
		}

		public Popup getPopup() {
			return popup;
		}

		public void setPopup(Popup popup) {
			this.popup = popup;
		}

		public static class Popup {
			public Popup() {
			}

			@ElementList(inline = true)
			private List<ItemList> menuitem;

			public List<ItemList> getMenuitem() {
				return menuitem;
			}

			public void setMenuitem(List<ItemList> menuitem) {
				this.menuitem = menuitem;
			}

			@Root(name="menuitem")
			public static class ItemList {

			
				public ItemList() {

				}

				@Attribute(name="value")
				private String value;
				
				@Attribute(name="onclick")
				private String onclick;

				public String getValue() {
					return value;
				}

				public void setValue(String value) {
					this.value = value;
				}

				public String getOnclick() {
					return onclick;
				}

				public void setOnclick(String onclick) {
					this.onclick = onclick;
				}
				
				@Override
				public String toString() {
					return "ItemList [value=" + value + ", onclick=" + onclick + "]";
				}

			}

			@Override
			public String toString() {
				return "Popup [menuitem=" + menuitem + "]";
			}
		
		}

		@Override
		public String toString() {
			return "Menu [id=" + id + ", value=" + value + ", popup=" + popup + "]";
		}


	}

}
