export default function FinalVideo() {
  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Watch Disney Solitaire
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the magic of Disney cards in this enchanting solitaire adventure
          </p>
        </div>

        {/* 视频容器 - 使用简单的div包装iframe */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200">
          <div style={{ paddingBottom: '56.25%', position: 'relative' }}>
            <iframe
              src="https://www.youtube.com/embed/JfVOs4VSpmA?autoplay=0&rel=0&modestbranding=1"
              title="Disney Solitaire Gameplay Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              style={{
                border: 'none',
                borderRadius: '0.5rem'
              }}
            />
          </div>
        </div>

        {/* 游戏图片和CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
          <div className="text-center">
            <img
              src="/imgs/disney/Image-01.jpg"
              alt="Disney Solitaire Game Screenshot"
              className="w-full max-w-3xl mx-auto rounded-lg shadow-xl mb-6 object-cover"
              style={{ maxHeight: '400px' }}
            />
            <h3 className="text-2xl font-bold mb-3">Ready to Play?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join thousands of players enjoying Disney Solitaire! Collect cards, solve puzzles, and experience the magic.
            </p>
            <button
              onClick={() => {
                // 尝试跳转到游戏页面
                window.location.href = 'https://www.superplay.co/games/disney-solitaire/';
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              Play Game Now
            </button>
          </div>
        </div>

        {/* 功能亮点 */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-3">🎴</div>
            <h4 className="font-bold mb-2">Disney Characters</h4>
            <p className="text-gray-600 text-sm">Play with your favorite Disney characters</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-bold mb-2">Easy to Learn</h4>
            <p className="text-gray-600 text-sm">Classic solitaire with a magical twist</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="text-3xl mb-3">✨</div>
            <h4 className="font-bold mb-2">Magical Graphics</h4>
            <p className="text-gray-600 text-sm">Beautiful Disney-themed card designs</p>
          </div>
        </div>
      </div>
    </div>
  );
}