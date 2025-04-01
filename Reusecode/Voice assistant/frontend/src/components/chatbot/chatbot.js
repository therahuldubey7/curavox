import { useState, useEffect } from 'react';
import './chatbot.css';

export default function Chatbot({
  sleepMode: sleepModeProp,
  onHover,
  onMouseUp,
  onMouseDown
}) {
  let sleepTimer;
  const [sleepMode, setSleepMode] = useState(sleepModeProp);
  const [isHovering, setIsHovering] = useState(false);

  // Put the bot to sleep after a timeout
  const sleep = () => {
    setSleepMode(true);
    clearTimeout(sleepTimer);
  };

  // Wake up the bot (cancel sleep and show open/active eyes)
  const wakeup = () => {
    onHover(true);
    setSleepMode(false);
  };

  // When mouse enters the bot, wake it up and show the "Hold to Speak" text
  const handleMouseEnter = () => {
    setIsHovering(true);
    wakeup();
  };

  // When mouse leaves the bot, hide the "Hold to Speak" text
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  useEffect(() => {
    setSleepMode(sleepModeProp);
    sleepTimer = setTimeout(sleep, 3000);
  }, [sleepModeProp]);

  useEffect(() => {
    return () => {
      if (sleepTimer) {
        clearTimeout(sleepTimer);
      }
    };
  }, []);

  return (
    <button
      type="button"
      style={{ position: 'fixed' }}
      id="ai-button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <div className={`chatbot2 ${sleepMode ? 'sleep' : ''}`} id="chatbot">
        <div className="outer-ring hover"></div>
        <div className="outer-ring"></div>

        <div className="eyes">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="46"
            height="42"
            viewBox="0 0 46 42"
            fill="none"
            className="eyes-"
          >
            <g filter="url(#filter0_d_5544_79743)" className="right-eye">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.1613 14C11.9035 14 11.6946 14.2089 11.6946 14.4667C11.6946 14.7244 11.9035 14.9333 12.1613 14.9333H15.988C16.2457 14.9333 16.4546 14.7244 16.4546 14.4667C16.4546 14.2089 16.2457 14 15.988 14H12.1613ZM10.2475 15.8671C9.73209 15.8671 9.31423 16.2849 9.31423 16.8004C9.31423 17.3158 9.73209 17.7337 10.2475 17.7337H17.9009C18.4164 17.7337 18.8342 17.3158 18.8342 16.8004C18.8342 16.2849 18.4164 15.8671 17.9009 15.8671H10.2475ZM8.125 19.5998C8.125 19.0844 8.54286 18.6665 9.05832 18.6665H19.0917C19.6071 18.6665 20.025 19.0844 20.025 19.5998C20.025 20.1153 19.6071 20.5331 19.0917 20.5331H9.05832C8.54286 20.5331 8.125 20.1153 8.125 19.5998ZM9.05832 21.4666C8.54286 21.4666 8.125 21.8844 8.125 22.3999C8.125 22.9153 8.54286 23.3332 9.05832 23.3332H19.0917C19.6071 23.3332 20.025 22.9153 20.025 22.3999C20.025 21.8844 19.6071 21.4666 19.0917 21.4666H9.05832ZM9.31423 25.2001C9.31423 24.6846 9.73209 24.2667 10.2475 24.2667H17.9009C18.4164 24.2667 18.8342 24.6846 18.8342 25.2001C18.8342 25.7155 18.4164 26.1334 17.9009 26.1334H10.2475C9.73209 26.1334 9.31423 25.7155 9.31423 25.2001ZM12.1613 27.0669C11.9035 27.0669 11.6946 27.2758 11.6946 27.5336C11.6946 27.7913 11.9035 28.0002 12.1613 28.0002H15.988C16.2457 28.0002 16.4546 27.7913 16.4546 27.5336C16.4546 27.2758 16.2457 27.0669 15.988 27.0669H12.1613Z"
                fill="#62FFEE"
              />
            </g>
            <g filter="url(#filter1_d_5544_79743)" className="left-eye">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M30.0113 14C29.7535 14 29.5446 14.2089 29.5446 14.4667C29.5446 14.7244 29.7535 14.9333 30.0113 14.9333H33.838C34.0957 14.9333 34.3046 14.7244 34.3046 14.4667C34.3046 14.2089 34.0957 14 33.838 14H30.0113ZM28.0975 15.8671C27.5821 15.8671 27.1642 16.2849 27.1642 16.8004C27.1642 17.3158 27.5821 17.7337 28.0975 17.7337H35.7509C36.2664 17.7337 36.6842 17.3158 36.6842 16.8004C36.6842 16.2849 36.2664 15.8671 35.7509 15.8671H28.0975ZM25.975 19.5998C25.975 19.0844 26.3929 18.6665 26.9083 18.6665H36.9417C37.4571 18.6665 37.875 19.0844 37.875 19.5998C37.875 20.1153 37.4571 20.5331 36.9417 20.5331H26.9083C26.3929 20.5331 25.975 20.1153 25.975 19.5998ZM26.9083 21.4666C26.3929 21.4666 25.975 21.8844 25.975 22.3999C25.975 22.9153 26.3929 23.3332 26.9083 23.3332H36.9417C37.4571 23.3332 37.875 22.9153 37.875 22.3999C37.875 21.8844 37.4571 21.4666 36.9417 21.4666H26.9083ZM27.1642 25.2001C27.1642 24.6846 27.5821 24.2667 28.0975 24.2667H35.7509C36.2664 24.2667 36.6842 24.6846 36.6842 25.2001C36.6842 25.7155 36.2664 26.1334 35.7509 26.1334H28.0975C27.5821 26.1334 27.1642 25.7155 27.1642 25.2001ZM30.0113 27.0669C29.7535 27.0669 29.5446 27.2758 29.5446 27.5336C29.5446 27.7913 29.7535 28.0002 30.0113 28.0002H33.838C34.0957 28.0002 34.3046 27.7913 34.3046 27.5336C34.3046 27.2758 34.0957 27.0669 33.838 27.0669H30.0113Z"
                fill="#62FFEE"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_5544_79743"
                x="0.125"
                y="6"
                width="27.9"
                height="30.0002"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.384314 0 0 0 0 1 0 0 0 0 0.933333 0 0 0 0.45 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_5544_79743"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_5544_79743"
                  result="shape"
                />
              </filter>
              <filter
                id="filter1_d_5544_79743"
                x="17.975"
                y="6"
                width="27.9"
                height="30.0002"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.384314 0 0 0 0 1 0 0 0 0 0.933333 0 0 0 0.45 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_5544_79743"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_5544_79743"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>

        <div className="eyes hover">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="49"
            height="48"
            viewBox="0 0 49 48"
            fill="none"
          >
            <g filter="url(#filter0_d_5544_79851)">
              <rect
                x="8.5"
                y="16"
                width="13"
                height="16"
                rx="6"
                fill="#62FFEE"
              />
            </g>
            <g filter="url(#filter1_d_5544_79851)">
              <rect
                x="27.5"
                y="16"
                width="13"
                height="16"
                rx="6"
                fill="#62FFEE"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_5544_79851"
                x="0.5"
                y="8"
                width="29"
                height="32"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.384314 0 0 0 0 1 0 0 0 0 0.933333 0 0 0 0.45 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_5544_79851"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_5544_79851"
                  result="shape"
                />
              </filter>
              <filter
                id="filter1_d_5544_79851"
                x="19.5"
                y="8"
                width="29"
                height="32"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.384314 0 0 0 0 1 0 0 0 0 0.933333 0 0 0 0.45 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_5544_79851"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_5544_79851"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>

        <div className="eyes asleep">
          {/* Sleepy Eyes */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="eyes-asleep"
          >
            <g filter="url(#filter0_d_10502_93260)">
              <path
                d="M8.00932 26.2974C7.98031 25.8363 8.33094 25.4462 8.79249 25.4261L20.7494 24.9042C21.211 24.8841 21.6087 25.2415 21.6377 25.7026C21.6667 26.1637 21.3161 26.5538 20.8545 26.5739L8.89757 27.0958C8.43602 27.1159 8.03834 26.7585 8.00932 26.2974Z"
                fill="#AEDDD8"
              />
            </g>
            <g filter="url(#filter1_d_10502_93260)">
              <path
                d="M26.3623 25.7027C26.3913 25.2416 26.789 24.8841 27.2505 24.9043L39.2075 25.4261C39.669 25.4463 40.0196 25.8364 39.9906 26.2974C39.9616 26.7585 39.5639 27.116 39.1024 27.0958L27.1454 26.574C26.6839 26.5538 26.3333 26.1637 26.3623 25.7027Z"
                fill="#AEDDD8"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_10502_93260"
                x="0.00762939"
                y="16.9034"
                width="29.6317"
                height="18.1931"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.384314 0 0 0 0 1 0 0 0 0 0.933333 0 0 0 0.45 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_10502_93260"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_10502_93260"
                  result="shape"
                />
              </filter>
              <filter
                id="filter1_d_10502_93260"
                x="18.3606"
                y="16.9034"
                width="29.6317"
                height="18.1932"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="4" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.384314 0 0 0 0 1 0 0 0 0 0.933333 0 0 0 0.45 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_10502_93260"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_10502_93260"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

      {/* Show the text "Hold to Speak" when hovering over the bot */}
      {isHovering && (
        <div className="hold-to-speak">
          Hold to Speak !
        </div>
      )}
    </button>
  );
}
