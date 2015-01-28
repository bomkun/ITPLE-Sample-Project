package com.itple.sample.json.jackson.domain;

import java.util.Arrays;

import org.codehaus.jackson.annotate.JsonProperty;

public class GlossaryDto {

	public GlossaryDto() {

	}

	private Glossary glossary;

	public Glossary getGlossary() {
		return glossary;
	}

	public void setGlossary(Glossary glossary) {
		this.glossary = glossary;
	}

	public static class Glossary {
		public Glossary() {

		}

		private String title;

		@JsonProperty("GlossDiv")
		private GlossDiv glossDiv;

		public static class GlossDiv {

			public GlossDiv() {
			}

			@JsonProperty("GlossList")
			private GlossList glossList;

			public static class GlossList {
				public GlossList() {

				}

				@JsonProperty("GlossEntry")
				private GlossEntry glossEntry;

				public static class GlossEntry {

					public GlossEntry() {

					}

					@JsonProperty("GlossDef")
					private GlossDef glossDef;

					public static class GlossDef {

						public GlossDef() {

						}

						private String para;

						@JsonProperty("GlossSeeAlso")
						private String[] glossSeeAlso;

						public String getPara() {
							return para;
						}

						public void setPara(String para) {
							this.para = para;
						}

						public String[] getGlossSeeAlso() {
							return glossSeeAlso;
						}

						public void setGlossSeeAlso(String[] glossSeeAlso) {
							this.glossSeeAlso = glossSeeAlso;
						}

						@Override
						public String toString() {
							return "GlossDef [para=" + para + ", glossSeeAlso=" + Arrays.toString(glossSeeAlso) + "]";
						}
					}

					@JsonProperty("ID")
					private String id;

					@JsonProperty("SortAs")
					private String sortAs;

					@JsonProperty("GlossTerm")
					private String glossTerm;

					@JsonProperty("Acronym")
					private String acronym;

					@JsonProperty("Abbrev")
					private String abbrev;

					@JsonProperty("GlossSee")
					private String glossSee;

					public GlossDef getGlossDef() {
						return glossDef;
					}

					public void setGlossDef(GlossDef glossDef) {
						this.glossDef = glossDef;
					}

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

					public String getGlossSee() {
						return glossSee;
					}

					public void setGlossSee(String glossSee) {
						this.glossSee = glossSee;
					}

					@Override
					public String toString() {
						return "GlossEntry [glossDef=" + glossDef + ", id=" + id + ", sortAs=" + sortAs + ", glossTerm=" + glossTerm + ", acronym=" + acronym
								+ ", abbrev=" + abbrev + ", glossSee=" + glossSee + "]";
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

			private String title;

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
				return "GlossDiv [glossList=" + glossList + ", title=" + title + "]";
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
			return "Glossary [title=" + title + ", glossDiv=" + glossDiv + "]";
		}

	}

	@Override
	public String toString() {
		return "GlossaryDto [glossary=" + glossary + "]";
	}

}
