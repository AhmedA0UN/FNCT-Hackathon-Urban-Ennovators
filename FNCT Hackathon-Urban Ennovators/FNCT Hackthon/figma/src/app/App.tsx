import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Link } from 'react-router';
import { Monitor, Smartphone, Truck } from 'lucide-react';

// Landing page to select interface
function LandingPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: '#0D0F12' }}
    >
      <div className="w-full max-w-4xl">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#00E5A0' }}>
              <Truck className="w-12 h-12 text-[#0D0F12]" />
            </div>
          </div>
          <h1 className="text-5xl mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#F0F2F5' }}>
            SmartWaste
          </h1>
          <p className="text-xl" style={{ color: '#7A8494' }}>
            Système de Gestion Intelligente de Collecte des Déchets Urbains
          </p>
        </div>

        {/* Interface Selection */}
        <div className="grid grid-cols-2 gap-6">
          <Link
            to="/"
            className="group p-8 rounded-2xl transition-all"
            style={{ 
              backgroundColor: '#1C2030',
              border: '1px solid #2A3040'
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all"
                style={{ backgroundColor: 'rgba(77, 158, 255, 0.15)' }}
              >
                <Monitor className="w-8 h-8" style={{ color: '#4D9EFF' }} />
              </div>
              <h2 className="text-2xl mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#F0F2F5' }}>
                Dashboard Superviseur
              </h2>
              <p className="text-sm mb-4" style={{ color: '#7A8494' }}>
                Interface desktop 1440px
              </p>
              <div className="text-xs" style={{ color: '#4A5568' }}>
                Gestion de flotte • Analytics • Routes optimisées
              </div>
            </div>
          </Link>

          <Link
            to="/driver"
            className="group p-8 rounded-2xl transition-all"
            style={{ 
              backgroundColor: '#1C2030',
              border: '1px solid #2A3040'
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all"
                style={{ backgroundColor: 'rgba(0, 229, 160, 0.15)' }}
              >
                <Smartphone className="w-8 h-8" style={{ color: '#00E5A0' }} />
              </div>
              <h2 className="text-2xl mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#F0F2F5' }}>
                App Chauffeur
              </h2>
              <p className="text-sm mb-4" style={{ color: '#7A8494' }}>
                Tablet Android 10" — 1280x800px
              </p>
              <div className="text-xs" style={{ color: '#4A5568' }}>
                Navigation temps réel • Collecte • Signalement
              </div>
            </div>
          </Link>
        </div>

        {/* Info */}
        <div className="mt-12 text-center">
          <div 
            className="inline-block px-6 py-3 rounded-lg"
            style={{ backgroundColor: '#1C2030', border: '1px solid #2A3040' }}
          >
            <p className="text-sm" style={{ color: '#7A8494' }}>
              🎨 Design System: Operational Dark • IoT Fleet Management
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Show landing page if at root
  if (window.location.pathname === '/landing') {
    return (
      <div className="min-h-screen" style={{ 
        backgroundColor: '#0D0F12',
        fontFamily: "'DM Sans', sans-serif",
        color: '#F0F2F5'
      }}>
        <LandingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: '#0D0F12',
      fontFamily: "'DM Sans', sans-serif",
      color: '#F0F2F5'
    }}>
      <RouterProvider router={router} />
      
      {/* Quick Nav Helper */}
      <div className="fixed bottom-4 right-4 z-50">
        <div 
          className="px-4 py-2 rounded-lg text-xs space-x-2"
          style={{ 
            backgroundColor: 'rgba(28, 32, 48, 0.95)',
            border: '1px solid #2A3040',
            backdropFilter: 'blur(8px)'
          }}
        >
          <span style={{ color: '#7A8494' }}>Vues:</span>
          <a href="/" style={{ color: '#4D9EFF' }}>Superviseur</a>
          <span style={{ color: '#4A5568' }}>|</span>
          <a href="/driver" style={{ color: '#00E5A0' }}>Chauffeur</a>
        </div>
      </div>
    </div>
  );
}

export default App;
