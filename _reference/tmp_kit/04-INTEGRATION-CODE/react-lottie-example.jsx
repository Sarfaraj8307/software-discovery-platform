import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// npm i @lottiefiles/dotlottie-react
// Put JSON in /public/lottie/ or import as url

export function HeroLottie() {
  return (
    <DotLottieReact
      src="/lottie/computer-workspace.json"
      loop
      autoplay
      style={{ width: 480, height: 320 }}
    />
  );
}

// Alternative — classic lottie-react
// npm i lottie-react
// import Lottie from "lottie-react";
// import anim from "../02-ANIMATIONS/lottie/futuristic-dashboard.json";
// export default () => <Lottie animationData={anim} loop autoplay style={{height:320}} />

// Interactivity (hover to play):
// <DotLottieReact src="/lottie/comparison-animation.json" autoplay={false} hover />
