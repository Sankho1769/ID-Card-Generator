import confetti from 'canvas-confetti';

export function fireGoaConfetti(): void {
  // Brand colors: Yellow, Hot Pink, Green, White
  const colors = ['#FEE101', '#FF0080', '#0B6839', '#9AC95F', '#FFFDF5'];

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    ticks: 200,
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
  }, 250);
}
