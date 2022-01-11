import * as styles from "./timer.scss";

const { Icon, IconType } = KalturaPlayer.ui.components;

const Timer = ({ seconds }: { seconds: number }) => {
  return (
    <div className={styles.timer}>
      <style>{`

      `}</style>
      <svg width="60" height="60">
        <circle
          className={styles.circle}
          r="28"
          cy="30"
          cx="30"
          style={{
            "animation-duration": `${seconds}s`
          }}
        />
      </svg>
      <Icon type={IconType.Play} />
    </div>
  );
};

export { Timer };
