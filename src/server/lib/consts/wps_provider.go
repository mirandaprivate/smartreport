package consts

const (
	ImageURLPrefix          = FilePrefix + ImagePart
	ReportURLPrefix         = FilePrefix + ReportPart
	ReportTemplateURLPrefix = FilePrefix + ReportTemplatePart
	ExcelURLPrefix          = FilePrefix + ExcelPart
	FilePrefix              = "/saas/gin/v1/file"
	ImagePart               = "/img"
	ReportPart              = "/word"
	ReportTemplatePart      = "/word-template"
	ExcelPart               = "/excel"
	WpsProviderPrefix       = "/saas/gin/v1/3rd"
)
