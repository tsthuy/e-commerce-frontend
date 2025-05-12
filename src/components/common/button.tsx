import type { ForwardedRef, MouseEvent, ReactNode } from 'react';
import { forwardRef, memo, useCallback, useMemo, useState } from 'react';

import type { LucideIcon } from 'lucide-react';

import { cn } from '~/libs';

import type { ButtonProps as ButtonUIProps } from '~/components/ui';
import { Button as ButtonUI } from '~/components/ui';

import { SpinnerRing } from './spinner';

type BaseProps = {
  children: ReactNode;
  isLoading?: boolean;
  rounded?: boolean;
  roundedCustom?: boolean;
  classNameLoading?: string;
  disableEffectClick?: boolean;
  color?: 'primary' | 'destructive' | 'success' | 'warning' | 'white' | 'black';
} & ButtonUIProps;
type ExpandIconProps = {
  type: 'expandIcon';
  placement: 'left' | 'right';
  icon: LucideIcon;
};
type LineProps = {
  type: 'line';
  placement: 'hide' | 'show';
};
type AnimationProps = {
  animation?: ExpandIconProps | LineProps;
};
type ButtonProps = BaseProps & AnimationProps;
type Ripple = {
  x: number;
  y: number;
  id: number;
};

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>((props: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const { children, isLoading, rounded = false, roundedCustom = false, classNameLoading, animation, className, disableEffectClick, onClick, ...otherProps } = props;

    const [ripples, setRipples] = useState<Array<Ripple>>([]);

    const variant = useMemo(() => `variant--${otherProps.variant ?? 'default'}`, [otherProps.variant]);
    const color = useMemo(() => (!!otherProps.color ? `color--${otherProps.color}` : undefined), [otherProps.color]);
    const size = useMemo(() => `size--${otherProps.size ?? 'default'}`, [otherProps.size]);
    const animationClasses = useMemo(() => (!!animation ? `animation__${animation.type} animation__${animation.type}--${animation.placement}` : undefined), [animation]);
    const combinedClassName = useMemo(
      () =>
        cn('button-custom group', size, variant, color, animationClasses, className, {
          'rounded-full': !!rounded,
          'button-custom__rounded-custom': !!roundedCustom
        }),
      [size, variant, animationClasses, className, rounded, color]
    );
    const isRipple = useMemo(() => !disableEffectClick && otherProps.variant !== 'link', [disableEffectClick, otherProps.variant]);

    const addRipple = useCallback(
      (event: MouseEvent<HTMLButtonElement>): void => {
        if (!isRipple) return;

        const { left, top } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;
        const id = Date.now();
        setRipples((prev) => [...prev, { x, y, id }]);

        setTimeout(() => {
          setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
        }, 1000);
      },
      [isRipple]
    );

    const handleOnClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>): void => {
        addRipple(event);
        onClick?.(event);
      },
      [addRipple, onClick]
    );

    const renderedRipples = useMemo(
      () =>
        isRipple &&
        ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full bg-white/50"
            style={{
              left: ripple.x,
              top: ripple.y
            }}
          />
        )),
      [isRipple, ripples]
    );

    return (
      <ButtonUI ref={ref} className={combinedClassName} type="button" onClick={handleOnClick} {...otherProps}>
        {isLoading && (
          <span className={cn('mr-2 flex size-4 overflow-hidden', { 'mr-0': otherProps.size === 'icon' && isLoading }, classNameLoading)}>
            <SpinnerRing className="!size-4 [&>*]:!stroke-current" />
          </span>
        )}
        {otherProps.size !== 'icon' && !isLoading && !!animation && animation.type === 'expandIcon' && animation.placement === 'left' && (
          <div className="mr-0 h-4 w-0 -translate-x-full opacity-0 transition-all duration-300 ease-in-out group-hover:mr-2 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100">
            <animation.icon className="size-4" />
          </div>
        )}
        {otherProps.size === 'icon' ? <span className={cn('relative inline-flex', { hidden: otherProps.size === 'icon' && isLoading })}>{children}</span> : children}
        {otherProps.size !== 'icon' && !isLoading && !!animation && animation.type === 'expandIcon' && animation.placement === 'right' && (
          <div className="ml-0 h-4 w-0 translate-x-full opacity-0 transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:w-4 group-hover:translate-x-0 group-hover:opacity-100">
            <animation.icon className="size-4" />
          </div>
        )}
        {isRipple && <span className="pointer-events-none absolute inset-0">{renderedRipples}</span>}
      </ButtonUI>
    );
  })
);
