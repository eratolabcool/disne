'use client';

import React, { useState } from 'react';

export default function ContrastTest() {
  const [showTest, setShowTest] = useState(false);

  if (!showTest) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowTest(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
        >
          Test Contrast
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Contrast Test (Light Mode)</h2>
          <button
            onClick={() => setShowTest(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Testing different text colors */}
        <div className="space-y-4">
          {/* Primary text */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Primary Text (should be very dark)</h3>
            <p className="text-xl font-semibold">This text should be clearly visible with high contrast.</p>
            <p className="text-sm normal">Small text should also be readable.</p>
          </div>

          {/* Secondary text */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Secondary Text</h3>
            <p className="text-xl text-secondary">This text uses secondary color with improved contrast.</p>
            <p className="text-sm text-secondary">Small secondary text should be readable.</p>
          </div>

          {/* Muted text */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Muted Text</h3>
            <p className="text-xl text-muted-foreground">This text uses muted color with improved contrast.</p>
            <p className="text-sm text-muted-foreground">Small muted text should be readable.</p>
          </div>

          {/* Button test */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-bold mb-2">Buttons</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2 mb-2">
              Primary Button
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded mb-2">
              Secondary Button
            </button>
            <button className="border border-gray-600 text-gray-800 px-4 py-2 rounded">
              Outline Button
            </button>
          </div>

          {/* Card test */}
          <div className="bg-white p-4 rounded-lg border shadow">
            <h3 className="text-lg font-bold mb-2">Card Test</h3>
            <h4 className="text-xl font-semibold mb-2">Card Title</h4>
            <p className="text-gray-700 mb-2">Card description with good contrast.</p>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-blue-800">Highlighted content should be readable.</p>
            </div>
          </div>

          {/* Navigation test */}
          <nav className="bg-white p-4 rounded-lg border shadow">
            <h3 className="text-lg font-bold mb-4">Navigation Test</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  Navigation Link 1
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  Navigation Link 2
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                  Navigation Link 3
                </a>
              </li>
            </ul>
          </nav>

          {/* Form inputs */}
          <div className="bg-white p-4 rounded-lg border shadow">
            <h3 className="text-lg font-bold mb-4">Form Test</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Text input placeholder"
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                placeholder="Textarea placeholder"
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
              <select className="w-full px-3 py-2 border rounded-md">
                <option>Select option</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>

          {/* Badge test */}
          <div className="bg-white p-4 rounded-lg border shadow">
            <h3 className="text-lg font-bold mb-4">Badge Test</h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Primary Badge
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
              Secondary Badge
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium ml-2">
              Success Badge
            </span>
          </div>

          {/* Small text test */}
          <div className="bg-white p-4 rounded-lg border shadow">
            <h3 className="text-lg font-bold mb-4">Small Text Test</h3>
            <p className="text-xs">This is extra small text that should be readable.</p>
            <p className="text-sm">This is small text that should be readable.</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold mb-2">Contrast Guidelines:</h3>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• WCAG AA requires 4.5:1 contrast ratio for normal text</li>
            <li>• WCAG AAA requires 7:1 contrast ratio for large text</li>
            <li>• Ensure all text is clearly visible against its background</li>
            <li>• Test in both light and dark modes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}