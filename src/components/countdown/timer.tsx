import * as styles from "./timer.scss";

const { Icon, IconType } = KalturaPlayer.ui.components;

const Timer = ({ seconds }: { seconds: number }) => {
  const circumferance = Math.round(56 * Math.PI);
  return (
    <div className={styles.timer}>
      <style>{`
          svg {
            background-color: transparent;
            position: absolute;
            background-color: transparent;
            transform: rotateZ(-90deg);
          }

          .circle {
            animation-name: circletimer;
            animation-timing-function: linear;
            fill: transparent;
            left: 0;
            position: absolute;
            stroke-dasharray: 0;
            stroke-width: 4;
            stroke: #006efa;
          }

        @keyframes circletimer {
            0% {
                stroke-dashoffset: ${circumferance};
                stroke-dasharray: ${circumferance};
            }
            100% {
                stroke-dashoffset: 0;
                stroke-dasharray: ${circumferance};
            }
        }
      `}</style>
      <svg width="60" height="60">
        <circle
          //   className={styles.circle}
          //   className="circle"
          r="28"
          cy="30"
          cx="30"
          style={{
            "animation-duration": `${seconds}s`,
            "stroke-dashoffset": circumferance,
            "stroke-dasharray": 0
          }}
        />
      </svg>
      <Icon type={IconType.Play} />
    </div>
  );
};

export default Timer;
