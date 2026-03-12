'use client';

export default function TestVideo() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Watch Our Demo</h2>
        <p className="text-lg text-gray-600">
          See Disney Solitaire in action
        </p>
      </div>

      {/* 静态的iframe - 最简单的方法 */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
        <iframe
          src="https://www.youtube.com/embed/JfVOs4VSpmA"
          title="Disney Solitaire Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
        />
      </div>

      {/* 备用内容 */}
      <div className="mt-6 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
          <img
            src="/imgs/disney/Image-01.jpg"
            alt="Disney Solitaire"
            className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-4"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
          <h3 className="text-xl font-bold mb-2">Disney Solitaire</h3>
          <p className="text-gray-600 mb-4">
            Magic awaits in every card!
          </p>
        </div>
      </div>
    </div>
  );
}