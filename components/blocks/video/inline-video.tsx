export default function InlineVideo() {
  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Watch Disney Solitaire</h2>
          <p className="text-lg text-gray-600">
            Experience the magic of Disney cards
          </p>
        </div>

        {/* 直接使用iframe，没有任何复杂逻辑 */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src="https://www.youtube.com/embed/JfVOs4VSpmA"
            title="Disney Solitaire Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl"
          />
        </div>

        {/* 备用图片 */}
        <div className="mt-8 text-center">
          <img
            src="/imgs/disney/Image-01.jpg"
            alt="Disney Solitaire Game"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}