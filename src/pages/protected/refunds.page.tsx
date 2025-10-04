import { memo } from 'react';

export const RefundsPage = memo(() => {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Refunds</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-gray-600">Your refund requests will appear here.</p>
      </div>
    </div>
  );
});
