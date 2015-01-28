package com.itple.sample.json.xml.domain;

import java.util.List;

import org.simpleframework.xml.Attribute;
import org.simpleframework.xml.Element;
import org.simpleframework.xml.ElementList;
import org.simpleframework.xml.Root;


@Root(name = "glossary")
public class GlossaryXmlDto {

	public GlossaryXmlDto() {

	}

	@Element
	private String title;
	
	@Element(name = "GlossDiv")
	private GlossDiv glossDiv;

	public static class GlossDiv {
		public GlossDiv() {
		}

		@Element
		private String title;

		@Element(name = "GlossList")
		private GlossList glossList;

		public static class GlossList {

			public GlossList() {

			}

			@Element(name = "GlossEntry")
			private GlossEntry glossEntry;

			public static class GlossEntry {

				public GlossEntry() {

				}

				@Attribute(name = "ID")
				private String id;

				@Attribute(name = "SortAs")
				private String sortAs;

				@Element(name = "GlossTerm")
				private String glossTerm;

				@Element(name = "Acronym")
				private String acronym;

				@Element(name = "Abbrev")
				private String abbrev;
				
				public String getId() {
					return id;
				}

				public void setId(String id) {
					this.id = id;
				}

				public String getSortAs() {
					return sortAs;
				}

				public void setSortAs(String sortAs) {
					this.sortAs = sortAs;
				}

				public String getGlossTerm() {
					return glossTerm;
				}

				public void setGlossTerm(String glossTerm) {
					this.glossTerm = glossTerm;
				}

				public String getAcronym() {
					return acronym;
				}

				public void setAcronym(String acronym) {
					this.acronym = acronym;
				}

				public String getAbbrev() {
					return abbrev;
				}

				public void setAbbrev(String abbrev) {
					this.abbrev = abbrev;
				}

				@Element(name = "GlossDef")
				private GlossDef glossDef;

				public GlossDef getGlossDef() {
					return glossDef;
				}

				public void setGlossDef(GlossDef glossDef) {
					this.glossDef = glossDef;
				}

				public static class GlossDef {
					
					public GlossDef() {
					}

					@Element
					private String para;

					public String getPara() {
						return para;
					}

					public void setPara(String para) {
						this.para = para;
					}

					@ElementList(inline = true)
					private List<GlossSeeAlso> glossSeeAlso;

			
					@Root(name = "GlossSeeAlso")
					public static class GlossSeeAlso {

						public GlossSeeAlso() {

						}

						@Attribute(name = "OtherTerm")
						private String otherTerm;

						public String getOtherTerm() {
							return otherTerm;
						}

						public void setOtherTerm(String otherTerm) {
							this.otherTerm = otherTerm;
						}

						@Override
						public String toString() {
							return "GlossSeeAlso [otherTerm=" + otherTerm + "]";
						}

					}

					public List<GlossSeeAlso> getGlossSeeAlso() {
						return glossSeeAlso;
					}

					public void setGlossSeeAlso(List<GlossSeeAlso> glossSeeAlso) {
						this.glossSeeAlso = glossSeeAlso;
					}
					
					@Override
					public String toString() {
						return "GlossDef [para=" + para + ", glossSeeAlso=" + glossSeeAlso + "]";
					}

				}

				@ElementList(inline = true)
				private List<GlossSee> glossSee;

				public List<GlossSee> getGlossSee() {
					return glossSee;
				}

				public void setGlossSee(List<GlossSee> glossSee) {
					this.glossSee = glossSee;
				}

				@Root(name = "GlossSee")
				public static class GlossSee {
					public GlossSee() {

					}

					@Attribute(name = "OtherTerm")
					private String otherTerm;

					public String getOtherTerm() {
						return otherTerm;
					}

					public void setOtherTerm(String otherTerm) {
						this.otherTerm = otherTerm;
					}

					@Override
					public String toString() {
						return "GlossSee [otherTerm=" + otherTerm + "]";
					}

				}

				@Override
				public String toString() {
					return "GlossEntry [id=" + id + ", sortAs=" + sortAs + ", glossTerm=" + glossTerm + ", acronym=" + acronym + ", abbrev=" + abbrev
							+ " glossSee=" + glossSee + ", glossDef=" + glossDef + "]";
				}

			}

			public GlossEntry getGlossEntry() {
				return glossEntry;
			}

			public void setGlossEntry(GlossEntry glossEntry) {
				this.glossEntry = glossEntry;
			}

			
			@Override
			public String toString() {
				return "GlossList [glossEntry=" + glossEntry + "]";
			}

		}

		public String getTitle() {
			return title;
		}

		public void setTitle(String title) {
			this.title = title;
		}

		public GlossList getGlossList() {
			return glossList;
		}

		public void setGlossList(GlossList glossList) {
			this.glossList = glossList;
		}
		
		@Override
		public String toString() {
			return "GlossDiv [title=" + title + ", glossList=" + glossList + "]";
		}
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public GlossDiv getGlossDiv() {
		return glossDiv;
	}

	public void setGlossDiv(GlossDiv glossDiv) {
		this.glossDiv = glossDiv;
	}
	
	@Override
	public String toString() {
		return "GlossaryDto [title=" + title + ", glossDiv=" + glossDiv + "]";
	}

}
