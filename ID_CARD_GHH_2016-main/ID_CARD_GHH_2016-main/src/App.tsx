import { useEffect } from 'react';
import { useBuilderStore } from './store/builderStore';
import { preloadAllAssets } from './canvas/assetLoader';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingStickers } from './components/layout/FloatingStickers';
import { Toast } from './components/ui/Toast';
import { Home } from './pages/Home';
import { Create } from './pages/Create';
import { Result } from './pages/Result';
import { CrewStudio } from './components/crew/CrewStudio';

export function App() {
  const activeStep = useBuilderStore((state) => state.activeStep);

  useEffect(() => {
    // Preload brand assets in background on app launch
    preloadAllAssets().catch((err) => console.warn('Preload assets error:', err));
  }, []);

  const renderActivePage = () => {
    switch (activeStep) {
      case 'landing':
        return <Home />;
      case 'builder':
        return <Create />;
      case 'result':
        return <Result />;
      case 'crew':
      case 'crew-result':
        return <CrewStudio />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#032011] text-[#FFFDF5] selection:bg-[#FF0080] selection:text-white relative overflow-x-hidden font-body">
      <FloatingStickers />
      <Header />

      <main className="relative z-10 flex-1">
        {renderActivePage()}
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

export default App;
