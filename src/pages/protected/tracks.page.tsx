import { memo } from 'react';

export const TracksPage = memo(() => {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Track Orders</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-gray-600">Track your order status here.</p>
      </div>
    </div>
  );
});
