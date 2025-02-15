import mejiroFont from '../assets/fonts/Mejiro.ttf';

export function applyFontFace() {
  const style = document.createElement('style');
  style.innerHTML = `
    @font-face {
      font-family: 'Mejiro';
      src: url(${mejiroFont}) format('truetype');
    }

    body {
      font-family: 'Mejiro', sans-serif;
    }
  `;
  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style); // クリーンアップ処理
  };
}
