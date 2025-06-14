/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import { UploadAdapter } from '@ckeditor/ckeditor5-adapter-ckfinder'
import { Alignment } from '@ckeditor/ckeditor5-alignment'
import { Autoformat } from '@ckeditor/ckeditor5-autoformat'
import { Bold, Italic, Underline } from '@ckeditor/ckeditor5-basic-styles'
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote'
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services'
import type { EditorConfig } from '@ckeditor/ckeditor5-core'
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ckeditor/ckeditor5-font'
import { Heading } from '@ckeditor/ckeditor5-heading'
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support'
import { AutoImage, Image, ImageCaption, ImageInsert, ImageResize, ImageStyle, ImageToolbar, ImageUpload } from '@ckeditor/ckeditor5-image'
import { Indent } from '@ckeditor/ckeditor5-indent'
import { Link, LinkImage } from '@ckeditor/ckeditor5-link'
import { List } from '@ckeditor/ckeditor5-list'
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office'
import { Table, TableCaption, TableCellProperties, TableColumnResize, TableToolbar } from '@ckeditor/ckeditor5-table'
import { TextTransformation } from '@ckeditor/ckeditor5-typing'
import { Undo } from '@ckeditor/ckeditor5-undo'

declare class Editor extends ClassicEditor {
  static builtinPlugins: (
    | typeof Alignment
    | typeof AutoImage
    | typeof Autoformat
    | typeof BlockQuote
    | typeof Bold
    | typeof CloudServices
    | typeof Essentials
    | typeof FontBackgroundColor
    | typeof FontColor
    | typeof FontFamily
    | typeof FontSize
    | typeof GeneralHtmlSupport
    | typeof Heading
    | typeof Image
    | typeof ImageCaption
    | typeof ImageInsert
    | typeof ImageResize
    | typeof ImageStyle
    | typeof ImageToolbar
    | typeof ImageUpload
    | typeof Indent
    | typeof Italic
    | typeof Link
    | typeof LinkImage
    | typeof List
    | typeof MediaEmbed
    | typeof Paragraph
    | typeof PasteFromOffice
    | typeof Table
    | typeof TableCaption
    | typeof TableCellProperties
    | typeof TableColumnResize
    | typeof TableToolbar
    | typeof TextTransformation
    | typeof Underline
    | typeof Undo
    | typeof UploadAdapter
  )[]
  static defaultConfig: EditorConfig
}
export default Editor
