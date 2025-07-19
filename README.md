# Recurring Date Picker for Next.js

A flexible and reusable React component for selecting recurring dates, inspired by scheduling features in apps like TickTick. Built with Next.js, TypeScript, and Tailwind CSS.

![Recurring Date Picker Demo](https://via.placeholder.com/800x500.png?text=Recurring+Date+Picker+Demo)

## Features

- 🗓️ Multiple recurrence patterns: Daily, Weekly, Monthly, Yearly
- ⚙️ Customizable intervals (e.g., every 2 weeks, every 3 months)
- 📅 Day of week selection for weekly patterns
- 🗓️ Advanced monthly patterns (e.g., "The second Tuesday of every month")
- 📆 Date range selection with start and optional end date
- 👀 Visual calendar preview of selected dates
- 🎨 Responsive design with Tailwind CSS
- 🧪 Comprehensive test coverage with Jest and React Testing Library

## Installation

```bash
npm install recurring-date-picker
# or
yarn add recurring-date-picker
# or
pnpm add recurring-date-picker
```

## Usage

```tsx
'use client';

import { useState } from 'react';
import { RecurringDatePicker } from 'recurring-date-picker';

export default function MyComponent() {
  const [recurrence, setRecurrence] = useState(null);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Schedule Recurring Event</h1>
      <RecurringDatePicker 
        value={recurrence}
        onChange={setRecurrence}
      />
      
      {recurrence && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Recurrence Rule</h2>
          <pre className="text-sm bg-white p-4 rounded overflow-x-auto">
            {JSON.stringify(recurrence, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `object` | No | The current recurrence rule object |
| `onChange` | `(rule: object) => void` | No | Callback when the recurrence rule changes |
| `className` | `string` | No | Additional CSS class for the root element |

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the component in the browser.

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## Building for Production

```bash
npm run build
# or
yarn build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
