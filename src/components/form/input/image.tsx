import type { InputHTMLAttributes, ReactNode } from 'react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

import { UploadIcon, XIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { AnyType, InputEvent } from '~/types';

import { cn } from '~/libs';

import { arrayToFileList, getLinkStorage, handleInputError } from '~/utils';

import { Button, ImageLightbox, Tooltip } from '~/components/common';
import {
  CustomFormDescription,
  CustomFormInputWrapper,
  CustomFormLabel,
  CustomFormMessage,
  type CustomFormControlProps,
  type CustomFormDescriptionProps,
  type CustomFormLabelProps,
  type CustomFormMessageProps
} from '~/components/form';
import { FormField, FormItem, Input } from '~/components/ui';

type CustomInputImageProps = Partial<InputHTMLAttributes<HTMLInputElement>> & {
  name: string;
  id?: string;
  className?: HTMLDivElement['className'];
  isRequired?: boolean;
} & {
  classNameInput?: CustomFormControlProps['className'];
} & {
  label?: CustomFormLabelProps['label'];
  labelStyle?: CustomFormLabelProps['style'];
  classNameLabel?: CustomFormLabelProps['className'];
} & {
  description?: CustomFormDescriptionProps['description'];
  classNameDescription?: CustomFormDescriptionProps['className'];
} & {
  isHiddenErrorMessage?: boolean;
  classNameErrorMessage?: CustomFormMessageProps['className'];
} & {
  multiple?: boolean;
  defaultValue?: Array<string>;
  placeholder?: ReactNode;
  accept?: InputHTMLAttributes<HTMLInputElement>['accept'];
  isFull?: boolean;
  subPlaceholder?: string;
};

export const CustomInputImage = memo((props: CustomInputImageProps) => {
  const {
    name,
    id,
    className,
    classNameInput,
    isRequired,
    //
    label,
    labelStyle = 'normal',
    classNameLabel,
    //
    description,
    classNameDescription,
    //
    isHiddenErrorMessage = false,
    classNameErrorMessage,
    //
    multiple = false,
    defaultValue,
    placeholder,
    accept,
    isFull,
    subPlaceholder,
    ...otherProps
  } = props;
  const { formState, setValue, clearErrors } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [fileUpload, setFileUpload] = useState<Array<File>>([]);

  const { readOnly, disabled } = otherProps;

  const hasError = handleInputError(name, formState.errors);
  const formItemClassName = useMemo(() => (labelStyle !== 'normal' ? `custom-form-item--${labelStyle}` : ''), [labelStyle]);

  useEffect(() => {
    if (hasError && fileInputRef.current) {
      fileInputRef.current.focus();
    }
  }, [hasError]);

  useEffect(() => {
    if (defaultValue && defaultValue.length > 0) {
      setUploadedImages(defaultValue);
      setFileUpload(defaultValue as AnyType);
    }
  }, [defaultValue]);

  const handleFileChange = (event: InputEvent): void => {
    const files = event.target.files;
    if (files) {
      if (multiple) {
        setFileUpload((prev) => [...prev, ...Array.from(files)]);
        const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
        setUploadedImages((prev) => [...prev, ...newImages]);
      } else {
        setFileUpload(Array.from(files));
        const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
        setUploadedImages(newImages);
      }
    }
  };

  const handleDeleteImage = (index: number): void => {
    const fileInputItem = fileInputRef.current as AnyType;

    const newFileList = [...fileUpload];
    newFileList.splice(index, 1);

    let flag: number = -1;
    newFileList.map((item, index) => {
      if (typeof item === 'string') flag = index;
    });

    const fileListTemp = arrayToFileList(newFileList.slice(flag + 1));
    fileInputItem.files = fileListTemp;

    setFileUpload(newFileList);
    setUploadedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  useEffect(() => {
    setValue(name, fileUpload);
    if (fileUpload.length > 0) clearErrors(name);
  }, [fileUpload]);

  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className={cn('custom-form-item__wrapper', formItemClassName, { group: labelStyle === 'dynamic', 'h-full': isFull }, className)}>
          <CustomFormLabel className={classNameLabel} isRequired={isRequired} label={label} name={name} style={labelStyle} />
          <CustomFormInputWrapper className={cn({ 'h-full': isFull })} readOnly={otherProps.readOnly}>
            <div
              className={cn(
                'custom-form-control__upload-image',
                {
                  'cursor-no-drop': readOnly,
                  '!border-destructive': hasError,
                  'h-full !p-0': isFull
                },
                classNameInput
              )}
            >
              {uploadedImages.length > 0 && (
                <div
                  className={cn('flex w-full flex-wrap gap-4 py-2', {
                    'justify-center': !multiple,
                    'h-full w-full !py-0': isFull
                  })}
                >
                  {uploadedImages.map((item, index) => (
                    <figure key={index} className={cn('relative z-[2] flex items-center justify-center', { 'h-full w-full': isFull })}>
                      <ImageLightbox
                        isFull
                        alt={item}
                        className={cn('aspect-square size-full overflow-hidden rounded-sm border !object-cover !object-center', { '!size-20': !isFull })}
                        classNameInner="rounded-sm"
                        src={item.includes('blob') ? item : getLinkStorage(item)}
                      />
                      <Tooltip content="Remove">
                        <Button
                          disabled={disabled}
                          type="button"
                          variant="destructive"
                          className={cn('!absolute right-0 top-0 flex !size-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full p-0', {
                            hidden: readOnly
                          })}
                          onClick={() => handleDeleteImage(index)}
                        >
                          <XIcon className="size-3" />
                        </Button>
                      </Tooltip>
                    </figure>
                  ))}
                </div>
              )}
              <div
                className={cn('custom-form-control__upload-image--inner flex flex-col items-center justify-center text-center', {
                  'opacity-50': disabled,
                  '!invisible !h-0 !overflow-hidden !p-0 !opacity-0': uploadedImages.length > 0 && !multiple,
                  'h-full': isFull
                })}
              >
                <span className="mt-4 flex size-10 items-center justify-center rounded-full bg-muted">
                  <UploadIcon
                    className={cn('size-5', {
                      'text-destructive': hasError
                    })}
                  />
                </span>
                {placeholder ?? (
                  <p className="custom-form-control__upload-image--placeholder mb-4">
                    <span
                      className={cn('font-medium text-primary', {
                        'text-destructive': hasError
                      })}
                    >
                      Click here
                    </span>{' '}
                    or drop files here to attach
                  </p>
                )}
                {!!subPlaceholder && <p className="text-xs text-muted-foreground">{subPlaceholder}</p>}
                <Input
                  ref={fileInputRef}
                  accept={accept ?? '.jpg, .png, .jpeg'}
                  disabled={disabled}
                  id={id}
                  multiple={multiple}
                  name={name}
                  readOnly={readOnly}
                  type="file"
                  className={cn('!absolute left-0 top-0 z-[1] !m-0 size-full cursor-pointer !opacity-0', {
                    'z-[-1]': readOnly || disabled
                  })}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </CustomFormInputWrapper>
          <CustomFormDescription className={classNameDescription} description={description} />
          <CustomFormMessage className={classNameErrorMessage} isHidden={isHiddenErrorMessage} />
        </FormItem>
      )}
    />
  );
});
