import { useState } from 'react'
import { usePasteListener } from './hooks/usePasteListener';
import { ComposeModal } from './components/ComposeModal';
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

function App() {
  const [pastedImage, setPastedImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  usePasteListener((file) => {
    setPastedImage(file);
    setIsModalOpen(true);
  });

  return (
    <div>
      Cold Message Helper
      <div>
        Copy and paste a LinkedIn user's work history, and write what you want to message them about. Confirm that the extracted work history is correct, and then AI will draft a short message for you to review and send yourself.
      </div>

      {isModalOpen && pastedImage && (
        <ComposeModal image={pastedImage} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default App
