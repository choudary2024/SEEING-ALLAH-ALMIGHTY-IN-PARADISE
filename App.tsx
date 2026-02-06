
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  getReflection, 
  generateHeavenlyScene, 
  generateSpeech, 
  decodeBase64, 
  decodeAudioData 
} from './services/geminiService';
import { Reflection, GeneratedImage } from './types';

const App: React.FC = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const ayahArabic = "لِلَّذِينَ أَحْسَنُوا الْحُسْنَىٰ وَزِيَادَةٌ ۖ وَلَا يَرْهَقُ وُجُوهَهُمْ قَتَرٌ وَلَا ذِلَّةٌ ۚ أُولَٰئِكَ أَصْحَابُ الْجَنَّةِ ۖ هُمْ فِيهَا خَالِدُونَ";
  const ayahEnglish = "For those who have done good is the best (reward, i.e. Paradise) and even more (i.e. having the honour of glancing at the Countenance of Allāh). Neither darkness nor dust nor any humiliating disgrace shall cover their faces. They are the dwellers of Paradise, they will abide therein forever.";
  const hadithText = "When the people of Paradise enter Paradise, Allāh will say, ‘Do you want anything more?’ They will say, ‘Have You not brightened our faces, admitted us to Paradise and saved us from Hell?’ Then the veil will be lifted and they will not have seen anything more dear to them than looking upon their Lord.";

  const handleReflect = async () => {
    if (!userInput.trim()) return;
    const userRef: Reflection = {
      id: Date.now().toString(),
      text: userInput,
      timestamp: Date.now(),
      type: 'user'
    };
    setReflections(prev => [...prev, userRef]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await getReflection(userInput);
      const aiRef: Reflection = {
        id: (Date.now() + 1).toString(),
        text: response,
        timestamp: Date.now(),
        type: 'ai'
      };
      setReflections(prev => [...prev, aiRef]);
    } catch (error) {
      console.error("Reflection Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (prompt: string) => {
    setIsGeneratingImg(true);
    try {
      const base64Img = await generateHeavenlyScene(prompt);
      if (base64Img) {
        setCurrentImage({
          url: base64Img,
          prompt,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error("Image Gen Error:", error);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const playAyahAudio = async (textToSpeak: string) => {
    if (audioPlaying) return;
    setAudioPlaying(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const base64Audio = await generateSpeech(textToSpeak);
      if (base64Audio) {
        const bytes = decodeBase64(base64Audio);
        const buffer = await decodeAudioData(bytes, audioContextRef.current, 24000, 1);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setAudioPlaying(false);
        source.start(0);
      } else {
        setAudioPlaying(false);
      }
    } catch (error) {
      console.error("Audio Error:", error);
      setAudioPlaying(false);
    }
  };

  return (
    <div className="min-h-screen ethereal-gradient pb-20">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-serif-elegant text-amber-900 tracking-widest mb-2 uppercase">
          Al-Husna
        </h1>
        <p className="text-sm font-light tracking-widest text-amber-700 uppercase">
          The Ultimate Reward & The Infinite Vision
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Core Text Section */}
        <section className="glass-morphism rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
          
          <div className="mb-10 text-center">
            <p className="font-arabic text-3xl md:text-4xl text-amber-900 leading-relaxed mb-6" dir="rtl">
              {ayahArabic}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-light italic mb-4">
              "{ayahEnglish}"
            </p>
            <div className="flex justify-center space-x-4">
              <span className="text-xs text-amber-600 uppercase tracking-tighter">Surah Yunus 10:26</span>
              <button 
                onClick={() => playAyahAudio(ayahEnglish)}
                disabled={audioPlaying}
                className="text-amber-600 hover:text-amber-800 transition-colors"
                title="Listen to Reflection"
              >
                {audioPlaying ? (
                  <span className="flex items-center gap-1">
                    <span className="animate-pulse w-2 h-2 bg-amber-400 rounded-full"></span>
                    Speaking...
                  </span>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-amber-100 pt-8">
            <p className="text-sm uppercase tracking-widest text-amber-700 font-semibold mb-4 text-center">The Prophet's Interpretation</p>
            <p className="text-gray-600 leading-relaxed text-center font-light">
              "{hadithText}"
            </p>
          </div>
        </section>

        {/* Visual Meditation Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif-elegant text-amber-900">Visual Meditation</h2>
              <p className="text-sm text-gray-500">Glimpses of promised gardens described in texts.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleGenerateImage("Crystal clear rivers flowing under lush green emerald trees with pearls as pebbles")}
                className="px-4 py-2 bg-white/50 border border-amber-100 rounded-full text-xs hover:bg-amber-50 transition-all text-amber-800"
              >
                Flowing Rivers
              </button>
              <button 
                onClick={() => handleGenerateImage("A vast field of saffron and musk with soft golden twilight and palaces made of gold and silver bricks")}
                className="px-4 py-2 bg-white/50 border border-amber-100 rounded-full text-xs hover:bg-amber-50 transition-all text-amber-800"
              >
                Golden Palaces
              </button>
            </div>
          </div>

          <div className="relative aspect-video rounded-3xl overflow-hidden glass-morphism shadow-xl border border-white/50 group">
            {currentImage ? (
              <img 
                src={currentImage.url} 
                alt={currentImage.prompt} 
                className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-12 text-center bg-white/20">
                <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-light">Select a theme to visualize the serenity of Paradise.</p>
              </div>
            )}
            
            {isGeneratingImg && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                <p className="text-amber-800 font-light italic animate-pulse">Bringing the vision to life...</p>
              </div>
            )}

            {currentImage && !isGeneratingImg && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/30 backdrop-blur-sm p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-amber-900 font-medium truncate">{currentImage.prompt}</p>
              </div>
            )}
          </div>
        </section>

        {/* Reflection Engine */}
        <section className="space-y-6 pb-12">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.827a1 1 0 00-.788 0l-7 3a1 1 0 000 1.846l7 3a1 1 0 00.788 0l7-3a1 1 0 000-1.846l-7-3zM3.108 8.1l6.892 2.954 6.892-2.954-6.892-2.954L3.108 8.1zM9 13.586l-4.707-4.707-1.414 1.414L9 16.414l8.121-8.121-1.414-1.414L9 13.586z" />
                </svg>
             </div>
             <h2 className="text-2xl font-serif-elegant text-amber-900">Deep Reflection</h2>
          </div>

          <div className="glass-morphism rounded-3xl min-h-[300px] flex flex-col p-6 shadow-inner bg-white/40">
            <div className="flex-1 space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {reflections.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm italic font-light">
                  Share your thoughts or ask about the "Even More" reward...
                </div>
              ) : (
                reflections.map((ref) => (
                  <div key={ref.id} className={`flex ${ref.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      ref.type === 'user' 
                        ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                        : 'bg-white text-gray-700 shadow-sm border border-gray-100'
                    }`}>
                      {ref.text}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <input 
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReflect()}
                placeholder="How does the idea of 'looking upon the Lord' move you?"
                className="w-full bg-white/80 border border-amber-100 rounded-full py-4 px-6 pr-16 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all text-gray-700"
              />
              <button 
                onClick={handleReflect}
                disabled={isLoading || !userInput.trim()}
                className="absolute right-2 top-2 bottom-2 bg-amber-600 text-white px-5 rounded-full hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 w-full py-4 text-center glass-morphism border-t border-amber-100 text-[10px] uppercase tracking-widest text-amber-800">
        May our faces be brightened on the day we meet our Lord.
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default App;
