import React, { useState } from 'react';
import './animation.css';


const DamageNumber = ({ damage }) => {
  const [position, setPosition] = useState({
    transform: `translate(0px, 0px)`,
    opacity: 1,
  });

  React.useEffect(() => {
    // 첫 번째 프레임에 초기 상태 설정
    requestAnimationFrame(() => {
      // 두 번째 프레임에 최종 상태 설정
      requestAnimationFrame(() => {
        setPosition({
          transform: `translate(${damage.endX}px, ${damage.endY}px)`,
          opacity: 0,
        });
      });
    });
  }, [damage.endX, damage.endY]);

  return (
    <div
      className="damage-number"
      style={{
        top: `50%`,
        left: `50%`,       
        transform: `translate(${damage.startX}px, ${damage.startY}px)`, // 시작 위치 설정
        ...position,
        transition: 'transform 1s ease-out, opacity 1s ease-out', // 움직임과 사라짐 효과
      }}
    >
      -{damage.amount}
    </div>
  );
};

export default DamageNumber;
