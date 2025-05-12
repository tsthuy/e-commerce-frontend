import type { ReactNode } from 'react';
import { Fragment, memo } from 'react';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui';

type LayoutContentProps = {
  breadcrumb?: Array<{ link?: string; label: string }>;
  children: ReactNode;
};

export const ContentAdminLayout = memo(({ breadcrumb, children }: LayoutContentProps) => {
  return (
    <div className="container px-4 pb-8 pt-8 sm:px-8">
      {!!breadcrumb && (
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            {breadcrumb.map((item, index) => (
              <Fragment key={index}>
                {item.link ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={item.link}>{item.label}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
                {index !== breadcrumb.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <motion.div
        animate="visible"
        exit="hidden"
        initial="hidden"
        transition={{ duration: 0.5 }}
        variants={{
          hidden: { opacity: 0, x: 20 },
          visible: { opacity: 1, x: 0 }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
});
