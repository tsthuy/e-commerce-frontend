// import { InputHTMLAttributes, memo } from 'react';

// import dynamic from 'next/dynamic';

// import { InputProps } from '~/types';

// import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui';

// const CustomCKEditor = dynamic(() => import('~/components/form/ckeditor'), { ssr: false });

// type CustomEditorProps = Partial<InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>> & InputProps;

// export const CustomEditor = memo(
//   ({
//     name,
//     label,
//     description,
//     className = '',
//     classNameLabel = '',
//     classNameInput = '',
//     classNameDescription = '',
//     classNameErrorMessage = '',
//     isRequired = false,
//     isShowErrorMessage = true,
//     ...otherProps
//   }: CustomEditorProps) => {
//     return (
//       <FormField
//         name={name}
//         render={({ field }) => (
//           <FormItem className={`form-item--wrapper ${className}`}>
//             {label && (
//               <FormLabel className={`form-label--wrapper ${classNameLabel}`}>
//                 {label} {isRequired && <span>*</span>}
//               </FormLabel>
//             )}
//             <FormControl className={`form-control--wrapper custom-editor ${classNameInput}`}>
//               <CustomCKEditor
//                 initData={field.value || ''}
//                 onChange={(value) => {
//                   field.onChange(value);
//                 }}
//                 {...otherProps}
//               />
//             </FormControl>
//             {description && <FormDescription className={`form-description--wrapper ${classNameDescription}`}>{description}</FormDescription>}
//             {isShowErrorMessage && <FormMessage className={`form-message--wrapper ${classNameErrorMessage}`} />}
//           </FormItem>
//         )}
//       />
//     );
//   }
// );
