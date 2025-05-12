import { Fragment, memo } from 'react';

import { WindowVirtualizer } from 'virtua';

import { renderPlaceholderImage } from '~/utils';

import { CardCustom, Container } from '~/components/common';
import { CardContent, CardHeader, CardTitle } from '~/components/ui';

export const ExplorePage = memo(() => {
  return (
    <Container className="relative">
      <div className="sticky left-0 top-[var(--header-public)] z-10 -mx-3 mb-6 flex items-center justify-between bg-custom-background px-3">
        <h2 className="font-good-dog-new text-xl">Title</h2>

        <p>Search here</p>
      </div>

      <WindowVirtualizer>
        {[...new Array(100)].map((_, index) => (
          <Fragment key={index}>
            <CardCustom colorStyle="pink">
              <CardHeader>
                <CardTitle>This is Title!</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate tenetur atque nemo suscipit illo neque nesciunt numquam earum. Voluptatibus distinctio excepturi necessitatibus
                  est labore aperiam tenetur non sunt suscipit libero.
                </p>
                <img
                  alt="Random placeholder"
                  src={renderPlaceholderImage({
                    text: 'Banner',
                    width: 900,
                    height: 300
                  })}
                />
              </CardContent>
            </CardCustom>
            <div className="h-6" />
          </Fragment>
        ))}
      </WindowVirtualizer>
    </Container>
  );
});
