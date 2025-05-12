// import { ChangeEvent, memo, useRef } from 'react';

// import { CKEditor } from '@ckeditor/ckeditor5-react';
// // eslint-disable-next-line import/named
// import { FileLoader, UploadAdapter } from '@ckeditor/ckeditor5-upload';

// import { AnyType } from '~/types';

// import { generalApi } from '~/services';

// import EditorCustom from '~/components/ckeditor5';

// type CustomCKEditorProps = {
//   onChange: (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
//   initData?: string;
//   hasError?: boolean;
//   disabled?: boolean;
//   placeholder?: string;
// };

// const toolbarConfig = {
//   items: [
//     'undo',
//     'redo',
//     '|',
//     'heading',
//     '|',
//     'fontfamily',
//     'fontColor',
//     'fontBackgroundColor',
//     '|',
//     'bold',
//     'italic',
//     'underline',
//     '|',
//     'alignment',
//     'blockQuote',
//     '|',
//     'link',
//     'insertTable',
//     'insertImage',
//     '|',
//     'bulletedList',
//     'numberedList'
//   ],
//   shouldNotGroupWhenFull: true
// };

// class MyUploadAdapter {
//   private loader: FileLoader;

//   constructor(loader: FileLoader) {
//     this.loader = loader;
//   }

//   async uploadRequest(file: File) {
//     try {
//       const { data } = await generalApi.normalPresignedLink({ file_name: file.name, file_type: 'image' });
//       if (!data.url) {
//         return {
//           url: ''
//         };
//       }
//       const response = await generalApi.uploadFile({ uploadUrl: `${data.url}`, file });
//       if (response.status > 300) {
//         return {
//           url: ''
//         };
//       }
//       return {
//         url: `${import.meta.env.VITE_STORAGE_URL}/${data.key}`,
//         name: file.name
//       };
//     } catch (error) {
//       return {
//         url: ''
//       };
//     }
//   }

//   upload() {
//     return this.loader.file.then(
//       (file) =>
//         new Promise(async (resolve, reject) => {
//           if (!file) {
//             reject('No file to upload');
//             return;
//           }
//           const result = await this.uploadRequest(file);
//           if (!result.url) {
//             reject('Cannot upload file');
//             return;
//           }
//           resolve({
//             default: result.url
//           });
//         })
//     );
//   }
// }

// function MyCustomUploadAdapterPlugin(editor: EditorCustom) {
//   editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
//     return new MyUploadAdapter(loader as AnyType) as UploadAdapter;
//   };
// }

// const CustomCKEditor = ({ onChange, initData = '', disabled, placeholder }: CustomCKEditorProps) => {
//   const editorRef = useRef<EditorCustom | undefined>();

//   const onReady = (editor: EditorCustom) => {
//     if (editor.ui && editor.ui.view.toolbar.element && editor?.ui?.getEditableElement()) {
//       editor.ui.getEditableElement()?.parentElement?.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement() as Node);
//     }
//     editorRef.current = editor;
//   };

//   const onError = (_: Error, { willEditorRestart }: AnyType) => {
//     if (willEditorRestart) {
//       editorRef.current?.ui.view.toolbar.element?.remove();
//     }
//   };

//   const onChangeData = (_: AnyType, editor: EditorCustom) => {
//     const inputEvent = {
//       target: {
//         value: editor.getData()
//       }
//     } as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
//     onChange(inputEvent);
//   };

//   return (
//     <div className="ckeditor-wrapper">
//       <CKEditor
//         onReady={onReady as AnyType}
//         onError={onError}
//         onChange={onChangeData as AnyType}
//         data={initData}
//         disabled={disabled}
//         editor={EditorCustom as AnyType}
//         config={{
//           toolbar: toolbarConfig,
//           extraPlugins: [MyCustomUploadAdapterPlugin as AnyType],
//           placeholder
//         }}
//       />
//     </div>
//   );
// };

// export default memo(CustomCKEditor);
